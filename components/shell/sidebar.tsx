"use client";

import {
  Book,
  Building2,
  ChartColumnBig,
  ChartNoAxesColumn,
  Clipboard,
  List,
  LocateFixed,
  Mail,
  ReceiptText,
  MessageCircleQuestion,
  Target,
  TriangleAlert,
  UserPlus,
  Users,
  WalletMinimal,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCrm } from "@/lib/store";
import { useSwipeDismiss } from "@/components/ui/use-swipe-dismiss";

type NavItem = { label: string; icon?: LucideIcon; badge?: string; dot?: string; href?: string };

const MAIN: NavItem[] = [
  { label: "Companies", icon: Building2, badge: "241", href: "/companies" },
  { label: "Deals Board", icon: Clipboard, href: "/deals" },
  { label: "Forecast", icon: ChartNoAxesColumn, badge: "9", href: "/forecast" },
  { label: "Activities", icon: List, href: "/activities" },
  { label: "Contacts", icon: Book, badge: "38", href: "/contacts" },
  { label: "Email Sequences", icon: Mail, href: "/sequences" },
  { label: "Invoices", icon: ReceiptText, href: "/invoices" },
];

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Team",
    items: [
      { label: "Strategic AEs", icon: Target, href: "/team/strategic-aes" },
      { label: "Mid Market", icon: LocateFixed, href: "/team/mid-market" },
      { label: "SDR Team", icon: Users, href: "/team/sdr-team" },
    ],
  },
  {
    title: "Reporting",
    items: [
      { label: "Q1 Forecast", icon: ChartColumnBig, href: "/reports/q1-forecast" },
      { label: "Slipping Deals", icon: TriangleAlert, href: "/reports/slipping-deals" },
    ],
  },
  {
    title: "Pipelines",
    items: [
      { label: "North America", dot: "#ffdb4b", href: "/pipelines/north-america" },
      { label: "EMEA Enterprise", dot: "#f25c8f", href: "/pipelines/emea-enterprise" },
      { label: "APAC Expansion", dot: "#8b7bff", href: "/pipelines/apac-expansion" },
    ],
  },
];

function BrandMark() {
  return <Image src="/logo/zerocrm-mark.png" alt="ZeroCRM" width={22} height={22} priority className="size-[22px]" />;
}

function NavRow({ item, active, onClick }: { item: NavItem; active?: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  const className = cn(
    "no-press group flex w-full items-center gap-[6px] rounded-lg px-[6px] text-left text-[14px] leading-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/10",
    active
      ? "mb-[3px] h-[32px] border border-white/[0.13] bg-nav-active font-medium text-fg shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
      : "h-[30px] border border-transparent font-medium text-fg-nav hover:bg-white/[0.03] hover:text-fg-soft active:bg-white/[0.05]",
  );
  const content = (
    <>
      {Icon ? (
        <Icon
          className={cn("size-[15px] shrink-0", active ? "text-fg" : "text-[#676767] group-hover:text-fg-soft")}
          strokeWidth={1.75}
        />
      ) : (
        <span className="flex size-[15px] items-center justify-center">
          <span className="size-2 rounded-full" style={{ background: item.dot }} />
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span
          className={cn(
            "flex h-4 min-w-6 items-center justify-center rounded-full border px-[5px] text-[12px] font-medium leading-none",
            active ? "border-white/15 bg-[#1e1e1e] text-fg-soft" : "border-white/10 bg-[#222] text-fg-soft",
          )}
        >
          {item.badge}
        </span>
      )}
    </>
  );
  // Routed items are links; the rest are placeholders for sections not built yet.
  return item.href ? (
    <Link href={item.href} onClick={onClick} aria-current={active ? "page" : undefined} className={className}>
      {content}
    </Link>
  ) : (
    <button type="button" title="Coming soon" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function SidebarContent({
  active,
  onNavigate,
  onClose,
}: {
  active: string;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const setProfileOpen = useCrm((s) => s.setProfileOpen);

  return (
    <>
      {/* Brand */}
      <div className="relative flex h-[57px] shrink-0 items-start gap-[6px] border-b border-line px-3 pt-2">
        <div className="flex size-[34px] items-center justify-center rounded-lg bg-white/[0.045] text-fg">
          <BrandMark />
        </div>
        <div className="mt-[5px] flex flex-col gap-1">
          <span className="text-[14px] font-medium leading-none tracking-[-0.1px] text-fg">ZeroCRM</span>
          <span className="text-[12px] leading-none text-fg-muted">Company pipeline</span>
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute top-[13px] right-3 flex size-[30px] items-center justify-center rounded-full border border-white/[0.09] bg-[#1b1b1b] text-fg"
          >
            <X className="size-[14px]" strokeWidth={2} />
          </button>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <div className="flex flex-col border-b border-line px-3 pt-3 pb-[13px]">
          {MAIN.map((item) => (
            <NavRow
              key={item.label}
              item={item}
              active={active === item.label}
              onClick={item.href ? onNavigate : undefined}
            />
          ))}
        </div>

        {SECTIONS.map((section, idx) => (
          <div
            key={section.title}
            className={cn(
              "flex flex-col px-3 pt-[11px] pb-[12px]",
              idx < SECTIONS.length - 1 && "border-b border-line",
            )}
          >
            <div className="mb-[5px] text-[11px] font-medium uppercase leading-none tracking-[1.7px] text-fg-faint">
              {section.title}
            </div>
            {section.items.map((item) => (
              <NavRow
                key={item.label}
                item={item}
                active={active === item.label}
                onClick={item.href ? onNavigate : undefined}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="flex flex-col border-t border-line px-3 py-3">
        <NavRow
          item={{ label: "Invite teammates", icon: UserPlus }}
          onClick={() => {
            onClose?.();
            setProfileOpen(true);
          }}
        />
        <NavRow item={{ label: "Help", icon: MessageCircleQuestion }} />
      </div>

      <div className="flex h-[69px] shrink-0 items-center justify-between border-t border-line pr-4 pb-[3px] pl-4">
        <div className="flex flex-col gap-[7px]">
          <span className="text-[14px] font-semibold leading-none text-fg">14 Days</span>
          <span className="text-[12px] leading-none text-fg-muted">Left on trials</span>
        </div>
        <button
          type="button"
          className="flex h-[30px] items-center gap-[6px] rounded-full border border-white/10 bg-[#232323] pr-[7px] pl-[8px] text-[14px] font-medium text-fg transition-colors hover:bg-[#2a2a2a]"
        >
          <WalletMinimal className="size-[12px]" strokeWidth={2} />
          Add Billings
        </button>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const active = [...MAIN, ...SECTIONS.flatMap((s) => s.items)].find((i) => i.href && pathname.startsWith(i.href))?.label ?? "";
  const navOpen = useCrm((s) => s.navOpen);
  const setNavOpen = useCrm((s) => s.setNavOpen);
  const { panel: swipePanel } = useSwipeDismiss({
    direction: "left",
    media: "(max-width: 1023px)",
    onDismiss: () => setNavOpen(false),
  });

  return (
    <>
      {/* Desktop: fixed column (≥1024px) */}
      <aside className="hidden h-full w-[254px] shrink-0 flex-col border-r border-line bg-sidebar lg:flex">
        <SidebarContent active={active} />
      </aside>

      {/* Mobile / tablet: off-canvas drawer */}
      <Dialog.Root open={navOpen} onOpenChange={setNavOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in lg:hidden" />
          <Dialog.Content
            ref={swipePanel}
            aria-describedby={undefined}
            className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] touch-pan-y flex-col border-r border-line bg-sidebar outline-none data-[state=closed]:animate-nav-out data-[state=open]:animate-nav-in lg:hidden"
          >
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <SidebarContent active={active} onNavigate={() => setNavOpen(false)} onClose={() => setNavOpen(false)} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
