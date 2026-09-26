"use client";

import { useQ1 } from "@/lib/q1-store";
import { SCENARIOS, type ScenarioId } from "@/lib/q1";
import { OWNERS, ownerById } from "@/lib/data";
import { stageById } from "@/lib/deals";
import { useDeals } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { Avatar } from "@/components/primitives/avatar";
import { useQ1Plan } from "./use-q1-data";

export function Q1Toolbar() {
  const { preset, ownerFilter, setPreset, setOwnerFilter } = useQ1();
  const openNewDeal = useDeals((s) => s.openNewDeal);
  const companies = useCrm((s) => s.companies);
  const plan = useQ1Plan();

  const exportCsv = () =>
    downloadCsv(
      "q1-fy28-plan.csv",
      ["Deal", "Company", "Stage", "Owner", "Value", "Win Probability", "Weighted", "Close Date"],
      plan.deals.map((d) => [
        d.title,
        companies.find((c) => c.id === d.companyId)?.name ?? d.companyId,
        stageById(d.stage).label,
        ownerById(d.ownerId).name,
        d.value,
        `${d.probability}%`,
        Math.round((d.value * d.probability) / 100),
        d.closeDate,
      ]),
    );

  return (
    <PageToolbar
      activeFilters={Number(!!ownerFilter) + Number(preset !== "base")}
      filters={
        <>
          <FilterChip label="Scenario" value={preset === "custom" ? "Custom" : SCENARIOS[preset].label}>
            {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
              <MenuItem key={id} selected={preset === id} onSelect={() => setPreset(id)}>
                {SCENARIOS[id].label}
                <span className="text-fg-muted">{SCENARIOS[id].winRate}% win</span>
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
          <PrimaryAction label="Add Q1 Deal" onClick={() => openNewDeal("discovery", "2027-03-15")} />
        </>
      }
    />
  );
}
