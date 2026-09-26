"use client";

import { useCrm, type ActivityWindow, type SortKey } from "@/lib/store";
import { OWNERS, STAGES, SEGMENTS, ownerById, type Tag } from "@/lib/data";
import { MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";
import { useVisibleCompanies } from "./use-visible-companies";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "pipelineValue", label: "Pipeline Value" },
  { key: "winProbability", label: "Win Probability" },
  { key: "openDeals", label: "Open Deals" },
  { key: "lastInteraction", label: "Last Interaction" },
  { key: "name", label: "Company Name" },
];

const WINDOWS: ActivityWindow[] = ["30 Days", "90 Days", "6 Months", "12 Months"];

function exportCsv(rows: ReturnType<typeof useVisibleCompanies>) {
  downloadCsv(
    "companies.csv",
    ["Company", "Tags", "Owner", "Open Deals", "Pipeline Value", "Win Probability", "Last Interaction", "Type"],
    rows.map((c) => [
      c.name,
      c.tags.join(" / "),
      ownerById(c.ownerId).name,
      c.openDeals,
      c.pipelineValue,
      `${c.winProbability}%`,
      c.lastInteraction.date,
      c.lastInteraction.type,
    ]),
  );
}

export function Toolbar() {
  const { sortBy, ownerFilter, stageFilter, activityWindow } = useCrm();
  const { setSortBy, setOwnerFilter, setStageFilter, setActivityWindow, setNewCompanyOpen } = useCrm();
  const rows = useVisibleCompanies();

  return (
    <PageToolbar
      activeFilters={Number(!!ownerFilter) + Number(!!stageFilter)}
      filters={
        <>
          <FilterChip label="Sort by" value={SORTS.find((s) => s.key === sortBy)!.label}>
            {SORTS.map((s) => (
              <MenuItem key={s.key} selected={s.key === sortBy} onSelect={() => setSortBy(s.key)}>
                {s.label}
              </MenuItem>
            ))}
          </FilterChip>

          <FilterChip label="Filter" value={ownerFilter ? ownerById(ownerFilter).name : "All Owners"}>
            <MenuItem selected={!ownerFilter} onSelect={() => setOwnerFilter(null)}>
              All Owners
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

          <FilterChip label="Stage" value={stageFilter ?? "Any"}>
            <MenuItem selected={!stageFilter} onSelect={() => setStageFilter(null)}>
              Any
            </MenuItem>
            <MenuSeparator />
            <MenuLabel>Segment</MenuLabel>
            {SEGMENTS.map((t: Tag) => (
              <MenuItem key={t} selected={stageFilter === t} onSelect={() => setStageFilter(t)}>
                {t}
              </MenuItem>
            ))}
            <MenuLabel>Stage</MenuLabel>
            {STAGES.map((t: Tag) => (
              <MenuItem key={t} selected={stageFilter === t} onSelect={() => setStageFilter(t)}>
                {t}
              </MenuItem>
            ))}
          </FilterChip>

          <FilterChip label="Last Activity" value={activityWindow}>
            {WINDOWS.map((w) => (
              <MenuItem key={w} selected={w === activityWindow} onSelect={() => setActivityWindow(w)}>
                {w}
              </MenuItem>
            ))}
          </FilterChip>
        </>
      }
      actions={
        <>
          <ExportButton onClick={() => exportCsv(rows)} />
          <PrimaryAction label="New Company" onClick={() => setNewCompanyOpen(true)} />
        </>
      }
    />
  );
}
