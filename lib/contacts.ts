import type { ActivityKind } from "./activities";
import { addDays } from "./activities";
import { TODAY } from "./deals-store";

export type Persona = "Champion" | "Decision maker" | "Economic buyer" | "Influencer" | "Technical" | "Blocker";

/** Persona → tag tone from the design system's tag palette. */
export const PERSONAS: { id: Persona; tone: "land" | "blue" | "purple" | "teal" | "yellow" | "red" }[] = [
  { id: "Champion", tone: "land" },
  { id: "Decision maker", tone: "blue" },
  { id: "Economic buyer", tone: "purple" },
  { id: "Influencer", tone: "teal" },
  { id: "Technical", tone: "yellow" },
  { id: "Blocker", tone: "red" },
];
export const personaTone = (p: Persona) => PERSONAS.find((x) => x.id === p)!.tone;

export type Contact = {
  id: string;
  name: string;
  role: string;
  companyId: string;
  ownerId: string;
  email: string;
  phone: string;
  location: string;
  personas: Persona[];
  /** Relationship strength 0–100. */
  strength: number;
  lastTouch: { kind: ActivityKind; date: string };
  starred: boolean;
};

/** Days without a touch before a relationship counts as "going cold". */
export const COLD_AFTER = 21;

type Seed = [name: string, role: string, companyId: string, personas: Persona[], strength: number, daysAgo: number, kind: ActivityKind, location: string, starred?: boolean];

const SEEDS: Seed[] = [
  ["Maya Chen", "VP, Retail Analytics", "apple", ["Champion"], 88, 1, "meeting", "Cupertino, CA", true],
  ["Daniel Brooks", "Director of Procurement", "apple", ["Economic buyer"], 64, 6, "email", "Austin, TX"],
  ["Priya Raman", "Staff Engineer, Data", "apple", ["Technical"], 52, 12, "call", "Seattle, WA"],
  ["Tom Keller", "Head of Data Platform", "snowflake", ["Decision maker"], 58, 9, "call", "San Mateo, CA"],
  ["Ines Duarte", "Finance Business Partner", "snowflake", ["Economic buyer"], 34, 27, "email", "Lisbon, PT"],
  ["Jordan Blake", "Product Lead, Billing", "stripe", ["Champion", "Influencer"], 81, 2, "meeting", "San Francisco, CA", true],
  ["Aisha Okafor", "Security Architect", "stripe", ["Technical", "Blocker"], 41, 15, "email", "Dublin, IE"],
  ["Lucas Meyer", "RevOps Manager", "attio", ["Influencer"], 67, 4, "call", "London, UK"],
  ["Hana Suzuki", "COO", "attio", ["Decision maker"], 49, 19, "meeting", "London, UK"],
  ["Camille Laurent", "Group CIO", "lvmh", ["Decision maker", "Economic buyer"], 72, 3, "meeting", "Paris, FR", true],
  ["Mathieu Roux", "Head of Procurement", "lvmh", ["Blocker"], 38, 8, "email", "Paris, FR"],
  ["Sofia Alvarez", "Partnerships Lead", "slack", ["Champion"], 61, 11, "call", "Denver, CO"],
  ["Ben Carter", "Alliances Director", "slack", ["Decision maker"], 29, 33, "email", "New York, NY"],
  ["Olivia Grant", "CISO", "microsoft", ["Blocker", "Technical"], 55, 1, "meeting", "Redmond, WA"],
  ["Ethan Park", "GM, Commercial Platforms", "microsoft", ["Decision maker"], 83, 2, "call", "Redmond, WA", true],
  ["Rachel Stein", "Procurement Lead", "microsoft", ["Economic buyer"], 66, 5, "email", "Bellevue, WA"],
  ["Marcus Lee", "VP, Parks Operations", "disney", ["Champion"], 74, 3, "meeting", "Orlando, FL"],
  ["Grace Holloway", "IT Director", "disney", ["Technical"], 47, 22, "email", "Burbank, CA"],
  ["Yuki Tanaka", "Head of Rooms", "zoom", ["Influencer"], 44, 24, "call", "San Jose, CA"],
  ["Noor Haddad", "Partner Manager", "zoom", ["Champion"], 58, 13, "email", "Toronto, CA"],
  ["Chris Novak", "VP, Support", "intercom", ["Decision maker", "Champion"], 79, 2, "meeting", "Dublin, IE"],
  ["Emily Shaw", "Support Ops Lead", "intercom", ["Influencer"], 70, 6, "call", "Chicago, IL"],
  ["Robert Vance", "Loyalty Director", "united", ["Decision maker"], 76, 10, "call", "Chicago, IL"],
  ["Kelly Moss", "Legal Counsel", "united", ["Blocker"], 36, 18, "email", "Chicago, IL"],
  ["Diego Santos", "Studio Analytics Lead", "netflix", ["Champion", "Technical"], 84, 1, "meeting", "Los Angeles, CA", true],
  ["Laura Kim", "Director, Ads Measurement", "netflix", ["Decision maker"], 62, 9, "email", "Los Gatos, CA"],
  ["Adam Price", "Channel Chief", "hubspot", ["Economic buyer"], 57, 14, "call", "Cambridge, MA"],
  ["Nina Petrova", "Partner Success", "hubspot", ["Champion"], 69, 5, "email", "Berlin, DE"],
  ["Oscar Lind", "Creator Tools PM", "spotify", ["Influencer"], 53, 16, "call", "Stockholm, SE"],
  ["Elin Berg", "VP, Podcasts", "spotify", ["Decision maker"], 31, 29, "email", "Stockholm, SE"],
  ["Sam Patel", "Merchant Success Lead", "shopify", ["Champion"], 86, 4, "meeting", "Ottawa, CA"],
  ["Megan Wright", "Finance Director", "shopify", ["Economic buyer"], 60, 20, "email", "Toronto, CA"],
  ["Victor Hughes", "Head of Risk", "paypal", ["Decision maker", "Technical"], 45, 7, "call", "San Jose, CA"],
  ["Julia Costa", "Fraud Ops Manager", "paypal", ["Influencer"], 39, 25, "email", "Austin, TX"],
  ["Ryan Cole", "Host Tools Lead", "airbnb", ["Influencer"], 51, 17, "call", "San Francisco, CA"],
  ["Zoe Martin", "Product Director", "airbnb", ["Decision maker"], 27, 36, "email", "Paris, FR"],
  ["Aarav Mehta", "SMB Programs Lead", "google", ["Champion"], 65, 8, "meeting", "Mountain View, CA"],
  ["Hannah Weiss", "Partnerships Counsel", "google", ["Blocker"], 33, 23, "email", "Zurich, CH"],
];

const OWNER_OF: Record<string, string> = {
  apple: "alex", snowflake: "grace", stripe: "noah", attio: "jamie", lvmh: "sarah", slack: "ava",
  microsoft: "mark", disney: "james", zoom: "oliver", intercom: "lina", united: "nia", netflix: "ricky",
  hubspot: "chloe", spotify: "hannah", shopify: "emma", paypal: "maria", airbnb: "drew", google: "kate",
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "");

/*
 * Demo contacts are fictional. Emails use the reserved `.example` TLD and
 * phones the reserved 555-01xx range, so no real person can be reached.
 */
export const CONTACTS: Contact[] = SEEDS.map(([name, role, companyId, personas, strength, daysAgo, kind, location, starred], i) => ({
  id: `c-${slug(name)}`,
  name,
  role,
  companyId,
  ownerId: OWNER_OF[companyId],
  email: `${slug(name)}@${companyId}.example`,
  phone: `+1 (555) 01${String(10 + i).padStart(2, "0")}`,
  location,
  personas,
  strength,
  lastTouch: { kind, date: addDays(TODAY, -daysAgo) },
  starred: !!starred,
}));
