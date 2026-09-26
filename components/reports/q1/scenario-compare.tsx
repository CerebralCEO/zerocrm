"use client";

import { useMemo } from "react";
import { useDeals } from "@/lib/deals-store";
import { useQ1 } from "@/lib/q1-store";
import { SCENARIOS, buildQ1Plan, type ScenarioId } from "@/lib/q1";
import { cn, formatCompactCurrency } from "@/lib/utils";
import { SegmentedMeter } from "@/components/primitives/meter";
import { useTween } from "@/components/primitives/use-tween";

const IDS = Object.keys(SCENARIOS) as ScenarioId[];

/** The three presets side by side — tap one to load it into the planner. */
export function ScenarioCompare() {
  const deals = useDeals((s) => s.deals);
  const { preset, scenario, ownerFilter, setPreset } = useQ1();
  const plans = useMemo(() => {
    const rows = IDS.map((id) => ({
      id: id as ScenarioId | "custom",
      label: SCENARIOS[id].label,
      s: SCENARIOS[id],
      plan: buildQ1Plan(deals, SCENARIOS[id], ownerFilter),
    }));
    if (preset === "custom")
      rows.push({
        id: "custom",
        label: "Your plan",
        s: { ...scenario, label: "Custom" },
        plan: buildQ1Plan(deals, scenario, ownerFilter),
      });
    return rows;
  }, [deals, ownerFilter, preset, scenario]);

  return (
    <div className="border-t border-line px-4 pt-[18px] pb-4">
      <header className="flex flex-col gap-[7px]">
        <h2 className="text-[14px] font-medium leading-none text-fg">Scenarios</h2>
        <p className="text-[12px] leading-none text-fg-muted">Same pipeline, different assumptions</p>
      </header>
      <div className={cn("mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3", plans.length > 3 && "sm:grid-cols-2 xl:grid-cols-4")}>
        {plans.map((r) => (
          <Tile
            key={r.id}
            active={preset === r.id}
            label={r.label}
            hint={`${r.s.winRate}% win · ${formatCompactCurrency(r.s.weeklyGen)}/wk · ${r.s.slipIn}% slip-in`}
            projected={r.plan.projected}
            attainment={r.plan.attainment}
            gap={r.plan.gap}
            onClick={r.id === "custom" ? undefined : () => setPreset(r.id as ScenarioId)}
          />
        ))}
      </div>
    </div>
  );
}

function Tile({
  active,
  label,
  hint,
  projected,
  attainment,
  gap,
  onClick,
}: {
  active: boolean;
  label: string;
  hint: string;
  projected: number;
  attainment: number;
  gap: number;
  onClick?: () => void;
}) {
  const shown = useTween(projected);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={!onClick}
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-lg border p-3 text-left transition-[border-color,background-color] duration-300 disabled:opacity-100",
        active ? "border-[#55585c] bg-card" : "border-line-card hover:border-[#3a3c3f]",
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[12px] leading-none font-medium text-fg">{label}</span>
        {active && <span className="size-[6px] rounded-full bg-active" />}
      </span>
      <span className="text-[24px] leading-none font-medium tracking-[-0.5px] text-fg tabular-nums">
        <span className="mr-[2px] text-[#7f7f7f]">$</span>
        {formatCompactCurrency(shown).slice(1)}
      </span>
      <SegmentedMeter value={Math.min(attainment, 100)} segments={34} variant="bar" />
      <span className="flex items-center justify-between gap-2 text-[12px] leading-none">
        <span className="text-fg-soft tabular-nums">{attainment}% of quota</span>
        <span className={cn("tabular-nums", gap > 0 ? "text-danger-dot" : "text-meter-green")}>
          {gap > 0 ? `−${formatCompactCurrency(gap)}` : `+${formatCompactCurrency(-gap)}`}
        </span>
      </span>
      <span className="truncate text-[11px] leading-none text-fg-muted">{hint}</span>
    </button>
  );
}
