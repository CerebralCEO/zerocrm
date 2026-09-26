"use client";

import { useState } from "react";
import { Building2, Calendar, ChevronDown, Clock, Mail, Phone, PhoneCall, Sparkles, Star } from "lucide-react";
import { useCrm } from "@/lib/store";
import { ownerById, type Company } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { TagPill } from "@/components/primitives/tag";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";

const RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

function RangePicker() {
  const [value, setValue] = useState("Last 30 Days");
  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          className="group flex h-[30px] items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[10px] pl-[10px] text-[12px] font-semibold text-fg outline-none transition-colors hover:bg-[#232323]"
        >
          {value}
          <ChevronDown className="size-[12px] text-fg-soft transition-transform group-data-[state=open]:rotate-180" strokeWidth={2} />
        </button>
      </MenuTrigger>
      <MenuContent align="end" className="min-w-[140px]">
        {RANGES.map((r) => (
          <MenuItem key={r} selected={r === value} onSelect={() => setValue(r)}>
            {r}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("border-b border-line-strong px-5 py-[26px]", className)}>{children}</section>;
}

function HealthRow({ label, value, color }: { label: string; value: number; color: "red" | "amber" | "green" }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between text-[12px] font-medium leading-none text-fg">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <SegmentedMeter value={value} segments={64} color={color} variant="bar" />
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: number }) {
  return (
    <div className="flex h-[62px] flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
      <span className="flex items-center gap-[5px] text-[12px] leading-none text-fg-soft/80">
        <Icon className="size-[12px] fill-fg-soft/80 text-[#161616]" strokeWidth={1.75} />
        {label}
      </span>
      <span className="text-[14px] font-medium leading-none text-fg">{value}</span>
    </div>
  );
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="flex h-[18px] items-center gap-px rounded-full bg-[#282a2d] pr-[18px] pl-[5px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          className="p-px"
        >
          <Star
            className={cn("size-[9px]", i <= value ? "fill-meter-green text-meter-green" : "fill-transparent text-transparent")}
            strokeWidth={2}
          />
        </button>
      ))}
    </span>
  );
}

function DetailBody({ company, ratings, setRating }: {
  company: Company;
  ratings: number[];
  setRating: (i: number, v: number) => void;
}) {
  const owner = ownerById(company.ownerId);
  const { emails, meetings, calls } = company.touches;

  return (
    <>
      <Section className="flex items-center gap-[11px] pt-[19px] pb-[18px]">
        <CompanyLogo id={company.id} src={company.logo} size={52} glyph={30} radius={12} />
        <div className="flex flex-col items-start gap-[9px]">
          <span className="text-[16px] font-semibold leading-none text-fg">{company.name}</span>
          <div className="flex flex-wrap gap-1">
            {company.tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
          </div>
        </div>
      </Section>

      <Section className="pt-[21px] pb-[23px]">
        <SectionLabel>Account Summary</SectionLabel>
        <div className="mt-[19px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium leading-none text-fg">
          <span className="flex items-center gap-2">
            <Avatar name={owner.name} size={20} />
            {owner.name}
          </span>
          <a href={`mailto:${owner.email}`} className="flex items-center gap-[5px] hover:underline">
            <Mail className="size-[12px] fill-fg-soft text-panel" strokeWidth={2} />
            {owner.email}
          </a>
          <span className="flex items-center gap-[5px]">
            <Phone className="size-[11px] fill-fg-soft text-fg-soft" strokeWidth={1.5} />
            {owner.phone}
          </span>
        </div>
      </Section>

      <Section className="pt-[21px] pb-[19px]">
        <SectionLabel>Pipeline Health</SectionLabel>
        <div className="mt-[15px] text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg">
          {company.winProbability}%
        </div>
        <div className="mt-[6px] text-[12px] leading-none text-fg-soft/80">Win probability across all open deals</div>
        <div className="mt-[13px] flex flex-col gap-[12px]">
          <HealthRow label="Discovery" value={company.health.discovery} color="red" />
          <HealthRow label="Evaluation" value={company.health.evaluation} color="amber" />
          <HealthRow label="Procurement" value={company.health.procurement} color="green" />
        </div>
      </Section>

      <Section className="pt-[20px] pb-[20px]">
        <div className="flex items-center justify-between">
          <SectionLabel>Activity Trend</SectionLabel>
          <RangePicker />
        </div>
        <div className="mt-[18px] flex items-end gap-[3px]">
          <span className="text-[24px] font-medium leading-[19px] tracking-[-0.5px] text-fg">{company.activityScore}</span>
          <Sparkline data={company.activity} />
        </div>
        <div className="mt-[9px] text-[12px] leading-none text-fg-soft/80">{company.activityNote}</div>
        <div className="mt-[13px] grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile icon={Sparkles} label="Total touches" value={company.touches.total} />
          <StatTile icon={Mail} label="Emails" value={emails} />
          <StatTile icon={Calendar} label="Meetings" value={meetings} />
          <StatTile icon={PhoneCall} label="Calls & notes" value={calls} />
        </div>
      </Section>

      <Section className="border-b-0 pt-[20px] pb-5">
        <div className="flex items-center justify-between">
          <SectionLabel>Score Card</SectionLabel>
          <RangePicker />
        </div>
        <div className="mt-[13px] flex flex-col gap-2">
          {company.scoreCards.map((card, i) => (
            <div key={i} className="rounded-lg border border-line-card bg-card px-4 pt-[15px] pb-[14px]">
              <div className="text-[16px] font-medium leading-none text-fg">{card.title}</div>
              <p className="mt-[9px] text-[14px] leading-[16px] text-fg-soft/80">{card.description}</p>
              <div className="mt-[13px] flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-[12px] leading-none">
                <div className="flex items-center gap-[8px]">
                  <span className="flex items-center gap-[5px] font-medium text-fg">
                    <Avatar name={card.author} size={12} />
                    {card.author}
                  </span>
                  <span className="flex items-center gap-[4px] text-fg-soft/80">
                    <Clock className="size-[11px] fill-fg-soft/70 text-panel" strokeWidth={2.5} />
                    {card.updated}
                  </span>
                </div>
                <div className="flex items-center gap-[5px] font-medium text-fg">
                  High potential SN
                  <Stars value={ratings[i] ?? card.rating} onChange={(v) => setRating(i, v)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

export function CompanyDetailSheet() {
  const detailId = useCrm((s) => s.detailId);
  const company = useCrm((s) => s.companies.find((c) => c.id === s.detailId));
  const openDetail = useCrm((s) => s.openDetail);
  const updateCompany = useCrm((s) => s.updateCompany);
  const [ratings, setRatings] = useState<Record<string, number[]>>({});

  const draft = company ? ratings[company.id] ?? company.scoreCards.map((c) => c.rating) : [];
  const close = () => {
    setRatings({});
    openDetail(null);
  };

  return (
    <Sheet
      open={!!detailId}
      onOpenChange={(o) => !o && close()}
      title="Companies Detail"
      icon={<Building2 className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[560px] md:max-w-full"
      footer={
        <>
          <a href="#" className="text-[14px] font-semibold text-fg underline underline-offset-[3px]">
            Need help? Ask us.
          </a>
          <div className="flex items-center gap-2">
            <Button onClick={close}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (company) {
                  updateCompany(company.id, {
                    scoreCards: company.scoreCards.map((c, i) => ({ ...c, rating: draft[i] ?? c.rating })),
                  });
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
      {company && (
        <DetailBody
          company={company}
          ratings={draft}
          setRating={(i, v) =>
            setRatings((r) => {
              const next = [...draft];
              next[i] = v;
              return { ...r, [company.id]: next };
            })
          }
        />
      )}
    </Sheet>
  );
}
