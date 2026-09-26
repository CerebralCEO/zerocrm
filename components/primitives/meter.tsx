import { cn } from "@/lib/utils";

const RED = "var(--color-meter-red)";
const AMBER = "var(--color-meter-amber)";
const GREEN = "var(--color-meter-green)";

/**
 * Colours for `filled` segments, split red → amber → green in thirds.
 * Matches the reference exactly: red = ⌊n/3⌋, amber = ⌈rest/2⌉, green = ⌊rest/2⌋.
 */
export function gradientColors(filled: number) {
  const red = Math.floor(filled / 3);
  const rest = filled - red;
  const amber = Math.ceil(rest / 2);
  return Array.from({ length: filled }, (_, i) => (i < red ? RED : i < red + amber ? AMBER : GREEN));
}

type MeterProps = {
  value: number; // 0–100
  segments?: number;
  /** Single colour for every filled segment instead of the red→green ramp. */
  color?: "red" | "amber" | "green";
  variant?: "compact" | "bar";
  className?: string;
};

/** Segmented win-probability meter. */
export function SegmentedMeter({
  value,
  segments = 17,
  color,
  variant = "compact",
  className,
}: MeterProps) {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);
  const colors = color
    ? Array(filled).fill(color === "red" ? RED : color === "amber" ? AMBER : GREEN)
    : gradientColors(filled);

  return (
    <div
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "flex shrink-0",
        variant === "compact"
          ? "h-[14px] w-[74px] gap-[2px] rounded-[2px] bg-white/[0.075] p-[2px]"
          : "h-3 w-full gap-[2px] rounded-[2px] border border-[#303030] bg-meter-track p-px",
        className,
      )}
    >
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className="min-w-0 flex-1 transition-[background-color] duration-200"
          style={{ background: colors[i] ?? (variant === "compact" ? "#3a3a3a" : "#393939") }}
        />
      ))}
    </div>
  );
}
