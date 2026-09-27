/**
 * Fill the database with ZeroCRM's demo workspace — every page's data.
 *
 *   pnpm db:seed          insert anything missing (safe to re-run, never overwrites)
 *   pnpm db:seed --reset  wipe every ZeroCRM table first, then insert fresh demo data
 */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
config({ quiet: true });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as t from "../db/schema";
import * as m from "../db/mappers";
import { SETTINGS } from "../db/snapshot";
import { COMPANIES, NOTIFICATIONS, OWNERS } from "../lib/data";
import { DEALS } from "../lib/deals";
import { ACTIVITIES } from "../lib/activities";
import { CONTACTS } from "../lib/contacts";
import { SEQUENCES } from "../lib/sequences";
import { TEAMS } from "../lib/teams";
import { seedInvoices } from "../lib/invoices";
import { SLIP_HISTORY } from "../lib/slips";
import { SCENARIOS } from "../lib/q1";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is missing — add it to .env.local (see .env.example).");
  const db = drizzle(neon(url), { schema: t });
  const reset = process.argv.includes("--reset");

  if (reset) {
    console.log("Resetting ZeroCRM tables…");
    for (const table of [
      t.settings,
      t.notifications,
      t.slipPushes,
      t.invoices,
      t.teams,
      t.sequences,
      t.contacts,
      t.activities,
      t.deals,
      t.companies,
      t.owners,
    ]) {
      await db.delete(table);
    }
  }

  const { winRate, weeklyGen, slipIn } = SCENARIOS.base;

  const sets: [string, { length: number }, () => Promise<unknown>][] = [
    ["owners", OWNERS, () => db.insert(t.owners).values(OWNERS.map(m.ownerToRow)).onConflictDoNothing()],
    ["companies", COMPANIES, () => db.insert(t.companies).values(COMPANIES.map(m.companyToRow)).onConflictDoNothing()],
    ["deals", DEALS, () => db.insert(t.deals).values(DEALS.map(m.dealToRow)).onConflictDoNothing()],
    [
      "activities",
      ACTIVITIES,
      async () => {
        // The biggest set — insert in chunks to stay well under parameter limits.
        const all = ACTIVITIES.map(m.activityToRow);
        for (let i = 0; i < all.length; i += 250)
          await db
            .insert(t.activities)
            .values(all.slice(i, i + 250))
            .onConflictDoNothing();
      },
    ],
    ["contacts", CONTACTS, () => db.insert(t.contacts).values(CONTACTS.map(m.contactToRow)).onConflictDoNothing()],
    ["sequences", SEQUENCES, () => db.insert(t.sequences).values(SEQUENCES.map(m.sequenceToRow)).onConflictDoNothing()],
    ["teams", TEAMS, () => db.insert(t.teams).values(TEAMS.map(m.teamToRow)).onConflictDoNothing()],
  ];
  const invoices = seedInvoices(DEALS);
  sets.push(["invoices", invoices, () => db.insert(t.invoices).values(invoices.map(m.invoiceToRow)).onConflictDoNothing()]);
  const pushes = Object.entries(SLIP_HISTORY).flatMap(([dealId, list]) => m.pushesToRows(dealId, list));
  sets.push(["slip pushes", pushes, () => db.insert(t.slipPushes).values(pushes).onConflictDoNothing()]);
  sets.push(["notifications", NOTIFICATIONS, () => db.insert(t.notifications).values(NOTIFICATIONS.map(m.notificationToRow)).onConflictDoNothing()]);
  const settings = [
    { key: SETTINGS.q1Plan, value: { preset: "base", scenario: { winRate, weeklyGen, slipIn } } },
    { key: SETTINGS.defaultTemplate, value: "graphite" },
  ];
  sets.push(["settings", settings, () => db.insert(t.settings).values(settings).onConflictDoNothing()]);

  for (const [name, rows, run] of sets) {
    await run();
    console.log(`  ✓ ${name.padEnd(14)} ${rows.length}`);
  }
  console.log(reset ? "Database reset and seeded." : "Seed complete (existing rows were left untouched).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
