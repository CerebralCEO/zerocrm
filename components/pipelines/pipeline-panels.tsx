"use client";

import { STAGES } from "@/lib/deals";
import { TODAY } from "@/lib/deals-store";
import { ownerById } from "@/lib/data";
import type { Pipeline, PipelineView } from "@/lib/pipelines";
import { usePipelines } from "@/lib/pipelines-store";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { TONES } from "@/components/primitives/tag";
import { LegendItem, Panel } from "@/components/forecast/panel";

const H = 170;

/** Value by close month (Aug → Apr), stacked by stage, with a Today divider. */
export function CloseTimeline({ v }: { v: PipelineView }) {
  const peak = Math.max(...v.months.map((m) => m.total), 1) * 1.18;
  const todayKey = TODAY.slice(0, 7);

  return (
    <Panel
      title="When it closes"
      subtitle="Deal value by close month, stacked by stage"
      aside={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {STAGES.map((s) => (
            <LegendItem key={s.id} color={TONES[s.tone].text} label={s.label} />
          ))}
        </div>
      }
    >
      <div className="mt-8 grid" style={{ gridTemplateColumns: `repeat(${v.months.length}, minmax(0, 1fr))` }}>
        {v.months.map((m, i) => (
          <div key={m.key} className={cn("relative flex flex-col items-center", m.key === todayKey && "")}>
            {m.key === todayKey && <span className="pointer-events-none absolute top-[-14px] bottom-[26px] right-0 w-px bg-line-strong" />}
            {m.key === todayKey && (
              <span className="absolute top-[-22px] right-0 translate-x-1/2 rounded-full border border-line-strong bg-app px-[6px] py-[3px] text-[10px] leading-none font-medium text-fg">
                Today
              </span>
            )}
            <div className="flex w-full items-end justify-center" style={{ height: H }}>
              <div
                className="relative flex w-[46%] max-w-[40px] origin-bottom animate-bar-grow flex-col-reverse gap-[2px]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {m.total > 0 && (
                  <span className="absolute bottom-[calc(100%+7px)] left-1/2 -translate-x-1/2 text-[11px] leading-none font-medium whitespace-nowrap text-fg tabular-nums max-sm:hidden">
                    {formatCompactCurrency(m.total)}
                  </span>
                )}
                {STAGES.map((s) =>
                  m.byStage[s.id] > 0 ? (
                    <span
                      key={s.id}
                      className="w-full rounded-[1px] transition-[height] duration-700 ease-(--ease-ios)"
                      style={{ height: Math.max((m.byStage[s.id] / peak) * H, 3), background: TONES[s.tone].text }}
                    />
                  ) : null,
                )}
              </div>
            </div>
            <div className="mt-[10px] h-px w-full bg-line" />
            <span className={cn("mt-[10px] text-[12px] leading-none", m.key < todayKey ? "text-fg-faint" : "text-fg-muted")}>{m.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/** Who carries the pipeline: one bar split by owner in the pipeline colour, then a row per owner. Tap to filter. */
export function OwnerMix({ pipeline, v }: { pipeline: Pipeline; v: PipelineView }) {
  const ownerFilter = usePipelines((s) => s.ownerFilter);
  const setOwnerFilter = usePipelines((s) => s.setOwnerFilter);
  const shade = (i: number) => Math.max(1 - i * 0.16, 0.18);
  const rows = v.owners.slice(0, 6);

  return (
    <Panel
      title="Who carries it"
      subtitle={
        <>
          {v.owners.length} {v.owners.length === 1 ? "owner" : "owners"} · top rep holds{" "}
          <span className="text-fg-soft tabular-nums">{Math.round((v.owners[0]?.share ?? 0) * 100)}%</span> of open value
        </>
      }
    >
      <div className="mt-5 flex h-[10px] gap-[2px] overflow-hidden rounded-[2px] bg-meter-track">
        {v.owners.map((o, i) => (
          <span
            key={o.ownerId}
            className="h-full origin-left animate-grow-x transition-[width] duration-700 ease-(--ease-ios)"
            style={{ width: `${o.share * 100}%`, background: pipeline.color, opacity: shade(i), animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-col">
        {rows.map((o, i) => (
          <button
            key={o.ownerId}
            type="button"
            onClick={() => setOwnerFilter(ownerFilter === o.ownerId ? null : o.ownerId)}
            className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover"
          >
            <span className="size-2 shrink-0 rounded-full" style={{ background: pipeline.color, opacity: shade(i) }} />
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Avatar name={ownerById(o.ownerId).name} size={20} />
              <span className="truncate font-medium">{ownerById(o.ownerId).name}</span>
            </span>
            <span className="w-[56px] text-right text-[12px] text-fg-muted tabular-nums max-sm:hidden">
              {o.deals} {o.deals === 1 ? "deal" : "deals"}
            </span>
            <span className="w-[64px] text-right tabular-nums">
              <span className="mr-[3px] text-[#7f7f7f]">$</span>
              {formatCompactCurrency(o.value).slice(1)}
            </span>
            <span className="w-[40px] text-right text-[12px] text-fg-soft tabular-nums">{Math.round(o.share * 100)}%</span>
          </button>
        ))}
        {!rows.length && <p className="py-10 text-center text-[13px] text-fg-muted">No open deals.</p>}
      </div>
    </Panel>
  );
}
