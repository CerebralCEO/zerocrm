"use client";

import { useSequences } from "@/lib/sequences-store";
import { cn } from "@/lib/utils";
import { SequencesSummary } from "./sequences-summary";
import { SequenceList } from "./sequence-list";
import { SequenceDetail } from "./sequence-detail";

/**
 * Desktop: KPI strip over a master (list) / detail split. Below lg it becomes
 * iOS navigation — the list is the root screen and the detail pushes in from
 * the right, with a back button.
 */
export function SequencesView() {
  const detailOpen = useSequences((s) => s.detailOpen);
  const selectedId = useSequences((s) => s.selectedId);

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <div className={cn(detailOpen && "max-lg:hidden")}>
        <SequencesSummary />
      </div>
      <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className={cn("min-w-0 border-line lg:border-r", detailOpen && "max-lg:hidden")}>
          <SequenceList />
        </div>
        <div
          key={selectedId}
          className={cn("min-w-0", detailOpen ? "max-lg:animate-sheet-in" : "max-lg:hidden")}
        >
          <SequenceDetail />
        </div>
      </div>
    </div>
  );
}
