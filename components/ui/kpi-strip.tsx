import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";

/** One metric cell of {components.kpi-strip}. */
export function KpiCell({
  icon: Icon,
  label,
  value,
  meta,
  aside,
  currency = true,
  suffix,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  meta: React.ReactNode;
  aside?: React.ReactNode;
  /** Prefix a muted "$" (money) or show a plain count. */
  currency?: boolean;
  /** Muted unit after the value, e.g. "%". */
  suffix?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-[9px] border-line px-4 py-3 sm:gap-[10px] sm:py-[14px]">
      <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
        <Icon className="size-[12px]" strokeWidth={1.75} />
        {label}
      </span>
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-[20px] font-medium leading-none tracking-[-0.5px] text-fg tabular-nums sm:text-[24px]">
          {currency && <span className="mr-[3px] text-[#7f7f7f]">$</span>}
          {formatNumber(value)}
          {suffix && <span className="ml-[2px] text-[#7f7f7f]">{suffix}</span>}
        </span>
        {aside}
      </div>
      <span className="truncate text-[12px] leading-none text-fg-muted">{meta}</span>
    </div>
  );
}

/**
 * Hairline-separated KPI cells under the toolbar ({components.kpi-strip}).
 * 2×2 below lg (every value visible without swiping) · 4 across on desktop.
 */
export function KpiStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid shrink-0 grid-cols-2 border-b border-line lg:grid-cols-4 [&>*]:border-line max-lg:[&>*:nth-child(-n+2)]:border-b max-lg:[&>*:nth-child(odd)]:border-r lg:[&>*:not(:last-child)]:border-r">
      {children}
    </div>
  );
}
