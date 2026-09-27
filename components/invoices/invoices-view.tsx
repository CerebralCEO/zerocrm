"use client";

import { ArrowUpRight, CalendarClock, CircleAlert, HandCoins, Hourglass, Plus } from "lucide-react";
import { OWNERS, ownerById } from "@/lib/data";
import { TODAY, useDeals } from "@/lib/deals-store";
import { useInvoices } from "@/lib/invoices-store";
import { AGING, STATUS_META, daysBetween, dueDate, overdueDays, statusOf, totalOf, type Invoice, type InvoiceStatus } from "@/lib/invoices";
import { PERIODS } from "@/lib/forecast";
import { paletteOf, templateById } from "@/lib/invoice-templates";
import { useCrm } from "@/lib/store";
import { cn, formatCompactCurrency, formatNumber, formatShortDate } from "@/lib/utils";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { Tag } from "@/components/primitives/tag";
import { Panel } from "@/components/forecast/panel";
import { useInvoicesData } from "./use-invoices-data";
import { ScaledDocument, useDocData } from "./invoice-document";

const STATUSES: (InvoiceStatus | "all")[] = ["all", "draft", "sent", "viewed", "overdue", "paid"];
const isOpen = (i: Invoice) => ["sent", "viewed", "overdue"].includes(statusOf(i));

export function InvoicesToolbar() {
  const { statusFilter, ownerFilter, setStatusFilter, setOwnerFilter, setPickerOpen } = useInvoices();
  const companies = useCrm((s) => s.companies);
  const { list } = useInvoicesData();

  const exportCsv = () =>
    downloadCsv(
      "invoices.csv",
      ["Invoice", "Company", "Owner", "Issued", "Due", "Status", "Amount", "Paid on", "Template"],
      list.map((i) => [
        i.number,
        companies.find((c) => c.id === i.companyId)?.name ?? i.companyId,
        ownerById(i.ownerId).name,
        i.issueDate,
        dueDate(i),
        STATUS_META[statusOf(i)].label,
        totalOf(i),
        i.paidDate ?? "",
        templateById(i.templateId).name,
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!ownerFilter) + Number(statusFilter !== "all")}
      filters={
        <>
          <FilterChip label="Status" value={statusFilter === "all" ? "All" : STATUS_META[statusFilter].label}>
            {STATUSES.map((s) => (
              <MenuItem key={s} selected={statusFilter === s} onSelect={() => setStatusFilter(s)}>
                {s === "all" ? "All" : STATUS_META[s].label}
              </MenuItem>
            ))}
          </FilterChip>
          <FilterChip label="Owner" value={ownerFilter ? ownerById(ownerFilter).name : "Whole Team"}>
            <MenuItem selected={!ownerFilter} onSelect={() => setOwnerFilter(null)}>
              Whole Team
            </MenuItem>
            <MenuSeparator />
            <div className="max-h-[280px] overflow-y-auto">
              {OWNERS.map((o) => (
                <MenuItem key={o.id} selected={ownerFilter === o.id} onSelect={() => setOwnerFilter(o.id)}>
                  <Avatar name={o.name} size={18} />
                  {o.name}
                </MenuItem>
              ))}
            </div>
          </FilterChip>
        </>
      }
      actions={
        <>
          <ExportButton onClick={exportCsv} />
          <PrimaryAction label="New Invoice" onClick={() => setPickerOpen(true)} />
        </>
      }
    />
  );
}

export function InvoicesView() {
  const { all, list, ready } = useInvoicesData();
  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <InvoicesSummary all={all} />
      <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-line lg:border-r">
          <Aging all={all} />
        </div>
        <div className="min-w-0 border-line max-lg:border-t">
          <ReadyToInvoice ready={ready} />
        </div>
      </div>
      <InvoiceList list={list} />
    </div>
  );
}

function InvoicesSummary({ all }: { all: Invoice[] }) {
  const open = all.filter(isOpen);
  const overdue = all.filter((i) => statusOf(i) === "overdue");
  const fq3 = PERIODS[0];
  const paidQ = all.filter((i) => i.status === "paid" && i.paidDate && i.paidDate >= fq3.start && i.paidDate <= fq3.end);
  const paid = all.filter((i) => i.status === "paid" && i.paidDate);
  const dso = paid.length ? Math.round(paid.reduce((n, i) => n + daysBetween(i.issueDate, i.paidDate!), 0) / paid.length) : 0;
  const sum = (xs: Invoice[]) => xs.reduce((n, i) => n + totalOf(i), 0);
  const oldest = Math.max(0, ...overdue.map(overdueDays));

  return (
    <KpiStrip>
      <KpiCell
        icon={Hourglass}
        label="Outstanding"
        value={sum(open)}
        meta={
          <>
            <span className="text-fg-soft">{open.length} open</span> · {formatCompactCurrency(sum(overdue))} past due
          </>
        }
      />
      <KpiCell
        icon={CircleAlert}
        label="Overdue"
        value={sum(overdue)}
        meta={
          overdue.length ? (
            <>
              <span className="text-danger-dot">{overdue.length} invoices</span> · oldest {oldest}d late
            </>
          ) : (
            "Nothing overdue"
          )
        }
      />
      <KpiCell
        icon={HandCoins}
        label="Collected this quarter"
        value={sum(paidQ)}
        meta={
          <>
            <span className="text-meter-green">{paidQ.length} paid</span> · {fq3.label}
          </>
        }
      />
      <KpiCell
        icon={CalendarClock}
        label="Avg days to pay"
        value={dso}
        currency={false}
        suffix="d"
        meta={
          <>
            <span className={dso <= 30 ? "text-meter-green" : "text-meter-amber"}>{dso <= 30 ? "Within" : "Beyond"} Net 30</span> · {paid.length} paid invoices
          </>
        }
      />
    </KpiStrip>
  );
}

const AGING_COLOR: Record<(typeof AGING)[number]["tone"], string> = {
  green: "var(--color-meter-green)",
  amber: "var(--color-meter-amber)",
  orange: "#fed7aa",
  red: "var(--color-meter-red)",
};

/** Open receivables by how late they are. */
function Aging({ all }: { all: Invoice[] }) {
  const open = all.filter(isOpen);
  const rows = AGING.map((b) => {
    const xs = open.filter((i) => {
      const late = daysBetween(dueDate(i), TODAY);
      return late >= b.min && late <= b.max;
    });
    return { ...b, count: xs.length, value: xs.reduce((n, i) => n + totalOf(i), 0) };
  });
  const total = rows.reduce((n, r) => n + r.value, 0);

  return (
    <Panel
      title="Receivables aging"
      subtitle={
        <>
          <span className="text-fg-soft tabular-nums">${formatNumber(total)}</span> open across {open.length} invoices
        </>
      }
    >
      <div className="mt-5 flex h-[10px] gap-[2px] overflow-hidden rounded-[2px] bg-meter-track">
        {rows.map((r, i) =>
          r.value ? (
            <span
              key={r.id}
              className="h-full origin-left animate-grow-x transition-[width] duration-700 ease-(--ease-ios)"
              style={{ width: `${(r.value / Math.max(total, 1)) * 100}%`, background: AGING_COLOR[r.tone], animationDelay: `${i * 80}ms` }}
            />
          ) : null,
        )}
      </div>
      <ul className="mt-4 flex flex-col">
        {rows.map((r) => (
          <li key={r.id} className="flex h-[43px] items-center gap-3 border-b border-line last:border-b-0">
            <span className="size-2 shrink-0 rounded-full" style={{ background: AGING_COLOR[r.tone] }} />
            <span className="flex min-w-0 flex-1 items-baseline gap-2">
              <span className="text-[14px] leading-none font-medium text-fg">{r.label}</span>
              <span className="truncate text-[12px] leading-none text-fg-muted">
                {r.count} {r.count === 1 ? "invoice" : "invoices"}
                {r.id === "current" ? " · not yet due" : " past due"}
              </span>
            </span>
            <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
              <span className="mr-[4px] text-[#7f7f7f]">$</span>
              {formatNumber(r.value)}
            </span>
            <span className="w-10 text-right text-[12px] leading-none text-fg-muted tabular-nums">
              {total ? Math.round((r.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Closed Won deals without an invoice — the source of every new invoice. */
function ReadyToInvoice({ ready }: { ready: ReturnType<typeof useInvoicesData>["ready"] }) {
  const createFromDeal = useInvoices((s) => s.createFromDeal);
  const companies = useCrm((s) => s.companies);
  return (
    <Panel
      title="Ready to invoice"
      subtitle={
        ready.length ? (
          <>
            {ready.length} Closed Won {ready.length === 1 ? "deal" : "deals"} ·{" "}
            <span className="text-fg-soft tabular-nums">${formatNumber(ready.reduce((n, d) => n + d.value, 0))}</span> to bill
          </>
        ) : (
          "Every Closed Won deal has an invoice"
        )
      }
    >
      <div className="mt-3 flex flex-col">
        {ready.map((d) => {
          const company = companies.find((c) => c.id === d.companyId);
          return (
            <div key={d.id} className="flex min-h-[52px] items-center gap-3 border-b border-line last:border-b-0">
              <CompanyLogo id={d.companyId} src={company?.logo} size={24} glyph={12} radius={6} />
              <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <span className="truncate text-[14px] leading-none font-medium text-fg">{company?.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-soft/80">
                  {d.title} · won {formatShortDate(d.closeDate)}
                </span>
              </span>
              <span className="text-[14px] leading-none font-[450] text-fg tabular-nums max-sm:hidden">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(d.value)}
              </span>
              <button
                type="button"
                onClick={() => createFromDeal(d.id)}
                className="flex h-[30px] shrink-0 items-center gap-[5px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[10px] pl-[8px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
              >
                <Plus className="size-[12px]" strokeWidth={2} />
                Invoice
              </button>
            </div>
          );
        })}
        {!ready.length && <p className="py-10 text-center text-[13px] text-fg-muted">New Closed Won deals will appear here.</p>}
      </div>
      <DefaultTemplate />
    </Panel>
  );
}

function InvoiceList({ list }: { list: Invoice[] }) {
  const openInvoice = useInvoices((s) => s.openInvoice);
  const lastCreatedId = useInvoices((s) => s.lastCreatedId);
  const companies = useCrm((s) => s.companies);
  const deals = useDeals((s) => s.deals);
  const total = list.reduce((n, i) => n + totalOf(i), 0);

  return (
    <Panel
      title="Invoices"
      subtitle={
        <>
          {list.length} {list.length === 1 ? "invoice" : "invoices"} · <span className="text-fg-soft tabular-nums">${formatNumber(total)}</span>
        </>
      }
    >
      <div className="mt-3 flex flex-col">
        <div className="hidden h-8 items-center gap-3 border-b border-line text-[12px] leading-none text-fg-muted md:flex">
          <span className="w-[118px] shrink-0">Invoice</span>
          <span className="w-[190px] shrink-0">Account</span>
          <span className="min-w-0 flex-1 max-xl:hidden">Deal</span>
          <span className="w-[74px] shrink-0 max-lg:hidden">Issued</span>
          <span className="w-[92px] shrink-0">Due</span>
          <span className="w-[112px] shrink-0 text-right">Amount</span>
          <span className="w-[84px] shrink-0">Status</span>
          <span className="w-[98px] shrink-0 max-lg:hidden">Template</span>
          <span className="w-5 shrink-0 max-lg:hidden" />
        </div>
        {list.map((i) => {
          const company = companies.find((c) => c.id === i.companyId);
          const status = statusOf(i);
          const late = overdueDays(i);
          const tpl = templateById(i.templateId);
          const p = paletteOf(tpl);
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => openInvoice(i.id)}
              className={cn(
                "no-press group -mx-2 flex min-h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover max-md:py-[10px]",
                lastCreatedId === i.id && "animate-row-in",
              )}
            >
              <span className="hidden w-[118px] shrink-0 font-mono text-[12px] text-fg-soft md:block">{i.number}</span>
              <span className="flex w-[190px] shrink-0 items-center gap-2 max-md:w-auto max-md:min-w-0 max-md:flex-1">
                <CompanyLogo id={i.companyId} src={company?.logo} size={20} glyph={11} radius={5} />
                <span className="flex min-w-0 flex-col gap-[6px]">
                  <span className="truncate font-medium">{company?.name}</span>
                  <span className="truncate font-mono text-[11px] text-fg-muted md:hidden">
                    {i.number} · due {formatShortDate(dueDate(i))}
                  </span>
                </span>
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-[12px] text-fg-soft/80 xl:block">{deals.find((x) => x.id === i.dealId)?.title}</span>
              <span className="hidden w-[74px] shrink-0 text-[12px] text-fg-muted lg:block">{formatShortDate(i.issueDate)}</span>
              <span className={cn("hidden w-[92px] shrink-0 text-[12px] md:block", late ? "text-danger-dot" : "text-fg-muted")}>
                {formatShortDate(dueDate(i))}
                {late > 0 && <span className="ml-[5px] tabular-nums">+{late}d</span>}
              </span>
              <span className="w-[112px] shrink-0 text-right tabular-nums max-md:w-auto">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(totalOf(i))}
              </span>
              <span className="w-[84px] shrink-0 max-sm:w-auto">
                <Tag tone={STATUS_META[status].tone} className="max-sm:h-5 max-sm:px-[6px] max-sm:text-[12px]">
                  {STATUS_META[status].label}
                </Tag>
              </span>
              <span className="hidden w-[98px] shrink-0 items-center gap-[7px] text-[12px] text-fg-soft lg:flex">
                <span className="flex overflow-hidden rounded-[3px]" style={{ boxShadow: "0 0 0 1px #393939" }}>
                  <span className="h-[14px] w-[8px]" style={{ background: p.bg }} />
                  <span className="h-[14px] w-[8px]" style={{ background: p.accent }} />
                </span>
                <span className="truncate">{tpl.name}</span>
              </span>
              <span className="hidden w-5 shrink-0 lg:block">
                <Avatar name={ownerById(i.ownerId).name} size={20} />
              </span>
            </button>
          );
        })}
        {!list.length && <p className="py-12 text-center text-[13px] text-fg-muted">No invoices match these filters.</p>}
      </div>
      <p className="mt-4 flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
        <ArrowUpRight className="size-[12px]" strokeWidth={2} />
        Open an invoice to switch templates, edit lines or download a PDF.
      </p>
    </Panel>
  );
}

const SHOWCASE = ["graphite", "paper", "midnight", "ivory-editorial", "carbon-lime", "mint-banner"];

/** The template new invoices start from — six picks shown with a real invoice; the studio has all of them. */
function DefaultTemplate() {
  const invoices = useInvoices((s) => s.invoices);
  const defaultTemplate = useInvoices((s) => s.defaultTemplate);
  const d = useDocData(invoices.find((i) => i.status !== "draft") ?? invoices[0]);
  const picks = SHOWCASE.includes(defaultTemplate) ? SHOWCASE : [defaultTemplate, ...SHOWCASE.slice(0, 5)];
  if (!d) return null;
  return (
    <div className="mt-5 border-t border-line pt-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] leading-none font-medium text-fg-soft">Default template</span>
        <span className="text-[12px] leading-none text-fg-muted">
          {templateById(defaultTemplate).name} · 34 in the studio
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {picks.map((id, i) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === defaultTemplate}
            onClick={() => useInvoices.setState({ defaultTemplate: id })}
            className="flex min-w-0 animate-fade-in flex-col gap-[7px]"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <span
              className={cn(
                "block rounded-[7px] p-[2px] transition-[box-shadow] duration-200",
                id === defaultTemplate ? "shadow-[0_0_0_2px_#fafafa]" : "shadow-[0_0_0_1px_#2d2f31] hover:shadow-[0_0_0_1px_#55585c]",
              )}
            >
              <ScaledDocument d={d} templateId={id} className="pointer-events-none" />
            </span>
            <span className="truncate text-center text-[11px] leading-none text-fg-muted">{templateById(id).name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
