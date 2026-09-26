"use client";

import { CATEGORIES, type Category, type Forecast } from "@/lib/forecast";
import type { ForecastCall } from "@/lib/forecast-store";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Panel, SERIES } from "./panel";

const pct = (v: number, of: number) => (of ? Math.round((v / of) * 100) : 0);

/**
 * Stacked category bar (closed → commit → best → pipeline) against the quota
 * marker, plus a row per category and the coverage summary.
 */
export function CategoryBreakdown({ f, call }: { f: Forecast; call?: ForecastCall }) {
  const { totals, counts, period } = f;
  const all = totals.closed + totals.commit + totals.best + totals.pipeline;
  const scale = Math.max(period.quota, all, call?.bestCase ?? 0) * 1.08 || 1;
  const commitTotal = totals.closed + totals.commit;
  const gap = Math.max(period.quota - totals.closed, 0);
  const coverage = gap ? (totals.commit + totals.best + totals.pipeline) / gap : Infinity;

  return (
    <Panel title="Forecast categories" subtitle="Where this period's number comes from">
      {/* Stacked bar with quota (and your call) markers */}
      <div className="relative mt-[34px] mb-2">
        <div className="flex h-[10px] origin-left animate-reveal gap-[2px] overflow-hidden rounded-[2px] bg-meter-track-bar">
          {CATEGORIES.map(({ id }) =>
            totals[id] > 0 ? (
              <span
                key={id}
                className="h-full transition-[width] duration-700 ease-(--ease-ios)"
                style={{ width: `${(totals[id] / scale) * 100}%`, background: SERIES[id] }}
              />
            ) : null,
          )}
        </div>
        <Marker left={(period.quota / scale) * 100} label="Quota" color={SERIES.quota} />
        {call && <Marker left={(call.commit / scale) * 100} label="Your call" color="var(--color-fg)" below />}
      </div>

      <ul className={cn("mt-5 flex flex-col", call && "mt-8")}>
        {CATEGORIES.map(({ id, label, hint }) => (
          <Row
            key={id}
            color={SERIES[id as Category]}
            label={label}
            hint={`${counts[id]} ${counts[id] === 1 ? "deal" : "deals"} · ${hint}`}
            value={totals[id]}
            share={pct(totals[id], period.quota)}
          />
        ))}
      </ul>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
          <dt className="text-[12px] leading-none text-fg-soft/80">Closed + commit</dt>
          <dd className="text-[14px] font-medium leading-none text-fg tabular-nums">
            {formatCompactCurrency(commitTotal)}{" "}
            <span className={cn("text-[12px] font-normal", commitTotal >= period.quota ? "text-meter-green" : "text-fg-muted")}>
              {pct(commitTotal, period.quota)}% of quota
            </span>
          </dd>
        </div>
        <div className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
          <dt className="text-[12px] leading-none text-fg-soft/80">Pipeline coverage</dt>
          <dd className="text-[14px] font-medium leading-none text-fg tabular-nums">
            {Number.isFinite(coverage) ? `${coverage.toFixed(1)}×` : "Covered"}{" "}
            <span className={cn("text-[12px] font-normal", coverage >= 2 ? "text-meter-green" : coverage >= 1 ? "text-meter-amber" : "text-danger-dot")}>
              {Number.isFinite(coverage) ? "of remaining gap" : "quota booked"}
            </span>
          </dd>
        </div>
      </dl>

      {call && (
        <p className="mt-3 text-[12px] leading-[16px] text-fg-muted">
          Your call: <span className="text-fg tabular-nums">${formatNumber(call.commit)}</span> commit ·{" "}
          <span className="text-fg tabular-nums">${formatNumber(call.bestCase)}</span> best case
          {call.note && <> — “{call.note}”</>}
        </p>
      )}
    </Panel>
  );
}

function Marker({ left, label, color, below }: { left: number; label: string; color: string; below?: boolean }) {
  return (
    <div
      className="pointer-events-none absolute top-[-8px] bottom-[-8px] w-px transition-[left] duration-700 ease-(--ease-ios)"
      style={{ left: `${Math.min(left, 99.5)}%`, background: color }}
    >
      <span
        className={cn(
          "absolute -translate-x-1/2 text-[11px] leading-none font-medium whitespace-nowrap",
          below ? "top-[calc(100%+6px)]" : "bottom-[calc(100%+6px)]",
        )}
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}

function Row({ color, label, hint, value, share }: { color: string; label: string; hint: string; value: number; share: number }) {
  return (
    <li className="flex h-[43px] items-center gap-3 border-b border-line last:border-b-0">
      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="shrink-0 text-[14px] font-medium leading-none text-fg">{label}</span>
        <span className="truncate text-[12px] leading-none text-fg-muted">{hint}</span>
      </span>
      <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
        <span className="mr-[4px] text-[#7f7f7f]">$</span>
        {formatNumber(value)}
      </span>
      <span className="w-10 text-right text-[12px] leading-none text-fg-muted tabular-nums">{share}%</span>
    </li>
  );
}
