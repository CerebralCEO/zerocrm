"use client";

import { useRouter } from "next/navigation";
import { CalendarClock, Kanban, LineChart, Mail, UserRound, type LucideIcon } from "lucide-react";
import { useTeams } from "@/lib/teams-store";
import { useDeals } from "@/lib/deals-store";
import { useForecast } from "@/lib/forecast-store";
import { useActivities } from "@/lib/activities-store";
import { useCrm } from "@/lib/store";
import { stageById } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { dateOf, dayLabel, formatTime } from "@/lib/activities";
import type { TeamId } from "@/lib/teams";
import { cn, formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Tag } from "@/components/primitives/tag";
import { ActivityIcon } from "@/components/activities/shared";
import { STATUS_TONE, useTeamData } from "./use-team-data";

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

function Tile({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex h-[62px] min-w-0 flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
      <span className="truncate text-[12px] leading-none text-fg-soft/80">{label}</span>
      <span className={cn("truncate text-[14px] font-medium leading-none tabular-nums", tone ?? "text-fg")}>{value}</span>
    </div>
  );
}

export function RepSheet({ teamId }: { teamId: TeamId }) {
  const router = useRouter();
  const openRep = useTeams((s) => s.openRep);
  const close = () => useTeams.getState().openRepSheet(null);
  const { reps } = useTeamData(teamId);
  const r = reps.find((x) => x.member.ownerId === openRep);
  const openDeal = useDeals((s) => s.openDeal);
  const setDealsOwner = useDeals((s) => s.setOwnerFilter);
  const setForecastOwner = useForecast((s) => s.setOwnerFilter);
  const activities = useActivities((s) => s.activities);
  const companies = useCrm((s) => s.companies);
  const openCompany = useCrm((s) => s.openDetail);

  const owner = r ? ownerById(r.member.ownerId) : null;
  const accounts = r ? companies.filter((c) => c.ownerId === r.member.ownerId) : [];
  const recent = r
    ? activities.filter((a) => a.ownerId === r.member.ownerId && a.done).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4)
    : [];

  const go = (path: string, apply: () => void) => {
    apply();
    close();
    router.push(path);
  };

  return (
    <Sheet
      open={!!r}
      onOpenChange={(o) => !o && close()}
      title="Rep profile"
      icon={<UserRound className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[480px] md:max-w-full"
      footer={
        <>
          <span className="text-[12px] leading-none text-fg-muted">{r?.member.territory}</span>
          <div className="flex items-center gap-2">
            <Button onClick={close}>Close</Button>
            <Button variant="primary" onClick={() => r && go("/deals", () => setDealsOwner(r.member.ownerId))}>
              View Deals
            </Button>
          </div>
        </>
      }
    >
      {r && owner && (
        <>
          <Section className="pt-[19px] pb-[18px]">
            <div className="flex items-center gap-3">
              <Avatar name={owner.name} size={52} />
              <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="truncate text-[16px] font-semibold leading-none text-fg">{owner.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-soft/80">
                  {r.member.title} · {r.member.territory}
                </span>
              </div>
              <Tag tone={STATUS_TONE[r.status]} className="h-5 px-[7px] text-[12px]">
                {r.status}
              </Tag>
            </div>
            <div className="mt-[16px] grid grid-cols-4 gap-2">
              <ActionTile icon={Mail} label="Email" href={`mailto:${owner.email}`} />
              <ActionTile icon={Kanban} label="Deals" onClick={() => go("/deals", () => setDealsOwner(r.member.ownerId))} />
              <ActionTile icon={LineChart} label="Forecast" onClick={() => go("/forecast", () => setForecastOwner(r.member.ownerId))} />
              <ActionTile icon={CalendarClock} label="Activity" onClick={() => go("/activities", () => useActivities.getState().setOwnerFilter(r.member.ownerId))} />
            </div>
          </Section>

          <Section>
            <SectionLabel>Quota</SectionLabel>
            <div className="mt-[15px] flex items-end justify-between gap-3">
              <span className="text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg tabular-nums">
                {r.attainment}
                <span className="text-[18px] text-[#7f7f7f]">%</span>
              </span>
              <span className="text-right text-[12px] leading-[16px] text-fg-muted tabular-nums">
                <span className="text-fg-soft">${formatNumber(r.closed)}</span> of ${formatNumber(r.member.quota)}
                <br />
                projected <span className={r.projectedPct >= 100 ? "text-meter-green" : "text-fg-soft"}>{r.projectedPct}%</span> (${formatNumber(r.projected)})
              </span>
            </div>
            <SegmentedMeter value={Math.min(r.attainment, 100)} segments={64} variant="bar" className="mt-[14px]" />
            <div className="mt-[14px] grid grid-cols-2 gap-2">
              <Tile label="Open pipeline" value={formatCompactCurrency(r.pipeline)} />
              <Tile label="Avg win probability" value={`${r.avgWin}%`} />
              <Tile label="Open deals" value={String(r.openDeals.length)} />
              <Tile label="Activities · 7 days" value={String(r.activity7d)} />
            </div>
          </Section>

          <Section>
            <SectionLabel>Open Deals</SectionLabel>
            <div className="mt-[12px] flex flex-col">
              {r.openDeals.slice(0, 5).map((d) => {
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
              {r.openDeals.length === 0 && <p className="py-4 text-[13px] text-fg-muted">No open deals.</p>}
            </div>
          </Section>

          <Section>
            <SectionLabel>Accounts</SectionLabel>
            <div className="mt-[14px] flex flex-wrap gap-2">
              {accounts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    close();
                    openCompany(c.id);
                  }}
                  className="no-press flex h-[30px] items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[10px] pl-[5px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
                >
                  <CompanyLogo id={c.id} src={c.logo} size={20} glyph={11} radius={10} />
                  {c.name}
                </button>
              ))}
            </div>
          </Section>

          <Section className="border-b-0">
            <SectionLabel>Recent Activity</SectionLabel>
            <ol className="relative mt-[16px] flex flex-col gap-4 before:absolute before:top-2 before:bottom-2 before:left-[13.5px] before:w-px before:bg-line-strong">
              {recent.map((a) => (
                <li key={a.id} className="relative flex items-start gap-3">
                  <ActivityIcon kind={a.kind} size={28} />
                  <span className="flex min-w-0 flex-col gap-[6px] pt-[2px]">
                    <span className="text-[14px] leading-[17px] text-fg-soft">{a.body ? `${a.title} — ${a.body}` : a.title}</span>
                    <span className="text-[12px] leading-none text-fg-muted">
                      {dayLabel(dateOf(a.at))} · {formatTime(a.at)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Section>
        </>
      )}
    </Sheet>
  );
}
