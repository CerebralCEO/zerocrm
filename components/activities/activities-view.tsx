"use client";

import { useActivities } from "@/lib/activities-store";
import { ActivitiesSummary } from "./activities-summary";
import { ActivityFeed } from "./activity-feed";
import { Agenda } from "./agenda";
import { ActivityHeatmap } from "./activity-heatmap";

/**
 * KPI strip → feed (left) + agenda & heatmap (right). Below lg the right
 * column comes first so today's agenda leads on phones.
 */
export function ActivitiesView() {
  const kind = useActivities((s) => s.kindFilter);
  const owner = useActivities((s) => s.ownerFilter);
  const range = useActivities((s) => s.range);

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <ActivitiesSummary />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 border-line max-lg:order-2 lg:border-r">
          {/* Reset paging when filters change */}
          <ActivityFeed key={`${kind}-${owner}-${range}`} />
        </div>
        <aside className="min-w-0 border-line max-lg:order-1 max-lg:border-b">
          <Agenda />
          <div className="border-t border-line">
            <ActivityHeatmap key={`${kind}-${owner}`} />
          </div>
        </aside>
      </div>
    </div>
  );
}
