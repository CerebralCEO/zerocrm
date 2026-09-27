"use client";

import { useMemo } from "react";
import { useActivities } from "./activities-store";
import { deriveCompany, isTouch, WINDOW_DAYS } from "./company-metrics";
import { useDeals } from "./deals-store";
import { useCrm } from "./store";

/** Companies with every metric computed live from Deals + Activities. */
export function useCompanies() {
  const companies = useCrm((s) => s.companies);
  const window = useCrm((s) => s.activityWindow);
  const deals = useDeals((s) => s.deals);
  const activities = useActivities((s) => s.activities);
  return useMemo(() => {
    const touches = activities.filter(isTouch);
    return companies.map((c) => deriveCompany(c, deals, touches, WINDOW_DAYS[window] ?? 90));
  }, [companies, deals, activities, window]);
}

/** One live company (for sheets). */
export function useCompany(id: string | null) {
  const all = useCompanies();
  return useMemo(() => (id ? all.find((c) => c.id === id) : undefined), [all, id]);
}
