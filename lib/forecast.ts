import type { Deal } from "./deals";
import { TODAY } from "./clock";

/**
 * Fiscal calendar: the fiscal year starts Feb 1, so FQ3 = Aug–Oct and
 * FQ4 = Nov–Jan (a common SaaS convention).
 */
export type PeriodId = "fq3" | "fq4" | "fq1";

export type Period = {
  id: PeriodId;
  label: string;
  range: string;
  start: string; // inclusive ISO date
  end: string; // inclusive ISO date
  quota: number;
  repQuota: number;
};

export const PERIODS: Period[] = [
  { id: "fq3", label: "FQ3 FY27", range: "Aug – Oct", start: "2026-08-01", end: "2026-10-31", quota: 2_400_000, repQuota: 400_000 },
  { id: "fq4", label: "FQ4 FY27", range: "Nov – Jan", start: "2026-11-01", end: "2027-01-31", quota: 3_000_000, repQuota: 500_000 },
];
export const periodById = (id: PeriodId) => PERIODS.find((p) => p.id === id)!;

/** Next fiscal year's first quarter — planned on the Q1 Forecast report, not in the period switch. */
export const Q1_FY28: Period = {
  id: "fq1",
  label: "FQ1 FY28",
  range: "Feb – Apr",
  start: "2027-02-01",
  end: "2027-04-30",
  quota: 3_400_000,
  repQuota: 450_000,
};

/** Fiscal quarter of a date ("FQ3 FY27"); the fiscal year starts Feb 1. */
export function fiscalQuarter(iso: string) {
  const [y, m] = iso.split("-").map(Number);
  const q = Math.floor(((m - 2 + 12) % 12) / 3) + 1;
  const fy = (m >= 2 ? y + 1 : y) % 100;
  const startMonth = ((q - 1) * 3 + 1) % 12; // 0-based month index of the quarter start
  const startYear = m >= 2 ? y : y - 1;
  const sy = startYear + Math.floor(((q - 1) * 3 + 1) / 12);
  const start = `${sy}-${String(startMonth + 1).padStart(2, "0")}-01`;
  return { key: `${fy}-${q}`, label: `FQ${q} FY${fy}`, short: `FQ${q}`, start };
}

/** Forecast category follows the deal's stage. */
export type Category = "closed" | "commit" | "best" | "pipeline";

export const CATEGORIES: { id: Category; label: string; hint: string }[] = [
  { id: "closed", label: "Closed won", hint: "Booked" },
  { id: "commit", label: "Commit", hint: "Negotiation" },
  { id: "best", label: "Best case", hint: "Proposal" },
  { id: "pipeline", label: "Pipeline", hint: "Discovery & Qualified" },
];

export function categoryOf(d: Deal): Category {
  switch (d.stage) {
    case "won":
      return "closed";
    case "negotiation":
      return "commit";
    case "proposal":
      return "best";
    default:
      return "pipeline";
  }
}

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export type WeekPoint = {
  start: string;
  end: string;
  /** Cumulative closed-won up to this week (null for future weeks). */
  closed: number | null;
  /** Projected cumulative if every commit deal closes on its date (null for past weeks). */
  commit: number | null;
  /** Projected cumulative including best-case deals (null for past weeks). */
  best: number | null;
};

export type RiskReason = "Overdue" | "Low confidence" | "Closing soon";

export type Forecast = {
  period: Period;
  deals: Deal[]; // deals closing in the period
  totals: Record<Category, number>;
  counts: Record<Category, number>;
  weighted: number;
  weeks: WeekPoint[];
  /** Index of the week containing today (-1 before the period, weeks.length after it). */
  todayIndex: number;
  months: { label: string; target: number; closed: number; commit: number; best: number }[];
  reps: { ownerId: string; closed: number; commit: number; attainment: number }[];
  atRisk: { deal: Deal; reason: RiskReason }[];
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildForecast(all: Deal[], period: Period, ownerId: string | null): Forecast {
  const start = t(period.start);
  const end = t(period.end);
  const now = t(TODAY);
  const inPeriod = (d: Deal) => {
    const c = t(d.closeDate);
    // Overdue open deals roll into the current period until they close.
    const rolled = d.stage !== "won" && c < now && now >= start && now <= end;
    return (c >= start && c <= end) || rolled;
  };
  const deals = all.filter((d) => inPeriod(d) && (!ownerId || d.ownerId === ownerId));

  const totals: Record<Category, number> = { closed: 0, commit: 0, best: 0, pipeline: 0 };
  const counts: Record<Category, number> = { closed: 0, commit: 0, best: 0, pipeline: 0 };
  let weighted = 0;
  for (const d of deals) {
    const c = categoryOf(d);
    totals[c] += d.value;
    counts[c] += 1;
    weighted += c === "closed" ? d.value : (d.value * d.probability) / 100;
  }

  // Weekly series (7-day buckets from the period start).
  const weeks: WeekPoint[] = [];
  for (let ws = start; ws <= end; ws += 7 * DAY) {
    const we = Math.min(ws + 6 * DAY, end);
    weeks.push({ start: iso(ws), end: iso(we), closed: null, commit: null, best: null });
  }
  let todayIndex = weeks.findIndex((w) => now >= t(w.start) && now <= t(w.end));
  if (todayIndex === -1) todayIndex = now < start ? -1 : weeks.length;

  const closedBy = (ms: number) =>
    deals.filter((d) => d.stage === "won" && t(d.closeDate) <= ms).reduce((s, d) => s + d.value, 0);
  // Future closes: overdue deals are expected in the current week.
  const expectedBy = (ms: number, cat: Category) =>
    deals
      .filter((d) => categoryOf(d) === cat && Math.max(t(d.closeDate), now) <= ms)
      .reduce((s, d) => s + d.value, 0);

  const closedToDate = closedBy(now);
  weeks.forEach((w, i) => {
    const weekEnd = t(w.end);
    if (i <= todayIndex) w.closed = i === todayIndex ? closedToDate : closedBy(weekEnd);
    if (i >= todayIndex && todayIndex < weeks.length) {
      const until = i === todayIndex ? now : weekEnd;
      w.commit = closedToDate + expectedBy(until, "commit");
      w.best = w.commit + expectedBy(until, "best");
    }
  });
  // Before the period starts, project from zero.
  if (todayIndex === -1) {
    weeks.forEach((w) => {
      const weekEnd = t(w.end);
      w.commit = expectedBy(weekEnd, "commit");
      w.best = w.commit + expectedBy(weekEnd, "best");
    });
  }

  // Months in the period.
  const months: Forecast["months"] = [];
  const first = new Date(start);
  for (let m = 0; m < 3; m++) {
    const d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + m, 1));
    const key = iso(d.getTime()).slice(0, 7);
    const inMonth = (x: Deal) => iso(Math.max(t(x.closeDate), x.stage === "won" ? 0 : now)).slice(0, 7) === key;
    const sum = (cat: Category) => deals.filter((x) => categoryOf(x) === cat && inMonth(x)).reduce((s, x) => s + x.value, 0);
    months.push({
      label: MONTH_LABELS[d.getUTCMonth()],
      target: Math.round(period.quota / 3),
      closed: sum("closed"),
      commit: sum("commit"),
      best: sum("best"),
    });
  }

  // Rep attainment (closed vs rep quota), best first.
  const byRep = new Map<string, { closed: number; commit: number }>();
  for (const d of deals) {
    const r = byRep.get(d.ownerId) ?? { closed: 0, commit: 0 };
    if (d.stage === "won") r.closed += d.value;
    else if (d.stage === "negotiation") r.commit += d.value;
    byRep.set(d.ownerId, r);
  }
  const reps = [...byRep.entries()]
    .map(([id, r]) => ({ ownerId: id, ...r, attainment: Math.round((r.closed / period.repQuota) * 100) }))
    .sort((a, b) => b.attainment - a.attainment || b.commit - a.commit)
    .slice(0, 6);

  // Deals that could make or break the number.
  const atRisk: Forecast["atRisk"] = [];
  for (const d of deals) {
    if (d.stage === "won") continue;
    const days = Math.round((t(d.closeDate) - now) / DAY);
    if (days < 0) atRisk.push({ deal: d, reason: "Overdue" });
    else if (d.probability < 50 && d.value >= 200_000) atRisk.push({ deal: d, reason: "Low confidence" });
    else if (days <= 14 && d.probability < 90) atRisk.push({ deal: d, reason: "Closing soon" });
  }
  const order: Record<RiskReason, number> = { Overdue: 0, "Low confidence": 1, "Closing soon": 2 };
  atRisk.sort((a, b) => order[a.reason] - order[b.reason] || b.deal.value - a.deal.value);

  return { period, deals, totals, counts, weighted: Math.round(weighted), weeks, todayIndex, months, reps, atRisk };
}
