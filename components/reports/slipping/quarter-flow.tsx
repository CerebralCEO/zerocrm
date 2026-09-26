"use client";

import { useMemo, useState } from "react";
import type { Slip } from "@/lib/slips";
import { formatCompactCurrency } from "@/lib/utils";
import { useWidth } from "@/components/primitives/use-width";
import { LegendItem, Panel } from "@/components/forecast/panel";

const H = 272;
const NODE_W = 8;
const GAP = 14;
const LABEL_W = 108;

type Node = {
  key: string;
  label: string;
  start: string;
  value: number;
  y: number;
  h: number;
};

/**
 * Where slipped value went: committed quarter (left) → current quarter
 * (right). Ribbon width is deal value; amber stays inside its quarter, coral
 * crosses into a later one.
 */
export function QuarterFlow({ slips }: { slips: Slip[] }) {
  const { ref, width } = useWidth();
  const [hover, setHover] = useState<string | null>(null);

  const geo = useMemo(() => {
    const total = slips.reduce((n, s) => n + s.deal.value, 0);
    if (!width || !total) return null;
    const group = (side: "from" | "to") => {
      const map = new Map<string, Node>();
      for (const s of slips) {
        const q = side === "from" ? s.fromQuarter : s.toQuarter;
        const n = map.get(q.key) ?? {
          key: q.key,
          label: q.label,
          start: q.start,
          value: 0,
          y: 0,
          h: 0,
        };
        n.value += s.deal.value;
        map.set(q.key, n);
      }
      const nodes = [...map.values()].sort((a, b) => a.start.localeCompare(b.start));
      const scale = (H - GAP * (nodes.length - 1)) / total;
      let y = 0;
      for (const n of nodes) {
        n.h = Math.max(n.value * scale, 2);
        n.y = y;
        y += n.h + GAP;
      }
      return { nodes, scale };
    };
    const left = group("from");
    const right = group("to");
    const x0 = LABEL_W;
    const x1 = width - LABEL_W;

    // Ribbons, stacked in the same order on both sides so they don't tangle.
    const lOff = new Map(left.nodes.map((n) => [n.key, n.y]));
    const rOff = new Map(right.nodes.map((n) => [n.key, n.y]));
    const flows = new Map<string, { from: string; to: string; value: number; crossed: boolean }>();
    for (const s of slips) {
      const k = `${s.fromQuarter.key}>${s.toQuarter.key}`;
      const f = flows.get(k) ?? {
        from: s.fromQuarter.key,
        to: s.toQuarter.key,
        value: 0,
        crossed: s.crossed,
      };
      f.value += s.deal.value;
      flows.set(k, f);
    }
    const ribbons = [...flows.entries()]
      .sort(([, a], [, b]) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
      .map(([key, f]) => {
        const h = f.value * left.scale;
        const ly = lOff.get(f.from)!;
        const ry = rOff.get(f.to)!;
        lOff.set(f.from, ly + h);
        rOff.set(f.to, ry + f.value * right.scale);
        const rh = f.value * right.scale;
        const a = x0 + NODE_W;
        const b = x1;
        const m = (a + b) / 2;
        const d = `M${a},${ly}C${m},${ly} ${m},${ry} ${b},${ry}L${b},${ry + rh}C${m},${ry + rh} ${m},${ly + h} ${a},${ly + h}Z`;
        return { key, d, ...f };
      });
    return { left: left.nodes, right: right.nodes, ribbons, x0, x1 };
  }, [slips, width]);

  return (
    <Panel
      title="Quarter flow"
      subtitle="Committed quarter → where the value sits now"
      aside={
        <div className="flex items-center gap-4">
          <LegendItem color="var(--color-meter-amber)" label="Stayed" />
          <LegendItem color="var(--color-meter-red)" label="Moved out" />
        </div>
      }
    >
      <div ref={ref} className="relative mt-5 w-full select-none" style={{ height: H }}>
        {geo && (
          <svg width={width} height={H} className="block overflow-visible" role="img" aria-label="Slipped value by committed and current quarter">
            <g className="animate-reveal" style={{ transformOrigin: `${geo.x0}px 0px` }}>
              {geo.ribbons.map((r) => (
                <path
                  key={r.key}
                  d={r.d}
                  fill={r.crossed ? "var(--color-meter-red)" : "var(--color-meter-amber)"}
                  fillOpacity={hover === r.key ? 0.55 : hover ? 0.14 : 0.34}
                  className="cursor-default transition-[fill-opacity] duration-200"
                  onPointerEnter={() => setHover(r.key)}
                  onPointerLeave={() => setHover(null)}
                />
              ))}
            </g>
            {[
              ...geo.left.map((n) => ({ n, x: geo.x0, side: "left" as const })),
              ...geo.right.map((n) => ({
                n,
                x: geo.x1,
                side: "right" as const,
              })),
            ].map(({ n, x, side }) => (
              <g key={side + n.key}>
                <rect x={x} y={n.y} width={NODE_W} height={n.h} rx={2} className="fill-fg-soft" />
                <text
                  x={side === "left" ? x - 10 : x + NODE_W + 10}
                  y={n.y + n.h / 2}
                  textAnchor={side === "left" ? "end" : "start"}
                  className="text-[12px]"
                >
                  <tspan x={side === "left" ? x - 10 : x + NODE_W + 10} dy="-0.35em" className="fill-fg font-medium">
                    {n.label}
                  </tspan>
                  <tspan x={side === "left" ? x - 10 : x + NODE_W + 10} dy="1.35em" className="fill-fg-muted tabular-nums">
                    {formatCompactCurrency(n.value)}
                  </tspan>
                </text>
              </g>
            ))}
          </svg>
        )}
        {hover && geo && <HoverLabel ribbon={geo.ribbons.find((r) => r.key === hover)!} left={geo.left} right={geo.right} />}
        {!slips.length && <p className="absolute inset-0 flex items-center justify-center text-[13px] text-fg-muted">Nothing slipped.</p>}
      </div>
      <div className="mt-3 flex justify-between text-[11px] leading-none font-medium tracking-[1.2px] text-fg-faint uppercase">
        <span>Committed</span>
        <span>Now</span>
      </div>
    </Panel>
  );
}

function HoverLabel({ ribbon, left, right }: { ribbon: { from: string; to: string; value: number }; left: Node[]; right: Node[] }) {
  const from = left.find((n) => n.key === ribbon.from)!;
  const to = right.find((n) => n.key === ribbon.to)!;
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pop-in rounded-[10px] border border-line-strong bg-panel px-3 py-[9px] text-center shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
      <div className="text-[12px] leading-none font-medium whitespace-nowrap text-fg">
        {from.label} → {to.label}
      </div>
      <div className="mt-[7px] text-[12px] leading-none text-fg-muted tabular-nums">{formatCompactCurrency(ribbon.value)}</div>
    </div>
  );
}
