"use client";

import { CalendarCheck, Layers, PhoneCall, Zap } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useSdrData } from "./use-sdr-data";

export function SdrSummary() {
  const { totals, reps } = useSdrData();
  const onTrack = reps.filter((r) => r.status === "On track").length;

  return (
    <KpiStrip>
      <KpiCell
        icon={CalendarCheck}
        label="Meetings booked"
        value={totals.meetings}
        currency={false}
        aside={<SegmentedMeter value={Math.min(totals.attainment, 100)} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{totals.attainment}%</span> of {totals.quota} · pacing{" "}
            <span className={totals.projectedPct >= 100 ? "text-meter-green" : "text-meter-amber"}>{totals.projectedPct}%</span>
          </>
        }
      />
      <KpiCell
        icon={Layers}
        label="Pipeline sourced"
        value={totals.sourced}
        meta={
          <>
            <span className="text-fg-soft">{totals.sourcedDeals}</span> deals created for the AEs
          </>
        }
      />
      <KpiCell
        icon={PhoneCall}
        label="Connect rate"
        value={totals.connectRate}
        currency={false}
        suffix="%"
        meta={
          <>
            <span className="text-fg-soft">{formatNumber(totals.calls)}</span> calls this period
          </>
        }
      />
      <KpiCell
        icon={Zap}
        label="Activities"
        value={totals.activities}
        currency={false}
        meta={
          <>
            <span className="text-meter-green">{onTrack}</span>/{reps.length} reps on pace
          </>
        }
      />
    </KpiStrip>
  );
}
