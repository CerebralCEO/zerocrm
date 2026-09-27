"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistOptions, track } from "./persist";
import { COMPANIES, NOTIFICATIONS, buildDetails, type Company, type InteractionType, type Notification, type Tag } from "./data";
import { useDeals, TODAY } from "./deals-store";
import type { StageId } from "./deals";
import { emit } from "./events";
import { formatCompactCurrency } from "./utils";

export type SortKey = "pipelineValue" | "winProbability" | "openDeals" | "name" | "lastInteraction";
export type ActivityWindow = "30 Days" | "90 Days" | "6 Months" | "12 Months";

export type NewCompanyInput = {
  name: string;
  logo?: string;
  segment: Tag;
  stage: Tag;
  ownerId: string;
  pipelineValue: number;
  openDeals: number;
  winProbability: number;
  date: string;
  type: InteractionType;
};

type CrmState = {
  companies: Company[];
  selected: Set<string>;
  sortBy: SortKey;
  ownerFilter: string | null;
  stageFilter: Tag | null;
  activityWindow: ActivityWindow;
  detailId: string | null;
  newCompanyOpen: boolean;
  profileOpen: boolean;
  searchOpen: boolean;
  navOpen: boolean;
  lastAddedId: string | null;
  notifications: Notification[];

  toggleSelected: (id: string) => void;
  setAllSelected: (ids: string[], value: boolean) => void;
  setSortBy: (key: SortKey) => void;
  setOwnerFilter: (id: string | null) => void;
  setStageFilter: (tag: Tag | null) => void;
  setActivityWindow: (w: ActivityWindow) => void;
  openDetail: (id: string | null) => void;
  setNewCompanyOpen: (open: boolean) => void;
  setProfileOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setNavOpen: (open: boolean) => void;
  addCompany: (input: NewCompanyInput) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  markAllRead: () => void;
  pushNotification: (n: Omit<Notification, "id" | "unread">) => void;
  markRead: (id: string) => void;
};

export const useCrm = track(
  create<CrmState>()(
    persist(
      (set) => ({
        companies: COMPANIES,
        selected: new Set(["microsoft"]),
        sortBy: "pipelineValue",
        ownerFilter: null,
        stageFilter: null,
        activityWindow: "90 Days",
        detailId: null,
        newCompanyOpen: false,
        profileOpen: false,
        searchOpen: false,
        navOpen: false,
        lastAddedId: null,
        notifications: NOTIFICATIONS,

        toggleSelected: (id) =>
          set((s) => {
            const next = new Set(s.selected);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return { selected: next };
          }),
        setAllSelected: (ids, value) =>
          set((s) => {
            const next = new Set(s.selected);
            ids.forEach((id) => (value ? next.add(id) : next.delete(id)));
            return { selected: next };
          }),
        setSortBy: (sortBy) => set({ sortBy }),
        setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
        setStageFilter: (stageFilter) => set({ stageFilter }),
        setActivityWindow: (activityWindow) => set({ activityWindow }),
        openDetail: (detailId) => set({ detailId }),
        setNewCompanyOpen: (newCompanyOpen) => set({ newCompanyOpen }),
        setProfileOpen: (profileOpen) => set({ profileOpen }),
        setSearchOpen: (searchOpen) => set({ searchOpen }),
        setNavOpen: (navOpen) => set({ navOpen }),
        addCompany: (input) => {
          const id = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
          const company: Company = {
            id,
            name: input.name,
            logo: input.logo,
            tags: input.segment === input.stage ? [input.segment] : [input.segment, input.stage],
            ownerId: input.ownerId,
            openDeals: input.openDeals,
            pipelineValue: input.pipelineValue,
            winProbability: input.winProbability,
            activity: [2, 2, 3, 2, 2, 4, 5, 3, 6, 4, 7, 5, 6, 9],
            lastInteraction: { date: input.date, type: input.type },
            ...buildDetails(id, input.winProbability),
          };
          set((s) => ({ companies: [company, ...s.companies], lastAddedId: id }));
          // A company's pipeline is its deals: open the value it was created with as real deals.
          if (input.pipelineValue > 0) {
            const n = Math.max(1, input.openDeals);
            const stage: StageId =
              input.winProbability >= 75
                ? "negotiation"
                : input.winProbability >= 55
                  ? "proposal"
                  : input.winProbability >= 35
                    ? "qualified"
                    : "discovery";
            const close = new Date(Date.parse(`${TODAY}T00:00:00Z`) + 45 * 86_400_000).toISOString().slice(0, 10);
            const each = Math.floor(input.pipelineValue / n);
            for (let i = 0; i < n; i++) {
              useDeals.getState().addDeal(
                {
                  companyId: id,
                  title: n === 1 ? `${input.name} — ${input.stage}` : `${input.name} — ${input.stage} ${i + 1}`,
                  value: i === n - 1 ? input.pipelineValue - each * (n - 1) : each,
                  stage,
                  ownerId: input.ownerId,
                  probability: input.winProbability,
                  closeDate: close,
                  nextStep: "Schedule a discovery call",
                  lastTouch: { date: input.date, type: input.type },
                },
                { silent: true },
              );
            }
          }
          emit({
            text: `added ${input.name}`,
            body: input.pipelineValue
              ? `${formatCompactCurrency(input.pipelineValue)} pipeline across ${Math.max(1, input.openDeals)} deals`
              : "New account",
            companyId: id,
            ownerId: input.ownerId,
            notify: true,
          });
        },
        updateCompany: (id, patch) => set((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
        pushNotification: (n) =>
          set((s) => ({
            notifications: [{ ...n, id: `n-${Date.now().toString(36)}-${s.notifications.length}`, unread: true }, ...s.notifications].slice(0, 40),
          })),
        markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, unread: false })) })),
        markRead: (id) =>
          set((s) => ({
            notifications: s.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
          })),
      }),
      persistOptions<CrmState, "companies" | "notifications">("companies", ["companies", "notifications"]),
    ),
  ),
);

export function sortCompanies(list: Company[], key: SortKey) {
  const out = [...list];
  switch (key) {
    case "name":
      return out.sort((a, b) => a.name.localeCompare(b.name));
    case "lastInteraction":
      return out.sort((a, b) => b.lastInteraction.date.localeCompare(a.lastInteraction.date));
    default:
      return out.sort((a, b) => b[key] - a[key]);
  }
}
