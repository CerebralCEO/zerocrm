"use client";

import { ChevronRight } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import { sequenceStats } from "@/lib/sequences";
import { ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { StatusPill, useVisibleSequences } from "./shared";

/** Master list of sequences ({components.sequence-row}). */
export function SequenceList() {
  const rows = useVisibleSequences();
  const selectedId = useSequences((s) => s.selectedId);
  const select = useSequences((s) => s.select);

  return (
    <section className="flex flex-col">
      <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-line px-4">
        <h2 className="text-[14px] font-medium leading-none text-fg">Sequences</h2>
        <span className="text-[12px] leading-none text-fg-muted tabular-nums">{rows.length}</span>
      </header>
      <ul className="flex flex-col">
        {rows.map((q) => {
          const s = sequenceStats(q);
          const active = q.id === selectedId;
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => select(q.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "no-press relative flex w-full items-center gap-3 border-b border-line px-4 py-[14px] text-left transition-colors",
                  active ? "lg:bg-row-selected" : "hover:bg-row-hover active:bg-row-hover",
                )}
              >
                {/* Selected indicator (desktop master/detail) */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-2 left-0 w-[2px] rounded-full bg-fg transition-opacity duration-300 max-lg:hidden",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[9px]">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] leading-none font-medium text-fg">{q.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] leading-none text-fg-muted">
                    <StatusPill status={q.status} />
                    <span className="truncate">
                      {q.steps.length} steps · {s.enrolled} enrolled
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-[8px]">
                  <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
                    {s.replyRate}
                    <span className="text-[#7f7f7f]">%</span>
                    <span className="ml-1 text-[12px] font-normal text-fg-muted">reply</span>
                  </span>
                  <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-muted tabular-nums">
                    {s.openRate}% open
                    <Avatar name={ownerById(q.ownerId).name} size={16} />
                  </span>
                </div>
                <ChevronRight className="size-[14px] shrink-0 text-fg-muted lg:hidden" strokeWidth={1.75} />
              </button>
            </li>
          );
        })}
        {rows.length === 0 && <li className="py-12 text-center text-[13px] text-fg-muted">No sequences match.</li>}
      </ul>
    </section>
  );
}
