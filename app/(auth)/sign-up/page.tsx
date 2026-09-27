import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthDisabled } from "@/components/auth/auth-disabled";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { AUTH_ENABLED } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign up · ZeroCRM",
};

export default function SignUpPage() {
  return <AuthShell>{AUTH_ENABLED ? <SignUpForm /> : <AuthDisabled />}</AuthShell>;
}
