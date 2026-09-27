"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistOptions, track } from "./persist";
import type { PeriodId } from "./forecast";

export type ForecastCall = { commit: number; bestCase: number; note: string; submittedAt: string };

type ForecastState = {
  period: PeriodId;
  ownerFilter: string | null;
  call: Partial<Record<PeriodId, ForecastCall>>;
  submitOpen: boolean;
  setPeriod: (p: PeriodId) => void;
  setOwnerFilter: (id: string | null) => void;
  setSubmitOpen: (open: boolean) => void;
  submitCall: (period: PeriodId, call: ForecastCall) => void;
};

export const useForecast = track(
  create<ForecastState>()(
    persist(
      (set) => ({
        period: "fq3",
        ownerFilter: null,
        call: {},
        submitOpen: false,
        setPeriod: (period) => set({ period }),
        setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
        setSubmitOpen: (submitOpen) => set({ submitOpen }),
        submitCall: (period, call) => set((s) => ({ call: { ...s.call, [period]: call } })),
      }),
      persistOptions<ForecastState, "call">("forecast", ["call"]),
    ),
  ),
);
