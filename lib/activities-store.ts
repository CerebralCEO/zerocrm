"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistOptions, track } from "./persist";
import { ACTIVITIES, type Activity, type ActivityKind } from "./activities";

export type ActivityRange = 7 | 30 | 90;

type ActivitiesState = {
  activities: Activity[];
  /** System events (deal moves, payments…) kept apart so rep activity counts stay honest. */
  events: Activity[];
  kindFilter: ActivityKind | null;
  ownerFilter: string | null;
  range: ActivityRange;
  logOpen: boolean;
  /** Prefill for the Log Activity form (e.g. opened from a contact). */
  logDefaults: { companyId?: string; title?: string } | null;
  lastAddedId: string | null;

  setKindFilter: (k: ActivityKind | null) => void;
  setOwnerFilter: (id: string | null) => void;
  setRange: (r: ActivityRange) => void;
  setLogOpen: (open: boolean) => void;
  openLog: (defaults?: { companyId?: string; title?: string }) => void;
  toggleDone: (id: string) => void;
  addActivity: (a: Omit<Activity, "id">) => void;
  addEvent: (a: Omit<Activity, "id">) => void;
};

export const useActivities = track(
  create<ActivitiesState>()(
    persist(
      (set) => ({
        activities: ACTIVITIES,
        events: [],
        kindFilter: null,
        ownerFilter: null,
        range: 30,
        logOpen: false,
        logDefaults: null,
        lastAddedId: null,

        setKindFilter: (kindFilter) => set({ kindFilter }),
        setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
        setRange: (range) => set({ range }),
        setLogOpen: (logOpen) => set(logOpen ? { logOpen } : { logOpen, logDefaults: null }),
        openLog: (defaults) => set({ logOpen: true, logDefaults: defaults ?? null }),
        toggleDone: (id) => set((s) => ({ activities: s.activities.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) })),
        addActivity: (a) =>
          set((s) => {
            const id = `a-new-${s.activities.length}-${a.at}`;
            return { activities: [...s.activities, { ...a, id }], lastAddedId: id };
          }),
        addEvent: (a) =>
          set((s) => {
            const id = `e-${Date.now().toString(36)}-${s.events.length}`;
            return { events: [...s.events, { ...a, id, system: true }], lastAddedId: id };
          }),
      }),
      persistOptions<ActivitiesState, "activities" | "events">("activities", ["activities", "events"]),
    ),
  ),
);
