import type { Activity } from "@/lib/activities";
import type { Company, Notification, Owner } from "@/lib/data";
import type { Deal } from "@/lib/deals";
import type { Contact } from "@/lib/contacts";
import type { Sequence } from "@/lib/sequences";
import type { Team } from "@/lib/teams";
import type { Invoice } from "@/lib/invoices";
import type { Push } from "@/lib/slips";
import * as t from "./schema";

/**
 * Store shape ⇄ database row. The client stores keep the exact shapes the UI
 * already uses; these functions are the only place that knows the columns.
 * Used by the seed script, the snapshot loader and the sync action.
 */

type Row<T extends { $inferInsert: unknown }> = T["$inferInsert"];

export const ownerToRow = (o: Owner): Row<typeof t.owners> => ({ id: o.id, name: o.name, email: o.email, phone: o.phone });

export const companyToRow = (c: Company): Row<typeof t.companies> => ({
  id: c.id,
  name: c.name,
  logo: c.logo ?? null,
  tags: c.tags,
  ownerId: c.ownerId,
  lastInteractionDate: c.lastInteraction.date,
  lastInteractionType: c.lastInteraction.type,
  scoreCards: c.scoreCards,
});
export const companyFromRow = (r: typeof t.companies.$inferSelect): Company => ({
  id: r.id,
  name: r.name,
  logo: r.logo ?? undefined,
  tags: r.tags,
  ownerId: r.ownerId,
  lastInteraction: { date: r.lastInteractionDate, type: r.lastInteractionType as Company["lastInteraction"]["type"] },
  scoreCards: r.scoreCards,
  // Metrics are derived in the app (lib/company-metrics.ts); these are neutral placeholders.
  openDeals: 0,
  pipelineValue: 0,
  winProbability: 0,
  activity: Array(14).fill(0),
  health: { discovery: 0, evaluation: 0, procurement: 0 },
  activityScore: 0,
  activityNote: "",
  touches: { total: 0, emails: 0, meetings: 0, calls: 0 },
});

export const dealToRow = (d: Deal): Row<typeof t.deals> => ({
  id: d.id,
  companyId: d.companyId,
  title: d.title,
  value: d.value,
  stage: d.stage,
  ownerId: d.ownerId,
  probability: d.probability,
  closeDate: d.closeDate,
  nextStep: d.nextStep,
  lastTouchType: d.lastTouch.type,
  lastTouchDate: d.lastTouch.date,
  siteId: d.siteId ?? null,
  notes: d.activity,
});
export const dealFromRow = (r: typeof t.deals.$inferSelect): Deal => ({
  id: r.id,
  companyId: r.companyId,
  title: r.title,
  value: r.value,
  stage: r.stage as Deal["stage"],
  ownerId: r.ownerId,
  probability: r.probability,
  closeDate: r.closeDate,
  nextStep: r.nextStep,
  lastTouch: { type: r.lastTouchType as Deal["lastTouch"]["type"], date: r.lastTouchDate },
  activity: r.notes,
  ...(r.siteId ? { siteId: r.siteId } : {}),
});

export const activityToRow = (a: Activity): Row<typeof t.activities> => ({
  id: a.id,
  kind: a.kind,
  title: a.title,
  body: a.body ?? null,
  companyId: a.companyId,
  dealId: a.dealId ?? null,
  ownerId: a.ownerId,
  at: a.at,
  done: a.done,
  scheduled: !!a.scheduled,
  system: !!a.system,
  actor: a.actor ?? null,
});
export const activityFromRow = (r: typeof t.activities.$inferSelect): Activity => ({
  id: r.id,
  kind: r.kind as Activity["kind"],
  title: r.title,
  companyId: r.companyId,
  ownerId: r.ownerId,
  at: r.at,
  done: r.done,
  ...(r.body ? { body: r.body } : {}),
  ...(r.dealId ? { dealId: r.dealId } : {}),
  ...(r.scheduled ? { scheduled: true } : {}),
  ...(r.system ? { system: true } : {}),
  ...(r.actor ? { actor: r.actor } : {}),
});

export const contactToRow = (c: Contact): Row<typeof t.contacts> => ({
  id: c.id,
  name: c.name,
  role: c.role,
  companyId: c.companyId,
  ownerId: c.ownerId,
  email: c.email,
  phone: c.phone,
  location: c.location,
  personas: c.personas,
  strength: c.strength,
  lastTouchKind: c.lastTouch.kind,
  lastTouchDate: c.lastTouch.date,
  starred: c.starred,
});
export const contactFromRow = (r: typeof t.contacts.$inferSelect): Contact => ({
  id: r.id,
  name: r.name,
  role: r.role,
  companyId: r.companyId,
  ownerId: r.ownerId,
  email: r.email,
  phone: r.phone,
  location: r.location,
  personas: r.personas,
  strength: r.strength,
  lastTouch: { kind: r.lastTouchKind as Contact["lastTouch"]["kind"], date: r.lastTouchDate },
  starred: r.starred,
});

export const sequenceToRow = (s: Sequence): Row<typeof t.sequences> => ({
  id: s.id,
  name: s.name,
  goal: s.goal,
  status: s.status,
  ownerId: s.ownerId,
  meetings: s.meetings,
  steps: s.steps,
  enrollments: s.enrollments,
});
export const sequenceFromRow = (r: typeof t.sequences.$inferSelect): Sequence => ({
  id: r.id,
  name: r.name,
  goal: r.goal,
  status: r.status as Sequence["status"],
  ownerId: r.ownerId,
  meetings: r.meetings,
  steps: r.steps,
  enrollments: r.enrollments,
});

export const teamToRow = (tm: Team): Row<typeof t.teams> => ({
  id: tm.id,
  kind: tm.kind,
  name: tm.name,
  description: tm.description,
  accountsLabel: tm.kind === "ae" ? tm.accountsLabel : null,
  members: tm.members,
});
export const teamFromRow = (r: typeof t.teams.$inferSelect): Team =>
  r.kind === "sdr"
    ? ({ id: r.id, kind: "sdr", name: r.name, description: r.description, members: r.members } as Team)
    : ({ id: r.id, kind: "ae", name: r.name, description: r.description, accountsLabel: r.accountsLabel ?? "Accounts", members: r.members } as Team);

export const invoiceToRow = (i: Invoice): Row<typeof t.invoices> => ({
  id: i.id,
  number: i.number,
  dealId: i.dealId,
  companyId: i.companyId,
  ownerId: i.ownerId,
  issueDate: i.issueDate,
  terms: i.terms,
  status: i.status,
  sentDate: i.sentDate ?? null,
  paidDate: i.paidDate ?? null,
  items: i.items,
  discount: i.discount,
  taxRate: i.taxRate,
  taxLabel: i.taxLabel,
  notes: i.notes,
  templateId: i.templateId,
});
export const invoiceFromRow = (r: typeof t.invoices.$inferSelect): Invoice => ({
  id: r.id,
  number: r.number,
  dealId: r.dealId,
  companyId: r.companyId,
  ownerId: r.ownerId,
  issueDate: r.issueDate,
  terms: r.terms,
  status: r.status as Invoice["status"],
  items: r.items,
  discount: r.discount,
  taxRate: r.taxRate,
  taxLabel: r.taxLabel,
  notes: r.notes,
  templateId: r.templateId,
  ...(r.sentDate ? { sentDate: r.sentDate } : {}),
  ...(r.paidDate ? { paidDate: r.paidDate } : {}),
});

/** A deal's push history ⇄ one row per push. */
export const pushesToRows = (dealId: string, pushes: Push[]): Row<typeof t.slipPushes>[] =>
  pushes.map((p, i) => ({ id: `${dealId}#${i}`, dealId, position: i, fromDate: p.from, toDate: p.to, onDate: p.on, reason: p.reason }));
export function historyFromRows(rows: (typeof t.slipPushes.$inferSelect)[]): Record<string, Push[]> {
  const out: Record<string, Push[]> = {};
  for (const r of [...rows].sort((a, b) => a.position - b.position))
    (out[r.dealId] ??= []).push({ from: r.fromDate, to: r.toDate, on: r.onDate, reason: r.reason as Push["reason"] });
  return out;
}

export const notificationToRow = (n: Notification): Row<typeof t.notifications> => ({
  id: n.id,
  actor: n.actor ?? null,
  companyId: n.companyId,
  company: n.company,
  text: n.text,
  quote: n.quote ?? null,
  time: n.time,
  unread: n.unread,
});
export const notificationFromRow = (r: typeof t.notifications.$inferSelect): Notification => ({
  id: r.id,
  companyId: r.companyId,
  company: r.company,
  text: r.text,
  time: r.time,
  unread: r.unread,
  ...(r.actor ? { actor: r.actor } : {}),
  ...(r.quote ? { quote: r.quote } : {}),
});
