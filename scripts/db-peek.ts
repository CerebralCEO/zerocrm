/** Print a few rows to confirm what the app wrote (dev helper). Usage: tsx scripts/db-peek.ts <dealId> */
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc } from "drizzle-orm";
import * as t from "../db/schema";

async function main() {
  const db = drizzle(neon(process.env.DATABASE_URL!), { schema: t });
  const id = process.argv[2] ?? "d-apple-pilot";
  const [deal] = await db.select().from(t.deals).where(eq(t.deals.id, id));
  console.log("deal:", deal && { id: deal.id, value: deal.value, stage: deal.stage, closeDate: deal.closeDate, updatedAt: deal.updatedAt });
  const events = await db.select().from(t.activities).where(eq(t.activities.system, true)).orderBy(desc(t.activities.createdAt)).limit(3);
  console.log("latest events:", events.map((e) => `${e.actor} ${e.title} — ${e.body}`));
  const pushes = await db.select().from(t.slipPushes).where(eq(t.slipPushes.dealId, id));
  console.log("pushes:", pushes.map((p) => `${p.fromDate}→${p.toDate} ${p.reason}`));
}
main();
