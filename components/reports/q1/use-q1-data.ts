"use client";

import { useMemo } from "react";
import { useDeals } from "@/lib/deals-store";
import { useQ1 } from "@/lib/q1-store";
import { buildQ1Plan } from "@/lib/q1";

/** The Q1 plan for the current scenario / owner, derived live from the deals board. */
export function useQ1Plan() {
  const deals = useDeals((s) => s.deals);
  const scenario = useQ1((s) => s.scenario);
  const ownerFilter = useQ1((s) => s.ownerFilter);
  return useMemo(() => buildQ1Plan(deals, scenario, ownerFilter), [deals, scenario, ownerFilter]);
}
