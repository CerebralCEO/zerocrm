import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthDisabled } from "@/components/auth/auth-disabled";
import { SignInForm } from "@/components/auth/sign-in-form";
import { AUTH_ENABLED } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in · ZeroCRM",
};

export default function SignInPage() {
  return (
    <AuthShell>
      {AUTH_ENABLED ? (
        <Suspense>
          <SignInForm />
        </Suspense>
      ) : (
        <AuthDisabled />
      )}
    </AuthShell>
  );
}
