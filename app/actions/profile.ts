"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { DB_ENABLED, getDb } from "@/db";
import * as t from "@/db/schema";
import type { UserProfile } from "@/db/snapshot";

const clean = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Save the signed-in user's profile (onboarding modal / edit profile) to Neon,
 * and keep their Clerk name in step. The user id always comes from the
 * session, never from the client.
 */
export async function saveProfile(input: UserProfile): Promise<{ ok: boolean; error?: string; profile?: UserProfile }> {
  if (!DB_ENABLED) return { ok: false, error: "Database not configured" };
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Not signed in" };

  const profile: UserProfile = {
    firstName: clean(input.firstName, 60),
    lastName: clean(input.lastName, 60),
    email: clean(input.email, 160),
    imageUrl: clean(input.imageUrl, 500) || null,
    jobTitle: clean(input.jobTitle, 80),
    team: clean(input.team, 60),
    region: clean(input.region, 60),
    phone: clean(input.phone, 40) || null,
    timezone: clean(input.timezone, 60) || "UTC",
    bio: clean(input.bio, 280) || null,
  };
  if (!profile.firstName) return { ok: false, error: "First name is required." };
  if (!profile.jobTitle) return { ok: false, error: "Role is required." };
  if (!profile.team || !profile.region) return { ok: false, error: "Pick a team and a region." };

  await getDb()
    .insert(t.userProfiles)
    .values({ userId, ...profile })
    .onConflictDoUpdate({ target: t.userProfiles.userId, set: { ...profile, updatedAt: new Date() } });

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, { firstName: profile.firstName, lastName: profile.lastName || undefined });
  } catch (e) {
    // The profile is saved; a Clerk name sync failure shouldn't block onboarding.
    console.warn("[profile] Clerk name sync failed", e);
  }
  return { ok: true, profile };
}
