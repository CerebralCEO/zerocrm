"use client";

import { create } from "zustand";
import type { UserProfile } from "@/db/snapshot";

type ProfileState = {
  /** The signed-in user's saved profile (from Neon); null until onboarding is done. */
  profile: UserProfile | null;
  /** Onboarding is required (signed in with a database) — the modal can't be dismissed without a profile. */
  required: boolean;
  editorOpen: boolean;
  setProfile: (p: UserProfile) => void;
  openEditor: (open: boolean) => void;
};

export const useProfile = create<ProfileState>((set) => ({
  profile: null,
  required: false,
  editorOpen: false,
  setProfile: (profile) => set({ profile, editorOpen: false }),
  openEditor: (editorOpen) => set({ editorOpen }),
}));
