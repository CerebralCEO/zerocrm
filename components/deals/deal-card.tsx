"use client";

import { Calendar, Ellipsis } from "lucide-react";
import { useCrm } from "@/lib/store";
import { useDeals, isOverdue } from "@/lib/deals-store";
import { STAGES, type Deal } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { cn, formatNumber, formatShortDate } from "@/lib/utils";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";

/** Keeps pointer/keyboard events on the menu button from starting a drag. */
const stop = (e: React.SyntheticEvent) => e.stopPropagation();

function CardMenu({ deal }: { deal: Deal }) {
  const openDeal = useDeals((s) => s.openDeal);
  const moveDeal = useDeals((s) => s.moveDeal);
  const openCompany = useCrm((s) => s.openDetail);
  const next = STAGES[STAGES.findIndex((s) => s.id === deal.stage) + 1];

  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          aria-label={`Actions for ${deal.title}`}
          onClick={stop}
          onMouseDown={stop}
          onTouchStart={stop}
          onKeyDown={stop}
          className="-my-1 -mr-1 flex h-6 w-7 shrink-0 items-center justify-center rounded-md text-[#c0c2c5] outline-none transition-[opacity,background-color] hover:bg-white/[0.06] hover:text-fg data-[state=open]:bg-white/[0.06] data-[state=open]:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        >
          <Ellipsis className="size-[12px]" strokeWidth={2} />
        </button>
      </MenuTrigger>
      <MenuContent align="end" onClick={stop}>
        <MenuItem onSelect={() => openDeal(deal.id)}>Open deal</MenuItem>
        <MenuItem onSelect={() => openCompany(deal.companyId)}>View company</MenuItem>
        {next && (
          <>
            <MenuSeparator />
            <MenuItem onSelect={() => moveDeal(deal.id, next.id)}>Move to {next.label}</MenuItem>
            {next.id !== "won" && <MenuItem onSelect={() => moveDeal(deal.id, "won")}>Mark as won</MenuItem>}
          </>
        )}
      </MenuContent>
    </Menu>
  );
}

/**
 * Presentational deal card ({components.deal-card}). The board wraps it with
 * drag handlers; the drag overlay renders it with `lifted`.
 */
export function DealCard({
  deal,
  lifted,
  dimmed,
  className,
  ...rest
}: { deal: Deal; lifted?: boolean; dimmed?: boolean } & React.ComponentProps<"article">) {
  const company = useCrm((s) => s.companies.find((c) => c.id === deal.companyId));
  const justMoved = useDeals((s) => s.lastMovedId === deal.id);
  const owner = ownerById(deal.ownerId);
  const overdue = isOverdue(deal);

  return (
    <article
      {...rest}
      className={cn(
        "group relative rounded-lg border border-line-card bg-card p-3 text-left outline-none select-none [-webkit-touch-callout:none]",
        "transition-[border-color,background-color,opacity] duration-200 hover:border-[#3a3c3f] focus-visible:border-[#55585c]",
        lifted && "animate-lift cursor-grabbing border-[#3a3c3f]",
        dimmed && "opacity-40",
        justMoved && !lifted && !dimmed && "animate-card-wash",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <CompanyLogo id={deal.companyId} src={company?.logo} size={20} glyph={11} radius={5} />
        <span className="min-w-0 flex-1 truncate text-[14px] leading-none font-medium text-fg">
          {company?.name ?? deal.companyId}
        </span>
        {!lifted && <CardMenu deal={deal} />}
      </div>

      <p className="mt-2 truncate text-[12px] leading-none text-fg-soft/80">{deal.title}</p>

      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
          <span className="mr-[5px] text-[#7f7f7f]">$</span>
          {formatNumber(deal.value)}
        </span>
        <span className="flex items-center gap-[10px]">
          <SegmentedMeter value={deal.probability} />
          <span className="w-[29px] text-right text-[14px] leading-none font-[450] text-fg tabular-nums">
            {deal.probability}%
          </span>
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line-card pt-[10px] text-[12px] leading-none">
        <span className="flex min-w-0 items-center gap-[6px] text-fg-soft">
          <Avatar name={owner.name} size={18} />
          <span className="truncate">{owner.name}</span>
        </span>
        <span className={cn("flex shrink-0 items-center gap-[5px]", overdue ? "text-danger-dot" : "text-fg-muted")}>
          <Calendar className="size-[12px]" strokeWidth={1.75} />
          {overdue ? `Overdue · ${formatShortDate(deal.closeDate)}` : formatShortDate(deal.closeDate)}
        </span>
      </div>
    </article>
  );
}
