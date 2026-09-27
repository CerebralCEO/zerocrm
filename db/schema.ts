import { boolean, index, integer, jsonb, pgTable, real, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { Step, Enrollment } from "@/lib/sequences";
import type { ScoreCard, Tag } from "@/lib/data";
import type { DealActivity } from "@/lib/deals";
import type { Persona } from "@/lib/contacts";
import type { LineItem } from "@/lib/invoices";
import type { SdrMember, TeamMember } from "@/lib/teams";

/**
 * ZeroCRM schema. Only facts are stored — every metric (company pipeline,
 * forecast, team attainment…) is derived in the app from these rows.
 * Ids are the app's string ids so seed data, URLs and the client stores line up.
 * Dates the UI treats as timezone-free ("YYYY-MM-DD", "YYYY-MM-DDTHH:mm") stay text.
 */

const stamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const owners = pgTable("owners", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  ...stamps,
});

export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  tags: jsonb("tags").$type<Tag[]>().notNull(),
  ownerId: text("owner_id").notNull(),
  /** Fallback when no deal or activity touch exists yet. */
  lastInteractionDate: text("last_interaction_date").notNull(),
  lastInteractionType: text("last_interaction_type").notNull(),
  scoreCards: jsonb("score_cards").$type<ScoreCard[]>().notNull(),
  ...stamps,
});

export const deals = pgTable(
  "deals",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull(),
    title: text("title").notNull(),
    value: integer("value").notNull(),
    stage: text("stage").notNull(),
    ownerId: text("owner_id").notNull(),
    probability: integer("probability").notNull(),
    closeDate: text("close_date").notNull(),
    nextStep: text("next_step").notNull(),
    lastTouchType: text("last_touch_type").notNull(),
    lastTouchDate: text("last_touch_date").notNull(),
    siteId: text("site_id"),
    notes: jsonb("notes").$type<DealActivity[]>().notNull(),
    ...stamps,
  },
  (t) => [index("deals_company_idx").on(t.companyId), index("deals_owner_idx").on(t.ownerId), index("deals_updated_idx").on(t.updatedAt)],
);

/** Logged activity and system events (system = true) share one table. */
export const activities = pgTable(
  "activities",
  {
    id: text("id").primaryKey(),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    companyId: text("company_id").notNull(),
    dealId: text("deal_id"),
    ownerId: text("owner_id").notNull(),
    at: text("at").notNull(),
    done: boolean("done").notNull(),
    scheduled: boolean("scheduled").notNull().default(false),
    system: boolean("system").notNull().default(false),
    actor: text("actor"),
    ...stamps,
  },
  (t) => [index("activities_company_idx").on(t.companyId), index("activities_at_idx").on(t.at), index("activities_updated_idx").on(t.updatedAt)],
);

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  companyId: text("company_id").notNull(),
  ownerId: text("owner_id").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  personas: jsonb("personas").$type<Persona[]>().notNull(),
  strength: integer("strength").notNull(),
  lastTouchKind: text("last_touch_kind").notNull(),
  lastTouchDate: text("last_touch_date").notNull(),
  starred: boolean("starred").notNull().default(false),
  ...stamps,
});

export const sequences = pgTable("sequences", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  goal: text("goal").notNull(),
  status: text("status").notNull(),
  ownerId: text("owner_id").notNull(),
  meetings: integer("meetings").notNull(),
  steps: jsonb("steps").$type<Step[]>().notNull(),
  enrollments: jsonb("enrollments").$type<Enrollment[]>().notNull(),
  ...stamps,
});

export const teams = pgTable("teams", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  accountsLabel: text("accounts_label"),
  members: jsonb("members").$type<TeamMember[] | SdrMember[]>().notNull(),
  ...stamps,
});

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  number: text("number").notNull().unique(),
  dealId: text("deal_id").notNull(),
  companyId: text("company_id").notNull(),
  ownerId: text("owner_id").notNull(),
  issueDate: text("issue_date").notNull(),
  terms: integer("terms").notNull(),
  status: text("status").notNull(),
  sentDate: text("sent_date"),
  paidDate: text("paid_date"),
  items: jsonb("items").$type<LineItem[]>().notNull(),
  discount: integer("discount").notNull(),
  taxRate: real("tax_rate").notNull(),
  taxLabel: text("tax_label").notNull(),
  notes: text("notes").notNull(),
  templateId: text("template_id").notNull(),
  ...stamps,
});

/** One row per close-date push; id = "<dealId>#<n>". */
export const slipPushes = pgTable("slip_pushes", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  position: integer("position").notNull(),
  fromDate: text("from_date").notNull(),
  toDate: text("to_date").notNull(),
  onDate: text("on_date").notNull(),
  reason: text("reason").notNull(),
  ...stamps,
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  actor: text("actor"),
  companyId: text("company_id").notNull(),
  company: text("company").notNull(),
  text: text("text").notNull(),
  quote: text("quote"),
  time: text("time").notNull(),
  unread: boolean("unread").notNull(),
  ...stamps,
});

/** Small workspace settings: forecast calls, Q1 plan, default invoice template. */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  ...stamps,
});

/** A signed-in user's own details (collected by the onboarding modal), keyed by Clerk user id. */
export const userProfiles = pgTable("user_profiles", {
  userId: text("user_id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  jobTitle: text("job_title").notNull(),
  team: text("team").notNull(),
  region: text("region").notNull(),
  phone: text("phone"),
  timezone: text("timezone").notNull(),
  bio: text("bio"),
  ...stamps,
});

/** Deleted rows, so other tabs and devices can remove them when they pull changes. */
export const tombstones = pgTable(
  "tombstones",
  {
    id: serial("id").primaryKey(),
    tableName: text("table_name").notNull(),
    rowId: text("row_id").notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("tombstones_deleted_idx").on(t.deletedAt)],
);
