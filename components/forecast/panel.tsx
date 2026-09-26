import { cn } from "@/lib/utils";

/** Page region on the bare canvas: title + subtitle header, hairline-bounded, no card. */
export function Panel({
  title,
  subtitle,
  aside,
  children,
  className,
}: {
  title: string;
  subtitle?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex min-w-0 flex-col px-4 pt-[18px] pb-4", className)}>
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-[7px]">
          <h2 className="text-[14px] font-medium leading-none text-fg">{title}</h2>
          {subtitle && <p className="text-[12px] leading-none text-fg-muted">{subtitle}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}

/** Inline chart legend item: 8px swatch + label. */
export function LegendItem({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-soft">
      {dashed ? (
        <span className="h-0 w-3 border-t border-dashed" style={{ borderColor: color }} />
      ) : (
        <span className="size-2 rounded-full" style={{ background: color }} />
      )}
      {label}
    </span>
  );
}

/** Series colours for forecast charts (see DESIGN.md → Charts). */
export const SERIES = {
  closed: "var(--color-spark)",
  commit: "var(--color-meter-amber)",
  best: "rgb(253 230 138 / 0.5)",
  pipeline: "var(--color-meter-empty)",
  quota: "var(--color-primary-border)",
} as const;
