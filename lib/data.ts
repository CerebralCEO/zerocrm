export type Tag =
  | "Pilot"
  | "Enterprise"
  | "Mid-Market"
  | "Expansion"
  | "SMB"
  | "Upsell"
  | "Co-Sell"
  | "Strategic"
  | "New Logo"
  | "Renewal"
  | "Land & Expand";

export const SEGMENTS: Tag[] = ["Enterprise", "Mid-Market", "SMB", "Strategic"];
export const STAGES: Tag[] = [
  "New Logo",
  "Pilot",
  "Expansion",
  "Upsell",
  "Co-Sell",
  "Renewal",
  "Land & Expand",
];
export const INTERACTION_TYPES = [
  "Discovery",
  "Demo",
  "Pricing",
  "Pilot",
  "Exec",
  "QBR Call",
  "Partner",
  "Product",
  "Legal",
  "Security",
  "Expansion",
  "Renewal",
] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type ScoreCard = {
  title: string;
  description: string;
  author: string;
  updated: string;
  rating: number;
};

export type Company = {
  id: string;
  name: string;
  logo?: string; // data URL for uploaded logos
  tags: Tag[];
  ownerId: string;
  openDeals: number;
  pipelineValue: number;
  winProbability: number;
  activity: number[];
  lastInteraction: { date: string; type: InteractionType };
  health: { discovery: number; evaluation: number; procurement: number };
  activityScore: number;
  activityNote: string;
  touches: { total: number; emails: number; meetings: number; calls: number };
  scoreCards: ScoreCard[];
};

export const CURRENT_USER = {
  name: "Jensen Ackles",
  role: "Head of Sales",
  email: "jensen.ackles@crm.com",
  phone: "+1 (202) 184-5501",
};

export const OWNERS: Owner[] = [
  ["alex", "Alex Santos", "+1 (202) 203-5668"],
  ["grace", "Grace Miller", "+1 (415) 555-0142"],
  ["noah", "Noah Lee", "+1 (646) 555-0197"],
  ["jamie", "Jamie Fox", "+1 (312) 555-0123"],
  ["sarah", "Sarah Nguyen", "+1 (206) 555-0175"],
  ["ava", "Ava Brooks", "+1 (617) 555-0110"],
  ["mark", "Mark Darnalds", "+1 (512) 555-0188"],
  ["james", "James Taylor", "+1 (303) 555-0164"],
  ["oliver", "Oliver Chan", "+1 (408) 555-0131"],
  ["lina", "Lina Wong", "+1 (213) 555-0156"],
  ["nia", "Nia Jameson", "+1 (404) 555-0149"],
  ["ricky", "Ricky Brown", "+1 (305) 555-0172"],
  ["chloe", "Chloe Park", "+1 (718) 555-0138"],
  ["hannah", "Hannah Mills", "+1 (503) 555-0115"],
  ["emma", "Emma Green", "+1 (469) 555-0193"],
  ["maria", "Maria Keller", "+1 (617) 555-0106"],
  ["drew", "Drew Nash", "+1 (720) 555-0184"],
  ["kate", "Kate Chen", "+1 (650) 555-0127"],
].map(([id, name, phone]) => ({
  id,
  name,
  phone,
  email: `${name.toLowerCase().replace(" ", ".")}@crm.com`,
}));

export const ownerById = (id: string) => OWNERS.find((o) => o.id === id) ?? OWNERS[0];

/* Sparkline patterns, measured bar-by-bar (px heights) from the reference. */
const SPARK_A = [4, 4, 10, 5, 2, 7, 11, 7, 11, 7, 11, 7, 7, 14];
const SPARK_B = [4, 4, 10, 3, 2, 4, 7, 4, 11, 4, 11, 7, 4, 14];
const SPARK_C = [4, 4, 5, 5, 2, 7, 11, 7, 5, 7, 5, 3, 7, 14];
const SPARK_D = [4, 4, 5, 12, 5, 7, 11, 3, 11, 3, 11, 3, 7, 14];

const DEFAULT_SCORECARDS: ScoreCard[] = [
  {
    title: "Business fit",
    description: "Evaluates how well the company aligns with our ideal customer profile.",
    author: "Emma Green",
    updated: "Updated 2h ago",
    rating: 4,
  },
  {
    title: "Technical fit",
    description:
      "Evaluates technical compatibility, security requirements, and integration readiness.",
    author: "Ricky Brown",
    updated: "Updated 2h ago",
    rating: 4,
  },
  {
    title: "Technical fit",
    description:
      "Evaluates technical compatibility, security requirements, and integration readiness.",
    author: "Taylor Leroy",
    updated: "Updated 2h ago",
    rating: 4,
  },
];

type Seed = [
  id: string,
  name: string,
  tags: Tag[],
  ownerId: string,
  openDeals: number,
  pipelineValue: number,
  winProbability: number,
  date: string,
  type: InteractionType,
  activity: number[],
];

const SEEDS: Seed[] = [
  ["apple", "Apple", ["Pilot"], "alex", 6, 530111, 82, "2026-03-12", "Exec", SPARK_A],
  ["snowflake", "Snowflake", ["Enterprise", "Mid-Market"], "grace", 6, 520000, 24, "2026-09-11", "Pricing", SPARK_A],
  ["stripe", "Stripe", ["Expansion", "SMB", "Upsell", "Pilot"], "noah", 3, 442231, 44, "2026-09-09", "Demo", SPARK_A],
  ["attio", "Attio", ["Mid-Market", "Upsell", "Renewal", "Co-Sell"], "jamie", 2, 420222, 38, "2026-06-14", "Pricing", SPARK_A],
  ["lvmh", "LVMH", ["Enterprise", "Upsell", "Expansion", "Renewal"], "sarah", 7, 420000, 70, "2026-02-21", "QBR Call", SPARK_B],
  ["slack", "Slack", ["Mid-Market", "Co-Sell"], "ava", 4, 333221, 23, "2026-08-12", "Discovery", SPARK_A],
  ["microsoft", "Microsoft", ["Strategic", "Expansion"], "mark", 8, 320222, 86, "2026-03-15", "Pilot", SPARK_A],
  ["disney", "Disney", ["Enterprise", "New Logo"], "james", 4, 311242, 51, "2026-02-22", "Demo", SPARK_C],
  ["zoom", "Zoom", ["Expansion", "Land & Expand", "Renewal"], "oliver", 8, 289921, 38, "2026-08-08", "Partner", SPARK_D],
  ["intercom", "Intercom", ["Enterprise", "Mid-Market"], "lina", 5, 230112, 61, "2026-03-28", "Product", SPARK_A],
  ["united", "United Airlines", ["Renewal"], "nia", 2, 221231, 77, "2026-03-17", "Legal", SPARK_D],
  ["netflix", "Netflix", ["Mid-Market"], "ricky", 3, 221221, 72, "2026-06-18", "Pilot", SPARK_A],
  ["hubspot", "Hubspot", ["Expansion", "Co-Sell", "Renewal", "Pilot"], "chloe", 2, 210123, 52, "2026-09-18", "QBR Call", SPARK_A],
  ["spotify", "Spotify", ["Land & Expand", "Expansion", "Strategic"], "hannah", 5, 170991, 55, "2026-07-01", "Expansion", SPARK_A],
  ["shopify", "Shopify", ["Co-Sell", "Expansion"], "emma", 9, 139007, 45, "2026-07-18", "Renewal", SPARK_A],
  ["paypal", "Paypal", ["Enterprise"], "maria", 5, 124232, 22, "2026-03-12", "Security", SPARK_A],
  ["airbnb", "Airbnb", ["Upsell", "Expansion", "SMB", "Pilot"], "drew", 3, 122230, 51, "2026-03-18", "Pricing", SPARK_C],
  ["google", "Google", ["SMB", "Enterprise", "Expansion", "Pilot"], "kate", 8, 112277, 24, "2026-06-07", "Renewal", SPARK_C],
];

/** Small deterministic PRNG so generated detail numbers are stable between renders. */
function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function buildDetails(id: string, win: number) {
  const rnd = seeded(id);
  const int = (min: number, max: number) => Math.round(min + rnd() * (max - min));
  const emails = int(6, 14);
  const meetings = int(2, 6);
  const calls = int(3, 9);
  return {
    health: {
      discovery: int(20, 45),
      evaluation: int(35, 70),
      procurement: int(15, 45),
    },
    activityScore: Math.min(99, Math.max(40, win + int(-5, 12))),
    activityNote: "Spikes around QBR prep and renewal review",
    // Total touches also counts touches outside the three tracked channels.
    touches: { total: emails + meetings + calls + int(2, 6), emails, meetings, calls },
    scoreCards: DEFAULT_SCORECARDS,
  };
}

export const COMPANIES: Company[] = SEEDS.map(
  ([id, name, tags, ownerId, openDeals, pipelineValue, winProbability, date, type, activity]) => ({
    id,
    name,
    tags,
    ownerId,
    openDeals,
    pipelineValue,
    winProbability,
    activity,
    lastInteraction: { date, type },
    ...buildDetails(id, winProbability),
    // Apple's detail numbers are taken verbatim from the reference.
    ...(id === "apple"
      ? {
          health: { discovery: 31, evaluation: 53, procurement: 31 },
          activityScore: 90,
          touches: { total: 24, emails: 10, meetings: 3, calls: 7 },
        }
      : {}),
  }),
);

export type Notification = {
  id: string;
  actor?: string;
  companyId: string;
  company: string;
  text: string;
  quote?: string;
  time: string;
  unread: boolean;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    actor: "Mark Darnalds",
    companyId: "microsoft",
    company: "Microsoft",
    text: "mentioned you on Microsoft",
    quote: "Can you join the pilot review on Friday? Procurement wants a security walkthrough.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "n2",
    actor: "Sarah Nguyen",
    companyId: "lvmh",
    company: "LVMH",
    text: "moved LVMH to Renewal",
    time: "18m ago",
    unread: true,
  },
  {
    id: "n3",
    companyId: "slack",
    company: "Slack",
    text: "Win probability for Slack dropped to 23%",
    time: "1h ago",
    unread: true,
  },
  {
    id: "n4",
    actor: "Emma Green",
    companyId: "shopify",
    company: "Shopify",
    text: "updated the Business fit score card for Shopify",
    time: "3h ago",
    unread: false,
  },
  {
    id: "n5",
    actor: "Noah Lee",
    companyId: "stripe",
    company: "Stripe",
    text: "logged a demo with Stripe",
    time: "Yesterday",
    unread: false,
  },
];
