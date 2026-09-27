import type { Deal, StageId } from "./deals";
import { STAGES } from "./deals";
import { TODAY } from "./clock";
import { PERIODS, Q1_FY28, type Period } from "./forecast";
import { REGION_MAPS, type RegionMap } from "./pipeline-maps";

/**
 * Regional pipelines. Every deal is sold into an account *site* (a city), and
 * each site belongs to one pipeline — so a company can have deals in several
 * pipelines (e.g. LVMH Paris in EMEA, LVMH Tokyo in APAC).
 */
export type PipelineId = "na" | "emea" | "apac";

export type Pipeline = {
  id: PipelineId;
  name: string;
  href: string;
  /** Identity colour — matches the sidebar dot; used only on this pipeline's page. */
  color: string;
  hq: string;
  map: RegionMap;
  description: string;
};

export const PIPELINES: Record<PipelineId, Pipeline> = {
  na: {
    id: "na",
    name: "North America",
    href: "/pipelines/north-america",
    color: "#ffdb4b",
    hq: "nyc",
    map: REGION_MAPS.na,
    description: "United States, Canada and Mexico",
  },
  emea: {
    id: "emea",
    name: "EMEA Enterprise",
    href: "/pipelines/emea-enterprise",
    color: "#f25c8f",
    hq: "london",
    map: REGION_MAPS.emea,
    description: "Enterprise accounts across Europe",
  },
  apac: {
    id: "apac",
    name: "APAC Expansion",
    href: "/pipelines/apac-expansion",
    color: "#8b7bff",
    hq: "singapore",
    map: REGION_MAPS.apac,
    description: "New-market expansion across Asia and Oceania",
  },
};

export type Site = { id: string; city: string; country: string; lat: number; lon: number; pipeline: PipelineId };

type SiteSeed = [id: string, city: string, country: string, lat: number, lon: number, pipeline: PipelineId];

const SITE_SEEDS: SiteSeed[] = [
  ["bay", "SF Bay Area", "United States", 37.6, -122.2, "na"],
  ["seattle", "Seattle", "United States", 47.61, -122.33, "na"],
  ["la", "Los Angeles", "United States", 34.05, -118.24, "na"],
  ["denver", "Denver", "United States", 39.74, -104.99, "na"],
  ["austin", "Austin", "United States", 30.27, -97.74, "na"],
  ["chicago", "Chicago", "United States", 41.88, -87.63, "na"],
  ["nyc", "New York", "United States", 40.71, -74.01, "na"],
  ["boston", "Boston", "United States", 42.36, -71.06, "na"],
  ["atlanta", "Atlanta", "United States", 33.75, -84.39, "na"],
  ["orlando", "Orlando", "United States", 28.54, -81.38, "na"],
  ["toronto", "Toronto", "Canada", 43.65, -79.38, "na"],
  ["vancouver", "Vancouver", "Canada", 49.28, -123.12, "na"],
  ["mexico", "Mexico City", "Mexico", 19.43, -99.13, "na"],
  ["london", "London", "United Kingdom", 51.51, -0.13, "emea"],
  ["dublin", "Dublin", "Ireland", 53.35, -6.26, "emea"],
  ["paris", "Paris", "France", 48.86, 2.35, "emea"],
  ["amsterdam", "Amsterdam", "Netherlands", 52.37, 4.9, "emea"],
  ["luxembourg", "Luxembourg", "Luxembourg", 49.61, 6.13, "emea"],
  ["munich", "Munich", "Germany", 48.14, 11.58, "emea"],
  ["zurich", "Zurich", "Switzerland", 47.37, 8.54, "emea"],
  ["stockholm", "Stockholm", "Sweden", 59.33, 18.07, "emea"],
  ["tokyo", "Tokyo", "Japan", 35.68, 139.69, "apac"],
  ["seoul", "Seoul", "South Korea", 37.57, 126.98, "apac"],
  ["hongkong", "Hong Kong", "China", 22.32, 114.17, "apac"],
  ["singapore", "Singapore", "Singapore", 1.35, 103.82, "apac"],
  ["jakarta", "Jakarta", "Indonesia", -6.21, 106.85, "apac"],
  ["bangalore", "Bengaluru", "India", 12.97, 77.59, "apac"],
  ["sydney", "Sydney", "Australia", -33.87, 151.21, "apac"],
  ["melbourne", "Melbourne", "Australia", -37.81, 144.96, "apac"],
  ["auckland", "Auckland", "New Zealand", -36.85, 174.76, "apac"],
];

export const SITES: Site[] = SITE_SEEDS.map(([id, city, country, lat, lon, pipeline]) => ({ id, city, country, lat, lon, pipeline }));
export const siteById = (id: string) => SITES.find((s) => s.id === id);

/** Where each seeded deal is sold. */
const DEAL_SITES: Record<string, string> = {
  "d-apple-pilot": "bay",
  "d-apple-exp": "austin",
  "d-apple-maps": "bay",
  "d-apple-fy28": "bay",
  "d-apple-jp": "tokyo",
  "d-snowflake": "denver",
  "d-snow-ai": "denver",
  "d-snowflake-market": "denver",
  "d-snow-cortex": "zurich",
  "d-stripe": "bay",
  "d-stripe-won": "bay",
  "d-stripe-intl": "dublin",
  "d-stripe-in": "bangalore",
  "d-attio": "london",
  "d-lvmh": "paris",
  "d-lvmh-clienteling": "paris",
  "d-lvmh-asia": "hongkong",
  "d-slack": "nyc",
  "d-slack-grid": "nyc",
  "d-slack-jp": "tokyo",
  "d-ms-strategic": "seattle",
  "d-ms-azure": "seattle",
  "d-ms-copilot": "seattle",
  "d-ms-emea": "munich",
  "d-disney": "la",
  "d-disney-ads": "orlando",
  "d-disney-parks2": "orlando",
  "d-disney-paris": "paris",
  "d-zoom": "bay",
  "d-zoom-events": "auckland",
  "d-zoom-anz": "melbourne",
  "d-intercom": "dublin",
  "d-intercom-won": "dublin",
  "d-intercom-ai": "london",
  "d-united": "chicago",
  "d-united-cargo": "chicago",
  "d-netflix": "amsterdam",
  "d-netflix-won": "amsterdam",
  "d-netflix-kr": "seoul",
  "d-hubspot": "boston",
  "d-hubspot-apac": "singapore",
  "d-spotify": "stockholm",
  "d-spotify-won": "stockholm",
  "d-spotify-sea": "jakarta",
  "d-shopify": "toronto",
  "d-shopify-plus": "vancouver",
  "d-shopify-apac": "sydney",
  "d-paypal": "luxembourg",
  "d-paypal-won": "luxembourg",
  "d-airbnb": "bay",
  "d-airbnb-exp": "mexico",
  "d-google": "bay",
  "d-google-cloud": "atlanta",
  "d-google-anz": "sydney",
};

/** A company's home site, for deals created without an explicit site. */
const COMPANY_HQ: Record<string, string> = {
  apple: "bay",
  snowflake: "denver",
  stripe: "bay",
  attio: "london",
  lvmh: "paris",
  slack: "bay",
  microsoft: "seattle",
  disney: "la",
  zoom: "bay",
  intercom: "dublin",
  united: "chicago",
  netflix: "la",
  hubspot: "boston",
  spotify: "stockholm",
  shopify: "toronto",
  paypal: "bay",
  airbnb: "bay",
  google: "bay",
};

export const siteOf = (d: Deal) => siteById(d.siteId ?? DEAL_SITES[d.id] ?? COMPANY_HQ[d.companyId] ?? "nyc")!;

export type CloseWindow = "all" | "fq3" | "fq4" | "fq1";

export const CLOSE_WINDOWS: { id: CloseWindow; label: string; period?: Period }[] = [
  { id: "all", label: "All deals" },
  { id: "fq3", label: "FQ3 FY27", period: PERIODS[0] },
  { id: "fq4", label: "FQ4 FY27", period: PERIODS[1] },
  { id: "fq1", label: "FQ1 FY28", period: Q1_FY28 },
];

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

export type SiteStat = { site: Site; deals: Deal[]; open: number; weighted: number; won: number; companies: string[] };

export type PipelineView = {
  deals: Deal[];
  open: Deal[];
  won: Deal[];
  openValue: number;
  weighted: number;
  wonValue: number;
  avgWin: number;
  avgDays: number;
  velocity: number;
  /** Share of the whole company's open pipeline. */
  share: number;
  sites: SiteStat[];
  funnel: { stage: StageId; label: string; tone: string; value: number; count: number; atStage: number }[];
  months: { key: string; label: string; byStage: Record<StageId, number>; total: number }[];
  owners: { ownerId: string; value: number; deals: number; share: number }[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function buildPipeline(all: Deal[], id: PipelineId, window: CloseWindow, ownerId: string | null): PipelineView {
  const period = CLOSE_WINDOWS.find((w) => w.id === window)?.period;
  const deals = all.filter((d) => {
    if (siteOf(d).pipeline !== id) return false;
    if (ownerId && d.ownerId !== ownerId) return false;
    if (period && (d.closeDate < period.start || d.closeDate > period.end)) return false;
    return true;
  });
  const open = deals.filter((d) => d.stage !== "won");
  const won = deals.filter((d) => d.stage === "won");
  const openValue = open.reduce((n, d) => n + d.value, 0);
  const weighted = Math.round(open.reduce((n, d) => n + (d.value * d.probability) / 100, 0));
  const wonValue = won.reduce((n, d) => n + d.value, 0);
  const avgWin = openValue ? Math.round((weighted / openValue) * 100) : 0;
  const avgDays = open.length ? Math.round(open.reduce((n, d) => n + Math.max(7, (t(d.closeDate) - t(TODAY)) / DAY), 0) / open.length) : 0;
  const allOpen = all.filter((d) => d.stage !== "won").reduce((n, d) => n + d.value, 0);

  const bySite = new Map<string, SiteStat>();
  for (const d of deals) {
    const site = siteOf(d);
    const s = bySite.get(site.id) ?? { site, deals: [], open: 0, weighted: 0, won: 0, companies: [] };
    s.deals.push(d);
    if (d.stage === "won") s.won += d.value;
    else {
      s.open += d.value;
      s.weighted += (d.value * d.probability) / 100;
    }
    if (!s.companies.includes(d.companyId)) s.companies.push(d.companyId);
    bySite.set(site.id, s);
  }
  const sites = [...bySite.values()].sort((a, b) => b.open + b.won - (a.open + a.won));

  // Funnel: value that has reached each stage (at it or beyond), so it only narrows.
  const order = STAGES.map((s) => s.id);
  const funnel = STAGES.map((s, i) => {
    const reached = deals.filter((d) => order.indexOf(d.stage) >= i);
    return {
      stage: s.id,
      label: s.label,
      tone: s.tone,
      value: reached.reduce((n, d) => n + d.value, 0),
      count: reached.length,
      atStage: deals.filter((d) => d.stage === s.id).length,
    };
  });

  const months: PipelineView["months"] = [];
  for (let m = 7; m <= 15; m++) {
    const y = 2026 + Math.floor(m / 12);
    const key = `${y}-${String((m % 12) + 1).padStart(2, "0")}`;
    const byStage = Object.fromEntries(order.map((s) => [s, 0])) as Record<StageId, number>;
    for (const d of deals) if (d.closeDate.startsWith(key)) byStage[d.stage] += d.value;
    months.push({ key, label: MONTHS[m % 12], byStage, total: Object.values(byStage).reduce((a, b) => a + b, 0) });
  }

  const byOwner = new Map<string, { value: number; deals: number }>();
  for (const d of open) {
    const o = byOwner.get(d.ownerId) ?? { value: 0, deals: 0 };
    o.value += d.value;
    o.deals += 1;
    byOwner.set(d.ownerId, o);
  }
  const owners = [...byOwner.entries()]
    .map(([ownerId, o]) => ({ ownerId, ...o, share: openValue ? o.value / openValue : 0 }))
    .sort((a, b) => b.value - a.value);

  return {
    deals,
    open,
    won,
    openValue,
    weighted,
    wonValue,
    avgWin,
    avgDays,
    velocity: avgDays ? Math.round(weighted / avgDays) : 0,
    share: allOpen ? openValue / allOpen : 0,
    sites,
    funnel,
    months,
    owners,
  };
}
