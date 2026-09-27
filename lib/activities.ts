import { DEALS } from "./deals";
import { TODAY } from "./deals-store";

export type ActivityKind = "call" | "email" | "meeting" | "note" | "task";

export const KINDS: { id: ActivityKind; label: string; plural: string }[] = [
  { id: "call", label: "Call", plural: "Calls" },
  { id: "email", label: "Email", plural: "Emails" },
  { id: "meeting", label: "Meeting", plural: "Meetings" },
  { id: "note", label: "Note", plural: "Notes" },
  { id: "task", label: "Task", plural: "Tasks" },
];

export type Activity = {
  id: string;
  kind: ActivityKind;
  title: string;
  body?: string;
  companyId: string;
  dealId?: string;
  ownerId: string;
  /**
   * Local, timezone-free timestamp "YYYY-MM-DDTHH:mm". Kept as a string and
   * formatted by hand so server and client render identical markup.
   */
  at: string;
  done: boolean;
  /** Planned ahead (agenda item) rather than logged after the fact. */
  scheduled?: boolean;
  /** Recorded by the app (stage move, payment…) — shown in feeds, never counted as rep activity. */
  system?: boolean;
  /** Who made a system change (the signed-in user). */
  actor?: string;
};

/** "Now" for the demo data — later items today are still upcoming. */
export const NOW_TIME = "10:30";

/* ---------- time helpers (string based — no timezone drift) ---------- */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 86_400_000;

export const dateOf = (at: string) => at.slice(0, 10);
const utc = (date: string) => Date.parse(`${date}T00:00:00Z`);
export const addDays = (date: string, n: number) => new Date(utc(date) + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((utc(b) - utc(a)) / DAY);
export const weekdayOf = (date: string) => new Date(utc(date)).getUTCDay();

/** "14:05" → "2:05 PM" */
export function formatTime(at: string) {
  const [h, m] = at.slice(11, 16).split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

/** Day heading for the feed: Today · Yesterday · Wed, Sep 23 */
export function dayLabel(date: string) {
  const diff = daysBetween(date, TODAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  const [, m, d] = date.split("-").map(Number);
  return `${WEEKDAYS[weekdayOf(date)]}, ${MONTHS[m - 1]} ${d}`;
}

export function shortDate(date: string) {
  const [, m, d] = date.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

/* ---------- seed data ---------- */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const TOPICS = ["pricing", "security review", "renewal terms", "rollout plan", "success criteria", "procurement", "integration scope", "QBR prep"];

function compose(kind: ActivityKind, company: string, rnd: () => number): { title: string; body?: string } {
  const topic = TOPICS[Math.floor(rnd() * TOPICS.length)];
  switch (kind) {
    case "call":
      return { title: `Call with ${company}`, body: `${[15, 20, 30, 45][Math.floor(rnd() * 4)]} min · ${topic}` };
    case "email":
      return { title: `Emailed ${company}`, body: `Re: ${topic[0].toUpperCase() + topic.slice(1)} — next steps` };
    case "meeting":
      return { title: `Meeting with ${company}`, body: `${["Demo", "Workshop", "Exec sync", "Onsite"][Math.floor(rnd() * 4)]} · ${[30, 45, 60][Math.floor(rnd() * 3)]} min` };
    case "note":
      return {
        title: `Note on ${company}`,
        body: [
          `Champion confirmed budget; ${topic} is the last open item.`,
          `Procurement wants the ${topic} doc before signing.`,
          `Exec sponsor is supportive — needs a crisp ${topic} summary.`,
        ][Math.floor(rnd() * 3)],
      };
    default:
      return { title: `Sent ${topic} deck to ${company}` };
  }
}

const COMPANY_NAMES: Record<string, string> = {
  apple: "Apple", snowflake: "Snowflake", stripe: "Stripe", attio: "Attio", lvmh: "LVMH", slack: "Slack",
  microsoft: "Microsoft", disney: "Disney", zoom: "Zoom", intercom: "Intercom", united: "United Airlines",
  netflix: "Netflix", hubspot: "Hubspot", spotify: "Spotify", shopify: "Shopify", paypal: "Paypal",
  airbnb: "Airbnb", google: "Google",
};

/** ~12 weeks of logged activity, weekday-heavy, tied to real deals. */
function history(): Activity[] {
  const rnd = seeded(42);
  const kinds: ActivityKind[] = ["email", "email", "call", "call", "meeting", "note", "task"];
  const out: Activity[] = [];
  for (let back = 83; back >= 1; back--) {
    const date = addDays(TODAY, -back);
    const wd = weekdayOf(date);
    const weekend = wd === 0 || wd === 6;
    // Busier towards quarter-end, quiet weekends.
    const base = weekend ? rnd() * 1.2 : 2 + rnd() * 5 + (83 - back) / 30;
    const n = Math.floor(base);
    for (let i = 0; i < n; i++) {
      const deal = DEALS[Math.floor(rnd() * DEALS.length)];
      const kind = kinds[Math.floor(rnd() * kinds.length)];
      const hour = 8 + Math.floor(rnd() * 10);
      const min = Math.floor(rnd() * 12) * 5;
      out.push({
        id: `a-${back}-${i}`,
        kind,
        ...compose(kind, COMPANY_NAMES[deal.companyId], rnd),
        companyId: deal.companyId,
        dealId: deal.id,
        ownerId: deal.ownerId,
        at: `${date}T${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`,
        done: true,
      });
    }
  }
  return out;
}

/** Today's agenda plus two overdue follow-ups. */
const AGENDA: Activity[] = [
  { id: "g-1", kind: "task", title: "Send LVMH procurement pack", companyId: "lvmh", dealId: "d-lvmh", ownerId: "sarah", at: `${addDays(TODAY, -2)}T16:00`, done: false, scheduled: true },
  { id: "g-2", kind: "call", title: "Follow up on Zoom partner pricing", companyId: "zoom", dealId: "d-zoom", ownerId: "oliver", at: `${addDays(TODAY, -1)}T11:30`, done: false, scheduled: true },
  { id: "g-3", kind: "meeting", title: "Security walkthrough — Microsoft", body: "Procurement + CISO · 45 min", companyId: "microsoft", dealId: "d-ms-strategic", ownerId: "mark", at: `${TODAY}T09:30`, done: true, scheduled: true },
  { id: "g-4", kind: "call", title: "Legal redlines with Apple", body: "MSA clauses 7 and 12", companyId: "apple", dealId: "d-apple-pilot", ownerId: "alex", at: `${TODAY}T10:45`, done: false, scheduled: true },
  { id: "g-5", kind: "email", title: "Revised proposal to Stripe (SSO)", companyId: "stripe", dealId: "d-stripe", ownerId: "noah", at: `${TODAY}T12:00`, done: false, scheduled: true },
  { id: "g-6", kind: "meeting", title: "Netflix pilot success review", body: "Studio analytics · 60 min", companyId: "netflix", dealId: "d-netflix", ownerId: "ricky", at: `${TODAY}T14:00`, done: false, scheduled: true },
  { id: "g-7", kind: "task", title: "Prep Intercom final sign-off deck", companyId: "intercom", dealId: "d-intercom", ownerId: "lina", at: `${TODAY}T15:30`, done: false, scheduled: true },
  { id: "g-8", kind: "call", title: "Discovery call — Slack partner team", companyId: "slack", dealId: "d-slack", ownerId: "ava", at: `${TODAY}T17:00`, done: false, scheduled: true },
];

export const ACTIVITIES: Activity[] = [...history(), ...AGENDA];
