"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { saveProfile } from "@/app/actions/profile";
import type { UserProfile } from "@/db/snapshot";
import { useProfile } from "@/lib/profile-store";
import { cn } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Select, Textarea } from "@/components/ui/form";
import { Segmented } from "@/components/ui/segmented";
import { Avatar } from "@/components/primitives/avatar";

const ROLES = ["Account Executive", "Senior AE", "SDR", "Sales Manager", "Head of Sales", "RevOps", "Customer Success", "Founder"];
const TEAMS = ["Strategic AEs", "Mid Market", "SDR Team", "Leadership", "Revenue Operations", "Customer Success"];
const REGIONS = ["North America", "EMEA", "APAC", "Global"] as const;

const detectTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

/**
 * Onboarding after sign-up (email or Google): the new user adds their details
 * once, saved to Neon (`user_profiles`). Required until saved; afterwards the
 * same form edits the profile from the avatar menu or My Profile.
 */
export function OnboardingModal() {
  const { required, profile, editorOpen, openEditor } = useProfile();
  const open = (required && !profile) || editorOpen;
  const onboarding = !profile;
  return (
    <Modal
      open={open}
      onOpenChange={(o) => !onboarding && openEditor(o)}
      dismissible={!onboarding}
      title={onboarding ? "Welcome to ZeroCRM" : "Edit profile"}
      description={onboarding ? "Tell your team who you are — this takes 30 seconds." : "Update how you appear across ZeroCRM."}
    >
      {open && <ProfileForm onboarding={onboarding} />}
    </Modal>
  );
}

function ProfileForm({ onboarding }: { onboarding: boolean }) {
  const { user } = useUser();
  const { profile, setProfile, openEditor } = useProfile();
  const [form, setForm] = useState<UserProfile>(() => ({
    firstName: profile?.firstName ?? user?.firstName ?? "",
    lastName: profile?.lastName ?? user?.lastName ?? "",
    email: profile?.email ?? user?.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user?.hasImage ? user.imageUrl : (profile?.imageUrl ?? null),
    jobTitle: profile?.jobTitle ?? "",
    team: profile?.team ?? "",
    region: profile?.region ?? "North America",
    phone: profile?.phone ?? user?.primaryPhoneNumber?.phoneNumber ?? "",
    timezone: profile?.timezone ?? detectTimezone(),
    bio: profile?.bio ?? "",
  }));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (error) setError(null);
  };
  const name = `${form.firstName} ${form.lastName}`.trim() || form.email || "You";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim()) return setError("First name is required.");
    if (!form.jobTitle.trim()) return setError("Add your role.");
    if (!form.team) return setError("Pick your team.");
    setSaving(true);
    const res = await saveProfile(form);
    setSaving(false);
    if (!res.ok || !res.profile) return setError(res.error ?? "Could not save your profile.");
    setProfile(res.profile);
    // Pick up the name Clerk now has, so every Clerk-driven surface matches.
    void user?.reload();
  };

  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <div className="flex items-center gap-3">
          {form.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="" width={52} height={52} className="size-[52px] rounded-full object-cover" />
          ) : (
            <Avatar name={name} size={52} />
          )}
          <div className="flex min-w-0 flex-col gap-[8px]">
            <span className="truncate text-[16px] leading-none font-semibold text-fg">{name}</span>
            <span className="truncate text-[12px] leading-none text-fg-soft/80">
              {[form.jobTitle, form.team].filter(Boolean).join(" · ") || "Your role and team appear here"}
            </span>
          </div>
        </div>

        <SectionLabel className="mt-6 font-normal text-fg-soft">About you</SectionLabel>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="pf-first">
              First name <span className="text-fg-muted">*</span>
            </Label>
            <Input id="pf-first" autoComplete="given-name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pf-last">Last name</Label>
            <Input id="pf-last" autoComplete="family-name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="pf-email">Work email</Label>
          <Input id="pf-email" value={form.email} readOnly className="cursor-default text-fg-soft" />
        </div>

        <SectionLabel className="mt-7 font-normal text-fg-soft">Your role</SectionLabel>
        <div className="mt-4">
          <Label htmlFor="pf-role">
            Role <span className="text-fg-muted">*</span>
          </Label>
          <Input id="pf-role" placeholder="e.g. Account Executive" value={form.jobTitle} onChange={(e) => set("jobTitle", e.target.value)} />
          <div className="mt-[10px] flex flex-wrap gap-[6px]">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => set("jobTitle", r)}
                className={cn(
                  "flex h-[26px] items-center gap-[5px] rounded-full border px-[9px] text-[12px] leading-none transition-colors",
                  form.jobTitle === r ? "border-white/[0.2] bg-muted-surface text-fg" : "border-white/[0.09] bg-[#1b1b1b] text-fg-soft hover:bg-[#232323]",
                )}
              >
                {form.jobTitle === r && <Check className="size-[11px]" strokeWidth={2.25} />}
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="pf-team">
            Team <span className="text-fg-muted">*</span>
          </Label>
          <Select
            id="pf-team"
            value={form.team || "__none"}
            onValueChange={(v) => set("team", v === "__none" ? "" : v)}
            options={[{ value: "__none", label: "Choose your team" }, ...TEAMS.map((t) => ({ value: t, label: t }))]}
          />
        </div>
        <div className="mt-[15px]">
          <Label>Region</Label>
          <Segmented<string> label="Region" value={form.region} onChange={(v) => set("region", v)} options={REGIONS.map((r) => ({ value: r, label: r }))} />
        </div>

        <SectionLabel className="mt-7 font-normal text-fg-soft">Contact</SectionLabel>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="pf-phone">Phone</Label>
            <Input id="pf-phone" type="tel" autoComplete="tel" placeholder="+1 555 0100" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pf-tz">Time zone</Label>
            <Input id="pf-tz" value={form.timezone} onChange={(e) => set("timezone", e.target.value)} />
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="pf-bio">About</Label>
          <Textarea
            id="pf-bio"
            maxLength={280}
            placeholder="What you sell, who you cover, how teammates can help."
            value={form.bio ?? ""}
            onChange={(e) => set("bio", e.target.value)}
          />
        </div>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-between gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        {error ? (
          <span role="alert" className="min-w-0 animate-fade-in text-[12px] leading-[16px] text-danger-dot">
            {error}
          </span>
        ) : (
          <span className="text-[12px] leading-none text-fg-muted">
            <span className="text-fg-soft">*</span> required
          </span>
        )}
        <div className="flex items-center gap-2">
          {!onboarding && <Button onClick={() => openEditor(false)}>Cancel</Button>}
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving…" : onboarding ? "Save and continue" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
