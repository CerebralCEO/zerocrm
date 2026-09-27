"use client";

import { create } from "zustand";
import { DEALS, stageById, type Deal, type StageId } from "./deals";

export type DealSort = "value" | "closeDate" | "probability" | "recent";
export type CloseWindow = "all" | "month" | "30d" | "90d" | "overdue";

export type NewDealInput = Omit<Deal, "id" | "lastTouch" | "activity">;

/** "Today" for the demo data — keeps overdue / window filters stable. */
export const TODAY = "2026-09-27";

type DealsState = {
  deals: Deal[];
  sortBy: DealSort;
  ownerFilter: string | null;
  closeWindow: CloseWindow;
  openDealId: string | null;
  newDealOpen: boolean;
  newDealStage: StageId;
  /** Close date to prefill (e.g. a Q1 date from the Q1 plan); null = 30 days out. */
  newDealClose: string | null;
  /** Site to sell into (a pipeline page presets its HQ city); null = the company's default site. */
  newDealSite: string | null;
  lastMovedId: string | null;

  moveDeal: (id: string, stage: StageId) => void;
  updateDeal: (id: string, patch: Partial<Deal>) => void;
  addDeal: (input: NewDealInput) => void;
  setSortBy: (s: DealSort) => void;
  setOwnerFilter: (id: string | null) => void;
  setCloseWindow: (w: CloseWindow) => void;
  openDeal: (id: string | null) => void;
  openNewDeal: (stage?: StageId, closeDate?: string, siteId?: string) => void;
  closeNewDeal: () => void;
};

export const useDeals = create<DealsState>((set) => ({
  deals: DEALS,
  sortBy: "value",
  ownerFilter: null,
  closeWindow: "all",
  openDealId: null,
  newDealOpen: false,
  newDealStage: "discovery",
  newDealClose: null,
  newDealSite: null,
  lastMovedId: null,

  moveDeal: (id, stage) =>
    set((s) => ({
      lastMovedId: id,
      deals: s.deals.map((d) => {
        if (d.id !== id || d.stage === stage) return d;
        // Entering a stage resets probability to that stage's default, except
        // when a deal already carries a higher confidence than the new stage.
        const probability =
          stage === "won" ? 100 : d.stage === "won" ? stageById(stage).probability : Math.max(d.probability, stageById(stage).probability);
        return { ...d, stage, probability };
      }),
    })),
  updateDeal: (id, patch) => set((s) => ({ deals: s.deals.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
  addDeal: (input) =>
    set((s) => {
      const id = `d-${input.companyId}-${Date.now().toString(36)}`;
      const deal: Deal = {
        ...input,
        id,
        lastTouch: { type: "Discovery", date: TODAY },
        activity: [{ kind: "note", text: "Deal created", time: "Just now" }],
      };
      return { deals: [deal, ...s.deals], lastMovedId: id };
    }),
  setSortBy: (sortBy) => set({ sortBy }),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  setCloseWindow: (closeWindow) => set({ closeWindow }),
  openDeal: (openDealId) => set({ openDealId }),
  openNewDeal: (stage = "discovery", closeDate, siteId) =>
    set({ newDealOpen: true, newDealStage: stage, newDealClose: closeDate ?? null, newDealSite: siteId ?? null }),
  closeNewDeal: () => set({ newDealOpen: false }),
}));

const DAY = 86_400_000;
const days = (iso: string) => Math.round((Date.parse(iso) - Date.parse(TODAY)) / DAY);

export const isOverdue = (d: Deal) => d.stage !== "won" && days(d.closeDate) < 0;

export function inWindow(d: Deal, w: CloseWindow) {
  const n = days(d.closeDate);
  switch (w) {
    case "month":
      return d.closeDate.slice(0, 7) === TODAY.slice(0, 7);
    case "30d":
      return n >= 0 && n <= 30;
    case "90d":
      return n >= 0 && n <= 90;
    case "overdue":
      return isOverdue(d);
    default:
      return true;
  }
}

export function sortDeals(list: Deal[], by: DealSort) {
  const out = [...list];
  switch (by) {
    case "closeDate":
      return out.sort((a, b) => a.closeDate.localeCompare(b.closeDate));
    case "probability":
      return out.sort((a, b) => b.probability - a.probability);
    case "recent":
      return out.sort((a, b) => b.lastTouch.date.localeCompare(a.lastTouch.date));
    default:
      return out.sort((a, b) => b.value - a.value);
  }
}
