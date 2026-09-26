"use client";

import { useState } from "react";
import { Popover } from "radix-ui";
import { Bell } from "lucide-react";
import { useCrm } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useTabIndicator } from "@/components/ui/use-tab-indicator";
import { Avatar } from "@/components/primitives/avatar";
import { CompanyLogo } from "@/components/primitives/company-logo";

export function NotificationsButton() {
  const notifications = useCrm((s) => s.notifications);
  const markAllRead = useCrm((s) => s.markAllRead);
  const markRead = useCrm((s) => s.markRead);
  const openDetail = useCrm((s) => s.openDetail);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [open, setOpen] = useState(false);
  const { ref: tabsRef, style: underline } = useTabIndicator(open ? tab : "closed");

  const unreadCount = notifications.filter((n) => n.unread).length;
  const list = tab === "all" ? notifications : notifications.filter((n) => n.unread);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-[30px] items-center justify-center rounded-full border border-white/[0.09] bg-[#1b1b1b] text-fg transition-colors hover:bg-[#232323] data-[state=open]:bg-[#232323]"
        >
          <Bell className="size-[14px]" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span className="absolute top-[6px] right-[7px] size-[6px] rounded-full bg-danger-dot ring-[1.5px] ring-[#1b1b1b]" />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          collisionPadding={12}
          className="z-50 w-[min(400px,calc(100vw-24px))] origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-xl border border-line-strong bg-panel shadow-[0_16px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
        >
          <div className="flex items-center justify-between px-4 pt-[19px] pb-[30px]">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-semibold leading-none text-fg">Notifications</span>
              {unreadCount > 0 && (
                <span className="flex h-[18px] min-w-[22px] items-center justify-center rounded-full bg-[#2a2a2a] px-[6px] text-[12px] font-medium text-fg-soft">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="text-[12px] text-fg-muted transition-colors hover:text-fg"
            >
              Mark all as read
            </button>
          </div>

          <div ref={tabsRef} className="relative flex gap-4 border-b border-line px-4">
            {(["all", "unread"] as const).map((t) => (
              <button
                key={t}
                type="button"
                data-active={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative pb-[12px] text-[12px] leading-none capitalize",
                  tab === t ? "font-semibold text-fg" : "text-fg-muted hover:text-fg-soft",
                )}
              >
                {t === "all" ? "All" : "Unread"}
                {tab === t && !underline && <span className="absolute inset-x-0 -bottom-px h-px bg-fg" />}
              </button>
            ))}
            {underline && (
              <span
                aria-hidden
                className="absolute -bottom-px h-px bg-fg transition-[left,width] duration-500 ease-(--ease-ios)"
                style={underline}
              />
            )}
          </div>

          <div className="flex max-h-[min(440px,calc(100dvh-190px))] flex-col gap-1 overflow-y-auto overscroll-contain p-[5px]">
            {list.length === 0 && (
              <div className="py-10 text-center text-[13px] text-fg-muted">You&apos;re all caught up.</div>
            )}
            {list.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  markRead(n.id);
                  openDetail(n.companyId);
                  setOpen(false);
                }}
                className={cn(
                  "no-press relative flex gap-3 rounded-lg px-3 pt-3 pb-[10px] text-left transition-colors active:bg-[#262626]",
                  n.unread ? "bg-[#1f1f1f] hover:bg-[#242424]" : "hover:bg-white/[0.03]",
                )}
              >
                <span className="relative h-fit shrink-0">
                  {n.actor ? (
                    <>
                      <Avatar name={n.actor} size={32} />
                      <span className="absolute -right-[3px] -bottom-[3px] rounded-[4px] ring-2 ring-panel">
                        <CompanyLogo id={n.companyId} size={13} glyph={9} radius={3} />
                      </span>
                    </>
                  ) : (
                    <CompanyLogo id={n.companyId} size={32} glyph={18} radius={8} />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[7px] pr-5">
                  <span className="text-[14px] leading-[17px] text-fg-soft">
                    {n.actor && <span className="font-semibold text-fg">{n.actor} </span>}
                    {n.text}
                  </span>
                  {n.quote && (
                    <span className="rounded-lg border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-[14px] leading-[16px] text-fg-soft">
                      {n.quote}
                    </span>
                  )}
                  <span className="text-[12px] leading-none text-fg-muted">
                    {n.time}
                    <span className="mx-[5px]">·</span>
                    {n.company}
                  </span>
                </span>
                {n.unread && <span className="absolute top-[18px] right-[14px] size-[6px] rounded-full bg-danger-dot" />}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
