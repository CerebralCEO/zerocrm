"use client";

import { useQ1 } from "@/lib/q1-store";
import type { ScenarioId } from "@/lib/q1";
import type { Q1Plan } from "@/lib/q1";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Slider } from "@/components/ui/form";
import { Segmented } from "@/components/ui/segmented";
import { gradientColors } from "@/components/primitives/meter";
import { useTween } from "@/components/primitives/use-tween";
import { Panel } from "@/components/forecast/panel";

const N = 41;
const W = 320;
const CX = W / 2;
const CY = 164;
const R = 148;
const THICK = 24;
const GAP = 0.9; // degrees between segments

const rad = (deg: number) => (deg * Math.PI) / 180;
// Rounded so server and client (whose Math.cos can differ in the last digit) render identical paths.
const round = (n: number) => Math.round(n * 100) / 100;
const pt = (r: number, deg: number) => [round(CX + r * Math.cos(rad(deg))), round(CY - r * Math.sin(rad(deg)))] as const;

/** Annular sector between two angles (degrees, 180 = left, 0 = right). */
function sector(a0: number, a1: number) {
  const [x0, y0] = pt(R, a0);
  const [x1, y1] = pt(R, a1);
  const [x2, y2] = pt(R - THICK, a1);
  const [x3, y3] = pt(R - THICK, a0);
  return `M${x0},${y0}A${R},${R} 0 0 1 ${x1},${y1}L${x2},${y2}A${R - THICK},${R - THICK} 0 0 0 ${x3},${y3}Z`;
}

const SEGMENTS = Array.from({ length: N }, (_, i) => {
  const a0 = 180 - (i / N) * 180 - GAP / 2;
  const a1 = 180 - ((i + 1) / N) * 180 + GAP / 2;
  return sector(i === 0 ? 180 : a0, i === N - 1 ? 0 : a1);
});

/**
 * Hero of the Q1 plan: a 41-segment semicircular win-meter showing projected
 * attainment, with the scenario planner directly underneath so every slider
 * move re-lights the gauge.
 */
export function AttainmentGauge({ p }: { p: Q1Plan }) {
  const { preset, scenario, setPreset, tune } = useQ1();
  const pct = useTween(p.attainment, { from: 0, ms: 900 });
  const projected = useTween(p.projected, { from: 0, ms: 900 });
  const filled = Math.round((Math.min(p.attainment, 100) / 100) * N);
  const colors = gradientColors(filled);
  const secured = p.renewals + p.weighted + p.slipIn;
  const securedPct = Math.round((secured / p.quota) * 100);
  // The tick is drawn at 180° and rotated into place, so it glides along the arc.
  const securedTurn = Math.min(secured / p.quota, 1) * 180;

  return (
    <Panel title="Projected attainment" subtitle="Where Q1 lands if the plan below holds">
      <div className="relative mx-auto mt-5 w-full max-w-[360px]">
        <svg
          viewBox={`-8 -8 ${W + 16} ${CY + 12}`}
          className="block w-full overflow-visible"
          role="img"
          aria-label={`Projected Q1 attainment ${p.attainment}%`}
        >
          {SEGMENTS.map((d, i) => (
            <path
              key={i}
              d={d}
              className="animate-seg-in transition-[fill] duration-300"
              style={{
                fill: colors[i] ?? "var(--color-meter-empty)",
                animationDelay: `${i * 14}ms`,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          ))}
          {/* Secured today: renewals + weighted open + expected slip-in */}
          <line
            x1={CX - R - 7}
            y1={CY}
            x2={CX - R + THICK + 7}
            y2={CY}
            stroke="var(--color-fg)"
            strokeWidth={2}
            strokeLinecap="round"
            className="transition-transform duration-700 ease-(--ease-ios)"
            style={{
              transform: `rotate(${securedTurn}deg)`,
              transformOrigin: `${CX}px ${CY}px`,
            }}
          />
          <text x={CX - R + THICK / 2} y={CY + 14} textAnchor="middle" className="fill-fg-muted text-[11px]">
            0
          </text>
          <text x={CX + R - THICK / 2} y={CY + 14} textAnchor="middle" className="fill-fg-muted text-[11px]">
            {formatCompactCurrency(p.quota)}
          </text>
        </svg>
        {/* Readout sits inside the arc */}
        <div className="absolute inset-x-0 bottom-[14px] flex flex-col items-center gap-[9px]">
          <span className="text-[40px] leading-none font-semibold tracking-[-1.2px] text-fg tabular-nums">
            {Math.round(pct)}
            <span className="ml-[2px] text-[22px] font-medium tracking-[-0.5px] text-[#7f7f7f]">%</span>
          </span>
          <span className="text-[12px] leading-none text-fg-muted tabular-nums">
            <span className="text-fg-soft">${formatNumber(Math.round(projected))}</span> projected
          </span>
          <span className={cn("text-[12px] leading-none font-medium tabular-nums", p.gap > 0 ? "text-danger-dot" : "text-meter-green")}>
            {p.gap > 0 ? `${formatCompactCurrency(p.gap)} short of quota` : `${formatCompactCurrency(-p.gap)} ahead of quota`}
          </span>
        </div>
      </div>
      <p className="mt-4 flex items-center justify-center gap-[6px] text-[12px] leading-none text-fg-muted">
        <span className="h-[2px] w-3 rounded-full bg-fg" />
        <span className="text-fg-soft tabular-nums">Secured {securedPct}%</span> renewals + open pipeline + slip-in
      </p>

      <div className="mt-6 border-t border-line pt-4">
        <Segmented<ScenarioId>
          label="Scenario"
          value={preset === "custom" ? "base" : preset}
          onChange={setPreset}
          options={[
            { value: "conservative", label: "Conservative" },
            { value: "base", label: "Base" },
            { value: "upside", label: "Upside" },
          ]}
          className={cn(preset === "custom" && "[&>span[aria-hidden]]:opacity-0 [&_[data-active=true]]:text-fg-muted")}
        />
        <div className="mt-5 flex flex-col gap-[18px]">
          <Knob
            label="Win rate on new pipeline"
            value={`${scenario.winRate}%`}
            slider={<Slider label="Win rate" min={10} max={50} value={scenario.winRate} onValueChange={(v) => tune({ winRate: v })} />}
          />
          <Knob
            label="Pipeline created per week"
            value={formatCompactCurrency(scenario.weeklyGen)}
            slider={
              <Slider
                label="Pipeline created per week"
                min={40_000}
                max={300_000}
                step={10_000}
                value={scenario.weeklyGen}
                onValueChange={(v) => tune({ weeklyGen: v })}
              />
            }
          />
          <Knob
            label="FQ4 pipeline slipping into Q1"
            value={`${scenario.slipIn}%`}
            slider={<Slider label="FQ4 slip-in" min={0} max={60} step={5} value={scenario.slipIn} onValueChange={(v) => tune({ slipIn: v })} />}
          />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-2">
          <div className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
            <dt className="text-[12px] leading-none text-fg-soft/80">Needed per week</dt>
            <dd className="text-[14px] font-medium leading-none text-fg tabular-nums">
              {p.requiredGen === null ? "Covered" : formatCompactCurrency(p.requiredGen)}{" "}
              <span
                className={cn(
                  "text-[12px] font-normal",
                  p.requiredGen === null || p.requiredGen <= scenario.weeklyGen ? "text-meter-green" : "text-danger-dot",
                )}
              >
                {p.requiredGen === null ? "without new pipeline" : p.requiredGen <= scenario.weeklyGen ? "on plan" : "to hit quota"}
              </span>
            </dd>
          </div>
          <div className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
            <dt className="text-[12px] leading-none text-fg-soft/80">New pipeline by Mar 1</dt>
            <dd className="text-[14px] font-medium leading-none text-fg tabular-nums">
              {formatCompactCurrency(p.newPipeline)} <span className="text-[12px] font-normal text-fg-muted">in {p.genWeeks} wks</span>
            </dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
}

function Knob({ label, value, slider }: { label: string; value: string; slider: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center justify-between text-[12px] leading-none">
        <span className="text-fg-soft">{label}</span>
        <span className="font-medium text-fg tabular-nums">{value}</span>
      </div>
      {slider}
    </div>
  );
}
