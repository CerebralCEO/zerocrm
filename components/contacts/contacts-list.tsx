"use client";

import { Clock, Mail, Phone } from "lucide-react";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import type { Contact } from "@/lib/contacts";
import { ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { useDragScroll } from "@/components/companies/use-drag-scroll";
import { PersonaTag, isCold, touchLabel } from "./shared";
import { QuickAction, StarButton } from "./contact-card";

const GRID = "minmax(0,260fr) minmax(0,200fr) minmax(0,170fr) minmax(0,230fr) minmax(0,150fr) minmax(0,160fr) minmax(0,150fr) 80px";

function Row({ c }: { c: Contact }) {
  const company = useCrm((s) => s.companies.find((x) => x.id === c.companyId));
  const openContact = useContacts((s) => s.openContact);
  const isNew = useContacts((s) => s.lastAddedId === c.id);
  const cold = isCold(c);
  const owner = ownerById(c.ownerId);
  return (
    <div
      role="row"
      data-contact-id={c.id}
      tabIndex={0}
      onClick={() => openContact(c.id)}
      onKeyDown={(e) => e.key === "Enter" && openContact(c.id)}
      className={cn(
        "group grid h-[43px] cursor-pointer items-center border-b border-line px-4 text-[14px] leading-none font-[450] text-fg outline-none transition-colors hover:bg-row-hover focus-visible:bg-row-hover active:bg-row-hover",
        isNew && "animate-row-in",
      )}
      style={{ gridTemplateColumns: GRID }}
    >
      <span className="flex min-w-0 items-center gap-[8px] pr-4">
        <Avatar name={c.name} size={24} />
        <span className="truncate font-medium">{c.name}</span>
        <StarButton contact={c} className={cn("-my-1 size-6", !c.starred && "opacity-0 group-hover:opacity-100")} />
      </span>
      <span className="truncate pr-4 text-[12px] text-fg-soft/80">{c.role}</span>
      <span className="flex min-w-0 items-center gap-[6px] pr-4">
        <CompanyLogo id={c.companyId} src={company?.logo} size={18} glyph={10} radius={4} />
        <span className="truncate">{company?.name}</span>
      </span>
      <span className="flex min-w-0 gap-1 overflow-hidden pr-4">
        {c.personas.map((p) => (
          <PersonaTag key={p} persona={p} />
        ))}
      </span>
      <span className="flex items-center gap-[10px] pr-4">
        <SegmentedMeter value={c.strength} />
        <span className="w-[26px] text-right tabular-nums">{c.strength}</span>
      </span>
      <span className={cn("flex min-w-0 items-center gap-[5px] pr-4 text-[12px]", cold ? "text-danger-dot" : "text-fg-muted")}>
        <Clock className="size-[12px] shrink-0" strokeWidth={1.75} />
        <span className="truncate">{touchLabel(c)}</span>
      </span>
      <span className="flex min-w-0 items-center gap-[6px] pr-4 text-[12px] text-fg-soft">
        <Avatar name={owner.name} size={18} />
        <span className="truncate">{owner.name}</span>
      </span>
      <span className="flex justify-end gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        <QuickAction href={`mailto:${c.email}`} label={`Email ${c.name}`} icon={Mail} />
        <QuickAction href={`tel:${c.phone.replace(/[^\d+]/g, "")}`} label={`Call ${c.name}`} icon={Phone} />
      </span>
    </div>
  );
}

/** Dense list view (desktop/tablet) — horizontal scroll with mouse drag-to-pan. */
export function ContactsList({ contacts }: { contacts: Contact[] }) {
  const scrollRef = useDragScroll<HTMLDivElement>();
  return (
    <div ref={scrollRef} className="table-scroll overflow-x-auto">
      <div className="min-w-[1280px]">
        <div
          role="row"
          className="grid h-10 items-center border-b border-line px-4 text-[12px] leading-none text-fg-muted"
          style={{ gridTemplateColumns: GRID }}
        >
          {["Name", "Role", "Company", "Buying role", "Relationship", "Last touch", "Owner", ""].map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {contacts.map((c) => (
          <Row key={c.id} c={c} />
        ))}
        {contacts.length === 0 && <p className="py-16 text-center text-[13px] text-fg-muted">No contacts match.</p>}
      </div>
    </div>
  );
}
