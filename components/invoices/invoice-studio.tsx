"use client";

import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog } from "radix-ui";
import { Check, Download, Plus, Send, Trash2, X } from "lucide-react";
import { useInvoices } from "@/lib/invoices-store";
import { STATUS_META, TERMS, statusOf, subtotalOf, taxOf, totalOf, type Invoice } from "@/lib/invoices";
import { TEMPLATES, paletteOf, templateById } from "@/lib/invoice-templates";
import { useCrm } from "@/lib/store";
import { cn, formatNumber } from "@/lib/utils";
import { Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Segmented } from "@/components/ui/segmented";
import { Tag } from "@/components/primitives/tag";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { InvoiceDocument, PAGE_H, PAGE_W, ScaledDocument, useDocData } from "./invoice-document";
import type { DocData } from "./doc-parts";

type Tab = "templates" | "details";
type ToneFilter = "all" | "dark" | "light";

/** Measures both sides of the preview stage so the page fits inside it. */
function useBox() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return { ref: setEl, ...box };
}

/**
 * Full-screen invoice studio: the live page on the left, template gallery and
 * editable details on the right. Download prints only the page (A4, no
 * margins) through a body-level portal.
 */
export function InvoiceStudio() {
  const openId = useInvoices((s) => s.openId);
  const invoice = useInvoices((s) => s.invoices.find((i) => i.id === s.openId));
  const openInvoice = useInvoices((s) => s.openInvoice);
  const d = useDocData(invoice);

  return (
    <Dialog.Root open={!!openId} onOpenChange={(o) => !o && openInvoice(null)}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-app outline-none data-[state=closed]:animate-sheet-down data-[state=open]:animate-sheet-up md:data-[state=closed]:animate-pop-out md:data-[state=open]:animate-pop-in"
        >
          {invoice && d ? <Studio invoice={invoice} d={d} /> : <Dialog.Title className="sr-only">Invoice</Dialog.Title>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Studio({ invoice, d }: { invoice: Invoice; d: DocData }) {
  const [tab, setTab] = useState<Tab>("templates");
  const companies = useCrm((s) => s.companies);
  const { send, markPaid } = useInvoices();
  const company = companies.find((c) => c.id === invoice.companyId);
  const status = statusOf(invoice);
  const { ref: stageRef, w: stageW, h: stageH } = useBox();
  const fit = stageW && stageH ? Math.min((stageW - 64) / PAGE_W, (stageH - 64) / PAGE_H, 1) : 0;

  const download = () => {
    const title = document.title;
    document.title = `${invoice.number} · ${d.company}`;
    window.print();
    document.title = title;
  };

  return (
    <>
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line-strong pr-3 pl-3 sm:pr-4 sm:pl-4">
        <div className="flex min-w-0 items-center gap-3">
          <Dialog.Close
            aria-label="Close"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-fg transition-colors hover:bg-white/[0.06]"
          >
            <X className="size-[15px]" strokeWidth={2} />
          </Dialog.Close>
          <span className="max-sm:hidden">
            <CompanyLogo id={invoice.companyId} src={company?.logo} size={24} glyph={12} radius={6} />
          </span>
          <div className="flex min-w-0 flex-col gap-[5px]">
            <Dialog.Title className="flex items-center gap-2 text-[14px] leading-none font-medium text-fg">
              <span className="truncate">{invoice.number}</span>
              <Tag tone={STATUS_META[status].tone} className="h-5 px-[6px] text-[12px]">
                {STATUS_META[status].label}
              </Tag>
            </Dialog.Title>
            <span className="truncate text-[12px] leading-none text-fg-muted">
              {d.company} · {d.deal}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-[6px]">
          <Button onClick={download} className="pr-[10px] pl-[9px]">
            <Download className="size-[12px]" strokeWidth={2} />
            <span className="max-sm:hidden">Download PDF</span>
          </Button>
          {status === "draft" ? (
            <Button variant="primary" onClick={() => send(invoice.id)} className="pr-[10px] pl-[9px]">
              <Send className="size-[12px]" strokeWidth={2} />
              Send Invoice
            </Button>
          ) : status !== "paid" ? (
            <Button variant="primary" onClick={() => markPaid(invoice.id)} className="pr-[10px] pl-[9px]">
              <Check className="size-[12px]" strokeWidth={2} />
              Mark as Paid
            </Button>
          ) : (
            <Dialog.Close asChild>
              <Button variant="primary">Done</Button>
            </Dialog.Close>
          )}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 max-lg:overflow-y-auto lg:grid-cols-[minmax(0,1fr)_424px]">
        {/* Stage */}
        <div ref={stageRef} className="relative flex items-center justify-center border-line max-lg:h-[62dvh] max-lg:border-b lg:border-r">
          {fit > 0 && (
            <div key={invoice.templateId} className="animate-fade-in" style={{ width: PAGE_W * fit }}>
              <ScaledDocument d={d} templateId={invoice.templateId} shadow />
            </div>
          )}
          <span className="absolute bottom-3 left-4 text-[11px] leading-none text-fg-muted">
            {templateById(invoice.templateId).name} · A4
          </span>
        </div>

        {/* Controls */}
        <div className="flex min-h-0 flex-col lg:overflow-hidden">
          <div className="shrink-0 px-4 pt-4 pb-3">
            <Segmented<Tab>
              label="Studio panel"
              value={tab}
              onChange={setTab}
              options={[
                { value: "templates", label: `Templates · ${TEMPLATES.length}` },
                { value: "details", label: "Details" },
              ]}
            />
          </div>
          <div className="table-scroll min-h-0 flex-1 px-4 pb-6 lg:overflow-y-auto lg:overscroll-contain">
            {tab === "templates" ? <TemplateGallery invoice={invoice} d={d} /> : <DetailsForm invoice={invoice} />}
          </div>
        </div>
      </div>

      {/* Print copy: body-level so no transformed ancestor can offset it */}
      {createPortal(
        <div id="invoice-print">
          <InvoiceDocument d={d} template={templateById(invoice.templateId)} />
        </div>,
        document.body,
      )}
    </>
  );
}

function TemplateGallery({ invoice, d }: { invoice: Invoice; d: DocData }) {
  const setTemplate = useInvoices((s) => s.setTemplate);
  const [tone, setTone] = useState<ToneFilter>("all");
  const list = TEMPLATES.filter((t) => tone === "all" || t.tone === tone);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12px] leading-none text-fg-muted">
          {list.length} templates · solid colour, print-ready
        </span>
        <Segmented<ToneFilter>
          label="Template tone"
          value={tone}
          onChange={setTone}
          className="w-[190px]"
          options={[
            { value: "all", label: "All" },
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 max-lg:sm:grid-cols-3">
        {list.map((t, i) => {
          const on = invoice.templateId === t.id;
          const p = paletteOf(t);
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setTemplate(invoice.id, t.id)}
              className="group flex min-w-0 animate-fade-in flex-col gap-[9px] text-left"
              style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
            >
              <span
                className={cn(
                  "block rounded-[9px] p-[3px] transition-[box-shadow] duration-200",
                  on ? "shadow-[0_0_0_2px_#fafafa]" : "shadow-[0_0_0_1px_#2d2f31] group-hover:shadow-[0_0_0_1px_#55585c]",
                )}
              >
                <ScaledDocument d={d} templateId={t.id} className="pointer-events-none" />
              </span>
              <span className="flex items-center gap-[7px] px-[2px]">
                <span className="flex overflow-hidden rounded-full" style={{ boxShadow: "0 0 0 1px #393939" }}>
                  <span className="size-[10px]" style={{ background: p.bg }} />
                  <span className="size-[10px]" style={{ background: p.accent }} />
                </span>
                <span className="truncate text-[12px] leading-none font-medium text-fg">{t.name}</span>
                <span className="ml-auto text-[11px] leading-none text-fg-muted capitalize">{t.layout}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

const num = (v: string) => Number(v.replace(/[^\d.]/g, "")) || 0;

function DetailsForm({ invoice }: { invoice: Invoice }) {
  const { update, updateItem, addItem, removeItem } = useInvoices();
  const locked = invoice.status === "paid";

  return (
    <div className={cn("flex flex-col", locked && "pointer-events-none opacity-60")}>
      {locked && <p className="pointer-events-auto mb-4 text-[12px] leading-[16px] text-fg-muted">Paid invoices are locked. Templates can still be changed.</p>}
      <SectionLabel className="font-normal text-fg-soft">Dates</SectionLabel>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="inv-issue">Issue date</Label>
          <Input id="inv-issue" type="date" value={invoice.issueDate} onChange={(e) => e.target.value && update(invoice.id, { issueDate: e.target.value })} className="[color-scheme:dark]" />
        </div>
        <div>
          <Label htmlFor="inv-terms">Terms</Label>
          <Select
            id="inv-terms"
            value={String(invoice.terms)}
            onValueChange={(v) => update(invoice.id, { terms: Number(v) })}
            options={TERMS.map((x) => ({ value: String(x.days), label: x.label }))}
          />
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <SectionLabel className="font-normal text-fg-soft">Line items</SectionLabel>
        <Button onClick={() => addItem(invoice.id)} className="pr-[10px] pl-[8px]">
          <Plus className="size-[12px]" strokeWidth={2} />
          Add line
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {invoice.items.map((it) => (
          <div key={it.id} className="rounded-lg border border-line-card bg-card p-3">
            <div className="flex items-center gap-2">
              <Input aria-label="Description" value={it.description} onChange={(e) => updateItem(invoice.id, it.id, { description: e.target.value })} />
              <button
                type="button"
                aria-label="Remove line"
                disabled={invoice.items.length < 2}
                onClick={() => removeItem(invoice.id, it.id)}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line-control text-fg-muted transition-colors hover:text-danger-dot disabled:opacity-40"
              >
                <Trash2 className="size-[13px]" strokeWidth={1.75} />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-[72px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2">
              <Input aria-label="Quantity" inputMode="numeric" value={it.qty} onChange={(e) => updateItem(invoice.id, it.id, { qty: num(e.target.value) })} className="tabular-nums" />
              <Input aria-label="Unit price" inputMode="decimal" value={it.unitPrice} onChange={(e) => updateItem(invoice.id, it.id, { unitPrice: num(e.target.value) })} className="tabular-nums" />
              <span className="text-right text-[14px] leading-none font-medium text-fg tabular-nums">
                <span className="mr-[3px] text-[#7f7f7f]">$</span>
                {formatNumber(it.qty * it.unitPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel className="mt-7 font-normal text-fg-soft">Adjustments</SectionLabel>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] gap-3">
        <div>
          <Label htmlFor="inv-discount">Discount ($)</Label>
          <Input id="inv-discount" inputMode="decimal" value={invoice.discount} onChange={(e) => update(invoice.id, { discount: num(e.target.value) })} className="tabular-nums" />
        </div>
        <div>
          <Label htmlFor="inv-tax">Tax %</Label>
          <Input id="inv-tax" inputMode="decimal" value={invoice.taxRate} onChange={(e) => update(invoice.id, { taxRate: Math.min(num(e.target.value), 50) })} className="tabular-nums" />
        </div>
        <div>
          <Label htmlFor="inv-taxlabel">Tax label</Label>
          <Input id="inv-taxlabel" value={invoice.taxLabel} onChange={(e) => update(invoice.id, { taxLabel: e.target.value })} />
        </div>
      </div>

      <div className="mt-5 flex flex-col rounded-lg border border-line-card px-3 py-2">
        {(
          [
            ["Subtotal", subtotalOf(invoice)],
            ["Discount", -invoice.discount],
            [`${invoice.taxLabel} (${invoice.taxRate}%)`, taxOf(invoice)],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="flex h-8 items-center justify-between text-[12px] leading-none text-fg-muted">
            <span>{k}</span>
            <span className="text-fg-soft tabular-nums">{v < 0 ? `−$${formatNumber(-v)}` : `$${formatNumber(v)}`}</span>
          </div>
        ))}
        <div className="flex h-10 items-center justify-between border-t border-line-strong text-[14px] leading-none font-medium text-fg">
          <span>Amount due</span>
          <span className="tabular-nums">${formatNumber(totalOf(invoice))}</span>
        </div>
      </div>

      <SectionLabel className="mt-7 font-normal text-fg-soft">Notes</SectionLabel>
      <Textarea aria-label="Notes" value={invoice.notes} onChange={(e) => update(invoice.id, { notes: e.target.value })} className="mt-4" />
    </div>
  );
}
