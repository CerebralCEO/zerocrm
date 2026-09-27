"use client";

import { useUser } from "@clerk/nextjs";
import { AUTH_ENABLED } from "./auth";
import { CURRENT_USER } from "./data";
import { useProfile } from "./profile-store";

export type CurrentUser = {
  name: string;
  email: string;
  /** Job title from the user's profile (null until they add one). */
  role: string | null;
  team: string | null;
  region: string | null;
  phone: string | null;
  timezone: string | null;
  bio: string | null;
  imageUrl?: string;
};

type ClerkGlobal = { Clerk?: { user?: { fullName?: string | null; primaryEmailAddress?: { emailAddress: string } | null } | null } };
/** Name recorded on system events (who moved the deal, recorded the payment…): the signed-in user, else the demo persona. */
export function currentActor() {
  if (typeof window === "undefined") return CURRENT_USER.name;
  const p = useProfile.getState().profile;
  if (p) return `${p.firstName} ${p.lastName}`.trim();
  const user = (window as unknown as ClerkGlobal).Clerk?.user;
  return user?.fullName || user?.primaryEmailAddress?.emailAddress || CURRENT_USER.name;
}

function useDemoUser(): CurrentUser {
  return { ...CURRENT_USER, team: "Leadership", region: "North America", timezone: null, bio: null };
}

function useSignedInUser(): CurrentUser {
  const { user } = useUser();
  const profile = useProfile((s) => s.profile);
  const fromProfile = profile ? `${profile.firstName} ${profile.lastName}`.trim() : "";
  const email = profile?.email || user?.primaryEmailAddress?.emailAddress || "";
  return {
    name: fromProfile || user?.fullName || email || "Signed in",
    email,
    role: profile?.jobTitle ?? null,
    team: profile?.team ?? null,
    region: profile?.region ?? null,
    phone: profile?.phone ?? user?.primaryPhoneNumber?.phoneNumber ?? null,
    timezone: profile?.timezone ?? null,
    bio: profile?.bio ?? null,
    imageUrl: user?.hasImage ? user.imageUrl : (profile?.imageUrl ?? undefined),
  };
}

/** The signed-in user (Clerk + saved profile), or the demo persona when auth isn't configured. Chosen once at module load. */
export const useCurrentUser = AUTH_ENABLED ? useSignedInUser : useDemoUser;
