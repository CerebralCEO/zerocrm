import type { Deal } from "./deals";
import { TODAY } from "./deals-store";

/**
 * Invoices are raised from Closed Won deals. Status is stored as the last
 * thing that happened (draft → sent → viewed → paid); "overdue" is derived
 * from the due date so it moves with the demo's TODAY.
 */
export type StoredStatus = "draft" | "sent" | "viewed" | "paid";
export type InvoiceStatus = StoredStatus | "overdue";

export type LineItem = { id: string; description: string; qty: number; unitPrice: number };

export type Invoice = {
  id: string;
  number: string;
  dealId: string;
  companyId: string;
  ownerId: string;
  issueDate: string;
  terms: number; // days until due; 0 = due on receipt
  status: StoredStatus;
  sentDate?: string;
  paidDate?: string;
  items: LineItem[];
  discount: number;
  taxRate: number; // %
  taxLabel: string;
  notes: string;
  templateId: string;
};

export const STATUS_META: Record<InvoiceStatus, { label: string; tone: "neutral" | "blue" | "purple" | "land" | "red" }> = {
  draft: { label: "Draft", tone: "neutral" },
  sent: { label: "Sent", tone: "blue" },
  viewed: { label: "Viewed", tone: "purple" },
  paid: { label: "Paid", tone: "land" },
  overdue: { label: "Overdue", tone: "red" },
};

export const TERMS: { days: number; label: string }[] = [
  { days: 0, label: "Due on receipt" },
  { days: 15, label: "Net 15" },
  { days: 30, label: "Net 30" },
  { days: 45, label: "Net 45" },
  { days: 60, label: "Net 60" },
];

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
export const addDays = (iso: string, n: number) => new Date(t(iso) + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((t(b) - t(a)) / DAY);

export const dueDate = (inv: Invoice) => addDays(inv.issueDate, inv.terms);
export const subtotalOf = (inv: Invoice) => inv.items.reduce((n, i) => n + i.qty * i.unitPrice, 0);
export const taxOf = (inv: Invoice) => Math.round(((subtotalOf(inv) - inv.discount) * inv.taxRate) / 100);
export const totalOf = (inv: Invoice) => subtotalOf(inv) - inv.discount + taxOf(inv);

export function statusOf(inv: Invoice): InvoiceStatus {
  if ((inv.status === "sent" || inv.status === "viewed") && dueDate(inv) < TODAY) return "overdue";
  return inv.status;
}
/** Days past due (0 when not overdue). */
export const overdueDays = (inv: Invoice) => (statusOf(inv) === "overdue" ? daysBetween(dueDate(inv), TODAY) : 0);

/** Default line items — subscription, services and support — that sum exactly to the deal value. */
export function itemsFor(deal: Pick<Deal, "id" | "title" | "value">): LineItem[] {
  const part = (share: number) => Math.round((deal.value * share) / 100) * 100;
  const lines: [string, number, number][] = [
    [`${deal.title} — annual subscription`, 1, part(0.64)],
    ["Implementation & onboarding", 1, part(0.12)],
    ["Data migration & integrations", 1, part(0.07)],
    ["Admin training · 4 sessions", 4, Math.round(part(0.05) / 4)],
  ];
  const used = lines.reduce((n, [, q, p]) => n + q * p, 0);
  lines.push(["Premium support · 12 months", 1, deal.value - used]);
  return lines.map(([description, qty, unitPrice], i) => ({ id: `${deal.id}-${i + 1}`, description, qty, unitPrice }));
}

/** The seller on every invoice (fictional demo company). */
export const SELLER = {
  name: "ZeroCRM, Inc.",
  lines: ["100 Market Street, Suite 400", "San Francisco, CA 94105", "billing@zerocrm.example"],
  taxId: "Tax ID  US-00-0000000",
  bank: "Demo Bank · Account •••• 0000",
  payUrl: "pay.zerocrm.example",
};

type Seed = [num: number, dealId: string, issue: string, terms: number, status: StoredStatus, sent: string | null, paid: string | null, template: string, tax?: [number, string], discount?: number];

const SEEDS: Seed[] = [
  [131, "d-netflix-won", "2026-08-13", 30, "paid", "2026-08-13", "2026-09-09", "paper"],
  [132, "d-google-anz", "2026-08-19", 30, "paid", "2026-08-19", "2026-09-16", "sky-sidebar", [10, "GST"]],
  [133, "d-disney-ads", "2026-08-20", 30, "viewed", "2026-08-20", null, "midnight"],
  [134, "d-intercom-won", "2026-08-22", 30, "paid", "2026-08-22", "2026-09-20", "ivory-editorial", [0, "VAT · reverse charge"]],
  [135, "d-apple-maps", "2026-08-27", 30, "viewed", "2026-08-27", null, "graphite", undefined, 10_500],
  [136, "d-shopify", "2026-08-29", 30, "viewed", "2026-08-29", null, "mint-banner"],
  [137, "d-ms-azure", "2026-09-03", 30, "sent", "2026-09-03", null, "swiss-red"],
  [138, "d-spotify-won", "2026-09-07", 30, "paid", "2026-09-07", "2026-09-25", "noir-serif", [0, "VAT · reverse charge"]],
  [139, "d-lvmh-clienteling", "2026-09-09", 30, "viewed", "2026-09-09", null, "obsidian-gold", [0, "VAT · reverse charge"]],
  [140, "d-stripe-won", "2026-09-11", 30, "sent", "2026-09-11", null, "terminal"],
  [141, "d-united", "2026-09-18", 30, "viewed", "2026-09-18", null, "cobalt-night"],
  [142, "d-snowflake-market", "2026-09-26", 30, "draft", null, null, "carbon-lime"],
];

export function seedInvoices(deals: Deal[]): Invoice[] {
  return SEEDS.flatMap(([num, dealId, issue, terms, status, sent, paid, template, tax, discount]) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return [];
    return [
      {
        id: `inv-${num}`,
        number: `INV-2026-0${num}`,
        dealId,
        companyId: deal.companyId,
        ownerId: deal.ownerId,
        issueDate: issue,
        terms,
        status,
        sentDate: sent ?? undefined,
        paidDate: paid ?? undefined,
        items: itemsFor(deal),
        discount: discount ?? 0,
        taxRate: tax?.[0] ?? 0,
        taxLabel: tax?.[1] ?? "Sales tax",
        notes: "Thank you for choosing ZeroCRM. Please include the invoice number with your payment.",
        templateId: template,
      },
    ];
  });
}

export type AgingBucket = { id: string; label: string; min: number; max: number; tone: "green" | "amber" | "orange" | "red" };
export const AGING: AgingBucket[] = [
  { id: "current", label: "Current", min: -Infinity, max: 0, tone: "green" },
  { id: "1-30", label: "1–30 days", min: 1, max: 30, tone: "amber" },
  { id: "31-60", label: "31–60 days", min: 31, max: 60, tone: "orange" },
  { id: "60+", label: "60+ days", min: 61, max: Infinity, tone: "red" },
];
