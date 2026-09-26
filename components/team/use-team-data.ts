"use client";

import { useMemo } from "react";
import { useDeals, TODAY } from "@/lib/deals-store";
import { useActivities } from "@/lib/activities-store";
import { useTeams } from "@/lib/teams-store";
import { periodById } from "@/lib/forecast";
import { addDays, dateOf, daysBetween } from "@/lib/activities";
import type { TeamId, TeamMember } from "@/lib/teams";
import { ownerById } from "@/lib/data";
import type { Deal } from "@/lib/deals";

export type RepStatus = "On track" | "At risk" | "Behind";

export type RepMetrics = {
  member: TeamMember;
  closed: number;
  pipeline: number;
  openDeals: Deal[];
  wonDeals: Deal[];
  avgWin: number;
  /** Closed + probability-weighted open pipeline closing in the period. */
  projected: number;
  attainment: number;
  projectedPct: number;
  status: RepStatus;
  activity7d: number;
  weekly: number[]; // 14 weeks, oldest → newest
  topDeal?: Deal;
};

const within = (iso: string, start: string, end: string) => iso >= start && iso <= end;

/** Live per-rep metrics for a team, from the deals and activities stores. */
export function useTeamData(teamId: TeamId) {
  const team = useTeams((s) => s.teams.find((t) => t.id === teamId));
  const periodId = useTeams((s) => s.period);
  const sortBy = useTeams((s) => s.sortBy);
  const deals = useDeals((s) => s.deals);
  const activities = useActivities((s) => s.activities);

  return useMemo(() => {
    const period = periodById(periodId);
    const members = team?.kind === "ae" ? team.members : [];
    const reps: RepMetrics[] = members.map((member) => {
      const mine = deals.filter((d) => d.ownerId === member.ownerId);
      const wonDeals = mine.filter((d) => d.stage === "won" && within(d.closeDate, period.start, period.end));
      const openDeals = mine.filter((d) => d.stage !== "won").sort((a, b) => b.value - a.value);
      const closingInPeriod = openDeals.filter((d) => d.closeDate <= period.end);
      const closed = wonDeals.reduce((s, d) => s + d.value, 0);
      const pipeline = openDeals.reduce((s, d) => s + d.value, 0);
      const avgWin = openDeals.length ? Math.round(openDeals.reduce((s, d) => s + d.probability, 0) / openDeals.length) : 0;
      const projected = Math.round(closed + closingInPeriod.reduce((s, d) => s + (d.value * d.probability) / 100, 0));
      const attainment = Math.round((closed / member.quota) * 100);
      const projectedPct = Math.round((projected / member.quota) * 100);
      const status: RepStatus = projectedPct >= 100 ? "On track" : projectedPct >= 70 ? "At risk" : "Behind";
      const done = activities.filter((a) => a.ownerId === member.ownerId && a.done && dateOf(a.at) <= TODAY);
      const activity7d = done.filter((a) => daysBetween(dateOf(a.at), TODAY) < 7).length;
      const weekly = Array.from({ length: 14 }, (_, i) => {
        const end = addDays(TODAY, -(13 - i) * 7);
        const start = addDays(end, -6);
        return done.filter((a) => within(dateOf(a.at), start, end)).length;
      });
      return {
        member,
        closed,
        pipeline,
        openDeals,
        wonDeals,
        avgWin,
        projected,
        attainment,
        projectedPct,
        status,
        activity7d,
        weekly,
        topDeal: openDeals[0],
      };
    });

    const sorted = [...reps].sort((a, b) => {
      switch (sortBy) {
        case "pipeline":
          return b.pipeline - a.pipeline;
        case "activity":
          return b.activity7d - a.activity7d;
        case "name":
          return ownerById(a.member.ownerId).name.localeCompare(ownerById(b.member.ownerId).name);
        default:
          return b.attainment - a.attainment || b.projectedPct - a.projectedPct;
      }
    });

    const quota = reps.reduce((s, r) => s + r.member.quota, 0);
    const closed = reps.reduce((s, r) => s + r.closed, 0);
    const pipeline = reps.reduce((s, r) => s + r.pipeline, 0);
    const projected = reps.reduce((s, r) => s + r.projected, 0);
    const open = reps.flatMap((r) => r.openDeals);
    const avgWin = open.length ? Math.round(open.reduce((s, d) => s + d.probability, 0) / open.length) : 0;

    return {
      team: team?.kind === "ae" ? team : undefined,
      period,
      reps: sorted,
      totals: {
        quota,
        closed,
        pipeline,
        projected,
        avgWin,
        attainment: quota ? Math.round((closed / quota) * 100) : 0,
        coverage: quota - closed > 0 ? pipeline / (quota - closed) : Infinity,
        activity7d: reps.reduce((s, r) => s + r.activity7d, 0),
      },
    };
  }, [team, periodId, sortBy, deals, activities]);
}

export const STATUS_TONE: Record<RepStatus, "land" | "yellow" | "red"> = {
  "On track": "land",
  "At risk": "yellow",
  Behind: "red",
};

/** Scale raw counts into Sparkline pixel heights (max 14). */
export const toSpark = (values: number[]) => {
  const max = Math.max(...values, 1);
  return values.map((v) => Math.round((v / max) * 14));
};
