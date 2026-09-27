"use client";

import { useCompanies } from "@/lib/use-companies";
import { Command } from "cmdk";
import { Dialog } from "radix-ui";
import { ArrowDown, ArrowUp, Calendar, CornerDownLeft, Search } from "lucide-react";
import { useState } from "react";
import { useCrm } from "@/lib/store";
import { ownerById } from "@/lib/data";
import { formatNumber, formatShortDate } from "@/lib/utils";
import { CompanyLogo } from "@/components/primitives/company-logo";
import { TagGroup } from "@/components/primitives/tag";
import { Avatar } from "@/components/primitives/avatar";
import { SegmentedMeter } from "@/components/primitives/meter";

/* Mobile shows company + win probability; the full column set appears from 768px. */
const GRID = "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[164px_217px_180px_80px_1fr_150px]";

/* Recently viewed accounts, shown before the user types (order from the reference). */
const RECENT = ["lvmh", "disney", "paypal", "united", "apple", "microsoft", "airbnb", "intercom"];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-[5px] border border-[#3a3a3a] bg-[#2a2a2a] px-[5px] text-[11px] font-medium leading-none text-fg-soft">
      {children}
    </span>
  );
}

export function SearchCommand() {
  const open = useCrm((s) => s.searchOpen);
  const setOpen = useCrm((s) => s.setSearchOpen);
  const companies = useCompanies();
  const openDetail = useCrm((s) => s.openDetail);

  const [query, setQuery] = useState("");

  // Empty query → recently viewed accounts; typing searches every company.
  const list = query
    ? companies
    : RECENT.map((id) => companies.find((c) => c.id === id)).filter((c) => c !== undefined);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setQuery("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[6px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-3 left-1/2 z-50 w-[960px] max-w-[calc(100vw-24px)] md:top-[116px] md:max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-xl border border-[#2a2a2a] bg-panel shadow-[0_24px_64px_rgba(0,0,0,0.6)] outline-none data-[state=open]:animate-pop-in"
        >
          <Dialog.Title className="sr-only">Search companies</Dialog.Title>
          <Command
            loop
            filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
          >
            <div className="flex h-12 items-center gap-[10px] border-b border-line-strong pr-4 pl-4">
              <Search className="size-[14px] text-fg-soft" strokeWidth={2} />
              <Command.Input
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search companies, owners, stages..."
                className="h-full flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-fg-muted"
              />
              <Kbd>Esc</Kbd>
            </div>

            <div
              className={`hidden h-[34px] items-center border-b border-line-strong px-4 text-[12px] leading-none text-fg-muted md:grid ${GRID}`}
            >
              <span>Company</span>
              <span>Segment &amp; Stage</span>
              <span>Account owner</span>
              <span className="text-right">Pipeline</span>
              <span className="text-right">Win probability</span>
              <span className="pl-4">Last interaction</span>
            </div>

            <Command.List className="max-h-[calc(100dvh-84px)] overflow-y-auto p-[6px] md:max-h-[364px]">
              <Command.Empty className="py-10 text-center text-[13px] text-fg-muted">No results.</Command.Empty>
              {list.map((c) => {
                const owner = ownerById(c.ownerId);
                return (
                  <Command.Item
                    key={c.id}
                    value={`${c.name} ${owner.name} ${c.tags.join(" ")} ${c.lastInteraction.type}`}
                    onSelect={() => {
                      setOpen(false);
                      openDetail(c.id);
                    }}
                    className={`grid h-11 cursor-pointer items-center gap-3 rounded-lg px-[10px] text-[14px] leading-none font-normal text-fg transition-colors duration-150 data-[selected=true]:bg-[#242424] md:gap-0 ${GRID}`}
                  >
                    <span className="flex min-w-0 items-center gap-[10px]">
                      <CompanyLogo id={c.id} src={c.logo} size={24} glyph={12} radius={6} />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <TagGroup tags={c.tags} className="hidden md:flex" />
                    <span className="hidden min-w-0 items-center gap-[6px] md:flex">
                      <Avatar name={owner.name} size={20} />
                      <span className="truncate">{owner.name}</span>
                    </span>
                    <span className="hidden text-right tabular-nums md:block">
                      <span className="mr-[5px] text-[#7f7f7f]">$</span>
                      {formatNumber(c.pipelineValue)}
                    </span>
                    <span className="flex items-center justify-end gap-3 md:gap-[17px]">
                      <SegmentedMeter value={c.winProbability} segments={15} className="hidden w-[60px] sm:flex" />
                      <span className="w-[29px] text-right tabular-nums">{c.winProbability}%</span>
                    </span>
                    <span className="hidden min-w-0 items-center pl-4 md:flex">
                      <Calendar className="mr-[5px] size-[13px] shrink-0" strokeWidth={1.75} />
                      <span className="whitespace-nowrap">{formatShortDate(c.lastInteraction.date)}</span>
                      <span className="mx-2 h-2 w-px shrink-0 bg-line-strong" />
                      <span className="truncate">{c.lastInteraction.type}</span>
                    </span>
                  </Command.Item>
                );
              })}
            </Command.List>

            <div className="hidden h-10 items-center gap-4 border-t border-line-strong px-4 text-[12px] text-fg-muted md:flex">
              <span className="flex items-center gap-[6px]">
                <Kbd>
                  <ArrowUp className="size-[10px]" strokeWidth={2.5} />
                </Kbd>
                <Kbd>
                  <ArrowDown className="size-[10px]" strokeWidth={2.5} />
                </Kbd>
                Navigate
              </span>
              <span className="flex items-center gap-[6px]">
                <Kbd>
                  <CornerDownLeft className="size-[10px]" strokeWidth={2.5} />
                </Kbd>
                Open
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
