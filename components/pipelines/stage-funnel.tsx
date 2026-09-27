"use client";

import type { PipelineView } from "@/lib/pipelines";
import { usePipelines } from "@/lib/pipelines-store";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { TONES } from "@/components/primitives/tag";
import { useWidth } from "@/components/primitives/use-width";
import { Panel } from "@/components/forecast/panel";

const H = 200;

/**
 * Horizontal funnel: one bar per stage, height = value that has reached that
 * stage (at it or beyond), joined by tapered bands with the stage-to-stage
 * conversion in between. Tapping a stage focuses the deal list on it.
 */
export function StageFunnel({ v }: { v: PipelineView }) {
  const { ref, width } = useWidth();
  const stageFilter = usePipelines((s) => s.stageFilter);
  const setStageFilter = usePipelines((s) => s.setStageFilter);
  const n = v.funnel.length;
  const top = Math.max(v.funnel[0]?.value ?? 0, 1);
  const col = width / n;
  const barW = Math.min(col * 0.3, 56);
  const h = (val: number) => Math.max((val / top) * H, val ? 4 : 1);
  const mid = H / 2;
  const overall = v.funnel[0]?.value ? Math.round((v.funnel[n - 1].value / v.funnel[0].value) * 100) : 0;

  return (
    <Panel
      title="Stage funnel"
      subtitle={
        <>
          Value that reached each stage · <span className="text-fg-soft tabular-nums">{overall}%</span> of it closed won
        </>
      }
      aside={
        stageFilter ? (
          <button
            type="button"
            onClick={() => setStageFilter(null)}
            className="flex h-[30px] items-center rounded-full border border-white/[0.09] bg-[#1b1b1b] px-[10px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
          >
            Clear stage
          </button>
        ) : undefined
      }
    >
      <div ref={ref} className="relative mt-6 w-full select-none">
        {width > 0 && (
          <>
            {/* Stage names + reached value above */}
            <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {v.funnel.map((f) => (
                <div key={f.stage} className="flex min-w-0 flex-col items-center gap-[7px] px-1 text-center">
                  <span className="w-full truncate text-[12px] leading-none font-medium text-fg-soft">{f.label}</span>
                  <span className="text-[16px] leading-none font-medium tracking-[-0.3px] text-fg tabular-nums max-sm:text-[13px]">
                    {formatCompactCurrency(f.value)}
                  </span>
                </div>
              ))}
            </div>

            <svg width={width} height={H} className="mt-4 block overflow-visible" role="img" aria-label="Pipeline stage funnel">
              {v.funnel.slice(0, -1).map((f, i) => {
                const next = v.funnel[i + 1];
                const x0 = col * i + col / 2 + barW / 2;
                const x1 = col * (i + 1) + col / 2 - barW / 2;
                const h0 = h(f.value) / 2;
                const h1 = h(next.value) / 2;
                const m = (x0 + x1) / 2;
                return (
                  <path
                    key={f.stage}
                    d={`M${x0},${mid - h0}C${m},${mid - h0} ${m},${mid - h1} ${x1},${mid - h1}L${x1},${mid + h1}C${m},${mid + h1} ${m},${mid + h0} ${x0},${mid + h0}Z`}
                    fill="rgb(255 255 255 / 0.05)"
                    className="animate-fade-in transition-[d] duration-700 ease-(--ease-ios)"
                    style={{ animationDelay: `${200 + i * 90}ms` }}
                  />
                );
              })}
              {v.funnel.map((f, i) => {
                const hh = h(f.value);
                const on = !stageFilter || stageFilter === f.stage;
                return (
                  <g key={f.stage} className="cursor-pointer" onClick={() => setStageFilter(stageFilter === f.stage ? null : f.stage)}>
                    <rect x={col * i} y={0} width={col} height={H} fill="transparent" />
                    <rect
                      x={col * i + col / 2 - barW / 2}
                      y={mid - hh / 2}
                      width={barW}
                      height={hh}
                      rx={2}
                      fill={TONES[f.tone].text}
                      fillOpacity={on ? 0.9 : 0.25}
                      className="animate-bar-grow transition-[y,height,fill-opacity] duration-700 ease-(--ease-ios)"
                      style={{ animationDelay: `${i * 90}ms`, transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Conversion pills sit on the bands */}
            <div className="pointer-events-none absolute inset-x-0" style={{ top: `calc(100% - ${H / 2}px - 11px)` }}>
              {v.funnel.slice(0, -1).map((f, i) => {
                const next = v.funnel[i + 1];
                const rate = f.value ? Math.round((next.value / f.value) * 100) : 0;
                return (
                  <span
                    key={f.stage}
                    className="absolute flex h-[22px] -translate-x-1/2 items-center rounded-full border border-line-strong bg-app px-[7px] text-[11px] leading-none font-medium text-fg tabular-nums animate-fade-in"
                    style={{ left: col * (i + 1), animationDelay: `${500 + i * 90}ms` }}
                  >
                    {rate}%
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div className="mt-4 grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {v.funnel.map((f) => (
          <span
            key={f.stage}
            className={cn("text-center text-[12px] leading-none text-fg-muted tabular-nums", stageFilter === f.stage && "text-fg")}
          >
            {f.atStage} <span className="max-sm:hidden">{f.stage === "won" ? "won" : "here"}</span>
          </span>
        ))}
      </div>
    </Panel>
  );
}
