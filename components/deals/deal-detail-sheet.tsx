"use client";

import { useState } from "react";
import { Calendar, CalendarClock, CircleCheck, FileText, Handshake, Mail, Phone, Video, type LucideIcon } from "lucide-react";
import { useActivities } from "@/lib/activities-store";
import { dateOf, dayLabel, formatTime } from "@/lib/activities";
import { useCrm } from "@/lib/store";
import { useDeals, isOverdue } from "@/lib/deals-store";
import { useInvoices } from "@/lib/invoices-store";
import { STAGES, stageById, type Deal, type DealActivity, type StageId } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { cn, formatNumber, formatShortDate } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Slider } from "@/components/ui/form";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { Tag } from "@/components/primitives/tag";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";

const ACTIVITY_ICON: Record<DealActivity["kind"] | "task", LucideIcon> = {
  task: CircleCheck,
  call: Phone,
  email: Mail,
  meeting: Video,
  note: FileText,
};

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("border-b border-line-strong px-5 pt-[21px] pb-[20px]", className)}>{children}</section>;
}

function Tile({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex h-[62px] min-w-0 flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
      <span className="flex items-center gap-[5px] text-[12px] leading-none text-fg-soft/80">
        <Icon className="size-[12px]" strokeWidth={1.75} />
        {label}
      </span>
      <span className="flex min-w-0 items-center gap-[6px] truncate text-[14px] font-medium leading-none text-fg">{children}</span>
    </div>
  );
}

/** Five-step stage track: completed + current stages fill green. */
function StageTrack({ stage }: { stage: StageId }) {
  const current = STAGES.findIndex((s) => s.id === stage);
  return (
    <div className="grid grid-cols-5 gap-1">
      {STAGES.map((s, i) => (
        <div key={s.id} className="flex min-w-0 flex-col gap-2">
          <span
            className={cn(
              "h-[6px] rounded-[2px] transition-colors duration-300",
              i <= current ? "bg-meter-green" : "bg-meter-empty-bar",
            )}
          />
          <span className={cn("truncate text-[11px] leading-none", i === current ? "font-medium text-fg" : "text-fg-muted")}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}

type Draft = Pick<Deal, "stage" | "probability" | "nextStep">;

function DealBody({ deal, draft, setDraft }: { deal: Deal; draft: Draft; setDraft: (d: Draft) => void }) {
  const company = useCrm((s) => s.companies.find((c) => c.id === deal.companyId));
  const allActivities = useActivities((s) => s.activities);
  // Logged activity for this deal (from the Activities page), newest first; seed notes as fallback.
  const logged = allActivities
    .filter((a) => a.dealId === deal.id && a.done)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 4)
    .map((a) => ({ kind: a.kind, text: a.body ? `${a.title} — ${a.body}` : a.title, time: `${dayLabel(dateOf(a.at))} · ${formatTime(a.at)}` }));
  const timeline = logged.length ? logged : deal.activity;
  const owner = ownerById(deal.ownerId);
  const weighted = Math.round((deal.value * draft.probability) / 100);
  const overdue = isOverdue({ ...deal, stage: draft.stage });

  return (
    <>
      <Section className="flex items-center gap-[11px] pt-[19px] pb-[18px]">
        <CompanyLogo id={deal.companyId} src={company?.logo} size={52} glyph={30} radius={12} />
        <div className="flex min-w-0 flex-col items-start gap-[9px]">
          <span className="max-w-full truncate text-[16px] font-semibold leading-none text-fg">{deal.title}</span>
          <div className="flex items-center gap-2">
            <Tag tone={stageById(draft.stage).tone}>{stageById(draft.stage).label}</Tag>
            <span className="text-[12px] leading-none text-fg-muted">{company?.name}</span>
          </div>
        </div>
      </Section>

      <Section>
        <SectionLabel>Deal Summary</SectionLabel>
        <div className="mt-[15px] text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg tabular-nums">
          <span className="mr-[4px] text-[#7f7f7f]">$</span>
          {formatNumber(deal.value)}
        </div>
        <div className="mt-[6px] text-[12px] leading-none text-fg-soft/80">
          ${formatNumber(weighted)} weighted at {draft.probability}% win probability
        </div>
        <SegmentedMeter value={draft.probability} segments={64} variant="bar" className="mt-[14px]" />
        <div className="mt-[14px] grid grid-cols-2 gap-2">
          <Tile icon={CalendarClock} label="Close date">
            <span className={cn(overdue && "text-danger-dot")}>
              {overdue ? `Overdue · ${formatShortDate(deal.closeDate)}` : formatShortDate(deal.closeDate)}
            </span>
          </Tile>
          <Tile icon={Handshake} label="Owner">
            <Avatar name={owner.name} size={16} />
            <span className="truncate">{owner.name}</span>
          </Tile>
        </div>
      </Section>

      <Section>
        <SectionLabel>Stage</SectionLabel>
        <div className="mt-[16px]">
          <StageTrack stage={draft.stage} />
        </div>
        <div className="mt-[18px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="deal-stage">Move to stage</Label>
            <Select
              id="deal-stage"
              value={draft.stage}
              onValueChange={(v) => {
                const stage = v as StageId;
                setDraft({ ...draft, stage, probability: stage === "won" ? 100 : stageById(stage).probability });
              }}
              options={STAGES.map((s) => ({ value: s.id, label: s.label }))}
            />
          </div>
          <div>
            <div className="mb-[9px] flex items-center justify-between text-[12px] leading-none">
              <span className="text-fg-soft">Win probability</span>
              <span className="font-semibold text-fg">{draft.probability}%</span>
            </div>
            <div className="flex h-9 items-center">
              <Slider
                label="Win probability"
                value={draft.probability}
                onValueChange={(probability) => setDraft({ ...draft, probability })}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <SectionLabel>Next Step</SectionLabel>
        <Input
          aria-label="Next step"
          className="mt-[16px] font-medium"
          value={draft.nextStep}
          onChange={(e) => setDraft({ ...draft, nextStep: e.target.value })}
        />
        <p className="mt-[8px] flex items-center gap-[5px] text-[12px] leading-none text-fg-muted">
          <Calendar className="size-[12px]" strokeWidth={1.75} />
          Last touch {formatShortDate(deal.lastTouch.date)} · {deal.lastTouch.type}
        </p>
      </Section>

      <Section className="border-b-0">
        <SectionLabel>Recent Activity</SectionLabel>
        <ol className="relative mt-[16px] flex flex-col gap-4 before:absolute before:top-2 before:bottom-2 before:left-[13.5px] before:w-px before:bg-line-strong">
          {timeline.map((a, i) => {
            const Icon = ACTIVITY_ICON[a.kind];
            return (
              <li key={i} className="relative flex items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-line-card bg-muted-surface">
                  <Icon className="size-[13px] text-fg-soft" strokeWidth={1.75} />
                </span>
                <span className="flex min-w-0 flex-col gap-[6px] pt-[2px]">
                  <span className="text-[14px] leading-[17px] text-fg-soft">{a.text}</span>
                  <span className="text-[12px] leading-none text-fg-muted">{a.time}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Section>
    </>
  );
}

export function DealDetailSheet() {
  const openDealId = useDeals((s) => s.openDealId);
  const deal = useDeals((s) => s.deals.find((d) => d.id === s.openDealId));
  const openDeal = useDeals((s) => s.openDeal);
  const updateDeal = useDeals((s) => s.updateDeal);
  const moveDeal = useDeals((s) => s.moveDeal);
  const openCompany = useCrm((s) => s.openDetail);
  const createInvoice = useInvoices((s) => s.createFromDeal);
  const hasInvoice = useInvoices((s) => !!deal && s.invoices.some((i) => i.dealId === deal.id));
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  const draft = deal ? drafts[deal.id] ?? { stage: deal.stage, probability: deal.probability, nextStep: deal.nextStep } : null;
  const close = () => {
    setDrafts({});
    openDeal(null);
  };

  return (
    <Sheet
      open={!!openDealId}
      onOpenChange={(o) => !o && close()}
      title="Deal Detail"
      icon={<Handshake className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[560px] md:max-w-full"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              if (!deal) return;
              const id = deal.companyId;
              close();
              openCompany(id);
            }}
            className="no-press text-[14px] font-semibold text-fg underline underline-offset-[3px]"
          >
            View company
          </button>
          <div className="flex items-center gap-2">
            {deal?.stage === "won" && (
              <Button
                onClick={() => {
                  const id = deal.id;
                  close();
                  createInvoice(id);
                }}
              >
                {hasInvoice ? "View invoice" : "Create invoice"}
              </Button>
            )}
            <Button onClick={close} className="max-sm:hidden">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (deal && draft) {
                  if (draft.stage !== deal.stage) moveDeal(deal.id, draft.stage);
                  updateDeal(deal.id, { probability: draft.probability, nextStep: draft.nextStep.trim() || deal.nextStep });
                }
                close();
              }}
            >
              Save Update
            </Button>
          </div>
        </>
      }
    >
      {deal && draft && (
        <DealBody deal={deal} draft={draft} setDraft={(d) => setDrafts((all) => ({ ...all, [deal.id]: d }))} />
      )}
    </Sheet>
  );
}
