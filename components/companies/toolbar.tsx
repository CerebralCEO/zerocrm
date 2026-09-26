"use client";

import { ChevronDown, ListFilter, Plus, Upload } from "lucide-react";
import { Popover } from "radix-ui";
import { useCrm, type ActivityWindow, type SortKey } from "@/lib/store";
import { OWNERS, STAGES, SEGMENTS, ownerById, type Tag } from "@/lib/data";
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
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

function FilterChip({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          className="group flex h-[30px] shrink-0 items-center rounded-full border whitespace-nowrap border-white/[0.09] bg-[#1b1b1b] text-[12px] leading-none outline-none transition-colors hover:border-white/[0.14] data-[state=open]:border-white/[0.16] focus-visible:ring-2 focus-visible:ring-white/10"
        >
          <span className="flex h-full items-center border-r border-white/[0.09] pr-[9px] pl-[8px] text-fg-muted">{label}</span>
          <span className="flex h-full items-center gap-[5px] pr-[9px] pl-[9px] font-medium text-fg">
            {value}
            <ChevronDown className="size-[12px] text-fg-soft transition-transform group-data-[state=open]:rotate-180" strokeWidth={2} />
          </span>
        </button>
      </MenuTrigger>
      <MenuContent>{children}</MenuContent>
    </Menu>
  );
}

function exportCsv(rows: ReturnType<typeof useVisibleCompanies>) {
  const header = ["Company", "Tags", "Owner", "Open Deals", "Pipeline Value", "Win Probability", "Last Interaction", "Type"];
  const lines = rows.map((c) =>
    [
      c.name,
      c.tags.join(" / "),
      ownerById(c.ownerId).name,
      c.openDeals,
      c.pipelineValue,
      `${c.winProbability}%`,
      c.lastInteraction.date,
      c.lastInteraction.type,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "companies.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function Toolbar() {
  const { sortBy, ownerFilter, stageFilter, activityWindow } = useCrm();
  const { setSortBy, setOwnerFilter, setStageFilter, setActivityWindow, setNewCompanyOpen } = useCrm();
  const rows = useVisibleCompanies();
  const activeFilters = Number(!!ownerFilter) + Number(!!stageFilter);

  const filters = (
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
  );

  return (
    <div className="flex h-[62px] shrink-0 items-center justify-between gap-3 border-b border-line px-4 md:gap-4">
      {/* Phone: the four chips collapse into one "Filters" popover */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex h-[30px] shrink-0 items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[10px] pl-[9px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323] data-[state=open]:bg-[#232323] md:hidden"
          >
            <ListFilter className="size-[13px]" strokeWidth={2} />
            Filters
            {activeFilters > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className="z-50 flex w-[min(300px,calc(100vw-24px))] origin-(--radix-popover-content-transform-origin) flex-col items-start gap-2 rounded-xl border border-line-strong bg-panel p-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in md:hidden"
          >
            {filters}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <div className="hidden min-w-0 items-center gap-2 overflow-x-auto md:flex">{filters}</div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => exportCsv(rows)}
          className="flex h-[30px] items-center gap-[5px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[9px] pl-[8px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
        >
          <Upload className="size-[12px]" strokeWidth={2} />
          Export
        </button>
        <button
          type="button"
          onClick={() => setNewCompanyOpen(true)}
          className="flex h-[30px] items-center gap-[5px] rounded-full border border-primary-border/60 bg-gradient-to-b from-[#4a2ffc] to-[#3a1fe6] pr-[8px] pl-[9px] text-[12px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-[filter] hover:brightness-110"
        >
          <Plus className="size-[12px]" strokeWidth={1.75} />
          New Company
        </button>
      </div>
    </div>
  );
}
