"use client";

import { useSequences, type StatusFilter } from "@/lib/sequences-store";
import { sequenceStats } from "@/lib/sequences";
import { OWNERS, ownerById } from "@/lib/data";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";
import { useVisibleSequences } from "./shared";

const STATUSES: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "draft", label: "Draft" },
];

export function SequencesToolbar() {
  const { statusFilter, ownerFilter, setStatusFilter, setOwnerFilter, setNewOpen } = useSequences();
  const rows = useVisibleSequences();

  const exportCsv = () =>
    downloadCsv(
      "sequences.csv",
      ["Sequence", "Status", "Owner", "Steps", "Enrolled", "Open rate", "Reply rate", "Meetings"],
      rows.map((q) => {
        const s = sequenceStats(q);
        return [q.name, q.status, ownerById(q.ownerId).name, q.steps.length, s.enrolled, `${s.openRate}%`, `${s.replyRate}%`, s.meetings];
      }),
    );

  return (
    <PageToolbar
      activeFilters={Number(statusFilter !== "all") + Number(!!ownerFilter)}
      filters={
        <>
          <FilterChip label="Status" value={STATUSES.find((s) => s.key === statusFilter)!.label}>
            {STATUSES.map((s) => (
              <MenuItem key={s.key} selected={s.key === statusFilter} onSelect={() => setStatusFilter(s.key)}>
                {s.label}
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
        </>
      }
      actions={
        <>
          <ExportButton onClick={exportCsv} />
          <PrimaryAction label="New Sequence" onClick={() => setNewOpen(true)} />
        </>
      }
    />
  );
}
