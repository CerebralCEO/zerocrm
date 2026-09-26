"use client";

import type { Forecast } from "@/lib/forecast";
import { formatCompactCurrency } from "@/lib/utils";
import { LegendItem, Panel, SERIES } from "./panel";

const H = 180;

/** Stacked monthly bars (closed / commit / best case) against the monthly target. */
export function MonthlyBookings({ f }: { f: Forecast }) {
  const peak = Math.max(...f.months.map((m) => Math.max(m.target, m.closed + m.commit + m.best))) * 1.18 || 1;
  const h = (v: number) => (v / peak) * H;

  return (
    <Panel
      title="Monthly bookings"
      subtitle="Closed and expected by month vs. target"
      aside={
        <div className="flex items-center gap-4">
          <LegendItem color={SERIES.closed} label="Closed" />
          <LegendItem color={SERIES.commit} label="Commit" />
          <LegendItem color={SERIES.best} label="Best case" />
        </div>
      }
    >
      <div className="mt-6 grid grid-cols-3">
        {f.months.map((m, i) => {
          const total = m.closed + m.commit + m.best;
          return (
            <div key={m.label} className="flex flex-col items-center">
              <div className="relative flex w-full items-end justify-center" style={{ height: H }}>
                {/* Target line spans the month column */}
                <div
                  className="absolute inset-x-3 border-t border-dashed transition-[bottom] duration-700 ease-(--ease-ios)"
                  style={{ bottom: h(m.target), borderColor: SERIES.quota }}
                />
                <div
                  className="relative flex w-[42%] max-w-[72px] origin-bottom animate-bar-grow flex-col-reverse gap-[2px]"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 text-[12px] font-medium leading-none whitespace-nowrap text-fg tabular-nums">
                    {total ? formatCompactCurrency(total) : "—"}
                  </span>
                  {(
                    [
                      ["closed", m.closed],
                      ["commit", m.commit],
                      ["best", m.best],
                    ] as const
                  ).map(([k, v], j, arr) =>
                    v > 0 ? (
                      <span
                        key={k}
                        className="w-full transition-[height] duration-700 ease-(--ease-ios)"
                        style={{
                          height: Math.max(h(v), 3),
                          background: SERIES[k],
                          borderTopLeftRadius: arr.slice(j + 1).every(([, x]) => x === 0) ? 2 : 0,
                          borderTopRightRadius: arr.slice(j + 1).every(([, x]) => x === 0) ? 2 : 0,
                        }}
                      />
                    ) : null,
                  )}
                </div>
              </div>
              <div className="mt-[10px] h-px w-full bg-line" />
              <span className="mt-[10px] text-[12px] leading-none text-fg-muted">{m.label}</span>
              <span className="mt-[6px] text-[12px] leading-none text-fg-muted tabular-nums">
                target {formatCompactCurrency(m.target)}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
