"use client";

import { create } from "zustand";
import { TEAMS, type SdrMember, type Team, type TeamId, type TeamMember } from "./teams";
import type { PeriodId } from "./forecast";

export type RepSort = "attainment" | "pipeline" | "activity" | "name";

type TeamsState = {
  teams: Team[];
  period: PeriodId;
  sortBy: RepSort;
  openRep: string | null;
  addOpen: boolean;

  setPeriod: (p: PeriodId) => void;
  setSortBy: (s: RepSort) => void;
  openRepSheet: (ownerId: string | null) => void;
  setAddOpen: (open: boolean) => void;
  addMember: (teamId: TeamId, member: TeamMember) => void;
  addSdr: (teamId: TeamId, member: SdrMember) => void;
};

export const useTeams = create<TeamsState>((set) => ({
  teams: TEAMS,
  period: "fq3",
  sortBy: "attainment",
  openRep: null,
  addOpen: false,

  setPeriod: (period) => set({ period }),
  setSortBy: (sortBy) => set({ sortBy }),
  openRepSheet: (openRep) => set({ openRep }),
  setAddOpen: (addOpen) => set({ addOpen }),
  addMember: (teamId, member) =>
    set((s) => ({
      teams: s.teams.map((t) =>
        t.id === teamId && t.kind === "ae" && !t.members.some((m) => m.ownerId === member.ownerId)
          ? { ...t, members: [...t.members, member] }
          : t,
      ),
    })),
  addSdr: (teamId, member) =>
    set((s) => ({
      teams: s.teams.map((t) => (t.id === teamId && t.kind === "sdr" ? { ...t, members: [...t.members, member] } : t)),
    })),
}));
