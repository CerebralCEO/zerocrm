"use client";

import { useState } from "react";
import type { Deal } from "@/lib/deals";
import { SLIP_REASONS, type Slip } from "@/lib/slips";
import { useSlips } from "@/lib/slips-store";
import { ownerById } from "@/lib/data";
import { formatCompactCurrency } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag, TONES } from "@/components/primitives/tag";
import { Panel } from "@/components/forecast/panel";

/** Every push counted by its reason: pushes, days lost and the value it touched. */
export function SlipReasons({ slips }: { slips: Slip[] }) {
  const rows = SLIP_REASONS.map((r) => {
    const pushes = slips.flatMap((s) => s.pushes.filter((p) => p.reason === r.id).map((p) => ({ s, p })));
    const days = pushes.reduce((n, { p }) => n + Math.round((Date.parse(p.to) - Date.parse(p.from)) / 86_400_000), 0);
    const value = [...new Set(pushes.map(({ s }) => s))].reduce((n, s) => n + s.deal.value, 0);
    return { ...r, count: pushes.length, days, value };
  })
    .filter((r) => r.count)
    .sort((a, b) => b.days - a.days);
  const maxDays = Math.max(...rows.map((r) => r.days), 1);
  const total = rows.reduce((n, r) => n + r.days, 0);

  return (
    <Panel
      title="Why deals slip"
      subtitle={
        <>
          <span className="text-fg-soft tabular-nums">{total} days</span> of close-date pushes, by reason
        </>
      }
    >
      <ul className="mt-4 flex flex-col">
        {rows.map((r, i) => (
          <li key={r.id} className="flex h-[43px] items-center gap-3 border-b border-line last:border-b-0">
            <span className="w-[124px] shrink-0">
              <Tag tone={r.tone}>{r.id}</Tag>
            </span>
            <span className="relative h-[6px] min-w-0 flex-1 overflow-hidden rounded-[2px] bg-meter-track">
              <span
                className="absolute inset-y-0 left-0 origin-left animate-grow-x rounded-[2px] transition-[width] duration-700 ease-(--ease-ios)"
                style={{
                  width: `${(r.days / maxDays) * 100}%`,
                  background: TONES[r.tone].text,
                  animationDelay: `${i * 70}ms`,
                }}
              />
            </span>
            <span className="w-[44px] shrink-0 text-right text-[14px] leading-none font-[450] text-fg tabular-nums">{r.days}d</span>
            <span className="w-[74px] shrink-0 text-right text-[12px] leading-none text-fg-muted tabular-nums max-sm:hidden">
              {r.count} {r.count === 1 ? "push" : "pushes"}
            </span>
          </li>
        ))}
        {!rows.length && <li className="py-10 text-center text-[13px] text-fg-muted">No pushes recorded.</li>}
      </ul>
    </Panel>
  );
}

/** Slip rate per rep: slipped open value as a share of their open pipeline. Tap to filter. */
export function SlipByRep({ slips, open }: { slips: Slip[]; open: Deal[] }) {
  const ownerFilter = useSlips((s) => s.ownerFilter);
  const setOwnerFilter = useSlips((s) => s.setOwnerFilter);
  const [all, setAll] = useState(false);
  const byRep = new Map<string, { slipped: number; count: number; repeat: number }>();
  for (const s of slips) {
    const r = byRep.get(s.deal.ownerId) ?? { slipped: 0, count: 0, repeat: 0 };
    r.slipped += s.deal.value;
    r.count += 1;
    if (s.pushes.length > 1) r.repeat += 1;
    byRep.set(s.deal.ownerId, r);
  }
  const rows = [...byRep.entries()]
    .map(([id, r]) => {
      const openValue = open.filter((d) => d.ownerId === id).reduce((n, d) => n + d.value, 0);
      return {
        id,
        ...r,
        rate: openValue ? Math.round((r.slipped / openValue) * 100) : 0,
      };
    })
    .sort((a, b) => b.slipped - a.slipped);

  return (
    <Panel
      title="Slip by rep"
      subtitle="Slipped value as a share of each rep's open pipeline"
      aside={
        rows.length > 7 ? (
          <button
            type="button"
            onClick={() => setAll((v) => !v)}
            className="flex h-[30px] items-center rounded-full border border-white/[0.09] bg-[#1b1b1b] px-[10px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
          >
            {all ? "Top 7" : `All ${rows.length}`}
          </button>
        ) : undefined
      }
    >
      <div className="mt-3 flex flex-col">
        {(all ? rows : rows.slice(0, 7)).map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setOwnerFilter(ownerFilter === r.id ? null : r.id)}
            className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover"
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Avatar name={ownerById(r.id).name} size={20} />
              <span className="truncate font-medium">{ownerById(r.id).name}</span>
              {r.repeat > 0 && <span className="shrink-0 text-[12px] text-danger-dot">{r.repeat}× repeat</span>}
            </span>
            <span className="w-[64px] text-right tabular-nums max-sm:hidden">
              <span className="mr-[3px] text-[#7f7f7f]">$</span>
              {formatCompactCurrency(r.slipped).slice(1)}
            </span>
            <span className="flex items-center gap-2">
              <SegmentedMeter value={r.rate} color={r.rate >= 60 ? "red" : r.rate >= 30 ? "amber" : "green"} />
              <span className="w-[36px] text-right tabular-nums">{r.rate}%</span>
            </span>
          </button>
        ))}
        {!rows.length && <p className="py-10 text-center text-[13px] text-fg-muted">No slipped deals.</p>}
      </div>
    </Panel>
  );
}
