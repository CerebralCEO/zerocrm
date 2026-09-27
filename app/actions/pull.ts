"use server";

import { gt, inArray, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { DB_ENABLED, getDb } from "@/db";
import * as t from "@/db/schema";
import * as m from "@/db/mappers";
import { SYNC_TABLES, type PullResult, type SyncTable } from "@/db/snapshot";

const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

/**
 * Realtime over Neon: every open tab calls this every few seconds with the
 * database time of its last pull and gets back only what changed since —
 * other users' edits, other tabs, other devices — plus deletions.
 */
export async function pullChanges(since: string): Promise<PullResult | null> {
  if (!DB_ENABLED) return null;
  if (AUTH_ENABLED) {
    const { userId } = await auth();
    if (!userId) return null;
  }
  const after = new Date(since);
  if (Number.isNaN(after.getTime())) return null;
  const db = getDb();

  // Take the clock first: anything written while we read will be picked up next time.
  const clock = await db.execute<{ now: string }>(sql`select now()::text as now`);
  const [companies, notifications, deals, activities, contacts, sequences, teams, invoices, pushes, settings, dead] = await Promise.all([
    db.select().from(t.companies).where(gt(t.companies.updatedAt, after)),
    db.select().from(t.notifications).where(gt(t.notifications.updatedAt, after)),
    db.select().from(t.deals).where(gt(t.deals.updatedAt, after)),
    db.select().from(t.activities).where(gt(t.activities.updatedAt, after)),
    db.select().from(t.contacts).where(gt(t.contacts.updatedAt, after)),
    db.select().from(t.sequences).where(gt(t.sequences.updatedAt, after)),
    db.select().from(t.teams).where(gt(t.teams.updatedAt, after)),
    db.select().from(t.invoices).where(gt(t.invoices.updatedAt, after)),
    db.select({ dealId: t.slipPushes.dealId }).from(t.slipPushes).where(gt(t.slipPushes.updatedAt, after)),
    db.select().from(t.settings).where(gt(t.settings.updatedAt, after)),
    db.select().from(t.tombstones).where(gt(t.tombstones.deletedAt, after)),
  ]);

  // Histories are small — resend the whole history of each deal that changed.
  const pushDeals = [...new Set(pushes.map((p) => p.dealId))];
  const histories = pushDeals.length ? await db.select().from(t.slipPushes).where(inArray(t.slipPushes.dealId, pushDeals)) : [];

  const deleted: PullResult["deleted"] = {};
  for (const d of dead) {
    if (!SYNC_TABLES.includes(d.tableName as SyncTable)) continue;
    (deleted[d.tableName as SyncTable] ??= []).push(d.rowId);
  }

  return {
    now: clock.rows[0].now,
    companies: companies.map(m.companyFromRow),
    notifications: notifications.map(m.notificationFromRow),
    deals: deals.map(m.dealFromRow),
    activities: activities.map(m.activityFromRow),
    contacts: contacts.map(m.contactFromRow),
    sequences: sequences.map(m.sequenceFromRow),
    teams: teams.map(m.teamFromRow),
    invoices: invoices.map(m.invoiceFromRow),
    slipHistory: m.historyFromRows(histories),
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
    deleted,
  };
}
