"use client";

import { useRouter } from "next/navigation";
import { Kanban, Mail, Send, UserRound, Users, type LucideIcon } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import { useDeals } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { stageById } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";
import { Tag } from "@/components/primitives/tag";
import { STATUS_TONE, toSpark } from "../use-team-data";
import { useSdrData } from "./use-sdr-data";

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("border-b border-line-strong px-5 pt-[21px] pb-[20px]", className)}>{children}</section>;
}

function ActionTile({ icon: Icon, label, onClick, href }: { icon: LucideIcon; label: string; onClick?: () => void; href?: string }) {
  const cls =
    "flex h-[62px] flex-col items-center justify-center gap-[8px] rounded-lg border border-line-card bg-card text-[12px] leading-none text-fg-soft transition-colors hover:border-[#3a3c3f] hover:text-fg active:bg-[#1e2023]";
  const inner = (
    <>
      <Icon className="size-[16px] text-fg" strokeWidth={1.75} />
      {label}
    </>
  );
  return href ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[62px] min-w-0 flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
      <span className="truncate text-[12px] leading-none text-fg-soft/80">{label}</span>
      <span className="truncate text-[14px] font-medium leading-none text-fg tabular-nums">{value}</span>
    </div>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, ".");

export function SdrSheet() {
  const router = useRouter();
  const openRep = useTeams((s) => s.openRep);
  const close = () => useTeams.getState().openRepSheet(null);
  const { reps } = useSdrData();
  const r = reps.find((x) => x.member.id === openRep);
  const openDeal = useDeals((s) => s.openDeal);
  const setDealsOwner = useDeals((s) => s.setOwnerFilter);
  const companies = useCrm((s) => s.companies);
  const partner = r ? ownerById(r.member.partnerId) : null;

  const go = (path: string, apply?: () => void) => {
    apply?.();
    close();
    router.push(path);
  };

  return (
    <Sheet
      open={!!r}
      onOpenChange={(o) => !o && close()}
      title="SDR profile"
      icon={<UserRound className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[480px] md:max-w-full"
      footer={
        <>
          <span className="text-[12px] leading-none text-fg-muted">{r?.member.territory}</span>
          <div className="flex items-center gap-2">
            <Button onClick={close}>Close</Button>
            <Button variant="primary" onClick={() => go("/sequences")}>
              Sequences
            </Button>
          </div>
        </>
      }
    >
      {r && partner && (
        <>
          <Section className="pt-[19px] pb-[18px]">
            <div className="flex items-center gap-3">
              <Avatar name={r.member.name} size={52} />
              <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="truncate text-[16px] font-semibold leading-none text-fg">{r.member.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-soft/80">
                  {r.member.title} · {r.member.territory}
                </span>
              </div>
              <Tag tone={STATUS_TONE[r.status]} className="h-5 px-[7px] text-[12px]">
                {r.status}
              </Tag>
            </div>
            <div className="mt-[16px] grid grid-cols-4 gap-2">
              <ActionTile icon={Mail} label="Email" href={`mailto:${slug(r.member.name)}@crm.com`} />
              <ActionTile icon={Send} label="Sequences" onClick={() => go("/sequences")} />
              <ActionTile icon={Kanban} label="AE deals" onClick={() => go("/deals", () => setDealsOwner(r.member.partnerId))} />
              <ActionTile icon={Users} label="Contacts" onClick={() => go("/contacts")} />
            </div>
          </Section>

          <Section>
            <SectionLabel>Meetings</SectionLabel>
            <div className="mt-[15px] flex items-end justify-between gap-3">
              <span className="text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg tabular-nums">
                {r.meetings}
                <span className="text-[18px] text-[#7f7f7f]">/{r.member.meetingQuota}</span>
              </span>
              <span className="flex flex-col items-end gap-[6px]">
                <Sparkline data={toSpark(r.member.weekly)} />
                <span className="text-[11px] leading-none text-fg-muted">Meetings per week · 14 weeks</span>
              </span>
            </div>
            <div className="mt-[6px] text-[12px] leading-none text-fg-soft/80">
              {r.attainment}% of quota · pacing{" "}
              <span className={r.projectedPct >= 100 ? "text-meter-green" : ""}>{r.projectedPct}%</span> by period end
            </div>
            <SegmentedMeter value={Math.min(r.attainment, 100)} segments={64} variant="bar" className="mt-[14px]" />
            <div className="mt-[14px] grid grid-cols-2 gap-2">
              <Tile label="Calls" value={formatNumber(r.calls)} />
              <Tile label="Emails" value={formatNumber(r.emails)} />
              <Tile label="Connect rate" value={`${r.connectRate}%`} />
              <Tile label="Pipeline sourced" value={formatCompactCurrency(r.sourcedValue)} />
            </div>
          </Section>

          <Section>
            <SectionLabel>Partner AE</SectionLabel>
            <div className="mt-[14px] flex items-center gap-3">
              <Avatar name={partner.name} size={32} />
              <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <span className="truncate text-[14px] leading-none font-medium text-fg">{partner.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-muted">{partner.email}</span>
              </span>
              <Button onClick={() => go("/deals", () => setDealsOwner(r.member.partnerId))}>View deals</Button>
            </div>
          </Section>

          <Section className="border-b-0">
            <SectionLabel>Sourced Deals</SectionLabel>
            <div className="mt-[12px] flex flex-col">
              {r.sourcedDeals.map((d) => {
                const company = companies.find((c) => c.id === d.companyId);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      close();
                      openDeal(d.id);
                    }}
                    className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left transition-colors last:border-b-0 hover:bg-row-hover"
                  >
                    <CompanyLogo id={d.companyId} src={company?.logo} size={20} glyph={11} radius={5} />
                    <span className="min-w-0 flex-1 truncate text-[14px] leading-none font-medium text-fg">{d.title}</span>
                    <Tag tone={stageById(d.stage).tone} className="max-sm:hidden">
                      {stageById(d.stage).label}
                    </Tag>
                    <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
                      <span className="mr-[4px] text-[#7f7f7f]">$</span>
                      {formatNumber(d.value)}
                    </span>
                  </button>
                );
              })}
              {r.sourcedDeals.length === 0 && <p className="py-4 text-[13px] text-fg-muted">No sourced deals yet.</p>}
            </div>
          </Section>
        </>
      )}
    </Sheet>
  );
}
