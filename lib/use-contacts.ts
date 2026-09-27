"use client";

import { useMemo } from "react";
import { useActivities } from "./activities-store";
import { isTouch } from "./company-metrics";
import { useContacts } from "./contacts-store";
import type { Contact } from "./contacts";

/**
 * Contacts with "last touch" kept current by the activity log: a logged call,
 * email, meeting or note at the contact's account by the contact's owner
 * counts as touching them. Relationship "Going cold" status follows.
 */
export function useLiveContacts(): Contact[] {
  const contacts = useContacts((s) => s.contacts);
  const activities = useActivities((s) => s.activities);
  return useMemo(() => {
    const latest = new Map<string, { date: string; kind: Contact["lastTouch"]["kind"] }>();
    for (const a of activities) {
      if (!isTouch(a) || a.kind === "task") continue;
      const key = `${a.companyId}:${a.ownerId}`;
      const date = a.at.slice(0, 10);
      const cur = latest.get(key);
      if (!cur || date > cur.date) latest.set(key, { date, kind: a.kind });
    }
    return contacts.map((c) => {
      const hit = latest.get(`${c.companyId}:${c.ownerId}`);
      return hit && hit.date > c.lastTouch.date ? { ...c, lastTouch: { kind: hit.kind, date: hit.date } } : c;
    });
  }, [contacts, activities]);
}

export function useLiveContact(id: string | null) {
  const all = useLiveContacts();
  return useMemo(() => (id ? all.find((c) => c.id === id) : undefined), [all, id]);
}
