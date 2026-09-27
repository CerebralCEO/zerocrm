"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Auth form field: {components.input} with a label, inline error and optional reveal toggle. */
export function AuthField({
  id,
  label,
  error,
  type = "text",
  aside,
  ...props
}: React.ComponentProps<"input"> & { id: string; label: string; error?: string | null; aside?: React.ReactNode }) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <div className="mb-[9px] flex items-center justify-between">
        <label htmlFor={id} className="text-[12px] leading-none text-fg-soft">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword && reveal ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-9 w-full rounded-lg border border-[#2e2e2e] bg-[#1e1e1e] px-3 text-[14px] text-fg outline-none transition-colors placeholder:text-[#5f5f5f] hover:border-[#3a3a3a] focus:border-[#666]",
            isPassword && "pr-10",
            error && "border-danger-dot/70 focus:border-danger-dot",
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={reveal ? "Hide password" : "Show password"}
            onClick={() => setReveal((r) => !r)}
            className="absolute top-1/2 right-[6px] flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg"
          >
            {reveal ? <EyeOff className="size-[14px]" strokeWidth={1.75} /> : <Eye className="size-[14px]" strokeWidth={1.75} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-[6px] text-[12px] leading-[16px] text-danger-dot">
          {error}
        </p>
      )}
    </div>
  );
}

/** Full-width 36px pill — primary (indigo gradient) or secondary. */
export function AuthButton({
  variant = "primary",
  loading,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { variant?: "primary" | "secondary"; loading?: boolean }) {
  return (
    <button
      disabled={loading || props.disabled}
      className={cn(
        "flex h-9 w-full items-center justify-center gap-2 rounded-full text-[13px] leading-none font-medium transition-[filter,background-color,scale] disabled:opacity-60",
        variant === "primary"
          ? "border border-primary-border/60 bg-gradient-to-b from-[#4a2ffc] to-[#3a1fe6] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:brightness-110"
          : "border border-white/[0.09] bg-[#1b1b1b] text-fg hover:bg-[#232323]",
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="size-[14px] animate-spin" strokeWidth={2} />}
      {children}
    </button>
  );
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-[15px]" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[12px] leading-none text-fg-muted">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 rounded-lg border border-[#4c2324] bg-[#3e1d1e] px-3 py-[9px] text-[12px] leading-[16px] text-[#fecaca]">
      {message}
    </p>
  );
}

/** Six single-digit boxes for email codes; paste fills them all. */
export function CodeInput({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: string | null }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, 6));
  };
  return (
    <div>
      <div className="flex gap-2" onPaste={(e) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (text) {
          e.preventDefault();
          onChange(text);
          refs.current[Math.min(text.length, 5)]?.focus();
        }
      }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${i + 1}`}
            maxLength={1}
            value={d}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(-1);
              setAt(i, v);
              if (v) refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !d) refs.current[i - 1]?.focus();
            }}
            className={cn(
              "h-11 w-full min-w-0 rounded-lg border border-[#2e2e2e] bg-[#1e1e1e] text-center text-[18px] font-medium text-fg tabular-nums outline-none transition-colors focus:border-[#666]",
              error && "border-danger-dot/70",
            )}
          />
        ))}
      </div>
      {error && <p className="mt-[6px] text-[12px] leading-[16px] text-danger-dot">{error}</p>}
    </div>
  );
}
