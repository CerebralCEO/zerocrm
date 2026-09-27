"use client";

import { create } from "zustand";
import type { StageId } from "./deals";
import type { CloseWindow } from "./pipelines";

type PipelinesState = {
  window: CloseWindow;
  ownerFilter: string | null;
  /** Funnel stage picked to focus the deal list. */
  stageFilter: StageId | null;
  /** Map / territory site picked to focus the deal list. */
  siteFilter: string | null;
  setWindow: (w: CloseWindow) => void;
  setOwnerFilter: (id: string | null) => void;
  setStageFilter: (s: StageId | null) => void;
  setSiteFilter: (id: string | null) => void;
  /** Clear the focus filters when switching pipelines. */
  resetFocus: () => void;
};

export const usePipelines = create<PipelinesState>((set) => ({
  window: "all",
  ownerFilter: null,
  stageFilter: null,
  siteFilter: null,
  setWindow: (window) => set({ window }),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  setStageFilter: (stageFilter) => set({ stageFilter }),
  setSiteFilter: (siteFilter) => set({ siteFilter }),
  resetFocus: () => set({ stageFilter: null, siteFilter: null }),
}));
