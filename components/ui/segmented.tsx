"use client";

import { cn } from "@/lib/utils";
import { useTabIndicator } from "./use-tab-indicator";

/**
 * iOS-style segmented control ({components.segmented-control}): a pill track
 * with a raised thumb that glides to the selected option.
 */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  iconOnly,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  label: string;
  /** Show icons only; labels stay available to screen readers. */
  iconOnly?: boolean;
  className?: string;
}) {
  const { ref, style } = useTabIndicator(value);

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      className={cn(
        "relative flex h-[34px] items-center rounded-full border border-white/[0.09] bg-[#1b1b1b] p-[3px]",
        className,
      )}
    >
      {style && (
        <span
          aria-hidden
          className="absolute top-[3px] bottom-[3px] rounded-full border border-white/[0.13] bg-nav-active shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-[left,width] duration-500 ease-(--ease-ios)"
          style={style}
        />
      )}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            data-active={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "no-press relative z-[1] flex h-full min-w-0 flex-1 items-center justify-center gap-[6px] rounded-full px-2 text-[12px] leading-none font-medium whitespace-nowrap transition-colors duration-200",
              active ? "text-fg" : "text-fg-muted hover:text-fg-soft",
              // Before the first measurement, the active option draws its own thumb.
              active && !style && "border border-white/[0.13] bg-nav-active",
            )}
          >
            {o.icon}
            <span className={iconOnly ? "sr-only" : "truncate"}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
