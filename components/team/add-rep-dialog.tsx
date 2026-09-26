"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import { OWNERS, ownerById } from "@/lib/data";
import type { TeamId } from "@/lib/teams";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select } from "@/components/ui/form";
import { Avatar } from "@/components/primitives/avatar";

function AddRepForm({ teamId, onDone }: { teamId: TeamId; onDone: () => void }) {
  const team = useTeams((s) => s.teams.find((t) => t.id === teamId));
  const addMember = useTeams((s) => s.addMember);
  const members = team?.kind === "ae" ? team.members : [];
  const available = OWNERS.filter((o) => !members.some((m) => m.ownerId === o.id));
  const [ownerId, setOwnerId] = useState(available[0]?.id ?? "");
  const [title, setTitle] = useState(teamId === "strategic" ? "Strategic AE" : "Mid-Market AE");
  const [territory, setTerritory] = useState("");
  const [quota, setQuota] = useState(teamId === "strategic" ? "500000" : "250000");

  if (!available.length) {
    return <p className="px-6 py-10 text-center text-[13px] text-fg-muted">Everyone is already on this team.</p>;
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        addMember(teamId, { ownerId, title: title.trim() || "AE", territory: territory.trim() || "Unassigned", quota: Number(quota) || 500_000 });
        onDone();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <SectionLabel className="font-normal text-fg-soft">Rep</SectionLabel>
        <div className="mt-[16px]">
          <Label htmlFor="ar-owner">Person</Label>
          <Select
            id="ar-owner"
            value={ownerId}
            onValueChange={setOwnerId}
            options={available.map((o) => ({ value: o.id, label: o.name }))}
            renderValue={(v) => (
              <>
                <Avatar name={ownerById(v).name} size={20} />
                {ownerById(v).name}
              </>
            )}
            renderOption={(v) => <Avatar name={ownerById(v).name} size={18} />}
          />
        </div>
        <div className="mt-[15px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="ar-title">Title</Label>
            <Input id="ar-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ar-quota">Period quota</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-[#5f5f5f]">$</span>
              <Input id="ar-quota" inputMode="numeric" value={quota} onChange={(e) => setQuota(e.target.value.replace(/[^\d]/g, ""))} className="pl-[23px] tabular-nums" />
            </div>
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="ar-territory">Territory</Label>
          <Input id="ar-territory" placeholder="East · Financial Services" value={territory} onChange={(e) => setTerritory(e.target.value)} />
        </div>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Plus className="size-[13px]" strokeWidth={2} />
          Add Rep
        </Button>
      </div>
    </form>
  );
}

export function AddRepDialog({ teamId }: { teamId: TeamId }) {
  const open = useTeams((s) => s.addOpen);
  const setOpen = useTeams((s) => s.setAddOpen);
  const team = useTeams((s) => s.teams.find((t) => t.id === teamId));
  return (
    <Modal open={open} onOpenChange={setOpen} title="Add Rep" description={`Add a seller to ${team?.name ?? "the team"} with a quota for the period.`}>
      {open && <AddRepForm teamId={teamId} onDone={() => setOpen(false)} />}
    </Modal>
  );
}
