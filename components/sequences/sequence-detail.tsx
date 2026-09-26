"use client";

import { ChevronLeft, Clock, Plus, UserPlus } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import { sequenceStats, stepDays, STEP_KINDS, type Sequence, type Step } from "@/lib/sequences";
import { ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/overlay";
import { Avatar } from "@/components/primitives/avatar";
import { EnrollmentTag, StatusPill, StepIcon } from "./shared";

function StatTile({ label, value, suffix, tone }: { label: string; value: number; suffix?: string; tone?: string }) {
  return (
    <div className="flex h-[62px] min-w-0 flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
      <span className="truncate text-[12px] leading-none text-fg-soft/80">{label}</span>
      <span className={cn("text-[16px] font-medium leading-none tabular-nums", tone ?? "text-fg")}>
        {value}
        {suffix && <span className="text-[#7f7f7f]">{suffix}</span>}
      </span>
    </div>
  );
}

/** Tiny labelled bar for per-step rates. */
function Rate({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
      {label}
      <span className="h-1 w-10 overflow-hidden rounded-[2px] bg-meter-track-bar">
        <span className="block h-full rounded-[2px] transition-[width] duration-700 ease-(--ease-ios)" style={{ width: `${Math.min(value, 100)}%`, background: color }} />
      </span>
      <span className="w-8 text-fg-soft tabular-nums">{value}%</span>
    </span>
  );
}

/** Highlights {{variables}} inside template text. */
function Template({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{\s*\w+\s*\}\})/g).map((part, i) =>
        /^\{\{/.test(part) ? (
          <span key={i} className="rounded-[4px] bg-white/[0.07] px-1 text-fg-soft">
            {part.replace(/[{}\s]/g, "")}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function StepCard({ seq, step, index, day }: { seq: Sequence; step: Step; index: number; day: number }) {
  const openEditor = useSequences((s) => s.openEditor);
  const kind = STEP_KINDS.find((k) => k.id === step.kind)!.label;
  const { sent, opened, replied } = step.stats;
  const last = index === seq.steps.length - 1;

  return (
    <li className="relative pl-10">
      {/* spine + index */}
      {!last && <span aria-hidden className="absolute top-0 bottom-0 left-[11.5px] w-px bg-line" />}
      {step.delayDays > 0 && (
        <div className="relative mb-2 flex h-6 items-center">
          <span className="absolute -left-10 flex w-6 justify-center">
            <span className="size-[5px] rounded-full bg-line-strong" />
          </span>
          <span className="flex h-5 items-center gap-[5px] rounded-full border border-white/[0.08] bg-[#1b1b1b] px-2 text-[11px] leading-none text-fg-muted">
            <Clock className="size-[11px]" strokeWidth={1.75} />
            Wait {step.delayDays} {step.delayDays === 1 ? "day" : "days"}
          </span>
        </div>
      )}
      <span className="absolute left-0 flex size-6 items-center justify-center rounded-full border border-line-card bg-muted-surface text-[11px] font-semibold text-fg-soft tabular-nums"
        style={{ top: step.delayDays > 0 ? 44 : 12 }}
      >
        {index + 1}
      </span>
      <button
        type="button"
        onClick={() => openEditor(seq.id, step.id)}
        className="no-press mb-3 flex w-full flex-col rounded-lg border border-line-card bg-card p-3 text-left transition-[border-color,background-color] hover:border-[#3a3c3f] active:bg-[#1e2023]"
      >
        <div className="flex items-center gap-2">
          <StepIcon kind={step.kind} />
          <span className="text-[12px] leading-none font-medium text-fg">{kind}</span>
          <span className="text-[12px] leading-none text-fg-muted">· Day {day}</span>
          <span className="ml-auto text-[12px] leading-none text-fg-muted tabular-nums">{sent} sent</span>
        </div>
        <p className="mt-[10px] truncate text-[14px] leading-none font-medium text-fg">
          <Template text={step.subject} />
        </p>
        <p className="mt-[7px] line-clamp-2 text-[12px] leading-[16px] text-fg-soft/80">
          {/* Collapse line breaks so the two-line preview shows real content */}
          <Template text={step.body.replace(/\s*\n+\s*/g, " ")} />
        </p>
        {sent > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-card pt-[10px]">
            {step.kind === "email" && <Rate label="Open" value={Math.round((opened / sent) * 100)} color="var(--color-spark)" />}
            <Rate label="Reply" value={Math.round((replied / sent) * 100)} color="var(--color-meter-amber)" />
          </div>
        )}
      </button>
    </li>
  );
}

function EnrolledRow({ contactId, step, state, total }: { contactId: string; step: number; state: Sequence["enrollments"][number]["state"]; total: number }) {
  const contact = useContacts((s) => s.contacts.find((c) => c.id === contactId));
  const company = useCrm((s) => s.companies.find((c) => c.id === contact?.companyId));
  const openContact = useContacts((s) => s.openContact);
  if (!contact) return null;
  return (
    <button
      type="button"
      onClick={() => openContact(contact.id)}
      className="no-press -mx-2 flex min-h-[52px] items-center gap-3 rounded-md border-b border-line px-2 py-2 text-left transition-colors last:border-b-0 hover:bg-row-hover active:bg-row-hover"
    >
      <Avatar name={contact.name} size={28} />
      <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
        <span className="truncate text-[14px] leading-none font-medium text-fg">{contact.name}</span>
        <span className="truncate text-[12px] leading-none text-fg-muted">
          {contact.role} · {company?.name}
        </span>
      </span>
      {/* Step progress — one segment per step */}
      <span className="hidden items-center gap-[3px] sm:flex" aria-label={`Step ${step + 1} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-[6px] w-[10px] rounded-[2px]",
              i < step || (i === step && state !== "active") ? "bg-meter-green" : i === step ? "bg-meter-amber" : "bg-meter-empty-bar",
            )}
          />
        ))}
      </span>
      <span className="hidden w-[64px] text-right text-[12px] leading-none text-fg-muted tabular-nums md:block">
        Step {Math.min(step + 1, total)}/{total}
      </span>
      <EnrollmentTag state={state} />
    </button>
  );
}

export function SequenceDetail() {
  const seq = useSequences((s) => s.sequences.find((q) => q.id === s.selectedId));
  const setStatus = useSequences((s) => s.setStatus);
  const openEditor = useSequences((s) => s.openEditor);
  const setEnrollOpen = useSequences((s) => s.setEnrollOpen);
  const closeDetail = useSequences((s) => s.closeDetail);
  if (!seq) return <p className="p-10 text-center text-[13px] text-fg-muted">Select a sequence.</p>;

  const stats = sequenceStats(seq);
  const days = stepDays(seq.steps);
  const owner = ownerById(seq.ownerId);

  return (
    <section className="flex min-w-0 flex-col">
      {/* Phone: back to the list (iOS navigation bar) */}
      <button
        type="button"
        onClick={closeDetail}
        className="no-press flex h-11 items-center gap-1 border-b border-line px-3 text-[14px] leading-none font-medium text-fg lg:hidden"
      >
        <ChevronLeft className="size-[18px]" strokeWidth={2} />
        Sequences
      </button>

      <div className="border-b border-line px-4 pt-[18px] pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-[8px]">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-semibold leading-none text-fg">{seq.name}</h2>
              <StatusPill status={seq.status} />
            </div>
            <p className="text-[12px] leading-[16px] text-fg-soft/80">{seq.goal}</p>
            <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
              <Avatar name={owner.name} size={16} />
              {owner.name} · {seq.steps.length} steps · {days.at(-1) ?? 0} days
            </span>
          </div>
          <label className="flex shrink-0 items-center gap-[10px] text-[12px] leading-none text-fg-soft">
            <span className="max-sm:hidden">{seq.status === "active" ? "Running" : seq.status === "paused" ? "Paused" : "Draft"}</span>
            <Switch
              checked={seq.status === "active"}
              onChange={(on) => setStatus(seq.id, on ? "active" : "paused")}
              label={seq.status === "active" ? "Pause sequence" : "Activate sequence"}
            />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile label="Enrolled" value={stats.enrolled} />
          <StatTile label="Open rate" value={stats.openRate} suffix="%" />
          <StatTile label="Reply rate" value={stats.replyRate} suffix="%" tone={stats.replyRate >= 10 ? "text-meter-green" : undefined} />
          <StatTile label="Meetings" value={stats.meetings} />
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="border-line px-4 pt-[18px] pb-4 xl:border-r">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[12px] font-medium uppercase leading-none tracking-[1.1px] text-fg">Steps</h3>
            <span className="text-[12px] leading-none text-fg-muted">Tap a step to edit</span>
          </div>
          <ol>
            {seq.steps.map((step, i) => (
              <StepCard key={step.id} seq={seq} step={step} index={i} day={days[i]} />
            ))}
          </ol>
          <button
            type="button"
            onClick={() => openEditor(seq.id, null)}
            className="no-press ml-10 flex h-11 w-[calc(100%-40px)] items-center justify-center gap-[6px] rounded-lg border border-dashed border-line-strong text-[12px] font-medium text-fg-soft transition-colors hover:border-[#4a4a4a] hover:text-fg"
          >
            <Plus className="size-[13px]" strokeWidth={2} />
            Add step
          </button>
        </div>

        <div className="border-line px-4 pt-[18px] pb-6 max-xl:border-t">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[12px] font-medium uppercase leading-none tracking-[1.1px] text-fg">
              Enrolled <span className="text-fg-muted">· {seq.enrollments.length}</span>
            </h3>
            <Button onClick={() => setEnrollOpen(true)}>
              <UserPlus className="size-[12px]" strokeWidth={2} />
              Enroll contacts
            </Button>
          </div>
          <div className="flex flex-col">
            {seq.enrollments.map((e) => (
              <EnrolledRow key={e.contactId} contactId={e.contactId} step={e.step} state={e.state} total={seq.steps.length} />
            ))}
            {seq.enrollments.length === 0 && (
              <p className="rounded-lg border border-dashed border-line-strong py-8 text-center text-[13px] text-fg-muted">
                Nobody enrolled yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
