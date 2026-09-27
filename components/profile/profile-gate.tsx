"use client";

import { useState } from "react";
import type { UserProfile } from "@/db/snapshot";
import { useProfile } from "@/lib/profile-store";
import { OnboardingModal } from "./onboarding-modal";

/**
 * Seeds the signed-in user's profile from the server and shows onboarding
 * until they save it (new accounts, including Google sign-ups).
 */
export function ProfileGate({ profile, required }: { profile: UserProfile | null; required: boolean }) {
  useState(() => {
    useProfile.setState({ profile, required });
    return null;
  });
  return <OnboardingModal />;
}
