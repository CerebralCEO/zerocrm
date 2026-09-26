"use client";

import { Scale, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useForecastData } from "./use-forecast-data";

export function ForecastSummary() {
  const f = useForecastData();
  const { quota } = f.period;
  const attainment = Math.round((f.totals.closed / quota) * 100);
  const commit = f.totals.closed + f.totals.commit;
  const best = commit + f.totals.best;
  const delta = f.weighted - quota;

  return (
    <KpiStrip>
      <KpiCell
        icon={Target}
        label="Closed won"
        value={f.totals.closed}
        aside={<SegmentedMeter value={Math.min(attainment, 100)} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{attainment}%</span> of {formatCompactCurrency(quota)} quota
          </>
        }
      />
      <KpiCell
        icon={ShieldCheck}
        label="Commit forecast"
        value={commit}
        meta={
          <>
            <span className={commit >= quota ? "text-meter-green" : "text-fg-soft"}>{Math.round((commit / quota) * 100)}%</span> of quota ·{" "}
            {f.counts.commit} deals in commit
          </>
        }
      />
      <KpiCell
        icon={TrendingUp}
        label="Best case"
        value={best}
        meta={
          <>
            <span className="text-fg-soft">+{formatCompactCurrency(f.totals.best)}</span> upside from {f.counts.best} deals
          </>
        }
      />
      <KpiCell
        icon={Scale}
        label="Weighted forecast"
        value={f.weighted}
        meta={
          delta >= 0 ? (
            <>
              <span className="text-meter-green">${formatNumber(delta)}</span> ahead of quota
            </>
          ) : (
            <>
              <span className="text-danger-dot">${formatNumber(-delta)}</span> short of quota
            </>
          )
        }
      />
    </KpiStrip>
  );
}
