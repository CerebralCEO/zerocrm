"use client";

import { cn } from "@/lib/utils";

/**
 * iOS-style switch ({components.switch}): 40×24 track, 20px thumb that springs
 * across; on = {colors.live}.
 */
export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "no-press relative inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        checked ? "border-transparent bg-active" : "border-white/[0.09] bg-[#2a2a2a]",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-[1px] left-[1px] size-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-transform duration-[420ms] ease-(--ease-pop) active:scale-x-110",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
