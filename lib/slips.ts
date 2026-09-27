import type { Deal } from "./deals";
import { TODAY } from "./deals-store";
import { fiscalQuarter } from "./forecast";

/**
 * Close-date history. Every time a deal's close date moves later, a push is
 * recorded; the chain always ends at the deal's current close date.
 */
export type SlipReason = "Budget freeze" | "Procurement" | "Security review" | "Legal review" | "Champion left" | "Pricing" | "Rescheduled";

export const SLIP_REASONS: { id: SlipReason; tone: "red" | "orange" | "yellow" | "blue" | "purple" | "teal" | "neutral" }[] = [
  { id: "Budget freeze", tone: "red" },
  { id: "Procurement", tone: "orange" },
  { id: "Security review", tone: "blue" },
  { id: "Legal review", tone: "purple" },
  { id: "Champion left", tone: "yellow" },
  { id: "Pricing", tone: "teal" },
  // Close date moved later from the deal sheet, without a stated reason.
  { id: "Rescheduled", tone: "neutral" },
];
export const reasonTone = (r: SlipReason) => SLIP_REASONS.find((x) => x.id === r)!.tone;

export type Push = { from: string; to: string; on: string; reason: SlipReason };

type Seed = [dealId: string, pushes: [from: string, to: string, on: string, reason: SlipReason][]];

const SEEDS: Seed[] = [
  ["d-zoom", [["2026-08-28", "2026-09-22", "2026-08-25", "Procurement"]]],
  ["d-lvmh", [["2026-09-15", "2026-10-03", "2026-09-12", "Procurement"]]],
  ["d-ms-strategic", [["2026-09-16", "2026-09-30", "2026-09-14", "Security review"]]],
  ["d-stripe", [["2026-09-25", "2026-10-30", "2026-09-20", "Security review"]]],
  ["d-netflix", [["2026-09-30", "2026-10-18", "2026-09-24", "Legal review"]]],
  [
    "d-disney",
    [
      ["2026-09-30", "2026-10-20", "2026-09-18", "Champion left"],
      ["2026-10-20", "2026-11-15", "2026-09-26", "Budget freeze"],
    ],
  ],
  ["d-snowflake", [["2026-10-15", "2026-11-20", "2026-09-10", "Budget freeze"]]],
  [
    "d-attio",
    [
      ["2026-10-02", "2026-10-23", "2026-09-05", "Pricing"],
      ["2026-10-23", "2026-11-08", "2026-09-22", "Pricing"],
    ],
  ],
  ["d-hubspot", [["2026-09-25", "2026-11-02", "2026-09-19", "Legal review"]]],
  ["d-paypal", [["2026-10-10", "2026-11-25", "2026-09-12", "Security review"]]],
  ["d-slack", [["2026-11-01", "2026-12-12", "2026-09-15", "Champion left"]]],
  ["d-airbnb", [["2026-11-13", "2026-12-18", "2026-09-18", "Budget freeze"]]],
  [
    "d-google-cloud",
    [
      ["2026-12-10", "2027-01-20", "2026-09-08", "Budget freeze"],
      ["2027-01-20", "2027-02-18", "2026-09-24", "Procurement"],
    ],
  ],
  ["d-shopify-plus", [["2027-01-15", "2027-03-24", "2026-09-21", "Budget freeze"]]],
];

export const SLIP_HISTORY: Record<string, Push[]> = Object.fromEntries(
  SEEDS.map(([id, pushes]) => [id, pushes.map(([from, to, on, reason]) => ({ from, to, on, reason }))]),
);

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
export const daysBetween = (a: string, b: string) => Math.round((t(b) - t(a)) / DAY);

export function addDays(iso: string, n: number) {
  const d = new Date(t(iso) + n * DAY);
  return d.toISOString().slice(0, 10);
}

export type SlipWindow = "all" | "quarter" | "out" | "overdue";

export const SLIP_WINDOWS: { id: SlipWindow; label: string }[] = [
  { id: "all", label: "All slips" },
  { id: "out", label: "Out of quarter" },
  { id: "quarter", label: "Within quarter" },
  { id: "overdue", label: "Overdue" },
];

export type Slip = {
  deal: Deal;
  pushes: Push[];
  original: string;
  /** Days between the first committed date and today's expected date. */
  days: number;
  overdue: boolean;
  /** Pushed into a later fiscal quarter than originally committed. */
  crossed: boolean;
  fromQuarter: ReturnType<typeof fiscalQuarter>;
  toQuarter: ReturnType<typeof fiscalQuarter>;
  lastReason: SlipReason | null;
  severity: "high" | "medium";
};

/** Open deals that have slipped at least once, or are past their close date. */
export function buildSlips(deals: Deal[], history: Record<string, Push[]>, ownerId: string | null, window: SlipWindow): Slip[] {
  const out: Slip[] = [];
  for (const deal of deals) {
    if (deal.stage === "won" || (ownerId && deal.ownerId !== ownerId)) continue;
    const pushes = history[deal.id] ?? [];
    const overdue = deal.closeDate < TODAY;
    if (!pushes.length && !overdue) continue;
    const original = pushes[0]?.from ?? deal.closeDate;
    const expected = overdue ? TODAY : deal.closeDate;
    const fromQuarter = fiscalQuarter(original);
    const toQuarter = fiscalQuarter(expected);
    const crossed = toQuarter.start > fromQuarter.start;
    const slip: Slip = {
      deal,
      pushes,
      original,
      days: daysBetween(original, expected),
      overdue,
      crossed,
      fromQuarter,
      toQuarter,
      lastReason: pushes.at(-1)?.reason ?? null,
      severity: overdue || crossed || pushes.length > 1 ? "high" : "medium",
    };
    if (window === "out" && !crossed) continue;
    if (window === "quarter" && crossed) continue;
    if (window === "overdue" && !overdue) continue;
    out.push(slip);
  }
  // Worst first: overdue, then repeat slippers, then furthest pushed.
  return out.sort(
    (a, b) => Number(b.overdue) - Number(a.overdue) || b.pushes.length - a.pushes.length || b.days - a.days || b.deal.value - a.deal.value,
  );
}

/** First day of the fiscal quarter after the one containing `iso`. */
export function quarterAfter(iso: string) {
  const [y, m] = fiscalQuarter(iso).start.split("-").map(Number);
  const n = m + 3;
  return `${y + Math.floor((n - 1) / 12)}-${String(((n - 1) % 12) + 1).padStart(2, "0")}-01`;
}
