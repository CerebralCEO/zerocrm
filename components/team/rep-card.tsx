"use client";

import { ArrowUpRight } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import { useCrm } from "@/lib/store";
import { ownerById } from "@/lib/data";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";
import { Tag } from "@/components/primitives/tag";
import { STATUS_TONE, toSpark, type RepMetrics } from "./use-team-data";

function Figure({ label, value, muted }: { label: string; value: React.ReactNode; muted?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-[7px]">
      <span className="text-[11px] leading-none text-fg-muted">{label}</span>
      <span className={cn("truncate text-[14px] leading-none font-medium tabular-nums", muted ? "text-fg-soft" : "text-fg")}>{value}</span>
    </div>
  );
}

/** Rep "player card" ({components.rep-card}). */
export function RepCard({ r, rank }: { r: RepMetrics; rank: number }) {
  const openRep = useTeams((s) => s.openRepSheet);
  const topCompany = useCrm((s) => (r.topDeal ? s.companies.find((c) => c.id === r.topDeal!.companyId) : undefined));
  const owner = ownerById(r.member.ownerId);

  return (
    <article
      tabIndex={0}
      onClick={() => openRep(r.member.ownerId)}
      onKeyDown={(e) => e.key === "Enter" && openRep(r.member.ownerId)}
      aria-label={`${owner.name}, ${r.attainment}% of quota`}
      className="group flex cursor-pointer flex-col rounded-lg border border-line-card bg-card p-4 outline-none transition-[border-color,background-color] duration-200 hover:border-[#3a3c3f] focus-visible:border-[#55585c] active:bg-[#1e2023]"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar name={owner.name} size={44} />
          <span className="absolute -right-1 -bottom-1 flex size-[18px] items-center justify-center rounded-full border-2 border-card bg-muted-surface text-[10px] font-semibold text-fg-soft tabular-nums">
            {rank}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[7px] pt-[3px]">
          <span className="truncate text-[15px] leading-none font-medium text-fg">{owner.name}</span>
          <span className="truncate text-[12px] leading-none text-fg-soft/80">
            {r.member.title} · {r.member.territory}
          </span>
        </div>
        <Tag tone={STATUS_TONE[r.status]} className="h-5 shrink-0 px-[7px] text-[12px]">
          {r.status}
        </Tag>
      </div>

      {/* Quota attainment — the hero of the card */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex flex-col gap-[7px]">
          <span className="text-[11px] leading-none text-fg-muted">Quota attainment</span>
          <span className="text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg tabular-nums">
            {r.attainment}
            <span className="text-[18px] text-[#7f7f7f]">%</span>
          </span>
        </div>
        <span className="pb-[2px] text-right text-[12px] leading-[16px] text-fg-muted tabular-nums">
          <span className="text-fg-soft">{formatCompactCurrency(r.closed)}</span> of {formatCompactCurrency(r.member.quota)}
          <br />
          projected <span className={r.projectedPct >= 100 ? "text-meter-green" : "text-fg-soft"}>{r.projectedPct}%</span>
        </span>
      </div>
      <SegmentedMeter value={Math.min(r.attainment, 100)} segments={34} variant="bar" className="mt-3" />

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line-card pt-4">
        <Figure label="Pipeline" value={formatCompactCurrency(r.pipeline)} />
        <Figure label="Avg win" value={`${r.avgWin}%`} />
        <Figure label="Activity 7d" value={formatNumber(r.activity7d)} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        {r.topDeal ? (
          <span className="flex min-w-0 items-center gap-[6px] text-[12px] leading-none text-fg-soft">
            <CompanyLogo id={r.topDeal.companyId} src={topCompany?.logo} size={16} glyph={9} radius={4} />
            <span className="truncate">{r.topDeal.title}</span>
            <span className="shrink-0 text-fg-muted tabular-nums">{formatCompactCurrency(r.topDeal.value)}</span>
          </span>
        ) : (
          <span className="text-[12px] leading-none text-fg-muted">No open deals</span>
        )}
        <span className="flex shrink-0 flex-col items-end gap-[5px]">
          <Sparkline data={toSpark(r.weekly)} />
          <span className="text-[10px] leading-none text-fg-muted">14 wk activity</span>
        </span>
      </div>

      <span className="mt-3 flex items-center gap-1 text-[12px] leading-none text-fg-muted transition-colors group-hover:text-fg-soft">
        Open profile
        <ArrowUpRight className="size-[12px]" strokeWidth={2} />
      </span>
    </article>
  );
}
