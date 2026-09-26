"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import { OWNERS, ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select } from "@/components/ui/form";
import { Avatar } from "@/components/primitives/avatar";

function AddSdrForm({ onDone }: { onDone: () => void }) {
  const addSdr = useTeams((s) => s.addSdr);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("SDR");
  const [territory, setTerritory] = useState("");
  const [partnerId, setPartnerId] = useState(OWNERS[0].id);
  const [quota, setQuota] = useState("20");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) {
          setError("Name is required.");
          return;
        }
        addSdr("sdr", {
          id: `sdr-new-${Date.now().toString(36)}`,
          name: name.trim(),
          title: title.trim() || "SDR",
          territory: territory.trim() || "Unassigned",
          partnerId,
          meetingQuota: Number(quota) || 20,
          stats: {},
          weekly: Array(14).fill(0),
          sourced: [],
        });
        onDone();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <SectionLabel className="font-normal text-fg-soft">SDR</SectionLabel>
        <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="as-name">
              Full name <span className="text-fg-muted">*</span>
            </Label>
            <Input
              id="as-name"
              autoFocus
              placeholder="Jordan Lee"
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
            <Label htmlFor="as-title">Title</Label>
            <Input id="as-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <div className="mt-[15px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="as-territory">Territory</Label>
            <Input id="as-territory" placeholder="East" value={territory} onChange={(e) => setTerritory(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="as-quota">Meeting quota</Label>
            <Input id="as-quota" inputMode="numeric" value={quota} onChange={(e) => setQuota(e.target.value.replace(/[^\d]/g, ""))} className="tabular-nums" />
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="as-partner">Books meetings for</Label>
          <Select
            id="as-partner"
            value={partnerId}
            onValueChange={setPartnerId}
            options={OWNERS.map((o) => ({ value: o.id, label: o.name }))}
            renderValue={(v) => (
              <>
                <Avatar name={ownerById(v).name} size={20} />
                {ownerById(v).name}
              </>
            )}
            renderOption={(v) => <Avatar name={ownerById(v).name} size={18} />}
          />
        </div>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Plus className="size-[13px]" strokeWidth={2} />
          Add SDR
        </Button>
      </div>
    </form>
  );
}

export function AddSdrDialog() {
  const open = useTeams((s) => s.addOpen);
  const setOpen = useTeams((s) => s.setAddOpen);
  return (
    <Modal open={open} onOpenChange={setOpen} title="Add SDR" description="Add a rep who books first meetings for an AE.">
      {open && <AddSdrForm onDone={() => setOpen(false)} />}
    </Modal>
  );
}
