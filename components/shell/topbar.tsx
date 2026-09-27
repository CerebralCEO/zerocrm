"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { useCrm } from "@/lib/store";
import { CURRENT_USER } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/primitives/avatar";
import { NotificationsButton } from "./notifications";
import { useTabIndicator } from "@/components/ui/use-tab-indicator";

// Top tabs double as section navigation; entries without an href are not built yet.
const TABS: { label: string; href?: string }[] = [
  { label: "Companies", href: "/companies" },
  { label: "Deals", href: "/deals" },
  { label: "Forecast", href: "/forecast" },
];

const TITLES: Record<string, string> = {
  "/companies": "Companies",
  "/deals": "Deals Board",
  "/forecast": "Forecast",
  "/activities": "Activities",
  "/contacts": "Contacts",
  "/sequences": "Email Sequences",
  "/team/strategic-aes": "Strategic AEs",
  "/team/mid-market": "Mid Market",
  "/team/sdr-team": "SDR Team",
  "/reports/q1-forecast": "Q1 Forecast",
  "/reports/slipping-deals": "Slipping Deals",
  "/pipelines/north-america": "North America",
  "/pipelines/emea-enterprise": "EMEA Enterprise",
  "/pipelines/apac-expansion": "APAC Expansion",
};

export function Topbar() {
  const pathname = usePathname();
  // Sections outside the tab set (e.g. Activities) leave every tab inactive.
  const tab = TABS.find((t) => t.href && pathname.startsWith(t.href))?.label ?? null;
  const title = TITLES[pathname] ?? "Companies";
  const setSearchOpen = useCrm((s) => s.setSearchOpen);
  const setProfileOpen = useCrm((s) => s.setProfileOpen);
  const setNavOpen = useCrm((s) => s.setNavOpen);
  const { ref: tabsRef, style: underline } = useTabIndicator(tab ?? "none", 2);

  // ⌘K / Ctrl+K opens the command search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <header className="shrink-0 border-b border-line">
      <div className="flex h-[58px] items-center justify-between gap-3 pr-4 pl-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
            className="-ml-1 flex size-[30px] shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-[#1b1b1b] text-fg transition-colors hover:bg-[#232323] lg:hidden"
          >
            <Menu className="size-[15px]" strokeWidth={1.75} />
          </button>
          <h1 className="text-[17px] font-medium leading-none tracking-[-0.6px] text-fg">{title}</h1>
          <span className="flex h-5 items-center gap-1 rounded-full border border-white/[0.08] bg-[#222] pr-[5px] pl-[5px] text-[12px] font-medium leading-none text-fg">
            <span className="size-2 rounded-full bg-active" />
            Active
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="flex size-[30px] items-center justify-center rounded-full border border-white/[0.09] bg-[#1b1b1b] text-fg transition-colors hover:bg-[#232323]"
          >
            <Search className="size-[14px]" strokeWidth={1.75} />
          </button>
          <NotificationsButton />
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            aria-label="My profile"
            className="flex h-[30px] items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[4px] pl-[4px] text-[12px] font-normal tracking-[-0.1px] text-fg transition-colors hover:bg-[#232323] sm:pr-[8px]"
          >
            <Avatar name={CURRENT_USER.name} size={20} />
            <span className="hidden sm:inline">{CURRENT_USER.name}</span>
          </button>
        </div>
      </div>

      <nav ref={tabsRef} className="relative flex h-[44px] items-end gap-[17px] px-4">
        {TABS.map((t) => {
          const active = tab === t.label;
          const className = cn(
            "relative pb-[16px] text-[12px] leading-none transition-colors",
            active ? "font-medium text-fg" : "text-fg-muted hover:text-fg-soft",
          );
          const content = (
            <>
              {t.label}
              {active && !underline && <span className="absolute -inset-x-[2px] -bottom-px h-px bg-fg" />}
            </>
          );
          return t.href ? (
            <Link key={t.label} href={t.href} data-active={active} className={className}>
              {content}
            </Link>
          ) : (
            <button key={t.label} type="button" data-active={false} title="Coming soon" className={className}>
              {content}
            </button>
          );
        })}
        {tab && underline && (
          <span
            aria-hidden
            className="absolute -bottom-px h-px bg-fg transition-[left,width] duration-500 ease-(--ease-ios)"
            style={underline}
          />
        )}
      </nav>
    </header>
  );
}
