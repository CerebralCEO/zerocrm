"use client";

import { useMemo } from "react";
import { useDeals } from "@/lib/deals-store";
import { usePipelines } from "@/lib/pipelines-store";
import { buildPipeline, type PipelineId } from "@/lib/pipelines";

/** One regional pipeline for the current close window / owner, derived live from the deals board. */
export function usePipelineData(id: PipelineId) {
  const deals = useDeals((s) => s.deals);
  const window = usePipelines((s) => s.window);
  const ownerFilter = usePipelines((s) => s.ownerFilter);
  return useMemo(() => buildPipeline(deals, id, window, ownerFilter), [deals, id, window, ownerFilter]);
}
