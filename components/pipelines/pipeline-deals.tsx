"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { stageById } from "@/lib/deals";
import { isOverdue, useDeals } from "@/lib/deals-store";
import { ownerById } from "@/lib/data";
import { siteById, siteOf, type Pipeline, type PipelineView } from "@/lib/pipelines";
import { usePipelines } from "@/lib/pipelines-store";
import { useCrm } from "@/lib/store";
import { cn, formatNumber, formatShortDate } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag } from "@/components/primitives/tag";
import { Panel } from "@/components/forecast/panel";

/** Every deal in the pipeline, focused by the funnel stage / map city picked above. */
export function PipelineDeals({ pipeline, v }: { pipeline: Pipeline; v: PipelineView }) {
  const openDeal = useDeals((s) => s.openDeal);
  const companies = useCrm((s) => s.companies);
  const { stageFilter, siteFilter, setStageFilter, setSiteFilter } = usePipelines();
  const rows = v.deals
    .filter((d) => (!stageFilter || d.stage === stageFilter) && (!siteFilter || siteOf(d).id === siteFilter))
    .sort((a, b) => Number(a.stage === "won") - Number(b.stage === "won") || b.value - a.value);
  const total = rows.reduce((n, d) => n + d.value, 0);
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, 12);

  return (
    <Panel
      title="Deals"
      subtitle={
        <>
          {rows.length} {rows.length === 1 ? "deal" : "deals"} · <span className="text-fg-soft tabular-nums">${formatNumber(total)}</span>
        </>
      }
      aside={
        (stageFilter || siteFilter) && (
          <div className="flex flex-wrap items-center gap-[6px]">
            {stageFilter && <FocusChip label={stageById(stageFilter).label} onClear={() => setStageFilter(null)} />}
            {siteFilter && <FocusChip label={siteById(siteFilter)?.city ?? siteFilter} color={pipeline.color} onClear={() => setSiteFilter(null)} />}
          </div>
        )
      }
    >
      <div className="mt-3 flex flex-col">
        <div className="hidden h-8 items-center gap-3 border-b border-line text-[12px] leading-none text-fg-muted md:flex">
          <span className="w-[210px] shrink-0">Account</span>
          <span className="min-w-0 flex-1">Deal</span>
          <span className="w-[112px] shrink-0 max-lg:hidden">City</span>
          <span className="w-[104px] shrink-0">Stage</span>
          <span className="w-[96px] shrink-0 text-right">Value</span>
          <span className="w-[113px] shrink-0 max-xl:hidden">Win probability</span>
          <span className="w-[74px] shrink-0 text-right">Close</span>
          <span className="w-5 shrink-0 max-lg:hidden" />
        </div>
        {shown.map((d) => {
          const company = companies.find((c) => c.id === d.companyId);
          const stage = stageById(d.stage);
          const site = siteOf(d);
          const late = isOverdue(d);
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => openDeal(d.id)}
              className="no-press -mx-2 flex min-h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover max-md:py-[10px]"
            >
              <span className="flex w-[210px] shrink-0 items-center gap-2 max-md:w-auto max-md:min-w-0 max-md:flex-1">
                <CompanyLogo id={d.companyId} src={company?.logo} size={20} glyph={11} radius={5} />
                <span className="flex min-w-0 flex-col gap-[6px]">
                  <span className="truncate font-medium">{company?.name}</span>
                  <span className="truncate text-[12px] text-fg-soft/80 md:hidden">
                    {d.title} · {site.city}
                  </span>
                </span>
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-[12px] text-fg-soft/80 md:block">{d.title}</span>
              <span className="hidden w-[112px] shrink-0 items-center gap-[6px] text-[12px] text-fg-soft lg:flex">
                <span className="size-[6px] shrink-0 rounded-full" style={{ background: pipeline.color }} />
                <span className="truncate">{site.city}</span>
              </span>
              <span className="w-[104px] shrink-0 max-sm:hidden">
                <Tag tone={stage.tone}>{stage.label}</Tag>
              </span>
              <span className="w-[96px] shrink-0 text-right tabular-nums">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(d.value)}
              </span>
              <span className="hidden w-[113px] shrink-0 items-center gap-[10px] xl:flex">
                <SegmentedMeter value={d.probability} />
                <span className="w-[29px] text-right tabular-nums">{d.probability}%</span>
              </span>
              <span
                className={cn(
                  "hidden w-[74px] shrink-0 items-center justify-end gap-[5px] text-[12px] md:flex",
                  late ? "text-danger-dot" : "text-fg-muted",
                )}
              >
                <Calendar className="size-[12px]" strokeWidth={1.75} />
                {formatShortDate(d.closeDate)}
              </span>
              <span className="hidden w-5 shrink-0 lg:block">
                <Avatar name={ownerById(d.ownerId).name} size={20} />
              </span>
            </button>
          );
        })}
        {!rows.length && <p className="py-12 text-center text-[13px] text-fg-muted">No deals match this focus.</p>}
        {rows.length > 12 && (
          <button
            type="button"
            onClick={() => setAll((x) => !x)}
            className="mx-auto mt-4 flex h-[30px] items-center rounded-full border border-white/[0.09] bg-[#1b1b1b] px-[12px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
          >
            {all ? "Show fewer" : `Show all ${rows.length} deals`}
          </button>
        )}
      </div>
    </Panel>
  );
}

function FocusChip({ label, color, onClear }: { label: string; color?: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="flex h-[30px] items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[8px] pl-[10px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
    >
      {color && <span className="size-[6px] rounded-full" style={{ background: color }} />}
      {label}
      <X className="size-[12px] text-fg-muted" strokeWidth={2} />
    </button>
  );
}
