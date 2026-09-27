import type { Activity } from "@/lib/activities";
import type { Company, Notification } from "@/lib/data";
import type { Deal } from "@/lib/deals";
import type { Contact } from "@/lib/contacts";
import type { Sequence } from "@/lib/sequences";
import type { Team } from "@/lib/teams";
import type { Invoice } from "@/lib/invoices";
import type { Push } from "@/lib/slips";

/** Everything the client stores need, as loaded from the database. Plain JSON — safe to pass to a client component. */
export type Snapshot = {
  companies: Company[];
  notifications: Notification[];
  deals: Deal[];
  activities: Activity[];
  events: Activity[];
  contacts: Contact[];
  sequences: Sequence[];
  teams: Team[];
  invoices: Invoice[];
  slipHistory: Record<string, Push[]>;
  settings: Record<string, unknown>;
  /** Database time the snapshot was read — the starting point for pulling later changes. */
  loadedAt: string;
};

/** Rows other tabs / users changed since a point in time (store-shaped), plus deletions. */
export type PullResult = {
  now: string;
  companies: Company[];
  notifications: Notification[];
  deals: Deal[];
  activities: Activity[];
  contacts: Contact[];
  sequences: Sequence[];
  teams: Team[];
  invoices: Invoice[];
  /** Full push history for every deal whose history changed. */
  slipHistory: Record<string, Push[]>;
  settings: Record<string, unknown>;
  deleted: Partial<Record<SyncTable, string[]>>;
};

/** What the onboarding modal collects and the app shows for the signed-in user. */
export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  jobTitle: string;
  team: string;
  region: string;
  phone: string | null;
  timezone: string;
  bio: string | null;
};

/** Tables the client may write through the sync action (store name → table). */
export const SYNC_TABLES = ["companies", "notifications", "deals", "activities", "contacts", "sequences", "teams", "invoices", "slipPushes", "settings"] as const;
export type SyncTable = (typeof SYNC_TABLES)[number];

export type SyncChange = {
  table: SyncTable;
  /** Store-shaped records (for slipPushes: { dealId, pushes }; for settings: { key, value }). */
  upserts: unknown[];
  /** Ids to delete (for settings: keys). */
  deletes: string[];
};

export const SETTINGS = {
  forecastCall: "forecast.call",
  q1Plan: "q1.plan",
  defaultTemplate: "invoices.defaultTemplate",
} as const;
