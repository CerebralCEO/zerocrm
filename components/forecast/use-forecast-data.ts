"use client";

import { useMemo } from "react";
import { useDeals } from "@/lib/deals-store";
import { useForecast } from "@/lib/forecast-store";
import { buildForecast, periodById } from "@/lib/forecast";

/** The forecast for the selected period/owner, derived live from the deals board. */
export function useForecastData() {
  const deals = useDeals((s) => s.deals);
  const period = useForecast((s) => s.period);
  const ownerFilter = useForecast((s) => s.ownerFilter);
  return useMemo(() => buildForecast(deals, periodById(period), ownerFilter), [deals, period, ownerFilter]);
}
