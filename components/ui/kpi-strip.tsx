import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";

/** One metric cell of {components.kpi-strip}. */
export function KpiCell({
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

/**
 * Hairline-separated KPI cells under the toolbar ({components.kpi-strip}).
 * Phone: one swipeable row · tablet: 2×2 · desktop: 4 across.
 */
export function KpiStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex shrink-0 snap-x snap-mandatory overflow-x-auto overscroll-x-contain border-b border-line sm:grid sm:grid-cols-2 lg:grid-cols-4 [&>*]:border-line max-sm:[&>*:not(:last-child)]:border-r sm:max-lg:[&>*:nth-child(-n+2)]:border-b sm:max-lg:[&>*:nth-child(odd)]:border-r lg:[&>*:not(:last-child)]:border-r">
      {children}
    </div>
  );
}
