"use client";

import { SdrSummary } from "./sdr-summary";
import { SdrCard } from "./sdr-card";
import { SdrLeaderboard, SourcedPipeline } from "./sdr-panels";
import { useSdrData } from "./use-sdr-data";

/** SDR variant of the team template: meetings are the quota. */
export function SdrView() {
  const { reps, team } = useSdrData();
  const rank = new Map(
    [...reps].sort((a, b) => b.attainment - a.attainment || b.projectedPct - a.projectedPct).map((r, i) => [r.member.id, i + 1]),
  );

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <SdrSummary />
      <section className="border-b border-line px-4 pt-[18px] pb-4">
        <header className="mb-4 flex flex-col gap-[7px]">
          <h2 className="text-[14px] font-medium leading-none text-fg">Reps</h2>
          <p className="text-[12px] leading-none text-fg-muted">{team?.description}</p>
        </header>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
          {reps.map((r) => (
            <SdrCard key={r.member.id} r={r} rank={rank.get(r.member.id) ?? 0} />
          ))}
        </div>
      </section>
      <div className="grid xl:grid-cols-2">
        <div className="min-w-0 border-line xl:border-r">
          <SdrLeaderboard reps={reps} />
        </div>
        <div className="min-w-0 border-line max-xl:border-t">
          <SourcedPipeline reps={reps} />
        </div>
      </div>
    </div>
  );
}
