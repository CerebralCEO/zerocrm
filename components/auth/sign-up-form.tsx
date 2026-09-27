"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { AFTER_AUTH_URL, SIGN_IN_URL } from "@/lib/auth";
import { AuthButton, AuthField, CodeInput, Divider, FormError, GoogleMark } from "./fields";

/** Custom Clerk sign-up: Google, or name + email + password followed by a 6-digit email code. */
export function SignUpForm() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [step, setStep] = useState<"details" | "code">("details");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const busy = fetchStatus === "fetching";

  const finish = async () => {
    if (!signUp) return;
    await signUp.finalize({
      navigate: async ({ decorateUrl }) => {
        router.push(decorateUrl(AFTER_AUTH_URL));
      },
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError(null);
    const { error: err } = await signUp.password({ emailAddress: email.trim(), password, firstName: firstName.trim(), lastName: lastName.trim() });
    if (err) return setError(err.longMessage ?? err.message);
    const { error: sendErr } = await signUp.verifications.sendEmailCode();
    if (sendErr) return setError(sendErr.longMessage ?? sendErr.message);
    setStep("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setError(null);
    const { error: err } = await signUp.verifications.verifyEmailCode({ code });
    if (err) return setError(err.longMessage ?? err.message);
    if (signUp.status === "complete") return finish();
    setError("Your account needs more details before it can be created.");
  };

  const google = async () => {
    if (!signUp) return;
    setError(null);
    const { error: err } = await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: AFTER_AUTH_URL,
      redirectCallbackUrl: "/sign-up/sso-callback",
    });
    if (err) setError(err.longMessage ?? err.message);
  };

  if (step === "code")
    return (
      <form onSubmit={verify}>
        <button type="button" onClick={() => setStep("details")} className="mb-6 flex items-center gap-[6px] text-[12px] leading-none text-fg-muted hover:text-fg">
          <ArrowLeft className="size-[12px]" strokeWidth={2} />
          Back
        </button>
        <h1 className="text-[24px] leading-none font-semibold tracking-[-0.5px] text-fg">Verify your email</h1>
        <p className="mt-3 text-[14px] leading-[20px] text-fg-soft/80">
          Enter the 6-digit code we sent to <span className="text-fg">{email}</span>.
        </p>
        <div className="mt-6">
          <CodeInput value={code} onChange={setCode} error={errors.fields.code?.message} />
        </div>
        <FormError message={error} />
        <AuthButton type="submit" loading={busy} disabled={code.length < 6} className="mt-6">
          Create account
        </AuthButton>
      </form>
    );

  return (
    <div>
      <h1 className="text-[24px] leading-none font-semibold tracking-[-0.5px] text-fg">Create your workspace</h1>
      <p className="mt-3 text-[14px] leading-[20px] text-fg-soft/80">Pipeline, forecast and invoices in one place.</p>

      <AuthButton type="button" variant="secondary" onClick={google} disabled={busy} className="mt-7">
        <GoogleMark />
        Sign up with Google
      </AuthButton>
      <Divider label="or with email" />

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <AuthField id="first" label="First name" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.fields.firstName?.message} />
          <AuthField id="last" label="Last name" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.fields.lastName?.message} />
        </div>
        <AuthField
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.fields.emailAddress?.message}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.fields.password?.message}
        />
        {/* Clerk's bot protection renders its challenge here when enabled. */}
        <div id="clerk-captcha" />
        <FormError message={error} />
        <AuthButton type="submit" loading={busy} className="mt-1">
          Continue
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-[12px] leading-none text-fg-muted">
        Already have an account?{" "}
        <Link href={SIGN_IN_URL} className="font-medium text-fg underline-offset-[3px] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
