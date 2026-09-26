"use client";

import { useRef, useState } from "react";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import type { Contact } from "@/lib/contacts";
import { cn } from "@/lib/utils";
import { ContactCard } from "./contact-card";

type Section = { key: string; label: string; items: Contact[] };

/** Group into sticky sections: by first letter (name sort) or company (company sort). */
function useSections(contacts: Contact[]): Section[] {
  const sortBy = useContacts((s) => s.sortBy);
  const companies = useCrm((s) => s.companies);
  if (sortBy !== "name" && sortBy !== "company") return [{ key: "all", label: "", items: contacts }];
  const out: Section[] = [];
  for (const c of contacts) {
    const label = sortBy === "name" ? c.name[0].toUpperCase() : companies.find((x) => x.id === c.companyId)?.name ?? c.companyId;
    const last = out.at(-1);
    if (last?.label === label) last.items.push(c);
    else out.push({ key: label, label, items: [c] });
  }
  return out;
}

/**
 * iOS Contacts-style A–Z index (phones): tap or drag along it to jump to a
 * letter; a bubble previews the letter under the finger.
 */
function AlphabetIndex({ letters, onJump }: { letters: string[]; onJump: (l: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const last = useRef<string | null>(null);

  const pick = (e: React.PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const l = el?.dataset.letter;
    if (l && l !== last.current) {
      last.current = l;
      setActive(l);
      onJump(l);
      navigator.vibrate?.(4);
    }
  };
  const end = () => {
    last.current = null;
    setActive(null);
  };

  return (
    <div
      className="fixed top-1/2 right-[2px] z-20 flex -translate-y-1/2 touch-none flex-col items-center py-2 select-none md:hidden"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        pick(e);
      }}
      onPointerMove={(e) => e.buttons && pick(e)}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Jump to letter"
    >
      {letters.map((l) => (
        <span key={l} data-letter={l} className="flex h-[17px] w-5 items-center justify-center text-[11px] leading-none font-semibold text-fg-soft">
          {l}
        </span>
      ))}
      {active && (
        <span className="pointer-events-none absolute top-1/2 right-8 flex size-12 -translate-y-1/2 animate-pop-in items-center justify-center rounded-full border border-line-strong bg-panel text-[22px] font-semibold text-fg shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
          {active}
        </span>
      )}
    </div>
  );
}

export function ContactsGrid({ contacts }: { contacts: Contact[] }) {
  const sections = useSections(contacts);
  const sortBy = useContacts((s) => s.sortBy);

  const jump = (label: string) => {
    document.getElementById(`contacts-section-${label}`)?.scrollIntoView({ block: "start" });
  };

  return (
    // Phones: sticky letter/company sections + A–Z index. From md the sections
    // dissolve (display: contents) into one continuous card grid.
    <div className="px-4 pt-0 pb-6 md:grid md:grid-cols-[repeat(auto-fill,minmax(272px,1fr))] md:gap-3 md:pt-4">
      {sections.map((s) => (
        <section key={s.key} id={`contacts-section-${s.key}`} className="md:contents">
          {s.label && (
            <div className="sticky top-0 z-[2] -mx-4 flex items-center gap-2 bg-app/90 px-4 pt-4 pb-2 backdrop-blur-[6px] md:hidden">
              <span className="text-[12px] font-medium uppercase leading-none tracking-[1.1px] text-fg">{s.label}</span>
              <span className="text-[12px] leading-none text-fg-muted">· {s.items.length}</span>
            </div>
          )}
          <div className={cn("grid gap-3 pr-4 md:contents", !s.label && "pt-4")}>
            {s.items.map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
          </div>
        </section>
      ))}
      {contacts.length === 0 && <p className="py-16 text-center text-[13px] text-fg-muted">No contacts match.</p>}
      {sortBy === "name" && sections.length > 1 && <AlphabetIndex letters={sections.map((s) => s.label)} onJump={jump} />}
    </div>
  );
}
