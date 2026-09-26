"use client";

import type { Q1Plan, RepReadiness as Rep } from "@/lib/q1";
import { useQ1 } from "@/lib/q1-store";
import { ownerById } from "@/lib/data";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag } from "@/components/primitives/tag";
import { Panel } from "@/components/forecast/panel";

const TONE: Record<Rep["status"], "land" | "yellow" | "red"> = {
  Ready: "land",
  Building: "yellow",
  Thin: "red",
};
const METER: Record<Rep["status"], "green" | "amber" | "red"> = {
  Ready: "green",
  Building: "amber",
  Thin: "red",
};

/** Q1 pipeline per rep against a flat rep quota. Tapping a rep re-plans the page for them. */
export function RepReadiness({ p }: { p: Q1Plan }) {
  const ownerFilter = useQ1((s) => s.ownerFilter);
  const setOwnerFilter = useQ1((s) => s.setOwnerFilter);
  const ready = p.reps.filter((r) => r.status === "Ready").length;
  const half = Math.ceil(p.reps.length / 2);
  const columns = [p.reps.slice(0, half), p.reps.slice(half)].filter((c) => c.length);

  return (
    <Panel
      title="Rep readiness"
      subtitle={
        <>
          <span className="text-fg-soft">{ready}</span> of {p.reps.length} reps hold 1.5× their {formatCompactCurrency(p.reps[0]?.quota ?? 0)} Q1
          quota in pipeline
        </>
      }
      aside={
        ownerFilter ? (
          <button
            type="button"
            onClick={() => setOwnerFilter(null)}
            className="flex h-[30px] items-center rounded-full border border-white/[0.09] bg-[#1b1b1b] px-[10px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
          >
            Show whole team
          </button>
        ) : undefined
      }
    >
      <div className={cn("mt-3 grid gap-x-8", columns.length > 1 && "xl:grid-cols-2")}>
        {columns.map((rows, col) => (
          <div key={col} className="flex flex-col">
            <div
              className={cn(
                "hidden h-8 items-center gap-3 border-b border-line text-[12px] leading-none text-fg-muted sm:flex",
                col > 0 && "sm:max-xl:hidden",
              )}
            >
              <span className="flex-1">Rep</span>
              <span className="w-[48px] text-right max-md:hidden">Deals</span>
              <span className="w-[80px] text-right">Pipeline</span>
              <span className="w-[126px]">Coverage</span>
              <span className="w-[80px]">Status</span>
            </div>
            {rows.map((r) => (
              <button
                key={r.ownerId}
                type="button"
                onClick={() => setOwnerFilter(ownerFilter === r.ownerId ? null : r.ownerId)}
                className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors hover:bg-row-hover active:bg-row-hover xl:last:border-b-0"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <Avatar name={ownerById(r.ownerId).name} size={20} />
                  <span className="truncate font-medium">{ownerById(r.ownerId).name}</span>
                </span>
                <span className="w-[48px] text-right text-fg-soft tabular-nums max-md:hidden">{r.deals}</span>
                <span className="w-[80px] text-right tabular-nums max-sm:hidden">
                  <span className="mr-[3px] text-[#7f7f7f]">$</span>
                  {r.pipeline ? formatCompactCurrency(r.pipeline).slice(1) : "0"}
                </span>
                <span className="flex w-[126px] items-center gap-2 max-sm:w-auto">
                  <SegmentedMeter value={Math.min(r.coverage / 2, 1) * 100} color={METER[r.status]} />
                  <span className="w-[36px] text-right tabular-nums">{r.coverage.toFixed(1)}×</span>
                </span>
                <span className="w-[80px] max-sm:w-auto">
                  <Tag tone={TONE[r.status]}>{r.status}</Tag>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}
