import type { Activity } from "./activities";
import type { Company } from "./data";
import type { Deal } from "./deals";
import { TODAY } from "./deals-store";

/**
 * Company numbers are never stored — they are computed from the deals board
 * and the activity log every time either changes, so the Companies table, the
 * company sheet, My Profile, ⌘K search and team account lists always agree
 * with Deals, Forecast and Activities.
 */
export type WindowDays = 30 | 90 | 180 | 365;

const DAY = 86_400_000;
const t = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`);
const daysAgo = (iso: string) => Math.round((t(TODAY) - t(iso)) / DAY);

const KIND_LABEL: Record<Activity["kind"], Company["lastInteraction"]["type"]> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  note: "Note",
  task: "Task",
};

/** Activity that really happened (logged, not a future agenda item, not a system event). */
export const isTouch = (a: Activity) => a.done && !a.system && a.at.slice(0, 10) <= TODAY;

export function deriveCompany(c: Company, deals: Deal[], touches: Activity[], windowDays: WindowDays): Company {
  const mine = deals.filter((d) => d.companyId === c.id);
  const open = mine.filter((d) => d.stage !== "won");
  const pipelineValue = open.reduce((n, d) => n + d.value, 0);
  const weighted = open.reduce((n, d) => n + d.value * d.probability, 0);
  const winProbability = pipelineValue ? Math.round(weighted / pipelineValue) : mine.length ? 100 : 0;

  // Where the open pipeline sits: early (discovery/qualified), evaluation (proposal), procurement (negotiation).
  const share = (stages: Deal["stage"][]) =>
    pipelineValue ? Math.round((open.filter((d) => stages.includes(d.stage)).reduce((n, d) => n + d.value, 0) / pipelineValue) * 100) : 0;

  const acts = touches.filter((a) => a.companyId === c.id);
  const inWindow = acts.filter((a) => daysAgo(a.at) < windowDays);
  const count = (k: Activity["kind"][]) => inWindow.filter((a) => k.includes(a.kind)).length;
  const emails = count(["email"]);
  const meetings = count(["meeting"]);
  const calls = count(["call", "note"]);

  // 14 weekly buckets ending today, scaled to the 14px sparkline.
  const weeks = Array.from({ length: 14 }, (_, i) => acts.filter((a) => Math.floor(daysAgo(a.at) / 7) === 13 - i).length);
  const peak = Math.max(...weeks, 1);
  const activity = weeks.map((v) => Math.round((v / peak) * 14));

  // Momentum: second half of the window against the first half.
  const half = windowDays / 2;
  const recent = inWindow.filter((a) => daysAgo(a.at) < half).length;
  const earlier = inWindow.length - recent;
  const change = earlier ? Math.round(((recent - earlier) / earlier) * 100) : recent ? 100 : 0;
  const activityNote = !inWindow.length
    ? "No touches logged in this window yet"
    : change > 5
      ? `Touches up ${change}% in the last ${half} days`
      : change < -5
        ? `Touches down ${-change}% in the last ${half} days`
        : `Steady cadence over the last ${windowDays} days`;
  const perWeek = inWindow.length / (windowDays / 7);
  const activityScore = inWindow.length ? Math.min(99, Math.round(38 + perWeek * 14)) : 0;

  // Last interaction: the latest logged touch or deal touch, else what the company was created with.
  let last = c.lastInteraction;
  for (const d of mine) if (d.lastTouch.date > last.date) last = d.lastTouch;
  const latest = acts.reduce<Activity | null>((m, a) => (!m || a.at > m.at ? a : m), null);
  if (latest && latest.at.slice(0, 10) >= last.date) last = { date: latest.at.slice(0, 10), type: KIND_LABEL[latest.kind] };

  return {
    ...c,
    openDeals: open.length,
    pipelineValue,
    winProbability,
    health: { discovery: share(["discovery", "qualified"]), evaluation: share(["proposal"]), procurement: share(["negotiation"]) },
    activity,
    activityScore,
    activityNote,
    touches: { total: inWindow.length, emails, meetings, calls },
    lastInteraction: last,
  };
}

export const WINDOW_DAYS: Record<string, WindowDays> = { "30 Days": 30, "90 Days": 90, "6 Months": 180, "12 Months": 365 };
