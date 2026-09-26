"use client";

import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import { Modal, Button } from "@/components/ui/overlay";
import { Checkbox } from "@/components/primitives/checkbox";
import { Avatar } from "@/components/primitives/avatar";

function EnrollForm({ onDone }: { onDone: () => void }) {
  const seq = useSequences((s) => s.sequences.find((q) => q.id === s.selectedId));
  const enroll = useSequences((s) => s.enroll);
  const contacts = useContacts((s) => s.contacts);
  const companies = useCrm((s) => s.companies);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const already = new Set(seq?.enrollments.map((e) => e.contactId));
  const name = (id: string) => companies.find((c) => c.id === id)?.name ?? id;
  const q = query.trim().toLowerCase();
  const list = contacts
    .filter((c) => !already.has(c.id))
    .filter((c) => !q || `${c.name} ${c.role} ${name(c.companyId)}`.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggle = (id: string) =>
    setPicked((p) => {
      const next = new Set(p);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-line-strong px-4 py-3 sm:px-6">
        <label className="flex h-9 items-center gap-2 rounded-lg border border-[#2e2e2e] bg-[#1e1e1e] px-3 focus-within:border-[#666]">
          <Search className="size-[14px] text-fg-muted" strokeWidth={2} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people or companies…"
            aria-label="Search contacts to enroll"
            className="h-full flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-[#5f5f5f]"
          />
        </label>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-1 sm:px-4">
        {list.map((c) => (
          <li key={c.id}>
            {/* A div (not a button): the checkbox inside is itself a button. */}
            <div
              onClick={() => toggle(c.id)}
              className="flex min-h-[52px] w-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-row-hover"
            >
              <Checkbox checked={picked.has(c.id)} onChange={() => toggle(c.id)} label={`Enroll ${c.name}`} />
              <Avatar name={c.name} size={28} />
              <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <span className="truncate text-[14px] leading-none font-medium text-fg">{c.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-muted">
                  {c.role} · {name(c.companyId)}
                </span>
              </span>
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="py-10 text-center text-[13px] text-fg-muted">No one left to enroll.</li>}
      </ul>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <span className="text-[12px] leading-none text-fg-muted tabular-nums">{picked.size} selected</span>
        <div className="flex gap-2">
          <Button onClick={onDone}>Cancel</Button>
          <Button
            variant="primary"
            disabled={picked.size === 0}
            onClick={() => {
              if (seq) enroll(seq.id, [...picked]);
              onDone();
            }}
            className="pr-[9px] pl-[8px]"
          >
            <UserPlus className="size-[12px]" strokeWidth={2} />
            Enroll {picked.size || ""}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EnrollDialog() {
  const open = useSequences((s) => s.enrollOpen);
  const setOpen = useSequences((s) => s.setEnrollOpen);
  const seq = useSequences((s) => s.sequences.find((q) => q.id === s.selectedId));
  return (
    <Modal open={open} onOpenChange={setOpen} title="Enroll contacts" description={seq ? `Add people to “${seq.name}”.` : undefined}>
      {open && <EnrollForm onDone={() => setOpen(false)} />}
    </Modal>
  );
}
