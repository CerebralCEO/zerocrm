"use client";

import { useMemo } from "react";
import { CircleCheck, Mail, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import type { EnrollmentState, SequenceStatus, StepKind } from "@/lib/sequences";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/primitives/tag";

export const STEP_ICON: Record<StepKind, LucideIcon> = {
  email: Mail,
  call: Phone,
  task: CircleCheck,
  social: MessageSquare,
};

export function StepIcon({ kind, size = 24, className }: { kind: StepKind; size?: number; className?: string }) {
  const Icon = STEP_ICON[kind];
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-md border border-line-card bg-muted-surface", className)}
      style={{ width: size, height: size }}
    >
      <Icon className="text-fg-soft" style={{ width: size * 0.5, height: size * 0.5 }} strokeWidth={1.75} />
    </span>
  );
}

const STATUS: Record<SequenceStatus, { label: string; dot: string }> = {
  active: { label: "Active", dot: "bg-active" },
  paused: { label: "Paused", dot: "bg-meter-amber" },
  draft: { label: "Draft", dot: "bg-fg-muted" },
};

/** Status pill — same shape as the topbar "Active" pill ({components.status-pill}). */
export function StatusPill({ status }: { status: SequenceStatus }) {
  return (
    <span className="flex h-5 shrink-0 items-center gap-1 rounded-full border border-white/[0.08] bg-[#222] pr-[6px] pl-[5px] text-[12px] font-medium leading-none text-fg">
      <span className={cn("size-[7px] rounded-full", STATUS[status].dot)} />
      {STATUS[status].label}
    </span>
  );
}

const ENROLLMENT_TONE: Record<EnrollmentState, "blue" | "land" | "red" | "neutral"> = {
  active: "blue",
  replied: "land",
  bounced: "red",
  finished: "neutral",
};

export function EnrollmentTag({ state }: { state: EnrollmentState }) {
  return (
    <Tag tone={ENROLLMENT_TONE[state]} className="h-5 px-[7px] text-[12px] capitalize">
      {state}
    </Tag>
  );
}

/** Sequences after status / owner filters. */
export function useVisibleSequences() {
  const sequences = useSequences((s) => s.sequences);
  const status = useSequences((s) => s.statusFilter);
  const owner = useSequences((s) => s.ownerFilter);
  return useMemo(
    () => sequences.filter((q) => (status === "all" || q.status === status) && (!owner || q.ownerId === owner)),
    [sequences, status, owner],
  );
}
