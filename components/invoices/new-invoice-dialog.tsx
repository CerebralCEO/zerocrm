"use client";

import { ChevronRight } from "lucide-react";
import { useDeals } from "@/lib/deals-store";
import { useInvoices } from "@/lib/invoices-store";
import { STATUS_META, statusOf } from "@/lib/invoices";
import { useCrm } from "@/lib/store";
import { formatNumber, formatShortDate } from "@/lib/utils";
import { Modal, SectionLabel } from "@/components/ui/overlay";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { Tag } from "@/components/primitives/tag";

/** Pick the Closed Won deal to bill. Deals that already have an invoice open it instead. */
export function NewInvoiceDialog() {
  const open = useInvoices((s) => s.pickerOpen);
  const setOpen = useInvoices((s) => s.setPickerOpen);
  const invoices = useInvoices((s) => s.invoices);
  const createFromDeal = useInvoices((s) => s.createFromDeal);
  const deals = useDeals((s) => s.deals);
  const companies = useCrm((s) => s.companies);
  const won = deals.filter((d) => d.stage === "won").sort((a, b) => b.closeDate.localeCompare(a.closeDate));
  const byDeal = new Map(invoices.map((i) => [i.dealId, i]));
  const groups = [
    { label: "Ready to invoice", rows: won.filter((d) => !byDeal.has(d.id)) },
    { label: "Already invoiced", rows: won.filter((d) => byDeal.has(d.id)) },
  ].filter((g) => g.rows.length);

  return (
    <Modal open={open} onOpenChange={setOpen} title="New Invoice" description="Invoices start from a Closed Won deal — lines and amounts are prefilled.">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        {groups.map((g) => (
          <div key={g.label} className="mb-6 last:mb-0">
            <SectionLabel className="font-normal text-fg-soft">{g.label}</SectionLabel>
            <div className="mt-3 flex flex-col">
              {g.rows.map((d) => {
                const company = companies.find((c) => c.id === d.companyId);
                const inv = byDeal.get(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => createFromDeal(d.id)}
                    className="no-press -mx-2 flex min-h-[52px] items-center gap-3 rounded-md px-2 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <CompanyLogo id={d.companyId} src={company?.logo} size={32} glyph={16} radius={8} />
                    <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                      <span className="truncate text-[14px] leading-none font-medium text-fg">{company?.name}</span>
                      <span className="truncate text-[12px] leading-none text-fg-soft/80">
                        {d.title} · won {formatShortDate(d.closeDate)}
                      </span>
                    </span>
                    {inv ? (
                      <Tag tone={STATUS_META[statusOf(inv)].tone} className="h-5 px-[6px] text-[12px]">
                        {inv.number.slice(-4)}
                      </Tag>
                    ) : (
                      <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
                        <span className="mr-[3px] text-[#7f7f7f]">$</span>
                        {formatNumber(d.value)}
                      </span>
                    )}
                    <ChevronRight className="size-[14px] text-fg-muted" strokeWidth={2} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {!groups.length && <p className="py-10 text-center text-[13px] text-fg-muted">No Closed Won deals yet — win one on the Deals Board.</p>}
      </div>
    </Modal>
  );
}
