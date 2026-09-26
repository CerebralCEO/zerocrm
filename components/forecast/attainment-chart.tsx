"use client";

import { useId, useMemo, useState } from "react";
import { useWidth } from "@/components/primitives/use-width";
import { TODAY } from "@/lib/deals-store";
import type { Forecast } from "@/lib/forecast";
import { cn, formatCompactCurrency, formatNumber, formatShortDate } from "@/lib/utils";
import { LegendItem, Panel, SERIES } from "./panel";

const PAD = { top: 18, right: 16, bottom: 30, left: 52 };
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Round the axis max up to a clean step so gridlines land on tidy values. */
function niceScale(max: number) {
  const steps = [100_000, 250_000, 500_000, 1_000_000, 2_000_000];
  const step = steps.find((s) => max / s <= 5) ?? 5_000_000;
  const top = Math.ceil(max / step) * step;
  return { top, ticks: Array.from({ length: top / step + 1 }, (_, i) => i * step) };
}

const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");

/**
 * Cumulative attainment for the period: closed-won to date (solid green with a
 * soft fill), commit and best-case projections from today (dashed amber), and
 * the quota line (dashed indigo). Hover / touch scrubs week by week.
 */
export function AttainmentChart({ f }: { f: Forecast }) {
  const uid = useId().replace(/:/g, "");
  const { ref, width } = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const height = width && width < 640 ? 220 : 280;

  const geo = useMemo(() => {
    if (!width) return null;
    const n = f.weeks.length;
    const innerW = width - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;
    const last = f.weeks[n - 1];
    const peak = Math.max(f.period.quota, last.best ?? 0, last.closed ?? 0, ...f.weeks.map((w) => w.closed ?? 0));
    const { top, ticks } = niceScale(peak * 1.08);
    const start = t(f.period.start);
    const span = t(f.period.end) + 86_400_000 - start;
    const xAt = (ms: number) => PAD.left + Math.max(0, Math.min(1, (ms - start) / span)) * innerW;
    const xWeek = (i: number) => xAt(t(f.weeks[i].end) + 86_400_000);
    const y = (v: number) => PAD.top + innerH - (v / top) * innerH;
    const now = t(TODAY);
    const live = f.todayIndex >= 0 && f.todayIndex < n;
    const xToday = xAt(now);

    const closedPts: [number, number][] = [[PAD.left, y(0)]];
    f.weeks.forEach((w, i) => {
      if (w.closed === null) return;
      closedPts.push([i === f.todayIndex ? xToday : xWeek(i), y(w.closed)]);
    });
    const origin: [number, number] = live ? [xToday, y(f.weeks[f.todayIndex].closed ?? 0)] : [PAD.left, y(0)];
    const future = f.weeks.map((w, i) => ({ w, i })).filter(({ w, i }) => w.commit !== null && i !== f.todayIndex);
    const commitPts: [number, number][] = f.todayIndex >= n ? [] : [origin, ...future.map(({ w, i }) => [xWeek(i), y(w.commit!)] as [number, number])];
    const bestPts: [number, number][] = f.todayIndex >= n ? [] : [origin, ...future.map(({ w, i }) => [xWeek(i), y(w.best!)] as [number, number])];

    // Month labels at each month's first week.
    const months: { x: number; label: string }[] = [];
    let prev = "";
    f.weeks.forEach((w, i) => {
      const m = w.start.slice(5, 7);
      if (m !== prev) {
        months.push({ x: i === 0 ? PAD.left : xAt(t(w.start)), label: formatShortDate(w.start).split(" ")[0] });
        prev = m;
      }
    });

    return { n, innerW, innerH, y, ticks, xWeek, xToday, live, closedPts, commitPts, bestPts, months, quotaY: y(f.period.quota) };
  }, [f, width, height]);

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    if (!geo) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left;
    let best = 0;
    let dist = Infinity;
    for (let i = 0; i < geo.n; i++) {
      const d = Math.abs(geo.xWeek(i) - PAD.left - x);
      if (d < dist) [best, dist] = [i, d];
    }
    setHover(best);
  };

  const hw = hover !== null ? f.weeks[hover] : null;
  const tipX = geo && hover !== null ? geo.xWeek(hover) : 0;

  return (
    <Panel
      title="Quota attainment"
      subtitle={
        <>
          {f.period.label} · {f.period.range} · quota{" "}
          <span className="text-fg-soft tabular-nums">${formatNumber(f.period.quota)}</span>
        </>
      }
      aside={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <LegendItem color={SERIES.closed} label="Closed won" />
          <LegendItem color={SERIES.commit} label="Commit" dashed />
          <LegendItem color={SERIES.best} label="Best case" dashed />
          <LegendItem color={SERIES.quota} label="Quota" dashed />
        </div>
      }
    >
      <div ref={ref} className="relative mt-4 w-full select-none" style={{ height }}>
        {geo && (
          <svg width={width} height={height} className="block overflow-visible" role="img" aria-label={`Quota attainment chart for ${f.period.label}`}>
            <defs>
              <clipPath id={`reveal-${uid}`}>
                <rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  className="animate-reveal"
                  style={{ transformOrigin: `${PAD.left}px 0px` }}
                />
              </clipPath>
            </defs>

            {/* Gridlines + y labels */}
            {geo.ticks.map((v) => (
              <g key={v}>
                <line x1={PAD.left} x2={width - PAD.right} y1={geo.y(v)} y2={geo.y(v)} className="stroke-line" strokeWidth={1} />
                <text x={PAD.left - 10} y={geo.y(v)} dy="0.32em" textAnchor="end" className="fill-fg-muted text-[12px] tabular-nums">
                  {formatCompactCurrency(v)}
                </text>
              </g>
            ))}
            {/* Month labels */}
            {geo.months.map((m) => (
              <text key={m.label} x={m.x} y={height - 8} className="fill-fg-muted text-[12px]">
                {m.label}
              </text>
            ))}

            {/* Quota */}
            <line
              x1={PAD.left}
              x2={width - PAD.right}
              y1={geo.quotaY}
              y2={geo.quotaY}
              stroke={SERIES.quota}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <text x={PAD.left + 8} y={geo.quotaY - 8} className="text-[12px]">
              <tspan className="fill-fg-muted">Quota </tspan>
              <tspan className="fill-fg tabular-nums">{formatCompactCurrency(f.period.quota)}</tspan>
            </text>

            {/* Today marker */}
            {geo.live && (
              <g>
                <line x1={geo.xToday} x2={geo.xToday} y1={PAD.top} y2={height - PAD.bottom} className="stroke-line-strong" strokeWidth={1} />
                <text x={geo.xToday + 6} y={PAD.top + 10} className="fill-fg-muted text-[12px]">
                  Today
                </text>
              </g>
            )}

            <g clipPath={`url(#reveal-${uid})`}>
              {/* Closed won — soft fill + line */}
              {geo.closedPts.length > 1 && (
                <>
                  <path
                    d={`${path(geo.closedPts)}L${geo.closedPts.at(-1)![0]},${geo.y(0)}Z`}
                    fill={SERIES.closed}
                    opacity={0.12}
                  />
                  <path d={path(geo.closedPts)} fill="none" stroke={SERIES.closed} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                </>
              )}
              {/* Projections */}
              {geo.bestPts.length > 1 && (
                <path d={path(geo.bestPts)} fill="none" stroke={SERIES.best} strokeWidth={1.5} strokeDasharray="5 4" strokeLinejoin="round" />
              )}
              {geo.commitPts.length > 1 && (
                <path d={path(geo.commitPts)} fill="none" stroke={SERIES.commit} strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" />
              )}
              {geo.commitPts.length > 1 && (
                <>
                  <circle cx={geo.bestPts.at(-1)![0]} cy={geo.bestPts.at(-1)![1]} r={3} fill={SERIES.best} />
                  <circle cx={geo.commitPts.at(-1)![0]} cy={geo.commitPts.at(-1)![1]} r={3.5} fill={SERIES.commit} />
                </>
              )}
            </g>

            {/* Live "today" point */}
            {geo.live && (
              <g>
                <circle
                  cx={geo.closedPts.at(-1)![0]}
                  cy={geo.closedPts.at(-1)![1]}
                  r={4}
                  fill={SERIES.closed}
                  className="animate-live-pulse"
                  style={{ transformOrigin: `${geo.closedPts.at(-1)![0]}px ${geo.closedPts.at(-1)![1]}px` }}
                />
                <circle cx={geo.closedPts.at(-1)![0]} cy={geo.closedPts.at(-1)![1]} r={4} fill={SERIES.closed} stroke="var(--color-app)" strokeWidth={2} />
              </g>
            )}

            {/* Hover crosshair */}
            {hw && (
              <g className="pointer-events-none">
                <line x1={tipX} x2={tipX} y1={PAD.top} y2={height - PAD.bottom} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
                {hw.closed !== null && <circle cx={tipX} cy={geo.y(hw.closed)} r={3.5} fill={SERIES.closed} stroke="var(--color-app)" strokeWidth={2} />}
                {hw.best !== null && <circle cx={tipX} cy={geo.y(hw.best)} r={3} fill={SERIES.best} stroke="var(--color-app)" strokeWidth={2} />}
                {hw.commit !== null && <circle cx={tipX} cy={geo.y(hw.commit)} r={3.5} fill={SERIES.commit} stroke="var(--color-app)" strokeWidth={2} />}
              </g>
            )}

            <rect
              x={PAD.left}
              y={PAD.top}
              width={geo.innerW}
              height={geo.innerH}
              fill="transparent"
              className="cursor-crosshair touch-pan-y"
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            />
          </svg>
        )}

        {/* Tooltip */}
        {geo && hw && (
          <div
            className={cn(
              "pointer-events-none absolute top-2 z-10 w-[188px] rounded-[10px] border border-line-strong bg-panel px-3 py-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.5)] animate-pop-in",
            )}
            style={{ left: Math.min(Math.max(tipX - 94, 0), width - 188) }}
          >
            <div className="mb-[9px] text-[12px] font-medium leading-none text-fg">
              Week of {formatShortDate(hw.start)}
            </div>
            <div className="flex flex-col gap-[7px] text-[12px] leading-none">
              {(
                [
                  ["Closed won", hw.closed, SERIES.closed],
                  ["Commit", hw.commit, SERIES.commit],
                  ["Best case", hw.best, SERIES.best],
                  ["Quota", f.period.quota, SERIES.quota],
                ] as const
              )
                .filter(([, v]) => v !== null)
                .map(([label, v, color]) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-[6px] text-fg-muted">
                      <span className="size-2 rounded-full" style={{ background: color }} />
                      {label}
                    </span>
                    <span className="font-medium text-fg tabular-nums">{formatCompactCurrency(v!)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}
