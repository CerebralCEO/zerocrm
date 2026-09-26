"use client";

import { create } from "zustand";
import { useDeals, TODAY } from "./deals-store";
import { SLIP_HISTORY, type Push, type SlipReason, type SlipWindow } from "./slips";

type SlipsState = {
  history: Record<string, Push[]>;
  window: SlipWindow;
  ownerFilter: string | null;
  reviewOpen: boolean;
  /** Deal ids recommitted in this session (the timeline flashes them). */
  recent: string[];
  setWindow: (w: SlipWindow) => void;
  setOwnerFilter: (id: string | null) => void;
  setReviewOpen: (open: boolean) => void;
  /** Move a deal's close date and record the push. */
  recommit: (dealId: string, to: string, reason: SlipReason) => void;
};

export const useSlips = create<SlipsState>((set) => ({
  history: SLIP_HISTORY,
  window: "all",
  ownerFilter: null,
  reviewOpen: false,
  recent: [],
  setWindow: (window) => set({ window }),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  setReviewOpen: (reviewOpen) => set({ reviewOpen }),
  recommit: (dealId, to, reason) => {
    const deals = useDeals.getState();
    const deal = deals.deals.find((d) => d.id === dealId);
    if (!deal || deal.closeDate === to) return;
    deals.updateDeal(dealId, { closeDate: to });
    // Pulling a deal in isn't a slip — only later dates are recorded.
    if (to < deal.closeDate) return;
    set((s) => ({
      history: { ...s.history, [dealId]: [...(s.history[dealId] ?? []), { from: deal.closeDate, to, on: TODAY, reason }] },
      recent: [...s.recent.filter((id) => id !== dealId), dealId],
    }));
  },
}));
