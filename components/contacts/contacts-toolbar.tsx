"use client";

import { LayoutGrid, List, Search, X } from "lucide-react";
import { useContacts, type ContactShow, type ContactSort } from "@/lib/contacts-store";
import { PERSONAS } from "@/lib/contacts";
import { OWNERS, ownerById } from "@/lib/data";
import { useCrm } from "@/lib/store";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Segmented } from "@/components/ui/segmented";
import { Avatar } from "@/components/primitives/avatar";
import { useVisibleContacts } from "./shared";

const SORTS: { key: ContactSort; label: string }[] = [
  { key: "name", label: "Name (A–Z)" },
  { key: "strength", label: "Relationship" },
  { key: "recent", label: "Last Touch" },
  { key: "company", label: "Company" },
];
const SHOWS: { key: ContactShow; label: string }[] = [
  { key: "all", label: "All Contacts" },
  { key: "starred", label: "Starred" },
  { key: "cold", label: "Going Cold" },
];

/** Pill search field in the chip row ({components.search-pill}). */
function SearchPill() {
  const query = useContacts((s) => s.query);
  const setQuery = useContacts((s) => s.setQuery);
  return (
    <label className="group flex h-[30px] w-[220px] shrink-0 items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[6px] pl-[10px] transition-colors focus-within:border-white/[0.18] max-md:w-full">
      <Search className="size-[13px] shrink-0 text-fg-muted" strokeWidth={2} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search contacts…"
        aria-label="Search contacts"
        className="h-full min-w-0 flex-1 bg-transparent text-[12px] text-fg outline-none placeholder:text-fg-muted"
      />
      {query && (
        <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="flex size-[18px] items-center justify-center rounded-full bg-white/[0.08] text-fg-soft">
          <X className="size-[10px]" strokeWidth={2.5} />
        </button>
      )}
    </label>
  );
}

export function ContactsToolbar() {
  const { sortBy, persona, ownerFilter, show, view, setSortBy, setPersona, setOwnerFilter, setShow, setView, setNewOpen, query } = useContacts();
  const companies = useCrm((s) => s.companies);
  const rows = useVisibleContacts();

  const exportCsv = () =>
    downloadCsv(
      "contacts.csv",
      ["Name", "Role", "Company", "Email", "Phone", "Location", "Personas", "Relationship", "Last touch", "Owner"],
      rows.map((c) => [
        c.name,
        c.role,
        companies.find((x) => x.id === c.companyId)?.name ?? c.companyId,
        c.email,
        c.phone,
        c.location,
        c.personas.join(" / "),
        c.strength,
        c.lastTouch.date,
        ownerById(c.ownerId).name,
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!persona) + Number(!!ownerFilter) + Number(show !== "all") + Number(!!query)}
      filters={
        <>
          <SearchPill />
          <FilterChip label="Sort by" value={SORTS.find((s) => s.key === sortBy)!.label}>
            {SORTS.map((s) => (
              <MenuItem key={s.key} selected={s.key === sortBy} onSelect={() => setSortBy(s.key)}>
                {s.label}
              </MenuItem>
            ))}
          </FilterChip>
          <FilterChip label="Role" value={persona ?? "Any Role"}>
            <MenuItem selected={!persona} onSelect={() => setPersona(null)}>
              Any Role
            </MenuItem>
            <MenuSeparator />
            {PERSONAS.map((p) => (
              <MenuItem key={p.id} selected={persona === p.id} onSelect={() => setPersona(p.id)}>
                {p.id}
              </MenuItem>
            ))}
          </FilterChip>
          <FilterChip label="Owner" value={ownerFilter ? ownerById(ownerFilter).name : "Whole Team"}>
            <MenuItem selected={!ownerFilter} onSelect={() => setOwnerFilter(null)}>
              Whole Team
            </MenuItem>
            <MenuSeparator />
            <div className="max-h-[280px] overflow-y-auto">
              {OWNERS.map((o) => (
                <MenuItem key={o.id} selected={ownerFilter === o.id} onSelect={() => setOwnerFilter(o.id)}>
                  <Avatar name={o.name} size={18} />
                  {o.name}
                </MenuItem>
              ))}
            </div>
          </FilterChip>
          <FilterChip label="Show" value={SHOWS.find((s) => s.key === show)!.label}>
            {SHOWS.map((s) => (
              <MenuItem key={s.key} selected={s.key === show} onSelect={() => setShow(s.key)}>
                {s.label}
              </MenuItem>
            ))}
          </FilterChip>
        </>
      }
      actions={
        <>
          <Segmented
            label="View"
            iconOnly
            className="mr-1 h-[30px] w-[88px] max-md:hidden"
            value={view}
            onChange={setView}
            options={[
              { value: "grid", label: "Grid view", icon: <LayoutGrid className="size-[13px]" strokeWidth={1.75} /> },
              { value: "list", label: "List view", icon: <List className="size-[13px]" strokeWidth={1.75} /> },
            ]}
          />
          <ExportButton onClick={exportCsv} />
          <PrimaryAction label="New Contact" onClick={() => setNewOpen(true)} />
        </>
      }
    />
  );
}
