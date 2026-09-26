import type { Deal } from "./deals";
import { TODAY } from "./deals-store";
import { PERIODS, Q1_FY28 } from "./forecast";
import { OWNERS } from "./data";

/**
 * Q1 FY28 plan: what next fiscal year's first quarter looks like today, and
 * what it takes to get to quota. Everything except the scenario inputs is
 * derived live from the deals board.
 */

export type ScenarioId = "conservative" | "base" | "upside";

export type Scenario = {
  /** Win rate applied to pipeline that doesn't exist yet (%). */
  winRate: number;
  /** New Q1-eligible pipeline created per week (USD). */
  weeklyGen: number;
  /** Share of FQ4 open pipeline expected to slip into Q1 (%). */
  slipIn: number;
};

export const SCENARIOS: Record<ScenarioId, Scenario & { label: string }> = {
  conservative: { label: "Conservative", winRate: 20, weeklyGen: 90_000, slipIn: 20 },
  base: { label: "Base", winRate: 26, weeklyGen: 120_000, slipIn: 30 },
  upside: { label: "Upside", winRate: 32, weeklyGen: 160_000, slipIn: 40 },
};

/** Contracted renewals due in Q1, at the historical 95% gross retention. */
export const RENEWAL_BASE = 480_000;
/** Pipeline created after this date is too late to close inside Q1 (≈ 60-day cycle). */
export const GEN_CUTOFF = "2027-03-01";

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const inRange = (iso: string, a: string, b: string) => t(iso) >= t(a) && t(iso) <= t(b);

export const Q1_MONTHS = [
  { key: "2027-02", label: "Feb" },
  { key: "2027-03", label: "Mar" },
  { key: "2027-04", label: "Apr" },
];

/** Flat Q1 quota per quota-carrying rep. */
export const REP_Q1_QUOTA = 300_000;

export type RepReadiness = {
  ownerId: string;
  quota: number;
  pipeline: number;
  weighted: number;
  deals: number;
  coverage: number;
  status: "Ready" | "Building" | "Thin";
};

export type Q1Plan = {
  quota: number;
  deals: Deal[];
  pipeline: number;
  weighted: number;
  renewals: number;
  slipIn: number;
  fq4Weighted: number;
  newPipeline: number;
  newWon: number;
  projected: number;
  gap: number;
  attainment: number;
  coverage: number;
  genWeeks: number;
  /** Weekly pipeline generation needed to land exactly on quota (null when already covered). */
  requiredGen: number | null;
  daysToStart: number;
  months: { key: string; label: string; target: number; weighted: number; pipeline: number; deals: number }[];
  reps: RepReadiness[];
};

export function buildQ1Plan(all: Deal[], s: Scenario, ownerId: string | null): Q1Plan {
  const mine = (d: Deal) => !ownerId || d.ownerId === ownerId;
  const share = ownerId ? REP_Q1_QUOTA / Q1_FY28.quota : 1;
  const quota = ownerId ? REP_Q1_QUOTA : Q1_FY28.quota;

  const deals = all.filter((d) => mine(d) && d.stage !== "won" && inRange(d.closeDate, Q1_FY28.start, Q1_FY28.end));
  const pipeline = deals.reduce((n, d) => n + d.value, 0);
  const weighted = Math.round(deals.reduce((n, d) => n + (d.value * d.probability) / 100, 0));

  const fq4 = PERIODS.find((p) => p.id === "fq4")!;
  const fq4Weighted = all
    .filter((d) => mine(d) && d.stage !== "won" && inRange(d.closeDate, fq4.start, fq4.end))
    .reduce((n, d) => n + (d.value * d.probability) / 100, 0);
  const slipIn = Math.round((fq4Weighted * s.slipIn) / 100);

  const renewals = Math.round(RENEWAL_BASE * share);
  const genWeeks = Math.max(0, Math.round((t(GEN_CUTOFF) - t(TODAY)) / (7 * DAY)));
  const weeklyGen = s.weeklyGen * share;
  const newPipeline = Math.round(weeklyGen * genWeeks);
  const newWon = Math.round((newPipeline * s.winRate) / 100);

  const projected = renewals + weighted + slipIn + newWon;
  const gap = quota - projected;
  const base = renewals + weighted + slipIn;
  const requiredGen = base >= quota || !genWeeks || !s.winRate ? null : Math.round((quota - base) / (genWeeks * (s.winRate / 100)));

  const months = Q1_MONTHS.map((m) => {
    const inMonth = deals.filter((d) => d.closeDate.startsWith(m.key));
    return {
      ...m,
      target: Math.round(quota / 3),
      weighted: Math.round(inMonth.reduce((n, d) => n + (d.value * d.probability) / 100, 0)),
      pipeline: inMonth.reduce((n, d) => n + d.value, 0),
      deals: inMonth.length,
    };
  });

  const reps: RepReadiness[] = OWNERS.filter((o) => !ownerId || o.id === ownerId)
    .map((o) => {
      const own = deals.filter((d) => d.ownerId === o.id);
      const pipe = own.reduce((n, d) => n + d.value, 0);
      const coverage = pipe / REP_Q1_QUOTA;
      return {
        ownerId: o.id,
        quota: REP_Q1_QUOTA,
        pipeline: pipe,
        weighted: Math.round(own.reduce((n, d) => n + (d.value * d.probability) / 100, 0)),
        deals: own.length,
        coverage,
        status: (coverage >= 1.5 ? "Ready" : coverage >= 0.75 ? "Building" : "Thin") as RepReadiness["status"],
      };
    })
    .sort((a, b) => b.coverage - a.coverage || a.ownerId.localeCompare(b.ownerId));

  return {
    quota,
    deals,
    pipeline,
    weighted,
    renewals,
    slipIn,
    fq4Weighted: Math.round(fq4Weighted),
    newPipeline,
    newWon,
    projected,
    gap,
    attainment: quota ? Math.round((projected / quota) * 100) : 0,
    coverage: quota ? pipeline / quota : 0,
    genWeeks,
    requiredGen,
    daysToStart: Math.max(0, Math.round((t(Q1_FY28.start) - t(TODAY)) / DAY)),
    months,
    reps,
  };
}
