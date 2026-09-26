"use client";

import { useRef, useState } from "react";
import { Building2, Plus } from "lucide-react";
import { useCrm, type NewCompanyInput } from "@/lib/store";
import { INTERACTION_TYPES, OWNERS, SEGMENTS, STAGES, ownerById, type InteractionType, type Tag } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Slider } from "@/components/ui/form";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

const today = () => new Date().toISOString().slice(0, 10);

const initial = (): Omit<NewCompanyInput, "pipelineValue" | "openDeals"> & {
  pipelineValue: string;
  openDeals: string;
} => ({
  name: "",
  logo: undefined,
  segment: "Enterprise",
  stage: "New Logo",
  ownerId: "sarah",
  pipelineValue: "",
  openDeals: "1",
  winProbability: 50,
  date: today(),
  type: "Discovery",
});

function Divider() {
  return <div className="h-px shrink-0 bg-line-strong" />;
}

export function NewCompanyDialog() {
  const open = useCrm((s) => s.newCompanyOpen);
  const setOpen = useCrm((s) => s.setNewCompanyOpen);
  const addCompany = useCrm((s) => s.addCompany);

  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const close = (o: boolean) => {
    setOpen(o);
    if (!o) {
      setForm(initial());
      setError(null);
      setLogoError(null);
    }
  };

  const readLogo = (file?: File) => {
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type)) return setLogoError("Use a PNG, JPG, WebP or SVG file.");
    if (file.size > MAX_LOGO_BYTES) return setLogoError("Logo must be 2 MB or smaller.");
    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => set("logo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setError("Company name is required.");
      return;
    }
    addCompany({
      ...form,
      name,
      pipelineValue: Number(form.pipelineValue) || 250000,
      openDeals: Math.max(0, Number(form.openDeals) || 0),
    });
    close(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={close}
      title="New Company"
      description="Add a company to the pipeline. It appears in the list right away."
    >
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Company */}
          <div className="px-4 pt-[19px] pb-[19px] sm:px-6">
            <SectionLabel className="font-normal text-fg-soft">Company</SectionLabel>
            <div
              className="mt-[17px] flex items-center gap-[16px]"
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                readLogo(e.dataTransfer.files[0]);
              }}
            >
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted-surface transition-colors",
                  dragging ? "border-primary-border" : "border-white/[0.06]",
                )}
                aria-label="Upload logo"
              >
                {form.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo} alt="" className="size-full object-cover" />
                ) : (
                  <Building2 className="size-[18px] text-[#8a8a8a]" strokeWidth={1.75} />
                )}
              </button>
              <div className="flex flex-col items-start gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-[30px] items-center rounded-full border border-white/[0.09] bg-[#1e1e1e] px-[8px] text-[12px] font-semibold text-fg transition-colors hover:bg-[#262626]"
                >
                  Upload logo
                </button>
                <span className={cn("text-[12px] leading-none", logoError ? "text-danger-dot" : "text-fg-muted")}>
                  {logoError ?? "PNG, JPG, WebP or SVG up to 2 MB. You can also drop a file here."}
                </span>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={LOGO_TYPES.join(",")}
                className="hidden"
                onChange={(e) => readLogo(e.target.files?.[0])}
              />
            </div>

            <div className="mt-[17px]">
              <Label htmlFor="nc-name">
                Company name <span className="text-fg-muted">*</span>
              </Label>
              <Input
                id="nc-name"
                autoFocus
                placeholder="Acme Inc."
                value={form.name}
                aria-invalid={!!error}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (error) setError(null);
                }}
                className={cn(error && "border-danger-dot/70 focus:border-danger-dot")}
              />
              {error && <p className="mt-[6px] text-[12px] text-danger-dot">{error}</p>}
            </div>

            <div className="mt-[15px] grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="nc-segment">Segment</Label>
                <Select
                  id="nc-segment"
                  value={form.segment}
                  onValueChange={(v) => set("segment", v as Tag)}
                  options={SEGMENTS.map((s) => ({ value: s, label: s }))}
                />
              </div>
              <div>
                <Label htmlFor="nc-stage">Stage</Label>
                <Select
                  id="nc-stage"
                  value={form.stage}
                  onValueChange={(v) => set("stage", v as Tag)}
                  options={STAGES.map((s) => ({ value: s, label: s }))}
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Ownership & deal */}
          <div className="px-4 pt-[19px] pb-[19px] sm:px-6">
            <SectionLabel className="font-normal text-fg-soft">Ownership &amp; Deal</SectionLabel>
            <div className="mt-[16px]">
              <Label htmlFor="nc-owner">Account owner</Label>
              <Select
                id="nc-owner"
                value={form.ownerId}
                onValueChange={(v) => set("ownerId", v)}
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

            <div className="mt-[15px] grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="nc-value">Pipeline value</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-[#5f5f5f]">$</span>
                  <Input
                    id="nc-value"
                    inputMode="numeric"
                    placeholder="250000"
                    value={form.pipelineValue}
                    onChange={(e) => set("pipelineValue", e.target.value.replace(/[^\d]/g, ""))}
                    className="pl-[23px]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="nc-deals">Open deals</Label>
                <Input
                  id="nc-deals"
                  type="number"
                  min={0}
                  value={form.openDeals}
                  onChange={(e) => set("openDeals", e.target.value)}
                  className="font-medium"
                />
              </div>
            </div>

            <div className="mt-[15px]">
              <div className="mb-[11px] flex items-center justify-between text-[12px] leading-none">
                <span className="text-fg-soft">Win probability</span>
                <span className="font-semibold text-fg">{form.winProbability}%</span>
              </div>
              <Slider label="Win probability" value={form.winProbability} onValueChange={(v) => set("winProbability", v)} />
              <SegmentedMeter value={form.winProbability} segments={41} variant="bar" className="mt-[14px]" />
            </div>
          </div>

          <Divider />

          {/* Last interaction */}
          <div className="px-4 pt-[19px] pb-[19px] sm:px-6">
            <SectionLabel className="font-normal text-fg-soft">Last Interaction</SectionLabel>
            <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="nc-date">Date</Label>
                <Input
                  id="nc-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="font-medium"
                />
              </div>
              <div>
                <Label htmlFor="nc-type">Type</Label>
                <Select
                  id="nc-type"
                  value={form.type}
                  onValueChange={(v) => set("type", v as InteractionType)}
                  options={INTERACTION_TYPES.map((t) => ({ value: t, label: t }))}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider />
        <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
          <Button onClick={() => close(false)}>Cancel</Button>
          <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
            <Plus className="size-[13px]" strokeWidth={2} />
            Create Company
          </Button>
        </div>
      </form>
    </Modal>
  );
}
