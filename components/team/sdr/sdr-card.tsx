"use client";

import { ArrowUpRight } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import { ownerById } from "@/lib/data";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";
import { Tag } from "@/components/primitives/tag";
import { STATUS_TONE, toSpark } from "../use-team-data";
import type { SdrMetrics } from "./use-sdr-data";

function Figure({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-[7px]">
      <span className="text-[11px] leading-none text-fg-muted">{label}</span>
      <span className="truncate text-[14px] leading-none font-medium text-fg tabular-nums">{value}</span>
    </div>
  );
}

/** SDR card ({components.rep-card} — meetings variant). */
export function SdrCard({ r, rank }: { r: SdrMetrics; rank: number }) {
  const openRep = useTeams((s) => s.openRepSheet);
  const partner = ownerById(r.member.partnerId);

  return (
    <article
      tabIndex={0}
      onClick={() => openRep(r.member.id)}
      onKeyDown={(e) => e.key === "Enter" && openRep(r.member.id)}
      aria-label={`${r.member.name}, ${r.meetings} of ${r.member.meetingQuota} meetings`}
      className="group flex cursor-pointer flex-col rounded-lg border border-line-card bg-card p-4 outline-none transition-[border-color,background-color] duration-200 hover:border-[#3a3c3f] focus-visible:border-[#55585c] active:bg-[#1e2023]"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar name={r.member.name} size={44} />
          <span className="absolute -right-1 -bottom-1 flex size-[18px] items-center justify-center rounded-full border-2 border-card bg-muted-surface text-[10px] font-semibold text-fg-soft tabular-nums">
            {rank}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[7px] pt-[3px]">
          <span className="truncate text-[15px] leading-none font-medium text-fg">{r.member.name}</span>
          <span className="truncate text-[12px] leading-none text-fg-soft/80">
            {r.member.title} · {r.member.territory}
          </span>
        </div>
        <Tag tone={STATUS_TONE[r.status]} className="h-5 shrink-0 px-[7px] text-[12px]">
          {r.status}
        </Tag>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-[7px]">
          <span className="text-[11px] leading-none text-fg-muted">Meetings booked</span>
          <span className="text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg tabular-nums">
            {r.meetings}
            <span className="text-[18px] text-[#7f7f7f]">/{r.member.meetingQuota}</span>
          </span>
        </div>
        <span className="pb-[2px] text-right text-[12px] leading-[16px] text-fg-muted tabular-nums">
          <span className="text-fg-soft">{r.attainment}%</span> of quota
          <br />
          pacing <span className={cn(r.projectedPct >= 100 ? "text-meter-green" : "text-fg-soft")}>{r.projectedPct}%</span>
        </span>
      </div>
      <SegmentedMeter value={Math.min(r.attainment, 100)} segments={34} variant="bar" className="mt-3" />

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line-card pt-4">
        <Figure label="Calls" value={formatNumber(r.calls)} />
        <Figure label="Emails" value={formatNumber(r.emails)} />
        <Figure label="Connect rate" value={`${r.connectRate}%`} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex min-w-0 flex-col gap-[6px]">
          <span className="flex min-w-0 items-center gap-[6px] text-[12px] leading-none text-fg-soft">
            <Avatar name={partner.name} size={16} />
            <span className="truncate">Books for {partner.name}</span>
          </span>
          <span className="text-[12px] leading-none text-fg-muted tabular-nums">
            <span className="text-fg-soft">{formatCompactCurrency(r.sourcedValue)}</span> sourced · {r.sourcedDeals.length} deals
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-[5px]">
          <Sparkline data={toSpark(r.member.weekly)} />
          <span className="text-[10px] leading-none text-fg-muted">14 wk meetings</span>
        </span>
      </div>

      <span className="mt-3 flex items-center gap-1 text-[12px] leading-none text-fg-muted transition-colors group-hover:text-fg-soft">
        Open profile
        <ArrowUpRight className="size-[12px]" strokeWidth={2} />
      </span>
    </article>
  );
}
