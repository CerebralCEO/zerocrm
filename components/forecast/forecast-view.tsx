"use client";

import { useForecast } from "@/lib/forecast-store";
import { ForecastSummary } from "./forecast-summary";
import { AttainmentChart } from "./attainment-chart";
import { CategoryBreakdown } from "./category-breakdown";
import { MonthlyBookings } from "./monthly-bookings";
import { TeamAttainment } from "./team-attainment";
import { AtRiskDeals } from "./at-risk-deals";
import { useForecastData } from "./use-forecast-data";

/** Scrollable forecast body: KPI strip → attainment + categories → months + team → risk. */
export function ForecastView() {
  const f = useForecastData();
  const period = useForecast((s) => s.period);
  const ownerFilter = useForecast((s) => s.ownerFilter);
  const call = useForecast((s) => s.call[s.period]);
  // Re-key charts on selection change so their entrance animation replays.
  const key = `${period}-${ownerFilter ?? "all"}`;

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <ForecastSummary />
      <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 border-line lg:border-r">
          <AttainmentChart key={key} f={f} />
        </div>
        <div className="border-line max-lg:border-t">
          <CategoryBreakdown key={key} f={f} call={call} />
        </div>
      </div>
      <div className="grid border-b border-line lg:grid-cols-2">
        <div className="min-w-0 border-line lg:border-r">
          <MonthlyBookings key={key} f={f} />
        </div>
        <div className="min-w-0 border-line max-lg:border-t">
          <TeamAttainment f={f} />
        </div>
      </div>
      <AtRiskDeals f={f} />
    </div>
  );
}
