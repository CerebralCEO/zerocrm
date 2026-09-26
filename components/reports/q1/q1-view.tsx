"use client";

import { useQ1 } from "@/lib/q1-store";
import { Q1Summary } from "./q1-summary";
import { AttainmentGauge } from "./attainment-gauge";
import { PathToQuota } from "./path-to-quota";
import { DealMap } from "./deal-map";
import { MonthlyPlan } from "./monthly-plan";
import { RepReadiness } from "./rep-readiness";
import { ScenarioCompare } from "./scenario-compare";
import { useQ1Plan } from "./use-q1-data";

/** KPI strip → gauge + planner beside the waterfall → deal map + months → rep readiness. */
export function Q1View() {
  const p = useQ1Plan();
  const ownerFilter = useQ1((s) => s.ownerFilter);
  // Re-key the charts on owner change so their entrance replays; scenario changes glide instead.
  const key = ownerFilter ?? "all";

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <Q1Summary />
      <div className="grid border-b border-line lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="min-w-0 border-line lg:border-r">
          <AttainmentGauge key={key} p={p} />
        </div>
        <div className="min-w-0 border-line max-lg:border-t">
          <PathToQuota key={key} p={p} />
          <ScenarioCompare />
        </div>
      </div>
      <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 border-line lg:border-r">
          <DealMap key={key} p={p} />
        </div>
        <div className="min-w-0 border-line max-lg:border-t">
          <MonthlyPlan key={key} p={p} />
        </div>
      </div>
      <RepReadiness p={p} />
    </div>
  );
}
