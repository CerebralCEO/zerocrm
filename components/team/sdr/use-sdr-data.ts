"use client";

import { useMemo } from "react";
import { useDeals, TODAY } from "@/lib/deals-store";
import { useTeams } from "@/lib/teams-store";
import { periodById } from "@/lib/forecast";
import type { Deal } from "@/lib/deals";
import type { SdrMember } from "@/lib/teams";
import type { RepStatus } from "../use-team-data";

export type SdrMetrics = {
  member: SdrMember;
  meetings: number;
  calls: number;
  emails: number;
  connectRate: number;
  attainment: number;
  /** Meetings at the current pace by period end, as % of quota. */
  projectedPct: number;
  status: RepStatus;
  sourcedDeals: Deal[];
  sourcedValue: number;
};

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Live SDR metrics: activity stats from the roster, sourced pipeline from the deals store. */
export function useSdrData() {
  const team = useTeams((s) => s.teams.find((x) => x.id === "sdr"));
  const periodId = useTeams((s) => s.period);
  const sortBy = useTeams((s) => s.sortBy);
  const deals = useDeals((s) => s.deals);

  return useMemo(() => {
    const period = periodById(periodId);
    const span = t(period.end) + DAY - t(period.start);
    // Share of the period already elapsed (0 before it starts, 1 after it ends).
    const elapsed = Math.max(0, Math.min(1, (t(TODAY) + DAY - t(period.start)) / span));
    const members = team?.kind === "sdr" ? team.members : [];

    const reps: SdrMetrics[] = members.map((member) => {
      const s = member.stats[periodId] ?? { meetings: 0, calls: 0, emails: 0, connects: 0 };
      const sourcedDeals = member.sourced.map((id) => deals.find((d) => d.id === id)).filter((d): d is Deal => !!d);
      const attainment = Math.round((s.meetings / member.meetingQuota) * 100);
      const projectedPct = elapsed > 0 ? Math.round((s.meetings / elapsed / member.meetingQuota) * 100) : 0;
      return {
        member,
        meetings: s.meetings,
        calls: s.calls,
        emails: s.emails,
        connectRate: s.calls ? Math.round((s.connects / s.calls) * 100) : 0,
        attainment,
        projectedPct,
        status: projectedPct >= 100 ? "On track" : projectedPct >= 70 ? "At risk" : "Behind",
        sourcedDeals,
        sourcedValue: sourcedDeals.reduce((a, d) => a + d.value, 0),
      };
    });

    const sorted = [...reps].sort((a, b) => {
      switch (sortBy) {
        case "pipeline":
          return b.sourcedValue - a.sourcedValue;
        case "activity":
          return b.calls + b.emails - (a.calls + a.emails);
        case "name":
          return a.member.name.localeCompare(b.member.name);
        default:
          return b.attainment - a.attainment || b.projectedPct - a.projectedPct;
      }
    });

    const quota = reps.reduce((a, r) => a + r.member.meetingQuota, 0);
    const meetings = reps.reduce((a, r) => a + r.meetings, 0);
    const calls = reps.reduce((a, r) => a + r.calls, 0);
    const connects = members.reduce((a, m) => a + (m.stats[periodId]?.connects ?? 0), 0);

    return {
      team: team?.kind === "sdr" ? team : undefined,
      period,
      elapsed,
      reps: sorted,
      totals: {
        quota,
        meetings,
        attainment: quota ? Math.round((meetings / quota) * 100) : 0,
        projectedPct: quota && elapsed > 0 ? Math.round((meetings / elapsed / quota) * 100) : 0,
        sourced: reps.reduce((a, r) => a + r.sourcedValue, 0),
        sourcedDeals: reps.reduce((a, r) => a + r.sourcedDeals.length, 0),
        connectRate: calls ? Math.round((connects / calls) * 100) : 0,
        activities: calls + reps.reduce((a, r) => a + r.emails, 0),
        calls,
      },
    };
  }, [team, periodId, sortBy, deals]);
}
