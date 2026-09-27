"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistOptions, track } from "./persist";
import { SCENARIOS, type Scenario, type ScenarioId } from "./q1";

type Q1State = {
  preset: ScenarioId | "custom";
  scenario: Scenario;
  ownerFilter: string | null;
  setPreset: (id: ScenarioId) => void;
  tune: (patch: Partial<Scenario>) => void;
  setOwnerFilter: (id: string | null) => void;
};

const pick = ({ winRate, weeklyGen, slipIn }: Scenario): Scenario => ({ winRate, weeklyGen, slipIn });

export const useQ1 = track(
  create<Q1State>()(
    persist(
      (set) => ({
        preset: "base",
        scenario: pick(SCENARIOS.base),
        ownerFilter: null,
        setPreset: (preset) => set({ preset, scenario: pick(SCENARIOS[preset]) }),
        // Moving a slider leaves the preset: the plan is now the user's own.
        tune: (patch) => set((s) => ({ preset: "custom", scenario: { ...s.scenario, ...patch } })),
        setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
      }),
      persistOptions<Q1State, "preset" | "scenario">("q1-plan", ["preset", "scenario"]),
    ),
  ),
);
