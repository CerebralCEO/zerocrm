"use client";

import { create } from "zustand";
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

export const useQ1 = create<Q1State>((set) => ({
  preset: "base",
  scenario: pick(SCENARIOS.base),
  ownerFilter: null,
  setPreset: (preset) => set({ preset, scenario: pick(SCENARIOS[preset]) }),
  // Moving a slider leaves the preset: the plan is now the user's own.
  tune: (patch) => set((s) => ({ preset: "custom", scenario: { ...s.scenario, ...patch } })),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
}));
