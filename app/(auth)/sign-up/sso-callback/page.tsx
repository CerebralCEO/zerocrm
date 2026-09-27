import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/auth-shell";
import { AUTH_ENABLED } from "@/lib/auth";

/** Finishes Google sign-in; Clerk routes on to the app (or back for missing details). */
export default function SsoCallback() {
  return (
    <AuthShell>
      <p className="text-center text-[14px] text-fg-soft/80">Finishing sign-in…</p>
      {AUTH_ENABLED && <AuthenticateWithRedirectCallback />}
    </AuthShell>
  );
}
