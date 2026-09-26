"use client";

import { useEffect, useState } from "react";
import { Calendar, Ellipsis, Plus } from "lucide-react";
import { useCrm } from "@/lib/store";
import { ownerById, type Company } from "@/lib/data";
import { cn, formatCurrency, formatNumber, formatShortDate } from "@/lib/utils";
import { Checkbox } from "@/components/primitives/checkbox";
import { TagGroup } from "@/components/primitives/tag";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { useVisibleCompanies } from "./use-visible-companies";
import { useDragScroll } from "./use-drag-scroll";

/*
 * Column widths measured from the 1920px reference (content area = 1666px).
 * The fr values equal the px widths, so at 1920px every column lands exactly;
 * minmax(0, …) keeps every row on the same track sizes regardless of content.
 */
const GRID = [48, "180fr", "274fr", "170fr", "100fr", "165fr", "206fr", "248fr", "211fr", 64]
  .map((c) => (typeof c === "number" ? `${c}px` : `minmax(0,${c})`))
  .join(" ");

function HeaderCell({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center text-[12px] leading-none text-fg-muted", className)}>{children}</div>;
}

function RowActions({ company }: { company: Company }) {
  const openDetail = useCrm((s) => s.openDetail);
  const toggleSelected = useCrm((s) => s.toggleSelected);
  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${company.name}`}
          onClick={(e) => e.stopPropagation()}
          className="flex h-6 w-7 items-center justify-center rounded-md text-[#c0c2c5] outline-none transition-colors hover:bg-white/[0.06] hover:text-fg data-[state=open]:bg-white/[0.06]"
        >
          <Ellipsis className="size-[12px]" strokeWidth={2} />
        </button>
      </MenuTrigger>
      <MenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <MenuItem onSelect={() => openDetail(company.id)}>Open details</MenuItem>
        <MenuItem onSelect={() => toggleSelected(company.id)}>Toggle selection</MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={() => navigator.clipboard?.writeText(company.name)}>Copy name</MenuItem>
      </MenuContent>
    </Menu>
  );
}

function CompanyRow({ company }: { company: Company }) {
  const selected = useCrm((s) => s.selected.has(company.id));
  const isNew = useCrm((s) => s.lastAddedId === company.id);
  const toggleSelected = useCrm((s) => s.toggleSelected);
  const openDetail = useCrm((s) => s.openDetail);
  const owner = ownerById(company.ownerId);

  return (
    <div
      role="row"
      data-company-id={company.id}
      tabIndex={0}
      onClick={() => openDetail(company.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter") openDetail(company.id);
        if (e.key === " ") {
          e.preventDefault();
          toggleSelected(company.id);
        }
      }}
      className={cn(
        "grid h-[43px] cursor-pointer items-center border-b border-line text-[14px] leading-none font-[450] text-fg outline-none transition-colors focus-visible:bg-row-hover",
        selected ? "bg-row-selected" : "hover:bg-row-hover active:bg-row-hover",
        isNew && "animate-row-in",
      )}
      style={{ gridTemplateColumns: GRID }}
    >
      <div className="flex h-full items-center pl-[13px]">
        <Checkbox checked={selected} onChange={() => toggleSelected(company.id)} label={`Select ${company.name}`} />
      </div>
      <div className="flex h-full min-w-0 items-center pr-4">
        <span className="truncate">{company.name}</span>
      </div>
      <TagGroup tags={company.tags} className="min-w-0 overflow-hidden pr-4" />
      <div className="flex min-w-0 items-center gap-[5px] pr-4">
        <Avatar name={owner.name} size={20} />
        <span className="truncate">{owner.name}</span>
      </div>
      <div className="text-right tabular-nums">{company.openDeals}</div>
      <div className="text-right tabular-nums">
        <span className="mr-[5px] text-[#7f7f7f]">$</span>
        {formatNumber(company.pipelineValue)}
      </div>
      <div className="flex items-center justify-end gap-[17px]">
        <SegmentedMeter value={company.winProbability} />
        <span className="w-[29px] text-right tabular-nums">{company.winProbability}%</span>
      </div>
      <div className="pl-[89px]">
        <Sparkline data={company.activity} />
      </div>
      <div className="flex items-center">
        <Calendar className="mr-[4px] size-[14px] shrink-0" strokeWidth={1.75} />
        <span className="whitespace-nowrap">{formatShortDate(company.lastInteraction.date)}</span>
        <span className="mx-2 h-2 w-px shrink-0 bg-line-strong" />
        <span className="truncate">{company.lastInteraction.type}</span>
      </div>
      <div className="flex justify-end pr-[16px]">
        <RowActions company={company} />
      </div>
    </div>
  );
}

function FooterCell({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex h-full items-center gap-[9px] border-r border-line px-[13px] pb-[3px] text-left text-[12px] leading-none text-[#7c7f7f] last:border-r-0",
        onClick && "transition-colors hover:bg-white/[0.02] hover:text-fg-soft",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function CompaniesTable() {
  const rows = useVisibleCompanies();
  const selectedCount = useCrm((s) => rows.filter((r) => s.selected.has(r.id)).length);
  const setAllSelected = useCrm((s) => s.setAllSelected);
  const [showSum, setShowSum] = useState(false);
  const [showAvg, setShowAvg] = useState(false);
  const scrollRef = useDragScroll<HTMLDivElement>();
  const lastAddedId = useCrm((s) => s.lastAddedId);

  // Glide a freshly created company into view.
  useEffect(() => {
    if (!lastAddedId) return;
    const row = scrollRef.current?.querySelector(`[data-company-id="${lastAddedId}"]`);
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [lastAddedId, scrollRef]);

  const total = rows.reduce((sum, c) => sum + c.pipelineValue, 0);
  const avg = rows.length ? Math.round(rows.reduce((s, c) => s + c.winProbability, 0) / rows.length) : 0;
  const allSelected = rows.length > 0 && selectedCount === rows.length;

  return (
    <div role="table" aria-label="Companies" className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="table-scroll min-h-0 flex-1 overflow-auto">
      {/* Measured grid; scrolls horizontally below ~1650px (phones included) */}
      <div className="min-w-[1400px]">
      <div
        role="row"
        className="sticky top-0 z-10 grid h-10 items-center border-b border-line bg-app"
        style={{ gridTemplateColumns: GRID }}
      >
        <div className="flex h-full items-center pl-[13px]">
          <Checkbox
            checked={allSelected}
            indeterminate={selectedCount > 0 && !allSelected}
            onChange={() => setAllSelected(rows.map((r) => r.id), selectedCount === 0)}
            label="Select all companies"
          />
        </div>
        <HeaderCell>Companies</HeaderCell>
        <HeaderCell>Segment &amp; Stage</HeaderCell>
        <HeaderCell>Account Owner</HeaderCell>
        <HeaderCell className="justify-end">Open Deals</HeaderCell>
        <HeaderCell className="justify-end">Pipeline Value</HeaderCell>
        <HeaderCell className="justify-end">Win Probability</HeaderCell>
        <HeaderCell className="pl-[86px]">Activity Trend</HeaderCell>
        <HeaderCell>Last Interaction</HeaderCell>
        <HeaderCell className="justify-end pr-[13px]">Action</HeaderCell>
      </div>

      {rows.map((c) => (
        <CompanyRow key={c.id} company={c} />
      ))}
      {rows.length === 0 && (
        <div className="py-16 text-center text-[13px] text-fg-muted">No companies match these filters.</div>
      )}
      </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 border-t border-line pb-[env(safe-area-inset-bottom)] md:h-[39px] md:grid-cols-4 max-md:[&>*]:h-[39px] max-md:[&>*:nth-child(-n+2)]:border-b max-md:[&>*:nth-child(2n)]:border-r-0">
        <FooterCell className="gap-[7px]">
          <span className="font-medium text-fg">{rows.length}</span>
          <span>Companies in view</span>
        </FooterCell>
        <FooterCell onClick={() => setShowSum((v) => !v)}>
          <Plus className="size-[10px] text-fg-muted" strokeWidth={2} />
          Sum of pipeline
          {showSum && <span className="ml-auto font-medium text-fg tabular-nums">{formatCurrency(total)}</span>}
        </FooterCell>
        <FooterCell onClick={() => setShowAvg((v) => !v)}>
          <Plus className="size-[10px] text-fg-muted" strokeWidth={2} />
          Avg win probality
          {showAvg && <span className="ml-auto font-medium text-fg tabular-nums">{avg}%</span>}
        </FooterCell>
        <FooterCell onClick={() => {}}>
          <Plus className="size-[10px] text-fg-muted" strokeWidth={2} />
          Add Calculation
        </FooterCell>
      </div>
    </div>
  );
}
