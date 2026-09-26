"use client";

import { Clock, Mail, Phone, Star } from "lucide-react";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import type { Contact } from "@/lib/contacts";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { PersonaTag, isCold, touchLabel } from "./shared";

export function StarButton({ contact, className }: { contact: Contact; className?: string }) {
  const toggleStar = useContacts((s) => s.toggleStar);
  return (
    <button
      type="button"
      aria-label={contact.starred ? `Unstar ${contact.name}` : `Star ${contact.name}`}
      aria-pressed={contact.starred}
      onClick={(e) => {
        e.stopPropagation();
        toggleStar(contact.id);
      }}
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-white/[0.06]",
        contact.starred ? "text-meter-amber" : "text-fg-muted hover:text-fg-soft",
        className,
      )}
    >
      <Star className={cn("size-[14px] transition-transform duration-300 ease-(--ease-pop)", contact.starred && "scale-110 fill-current")} strokeWidth={1.75} />
    </button>
  );
}

/** Round quick action (mail / call) — links with a stopPropagation so the card doesn't open. */
export function QuickAction({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Mail }) {
  return (
    <a
      href={href}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="flex size-[26px] items-center justify-center rounded-full border border-white/[0.09] bg-[#1b1b1b] text-fg-soft transition-colors hover:bg-[#232323] hover:text-fg"
    >
      <Icon className="size-[12px]" strokeWidth={1.75} />
    </a>
  );
}

/** Contact card ({components.contact-card}). */
export function ContactCard({ contact }: { contact: Contact }) {
  const company = useCrm((s) => s.companies.find((c) => c.id === contact.companyId));
  const openContact = useContacts((s) => s.openContact);
  const isNew = useContacts((s) => s.lastAddedId === contact.id);
  const cold = isCold(contact);

  return (
    <article
      data-contact-id={contact.id}
      tabIndex={0}
      onClick={() => openContact(contact.id)}
      onKeyDown={(e) => e.key === "Enter" && openContact(contact.id)}
      aria-label={`${contact.name}, ${contact.role} at ${company?.name}`}
      className={cn(
        "group flex cursor-pointer flex-col rounded-lg border border-line-card bg-card p-4 outline-none transition-[border-color,background-color] duration-200 hover:border-[#3a3c3f] focus-visible:border-[#55585c] active:bg-[#1e2023]",
        isNew && "animate-card-wash",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={contact.name} size={40} />
        <div className="flex min-w-0 flex-1 flex-col gap-[7px] pt-[3px]">
          <span className="truncate text-[15px] leading-none font-medium text-fg">{contact.name}</span>
          <span className="truncate text-[12px] leading-none text-fg-soft/80">{contact.role}</span>
        </div>
        <StarButton contact={contact} className="-mt-1 -mr-2" />
      </div>

      <div className="mt-3 flex items-center gap-[6px] text-[12px] leading-none text-fg-soft">
        <CompanyLogo id={contact.companyId} src={company?.logo} size={16} glyph={9} radius={4} />
        <span className="truncate">{company?.name}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {contact.personas.map((p) => (
          <PersonaTag key={p} persona={p} />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[12px] leading-none text-fg-muted">Relationship</span>
        <span className="flex items-center gap-[10px]">
          <SegmentedMeter value={contact.strength} />
          <span className="w-[26px] text-right text-[14px] leading-none font-[450] text-fg tabular-nums">{contact.strength}</span>
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line-card pt-3">
        <span className={cn("flex min-w-0 items-center gap-[5px] text-[12px] leading-none", cold ? "text-danger-dot" : "text-fg-muted")}>
          <Clock className="size-[12px] shrink-0" strokeWidth={1.75} />
          <span className="truncate">{cold ? `Going cold · ${touchLabel(contact).split(" · ")[1]}` : touchLabel(contact)}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1 transition-opacity duration-200 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          <QuickAction href={`mailto:${contact.email}`} label={`Email ${contact.name}`} icon={Mail} />
          <QuickAction href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} label={`Call ${contact.name}`} icon={Phone} />
        </span>
      </div>
    </article>
  );
}
