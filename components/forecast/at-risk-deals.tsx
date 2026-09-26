"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import type { Forecast, RiskReason } from "@/lib/forecast";
import { stageById } from "@/lib/deals";
import { useDeals } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { cn, formatNumber, formatShortDate } from "@/lib/utils";
import { Tag } from "@/components/primitives/tag";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Panel } from "./panel";

const REASON_TONE: Record<RiskReason, "red" | "orange" | "yellow"> = {
  Overdue: "red",
  "Low confidence": "orange",
  "Closing soon": "yellow",
};

/** Open deals that could move the number — overdue, low-confidence or closing soon. */
export function AtRiskDeals({ f }: { f: Forecast }) {
  const openDeal = useDeals((s) => s.openDeal);
  const companies = useCrm((s) => s.companies);
  const exposure = f.atRisk.reduce((s, r) => s + r.deal.value, 0);

  return (
    <Panel
      title="Deals at risk"
      subtitle={
        f.atRisk.length ? (
          <>
            {f.atRisk.length} deals · <span className="text-fg-soft tabular-nums">${formatNumber(exposure)}</span> could move the number
          </>
        ) : (
          "Nothing at risk this period"
        )
      }
      aside={
        <Link
          href="/deals"
          className="flex h-[30px] items-center gap-[5px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[8px] pl-[10px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
        >
          Open board
          <ArrowUpRight className="size-[12px]" strokeWidth={2} />
        </Link>
      }
    >
      <div className="mt-3 flex flex-col">
        {f.atRisk.map(({ deal, reason }) => {
          const company = companies.find((c) => c.id === deal.companyId);
          const stage = stageById(deal.stage);
          return (
            <button
              key={deal.id}
              type="button"
              onClick={() => openDeal(deal.id)}
              className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left text-[14px] leading-none font-[450] text-fg transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover"
            >
              <span className="flex w-[150px] shrink-0 items-center gap-2 max-sm:w-auto max-sm:flex-1">
                <CompanyLogo id={deal.companyId} src={company?.logo} size={20} glyph={11} radius={5} />
                <span className="truncate font-medium">{company?.name}</span>
              </span>
              <span className="hidden min-w-0 flex-1 truncate text-[12px] text-fg-soft/80 sm:block">{deal.title}</span>
              <span className="hidden w-[104px] shrink-0 lg:block">
                <Tag tone={stage.tone}>{stage.label}</Tag>
              </span>
              <span className="w-[118px] shrink-0 max-sm:w-auto">
                <Tag tone={REASON_TONE[reason]}>{reason}</Tag>
              </span>
              <span className="hidden w-[96px] shrink-0 text-right tabular-nums md:block">
                <span className="mr-[4px] text-[#7f7f7f]">$</span>
                {formatNumber(deal.value)}
              </span>
              <span className="hidden shrink-0 items-center gap-[10px] md:flex">
                <SegmentedMeter value={deal.probability} />
                <span className="w-[29px] text-right tabular-nums">{deal.probability}%</span>
              </span>
              <span
                className={cn(
                  "hidden w-[74px] shrink-0 items-center justify-end gap-[5px] text-[12px] xl:flex",
                  reason === "Overdue" ? "text-danger-dot" : "text-fg-muted",
                )}
              >
                <Calendar className="size-[12px]" strokeWidth={1.75} />
                {formatShortDate(deal.closeDate)}
              </span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}
