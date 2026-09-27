"use client";

import { useMemo } from "react";
import { CONTACTS } from "@/lib/contacts";
import { ownerById } from "@/lib/data";
import { useDeals } from "@/lib/deals-store";
import { TERMS, dueDate, statusOf, subtotalOf, taxOf, totalOf, type Invoice } from "@/lib/invoices";
import { paletteOf, templateById, type InvoiceTemplate, type LayoutId } from "@/lib/invoice-templates";
import { siteOf } from "@/lib/pipelines";
import { useCrm } from "@/lib/store";
import { useWidth } from "@/components/primitives/use-width";
import type { DocData, LayoutProps } from "./doc-parts";
import { Band, Banner, Card, Classic, Editorial, Hero, Ledger, Sidebar, Split, Swiss } from "./doc-layouts";

/** A4 at 96 dpi — the document is always laid out at this size and scaled for display. */
export const PAGE_W = 794;
export const PAGE_H = 1123;

const LAYOUTS: Record<LayoutId, (p: LayoutProps) => React.ReactNode> = {
  classic: Classic,
  banner: Banner,
  sidebar: Sidebar,
  hero: Hero,
  split: Split,
  ledger: Ledger,
  editorial: Editorial,
  card: Card,
  swiss: Swiss,
  band: Band,
};

/** Resolve an invoice into printable document data (company, contact, place, totals). */
export function useDocData(inv: Invoice | undefined): DocData | null {
  const companies = useCrm((s) => s.companies);
  const deals = useDeals((s) => s.deals);
  return useMemo(() => {
    if (!inv) return null;
    const deal = deals.find((d) => d.id === inv.dealId);
    const company = companies.find((c) => c.id === inv.companyId);
    // Bill the economic buyer if we know one, else the first contact at the account.
    const people = CONTACTS.filter((c) => c.companyId === inv.companyId);
    const contact = people.find((c) => c.personas.includes("Economic buyer")) ?? people[0];
    const site = deal ? siteOf(deal) : null;
    return {
      number: inv.number,
      status: statusOf(inv),
      issue: inv.issueDate,
      due: dueDate(inv),
      terms: TERMS.find((x) => x.days === inv.terms)?.label ?? `Net ${inv.terms}`,
      company: company?.name ?? inv.companyId,
      contact: contact ? { name: contact.name, role: contact.role, email: contact.email } : null,
      place: site ? `${site.city}, ${site.country}` : "",
      deal: deal?.title ?? "",
      owner: ownerById(inv.ownerId).name,
      items: inv.items,
      subtotal: subtotalOf(inv),
      discount: inv.discount,
      tax: taxOf(inv),
      taxRate: inv.taxRate,
      taxLabel: inv.taxLabel,
      total: totalOf(inv),
      notes: inv.notes,
      paidDate: inv.paidDate,
    };
  }, [inv, companies, deals]);
}

/** The invoice page at full A4 size, painted by its template. */
export function InvoiceDocument({ d, template, id }: { d: DocData; template: InvoiceTemplate; id?: string }) {
  const p = paletteOf(template);
  const Layout = LAYOUTS[template.layout];
  return (
    <div
      id={id}
      className="invoice-page relative overflow-hidden text-left"
      style={{ width: PAGE_W, height: PAGE_H, background: p.bg, color: p.ink, printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <Layout d={d} t={template} p={p} />
    </div>
  );
}

/** The document scaled to fit its container's width (previews and thumbnails). */
export function ScaledDocument({ d, templateId, className, shadow }: { d: DocData; templateId: string; className?: string; shadow?: boolean }) {
  const { ref, width } = useWidth();
  const scale = width / PAGE_W;
  const template = templateById(templateId);
  return (
    <div ref={ref} className={className} style={{ aspectRatio: `${PAGE_W} / ${PAGE_H}` }}>
      {width > 0 && (
        <div
          className="overflow-hidden"
          style={{
            width,
            height: PAGE_H * scale,
            borderRadius: Math.max(3, 8 * scale),
            boxShadow: shadow ? "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px #2d2f31" : "0 0 0 1px #2d2f31",
          }}
        >
          <div style={{ width: PAGE_W, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
            <InvoiceDocument d={d} template={template} />
          </div>
        </div>
      )}
    </div>
  );
}
