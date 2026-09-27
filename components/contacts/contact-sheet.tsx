"use client";

import { useLiveContact } from "@/lib/use-contacts";
import { Building2, Mail, MapPin, NotebookPen, Phone, UserRound, type LucideIcon } from "lucide-react";
import { useContacts } from "@/lib/contacts-store";
import { useActivities } from "@/lib/activities-store";
import { useDeals, TODAY } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { addDays, dateOf, dayLabel, formatTime } from "@/lib/activities";
import { stageById } from "@/lib/deals";
import { ownerById } from "@/lib/data";
import { cn, formatNumber } from "@/lib/utils";
import { Sheet, Button, SectionLabel } from "@/components/ui/overlay";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { SegmentedMeter } from "@/components/primitives/meter";
import { Sparkline } from "@/components/primitives/sparkline";
import { Tag } from "@/components/primitives/tag";
import { ActivityIcon } from "@/components/activities/shared";
import { StarButton } from "./contact-card";
import { PersonaTag, isCold, touchLabel } from "./shared";

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("border-b border-line-strong px-5 pt-[21px] pb-[20px]", className)}>{children}</section>;
}

/** iOS contact-card action tile ({components.action-tile}). */
function ActionTile({ icon: Icon, label, href, onClick }: { icon: LucideIcon; label: string; href?: string; onClick?: () => void }) {
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

function InfoRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[43px] items-center gap-3 border-b border-line last:border-b-0">
      <Icon className="size-[14px] shrink-0 text-fg-muted" strokeWidth={1.75} />
      <span className="w-[72px] shrink-0 text-[12px] leading-none text-fg-muted">{label}</span>
      <span className="flex min-w-0 flex-1 items-center gap-[6px] truncate text-[14px] leading-none font-medium text-fg">{children}</span>
    </div>
  );
}

export function ContactSheet() {
  const openId = useContacts((s) => s.openId);
  const contact = useLiveContact(openId);
  const openContact = useContacts((s) => s.openContact);
  const company = useCrm((s) => (contact ? s.companies.find((c) => c.id === contact.companyId) : undefined));
  const openCompany = useCrm((s) => s.openDetail);
  const deals = useDeals((s) => s.deals);
  const openDeal = useDeals((s) => s.openDeal);
  const activities = useActivities((s) => s.activities);
  const openLog = useActivities((s) => s.openLog);

  const close = () => openContact(null);
  const companyDeals = contact ? deals.filter((d) => d.companyId === contact.companyId && d.stage !== "won") : [];
  const companyActivity = contact
    ? activities.filter((a) => a.companyId === contact.companyId && a.done).sort((a, b) => b.at.localeCompare(a.at))
    : [];
  // Weekly touches with the account over the last 14 weeks (oldest → newest).
  const weekly = Array.from({ length: 14 }, (_, i) => {
    const end = addDays(TODAY, -(13 - i) * 7);
    const start = addDays(end, -6);
    return companyActivity.filter((a) => dateOf(a.at) >= start && dateOf(a.at) <= end).length;
  });
  const owner = contact ? ownerById(contact.ownerId) : null;
  const cold = contact ? isCold(contact) : false;

  return (
    <Sheet
      open={!!openId}
      onOpenChange={(o) => !o && close()}
      title="Contact"
      icon={<UserRound className="size-[14px]" strokeWidth={1.75} />}
      className="md:w-[480px] md:max-w-full"
      footer={
        <>
          <button
            type="button"
            onClick={() => {
              if (!contact) return;
              const id = contact.companyId;
              close();
              openCompany(id);
            }}
            className="no-press text-[14px] font-semibold text-fg underline underline-offset-[3px]"
          >
            View company
          </button>
          <div className="flex items-center gap-2">
            <Button onClick={close}>Close</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!contact) return;
                const defaults = { companyId: contact.companyId, title: `Call with ${contact.name.split(" ")[0]}` };
                close();
                openLog(defaults);
              }}
            >
              Log Activity
            </Button>
          </div>
        </>
      }
    >
      {contact && company && owner && (
        <>
          <Section className="pt-[19px] pb-[18px]">
            <div className="flex items-center gap-3">
              <Avatar name={contact.name} size={52} />
              <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
                <span className="truncate text-[16px] font-semibold leading-none text-fg">{contact.name}</span>
                <span className="truncate text-[12px] leading-none text-fg-soft/80">
                  {contact.role} · {company.name}
                </span>
              </div>
              <StarButton contact={contact} />
            </div>
            <div className="mt-[14px] flex flex-wrap gap-1">
              {contact.personas.map((p) => (
                <PersonaTag key={p} persona={p} />
              ))}
            </div>
            <div className="mt-[16px] grid grid-cols-4 gap-2">
              <ActionTile icon={Mail} label="Email" href={`mailto:${contact.email}`} />
              <ActionTile icon={Phone} label="Call" href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} />
              <ActionTile
                icon={NotebookPen}
                label="Log"
                onClick={() => {
                  const defaults = { companyId: contact.companyId, title: `Call with ${contact.name.split(" ")[0]}` };
                  close();
                  openLog(defaults);
                }}
              />
              <ActionTile
                icon={Building2}
                label="Company"
                onClick={() => {
                  const id = contact.companyId;
                  close();
                  openCompany(id);
                }}
              />
            </div>
          </Section>

          <Section className="py-[10px]">
            <InfoRow icon={Mail} label="Email">
              <a href={`mailto:${contact.email}`} className="truncate hover:underline">
                {contact.email}
              </a>
            </InfoRow>
            <InfoRow icon={Phone} label="Phone">
              <span className="tabular-nums">{contact.phone}</span>
            </InfoRow>
            <InfoRow icon={MapPin} label="Location">
              {contact.location}
            </InfoRow>
            <InfoRow icon={UserRound} label="Owner">
              <Avatar name={owner.name} size={18} />
              {owner.name}
            </InfoRow>
          </Section>

          <Section>
            <SectionLabel>Relationship</SectionLabel>
            <div className="mt-[15px] flex items-end justify-between gap-3">
              <span className="text-[28px] font-semibold leading-none tracking-[-0.5px] text-fg tabular-nums">{contact.strength}</span>
              <span className="flex flex-col items-end gap-[6px]">
                {/* Sparkline takes pixel heights (max 14) — scale counts to fit. */}
                <Sparkline data={weekly.map((v) => Math.round((v / Math.max(...weekly, 1)) * 14))} />
                <span className="text-[11px] leading-none text-fg-muted">Account touches · 14 weeks</span>
              </span>
            </div>
            <div className={cn("mt-[6px] text-[12px] leading-none", cold ? "text-danger-dot" : "text-fg-soft/80")}>
              {contact.strength >= 70 ? "Warm" : contact.strength >= 45 ? "Developing" : "Weak"} · last touch {touchLabel(contact).toLowerCase()}
              {cold && " — going cold"}
            </div>
            <SegmentedMeter value={contact.strength} segments={64} variant="bar" className="mt-[14px]" />
          </Section>

          <Section>
            <SectionLabel>Open Deals</SectionLabel>
            <div className="mt-[12px] flex flex-col">
              {companyDeals.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    close();
                    openDeal(d.id);
                  }}
                  className="no-press -mx-2 flex h-[43px] items-center gap-3 rounded-md border-b border-line px-2 text-left transition-colors last:border-b-0 hover:bg-row-hover"
                >
                  <CompanyLogo id={d.companyId} src={company.logo} size={20} glyph={11} radius={5} />
                  <span className="min-w-0 flex-1 truncate text-[14px] leading-none font-medium text-fg">{d.title}</span>
                  <Tag tone={stageById(d.stage).tone} className="max-sm:hidden">
                    {stageById(d.stage).label}
                  </Tag>
                  <span className="text-[14px] leading-none font-[450] text-fg tabular-nums">
                    <span className="mr-[4px] text-[#7f7f7f]">$</span>
                    {formatNumber(d.value)}
                  </span>
                </button>
              ))}
              {companyDeals.length === 0 && <p className="py-4 text-[13px] text-fg-muted">No open deals with {company.name}.</p>}
            </div>
          </Section>

          <Section className="border-b-0">
            <SectionLabel>Recent Activity</SectionLabel>
            <ol className="relative mt-[16px] flex flex-col gap-4 before:absolute before:top-2 before:bottom-2 before:left-[13.5px] before:w-px before:bg-line-strong">
              {companyActivity.slice(0, 4).map((a) => (
                <li key={a.id} className="relative flex items-start gap-3">
                  <ActivityIcon kind={a.kind} size={28} />
                  <span className="flex min-w-0 flex-col gap-[6px] pt-[2px]">
                    <span className="text-[14px] leading-[17px] text-fg-soft">{a.body ? `${a.title} — ${a.body}` : a.title}</span>
                    <span className="text-[12px] leading-none text-fg-muted">
                      {dayLabel(dateOf(a.at))} · {formatTime(a.at)} · {ownerById(a.ownerId).name}
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
