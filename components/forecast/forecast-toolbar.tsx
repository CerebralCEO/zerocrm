"use client";

import { useForecast } from "@/lib/forecast-store";
import { PERIODS, categoryOf, periodById } from "@/lib/forecast";
import { OWNERS, ownerById } from "@/lib/data";
import { stageById } from "@/lib/deals";
import { useCrm } from "@/lib/store";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";
import { useForecastData } from "./use-forecast-data";

const CATEGORY_LABEL = { closed: "Closed won", commit: "Commit", best: "Best case", pipeline: "Pipeline" } as const;

export function ForecastToolbar() {
  const { period, ownerFilter, call, setPeriod, setOwnerFilter, setSubmitOpen } = useForecast();
  const companies = useCrm((s) => s.companies);
  const f = useForecastData();
  const p = periodById(period);

  const exportCsv = () =>
    downloadCsv(
      `forecast-${p.label.replace(/\s+/g, "-").toLowerCase()}.csv`,
      ["Deal", "Company", "Category", "Stage", "Owner", "Value", "Win Probability", "Close Date"],
      f.deals.map((d) => [
        d.title,
        companies.find((c) => c.id === d.companyId)?.name ?? d.companyId,
        CATEGORY_LABEL[categoryOf(d)],
        stageById(d.stage).label,
        ownerById(d.ownerId).name,
        d.value,
        `${d.probability}%`,
        d.closeDate,
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!ownerFilter)}
      filters={
        <>
          <FilterChip label="Period" value={`${p.label} · ${p.range}`}>
            {PERIODS.map((x) => (
              <MenuItem key={x.id} selected={x.id === period} onSelect={() => setPeriod(x.id)}>
                {x.label}
                <span className="text-fg-muted">{x.range}</span>
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
          <PrimaryAction label={call[period] ? "Update Forecast" : "Submit Forecast"} onClick={() => setSubmitOpen(true)} />
        </>
      }
    />
  );
}
