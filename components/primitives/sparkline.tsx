import { cn } from "@/lib/utils";

/* Bar emphasis pattern measured from the reference (d = dim, B = bright). */
const PATTERN = "dBBdBBdBdBdBBd";

/** Tiny bar sparkline: 4px bars, 1px gaps, bottom-aligned, max 14px tall. */
export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data, 14);
  const scale = 14 / max;
  return (
    <div className={cn("flex h-[14px] items-end gap-px", className)} aria-hidden>
      {data.map((v, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-t-[1px]",
            PATTERN[i % PATTERN.length] === "B" ? "bg-spark" : "bg-spark-dim",
          )}
          style={{ height: Math.max(2, Math.round(v * scale)) }}
        />
      ))}
    </div>
  );
}
