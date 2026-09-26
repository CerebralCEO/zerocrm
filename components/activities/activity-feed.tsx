"use client";

import { useState } from "react";
import { useActivities } from "@/lib/activities-store";
import { useDeals } from "@/lib/deals-store";
import { useCrm } from "@/lib/store";
import { dateOf, dayLabel, formatTime, type Activity } from "@/lib/activities";
import { ownerById } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/overlay";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { ActivityIcon, useFeed } from "./shared";

const VERB: Record<Activity["kind"], string> = {
  call: "called",
  email: "emailed",
  meeting: "met with",
  note: "added a note on",
  task: "completed a task for",
};

const PAGE = 6; // day groups per page

function FeedItem({ a }: { a: Activity }) {
  const company = useCrm((s) => s.companies.find((c) => c.id === a.companyId));
  const deal = useDeals((s) => (a.dealId ? s.deals.find((d) => d.id === a.dealId) : undefined));
  const openCompany = useCrm((s) => s.openDetail);
  const openDeal = useDeals((s) => s.openDeal);
  const isNew = useActivities((s) => s.lastAddedId === a.id);
  const owner = ownerById(a.ownerId);
  const body = a.kind === "task" ? a.title : a.body;

  return (
    <li
      className={cn(
        "relative flex gap-3 rounded-lg pb-5 last:pb-0",
        // timeline spine between icons
        "before:absolute before:top-9 before:bottom-1 before:left-[15.5px] before:w-px before:bg-line last:before:hidden",
        isNew && "animate-row-in",
      )}
    >
      <ActivityIcon kind={a.kind} />
      <div className="min-w-0 flex-1 pt-[2px]">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] leading-[18px] text-fg-soft">
            <span className="font-semibold text-fg">{owner.name}</span> {VERB[a.kind]}{" "}
            <button
              type="button"
              onClick={() => openCompany(a.companyId)}
              className="no-press font-medium text-fg underline-offset-[3px] hover:underline"
            >
              {company?.name ?? a.companyId}
            </button>
          </p>
          <span className="shrink-0 pt-[2px] text-[12px] leading-none text-fg-muted tabular-nums">{formatTime(a.at)}</span>
        </div>

        {body &&
          (a.kind === "note" ? (
            <p className="mt-2 rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-[14px] leading-[18px] text-fg-soft">{body}</p>
          ) : (
            <p className="mt-[6px] text-[12px] leading-[16px] text-fg-soft/80">{body}</p>
          ))}

        {deal && (
          <button
            type="button"
            onClick={() => openDeal(deal.id)}
            className="no-press mt-[10px] inline-flex h-[22px] max-w-full items-center gap-[6px] rounded-full border border-line-card bg-card pr-[9px] pl-[4px] text-[12px] leading-none text-fg-soft transition-colors hover:border-[#3a3c3f] hover:text-fg"
          >
            <CompanyLogo id={a.companyId} src={company?.logo} size={14} glyph={8} radius={7} />
            <span className="truncate">{deal.title}</span>
          </button>
        )}
      </div>
    </li>
  );
}

/** Day-grouped activity timeline with sticky day headers and "show older" paging. */
export function ActivityFeed() {
  const feed = useFeed();
  const [pages, setPages] = useState(1);

  const groups: { date: string; items: Activity[] }[] = [];
  for (const a of feed) {
    const date = dateOf(a.at);
    const last = groups.at(-1);
    if (last?.date === date) last.items.push(a);
    else groups.push({ date, items: [a] });
  }
  const visible = groups.slice(0, pages * PAGE);

  return (
    <section className="flex min-w-0 flex-col px-4 pt-[18px] pb-6">
      <header className="flex flex-col gap-[7px]">
        <h2 className="text-[14px] font-medium leading-none text-fg">Activity feed</h2>
        <p className="text-[12px] leading-none text-fg-muted">
          <span className="text-fg-soft tabular-nums">{feed.length}</span> activities logged by the team
        </p>
      </header>

      {visible.map((g) => (
        <div key={g.date} className="mt-5">
          {/* Sticky day header, iOS-list style */}
          <div className="sticky top-0 z-[2] -mx-4 flex items-center gap-2 bg-app/90 px-4 py-2 backdrop-blur-[6px]">
            <span className="text-[12px] font-medium uppercase leading-none tracking-[1.1px] text-fg">{dayLabel(g.date)}</span>
            <span className="text-[12px] leading-none text-fg-muted">· {g.items.length}</span>
          </div>
          <ol className="mt-3 flex flex-col">
            {g.items.map((a) => (
              <FeedItem key={a.id} a={a} />
            ))}
          </ol>
        </div>
      ))}

      {feed.length === 0 && <p className="py-16 text-center text-[13px] text-fg-muted">No activity for these filters.</p>}

      {groups.length > visible.length && (
        <Button className="mt-6 self-center" onClick={() => setPages((p) => p + 1)}>
          Show older activity
        </Button>
      )}
    </section>
  );
}
