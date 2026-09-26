"use client";

import { CalendarCheck, Handshake, Mail, Zap } from "lucide-react";
import { useActivities } from "@/lib/activities-store";
import { TODAY } from "@/lib/deals-store";
import { daysBetween, dateOf } from "@/lib/activities";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useFilteredDone } from "./shared";

const pctChange = (now: number, before: number) => (before ? Math.round(((now - before) / before) * 100) : 0);

export function ActivitiesSummary() {
  const done = useFilteredDone();
  const activities = useActivities((s) => s.activities);

  const inWindow = (from: number, to: number) =>
    done.filter((a) => {
      const d = daysBetween(dateOf(a.at), TODAY);
      return d >= from && d < to && dateOf(a.at) <= TODAY;
    });
  const week = inWindow(0, 7);
  const lastWeek = inWindow(7, 14);
  const conversations = week.filter((a) => a.kind === "call" || a.kind === "meeting");
  const emails = week.filter((a) => a.kind === "email");
  const change = pctChange(week.length, lastWeek.length);

  const todays = activities.filter((a) => a.scheduled && dateOf(a.at) === TODAY);
  const overdue = activities.filter((a) => a.scheduled && !a.done && dateOf(a.at) < TODAY).length;
  const doneToday = todays.filter((a) => a.done).length;

  return (
    <KpiStrip>
      <KpiCell
        icon={Zap}
        label="Activities this week"
        value={week.length}
        currency={false}
        meta={
          <>
            <span className={change >= 0 ? "text-meter-green" : "text-danger-dot"}>
              {change >= 0 ? "+" : ""}
              {change}%
            </span>{" "}
            vs. last week
          </>
        }
      />
      <KpiCell
        icon={Handshake}
        label="Calls & meetings"
        value={conversations.length}
        currency={false}
        meta={
          <>
            <span className="text-fg-soft">{week.length ? Math.round((conversations.length / week.length) * 100) : 0}%</span> of activity
          </>
        }
      />
      <KpiCell
        icon={Mail}
        label="Emails sent"
        value={emails.length}
        currency={false}
        meta={
          <>
            <span className="text-fg-soft">{(emails.length / 7).toFixed(1)}</span> per day on average
          </>
        }
      />
      <KpiCell
        icon={CalendarCheck}
        label="Agenda today"
        value={todays.length}
        currency={false}
        meta={
          <>
            <span className="text-fg-soft">{doneToday} done</span>
            {overdue > 0 && (
              <>
                {" · "}
                <span className="text-danger-dot">{overdue} overdue</span>
              </>
            )}
          </>
        }
      />
    </KpiStrip>
  );
}
