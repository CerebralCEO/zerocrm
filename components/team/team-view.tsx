"use client";

import type { TeamId } from "@/lib/teams";
import { TeamSummary } from "./team-summary";
import { RepCard } from "./rep-card";
import { Leaderboard } from "./leaderboard";
import { AccountsCoverage } from "./accounts-coverage";
import { useTeamData } from "./use-team-data";

/** Team page body: KPI strip → rep cards → leaderboard + accounts. Reused by every team. */
export function TeamView({ teamId }: { teamId: TeamId }) {
  const { reps, team } = useTeamData(teamId);
  const rank = new Map(
    [...reps].sort((a, b) => b.attainment - a.attainment || b.projectedPct - a.projectedPct).map((r, i) => [r.member.ownerId, i + 1]),
  );

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <TeamSummary teamId={teamId} />
      <section className="border-b border-line px-4 pt-[18px] pb-4">
        <header className="mb-4 flex flex-col gap-[7px]">
          <h2 className="text-[14px] font-medium leading-none text-fg">Reps</h2>
          <p className="text-[12px] leading-none text-fg-muted">{team?.description}</p>
        </header>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
          {reps.map((r) => (
            <RepCard key={r.member.ownerId} r={r} rank={rank.get(r.member.ownerId) ?? 0} />
          ))}
        </div>
      </section>
      <div className="grid xl:grid-cols-2">
        <div className="min-w-0 border-line xl:border-r">
          <Leaderboard reps={reps} />
        </div>
        <div className="min-w-0 border-line max-xl:border-t">
          <AccountsCoverage reps={reps} title={team?.accountsLabel ?? "Accounts"} />
        </div>
      </div>
    </div>
  );
}
