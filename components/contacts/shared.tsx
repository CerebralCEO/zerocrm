"use client";

import { useMemo } from "react";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import { TODAY } from "@/lib/deals-store";
import { COLD_AFTER, personaTone, type Contact, type Persona } from "@/lib/contacts";
import { daysBetween } from "@/lib/activities";
import { Tag } from "@/components/primitives/tag";

export const daysSince = (c: Contact) => daysBetween(c.lastTouch.date, TODAY);
export const isCold = (c: Contact) => daysSince(c) > COLD_AFTER;

const VERB = { call: "Called", email: "Emailed", meeting: "Met", note: "Note", task: "Task" } as const;

/** "Emailed · 3d ago" / "Met · today" */
export function touchLabel(c: Contact) {
  const d = daysSince(c);
  return `${VERB[c.lastTouch.kind]} · ${d === 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`}`;
}

export function PersonaTag({ persona, className }: { persona: Persona; className?: string }) {
  return (
    <Tag tone={personaTone(persona)} className={className}>
      {persona}
    </Tag>
  );
}

/** Contacts after search, filters and sort. */
export function useVisibleContacts() {
  const { contacts, query, sortBy, persona, ownerFilter, show } = useContacts();
  const companies = useCrm((s) => s.companies);
  return useMemo(() => {
    const name = (id: string) => companies.find((c) => c.id === id)?.name ?? id;
    const q = query.trim().toLowerCase();
    const list = contacts.filter(
      (c) =>
        (!q || [c.name, c.role, c.email, name(c.companyId)].some((v) => v.toLowerCase().includes(q))) &&
        (!persona || c.personas.includes(persona)) &&
        (!ownerFilter || c.ownerId === ownerFilter) &&
        (show === "all" || (show === "starred" ? c.starred : isCold(c))),
    );
    switch (sortBy) {
      case "strength":
        return list.sort((a, b) => b.strength - a.strength);
      case "recent":
        return list.sort((a, b) => b.lastTouch.date.localeCompare(a.lastTouch.date));
      case "company":
        return list.sort((a, b) => name(a.companyId).localeCompare(name(b.companyId)) || a.name.localeCompare(b.name));
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [contacts, query, sortBy, persona, ownerFilter, show, companies]);
}
