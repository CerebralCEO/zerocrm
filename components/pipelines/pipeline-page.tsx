"use client";

import { useEffect } from "react";
import { Gauge, Layers, Scale, Trophy } from "lucide-react";
import { OWNERS, ownerById } from "@/lib/data";
import { stageById } from "@/lib/deals";
import { useDeals } from "@/lib/deals-store";
import { CLOSE_WINDOWS, PIPELINES, siteOf, type PipelineId } from "@/lib/pipelines";
import { usePipelines } from "@/lib/pipelines-store";
import { useCrm } from "@/lib/store";
import { formatCompactCurrency } from "@/lib/utils";
import { MenuItem, MenuSeparator } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { Avatar } from "@/components/primitives/avatar";
import { TerritoryMap } from "./territory-map";
import { StageFunnel } from "./stage-funnel";
import { CloseTimeline, OwnerMix } from "./pipeline-panels";
import { PipelineDeals } from "./pipeline-deals";
import { usePipelineData } from "./use-pipeline-data";

/** One template for every regional pipeline: toolbar → KPIs → territory map → funnel → timeline + owners → deals. */
export function PipelinePage({ id }: { id: PipelineId }) {
  const pipeline = PIPELINES[id];
  const v = usePipelineData(id);
  const { window, ownerFilter, setWindow, setOwnerFilter, resetFocus } = usePipelines();
  const openNewDeal = useDeals((s) => s.openNewDeal);
  const companies = useCrm((s) => s.companies);

  // Stage / city focus belongs to one pipeline — clear it when switching.
  useEffect(() => resetFocus(), [id, resetFocus]);

  const key = `${id}-${window}-${ownerFilter ?? "all"}`;
  const exportCsv = () =>
    downloadCsv(
      `${pipeline.name.toLowerCase().replace(/\s+/g, "-")}-pipeline.csv`,
      ["Deal", "Company", "City", "Country", "Stage", "Owner", "Value", "Win Probability", "Close Date"],
      v.deals.map((d) => [
        d.title,
        companies.find((c) => c.id === d.companyId)?.name ?? d.companyId,
        siteOf(d).city,
        siteOf(d).country,
        stageById(d.stage).label,
        ownerById(d.ownerId).name,
        d.value,
        `${d.probability}%`,
        d.closeDate,
      ]),
    );

  return (
    <>
      <PageToolbar
        activeFilters={Number(!!ownerFilter) + Number(window !== "all")}
        filters={
          <>
            <FilterChip label="Closing" value={CLOSE_WINDOWS.find((w) => w.id === window)!.label}>
              {CLOSE_WINDOWS.map((w) => (
                <MenuItem key={w.id} selected={w.id === window} onSelect={() => setWindow(w.id)}>
                  {w.label}
                  {w.period && <span className="text-fg-muted">{w.period.range}</span>}
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
            <PrimaryAction label="New Deal" onClick={() => openNewDeal("discovery", undefined, pipeline.hq)} />
          </>
        }
      />
      <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
        <KpiStrip>
          <KpiCell
            icon={Layers}
            label="Open pipeline"
            value={v.openValue}
            meta={
              <>
                <span className="text-fg-soft">{Math.round(v.share * 100)}%</span> of company pipeline · {v.open.length} deals
              </>
            }
          />
          <KpiCell
            icon={Scale}
            label="Weighted"
            value={v.weighted}
            meta={
              <>
                <span className="text-fg-soft">{v.avgWin}%</span> value-weighted win probability
              </>
            }
          />
          <KpiCell
            icon={Trophy}
            label="Closed won"
            value={v.wonValue}
            meta={
              <>
                <span className={v.won.length ? "text-meter-green" : "text-fg-soft"}>{v.won.length} deals</span> won in this view
              </>
            }
          />
          <KpiCell
            icon={Gauge}
            label="Pipeline velocity"
            value={v.velocity}
            suffix="/day"
            meta={
              <>
                Weighted ÷ <span className="text-fg-soft">{v.avgDays} days</span> avg to close · {formatCompactCurrency(v.velocity * 30)}/mo
              </>
            }
          />
        </KpiStrip>
        <div className="border-b border-line">
          <TerritoryMap key={key} pipeline={pipeline} v={v} />
        </div>
        <div className="border-b border-line">
          <StageFunnel key={key} v={v} />
        </div>
        <div className="grid border-b border-line lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="min-w-0 border-line lg:border-r">
            <CloseTimeline key={key} v={v} />
          </div>
          <div className="min-w-0 border-line max-lg:border-t">
            <OwnerMix key={key} pipeline={pipeline} v={v} />
          </div>
        </div>
        <PipelineDeals pipeline={pipeline} v={v} />
      </div>
    </>
  );
}
