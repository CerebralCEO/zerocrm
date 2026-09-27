"use client";

import { useCompanies } from "@/lib/use-companies";
import { useState } from "react";
import { Mail, Phone, RotateCcw, UserRound } from "lucide-react";
import { clearPersisted } from "@/lib/persist";
import { useCrm, sortCompanies } from "@/lib/store";
import { CURRENT_USER } from "@/lib/data";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
      <span className="text-[12px] leading-none text-fg-soft/80">{label}</span>
      <span className="text-[14px] font-medium leading-none text-fg">{value}</span>
    </div>
  );
}

export function ProfileSheet() {
  const open = useCrm((s) => s.profileOpen);
  const setOpen = useCrm((s) => s.setProfileOpen);
  const companies = useCompanies();
  const openDetail = useCrm((s) => s.openDetail);
  const setOwnerFilter = useCrm((s) => s.setOwnerFilter);
  const setStageFilter = useCrm((s) => s.setStageFilter);

  const sorted = sortCompanies(companies, "pipelineValue");
  const pipeline = companies.reduce((s, c) => s + c.pipelineValue, 0);
  const deals = companies.reduce((s, c) => s + c.openDeals, 0);
  const avg = companies.length ? Math.round(companies.reduce((s, c) => s + c.winProbability, 0) / companies.length) : 0;

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
      title="My Profile"
      icon={<UserRound className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[480px] md:max-w-full"
      footer={
        <>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button
            variant="primary"
            onClick={() => {
              // Clear table filters so every account is listed, then close.
              setOwnerFilter(null);
              setStageFilter(null);
              setOpen(false);
            }}
          >
            Show all accounts
          </Button>
        </>
      }
    >
      <section className="flex items-center gap-3 border-b border-line-strong px-5 pt-[19px] pb-[18px]">
        <Avatar name={CURRENT_USER.name} size={52} />
        <div className="flex flex-col gap-[8px]">
          <span className="text-[16px] font-semibold leading-none text-fg">{CURRENT_USER.name}</span>
          <span className="text-[12px] leading-none text-fg-soft/80">{CURRENT_USER.role}</span>
        </div>
      </section>

      <section className="border-b border-line-strong px-5 pt-[21px] pb-[15px]">
        <SectionLabel>Contact</SectionLabel>
        <div className="mt-[16px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium leading-none text-fg">
          <a href={`mailto:${CURRENT_USER.email}`} className="flex items-center gap-[5px] hover:underline">
            <Mail className="size-[12px] fill-fg-soft text-panel" strokeWidth={2} />
            {CURRENT_USER.email}
          </a>
          <span className="flex items-center gap-[5px]">
            <Phone className="size-[11px] fill-fg-soft text-fg-soft" strokeWidth={1.5} />
            {CURRENT_USER.phone}
          </span>
        </div>
      </section>

      <section className="border-b border-line-strong px-5 pt-[22px] pb-[20px]">
        <SectionLabel>Team Pipeline</SectionLabel>
        <div className="mt-[16px] grid grid-cols-2 gap-2">
          <Stat label="Accounts" value={String(companies.length)} />
          <Stat label="Open deals" value={String(deals)} />
          <Stat label="Pipeline" value={formatCurrency(pipeline)} />
          <Stat label="Avg. win" value={`${avg}%`} />
        </div>
      </section>

      <section className="px-5 pt-[19px] pb-4">
        <SectionLabel>Team Accounts</SectionLabel>
        <div className="mt-[14px] flex flex-col">
          {sorted.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setOpen(false);
                openDetail(c.id);
              }}
              className="no-press -mx-2 flex h-[52px] items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-white/[0.03] active:bg-white/[0.05]"
            >
              <CompanyLogo id={c.id} src={c.logo} size={32} glyph={16} radius={8} />
              <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <span className="truncate text-[14px] font-medium leading-none text-fg">{c.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-muted">
                  {c.openDeals} open deals · {c.tags.join(", ")}
                </span>
              </span>
              <span className="flex flex-col items-end gap-[6px]">
                <span className="text-[14px] font-medium leading-none text-fg tabular-nums">
                  <span className="mr-[4px] text-[#7f7f7f]">$</span>
                  {formatNumber(c.pipelineValue)}
                </span>
                <SegmentedMeter value={c.winProbability} segments={17} className="h-3 w-[60px] gap-px p-px" />
              </span>
            </button>
          ))}
        </div>
      </section>
      <DemoData />
    </Sheet>
  );
}

/** Everything you change is saved in this browser; this puts the demo back to its seed. */
function DemoData() {
  const [confirm, setConfirm] = useState(false);
  return (
    <section className="border-t border-line-strong px-5 pt-[21px] pb-[22px]">
      <SectionLabel>Demo Data</SectionLabel>
      <p className="mt-[12px] text-[12px] leading-[16px] text-fg-soft/80">
        Your changes are saved in this browser and sync across open tabs. Resetting restores the original demo companies, deals, activity and invoices.
      </p>
      <div className="mt-[14px] flex items-center gap-2">
        <Button
          onClick={() => {
            if (!confirm) return setConfirm(true);
            clearPersisted();
            window.location.reload();
          }}
          className={confirm ? "border-danger-dot/60 text-danger-dot" : undefined}
        >
          <RotateCcw className="size-[12px]" strokeWidth={2} />
          {confirm ? "Click again to reset" : "Reset demo data"}
        </Button>
        {confirm && <Button onClick={() => setConfirm(false)}>Cancel</Button>}
      </div>
    </section>
  );
}
