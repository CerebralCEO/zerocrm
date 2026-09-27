import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { connection } from "next/server";
import { DB_ENABLED, getDb } from "./index";
import * as t from "./schema";
import {
  activityFromRow,
  companyFromRow,
  contactFromRow,
  dealFromRow,
  historyFromRows,
  invoiceFromRow,
  notificationFromRow,
  sequenceFromRow,
  teamFromRow,
} from "./mappers";
import type { Snapshot, UserProfile } from "./snapshot";

/**
 * Load the whole workspace for the client stores. Returns null when no
 * database is configured or it hasn't been seeded yet — the app then runs on
 * its built-in demo data.
 */
export async function loadSnapshot(): Promise<Snapshot | null> {
  if (!DB_ENABLED) return null;
  // Live data: never bake a snapshot into prerendered HTML.
  await connection();
  const db = getDb();
  const [clock, companies, notifications, deals, activities, contacts, sequences, teams, invoices, pushes, settings] = await Promise.all([
    db.execute<{ now: string }>(sql`select now()::text as now`),
    db.select().from(t.companies).orderBy(asc(t.companies.createdAt), asc(t.companies.id)),
    db.select().from(t.notifications).orderBy(desc(t.notifications.createdAt), asc(t.notifications.id)),
    db.select().from(t.deals).orderBy(desc(t.deals.createdAt), asc(t.deals.id)),
    db.select().from(t.activities),
    db.select().from(t.contacts).orderBy(asc(t.contacts.createdAt), asc(t.contacts.id)),
    db.select().from(t.sequences).orderBy(asc(t.sequences.createdAt), asc(t.sequences.id)),
    db.select().from(t.teams).orderBy(asc(t.teams.createdAt), asc(t.teams.id)),
    db.select().from(t.invoices),
    db.select().from(t.slipPushes),
    db.select().from(t.settings),
  ]);
  if (!companies.length && !deals.length) return null;
  const acts = activities.map(activityFromRow);
  return {
    companies: companies.map(companyFromRow),
    notifications: notifications.map(notificationFromRow),
    deals: deals.map(dealFromRow),
    activities: acts.filter((a) => !a.system),
    events: acts.filter((a) => a.system),
    contacts: contacts.map(contactFromRow),
    sequences: sequences.map(sequenceFromRow),
    teams: teams.map(teamFromRow),
    invoices: invoices.map(invoiceFromRow),
    slipHistory: historyFromRows(pushes),
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
    loadedAt: clock.rows[0].now,
  };
}

/** The signed-in user's saved profile, or null if they haven't completed onboarding. */
export async function loadProfile(userId: string | null): Promise<UserProfile | null> {
  if (!DB_ENABLED || !userId) return null;
  const [row] = await getDb().select().from(t.userProfiles).where(eq(t.userProfiles.userId, userId));
  if (!row) return null;
  const { userId: _id, createdAt: _c, updatedAt: _u, ...profile } = row;
  void _id;
  void _c;
  void _u;
  return profile;
}
