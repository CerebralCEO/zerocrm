"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import { TODAY } from "@/lib/deals-store";
import { PERSONAS, type Persona } from "@/lib/contacts";
import { OWNERS, ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select } from "@/components/ui/form";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { Tag } from "@/components/primitives/tag";

function NewContactForm({ onDone }: { onDone: () => void }) {
  const companies = useCrm((s) => s.companies);
  const addContact = useContacts((s) => s.addContact);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]?.id ?? "");
  const [ownerId, setOwnerId] = useState(companies[0]?.ownerId ?? OWNERS[0].id);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [error, setError] = useState<string | null>(null);
  const companyById = (id: string) => companies.find((c) => c.id === id);

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) {
          setError("Name is required.");
          return;
        }
        addContact({
          name: name.trim(),
          role: role.trim() || "—",
          companyId,
          ownerId,
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim() || "—",
          personas,
          strength: 20,
          lastTouch: { kind: "note", date: TODAY },
          starred: false,
        });
        onDone();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <SectionLabel className="font-normal text-fg-soft">Person</SectionLabel>
        <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="nc2-name">
              Full name <span className="text-fg-muted">*</span>
            </Label>
            <Input
              id="nc2-name"
              autoFocus
              placeholder="Alex Morgan"
              value={name}
              aria-invalid={!!error}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              className={cn(error && "border-danger-dot/70 focus:border-danger-dot")}
            />
            {error && <p className="mt-[6px] text-[12px] text-danger-dot">{error}</p>}
          </div>
          <div>
            <Label htmlFor="nc2-role">Job title</Label>
            <Input id="nc2-role" placeholder="VP, Operations" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </div>
        <div className="mt-[15px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="nc2-email">Email</Label>
            <Input id="nc2-email" type="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="nc2-phone">Phone</Label>
            <Input id="nc2-phone" type="tel" placeholder="+1 (555) 0100" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="-mx-4 my-5 h-px bg-line-strong sm:-mx-6" />

        <SectionLabel className="font-normal text-fg-soft">Account</SectionLabel>
        <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="nc2-company">Company</Label>
            <Select
              id="nc2-company"
              value={companyId}
              onValueChange={(v) => {
                setCompanyId(v);
                const o = companyById(v)?.ownerId;
                if (o) setOwnerId(o);
              }}
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
              renderValue={(v) => (
                <>
                  <CompanyLogo id={v} src={companyById(v)?.logo} size={20} glyph={11} radius={5} />
                  <span className="truncate">{companyById(v)?.name}</span>
                </>
              )}
              renderOption={(v) => <CompanyLogo id={v} src={companyById(v)?.logo} size={18} glyph={10} radius={4} />}
            />
          </div>
          <div>
            <Label htmlFor="nc2-owner">Owner</Label>
            <Select
              id="nc2-owner"
              value={ownerId}
              onValueChange={setOwnerId}
              options={OWNERS.map((o) => ({ value: o.id, label: o.name }))}
              renderValue={(v) => (
                <>
                  <Avatar name={ownerById(v).name} size={20} />
                  <span className="truncate">{ownerById(v).name}</span>
                </>
              )}
              renderOption={(v) => <Avatar name={ownerById(v).name} size={18} />}
            />
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="nc2-location">Location</Label>
          <Input id="nc2-location" placeholder="New York, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="mt-[15px]">
          <span className="mb-[9px] block text-[12px] leading-none text-fg-soft">Buying role</span>
          {/* Toggleable tag chips (multi-select) */}
          <div className="flex flex-wrap gap-[6px]" role="group" aria-label="Buying role">
            {PERSONAS.map((p) => {
              const on = personas.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPersonas((cur) => (on ? cur.filter((x) => x !== p.id) : [...cur, p.id]))}
                  className={cn("rounded-full transition-opacity duration-200", on ? "opacity-100" : "opacity-45 hover:opacity-75")}
                >
                  <Tag tone={p.tone}>{p.id}</Tag>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Plus className="size-[13px]" strokeWidth={2} />
          Create Contact
        </Button>
      </div>
    </form>
  );
}

export function NewContactDialog() {
  const open = useContacts((s) => s.newOpen);
  const setOpen = useContacts((s) => s.setNewOpen);
  return (
    <Modal open={open} onOpenChange={setOpen} title="New Contact" description="Add a person to an account.">
      {open && <NewContactForm onDone={() => setOpen(false)} />}
    </Modal>
  );
}
