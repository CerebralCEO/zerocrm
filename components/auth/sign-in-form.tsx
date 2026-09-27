"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import { SIGN_UP_URL, safeRedirect } from "@/lib/auth";
import { AuthButton, AuthField, CodeInput, Divider, FormError, GoogleMark } from "./fields";

type Step = "credentials" | "code";

/** Custom Clerk sign-in: Google, email + password, and an email code when Clerk asks for extra verification. */
export function SignInForm() {
  const router = useRouter();
  const next = safeRedirect(useSearchParams().get("redirect_url"));
  const { signIn, errors, fetchStatus } = useSignIn();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const busy = fetchStatus === "fetching";

  const finish = async () => {
    if (!signIn) return;
    await signIn.finalize({
      navigate: async ({ decorateUrl }) => {
        router.push(decorateUrl(next));
      },
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setError(null);
    const { error: err } = await signIn.password({ emailAddress: email.trim(), password });
    if (err) return setError(err.longMessage ?? err.message);
    if (signIn.status === "complete") return finish();
    if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
      const { error: sendErr } = await signIn.mfa.sendEmailCode();
      if (sendErr) return setError(sendErr.longMessage ?? sendErr.message);
      setStep("code");
      return;
    }
    setError("This account needs a sign-in method that isn't enabled here.");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setError(null);
    const { error: err } = await signIn.mfa.verifyEmailCode({ code });
    if (err) return setError(err.longMessage ?? err.message);
    if (signIn.status === "complete") return finish();
    setError("Verification incomplete — try again.");
  };

  const google = async () => {
    if (!signIn) return;
    setError(null);
    const { error: err } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: next,
      redirectCallbackUrl: "/sign-in/sso-callback",
    });
    if (err) setError(err.longMessage ?? err.message);
  };

  if (step === "code")
    return (
      <form onSubmit={verify}>
        <button type="button" onClick={() => setStep("credentials")} className="mb-6 flex items-center gap-[6px] text-[12px] leading-none text-fg-muted hover:text-fg">
          <ArrowLeft className="size-[12px]" strokeWidth={2} />
          Back
        </button>
        <h1 className="text-[24px] leading-none font-semibold tracking-[-0.5px] text-fg">Check your email</h1>
        <p className="mt-3 text-[14px] leading-[20px] text-fg-soft/80">
          We sent a 6-digit code to <span className="text-fg">{email}</span> to confirm it&apos;s you.
        </p>
        <div className="mt-6">
          <CodeInput value={code} onChange={setCode} error={errors.fields.code?.message} />
        </div>
        <FormError message={error} />
        <AuthButton type="submit" loading={busy} disabled={code.length < 6} className="mt-6">
          Verify and continue
        </AuthButton>
      </form>
    );

  return (
    <div>
      <h1 className="text-[24px] leading-none font-semibold tracking-[-0.5px] text-fg">Sign in to ZeroCRM</h1>
      <p className="mt-3 text-[14px] leading-[20px] text-fg-soft/80">Welcome back — your pipeline is waiting.</p>

      <AuthButton type="button" variant="secondary" onClick={google} disabled={busy} className="mt-7">
        <GoogleMark />
        Continue with Google
      </AuthButton>
      <Divider label="or with email" />

      <form onSubmit={submit} className="flex flex-col gap-4">
        <AuthField
          id="email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.fields.identifier?.message}
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.fields.password?.message}
        />
        <FormError message={error} />
        <AuthButton type="submit" loading={busy} className="mt-1">
          Sign in
        </AuthButton>
      </form>

      <p className="mt-6 text-center text-[12px] leading-none text-fg-muted">
        New to ZeroCRM?{" "}
        <Link href={SIGN_UP_URL} className="font-medium text-fg underline-offset-[3px] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
