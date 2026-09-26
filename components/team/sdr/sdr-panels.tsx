"use client";

import { useTeams } from "@/lib/teams-store";
import { useDeals } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { stageById } from "@/lib/deals";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag } from "@/components/primitives/tag";
import { Panel } from "@/components/forecast/panel";
import type { SdrMetrics } from "./use-sdr-data";

/** SDRs ranked by meeting attainment. */
export function SdrLeaderboard({ reps }: { reps: SdrMetrics[] }) {
  const openRep = useTeams((s) => s.openRepSheet);
  const ranked = [...reps].sort((a, b) => b.attainment - a.attainment || b.projectedPct - a.projectedPct);
  return (
    <Panel title="Leaderboard" subtitle="Ranked by meetings booked vs. quota">
      <div className="mt-3 flex flex-col">
        <div className="hidden h-8 items-center gap-3 border-b border-line text-[12px] leading-none text-fg-muted sm:flex">
          <span className="w-4" />
          <span className="flex-1">Rep</span>
          <span className="w-[64px] text-right">Meetings</span>
          <span className="w-[114px]">Attainment</span>
          <span className="w-[64px] text-right max-md:hidden">Connect</span>
          <span className="w-[80px] text-right max-lg:hidden">Sourced</span>
        </div>
        {ranked.map((r, i) => (
          <button
            key={r.member.id}
            type="button"
            onClick={() => openRep(r.member.id)}
            className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover"
          >
            <span className="w-4 text-[12px] text-fg-muted tabular-nums">{i + 1}</span>
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Avatar name={r.member.name} size={20} />
              <span className="truncate font-medium">{r.member.name}</span>
            </span>
            <span className="w-[64px] text-right tabular-nums max-sm:hidden">
              {r.meetings}
              <span className="text-[#7f7f7f]">/{r.member.meetingQuota}</span>
            </span>
            <span className="flex w-[114px] items-center gap-2 max-sm:w-auto">
              <SegmentedMeter value={Math.min(r.attainment, 100)} />
              <span className="w-[36px] text-right tabular-nums">{r.attainment}%</span>
            </span>
            <span className="w-[64px] text-right text-fg-soft tabular-nums max-md:hidden">{r.connectRate}%</span>
            <span className="w-[80px] text-right tabular-nums max-lg:hidden">{formatCompactCurrency(r.sourcedValue)}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

/** Deals the SDR team sourced — live values and stages from the deals store. */
export function SourcedPipeline({ reps }: { reps: SdrMetrics[] }) {
  const openDeal = useDeals((s) => s.openDeal);
  const companies = useCrm((s) => s.companies);
  const rows = reps
    .flatMap((r) => r.sourcedDeals.map((d) => ({ d, r })))
    .sort((a, b) => b.d.value - a.d.value);
  const total = rows.reduce((s, x) => s + x.d.value, 0);

  return (
    <Panel
      title="Sourced pipeline"
      subtitle={
        <>
          <span className="text-fg-soft tabular-nums">${formatNumber(total)}</span> across {rows.length} deals
        </>
      }
    >
      <div className="mt-3 flex flex-col">
        {rows.map(({ d, r }) => {
          const company = companies.find((c) => c.id === d.companyId);
          const stage = stageById(d.stage);
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => openDeal(d.id)}
              className="no-press -mx-2 flex min-h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover max-sm:py-2"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <CompanyLogo id={d.companyId} src={company?.logo} size={20} glyph={11} radius={5} />
                <span className="flex min-w-0 flex-col gap-[6px]">
                  <span className="truncate font-medium">{company?.name}</span>
                  <span className="truncate text-[12px] text-fg-soft/80">{d.title}</span>
                </span>
              </span>
              <span className="flex w-[120px] shrink-0 items-center gap-[6px] text-[12px] text-fg-soft max-md:hidden">
                <Avatar name={r.member.name} size={18} />
                <span className="truncate">{r.member.name.split(" ")[0]}</span>
              </span>
              <span className="w-[104px] shrink-0 max-sm:hidden">
                <Tag tone={stage.tone}>{stage.label}</Tag>
              </span>
              <span className="w-[92px] shrink-0 text-right tabular-nums">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(d.value)}
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
