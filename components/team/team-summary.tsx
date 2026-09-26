"use client";

import { Gauge, Layers, Target, Zap } from "lucide-react";
import type { TeamId } from "@/lib/teams";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useTeamData } from "./use-team-data";

export function TeamSummary({ teamId }: { teamId: TeamId }) {
  const { totals, reps } = useTeamData(teamId);
  const onTrack = reps.filter((r) => r.status === "On track").length;
  const coverage = Number.isFinite(totals.coverage) ? totals.coverage : 0;

  return (
    <KpiStrip>
      <KpiCell
        icon={Target}
        label="Team closed won"
        value={totals.closed}
        aside={<SegmentedMeter value={Math.min(totals.attainment, 100)} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{totals.attainment}%</span> of {formatCompactCurrency(totals.quota)} team quota
          </>
        }
      />
      <KpiCell
        icon={Gauge}
        label="Projected"
        value={totals.projected}
        meta={
          <>
            <span className={totals.projected >= totals.quota ? "text-meter-green" : "text-meter-amber"}>
              {totals.quota ? Math.round((totals.projected / totals.quota) * 100) : 0}%
            </span>{" "}
            of quota · {onTrack}/{reps.length} reps on track
          </>
        }
      />
      <KpiCell
        icon={Layers}
        label="Open pipeline"
        value={totals.pipeline}
        meta={
          <>
            <span className={coverage >= 2 ? "text-meter-green" : coverage >= 1 ? "text-meter-amber" : "text-danger-dot"}>
              {Number.isFinite(totals.coverage) ? `${coverage.toFixed(1)}×` : "Quota met"}
            </span>{" "}
            coverage of the remaining gap
          </>
        }
      />
      <KpiCell
        icon={Zap}
        label="Activities this week"
        value={totals.activity7d}
        currency={false}
        meta={
          <>
            <span className="text-fg-soft">{reps.length ? formatNumber(Math.round(totals.activity7d / reps.length)) : 0}</span> per rep ·{" "}
            <span className="text-fg-soft">{totals.avgWin}%</span> avg win prob.
          </>
        }
      />
    </KpiStrip>
  );
}
