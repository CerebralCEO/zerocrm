"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useActivities } from "@/lib/activities-store";
import { useDeals, TODAY } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { KINDS, NOW_TIME, type ActivityKind } from "@/lib/activities";
import { OWNERS, ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Segmented } from "@/components/ui/segmented";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { KIND_ICON } from "./shared";

const PLACEHOLDER: Record<ActivityKind, string> = {
  call: "Call with the champion",
  email: "Sent the revised proposal",
  meeting: "Demo for the ops team",
  note: "Budget confirmed for Q4",
  task: "Send the security questionnaire",
};

function LogForm({ onDone }: { onDone: () => void }) {
  const companies = useCrm((s) => s.companies);
  const deals = useDeals((s) => s.deals);
  const addActivity = useActivities((s) => s.addActivity);
  const defaults = useActivities((s) => s.logDefaults);
  const [kind, setKind] = useState<ActivityKind>("call");
  const [companyId, setCompanyId] = useState(defaults?.companyId ?? companies[0]?.id ?? "");
  const companyDeals = deals.filter((d) => d.companyId === companyId);
  const [dealId, setDealId] = useState<string>(companyDeals[0]?.id ?? "none");
  const [ownerId, setOwnerId] = useState(
    companies.find((c) => c.id === companyId)?.ownerId ?? companies[0]?.ownerId ?? OWNERS[0].id,
  );
  const [title, setTitle] = useState(defaults?.title ?? "");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(TODAY);
  const [time, setTime] = useState(NOW_TIME);
  const [error, setError] = useState<string | null>(null);

  const at = `${date}T${time || NOW_TIME}`;
  const upcoming = at > `${TODAY}T${NOW_TIME}`;
  const companyById = (id: string) => companies.find((c) => c.id === id);

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) {
          setError("Add a short title.");
          return;
        }
        addActivity({
          kind,
          title: title.trim(),
          body: body.trim() || undefined,
          companyId,
          dealId: dealId === "none" ? undefined : dealId,
          ownerId,
          at,
          done: !upcoming,
          scheduled: upcoming || undefined,
        });
        onDone();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <SectionLabel className="font-normal text-fg-soft">Activity</SectionLabel>
        <Segmented
          label="Activity type"
          className="mt-[16px]"
          value={kind}
          onChange={setKind}
          options={KINDS.map((k) => {
            const Icon = KIND_ICON[k.id];
            return { value: k.id, label: k.label, icon: <Icon className="size-[13px] max-sm:hidden" strokeWidth={1.75} /> };
          })}
        />
        <div className="mt-[16px]">
          <Label htmlFor="la-title">
            Title <span className="text-fg-muted">*</span>
          </Label>
          <Input
            id="la-title"
            autoFocus
            placeholder={PLACEHOLDER[kind]}
            value={title}
            aria-invalid={!!error}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            className={cn(error && "border-danger-dot/70 focus:border-danger-dot")}
          />
          {error && <p className="mt-[6px] text-[12px] text-danger-dot">{error}</p>}
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="la-body">Details</Label>
          <Textarea id="la-body" placeholder="Outcome, next steps, who was there…" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>

        <div className="-mx-4 my-5 h-px bg-line-strong sm:-mx-6" />

        <SectionLabel className="font-normal text-fg-soft">Related to</SectionLabel>
        <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="la-company">Company</Label>
            <Select
              id="la-company"
              value={companyId}
              onValueChange={(v) => {
                setCompanyId(v);
                setDealId(deals.find((d) => d.companyId === v)?.id ?? "none");
                const owner = companyById(v)?.ownerId;
                if (owner) setOwnerId(owner);
              }}
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
              renderValue={(v) => (
                <>
                  <CompanyLogo id={v} src={companyById(v)?.logo} size={20} glyph={11} radius={5} />
                  <span className="truncate">{companyById(v)?.name}</span>
                </>
              )}
              renderOption={(v) => <CompanyLogo id={v} src={companyById(v)?.logo} size={18} glyph={10} radius={4} />}
            />
          </div>
          <div>
            <Label htmlFor="la-deal">Deal</Label>
            <Select
              id="la-deal"
              value={dealId}
              onValueChange={setDealId}
              options={[{ value: "none", label: "No deal" }, ...companyDeals.map((d) => ({ value: d.id, label: d.title }))]}
            />
          </div>
        </div>
        <div className="mt-[15px] grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_1fr] sm:gap-4">
          <div className="col-span-2 sm:col-span-1">
            <Label htmlFor="la-owner">Owner</Label>
            <Select
              id="la-owner"
              value={ownerId}
              onValueChange={setOwnerId}
              options={OWNERS.map((o) => ({ value: o.id, label: o.name }))}
              renderValue={(v) => (
                <>
                  <Avatar name={ownerById(v).name} size={20} />
                  <span className="truncate">{ownerById(v).name}</span>
                </>
              )}
              renderOption={(v) => <Avatar name={ownerById(v).name} size={18} />}
            />
          </div>
          <div>
            <Label htmlFor="la-date">Date</Label>
            <Input id="la-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="font-medium" />
          </div>
          <div>
            <Label htmlFor="la-time">Time</Label>
            <Input id="la-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="font-medium" />
          </div>
        </div>
        <p className="mt-[10px] text-[12px] leading-none text-fg-muted">
          {upcoming ? "Scheduled — it will appear in the agenda." : "Logged — it goes straight into the feed and the deal timeline."}
        </p>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Plus className="size-[13px]" strokeWidth={2} />
          {upcoming ? "Schedule" : "Log Activity"}
        </Button>
      </div>
    </form>
  );
}

export function LogActivityDialog() {
  const open = useActivities((s) => s.logOpen);
  const setOpen = useActivities((s) => s.setLogOpen);
  return (
    <Modal open={open} onOpenChange={setOpen} title="Log Activity" description="Record a call, email, meeting, note or task.">
      {open && <LogForm onDone={() => setOpen(false)} />}
    </Modal>
  );
}
