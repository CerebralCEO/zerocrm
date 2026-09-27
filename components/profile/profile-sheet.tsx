"use client";

import { useCompanies } from "@/lib/use-companies";
import { Clock, Globe2, Mail, Phone, UserRound, Users } from "lucide-react";
import { useCrm, sortCompanies } from "@/lib/store";
import { useCurrentUser } from "@/lib/current-user";
import { AUTH_ENABLED } from "@/lib/auth";
import { useProfile } from "@/lib/profile-store";
import { SignOutButton } from "@clerk/nextjs";
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
  const CURRENT_USER = useCurrentUser();
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
        {CURRENT_USER.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={CURRENT_USER.imageUrl} alt="" width={52} height={52} className="size-[52px] rounded-full object-cover" />
        ) : (
          <Avatar name={CURRENT_USER.name} size={52} />
        )}
        <div className="flex flex-col gap-[8px]">
          <span className="text-[16px] font-semibold leading-none text-fg">{CURRENT_USER.name}</span>
          {(CURRENT_USER.role || CURRENT_USER.team) && (
            <span className="text-[12px] leading-none text-fg-soft/80">{[CURRENT_USER.role, CURRENT_USER.team].filter(Boolean).join(" · ")}</span>
          )}
        </div>
      </section>

      <section className="border-b border-line-strong px-5 pt-[21px] pb-[15px]">
        <SectionLabel>Contact</SectionLabel>
        <div className="mt-[16px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium leading-none text-fg">
          {CURRENT_USER.email && (
            <a href={`mailto:${CURRENT_USER.email}`} className="flex items-center gap-[5px] hover:underline">
              <Mail className="size-[12px] fill-fg-soft text-panel" strokeWidth={2} />
              {CURRENT_USER.email}
            </a>
          )}
          {CURRENT_USER.phone && (
            <span className="flex items-center gap-[5px]">
              <Phone className="size-[11px] fill-fg-soft text-fg-soft" strokeWidth={1.5} />
              {CURRENT_USER.phone}
            </span>
          )}
        </div>
        {(CURRENT_USER.region || CURRENT_USER.timezone) && (
          <div className="mt-[12px] flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] leading-none text-fg-soft">
            {CURRENT_USER.region && (
              <span className="flex items-center gap-[5px]">
                <Globe2 className="size-[12px] text-fg-muted" strokeWidth={1.75} />
                {CURRENT_USER.region}
              </span>
            )}
            {CURRENT_USER.team && (
              <span className="flex items-center gap-[5px]">
                <Users className="size-[12px] text-fg-muted" strokeWidth={1.75} />
                {CURRENT_USER.team}
              </span>
            )}
            {CURRENT_USER.timezone && (
              <span className="flex items-center gap-[5px]">
                <Clock className="size-[12px] text-fg-muted" strokeWidth={1.75} />
                {CURRENT_USER.timezone}
              </span>
            )}
          </div>
        )}
        {CURRENT_USER.bio && <p className="mt-[12px] text-[12px] leading-[16px] text-fg-soft/80">{CURRENT_USER.bio}</p>}
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
      {AUTH_ENABLED && <Account />}
    </Sheet>
  );
}

/** Signed-in session controls (Clerk) and profile editing. */
function Account() {
  const canEdit = useProfile((s) => s.required);
  const openEditor = useProfile((s) => s.openEditor);
  return (
    <section className="border-t border-line-strong px-5 pt-[21px] pb-[22px]">
      <SectionLabel>Account</SectionLabel>
      <p className="mt-[12px] text-[12px] leading-[16px] text-fg-soft/80">You&apos;re signed in with Clerk. Signing out ends this session on this device.</p>
      <div className="mt-[14px] flex items-center gap-2">
        {canEdit && <Button onClick={() => openEditor(true)}>Edit profile</Button>}
        <SignOutButton redirectUrl="/sign-in">
          <Button>Sign out</Button>
        </SignOutButton>
      </div>
    </section>
  );
}
