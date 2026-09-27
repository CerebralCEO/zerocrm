"use server";

import { getTableColumns, inArray, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { auth } from "@clerk/nextjs/server";
import { DB_ENABLED, getDb } from "@/db";
import * as t from "@/db/schema";
import * as m from "@/db/mappers";
import { SYNC_TABLES, type SyncChange } from "@/db/snapshot";
import type { Activity } from "@/lib/activities";
import type { Company, Notification } from "@/lib/data";
import type { Deal } from "@/lib/deals";
import type { Contact } from "@/lib/contacts";
import type { Sequence } from "@/lib/sequences";
import type { Team } from "@/lib/teams";
import type { Invoice } from "@/lib/invoices";
import type { Push } from "@/lib/slips";

const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

/** `ON CONFLICT DO UPDATE SET col = excluded.col` for every column except the key and created_at. */
function excludedSet(table: PgTable, key: string) {
  const cols = getTableColumns(table);
  return Object.fromEntries(
    Object.entries(cols)
      .filter(([k]) => k !== key && k !== "createdAt")
      .map(([k, c]) => [k, sql.raw(`excluded."${c.name}"`)]),
  ) as Record<string, SQL>;
}

/**
 * Write-through for the client stores: upserts and deletes rows for the
 * changes a store just made. Signed-in users only (when auth is configured).
 */
export async function syncChanges(changes: SyncChange[]): Promise<{ ok: boolean; error?: string }> {
  if (!DB_ENABLED) return { ok: false, error: "Database not configured" };
  if (AUTH_ENABLED) {
    const { userId } = await auth();
    if (!userId) return { ok: false, error: "Not signed in" };
  }
  const db = getDb();
  try {
    for (const c of changes) {
      if (!SYNC_TABLES.includes(c.table)) continue;
      const deletes = (c.deletes ?? []).filter((id): id is string => typeof id === "string");
      switch (c.table) {
        case "companies":
          await upsert(t.companies, "id", (c.upserts as Company[]).map(m.companyToRow));
          if (deletes.length) await db.delete(t.companies).where(inArray(t.companies.id, deletes));
          break;
        case "notifications":
          await upsert(t.notifications, "id", (c.upserts as Notification[]).map(m.notificationToRow));
          if (deletes.length) await db.delete(t.notifications).where(inArray(t.notifications.id, deletes));
          break;
        case "deals":
          await upsert(t.deals, "id", (c.upserts as Deal[]).map(m.dealToRow));
          if (deletes.length) await db.delete(t.deals).where(inArray(t.deals.id, deletes));
          break;
        case "activities":
          await upsert(t.activities, "id", (c.upserts as Activity[]).map(m.activityToRow));
          if (deletes.length) await db.delete(t.activities).where(inArray(t.activities.id, deletes));
          break;
        case "contacts":
          await upsert(t.contacts, "id", (c.upserts as Contact[]).map(m.contactToRow));
          if (deletes.length) await db.delete(t.contacts).where(inArray(t.contacts.id, deletes));
          break;
        case "sequences":
          await upsert(t.sequences, "id", (c.upserts as Sequence[]).map(m.sequenceToRow));
          if (deletes.length) await db.delete(t.sequences).where(inArray(t.sequences.id, deletes));
          break;
        case "teams":
          await upsert(t.teams, "id", (c.upserts as Team[]).map(m.teamToRow));
          if (deletes.length) await db.delete(t.teams).where(inArray(t.teams.id, deletes));
          break;
        case "invoices":
          await upsert(t.invoices, "id", (c.upserts as Invoice[]).map(m.invoiceToRow));
          if (deletes.length) await db.delete(t.invoices).where(inArray(t.invoices.id, deletes));
          break;
        case "slipPushes": {
          const rows = (c.upserts as { dealId: string; pushes: Push[] }[]).flatMap((x) => m.pushesToRows(x.dealId, x.pushes));
          await upsert(t.slipPushes, "id", rows);
          if (deletes.length) await db.delete(t.slipPushes).where(inArray(t.slipPushes.id, deletes));
          break;
        }
        case "settings":
          await upsert(t.settings, "key", (c.upserts as { key: string; value: unknown }[]).map((s) => ({ key: s.key, value: s.value })));
          if (deletes.length) await db.delete(t.settings).where(inArray(t.settings.key, deletes));
          break;
      }
      // Leave a tombstone so other tabs and devices drop the rows on their next pull.
      if (deletes.length) await db.insert(t.tombstones).values(deletes.map((rowId) => ({ tableName: c.table, rowId })));
    }
    return { ok: true };
  } catch (e) {
    console.error("[sync] failed", e);
    return { ok: false, error: "Could not save changes" };
  }

  async function upsert<T extends PgTable>(table: T, key: string, rows: T["$inferInsert"][]) {
    if (!rows.length) return;
    const target = getTableColumns(table)[key];
    await db
      .insert(table)
      .values(rows)
      .onConflictDoUpdate({ target, set: excludedSet(table, key) });
  }
}
