"use client";

import { useMemo } from "react";
import { useCrm, sortCompanies } from "@/lib/store";

/** Companies after the owner / stage filters and the current sort. */
export function useVisibleCompanies() {
  const companies = useCrm((s) => s.companies);
  const ownerFilter = useCrm((s) => s.ownerFilter);
  const stageFilter = useCrm((s) => s.stageFilter);
  const sortBy = useCrm((s) => s.sortBy);

  return useMemo(() => {
    const filtered = companies.filter(
      (c) => (!ownerFilter || c.ownerId === ownerFilter) && (!stageFilter || c.tags.includes(stageFilter)),
    );
    return sortCompanies(filtered, sortBy);
  }, [companies, ownerFilter, stageFilter, sortBy]);
}
