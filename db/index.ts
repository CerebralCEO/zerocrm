import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const DB_ENABLED = !!process.env.DATABASE_URL;

let client: ReturnType<typeof create> | null = null;
const create = () => drizzle(neon(process.env.DATABASE_URL!), { schema, casing: "snake_case" });

/** Lazily-created Drizzle client over Neon's HTTP driver (serverless-friendly, no pool). */
export function getDb() {
  if (!DB_ENABLED) throw new Error("DATABASE_URL is not set");
  client ??= create();
  return client;
}
