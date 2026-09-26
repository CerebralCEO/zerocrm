"use client";

import { CircleDollarSign, Scale, Trophy, Wallet, type LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { SegmentedMeter } from "@/components/primitives/meter";
import { useVisibleDeals } from "./deals-toolbar";

function Metric({
  icon: Icon,
  label,
  value,
  meta,
  aside,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  meta: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 shrink-0 snap-start flex-col gap-[10px] border-line px-4 py-[14px] max-sm:w-[68vw]">
      <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
        <Icon className="size-[12px]" strokeWidth={1.75} />
        {label}
      </span>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-[24px] font-medium leading-none tracking-[-0.5px] text-fg tabular-nums">
          <span className="mr-[3px] text-[#7f7f7f]">$</span>
          {formatNumber(value)}
        </span>
        {aside}
      </div>
      <span className="truncate text-[12px] leading-none text-fg-muted">{meta}</span>
    </div>
  );
}

/** KPI strip above the board — hairline-separated cells, no cards. */
export function DealsSummary() {
  const deals = useVisibleDeals();
  const open = deals.filter((d) => d.stage !== "won");
  const won = deals.filter((d) => d.stage === "won");

  const pipeline = open.reduce((s, d) => s + d.value, 0);
  const weighted = Math.round(open.reduce((s, d) => s + (d.value * d.probability) / 100, 0));
  const wonValue = won.reduce((s, d) => s + d.value, 0);
  const avgProb = open.length ? Math.round(open.reduce((s, d) => s + d.probability, 0) / open.length) : 0;
  const avgSize = open.length ? Math.round(pipeline / open.length) : 0;

  return (
    // Phone: one swipeable row · tablet: 2×2 · desktop: 4 across.
    <div className="no-scrollbar flex shrink-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain border-b border-line sm:grid sm:grid-cols-2 lg:grid-cols-4 [&>*]:border-line max-sm:[&>*:not(:last-child)]:border-r sm:max-lg:[&>*:nth-child(-n+2)]:border-b sm:max-lg:[&>*:nth-child(odd)]:border-r lg:[&>*:not(:last-child)]:border-r">
      <Metric
        icon={Wallet}
        label="Open pipeline"
        value={pipeline}
        meta={
          <>
            <span className="text-fg-soft">{open.length}</span> open deals
          </>
        }
      />
      <Metric
        icon={Scale}
        label="Weighted forecast"
        value={weighted}
        aside={<SegmentedMeter value={avgProb} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{avgProb}%</span> average win probability
          </>
        }
      />
      <Metric
        icon={Trophy}
        label="Closed won"
        value={wonValue}
        meta={
          <>
            <span className="text-meter-green">{won.length}</span> deals won
          </>
        }
      />
      <Metric
        icon={CircleDollarSign}
        label="Average deal size"
        value={avgSize}
        meta="Across open deals"
      />
    </div>
  );
}
