"use client";

import { useMemo, useState } from "react";
import { TODAY } from "@/lib/deals-store";
import { KINDS, addDays, dateOf, dayLabel, weekdayOf } from "@/lib/activities";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/forecast/panel";
import { ActivityIcon, useFeed, useFilteredDone } from "./shared";

const WEEKS = 12;
const LEVELS = ["rgba(255,255,255,0.05)", "rgb(0 181 98 / 0.28)", "rgb(0 181 98 / 0.5)", "rgb(0 181 98 / 0.75)", "var(--color-spark)"];
const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 4 ? 2 : n <= 7 ? 3 : 4);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** 12-week × 7-day contribution grid (Monday-first) plus a by-type breakdown. */
export function ActivityHeatmap() {
  const done = useFilteredDone();
  const feed = useFeed();
  const [focus, setFocus] = useState<string | null>(null);

  const { weeks, counts, total, busiest } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of done) counts.set(dateOf(a.at), (counts.get(dateOf(a.at)) ?? 0) + 1);
    const monday = addDays(TODAY, -((weekdayOf(TODAY) + 6) % 7));
    const first = addDays(monday, -(WEEKS - 1) * 7);
    const weeks = Array.from({ length: WEEKS }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(first, w * 7 + d)));
    const days = weeks.flat().filter((d) => d <= TODAY);
    const total = days.reduce((s, d) => s + (counts.get(d) ?? 0), 0);
    const busiest = days.reduce((b, d) => ((counts.get(d) ?? 0) > (counts.get(b) ?? 0) ? d : b), days[0]);
    return { weeks, counts, total, busiest };
  }, [done]);

  const shown = focus ?? busiest;
  const byType = KINDS.map((k) => ({ ...k, count: feed.filter((a) => a.kind === k.id).length }));
  const max = Math.max(...byType.map((k) => k.count), 1);

  return (
    <Panel
      title="Team activity"
      subtitle={
        <>
          <span className="text-fg-soft tabular-nums">{total}</span> activities in the last {WEEKS} weeks
        </>
      }
    >
      {/* Readout for the hovered / tapped day (defaults to the busiest day) */}
      <p className="mt-4 h-4 text-[12px] leading-none text-fg-muted">
        {focus ? "" : "Busiest · "}
        <span className="text-fg">{dayLabel(shown)}</span> · <span className="text-fg-soft tabular-nums">{counts.get(shown) ?? 0}</span>{" "}
        {(counts.get(shown) ?? 0) === 1 ? "activity" : "activities"}
      </p>

      <div className="mt-3 flex gap-2" onPointerLeave={() => setFocus(null)}>
        <div className="flex flex-col justify-between pt-[18px] pb-[2px] text-[11px] leading-none text-fg-muted">
          {["Mon", "", "Wed", "", "Fri", "", ""].map((d, i) => (
            <span key={i} className="flex h-full items-center">
              {d}
            </span>
          ))}
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-12 gap-[4px]">
          {weeks.map((week, w) => {
            const m = Number(week[0].slice(5, 7)) - 1;
            const showMonth = w === 0 || Number(weeks[w - 1][0].slice(5, 7)) - 1 !== m;
            return (
              <div key={w} className="flex min-w-0 flex-col gap-[4px]">
                <span className="h-[14px] text-[11px] leading-none whitespace-nowrap text-fg-muted">{showMonth ? MONTHS[m] : ""}</span>
                {week.map((d) => {
                  const future = d > TODAY;
                  const n = counts.get(d) ?? 0;
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={future}
                      aria-label={`${dayLabel(d)}: ${n} activities`}
                      onPointerEnter={() => !future && setFocus(d)}
                      onFocus={() => setFocus(d)}
                      onClick={() => setFocus(d)}
                      className={cn(
                        "no-press aspect-square w-full animate-fade-in rounded-[3px] outline-none [animation-fill-mode:both] focus-visible:ring-2 focus-visible:ring-white/30",
                        shown === d && "ring-1 ring-fg/70",
                        future && "opacity-0",
                      )}
                      style={{ background: LEVELS[level(n)], animationDelay: `${w * 35}ms` }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-[4px] text-[11px] leading-none text-fg-muted">
        Less
        {LEVELS.map((c) => (
          <span key={c} className="size-[10px] rounded-[2px]" style={{ background: c }} />
        ))}
        More
      </div>

      <ul className="mt-4 flex flex-col">
        {byType.map((k) => (
          <li key={k.id} className="flex h-[43px] items-center gap-3 border-b border-line last:border-b-0">
            <ActivityIcon kind={k.id} size={24} className="rounded-md" />
            <span className="flex-1 text-[14px] leading-none font-medium text-fg">{k.plural}</span>
            <span className="h-[6px] w-24 overflow-hidden rounded-[2px] bg-meter-track-bar">
              <span
                className="block h-full rounded-[2px] bg-spark transition-[width] duration-700 ease-(--ease-ios)"
                style={{ width: `${(k.count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 text-right text-[14px] leading-none font-[450] text-fg tabular-nums">{k.count}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
