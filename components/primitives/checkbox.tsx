"use client";

import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  indeterminate,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  const on = checked || indeterminate;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "flex size-[14px] shrink-0 items-center justify-center rounded-[3px] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-check/40",
        on ? "border-check bg-check text-[#1a1a1a]" : "border-[#323232] bg-transparent hover:border-[#4a4a4a]",
        className,
      )}
    >
      {indeterminate ? (
        <Minus className="size-[10px] animate-check-pop" strokeWidth={4} />
      ) : checked ? (
        <Check className="size-[10px] animate-check-pop" strokeWidth={4} />
      ) : null}
    </button>
  );
}
