"use client";

import { useState } from "react";
import { ArrowRight, CalendarCheck, CalendarPlus, CalendarRange, CircleCheck, Trophy } from "lucide-react";
import { TODAY, useDeals } from "@/lib/deals-store";
import { stageById } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { SLIP_REASONS, addDays, quarterAfter, type Slip, type SlipReason } from "@/lib/slips";
import { useSlips } from "@/lib/slips-store";
import { useCrm } from "@/lib/store";
import { cn, formatCompactCurrency, formatNumber, formatShortDate } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input } from "@/components/ui/form";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag } from "@/components/primitives/tag";
import { useSlipsData } from "./use-slips-data";

type Outcome = "recommit" | "won" | "kept";

/**
 * Deal-by-deal slip review: each slipped deal gets a date the rep believes in
 * (or is marked won). Cards slide in like a deck; the queue is fixed when the
 * review opens so recommitted deals don't reshuffle it.
 */
function ReviewDeck({ initial, onDone }: { initial: Slip[]; onDone: () => void }) {
  const [queue] = useState(() => initial.map((s) => s.deal.id));
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<Record<string, { kind: Outcome; value: number }>>({});
  const { slips } = useSlipsData();
  const deals = useDeals((s) => s.deals);
  const moveDeal = useDeals((s) => s.moveDeal);
  const recommit = useSlips((s) => s.recommit);
  const companies = useCrm((s) => s.companies);

  const id = queue[index];
  const deal = deals.find((d) => d.id === id);
  const slip = slips.find((s) => s.deal.id === id) ?? initial.find((s) => s.deal.id === id);
  const [reason, setReason] = useState<SlipReason>(slip?.lastReason ?? "Procurement");
  const [custom, setCustom] = useState("");

  const next = (kind: Outcome) => {
    if (deal) setOutcomes((o) => ({ ...o, [deal.id]: { kind, value: deal.value } }));
    const n = index + 1;
    setIndex(n);
    const upcoming = initial.find((s) => s.deal.id === queue[n]);
    setReason(upcoming?.lastReason ?? "Procurement");
    setCustom("");
  };

  if (index >= queue.length || !deal || !slip) {
    const list = Object.values(outcomes);
    const sum = (k: Outcome) => list.filter((o) => o.kind === k);
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col items-center px-6 pt-8 pb-6 text-center animate-pop-in">
          <CircleCheck className="size-9 text-active animate-check-pop" strokeWidth={1.5} />
          <h3 className="mt-4 text-[16px] font-semibold leading-none text-fg">Review complete</h3>
          <p className="mt-[9px] text-[12px] leading-none text-fg-muted">
            {queue.length} {queue.length === 1 ? "deal" : "deals"} reviewed
          </p>
          <dl className="mt-6 grid w-full grid-cols-3 gap-2">
            {(
              [
                ["Recommitted", sum("recommit")],
                ["Marked won", sum("won")],
                ["Kept date", sum("kept")],
              ] as const
            ).map(([label, rows]) => (
              <div
                key={label}
                className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px] text-left"
              >
                <dt className="text-[12px] leading-none text-fg-soft/80">{label}</dt>
                <dd className="text-[14px] font-medium leading-none text-fg tabular-nums">
                  {rows.length}{" "}
                  <span className="text-[12px] font-normal text-fg-muted">{formatCompactCurrency(rows.reduce((n, o) => n + o.value, 0))}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="h-px shrink-0 bg-line-strong" />
        <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
          <Button variant="primary" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  const company = companies.find((c) => c.id === deal.companyId);
  const stage = stageById(deal.stage);
  const from = deal.closeDate > TODAY ? deal.closeDate : TODAY;
  const twoWeeks = addDays(from, 14);
  const nextQuarter = addDays(quarterAfter(from), 14);
  const chain = [slip.original, ...slip.pushes.map((p) => p.to)];

  const actions: {
    key: string;
    icon: typeof CalendarCheck;
    label: string;
    sub: string;
    disabled?: boolean;
    run: () => void;
  }[] = [
    {
      key: "keep",
      icon: CalendarCheck,
      label: "Keep date",
      sub: slip.overdue ? "Needs a new date" : formatShortDate(deal.closeDate),
      disabled: slip.overdue,
      run: () => next("kept"),
    },
    {
      key: "push",
      icon: CalendarPlus,
      label: "Push 2 weeks",
      sub: formatShortDate(twoWeeks),
      run: () => {
        recommit(deal.id, twoWeeks, reason);
        next("recommit");
      },
    },
    {
      key: "quarter",
      icon: CalendarRange,
      label: "Next quarter",
      sub: formatShortDate(nextQuarter),
      run: () => {
        recommit(deal.id, nextQuarter, reason);
        next("recommit");
      },
    },
    {
      key: "won",
      icon: Trophy,
      label: "Mark won",
      sub: "Closed Won",
      run: () => {
        moveDeal(deal.id, "won");
        next("won");
      },
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        {/* Progress */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] leading-none text-fg-muted tabular-nums">
            Deal <span className="text-fg">{index + 1}</span> of {queue.length}
          </span>
          <span className="flex gap-[3px]">
            {queue.map((q, i) => (
              <span
                key={q}
                className={cn(
                  "h-[4px] w-[10px] rounded-full transition-colors duration-300",
                  i < index ? "bg-meter-green" : i === index ? "bg-fg" : "bg-meter-empty",
                )}
              />
            ))}
          </span>
        </div>

        {/* The card */}
        <div key={deal.id} className="mt-4 animate-deck-in rounded-lg border border-line-card bg-card p-4">
          <div className="flex items-start gap-3">
            <CompanyLogo id={deal.companyId} src={company?.logo} size={32} glyph={16} radius={8} />
            <div className="flex min-w-0 flex-1 flex-col gap-[7px] pt-[2px]">
              <span className="truncate text-[16px] leading-none font-semibold text-fg">{company?.name}</span>
              <span className="truncate text-[12px] leading-none text-fg-soft/80">{deal.title}</span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-[7px] pt-[2px]">
              <span className="text-[14px] leading-none font-medium text-fg tabular-nums">
                <span className="mr-[3px] text-[#7f7f7f]">$</span>
                {formatNumber(deal.value)}
              </span>
              <span className="flex items-center gap-[5px] text-[12px] leading-none text-fg-muted">
                <Avatar name={ownerById(deal.ownerId).name} size={14} />
                {ownerById(deal.ownerId).name}
              </span>
            </div>
          </div>

          {/* Trail as chips */}
          <div className="mt-4 flex flex-wrap items-center gap-x-[6px] gap-y-2">
            {chain.map((d, i) => (
              <span key={d + i} className="flex items-center gap-[6px]">
                {i > 0 && (
                  <span className="flex items-center gap-[4px] text-[11px] leading-none text-fg-muted">
                    {slip.pushes[i - 1].reason}
                    <ArrowRight className="size-[11px]" strokeWidth={2} />
                  </span>
                )}
                <span
                  className={cn(
                    "flex h-6 items-center rounded-full border px-2 text-[12px] leading-none tabular-nums",
                    i === chain.length - 1
                      ? slip.severity === "high"
                        ? "border-[#4c2324] bg-[#3e1d1e] text-[#fecaca]"
                        : "border-[#5a5228] bg-[#33301a] text-[#fde68a]"
                      : "border-[#363636] bg-muted-surface text-fg-soft",
                  )}
                >
                  {formatShortDate(d)}
                </span>
              </span>
            ))}
            {slip.overdue && (
              <Tag tone="red" className="h-6 px-2 text-[12px]">
                Overdue
              </Tag>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line-strong pt-4">
            <Figure label="Slipped" value={`+${slip.days}d`} />
            <Figure label="Pushes" value={`${slip.pushes.length}×`} />
            <div className="flex min-w-0 flex-col gap-[8px]">
              <span className="text-[11px] leading-none text-fg-muted">Win probability</span>
              <span className="flex items-center gap-2">
                <SegmentedMeter value={deal.probability} className="max-sm:hidden" />
                <span className="text-[14px] leading-none font-medium text-fg tabular-nums">{deal.probability}%</span>
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] leading-none text-fg-muted">
            <Tag tone={stage.tone} className="h-5 px-[6px] text-[12px]">
              {stage.label}
            </Tag>
            <span className="truncate">Next: {deal.nextStep}</span>
          </div>
        </div>

        <SectionLabel className="mt-6 font-normal text-fg-soft">Reason for the new date</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-[6px]">
          {SLIP_REASONS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={reason === r.id}
              onClick={() => setReason(r.id)}
              className={cn("rounded-full transition-opacity duration-200", reason === r.id ? "opacity-100" : "opacity-45 hover:opacity-75")}
            >
              <Tag tone={r.tone}>{r.id}</Tag>
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {actions.map((a) => (
            <button
              key={a.key}
              type="button"
              disabled={a.disabled}
              onClick={a.run}
              className="flex h-[74px] flex-col items-center justify-center gap-[7px] rounded-lg border border-line-card bg-card text-center transition-colors hover:border-[#3a3c3f] disabled:opacity-45 disabled:hover:border-line-card"
            >
              <a.icon className="size-4 text-fg-soft" strokeWidth={1.75} />
              <span className="text-[12px] leading-none font-medium text-fg">{a.label}</span>
              <span className="text-[11px] leading-none text-fg-muted tabular-nums">{a.sub}</span>
            </button>
          ))}
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!custom) return;
            recommit(deal.id, custom, reason);
            next("recommit");
          }}
        >
          <Input
            type="date"
            aria-label="Custom close date"
            min={TODAY}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="[color-scheme:dark]"
          />
          <Button type="submit" disabled={!custom} className="h-9 shrink-0 px-3">
            Set date
          </Button>
        </form>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={() => index > 0 && setIndex(index - 1)} disabled={index === 0}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={onDone}>End review</Button>
          <Button onClick={() => next("kept")}>Skip</Button>
        </div>
      </div>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <span className="text-[11px] leading-none text-fg-muted">{label}</span>
      <span className="text-[14px] leading-none font-medium text-fg tabular-nums">{value}</span>
    </div>
  );
}

export function ReviewDialog() {
  const open = useSlips((s) => s.reviewOpen);
  const setOpen = useSlips((s) => s.setReviewOpen);
  const { slips } = useSlipsData();
  return (
    <Modal open={open} onOpenChange={setOpen} title="Slip review" description="Give every slipped deal a date you believe in.">
      {open && <ReviewDeck initial={slips} onDone={() => setOpen(false)} />}
    </Modal>
  );
}
