"use client";

import { useActivities, type ActivityRange } from "@/lib/activities-store";
import { KINDS } from "@/lib/activities";
import { OWNERS, ownerById } from "@/lib/data";
import { useCrm } from "@/lib/store";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";
import { KIND_ICON, useFeed } from "./shared";

const RANGES: { value: ActivityRange; label: string }[] = [
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 90 Days" },
];

export function ActivitiesToolbar() {
  const { kindFilter, ownerFilter, range, setKindFilter, setOwnerFilter, setRange, setLogOpen } = useActivities();
  const companies = useCrm((s) => s.companies);
  const feed = useFeed();

  const exportCsv = () =>
    downloadCsv(
      "activities.csv",
      ["When", "Type", "Title", "Details", "Company", "Owner"],
      feed.map((a) => [
        a.at.replace("T", " "),
        a.kind,
        a.title,
        a.body ?? "",
        companies.find((c) => c.id === a.companyId)?.name ?? a.companyId,
        ownerById(a.ownerId).name,
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!kindFilter) + Number(!!ownerFilter)}
      filters={
        <>
          <FilterChip label="Type" value={kindFilter ? KINDS.find((k) => k.id === kindFilter)!.plural : "All Types"}>
            <MenuItem selected={!kindFilter} onSelect={() => setKindFilter(null)}>
              All Types
            </MenuItem>
            <MenuSeparator />
            {KINDS.map((k) => {
              const Icon = KIND_ICON[k.id];
              return (
                <MenuItem key={k.id} selected={kindFilter === k.id} onSelect={() => setKindFilter(k.id)}>
                  <Icon className="size-[14px] text-fg-muted" strokeWidth={1.75} />
                  {k.plural}
                </MenuItem>
              );
            })}
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
          <FilterChip label="Range" value={RANGES.find((r) => r.value === range)!.label}>
            {RANGES.map((r) => (
              <MenuItem key={r.value} selected={r.value === range} onSelect={() => setRange(r.value)}>
                {r.label}
              </MenuItem>
            ))}
          </FilterChip>
        </>
      }
      actions={
        <>
          <ExportButton onClick={exportCsv} />
          <PrimaryAction label="Log Activity" onClick={() => setLogOpen(true)} />
        </>
      }
    />
  );
}
