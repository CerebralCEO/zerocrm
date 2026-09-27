import Link from "next/link";

/** Shown on the auth pages when Clerk keys aren't configured (open demo mode). */
export function AuthDisabled() {
  return (
    <div>
      <h1 className="text-[24px] leading-none font-semibold tracking-[-0.5px] text-fg">Sign-in isn&apos;t set up</h1>
      <p className="mt-3 text-[14px] leading-[20px] text-fg-soft/80">
        This ZeroCRM runs as an open demo. Add <code className="rounded bg-muted-surface px-1 text-[13px] text-fg">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{" "}
        <code className="rounded bg-muted-surface px-1 text-[13px] text-fg">CLERK_SECRET_KEY</code> to enable accounts.
      </p>
      <Link
        href="/companies"
        className="mt-7 flex h-9 w-full items-center justify-center rounded-full border border-primary-border/60 bg-gradient-to-b from-[#4a2ffc] to-[#3a1fe6] text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:brightness-110"
      >
        Open the demo
      </Link>
    </div>
  );
}
