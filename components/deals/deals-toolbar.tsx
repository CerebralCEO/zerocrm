"use client";

import { useMemo } from "react";
import { useDeals, inWindow, sortDeals, type CloseWindow, type DealSort } from "@/lib/deals-store";
import { stageById } from "@/lib/deals";
import { OWNERS, ownerById } from "@/lib/data";
import { useCrm } from "@/lib/store";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";

const SORTS: { key: DealSort; label: string }[] = [
  { key: "value", label: "Deal Value" },
  { key: "closeDate", label: "Close Date" },
  { key: "probability", label: "Win Probability" },
  { key: "recent", label: "Recent Activity" },
];

const WINDOWS: { key: CloseWindow; label: string }[] = [
  { key: "all", label: "All Dates" },
  { key: "month", label: "This Month" },
  { key: "30d", label: "Next 30 Days" },
  { key: "90d", label: "Next 90 Days" },
  { key: "overdue", label: "Overdue" },
];

/** Deals after the owner / close-date filters and the chosen in-column sort. */
export function useVisibleDeals() {
  const deals = useDeals((s) => s.deals);
  const ownerFilter = useDeals((s) => s.ownerFilter);
  const closeWindow = useDeals((s) => s.closeWindow);
  const sortBy = useDeals((s) => s.sortBy);
  return useMemo(
    () => sortDeals(deals.filter((d) => (!ownerFilter || d.ownerId === ownerFilter) && inWindow(d, closeWindow)), sortBy),
    [deals, ownerFilter, closeWindow, sortBy],
  );
}

export function DealsToolbar() {
  const { sortBy, ownerFilter, closeWindow, setSortBy, setOwnerFilter, setCloseWindow, openNewDeal } = useDeals();
  const companies = useCrm((s) => s.companies);
  const deals = useVisibleDeals();

  const exportCsv = () =>
    downloadCsv(
      "deals.csv",
      ["Deal", "Company", "Stage", "Owner", "Value", "Win Probability", "Close Date", "Next Step"],
      deals.map((d) => [
        d.title,
        companies.find((c) => c.id === d.companyId)?.name ?? d.companyId,
        stageById(d.stage).label,
        ownerById(d.ownerId).name,
        d.value,
        `${d.probability}%`,
        d.closeDate,
        d.nextStep,
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!ownerFilter) + Number(closeWindow !== "all")}
      filters={
        <>
          <FilterChip label="Sort by" value={SORTS.find((s) => s.key === sortBy)!.label}>
            {SORTS.map((s) => (
              <MenuItem key={s.key} selected={s.key === sortBy} onSelect={() => setSortBy(s.key)}>
                {s.label}
              </MenuItem>
            ))}
          </FilterChip>

          <FilterChip label="Owner" value={ownerFilter ? ownerById(ownerFilter).name : "All Owners"}>
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

          <FilterChip label="Close Date" value={WINDOWS.find((w) => w.key === closeWindow)!.label}>
            {WINDOWS.map((w) => (
              <MenuItem key={w.key} selected={w.key === closeWindow} onSelect={() => setCloseWindow(w.key)}>
                {w.label}
              </MenuItem>
            ))}
          </FilterChip>
        </>
      }
      actions={
        <>
          <ExportButton onClick={exportCsv} />
          <PrimaryAction label="New Deal" onClick={() => openNewDeal()} />
        </>
      }
    />
  );
}
