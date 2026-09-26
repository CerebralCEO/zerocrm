"use client";

import { create } from "zustand";
import {
  COMPANIES,
  NOTIFICATIONS,
  buildDetails,
  type Company,
  type InteractionType,
  type Notification,
  type Tag,
} from "./data";

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
  markRead: (id: string) => void;
};

export const useCrm = create<CrmState>((set) => ({
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
  addCompany: (input) =>
    set((s) => {
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
      return { companies: [company, ...s.companies], lastAddedId: id };
    }),
  updateCompany: (id, patch) =>
    set((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, unread: false })) })),
  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    })),
}));

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
