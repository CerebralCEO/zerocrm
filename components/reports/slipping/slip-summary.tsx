"use client";

import { CalendarX2, History, Repeat2, TrendingDown } from "lucide-react";
import { useCrm } from "@/lib/store";
import { formatCompactCurrency } from "@/lib/utils";
import { KpiCell, KpiStrip } from "@/components/ui/kpi-strip";
import { useSlipsData } from "./use-slips-data";

export function SlipSummary() {
  const { slips, open } = useSlipsData();
  const companies = useCrm((s) => s.companies);
  const value = slips.reduce((n, s) => n + s.deal.value, 0);
  const openValue = open.reduce((n, d) => n + d.value, 0);
  const overdue = slips.filter((s) => s.overdue).length;
  const crossed = slips.filter((s) => s.crossed);
  const crossedValue = crossed.reduce((n, s) => n + s.deal.value, 0);
  const avg = slips.length ? Math.round(slips.reduce((n, s) => n + s.days, 0) / slips.length) : 0;
  const longest = slips.reduce<(typeof slips)[number] | null>((m, s) => (!m || s.days > m.days ? s : m), null);
  const repeat = slips.filter((s) => s.pushes.length > 1);

  return (
    <KpiStrip>
      <KpiCell
        icon={TrendingDown}
        label="Slipped pipeline"
        value={value}
        meta={
          <>
            <span className="text-fg-soft">{openValue ? Math.round((value / openValue) * 100) : 0}%</span> of open pipeline · {slips.length} deals
            {overdue > 0 && (
              <>
                {" "}
                · <span className="text-danger-dot">{overdue} overdue</span>
              </>
            )}
          </>
        }
      />
      <KpiCell
        icon={CalendarX2}
        label="Pushed out of quarter"
        value={crossedValue}
        meta={
          <>
            <span className={crossed.length ? "text-danger-dot" : "text-fg-soft"}>{crossed.length} deals</span> left their committed quarter
          </>
        }
      />
      <KpiCell
        icon={History}
        label="Average slip"
        value={avg}
        currency={false}
        suffix="d"
        meta={
          longest ? (
            <>
              Longest <span className="text-fg-soft">+{longest.days}d</span> · {companies.find((c) => c.id === longest.deal.companyId)?.name}
            </>
          ) : (
            "Nothing has slipped"
          )
        }
      />
      <KpiCell
        icon={Repeat2}
        label="Repeat slippers"
        value={repeat.length}
        currency={false}
        meta={
          <>
            <span className="text-fg-soft">{formatCompactCurrency(repeat.reduce((n, s) => n + s.deal.value, 0))}</span> pushed twice or more
          </>
        }
      />
    </KpiStrip>
  );
}
