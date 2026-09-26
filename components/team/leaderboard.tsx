"use client";

import { useTeams } from "@/lib/teams-store";
import { ownerById } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Panel } from "@/components/forecast/panel";
import type { RepMetrics } from "./use-team-data";

/** Reps ranked by attainment ({components.leaderboard-row}). */
export function Leaderboard({ reps }: { reps: RepMetrics[] }) {
  const openRep = useTeams((s) => s.openRepSheet);
  const ranked = [...reps].sort((a, b) => b.attainment - a.attainment || b.projectedPct - a.projectedPct);

  return (
    <Panel title="Leaderboard" subtitle="Ranked by quota attainment this period">
      <div className="mt-3 flex flex-col">
        <div className="hidden h-8 items-center gap-3 border-b border-line text-[12px] leading-none text-fg-muted sm:flex">
          <span className="w-4" />
          <span className="flex-1">Rep</span>
          <span className="w-[96px] text-right max-md:hidden">Closed</span>
          <span className="w-[114px]">Attainment</span>
          <span className="w-[64px] text-right">Projected</span>
          <span className="w-[56px] text-right max-lg:hidden">Activity</span>
        </div>
        {ranked.map((r, i) => {
          const owner = ownerById(r.member.ownerId);
          return (
            <button
              key={r.member.ownerId}
              type="button"
              onClick={() => openRep(r.member.ownerId)}
              className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover"
            >
              <span className="w-4 text-[12px] text-fg-muted tabular-nums">{i + 1}</span>
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <Avatar name={owner.name} size={20} />
                <span className="truncate font-medium">{owner.name}</span>
              </span>
              <span className="w-[96px] text-right tabular-nums max-md:hidden">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(r.closed)}
              </span>
              <span className="flex w-[114px] items-center gap-2 max-sm:w-auto">
                <SegmentedMeter value={Math.min(r.attainment, 100)} />
                <span className="w-[32px] text-right tabular-nums">{r.attainment}%</span>
              </span>
              <span className={`w-[64px] text-right tabular-nums max-sm:hidden ${r.projectedPct >= 100 ? "text-meter-green" : "text-fg-soft"}`}>
                {r.projectedPct}%
              </span>
              <span className="w-[56px] text-right text-fg-soft tabular-nums max-lg:hidden">{r.activity7d}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
