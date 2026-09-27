"use client";

import { useId, useMemo, useState } from "react";
import type { Pipeline, PipelineView, SiteStat } from "@/lib/pipelines";
import { usePipelines } from "@/lib/pipelines-store";
import { useCrm } from "@/lib/store";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Panel } from "@/components/forecast/panel";

const CELL = 10;
const DOT = 2.3;
/** Heat falloff radius in cells. */
const SIGMA = 3.6;
const LEVELS = [0.07, 0.2, 0.4, 0.65];
const LEVEL_OPACITY = [0.2, 0.36, 0.56, 0.85];

const circle = (cx: number, cy: number, r: number) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;

/**
 * Hero of a pipeline page: the region drawn as a dot matrix (one dot per land
 * cell). Land near open pipeline lights up in the pipeline's colour — a heat
 * map made of the same dots — and each account site is a marker sized by its
 * value. Hover and tap are shared with the territory list beside it.
 */
export function TerritoryMap({ pipeline, v }: { pipeline: Pipeline; v: PipelineView }) {
  const uid = useId().replace(/:/g, "");
  const { map, color } = pipeline;
  const siteFilter = usePipelines((s) => s.siteFilter);
  const setSiteFilter = usePipelines((s) => s.setSiteFilter);
  const [hover, setHover] = useState<string | null>(null);
  const W = map.cols * CELL;
  const H = map.rows * CELL;

  const geo = useMemo(() => {
    const max = Math.max(...v.sites.map((s) => s.open + s.won), 1);
    const markers = v.sites.map((s) => {
      const p = { x: ((s.site.lon - map.lon0) / map.lonStep) * CELL, y: ((map.lat0 - s.site.lat) / map.latStep) * CELL };
      return { s, ...p, r: 7 + Math.sqrt((s.open + s.won) / max) * 15, w: (s.open + s.won) / max, label: false };
    });
    // Label the biggest sites first, skipping any that would collide with a placed label.
    const placed: { x: number; y: number }[] = [];
    for (const m of markers) {
      if (placed.length >= 6) break;
      if (placed.some((p) => Math.abs(p.y - m.y) < 34 && Math.abs(p.x - m.x) < 170)) continue;
      m.label = true;
      placed.push(m);
    }
    let base = "";
    const heat = ["", "", "", ""];
    for (let y = 0; y < map.rows; y++) {
      const row = map.grid[y];
      for (let x = 0; x < map.cols; x++) {
        if (row[x] !== "1") continue;
        const cx = x * CELL + CELL / 2;
        const cy = y * CELL + CELL / 2;
        let h = 0;
        for (const m of markers) {
          const dx = (cx - m.x) / CELL;
          const dy = (cy - m.y) / CELL;
          h += m.w * Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
        }
        const level = LEVELS.findLastIndex((l) => h >= l);
        if (level >= 0) heat[level] += circle(cx, cy, DOT);
        else base += circle(cx, cy, DOT);
      }
    }
    return { markers, base, heat };
  }, [v.sites, map]);

  const active = hover ?? siteFilter;
  const hovered = geo.markers.find((m) => m.s.site.id === hover);

  return (
    <Panel
      title="Territory"
      subtitle={
        <>
          {v.sites.length} {v.sites.length === 1 ? "city" : "cities"} · {new Set(v.deals.map((d) => d.companyId)).size} accounts · {pipeline.description}
        </>
      }
      aside={
        <div className="flex items-center gap-4 text-[12px] leading-none text-fg-soft">
          <span className="flex items-center gap-[6px]">
            <span className="flex gap-[3px]">
              {LEVEL_OPACITY.map((o) => (
                <span key={o} className="size-[6px] rounded-full" style={{ background: color, opacity: o }} />
              ))}
            </span>
            Pipeline density
          </span>
          <span className="flex items-center gap-[6px]">
            <span className="size-2 rounded-full border" style={{ borderColor: color, background: `${color}33` }} />
            Account site
          </span>
        </div>
      }
    >
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative select-none">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto max-h-[600px] w-full overflow-visible" role="img" aria-label={`${pipeline.name} territory map`}>
            <defs>
              <clipPath id={`scan-${uid}`}>
                <rect x={0} y={0} width={W} height={H} className="animate-reveal" style={{ transformOrigin: "0px 0px" }} />
              </clipPath>
            </defs>
            <g clipPath={`url(#scan-${uid})`}>
              <path d={geo.base} fill="rgb(255 255 255 / 0.085)" />
              {geo.heat.map((d, i) => (
                <path key={i} d={d} fill={color} fillOpacity={LEVEL_OPACITY[i]} className="animate-fade-in" style={{ animationDelay: `${500 + i * 120}ms` }} />
              ))}
            </g>

            {geo.markers.map((m, i) => {
              const on = active === m.s.site.id;
              const dim = active && !on;
              return (
                <g
                  key={m.s.site.id}
                  className="cursor-pointer transition-opacity duration-200"
                  style={{ opacity: dim ? 0.4 : 1 }}
                  onPointerEnter={() => setHover(m.s.site.id)}
                  onPointerLeave={() => setHover(null)}
                  onClick={() => setSiteFilter(siteFilter === m.s.site.id ? null : m.s.site.id)}
                >
                  <circle cx={m.x} cy={m.y} r={Math.max(m.r, 16)} fill="transparent" />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={m.r}
                    fill={color}
                    fillOpacity={on ? 0.34 : 0.16}
                    stroke={color}
                    strokeOpacity={0.9}
                    strokeWidth={on ? 2.5 : 1.5}
                    className="animate-bubble-in transition-[fill-opacity,stroke-width] duration-200"
                    style={{ animationDelay: `${700 + i * 60}ms`, transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={3.5}
                    fill={color}
                    className="animate-bubble-in"
                    style={{ animationDelay: `${700 + i * 60}ms`, transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  {m.label && (
                    <text
                      x={m.x + (m.x > W - 140 ? -m.r - 8 : m.r + 8)}
                      y={m.y}
                      dy="0.34em"
                      textAnchor={m.x > W - 140 ? "end" : "start"}
                      className="pointer-events-none fill-fg-soft text-[17px] font-medium max-sm:hidden animate-fade-in"
                      style={{ animationDelay: `${1000 + i * 60}ms`, paintOrder: "stroke", stroke: "var(--color-app)", strokeWidth: 4 }}
                    >
                      {m.s.site.city}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {hovered && (
            <SiteTip
              s={hovered.s}
              color={color}
              left={(hovered.x / W) * 100}
              top={(hovered.y / H) * 100}
              flip={hovered.x / W > 0.6}
              below={hovered.y / H < 0.3}
            />
          )}
          {!v.sites.length && (
            <p className="absolute inset-0 flex items-center justify-center text-[13px] text-fg-muted">No deals in this view.</p>
          )}
        </div>

        <TerritoryList v={v} color={color} active={active} onHover={setHover} />
      </div>
    </Panel>
  );
}

function SiteTip({ s, color, left, top, flip, below }: { s: SiteStat; color: string; left: number; top: number; flip: boolean; below: boolean }) {
  const companies = useCrm((st) => st.companies);
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10 w-[220px] animate-pop-in rounded-[10px] border border-line-strong bg-panel px-3 py-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.5)]",
        flip ? "-translate-x-[calc(100%+16px)]" : "translate-x-4",
        below ? "translate-y-4" : "-translate-y-[calc(100%+16px)]",
      )}
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <div className="flex items-center gap-[6px] text-[12px] leading-none font-medium text-fg">
        <span className="size-2 rounded-full" style={{ background: color }} />
        {s.site.city}
        <span className="font-normal text-fg-muted">· {s.site.country}</span>
      </div>
      <div className="mt-[10px] flex flex-col gap-[7px] text-[12px] leading-none">
        {(
          [
            ["Open pipeline", `$${formatNumber(s.open)}`],
            ["Weighted", formatCompactCurrency(s.weighted)],
            ["Closed won", formatCompactCurrency(s.won)],
            ["Deals", String(s.deals.length)],
          ] as const
        ).map(([k, val]) => (
          <div key={k} className="flex items-center justify-between gap-3">
            <span className="text-fg-muted">{k}</span>
            <span className="font-medium text-fg tabular-nums">{val}</span>
          </div>
        ))}
      </div>
      <div className="mt-[10px] truncate border-t border-line-strong pt-[9px] text-[12px] leading-none text-fg-soft">
        {s.companies.map((id) => companies.find((c) => c.id === id)?.name ?? id).join(" · ")}
      </div>
    </div>
  );
}

/** Cities ranked by value; hovering a row lights its marker, tapping focuses the deal list. */
function TerritoryList({ v, color, active, onHover }: { v: PipelineView; color: string; active: string | null; onHover: (id: string | null) => void }) {
  const siteFilter = usePipelines((s) => s.siteFilter);
  const setSiteFilter = usePipelines((s) => s.setSiteFilter);
  const max = Math.max(...v.sites.map((s) => s.open + s.won), 1);

  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex h-8 items-center justify-between border-b border-line text-[12px] leading-none text-fg-muted">
        <span>City</span>
        <span>Open + won</span>
      </div>
      <div className="flex max-h-[420px] flex-col overflow-y-auto overscroll-contain">
        {v.sites.map((s, i) => {
          const on = active === s.site.id;
          return (
            <button
              key={s.site.id}
              type="button"
              onPointerEnter={() => onHover(s.site.id)}
              onPointerLeave={() => onHover(null)}
              onClick={() => setSiteFilter(siteFilter === s.site.id ? null : s.site.id)}
              aria-pressed={siteFilter === s.site.id}
              className={cn(
                "no-press -mx-2 flex min-h-[52px] flex-col justify-center gap-[8px] rounded-md border-b border-line px-2 text-left transition-colors last:border-b-0 hover:bg-row-hover",
                on && "bg-row-hover",
              )}
            >
              <span className="flex items-center gap-2 text-[14px] leading-none">
                <span className="size-2 shrink-0 rounded-full" style={{ background: color, opacity: on || !active ? 1 : 0.4 }} />
                <span className="truncate font-medium text-fg">{s.site.city}</span>
                <span className="truncate text-[12px] text-fg-muted">{s.site.country}</span>
                <span className="ml-auto shrink-0 font-[450] text-fg tabular-nums">
                  <span className="mr-[3px] text-[#7f7f7f]">$</span>
                  {formatCompactCurrency(s.open + s.won).slice(1)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="relative h-[4px] flex-1 overflow-hidden rounded-full bg-meter-track">
                  <span
                    className="absolute inset-y-0 left-0 origin-left animate-grow-x rounded-full transition-[width] duration-700 ease-(--ease-ios)"
                    style={{ width: `${((s.open + s.won) / max) * 100}%`, background: color, animationDelay: `${300 + i * 50}ms` }}
                  />
                </span>
                <span className="w-[52px] shrink-0 text-right text-[11px] leading-none text-fg-muted tabular-nums">
                  {s.deals.length} {s.deals.length === 1 ? "deal" : "deals"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
