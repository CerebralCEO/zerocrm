"use client";

import { CalendarClock, Layers, Target, TrendingUp } from "lucide-react";
import { useQ1 } from "@/lib/q1-store";
import { SCENARIOS } from "@/lib/q1";
import { formatCompactCurrency } from "@/lib/utils";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useQ1Plan } from "./use-q1-data";

export function Q1Summary() {
  const p = useQ1Plan();
  const preset = useQ1((s) => s.preset);

  return (
    <KpiStrip>
      <KpiCell icon={Target} label="Q1 quota" value={p.quota} meta="FQ1 FY28 · Feb 1 – Apr 30, 2027" />
      <KpiCell
        icon={Layers}
        label="Open Q1 pipeline"
        value={p.pipeline}
        meta={
          <>
            <span className={p.coverage >= 3 ? "text-meter-green" : p.coverage >= 1.5 ? "text-meter-amber" : "text-danger-dot"}>
              {p.coverage.toFixed(1)}×
            </span>{" "}
            coverage · {p.deals.length} deals
          </>
        }
      />
      <KpiCell
        icon={TrendingUp}
        label="Projected bookings"
        value={p.projected}
        aside={<SegmentedMeter value={Math.min(p.attainment, 100)} className="hidden sm:flex" />}
        meta={
          <>
            <span className={p.attainment >= 100 ? "text-meter-green" : "text-fg-soft"}>{p.attainment}%</span> of quota ·{" "}
            {preset === "custom" ? "Custom" : SCENARIOS[preset].label} scenario
          </>
        }
      />
      <KpiCell
        icon={CalendarClock}
        label="Days to Q1"
        value={p.daysToStart}
        currency={false}
        suffix="d"
        meta={
          <>
            <span className="text-fg-soft">{p.genWeeks} weeks</span> left to build pipeline · {formatCompactCurrency(p.newPipeline)} planned
          </>
        }
      />
    </KpiStrip>
  );
}
