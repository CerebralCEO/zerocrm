"use client";

import { CircleDollarSign, Scale, Trophy, Wallet } from "lucide-react";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useVisibleDeals } from "./deals-toolbar";

/** KPI strip above the board — hairline-separated cells, no cards. */
export function DealsSummary() {
  const deals = useVisibleDeals();
  const open = deals.filter((d) => d.stage !== "won");
  const won = deals.filter((d) => d.stage === "won");

  const pipeline = open.reduce((s, d) => s + d.value, 0);
  const weighted = Math.round(open.reduce((s, d) => s + (d.value * d.probability) / 100, 0));
  const wonValue = won.reduce((s, d) => s + d.value, 0);
  const avgProb = open.length ? Math.round(open.reduce((s, d) => s + d.probability, 0) / open.length) : 0;
  const avgSize = open.length ? Math.round(pipeline / open.length) : 0;

  return (
    <KpiStrip>
      <KpiCell
        icon={Wallet}
        label="Open pipeline"
        value={pipeline}
        meta={
          <>
            <span className="text-fg-soft">{open.length}</span> open deals
          </>
        }
      />
      <KpiCell
        icon={Scale}
        label="Weighted forecast"
        value={weighted}
        aside={<SegmentedMeter value={avgProb} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{avgProb}%</span> average win probability
          </>
        }
      />
      <KpiCell
        icon={Trophy}
        label="Closed won"
        value={wonValue}
        meta={
          <>
            <span className="text-meter-green">{won.length}</span> deals won
          </>
        }
      />
      <KpiCell icon={CircleDollarSign} label="Average deal size" value={avgSize} meta="Across open deals" />
    </KpiStrip>
  );
}
