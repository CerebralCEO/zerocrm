"use client";

import { useMemo, useState } from "react";
import type { Q1Plan } from "@/lib/q1";
import { Q1_FY28 } from "@/lib/forecast";
import { STAGES, stageById } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { useDeals } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { formatCompactCurrency, formatNumber, formatShortDate } from "@/lib/utils";
import { TONES } from "@/components/primitives/tag";
import { useWidth } from "@/components/primitives/use-width";
import { LegendItem, Panel } from "@/components/forecast/panel";

const PAD = { top: 16, right: 20, bottom: 30, left: 44 };
const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/**
 * Every Q1 deal as a bubble: close date across, win probability up, size by
 * value, colour by stage. The top-right is where the quarter gets made.
 */
export function DealMap({ p }: { p: Q1Plan }) {
  const { ref, width } = useWidth();
  const openDeal = useDeals((s) => s.openDeal);
  const companies = useCrm((s) => s.companies);
  const [hover, setHover] = useState<string | null>(null);
  const height = width && width < 640 ? 260 : 320;
  const phone = width > 0 && width < 640;

  const geo = useMemo(() => {
    if (!width) return null;
    const x0 = t(Q1_FY28.start);
    const span = t(Q1_FY28.end) + DAY - x0;
    const innerW = width - PAD.left - PAD.right;
    const innerH = height - PAD.top - PAD.bottom;
    const x = (iso: string) => PAD.left + ((t(iso) + DAY / 2 - x0) / span) * innerW;
    const y = (prob: number) => PAD.top + innerH - (prob / 100) * innerH;
    const maxV = Math.max(...p.deals.map((d) => d.value), 1);
    const maxR = phone ? 18 : 28;
    const r = (v: number) => Math.max(5, Math.sqrt(v / maxV) * maxR);
    // Big bubbles first so small ones stay on top and clickable.
    const bubbles = [...p.deals]
      .sort((a, b) => b.value - a.value)
      .map((d) => ({
        d,
        cx: x(d.closeDate),
        cy: y(d.probability),
        r: r(d.value),
      }));
    const months = ["2027-02-01", "2027-03-01", "2027-04-01"].map((m) => ({
      x: x(m) - (DAY / 2 / span) * innerW,
      label: formatShortDate(m).split(" ")[0],
    }));
    return { innerW, innerH, y, bubbles, months };
  }, [width, height, p.deals, phone]);

  const hovered = geo?.bubbles.find((b) => b.d.id === hover);

  return (
    <Panel
      title="Q1 deal map"
      subtitle="Close date × win probability · bubble size is deal value"
      aside={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {STAGES.filter((s) => s.id !== "won").map((s) => (
            <LegendItem key={s.id} color={TONES[s.tone].text} label={s.label} />
          ))}
        </div>
      }
    >
      <div ref={ref} className="relative mt-4 w-full select-none" style={{ height }}>
        {geo && (
          <svg width={width} height={height} className="block overflow-visible" role="img" aria-label="Q1 deals by close date and win probability">
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line x1={PAD.left} x2={width - PAD.right} y1={geo.y(v)} y2={geo.y(v)} className="stroke-line" strokeWidth={1} />
                <text x={PAD.left - 10} y={geo.y(v)} dy="0.32em" textAnchor="end" className="fill-fg-muted text-[12px] tabular-nums">
                  {v}%
                </text>
              </g>
            ))}
            {geo.months.map((m, i) => (
              <g key={m.label}>
                {i > 0 && (
                  <line x1={m.x} x2={m.x} y1={PAD.top} y2={height - PAD.bottom} className="stroke-line" strokeWidth={1} strokeDasharray="2 4" />
                )}
                <text x={m.x + 6} y={height - 8} className="fill-fg-muted text-[12px]">
                  {m.label}
                </text>
              </g>
            ))}
            {/* The quarter gets made up here */}
            <text
              x={width - PAD.right}
              y={geo.y(100) + 14}
              textAnchor="end"
              className="fill-fg-faint text-[11px] font-medium tracking-[1.2px] uppercase"
            >
              Likely to land
            </text>

            {geo.bubbles.map(({ d, cx, cy, r }, i) => {
              const tone = TONES[stageById(d.stage).tone];
              const dim = hover && hover !== d.id;
              const company = companies.find((c) => c.id === d.companyId);
              return (
                <g
                  key={d.id}
                  className="cursor-pointer transition-opacity duration-200"
                  style={{ opacity: dim ? 0.35 : 1 }}
                  onPointerEnter={() => setHover(d.id)}
                  onPointerLeave={() => setHover(null)}
                  onClick={() => openDeal(d.id)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={tone.text}
                    fillOpacity={hover === d.id ? 0.32 : 0.18}
                    stroke={tone.text}
                    strokeOpacity={0.75}
                    strokeWidth={hover === d.id ? 2 : 1}
                    className="animate-bubble-in transition-[fill-opacity,stroke-width] duration-200"
                    style={{
                      animationDelay: `${160 + i * 45}ms`,
                      transformBox: "fill-box",
                      transformOrigin: "center",
                    }}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={2}
                    fill={tone.text}
                    className="animate-bubble-in"
                    style={{
                      animationDelay: `${160 + i * 45}ms`,
                      transformBox: "fill-box",
                      transformOrigin: "center",
                    }}
                  />
                  {!phone && d.value >= 250_000 && company && (
                    <text
                      x={cx + r + 6 + company.name.length * 7 > width - 4 ? cx - r - 6 : cx + r + 6}
                      y={cy}
                      dy="0.32em"
                      textAnchor={cx + r + 6 + company.name.length * 7 > width - 4 ? "end" : "start"}
                      className="pointer-events-none fill-fg-soft text-[12px] animate-fade-in"
                      style={{ animationDelay: `${600 + i * 45}ms` }}
                    >
                      {company.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {hovered && geo && (
          <div
            className="pointer-events-none absolute z-10 w-[208px] rounded-[10px] border border-line-strong bg-panel px-3 py-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.5)] animate-pop-in"
            style={{
              left: Math.min(Math.max(hovered.cx - 104, 0), width - 208),
              top: hovered.cy - hovered.r - 12 > 120 ? hovered.cy - hovered.r - 118 : hovered.cy + hovered.r + 12,
            }}
          >
            <div className="truncate text-[12px] font-medium leading-none text-fg">
              {companies.find((c) => c.id === hovered.d.companyId)?.name} · {hovered.d.title}
            </div>
            <div className="mt-[10px] flex flex-col gap-[7px] text-[12px] leading-none">
              {(
                [
                  ["Value", `$${formatNumber(hovered.d.value)}`],
                  ["Win probability", `${hovered.d.probability}%`],
                  ["Weighted", formatCompactCurrency((hovered.d.value * hovered.d.probability) / 100)],
                  ["Close", formatShortDate(hovered.d.closeDate)],
                  ["Owner", ownerById(hovered.d.ownerId).name],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3">
                  <span className="text-fg-muted">{k}</span>
                  <span className="font-medium text-fg tabular-nums">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {geo && !p.deals.length && (
          <p className="absolute inset-0 flex items-center justify-center text-[13px] text-fg-muted">No deals closing in Q1 yet.</p>
        )}
      </div>
    </Panel>
  );
}
