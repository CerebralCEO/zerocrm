"use client";

import type { Forecast } from "@/lib/forecast";
import { ownerById } from "@/lib/data";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Panel } from "./panel";

/** Reps ranked by closed + commit, with a win-meter of quota attainment. */
export function TeamAttainment({ f }: { f: Forecast }) {
  return (
    <Panel title="Team attainment" subtitle={`Closed won vs. ${formatCompactCurrency(f.period.repQuota)} rep quota`}>
      <ul className="mt-3 flex flex-col">
        {f.reps.map((r, i) => {
          const owner = ownerById(r.ownerId);
          return (
            <li key={r.ownerId} className="flex h-[43px] items-center gap-3 border-b border-line last:border-b-0">
              <span className="w-4 text-[12px] leading-none text-fg-muted tabular-nums">{i + 1}</span>
              <Avatar name={owner.name} size={20} />
              <span className="flex min-w-0 flex-1 items-baseline gap-2">
                <span className="truncate text-[14px] font-medium leading-none text-fg">{owner.name}</span>
                {r.commit > 0 && (
                  <span className="hidden truncate text-[12px] leading-none text-fg-muted sm:inline">
                    +{formatCompactCurrency(r.commit)} commit
                  </span>
                )}
              </span>
              <span className="hidden text-[14px] leading-none font-[450] text-fg tabular-nums sm:inline">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(r.closed)}
              </span>
              <SegmentedMeter value={Math.min(r.attainment, 100)} />
              <span className="w-[38px] text-right text-[14px] leading-none font-[450] text-fg tabular-nums">{r.attainment}%</span>
            </li>
          );
        })}
        {f.reps.length === 0 && <li className="py-10 text-center text-[13px] text-fg-muted">No deals for this selection.</li>}
      </ul>
    </Panel>
  );
}
