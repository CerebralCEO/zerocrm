"use client";

import { Dialog } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwipeDismiss } from "./use-swipe-dismiss";

type Base = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
};

function Overlay({ className }: { className?: string }) {
  return (
    <Dialog.Overlay
      className={cn(
        "fixed inset-0 z-40 bg-black/60 backdrop-blur-[6px] data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
        className,
      )}
    />
  );
}

/** Company Detail / My Profile drawer: bottom sheet on phones, right side from 768px. */
export function Sheet({
  open,
  onOpenChange,
  children,
  className,
  title,
  icon,
  footer,
}: Base & { title: string; icon: React.ReactNode; footer?: React.ReactNode }) {
  // Phones: drag the header down to dismiss, like an iOS sheet.
  const { panel: swipePanel, handle: swipeHandle } = useSwipeDismiss({ direction: "down", media: "(max-width: 767px)", onDismiss: () => onOpenChange(false) });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay />
        <Dialog.Content
          ref={swipePanel}
          aria-describedby={undefined}
          className={cn(
            // Phone: slides up from the bottom; from 768px: right-side drawer.
            "fixed inset-x-0 top-2 bottom-0 z-50 flex w-full flex-col overflow-hidden rounded-t-xl border-t border-line-strong bg-panel outline-none data-[state=closed]:animate-sheet-down data-[state=open]:animate-sheet-up",
            "md:inset-x-auto md:inset-y-0 md:right-0 md:rounded-none md:border-t-0 md:border-l md:data-[state=closed]:animate-sheet-out md:data-[state=open]:animate-sheet-in",
            className,
          )}
        >
          <div
            ref={swipeHandle}
            className="flex h-14 shrink-0 touch-none items-center justify-between border-b border-line-strong pr-3 pl-4 select-none sm:pr-[18px] sm:pl-6 md:touch-auto"
          >
            <Dialog.Title className="flex items-center gap-[9px] text-[14px] font-medium leading-none text-fg">
              {icon}
              {title}
            </Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="flex size-8 items-center justify-center rounded-md text-fg transition-colors hover:bg-white/[0.06] sm:size-6"
            >
              <X className="size-[15px]" strokeWidth={2} />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          {footer && (
            <div className="flex min-h-[62px] shrink-0 items-center justify-between gap-3 border-t border-line-strong px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** New Company modal: bottom sheet on phones, centered card from 640px. */
export function Modal({
  open,
  onOpenChange,
  children,
  className,
  title,
  description,
  dismissible = true,
}: Base & { title: string; description?: string; /** false = no close button, Esc, outside click or swipe (required steps). */ dismissible?: boolean }) {
  const { panel: swipePanel, handle: swipeHandle } = useSwipeDismiss({
    direction: "down",
    media: "(max-width: 639px)",
    onDismiss: () => dismissible && onOpenChange(false),
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Overlay className="bg-black/25" />
        <Dialog.Content
          ref={swipePanel}
          onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
          onPointerDownOutside={(e) => !dismissible && e.preventDefault()}
          onInteractOutside={(e) => !dismissible && e.preventDefault()}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-xl border border-[#2a2a2a] bg-panel shadow-[0_24px_64px_rgba(0,0,0,0.6)] outline-none",
            "data-[state=closed]:animate-sheet-down data-[state=open]:animate-sheet-up",
            "sm:inset-x-auto sm:top-[72px] sm:bottom-auto sm:left-1/2 sm:max-h-[calc(100dvh-96px)] sm:w-[560px] sm:max-w-[calc(100vw-32px)] sm:-translate-x-1/2 sm:rounded-xl sm:data-[state=closed]:animate-pop-out sm:data-[state=open]:animate-pop-in",
            className,
          )}
        >
          <div
            ref={swipeHandle}
            className="relative shrink-0 touch-none border-b border-line-strong px-4 pt-[21px] pb-[19px] select-none sm:touch-auto sm:px-6"
          >
            <Dialog.Title className="text-[16px] font-semibold leading-none text-fg">{title}</Dialog.Title>
            {description && (
              <Dialog.Description className="mt-[8px] text-[12px] leading-none text-fg-soft/80">
                {description}
              </Dialog.Description>
            )}
            {dismissible && (
              <Dialog.Close
                aria-label="Close"
                className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-white/[0.06] hover:text-fg sm:top-[16px] sm:right-[16px] sm:size-6"
              >
                <X className="size-[12px]" strokeWidth={2} />
              </Dialog.Close>
            )}
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function Button({
  variant = "secondary",
  className,
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-[30px] items-center justify-center gap-[5px] rounded-full px-[10px] text-[12px] font-medium leading-none transition-[filter,background-color,scale] disabled:opacity-50",
        variant === "primary"
          ? "border border-primary-border/60 bg-gradient-to-b from-[#4a2ffc] to-[#3a1fe6] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:brightness-110"
          : "border border-white/[0.09] bg-[#232323] text-fg hover:bg-[#2a2a2a]",
        className,
      )}
      {...props}
    />
  );
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("text-[12px] font-medium uppercase leading-none tracking-[1.1px] text-fg", className)}>
      {children}
    </div>
  );
}
