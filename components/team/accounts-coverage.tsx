"use client";

import { useCrm } from "@/lib/store";
import { useDeals } from "@/lib/deals-store";
import { stageById, STAGES } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag } from "@/components/primitives/tag";
import { Panel } from "@/components/forecast/panel";
import type { RepMetrics } from "./use-team-data";

/** Accounts owned by the team with open pipeline and furthest-along stage. */
export function AccountsCoverage({ reps, title }: { reps: RepMetrics[]; title: string }) {
  const companies = useCrm((s) => s.companies);
  const openCompany = useCrm((s) => s.openDetail);
  const deals = useDeals((s) => s.deals);
  const owners = new Set(reps.map((r) => r.member.ownerId));

  const rows = companies
    .filter((c) => owners.has(c.ownerId))
    .map((c) => {
      const open = deals.filter((d) => d.companyId === c.id && d.stage !== "won");
      const furthest = open.reduce<(typeof open)[number] | undefined>(
        (best, d) => (!best || STAGES.findIndex((s) => s.id === d.stage) > STAGES.findIndex((s) => s.id === best.stage) ? d : best),
        undefined,
      );
      return { c, pipeline: open.reduce((s, d) => s + d.value, 0), furthest };
    })
    .sort((a, b) => b.pipeline - a.pipeline);

  return (
    <Panel title={title} subtitle={`${rows.length} accounts covered by the team`}>
      <div className="mt-3 flex flex-col">
        {rows.map(({ c, pipeline, furthest }) => {
          const owner = ownerById(c.ownerId);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => openCompany(c.id)}
              className="no-press -mx-2 flex min-h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover max-sm:py-2"
            >
              <span className="flex w-[150px] shrink-0 items-center gap-2 max-sm:w-auto max-sm:min-w-0 max-sm:flex-1">
                <CompanyLogo id={c.id} src={c.logo} size={20} glyph={11} radius={5} />
                <span className="truncate font-medium">{c.name}</span>
              </span>
              <span className="flex min-w-0 flex-1 items-center gap-[6px] text-[12px] text-fg-soft max-sm:hidden">
                <Avatar name={owner.name} size={18} />
                <span className="truncate">{owner.name}</span>
              </span>
              <span className="w-[104px] shrink-0 max-md:hidden">
                {furthest ? <Tag tone={stageById(furthest.stage).tone}>{stageById(furthest.stage).label}</Tag> : <span className="text-[12px] text-fg-muted">—</span>}
              </span>
              <span className="w-[92px] shrink-0 text-right tabular-nums">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(pipeline)}
              </span>
              <span className="flex shrink-0 items-center gap-2 max-lg:hidden">
                <SegmentedMeter value={c.winProbability} />
                <span className="w-[29px] text-right tabular-nums">{c.winProbability}%</span>
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
