"use client";

import { DropdownMenu } from "radix-ui";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Menu = DropdownMenu.Root;
export const MenuTrigger = DropdownMenu.Trigger;

export function MenuContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Content>) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[180px] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-[10px] border border-line-strong bg-panel p-1 shadow-[0_12px_32px_rgba(0,0,0,0.5)]",
          "data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      />
    </DropdownMenu.Portal>
  );
}

export function MenuItem({
  className,
  selected,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenu.Item> & { selected?: boolean }) {
  return (
    <DropdownMenu.Item
      className={cn(
        "flex h-8 cursor-default items-center gap-2 rounded-md px-2 text-[13px] text-fg-soft outline-none select-none data-[highlighted]:bg-white/[0.06] data-[highlighted]:text-fg",
        className,
      )}
      {...props}
    >
      <span className="flex flex-1 items-center gap-2">{children}</span>
      {selected && <Check className="size-[14px] text-fg" strokeWidth={2} />}
    </DropdownMenu.Item>
  );
}

export function MenuSeparator() {
  return <DropdownMenu.Separator className="my-1 h-px bg-line-strong" />;
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu.Label className="px-2 pt-1.5 pb-1 text-[11px] font-medium uppercase tracking-[0.8px] text-fg-muted">
      {children}
    </DropdownMenu.Label>
  );
}
