"use client";

import type { Q1Plan } from "@/lib/q1";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { LegendItem, Panel, SERIES } from "@/components/forecast/panel";

/**
 * One row per Q1 month: open pipeline (grey) with its weighted share (amber)
 * inside, against the month's target marker.
 */
export function MonthlyPlan({ p }: { p: Q1Plan }) {
  const scale = Math.max(...p.months.map((m) => Math.max(m.pipeline, m.target)), 1) * 1.1;

  return (
    <Panel
      title="Monthly plan"
      subtitle="Open pipeline vs. each month's target"
      aside={
        <div className="flex items-center gap-4">
          <LegendItem color={SERIES.commit} label="Weighted" />
          <LegendItem color={SERIES.pipeline} label="Pipeline" />
        </div>
      }
    >
      <ul className="mt-6 flex flex-col gap-[26px]">
        {p.months.map((m, i) => {
          const cover = m.target ? m.weighted / m.target : 0;
          return (
            <li key={m.key} className="flex flex-col gap-[12px]">
              <div className="flex items-baseline justify-between gap-3 text-[12px] leading-none">
                <span className="flex min-w-0 items-baseline gap-2">
                  <span className="text-[14px] font-medium text-fg">{m.label}</span>
                  <span className="truncate text-fg-muted">
                    {m.deals} {m.deals === 1 ? "deal" : "deals"} · {formatCompactCurrency(m.pipeline)} open
                  </span>
                </span>
                <span className="shrink-0 text-fg-muted tabular-nums">
                  <span className={cn("font-medium", cover >= 1 ? "text-meter-green" : cover >= 0.5 ? "text-meter-amber" : "text-danger-dot")}>
                    {formatCompactCurrency(m.weighted)}
                  </span>{" "}
                  / {formatCompactCurrency(m.target)}
                </span>
              </div>
              <div className="relative">
                <div className="relative h-[10px] overflow-hidden rounded-[2px] bg-meter-track">
                  <span
                    className="absolute inset-y-0 left-0 origin-left animate-grow-x bg-meter-empty transition-[width] duration-700 ease-(--ease-ios)"
                    style={{
                      width: `${(m.pipeline / scale) * 100}%`,
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                  <span
                    className="absolute inset-y-0 left-0 origin-left animate-grow-x transition-[width] duration-700 ease-(--ease-ios)"
                    style={{
                      width: `${(m.weighted / scale) * 100}%`,
                      background: SERIES.commit,
                      animationDelay: `${120 + i * 90}ms`,
                    }}
                  />
                </div>
                <span
                  className="pointer-events-none absolute -top-[5px] -bottom-[5px] w-px transition-[left] duration-700 ease-(--ease-ios)"
                  style={{
                    left: `${(m.target / scale) * 100}%`,
                    background: SERIES.quota,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
        <span className="h-3 w-px" style={{ background: SERIES.quota }} />
        Monthly target · {formatCompactCurrency(p.quota / 3)}
      </p>
    </Panel>
  );
}
