"use client";

import { useRef, useState } from "react";
import { Minus, PenLine, Plus } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import { useContacts } from "@/lib/contacts-store";
import { useCrm } from "@/lib/store";
import { CURRENT_USER } from "@/lib/data";
import { STEP_KINDS, VARIABLES, renderTemplate, type Step, type StepKind } from "@/lib/sequences";
import { cn } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Textarea } from "@/components/ui/form";
import { Segmented } from "@/components/ui/segmented";
import { Avatar } from "@/components/primitives/avatar";
import { STEP_ICON } from "./shared";

function DelayStepper({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled?: boolean }) {
  const btn =
    "flex size-9 items-center justify-center text-fg-soft transition-colors hover:bg-white/[0.05] hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent";
  return (
    <div className="flex h-9 w-fit items-center overflow-hidden rounded-lg border border-[#2e2e2e] bg-[#1e1e1e]">
      <button type="button" aria-label="Fewer days" className={btn} disabled={disabled || value <= 0} onClick={() => onChange(value - 1)}>
        <Minus className="size-[13px]" strokeWidth={2} />
      </button>
      <span className="w-[76px] border-x border-[#2e2e2e] text-center text-[14px] leading-9 font-medium text-fg tabular-nums">
        {value} {value === 1 ? "day" : "days"}
      </span>
      <button type="button" aria-label="More days" className={btn} disabled={disabled || value >= 30} onClick={() => onChange(value + 1)}>
        <Plus className="size-[13px]" strokeWidth={2} />
      </button>
    </div>
  );
}

function EditorBody({ step, isFirst, onChange }: { step: Omit<Step, "id" | "stats">; isFirst: boolean; onChange: (s: Omit<Step, "id" | "stats">) => void }) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const seq = useSequences((s) => s.sequences.find((q) => q.id === s.editor?.sequenceId));
  const contacts = useContacts((s) => s.contacts);
  const companies = useCrm((s) => s.companies);
  // Preview against the first enrolled contact (or any contact).
  const sample = contacts.find((c) => c.id === seq?.enrollments[0]?.contactId) ?? contacts[0];
  const vars = {
    first_name: sample.name.split(" ")[0],
    company: companies.find((c) => c.id === sample.companyId)?.name ?? "",
    sender: CURRENT_USER.name.split(" ")[0],
  };

  const insert = (v: string) => {
    const el = bodyRef.current;
    const token = `{{${v}}}`;
    if (!el) return onChange({ ...step, body: step.body + token });
    const start = el.selectionStart ?? step.body.length;
    const end = el.selectionEnd ?? start;
    const body = step.body.slice(0, start) + token + step.body.slice(end);
    onChange({ ...step, body });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  return (
    <>
      <section className="border-b border-line-strong px-5 pt-[21px] pb-[20px]">
        <SectionLabel>Step</SectionLabel>
        <Segmented
          label="Step type"
          className="mt-[16px]"
          value={step.kind}
          onChange={(kind: StepKind) => onChange({ ...step, kind })}
          options={STEP_KINDS.map((k) => {
            const Icon = STEP_ICON[k.id];
            return { value: k.id, label: k.label, icon: <Icon className="size-[13px] max-sm:hidden" strokeWidth={1.75} /> };
          })}
        />
        <div className="mt-[16px]">
          <Label>Wait before this step</Label>
          <DelayStepper value={step.delayDays} disabled={isFirst} onChange={(delayDays) => onChange({ ...step, delayDays })} />
          {isFirst && <p className="mt-[8px] text-[12px] leading-none text-fg-muted">The first step runs on enrollment.</p>}
        </div>
      </section>

      <section className="border-b border-line-strong px-5 pt-[21px] pb-[20px]">
        <SectionLabel>Content</SectionLabel>
        <div className="mt-[16px]">
          <Label htmlFor="se-subject">{step.kind === "email" ? "Subject" : "Title"}</Label>
          <Input id="se-subject" value={step.subject} onChange={(e) => onChange({ ...step, subject: e.target.value })} />
        </div>
        <div className="mt-[15px]">
          <div className="mb-[9px] flex items-center justify-between gap-2">
            <label htmlFor="se-body" className="text-[12px] leading-none text-fg-soft">
              {step.kind === "email" ? "Message" : "Instructions"}
            </label>
            <span className="flex gap-1">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => insert(v)}
                  className="h-[22px] rounded-full border border-white/[0.09] bg-[#1b1b1b] px-2 text-[11px] leading-none text-fg-soft transition-colors hover:bg-[#232323] hover:text-fg"
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </span>
          </div>
          <Textarea ref={bodyRef} id="se-body" className="min-h-[140px]" value={step.body} onChange={(e) => onChange({ ...step, body: e.target.value })} />
        </div>
      </section>

      <section className="px-5 pt-[21px] pb-[20px]">
        <div className="flex items-center justify-between">
          <SectionLabel>Preview</SectionLabel>
          <span className="flex items-center gap-[6px] text-[12px] leading-none text-fg-muted">
            <Avatar name={sample.name} size={16} />
            as {sample.name}
          </span>
        </div>
        <div className="mt-[16px] rounded-lg border border-line-card bg-card p-4">
          {step.kind === "email" && (
            <div className="mb-3 flex flex-col gap-[7px] border-b border-line-card pb-3 text-[12px] leading-none text-fg-muted">
              <span>
                To <span className="text-fg-soft">{sample.email}</span>
              </span>
              <span className="text-[14px] font-medium text-fg">{renderTemplate(step.subject, vars) || "No subject"}</span>
            </div>
          )}
          <p className={cn("text-[14px] leading-[20px] whitespace-pre-line text-fg-soft", !step.body && "text-fg-muted")}>
            {renderTemplate(step.body, vars) || "Nothing written yet."}
          </p>
        </div>
      </section>
    </>
  );
}

const BLANK: Omit<Step, "id" | "stats"> = { kind: "email", delayDays: 2, subject: "", body: "" };

export function StepEditorSheet() {
  const editor = useSequences((s) => s.editor);
  const seq = useSequences((s) => s.sequences.find((q) => q.id === s.editor?.sequenceId));
  const close = useSequences((s) => s.closeEditor);
  const saveStep = useSequences((s) => s.saveStep);
  const deleteStep = useSequences((s) => s.deleteStep);
  const existing = seq?.steps.find((x) => x.id === editor?.stepId);
  const [drafts, setDrafts] = useState<Record<string, Omit<Step, "id" | "stats">>>({});

  const key = editor ? `${editor.sequenceId}:${editor.stepId ?? "new"}` : "";
  const isFirst = existing ? seq?.steps[0]?.id === existing.id : (seq?.steps.length ?? 0) === 0;
  const draft = drafts[key] ?? (existing ? { kind: existing.kind, delayDays: existing.delayDays, subject: existing.subject, body: existing.body } : { ...BLANK, delayDays: isFirst ? 0 : BLANK.delayDays });
  const done = () => {
    setDrafts({});
    close();
  };
  const index = existing && seq ? seq.steps.indexOf(existing) + 1 : (seq?.steps.length ?? 0) + 1;

  return (
    <Sheet
      open={!!editor}
      onOpenChange={(o) => !o && done()}
      title={existing ? `Edit step ${index}` : `New step ${index}`}
      icon={<PenLine className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[520px] md:max-w-full"
      footer={
        <>
          {existing ? (
            <button
              type="button"
              onClick={() => {
                if (seq) deleteStep(seq.id, existing.id);
                done();
              }}
              className="no-press text-[14px] font-semibold text-danger-dot underline-offset-[3px] hover:underline"
            >
              Delete step
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button onClick={done}>Cancel</Button>
            <Button
              variant="primary"
              disabled={!draft.subject.trim()}
              onClick={() => {
                if (seq) saveStep(seq.id, { ...draft, id: existing?.id });
                done();
              }}
            >
              {existing ? "Save Step" : "Add Step"}
            </Button>
          </div>
        </>
      }
    >
      {editor && seq && <EditorBody key={key} step={draft} isFirst={!!isFirst} onChange={(s) => setDrafts((d) => ({ ...d, [key]: s }))} />}
    </Sheet>
  );
}
