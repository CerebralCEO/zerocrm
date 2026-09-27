"use client";

import { useMemo } from "react";
import { CircleCheck, FileText, Mail, Phone, Video, Zap, type LucideIcon } from "lucide-react";
import { useActivities } from "@/lib/activities-store";
import { TODAY } from "@/lib/deals-store";
import { daysBetween, dateOf, type ActivityKind } from "@/lib/activities";
import { cn } from "@/lib/utils";

export const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  call: Phone,
  email: Mail,
  meeting: Video,
  note: FileText,
  task: CircleCheck,
};

/** Neutral icon tile for an activity kind ({components.activity-icon}). */
export function ActivityIcon({ kind, size = 32, className, system }: { kind: ActivityKind; size?: number; className?: string; system?: boolean }) {
  const Icon = system ? Zap : KIND_ICON[kind];
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-lg border border-line-card bg-muted-surface", className)}
      style={{ width: size, height: size }}
    >
      <Icon className="text-fg-soft" style={{ width: size * 0.42, height: size * 0.42 }} strokeWidth={1.75} />
    </span>
  );
}

/** Logged (done) activities inside the selected range and filters, newest first — plus system events when no type filter is set. */
export function useFeed() {
  const logged = useActivities((s) => s.activities);
  const events = useActivities((s) => s.events);
  const kind = useActivities((s) => s.kindFilter);
  const owner = useActivities((s) => s.ownerFilter);
  const range = useActivities((s) => s.range);
  return useMemo(
    () =>
      (kind ? logged : [...logged, ...events])
        .filter((a) => a.done && a.at.slice(0, 10) <= TODAY)
        .filter((a) => daysBetween(dateOf(a.at), TODAY) < range)
        .filter((a) => (!kind || a.kind === kind) && (!owner || a.ownerId === owner))
        .sort((a, b) => b.at.localeCompare(a.at)),
    [logged, events, kind, owner, range],
  );
}

/** Done activities matching type/owner filters over any window (for heatmap + KPIs). */
export function useFilteredDone() {
  const activities = useActivities((s) => s.activities);
  const kind = useActivities((s) => s.kindFilter);
  const owner = useActivities((s) => s.ownerFilter);
  return useMemo(
    () => activities.filter((a) => a.done && (!kind || a.kind === kind) && (!owner || a.ownerId === owner)),
    [activities, kind, owner],
  );
}
