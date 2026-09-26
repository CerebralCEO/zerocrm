"use client";

import { useMemo } from "react";
import { useDeals } from "@/lib/deals-store";
import { useSlips } from "@/lib/slips-store";
import { buildSlips } from "@/lib/slips";

/** Slipped deals for the current window / owner, derived live from the board and the push history. */
export function useSlipsData() {
  const deals = useDeals((s) => s.deals);
  const history = useSlips((s) => s.history);
  const window = useSlips((s) => s.window);
  const ownerFilter = useSlips((s) => s.ownerFilter);
  return useMemo(() => {
    const slips = buildSlips(deals, history, ownerFilter, window);
    const open = deals.filter((d) => d.stage !== "won" && (!ownerFilter || d.ownerId === ownerFilter));
    return { slips, open };
  }, [deals, history, ownerFilter, window]);
}
