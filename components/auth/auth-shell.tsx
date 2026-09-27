import Image from "next/image";
import { REGION_MAPS } from "@/lib/pipeline-maps";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";
import { Tag } from "@/components/primitives/tag";

/**
 * Split auth layout: the form on the canvas, and — from lg — a showcase panel
 * on the sidebar surface built only from product components (dot-matrix
 * territory, a deal card, KPI tiles). No gradients or illustrations.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-app lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
      <div className="flex min-w-0 flex-col px-5 pt-5 pb-6 sm:px-10 sm:pt-7">
        <header className="flex items-center gap-[10px]">
          <span className="flex size-[34px] items-center justify-center rounded-lg border border-white/[0.09] bg-muted-surface">
            <Image src="/logo/zerocrm-mark.png" alt="" width={22} height={22} priority className="size-[22px]" />
          </span>
          <span className="flex flex-col gap-[5px]">
            <span className="text-[14px] leading-none font-semibold text-fg">ZeroCRM</span>
            <span className="text-[12px] leading-none text-fg-muted">Company pipeline</span>
          </span>
        </header>
        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[372px] animate-pop-in">{children}</div>
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-2 text-[12px] leading-none text-fg-muted">
          <span>© 2026 ZeroCRM · Open source, MIT</span>
          <span className="flex items-center gap-[6px]">
            <span className="size-[6px] rounded-full bg-active" />
            All systems normal
          </span>
        </footer>
      </div>
      <Showcase />
    </div>
  );
}

/* ---------- showcase ---------- */

const MAP = REGION_MAPS.na;
const CELL = 10;
const COLOR = "#ffdb4b";
const SITES = [
  { lat: 37.6, lon: -122.2, w: 1 },
  { lat: 40.71, lon: -74.01, w: 0.62 },
  { lat: 47.61, lon: -122.33, w: 0.5 },
  { lat: 41.88, lon: -87.63, w: 0.42 },
  { lat: 30.27, lon: -97.74, w: 0.34 },
  { lat: 39.74, lon: -104.99, w: 0.46 },
  { lat: 28.54, lon: -81.38, w: 0.38 },
];
const LEVELS = [0.07, 0.2, 0.4, 0.65];
const OPACITY = [0.2, 0.36, 0.56, 0.85];

const dot = (cx: number, cy: number, r = 2.3) => `M${cx - r},${cy}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 ${-r * 2},0`;

function buildMap() {
  const pts = SITES.map((s) => ({ ...s, x: ((s.lon - MAP.lon0) / MAP.lonStep) * CELL, y: ((MAP.lat0 - s.lat) / MAP.latStep) * CELL }));
  let base = "";
  const heat = ["", "", "", ""];
  for (let y = 0; y < MAP.rows; y++)
    for (let x = 0; x < MAP.cols; x++) {
      if (MAP.grid[y][x] !== "1") continue;
      const cx = x * CELL + 5;
      const cy = y * CELL + 5;
      let h = 0;
      for (const p of pts) h += p.w * Math.exp(-(((cx - p.x) / CELL) ** 2 + ((cy - p.y) / CELL) ** 2) / (2 * 3.6 * 3.6));
      const l = LEVELS.findLastIndex((v) => h >= v);
      if (l >= 0) heat[l] += dot(cx, cy);
      else base += dot(cx, cy);
    }
  return { pts, base, heat };
}
const GEO = buildMap();

function Showcase() {
  return (
    <aside className="relative hidden min-w-0 flex-col overflow-hidden border-l border-line bg-sidebar lg:flex">
      <div className="relative z-[1] px-12 pt-16">
        <p className="text-[12px] leading-none font-medium tracking-[1.1px] text-fg-muted uppercase">North America · live pipeline</p>
        <h2 className="mt-4 max-w-[460px] text-[28px] leading-[32px] font-semibold tracking-[-0.6px] text-fg">
          Every deal, forecast and invoice — one source of truth.
        </h2>
        <p className="mt-3 max-w-[420px] text-[14px] leading-[20px] text-fg-soft/80">
          Move a deal and the forecast, team attainment, territory map and receivables update with it.
        </p>
      </div>

      <svg viewBox={`0 0 ${MAP.cols * CELL} ${MAP.rows * CELL}`} className="absolute inset-x-8 top-[210px] h-auto w-[calc(100%-64px)]" aria-hidden>
        <path d={GEO.base} fill="rgb(255 255 255 / 0.07)" />
        {GEO.heat.map((d, i) => (
          <path key={i} d={d} fill={COLOR} fillOpacity={OPACITY[i]} />
        ))}
        {GEO.pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={7 + p.w * 14} fill={COLOR} fillOpacity={0.16} stroke={COLOR} strokeOpacity={0.9} strokeWidth={1.5} />
            <circle cx={p.x} cy={p.y} r={3.5} fill={COLOR} />
          </g>
        ))}
      </svg>

      <div className="relative z-[1] mt-auto flex items-end gap-3 px-12 pb-12">
        <div className="w-[300px] rounded-lg border border-line-card bg-card p-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14px] leading-none font-medium text-fg">Apple</span>
            <Tag tone="orange">Negotiation</Tag>
          </div>
          <div className="mt-[9px] text-[12px] leading-none text-fg-soft/80">Retail analytics pilot</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
              <span className="mr-[4px] text-[#7f7f7f]">$</span>530,111
            </span>
            <span className="flex items-center gap-2">
              <SegmentedMeter value={82} />
              <span className="text-[14px] leading-none tabular-nums text-fg">82%</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex h-[62px] w-[168px] flex-col justify-between rounded-lg border border-line-card bg-app px-3 pt-[12px] pb-[11px]">
            <span className="text-[12px] leading-none text-fg-soft/80">Weighted forecast</span>
            <span className="flex items-end justify-between">
              <span className="text-[14px] leading-none font-medium text-fg tabular-nums">$2.41M</span>
              <Sparkline data={[4, 4, 10, 5, 2, 7, 11, 7, 11, 7, 11, 7, 7, 14]} />
            </span>
          </div>
          <div className="flex h-[62px] w-[168px] flex-col justify-between rounded-lg border border-line-card bg-app px-3 pt-[12px] pb-[11px]">
            <span className="text-[12px] leading-none text-fg-soft/80">Collected this quarter</span>
            <span className="text-[14px] leading-none font-medium text-fg tabular-nums">
              $340,800 <span className="text-[12px] font-normal text-meter-green">4 paid</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
