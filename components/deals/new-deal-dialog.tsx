"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCrm } from "@/lib/store";
import { useDeals, TODAY } from "@/lib/deals-store";
import { STAGES, stageById, type StageId } from "@/lib/deals";
import { OWNERS, ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Slider } from "@/components/ui/form";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

type Form = {
  companyId: string;
  title: string;
  stage: StageId;
  closeDate: string;
  ownerId: string;
  value: string;
  probability: number;
};

function Divider() {
  return <div className="h-px shrink-0 bg-line-strong" />;
}

/** Keyed by open/stage so every opening starts from a fresh form. */
function NewDealForm({
  initialStage,
  initialClose,
  siteId,
  onDone,
}: {
  initialStage: StageId;
  initialClose: string | null;
  siteId: string | null;
  onDone: () => void;
}) {
  const companies = useCrm((s) => s.companies);
  const addDeal = useDeals((s) => s.addDeal);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(() => ({
    companyId: companies[0]?.id ?? "",
    title: "",
    stage: initialStage,
    closeDate: initialClose ?? addDays(TODAY, 30),
    ownerId: companies[0]?.ownerId ?? OWNERS[0].id,
    value: "",
    probability: stageById(initialStage).probability,
  }));
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const companyById = (id: string) => companies.find((c) => c.id === id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError("Deal name is required.");
      return;
    }
    addDeal({
      companyId: form.companyId,
      title,
      stage: form.stage,
      closeDate: form.closeDate,
      ownerId: form.ownerId,
      value: Number(form.value) || 50000,
      probability: form.probability,
      nextStep: "Schedule a discovery call",
      ...(siteId ? { siteId } : {}),
    });
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 pt-[19px] pb-[19px] sm:px-6">
          <SectionLabel className="font-normal text-fg-soft">Deal</SectionLabel>
          <div className="mt-[16px]">
            <Label htmlFor="nd-company">Company</Label>
            <Select
              id="nd-company"
              value={form.companyId}
              onValueChange={(v) => {
                set("companyId", v);
                const owner = companyById(v)?.ownerId;
                if (owner) set("ownerId", owner);
              }}
              options={companies.map((c) => ({ value: c.id, label: c.name }))}
              renderValue={(v) => (
                <>
                  <CompanyLogo id={v} src={companyById(v)?.logo} size={20} glyph={11} radius={5} />
                  {companyById(v)?.name}
                </>
              )}
              renderOption={(v) => <CompanyLogo id={v} src={companyById(v)?.logo} size={18} glyph={10} radius={4} />}
            />
          </div>
          <div className="mt-[15px]">
            <Label htmlFor="nd-title">
              Deal name <span className="text-fg-muted">*</span>
            </Label>
            <Input
              id="nd-title"
              autoFocus
              placeholder="Enterprise expansion"
              value={form.title}
              aria-invalid={!!error}
              onChange={(e) => {
                set("title", e.target.value);
                if (error) setError(null);
              }}
              className={cn(error && "border-danger-dot/70 focus:border-danger-dot")}
            />
            {error && <p className="mt-[6px] text-[12px] text-danger-dot">{error}</p>}
          </div>
          <div className="mt-[15px] grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="nd-stage">Stage</Label>
              <Select
                id="nd-stage"
                value={form.stage}
                onValueChange={(v) => {
                  const stage = v as StageId;
                  setForm((f) => ({ ...f, stage, probability: stageById(stage).probability }));
                }}
                options={STAGES.map((s) => ({ value: s.id, label: s.label }))}
              />
            </div>
            <div>
              <Label htmlFor="nd-close">Close date</Label>
              <Input
                id="nd-close"
                type="date"
                value={form.closeDate}
                onChange={(e) => set("closeDate", e.target.value)}
                className="font-medium"
              />
            </div>
          </div>
        </div>

        <Divider />

        <div className="px-4 pt-[19px] pb-[19px] sm:px-6">
          <SectionLabel className="font-normal text-fg-soft">Ownership &amp; Value</SectionLabel>
          <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label htmlFor="nd-owner">Owner</Label>
              <Select
                id="nd-owner"
                value={form.ownerId}
                onValueChange={(v) => set("ownerId", v)}
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
              <Label htmlFor="nd-value">Deal value</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-[#5f5f5f]">$</span>
                <Input
                  id="nd-value"
                  inputMode="numeric"
                  placeholder="50000"
                  value={form.value}
                  onChange={(e) => set("value", e.target.value.replace(/[^\d]/g, ""))}
                  className="pl-[23px]"
                />
              </div>
            </div>
          </div>
          <div className="mt-[15px]">
            <div className="mb-[11px] flex items-center justify-between text-[12px] leading-none">
              <span className="text-fg-soft">Win probability</span>
              <span className="font-semibold text-fg">{form.probability}%</span>
            </div>
            <Slider label="Win probability" value={form.probability} onValueChange={(v) => set("probability", v)} />
            <SegmentedMeter value={form.probability} segments={41} variant="bar" className="mt-[14px]" />
          </div>
        </div>
      </div>

      <Divider />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Plus className="size-[13px]" strokeWidth={2} />
          Create Deal
        </Button>
      </div>
    </form>
  );
}

export function NewDealDialog() {
  const open = useDeals((s) => s.newDealOpen);
  const stage = useDeals((s) => s.newDealStage);
  const close = useDeals((s) => s.closeNewDeal);
  const closeDate = useDeals((s) => s.newDealClose);
  const siteId = useDeals((s) => s.newDealSite);

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && close()}
      title="New Deal"
      description="Add a deal to the board. It lands in the stage you pick."
    >
      {open && <NewDealForm key={stage} initialStage={stage} initialClose={closeDate} siteId={siteId} onDone={close} />}
    </Modal>
  );
}
