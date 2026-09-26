"use client";

import { useSlips } from "@/lib/slips-store";
import { SlipSummary } from "./slip-summary";
import { SlipTrail } from "./slip-trail";
import { QuarterFlow } from "./quarter-flow";
import { SlipByRep, SlipReasons } from "./slip-breakdown";
import { useSlipsData } from "./use-slips-data";

/** KPI strip → slip trail (hero) → quarter flow · reasons · reps. */
export function SlipView() {
  const { slips, open } = useSlipsData();
  const window = useSlips((s) => s.window);
  const ownerFilter = useSlips((s) => s.ownerFilter);
  const key = `${window}-${ownerFilter ?? "all"}`;

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <SlipSummary />
      <div className="border-b border-line">
        <SlipTrail key={key} slips={slips} />
      </div>
      <div className="grid xl:grid-cols-3">
        <div className="min-w-0 border-line xl:border-r">
          <QuarterFlow key={key} slips={slips} />
        </div>
        <div className="min-w-0 border-line max-xl:border-t xl:border-r">
          <SlipReasons key={key} slips={slips} />
        </div>
        <div className="min-w-0 border-line max-xl:border-t">
          <SlipByRep slips={slips} open={open} />
        </div>
      </div>
    </div>
  );
}
