"use client";

import { useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useActivities } from "@/lib/activities-store";
import { useCrm } from "@/lib/store";
import { TODAY } from "@/lib/deals-store";
import { dateOf, formatTime, shortDate, type Activity } from "@/lib/activities";
import { ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/primitives/checkbox";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Panel } from "@/components/forecast/panel";
import { ActivityIcon } from "./shared";

const COMMIT = 88; // px of swipe that completes the item
const MAX = 132;

/**
 * Agenda row with iOS-style swipe-left-to-complete on touch (mouse users use
 * the checkbox). The row tracks the finger 1:1, reveals the action behind it,
 * rubber-bands past the max and springs back on release.
 */
function AgendaRow({ a }: { a: Activity }) {
  const toggleDone = useActivities((s) => s.toggleDone);
  const company = useCrm((s) => s.companies.find((c) => c.id === a.companyId));
  const openCompany = useCrm((s) => s.openDetail);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const g = useRef<{ id: number; x: number; y: number; mode: "pending" | "swipe" | "scroll" } | null>(null);
  const overdue = !a.done && dateOf(a.at) < TODAY;
  const owner = ownerById(a.ownerId);

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return;
    g.current = { id: e.pointerId, x: e.clientX, y: e.clientY, mode: "pending" };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = g.current;
    if (!s || s.id !== e.pointerId || s.mode === "scroll") return;
    const x = e.clientX - s.x;
    const y = e.clientY - s.y;
    if (s.mode === "pending") {
      if (Math.abs(x) < 8 && Math.abs(y) < 8) return;
      if (Math.abs(y) > Math.abs(x) || x > 0) {
        s.mode = "scroll";
        return;
      }
      s.mode = "swipe";
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const d = Math.min(0, x);
    setDx(d < -MAX ? -MAX + (d + MAX) * 0.25 : d);
  };
  const onUp = () => {
    const s = g.current;
    g.current = null;
    if (!s || s.mode !== "swipe") return;
    setDragging(false);
    if (dx <= -COMMIT) {
      navigator.vibrate?.(8);
      toggleDone(a.id);
    }
    setDx(0);
  };

  const armed = dx <= -COMMIT;

  return (
    <li className="relative overflow-hidden border-b border-line last:border-b-0">
      {/* Action revealed behind the row */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 flex items-center justify-end gap-[6px] pr-4 text-[12px] font-medium transition-colors duration-200",
          armed ? "bg-meter-green/25 text-meter-green" : "bg-meter-green/10 text-meter-green/70",
        )}
      >
        {a.done ? <RotateCcw className="size-[14px]" strokeWidth={2} /> : <Check className="size-[14px]" strokeWidth={2.25} />}
        {a.done ? "Undo" : "Done"}
      </div>

      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className={cn(
          "relative flex min-h-[52px] touch-pan-y items-center gap-3 bg-app py-2 select-none",
          !dragging && "transition-transform duration-[420ms] ease-(--ease-ios)",
        )}
        style={{ transform: `translate3d(${dx}px,0,0)` }}
      >
        <Checkbox checked={a.done} onChange={() => toggleDone(a.id)} label={`Mark "${a.title}" as done`} />
        <span
          className={cn(
            "w-[58px] shrink-0 text-[12px] leading-none tabular-nums",
            overdue ? "text-danger-dot" : "text-fg-muted",
          )}
        >
          {overdue ? shortDate(dateOf(a.at)) : formatTime(a.at)}
        </span>
        <ActivityIcon kind={a.kind} size={24} className="rounded-md" />
        <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <span
            className={cn(
              "truncate text-[14px] leading-none font-medium transition-colors duration-300",
              a.done ? "text-fg-muted line-through decoration-fg-muted/60" : "text-fg",
            )}
          >
            {a.title}
          </span>
          <button
            type="button"
            onClick={() => openCompany(a.companyId)}
            className="no-press self-start truncate text-left text-[12px] leading-none text-fg-muted hover:text-fg-soft"
          >
            {company?.name}
            {overdue && <span className="text-danger-dot"> · Overdue</span>}
          </button>
        </span>
        <Avatar name={owner.name} size={20} className="max-sm:hidden" />
      </div>
    </li>
  );
}

/** Today's agenda (plus anything overdue), with completion progress. */
export function Agenda() {
  const activities = useActivities((s) => s.activities);
  const items = activities
    .filter((a) => a.scheduled && (dateOf(a.at) === TODAY || (!a.done && dateOf(a.at) < TODAY)))
    .sort((a, b) => a.at.localeCompare(b.at));
  const done = items.filter((a) => a.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <Panel
      title="Today's agenda"
      subtitle={
        <>
          <span className="text-fg-soft tabular-nums">
            {done} of {items.length}
          </span>{" "}
          done
          <span className="sm:hidden"> · swipe left to complete</span>
        </>
      }
      aside={
        <span className="flex items-center gap-[10px]">
          <SegmentedMeter value={pct} />
          <span className="w-[34px] text-right text-[14px] leading-none font-[450] text-fg tabular-nums">{pct}%</span>
        </span>
      }
    >
      <ul className="mt-3 flex flex-col">
        {items.map((a) => (
          <AgendaRow key={a.id} a={a} />
        ))}
        {items.length === 0 && <li className="py-10 text-center text-[13px] text-fg-muted">Nothing scheduled today.</li>}
      </ul>
    </Panel>
  );
}
