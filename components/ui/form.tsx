"use client";

import { Select as RSelect, Slider as RSlider } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Label({ children, htmlFor, className }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-[9px] block text-[12px] leading-none text-fg-soft", className)}>
      {children}
    </label>
  );
}

const FIELD =
  "h-9 w-full rounded-lg border border-[#2e2e2e] bg-[#1e1e1e] px-3 text-[14px] text-fg outline-none transition-colors placeholder:text-[#5f5f5f] hover:border-[#3a3a3a] focus:border-[#666] focus-visible:border-[#666]";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(FIELD, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(FIELD, "h-auto min-h-[84px] resize-none py-[9px] leading-[18px]", className)} {...props} />;
}

export function Select({
  value,
  onValueChange,
  options,
  renderValue,
  renderOption,
  id,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: { value: string; label: string }[];
  renderValue?: (v: string) => React.ReactNode;
  renderOption?: (v: string) => React.ReactNode;
  id?: string;
}) {
  return (
    <RSelect.Root value={value} onValueChange={onValueChange}>
      <RSelect.Trigger
        id={id}
        className={cn(FIELD, "flex items-center justify-between gap-2 pr-[12px] text-left font-medium data-[state=open]:border-[#666]")}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          {renderValue ? renderValue(value) : <RSelect.Value />}
        </span>
        <RSelect.Icon>
          <ChevronDown className="size-[13px] text-fg-soft" strokeWidth={2} />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={6}
          className="z-[60] max-h-[280px] w-[var(--radix-select-trigger-width)] origin-(--radix-select-content-transform-origin) overflow-hidden rounded-[10px] border border-line-strong bg-panel p-1 shadow-[0_12px_32px_rgba(0,0,0,0.5)] data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in"
        >
          <RSelect.Viewport>
            {options.map((o) => (
              <RSelect.Item
                key={o.value}
                value={o.value}
                className="flex h-8 cursor-default items-center gap-2 rounded-md px-2 text-[13px] text-fg-soft outline-none select-none data-[highlighted]:bg-white/[0.06] data-[highlighted]:text-fg"
              >
                <span className="flex flex-1 items-center gap-2">
                  {renderOption?.(o.value)}
                  <RSelect.ItemText>{o.label}</RSelect.ItemText>
                </span>
                <RSelect.ItemIndicator>
                  <Check className="size-[14px] text-fg" strokeWidth={2} />
                </RSelect.ItemIndicator>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}

export function Slider({
  value,
  onValueChange,
  label,
  min = 0,
  max = 100,
  step = 1,
}: {
  value: number;
  onValueChange: (v: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <RSlider.Root
      value={[value]}
      onValueChange={([v]) => onValueChange(v)}
      min={min}
      max={max}
      step={step}
      aria-label={label}
      className="relative flex h-4 w-full touch-none items-center select-none"
    >
      <RSlider.Track className="relative h-1 grow overflow-hidden rounded-full bg-[#333]">
        <RSlider.Range className="absolute h-full rounded-full bg-[#a4a4a4]" />
      </RSlider.Track>
      <RSlider.Thumb className="block size-4 rounded-full bg-fg shadow-[0_1px_3px_rgba(0,0,0,0.5)] outline-none focus-visible:ring-4 focus-visible:ring-white/15" />
    </RSlider.Root>
  );
}
