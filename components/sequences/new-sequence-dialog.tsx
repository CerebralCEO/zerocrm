"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useSequences } from "@/lib/sequences-store";
import { OWNERS, ownerById } from "@/lib/data";
import type { Step } from "@/lib/sequences";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Segmented } from "@/components/ui/segmented";
import { Avatar } from "@/components/primitives/avatar";

type Template = "blank" | "outbound" | "renewal";

const s = (kind: Step["kind"], delayDays: number, subject: string, body: string, i: number): Step => ({
  id: `t-${Date.now().toString(36)}-${i}`,
  kind,
  delayDays,
  subject,
  body,
  stats: { sent: 0, opened: 0, replied: 0 },
});

const TEMPLATES: Record<Template, { label: string; hint: string; steps: () => Step[] }> = {
  blank: { label: "Blank", hint: "Start with one email.", steps: () => [s("email", 0, "Hi {{first_name}}", "", 0)] },
  outbound: {
    label: "Outbound",
    hint: "4 steps over 8 days: email, call, follow-up, break-up.",
    steps: () => [
      s("email", 0, "Quick idea for {{company}}", "Hi {{first_name}},\n\n— {{sender}}", 0),
      s("call", 2, "Intro call", "Reference the first email.", 1),
      s("email", 3, "Re: Quick idea for {{company}}", "Hi {{first_name}}, following up on my note.", 2),
      s("email", 3, "Should I close the loop?", "Hi {{first_name}}, should I check back next quarter?", 3),
    ],
  },
  renewal: {
    label: "Renewal",
    hint: "3 steps over 12 days: kickoff, check-in call, proposal.",
    steps: () => [
      s("email", 0, "Planning {{company}}'s next year", "Hi {{first_name}}, let's review what's working.", 0),
      s("call", 5, "Renewal check-in", "Confirm stakeholders and budget timing.", 1),
      s("email", 7, "Renewal proposal for {{company}}", "Hi {{first_name}}, sharing the renewal proposal.", 2),
    ],
  },
};

function NewSequenceForm({ onDone }: { onDone: () => void }) {
  const addSequence = useSequences((s) => s.addSequence);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [ownerId, setOwnerId] = useState(OWNERS[0].id);
  const [template, setTemplate] = useState<Template>("outbound");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) {
          setError("Give the sequence a name.");
          return;
        }
        addSequence({
          name: name.trim(),
          goal: goal.trim() || "—",
          ownerId,
          status: "draft",
          steps: TEMPLATES[template].steps(),
          enrollments: [],
          meetings: 0,
        });
        onDone();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <SectionLabel className="font-normal text-fg-soft">Sequence</SectionLabel>
        <div className="mt-[16px]">
          <Label htmlFor="ns-name">
            Name <span className="text-fg-muted">*</span>
          </Label>
          <Input
            id="ns-name"
            autoFocus
            placeholder="Outbound — Mid-market"
            value={name}
            aria-invalid={!!error}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            className={cn(error && "border-danger-dot/70 focus:border-danger-dot")}
          />
          {error && <p className="mt-[6px] text-[12px] text-danger-dot">{error}</p>}
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="ns-goal">Goal</Label>
          <Textarea id="ns-goal" className="min-h-[64px]" placeholder="What should this sequence achieve?" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="ns-owner">Owner</Label>
          <Select
            id="ns-owner"
            value={ownerId}
            onValueChange={setOwnerId}
            options={OWNERS.map((o) => ({ value: o.id, label: o.name }))}
            renderValue={(v) => (
              <>
                <Avatar name={ownerById(v).name} size={20} />
                {ownerById(v).name}
              </>
            )}
            renderOption={(v) => <Avatar name={ownerById(v).name} size={18} />}
          />
        </div>

        <div className="-mx-4 my-5 h-px bg-line-strong sm:-mx-6" />

        <SectionLabel className="font-normal text-fg-soft">Start from</SectionLabel>
        <Segmented
          label="Template"
          className="mt-[16px]"
          value={template}
          onChange={setTemplate}
          options={(Object.keys(TEMPLATES) as Template[]).map((k) => ({ value: k, label: TEMPLATES[k].label }))}
        />
        <p className="mt-[10px] text-[12px] leading-none text-fg-muted">{TEMPLATES[template].hint} Saved as a draft.</p>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Plus className="size-[13px]" strokeWidth={2} />
          Create Sequence
        </Button>
      </div>
    </form>
  );
}

export function NewSequenceDialog() {
  const open = useSequences((s) => s.newOpen);
  const setOpen = useSequences((s) => s.setNewOpen);
  return (
    <Modal open={open} onOpenChange={setOpen} title="New Sequence" description="Automate a multi-step outreach cadence.">
      {open && <NewSequenceForm onDone={() => setOpen(false)} />}
    </Modal>
  );
}
