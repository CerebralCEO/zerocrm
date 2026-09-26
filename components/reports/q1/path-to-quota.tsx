"use client";

import type { Q1Plan } from "@/lib/q1";
import { useQ1 } from "@/lib/q1-store";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { LegendItem, Panel, SERIES } from "@/components/forecast/panel";

const H = 280;

type Step = {
  key: string;
  label: string;
  /** Phone label — the six columns are ~55px wide there. */
  tiny: string;
  hint: string;
  value: number;
  color: string;
  dashed?: boolean;
};

/**
 * Waterfall from renewals to the projected number: each source floats on top
 * of the last, the projected column restacks them, and the final column is
 * the gap (or cushion) against the dashed quota line. Bars glide when the
 * scenario changes.
 */
export function PathToQuota({ p }: { p: Q1Plan }) {
  const scenario = useQ1((s) => s.scenario);
  const steps: Step[] = [
    {
      key: "renewals",
      label: "Renewals",
      tiny: "Renew",
      hint: "95% retention",
      value: p.renewals,
      color: SERIES.closed,
    },
    {
      key: "open",
      label: "Open pipeline",
      tiny: "Open",
      hint: `${p.deals.length} deals, weighted`,
      value: p.weighted,
      color: SERIES.commit,
    },
    {
      key: "slip",
      label: "FQ4 slip-in",
      tiny: "Slip-in",
      hint: `${scenario.slipIn}% of ${formatCompactCurrency(p.fq4Weighted)}`,
      value: p.slipIn,
      color: SERIES.best,
    },
    {
      key: "new",
      label: "New pipeline",
      tiny: "New",
      hint: `${formatCompactCurrency(p.newPipeline)} × ${scenario.winRate}%`,
      value: p.newWon,
      color: SERIES.pipeline,
      dashed: true,
    },
  ];
  const top = Math.max(p.quota, p.projected) * 1.12 || 1;
  const y = (v: number) => (v / top) * H;
  let run = 0;
  const floats = steps.map((s) => {
    const base = run;
    run += s.value;
    return { ...s, base };
  });
  const short = p.gap > 0;

  return (
    <Panel
      title="Path to quota"
      subtitle="How the projected number is built, source by source"
      aside={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <LegendItem color={SERIES.closed} label="Renewals" />
          <LegendItem color={SERIES.commit} label="Open" />
          <LegendItem color={SERIES.best} label="Slip-in" />
          <LegendItem color="var(--color-fg-muted)" label="Not yet created" dashed />
          <LegendItem color={SERIES.quota} label="Quota" dashed />
        </div>
      }
    >
      <div className="mt-9">
        <div className="relative">
          {/* Quota line across every column */}
          <div
            className="pointer-events-none absolute inset-x-0 z-[1] border-t border-dashed transition-[bottom] duration-700 ease-(--ease-ios)"
            style={{ bottom: y(p.quota), borderColor: SERIES.quota }}
          >
            <span className="absolute -top-[18px] left-0 text-[12px] leading-none whitespace-nowrap">
              <span className="text-fg-muted">Quota </span>
              <span className="text-fg tabular-nums">{formatCompactCurrency(p.quota)}</span>
            </span>
          </div>

          <div className="grid grid-cols-6" style={{ height: H }}>
            {floats.map((s, i) => (
              <Column key={s.key} index={i}>
                <Bar bottom={y(s.base)} height={y(s.value)} label={`+${formatCompactCurrency(s.value)}`}>
                  <span
                    className={cn("absolute inset-0 rounded-[2px]", s.dashed && "border border-dashed border-fg-muted/70")}
                    style={{
                      background: s.dashed ? "rgb(255 255 255 / 0.04)" : s.color,
                    }}
                  />
                </Bar>
                {/* Connector to the next column */}
                <span
                  className="pointer-events-none absolute right-[calc(-50%+min(21%,32px))] left-[calc(50%+min(21%,32px))] border-t border-dashed border-line-strong transition-[bottom] duration-700 ease-(--ease-ios)"
                  style={{ bottom: y(s.base + s.value) }}
                />
              </Column>
            ))}

            {/* Projected: the four sources restacked */}
            <Column index={4}>
              <Bar bottom={0} height={y(p.projected)} label={formatCompactCurrency(p.projected)} strong>
                <span className="absolute inset-0 flex flex-col-reverse gap-[2px] overflow-hidden rounded-[2px]">
                  {floats.map((s) =>
                    s.value > 0 ? (
                      <span
                        key={s.key}
                        className={cn(
                          "w-full shrink-0 transition-[height] duration-700 ease-(--ease-ios)",
                          s.dashed && "border border-dashed border-fg-muted/70",
                        )}
                        style={{
                          height: `${(s.value / Math.max(p.projected, 1)) * 100}%`,
                          background: s.dashed ? "rgb(255 255 255 / 0.04)" : s.color,
                        }}
                      />
                    ) : null,
                  )}
                </span>
              </Bar>
            </Column>

            {/* Gap to quota (hatched coral) or cushion above it (hatched green) */}
            <Column index={5}>
              <Bar
                bottom={y(Math.min(p.projected, p.quota))}
                height={y(Math.abs(p.gap))}
                label={`${short ? "−" : "+"}${formatCompactCurrency(Math.abs(p.gap))}`}
                labelClass={short ? "text-danger-dot" : "text-meter-green"}
              >
                <span
                  className="absolute inset-0 rounded-[2px] border border-dashed"
                  style={{
                    borderColor: short ? "rgb(249 115 115 / 0.7)" : "rgb(34 197 94 / 0.7)",
                    background: `repeating-linear-gradient(135deg, ${short ? "rgb(249 115 115 / 0.28)" : "rgb(34 197 94 / 0.28)"} 0 4px, transparent 4px 8px)`,
                  }}
                />
              </Bar>
            </Column>
          </div>
        </div>

        <div className="h-px bg-line" />
        <div className="grid grid-cols-6">
          {[
            ...steps.map((s) => ({ label: s.label, tiny: s.tiny, hint: s.hint })),
            { label: "Projected", tiny: "Total", hint: `${p.attainment}% of quota` },
            {
              label: short ? "Gap" : "Cushion",
              tiny: short ? "Gap" : "Cushion",
              hint: short ? "to find" : "above quota",
            },
          ].map((c) => (
            <div key={c.label} className="flex min-w-0 flex-col items-center gap-[6px] px-1 pt-[10px] text-center">
              <span className="w-full truncate text-[12px] leading-none font-medium text-fg-soft">
                <span className="max-sm:hidden">{c.label}</span>
                <span className="sm:hidden">{c.tiny}</span>
              </span>
              <span className="w-full truncate text-[11px] leading-none text-fg-muted tabular-nums max-sm:hidden">{c.hint}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function Column({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="relative h-full animate-bar-grow origin-bottom" style={{ animationDelay: `${index * 90}ms` }}>
      {children}
    </div>
  );
}

function Bar({
  bottom,
  height,
  label,
  labelClass,
  strong,
  children,
}: {
  bottom: number;
  height: number;
  label: string;
  labelClass?: string;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute left-1/2 w-[42%] max-w-[64px] -translate-x-1/2 transition-[bottom,height] duration-700 ease-(--ease-ios)"
      style={{ bottom, height: Math.max(height, 2) }}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 text-[12px] leading-none whitespace-nowrap tabular-nums",
          strong ? "font-semibold text-fg" : "font-medium text-fg",
          labelClass,
        )}
      >
        {label}
      </span>
    </div>
  );
}
