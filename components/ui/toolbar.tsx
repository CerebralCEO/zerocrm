"use client";

import { Popover } from "radix-ui";
import { ChevronDown, ListFilter, Plus, Upload } from "lucide-react";
import { Menu, MenuContent, MenuTrigger } from "@/components/ui/menu";

/** Split "Label | Value ▾" pill that opens a menu ({components.filter-chip}). */
export function FilterChip({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          className="group flex h-[30px] shrink-0 items-center rounded-full border whitespace-nowrap border-white/[0.09] bg-[#1b1b1b] text-[12px] leading-none outline-none transition-colors hover:border-white/[0.14] data-[state=open]:border-white/[0.16] focus-visible:ring-2 focus-visible:ring-white/10"
        >
          <span className="flex h-full items-center border-r border-white/[0.09] pr-[9px] pl-[8px] text-fg-muted">{label}</span>
          <span className="flex h-full items-center gap-[5px] pr-[9px] pl-[9px] font-medium text-fg">
            {value}
            <ChevronDown className="size-[12px] text-fg-soft transition-transform group-data-[state=open]:rotate-180" strokeWidth={2} />
          </span>
        </button>
      </MenuTrigger>
      <MenuContent>{children}</MenuContent>
    </Menu>
  );
}

export function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[30px] items-center gap-[5px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[9px] pl-[8px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323]"
    >
      <Upload className="size-[12px]" strokeWidth={2} />
      Export
    </button>
  );
}

export function PrimaryAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[30px] items-center gap-[5px] rounded-full border border-primary-border/60 bg-gradient-to-b from-[#4a2ffc] to-[#3a1fe6] pr-[8px] pl-[9px] text-[12px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition-[filter] hover:brightness-110"
    >
      <Plus className="size-[12px]" strokeWidth={1.75} />
      {label}
    </button>
  );
}

/**
 * The 62px page toolbar: filter chips on the left (collapsed into one
 * "Filters" popover on phones) and actions on the right.
 */
export function PageToolbar({
  filters,
  activeFilters = 0,
  actions,
}: {
  filters: React.ReactNode;
  activeFilters?: number;
  actions: React.ReactNode;
}) {
  return (
    <div className="flex h-[62px] shrink-0 items-center justify-between gap-3 border-b border-line px-4 md:gap-4">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex h-[30px] shrink-0 items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[10px] pl-[9px] text-[12px] font-medium text-fg transition-colors hover:bg-[#232323] data-[state=open]:bg-[#232323] md:hidden"
          >
            <ListFilter className="size-[13px]" strokeWidth={2} />
            Filters
            {activeFilters > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className="z-50 flex w-[min(300px,calc(100vw-24px))] origin-(--radix-popover-content-transform-origin) flex-col items-start gap-2 rounded-xl border border-line-strong bg-panel p-3 shadow-[0_16px_48px_rgba(0,0,0,0.55)] outline-none data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in md:hidden"
          >
            {filters}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <div className="hidden min-w-0 items-center gap-2 overflow-x-auto md:flex">{filters}</div>

      <div className="flex shrink-0 items-center gap-1">{actions}</div>
    </div>
  );
}

/** Download rows as a CSV file. */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const lines = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
