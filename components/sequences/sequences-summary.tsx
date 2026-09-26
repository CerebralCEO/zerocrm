"use client";

import { CalendarCheck, MailOpen, Reply, Send } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import { sequenceStats } from "@/lib/sequences";
import { SegmentedMeter } from "@/components/primitives/meter";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";

export function SequencesSummary() {
  const sequences = useSequences((s) => s.sequences);
  const active = sequences.filter((q) => q.status === "active");
  const enrolled = sequences.reduce((a, q) => a + q.enrollments.filter((e) => e.state === "active").length, 0);
  const emailSteps = sequences.flatMap((q) => q.steps.filter((x) => x.kind === "email"));
  const sent = emailSteps.reduce((a, x) => a + x.stats.sent, 0);
  const opened = emailSteps.reduce((a, x) => a + x.stats.opened, 0);
  const allSteps = sequences.flatMap((q) => q.steps);
  const touches = allSteps.reduce((a, x) => a + x.stats.sent, 0);
  const replied = allSteps.reduce((a, x) => a + x.stats.replied, 0);
  const openRate = sent ? Math.round((opened / sent) * 100) : 0;
  const replyRate = touches ? Math.round((replied / touches) * 100) : 0;
  const meetings = sequences.reduce((a, q) => a + sequenceStats(q).meetings, 0);

  return (
    <KpiStrip>
      <KpiCell
        icon={Send}
        label="Active sequences"
        value={active.length}
        currency={false}
        meta={
          <>
            <span className="text-fg-soft">{enrolled}</span> contacts in flight
          </>
        }
      />
      <KpiCell
        icon={MailOpen}
        label="Open rate"
        value={openRate}
        currency={false}
        suffix="%"
        aside={<SegmentedMeter value={openRate} className="hidden sm:flex" />}
        meta={
          <>
            <span className="text-fg-soft">{sent}</span> emails sent
          </>
        }
      />
      <KpiCell
        icon={Reply}
        label="Reply rate"
        value={replyRate}
        currency={false}
        suffix="%"
        meta={
          <>
            <span className="text-meter-green">{replied}</span> replies across all steps
          </>
        }
      />
      <KpiCell
        icon={CalendarCheck}
        label="Meetings booked"
        value={meetings}
        currency={false}
        meta="From sequence replies"
      />
    </KpiStrip>
  );
}
