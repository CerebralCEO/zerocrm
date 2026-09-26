"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TODAY, useDeals } from "@/lib/deals-store";
import { fiscalQuarter } from "@/lib/forecast";
import { quarterAfter, type Slip } from "@/lib/slips";
import { useSlips } from "@/lib/slips-store";
import { useCrm } from "@/lib/store";
import { cn, formatNumber, formatShortDate } from "@/lib/utils";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { Tag } from "@/components/primitives/tag";
import { LegendItem, Panel } from "@/components/forecast/panel";

const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RED = "var(--color-meter-red)";
const AMBER = "var(--color-meter-amber)";

/** Quarter-aligned time span covering every original and current date, plus today. */
function spanOf(slips: Slip[]) {
  const dates = [TODAY, ...slips.flatMap((s) => [s.original, s.deal.closeDate])];
  const min = dates.reduce((a, b) => (a < b ? a : b));
  const max = dates.reduce((a, b) => (a > b ? a : b));
  const start = fiscalQuarter(min).start;
  const end = quarterAfter(max);
  const quarters: { start: string; label: string; short: string }[] = [];
  for (let q = start; q < end; q = quarterAfter(q))
    quarters.push({
      start: q,
      label: fiscalQuarter(q).label,
      short: fiscalQuarter(q).short,
    });
  const months: string[] = [];
  for (let m = start; m < end;) {
    months.push(m);
    const [y, mo] = m.split("-").map(Number);
    m = `${mo === 12 ? y + 1 : y}-${String((mo % 12) + 1).padStart(2, "0")}-01`;
  }
  const pct = (iso: string) => ((t(iso) - t(start)) / (t(end) - t(start))) * 100;
  return { pct, quarters, months, end };
}

/**
 * Hero of the Slipping Deals report: every slipped deal as a trail from the
 * date it was first committed (hollow ring) through each push (small dots)
 * to where it sits now (solid dot). Amber = slipped inside its quarter,
 * coral = left the quarter, was pushed repeatedly, or is overdue (dashed to
 * today with a live pulse).
 */
export function SlipTrail({ slips }: { slips: Slip[] }) {
  const { pct, quarters, months } = spanOf(slips);
  const openDeal = useDeals((s) => s.openDeal);
  const companies = useCrm((s) => s.companies);
  const recent = useSlips((s) => s.recent);
  const [hover, setHover] = useState<string | null>(null);
  const today = pct(TODAY);

  return (
    <Panel
      title="Slip trail"
      subtitle="From the first committed close date to where each deal sits today"
      aside={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-soft">
            <span className="size-[9px] rounded-full border-[1.5px] border-fg-soft bg-app" />
            First commit
          </span>
          <LegendItem color={AMBER} label="Within quarter" />
          <LegendItem color={RED} label="Left quarter · repeat · overdue" />
        </div>
      }
    >
      <div className="relative mt-5">
        {/* Axis: quarters over months (desktop layout: 260px label column + track + 132px values) */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)_132px] md:gap-4">
          <div className="hidden md:block" />
          <div className="relative h-[42px]">
            {quarters.map((q) => (
              <span
                key={q.start}
                className="absolute top-0 flex h-[18px] items-center border-l border-line-strong pl-2 text-[11px] leading-none font-medium tracking-[1.2px] text-fg-soft uppercase"
                style={{ left: `${pct(q.start)}%` }}
              >
                <span className="sm:hidden">{q.short}</span>
                <span className="max-sm:hidden">{q.label}</span>
              </span>
            ))}
            {months.map((m) => (
              <span
                key={m}
                className="absolute top-[26px] pl-2 text-[11px] leading-none text-fg-muted max-sm:[&:nth-child(even)]:hidden"
                style={{ left: `${pct(m)}%` }}
              >
                {MONTHS[Number(m.slice(5, 7)) - 1]}
              </span>
            ))}
            <span
              className="absolute top-[-2px] z-[2] -translate-x-1/2 rounded-full border border-line-strong bg-app px-[6px] py-[3px] text-[11px] leading-none font-medium text-fg"
              style={{ left: `${today}%` }}
            >
              Today
            </span>
          </div>
          <div className="hidden md:block" />
        </div>

        <div className="relative">
          {/* Vertical guides through every row: quarter boundaries + today */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)_132px] md:gap-4">
            <div className="hidden md:block" />
            <div className="relative">
              {quarters.map((q) => (
                <span key={q.start} className="absolute inset-y-0 w-px bg-line" style={{ left: `${pct(q.start)}%` }} />
              ))}
              <span className="absolute inset-y-0 w-px bg-line-strong" style={{ left: `${today}%` }} />
            </div>
          </div>

          {slips.map((s, i) => {
            const company = companies.find((c) => c.id === s.deal.companyId);
            const color = s.severity === "high" ? RED : AMBER;
            const from = pct(s.original);
            const to = pct(s.deal.closeDate);
            const lo = Math.min(from, to);
            return (
              <button
                key={s.deal.id}
                type="button"
                onClick={() => openDeal(s.deal.id)}
                onPointerEnter={() => setHover(s.deal.id)}
                onPointerLeave={() => setHover(null)}
                className={cn(
                  "no-press group relative -mx-2 grid w-[calc(100%+16px)] grid-cols-1 gap-y-3 rounded-md border-b border-line px-2 py-3 text-left transition-colors last:border-b-0 hover:bg-row-hover md:min-h-[52px] md:grid-cols-[260px_minmax(0,1fr)_132px] md:items-center md:gap-4 md:py-0",
                  recent.includes(s.deal.id) && "animate-row-in",
                )}
              >
                {/* Label */}
                <span className="flex min-w-0 items-center gap-[10px]">
                  <CompanyLogo id={s.deal.companyId} src={company?.logo} size={24} glyph={12} radius={6} />
                  <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                    <span className="truncate text-[14px] leading-none font-medium text-fg">{company?.name}</span>
                    <span className="truncate text-[12px] leading-none text-fg-soft/80">{s.deal.title}</span>
                  </span>
                  {/* Phone: value + slip on the right of the label */}
                  <span className="flex shrink-0 flex-col items-end gap-[6px] md:hidden">
                    <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
                      <span className="mr-[3px] text-[#7f7f7f]">$</span>
                      {formatNumber(s.deal.value)}
                    </span>
                    <SlipBadge s={s} />
                  </span>
                </span>

                {/* Track */}
                <span className="relative block h-[22px]">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/[0.04]" />
                  {/* Travel: first commit → current close */}
                  <span
                    className="absolute top-1/2 h-[2px] origin-left -translate-y-1/2 animate-grow-x rounded-full transition-[left,width] duration-700 ease-(--ease-ios)"
                    style={{
                      left: `${lo}%`,
                      width: `${Math.abs(to - from)}%`,
                      background: color,
                      animationDelay: `${i * 45}ms`,
                    }}
                  />
                  {/* Overdue: dashed from the missed date to today */}
                  {s.overdue && (
                    <>
                      <span
                        className="absolute top-1/2 h-0 origin-left -translate-y-1/2 animate-grow-x border-t-2 border-dashed"
                        style={{
                          left: `${to}%`,
                          width: `${today - to}%`,
                          borderColor: RED,
                          animationDelay: `${300 + i * 45}ms`,
                        }}
                      />
                      <span className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${today}%` }}>
                        <span className="absolute inset-0 animate-live-pulse rounded-full" style={{ background: RED }} />
                        <span className="absolute inset-0 rounded-full" style={{ background: RED }} />
                      </span>
                    </>
                  )}
                  {/* First commit */}
                  <span
                    className="absolute top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-fg-soft bg-app"
                    style={{ left: `${from}%` }}
                  />
                  {/* Intermediate pushes */}
                  {s.pushes.slice(1).map((p) => (
                    <span
                      key={p.from}
                      className="absolute top-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 animate-bubble-in rounded-full border-[1.5px] bg-app"
                      style={{
                        left: `${pct(p.from)}%`,
                        borderColor: color,
                        animationDelay: `${250 + i * 45}ms`,
                      }}
                    />
                  ))}
                  {/* Current close */}
                  <span
                    className="absolute top-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2 animate-bubble-in rounded-full border-2 border-app transition-[left] duration-700 ease-(--ease-ios)"
                    style={{
                      left: `${to}%`,
                      background: color,
                      animationDelay: `${420 + i * 45}ms`,
                    }}
                  />
                  {hover === s.deal.id && <TrailTip s={s} left={to} />}
                </span>

                {/* Values (desktop) */}
                <span className="hidden flex-col items-end gap-[6px] md:flex">
                  <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
                    <span className="mr-[3px] text-[#7f7f7f]">$</span>
                    {formatNumber(s.deal.value)}
                  </span>
                  <SlipBadge s={s} />
                </span>
              </button>
            );
          })}
          {!slips.length && <p className="py-16 text-center text-[13px] text-fg-muted">No slipped deals in this view.</p>}
        </div>
      </div>
    </Panel>
  );
}

function SlipBadge({ s }: { s: Slip }) {
  return (
    <span className="flex items-center gap-[6px] text-[12px] leading-none">
      {s.overdue ? (
        <span className="text-danger-dot">Overdue</span>
      ) : s.pushes.length > 1 ? (
        <span className="text-danger-dot tabular-nums">{s.pushes.length}× pushed</span>
      ) : s.crossed ? (
        <span className="text-danger-dot">Left {s.fromQuarter.short}</span>
      ) : (
        <span className="text-fg-muted">1× pushed</span>
      )}
      <span className="font-medium text-fg-soft tabular-nums">+{s.days}d</span>
    </span>
  );
}

/** Push history card beside the current dot. */
function TrailTip({ s, left }: { s: Slip; left: number }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-[calc(100%+8px)] z-20 hidden w-[260px] animate-pop-in rounded-[10px] border border-line-strong bg-panel px-3 py-[10px] text-left shadow-[0_12px_32px_rgba(0,0,0,0.5)] md:block",
        left > 60 ? "-translate-x-full" : "",
      )}
      style={{ left: `${left}%` }}
    >
      <span className="block text-[12px] leading-none font-medium text-fg">
        Committed {formatShortDate(s.original)} · {s.fromQuarter.label}
      </span>
      <span className="mt-[10px] flex flex-col gap-[8px]">
        {s.pushes.map((p) => (
          <span key={p.from + p.to} className="flex items-center justify-between gap-3 text-[12px] leading-none">
            <span className="flex items-center gap-[5px] text-fg-soft tabular-nums">
              {formatShortDate(p.from)}
              <ArrowRight className="size-[11px] text-fg-muted" strokeWidth={2} />
              <span className="text-fg">{formatShortDate(p.to)}</span>
            </span>
            <Tag tone="neutral" className="h-5 px-[6px] text-[11px]">
              {p.reason}
            </Tag>
          </span>
        ))}
        {s.overdue && (
          <span className="flex items-center justify-between gap-3 text-[12px] leading-none">
            <span className="text-danger-dot tabular-nums">Missed {formatShortDate(s.deal.closeDate)}</span>
            <span className="text-fg-muted">no new date</span>
          </span>
        )}
      </span>
    </span>
  );
}
