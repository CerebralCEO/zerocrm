"use client";

import { useSlips } from "@/lib/slips-store";
import { SLIP_WINDOWS } from "@/lib/slips";
import { OWNERS, ownerById } from "@/lib/data";
import { stageById } from "@/lib/deals";
import { useCrm } from "@/lib/store";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";
import { useSlipsData } from "./use-slips-data";

export function SlipToolbar() {
  const { window, ownerFilter, setWindow, setOwnerFilter, setReviewOpen } = useSlips();
  const companies = useCrm((s) => s.companies);
  const { slips } = useSlipsData();

  const exportCsv = () =>
    downloadCsv(
      "slipping-deals.csv",
      [
        "Deal",
        "Company",
        "Owner",
        "Stage",
        "Value",
        "Original close",
        "Current close",
        "Days slipped",
        "Pushes",
        "Last reason",
        "Overdue",
        "Left quarter",
      ],
      slips.map((s) => [
        s.deal.title,
        companies.find((c) => c.id === s.deal.companyId)?.name ?? s.deal.companyId,
        ownerById(s.deal.ownerId).name,
        stageById(s.deal.stage).label,
        s.deal.value,
        s.original,
        s.deal.closeDate,
        s.days,
        s.pushes.length,
        s.lastReason ?? "",
        s.overdue ? "Yes" : "No",
        s.crossed ? `${s.fromQuarter.label} → ${s.toQuarter.label}` : "No",
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!ownerFilter) + Number(window !== "all")}
      filters={
        <>
          <FilterChip label="Show" value={SLIP_WINDOWS.find((w) => w.id === window)!.label}>
            {SLIP_WINDOWS.map((w) => (
              <MenuItem key={w.id} selected={w.id === window} onSelect={() => setWindow(w.id)}>
                {w.label}
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
          <PrimaryAction label="Start Review" onClick={() => setReviewOpen(true)} />
        </>
      }
    />
  );
}
