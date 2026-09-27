"use client";

import { useClerk } from "@clerk/nextjs";
import { Download, LogOut, Pencil, UserRound } from "lucide-react";
import { installApp, usePwa } from "@/lib/pwa-store";
import { AUTH_ENABLED, SIGN_IN_URL } from "@/lib/auth";
import { useCurrentUser } from "@/lib/current-user";
import { useProfile } from "@/lib/profile-store";
import { useCrm } from "@/lib/store";
import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { Avatar } from "@/components/primitives/avatar";

function Face({ size }: { size: number }) {
  const user = useCurrentUser();
  return user.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.imageUrl} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <Avatar name={user.name} size={size} />
  );
}

/** Topbar user pill → menu with who you are, My Profile, Edit profile and Sign out. */
export function UserMenu() {
  const user = useCurrentUser();
  const setProfileOpen = useCrm((s) => s.setProfileOpen);
  const openEditor = useProfile((s) => s.openEditor);
  const canEdit = useProfile((s) => s.required);
  const canInstall = usePwa((s) => !!s.installPrompt && !s.installed);

  return (
    <Menu>
      <MenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex h-[30px] items-center gap-[6px] rounded-full border border-white/[0.09] bg-[#1b1b1b] pr-[4px] pl-[4px] text-[12px] font-normal tracking-[-0.1px] text-fg transition-colors hover:bg-[#232323] data-[state=open]:bg-[#232323] sm:pr-[8px]"
        >
          <Face size={20} />
          <span className="hidden max-w-[160px] truncate sm:inline">{user.name}</span>
        </button>
      </MenuTrigger>
      <MenuContent align="end" className="w-[248px]">
        <div className="flex items-center gap-[10px] px-2 pt-[8px] pb-[10px]">
          <Face size={32} />
          <div className="flex min-w-0 flex-col gap-[6px]">
            <span className="truncate text-[14px] leading-none font-medium text-fg">{user.name}</span>
            <span className="truncate text-[12px] leading-none text-fg-muted">{user.email || user.role || "Demo workspace"}</span>
          </div>
        </div>
        <MenuSeparator />
        <MenuItem onSelect={() => setProfileOpen(true)}>
          <UserRound className="size-[14px] text-fg-muted" strokeWidth={1.75} />
          My Profile
        </MenuItem>
        {canEdit && (
          <MenuItem onSelect={() => openEditor(true)}>
            <Pencil className="size-[14px] text-fg-muted" strokeWidth={1.75} />
            Edit profile
          </MenuItem>
        )}
        {canInstall && (
          <MenuItem onSelect={() => void installApp()}>
            <Download className="size-[14px] text-fg-muted" strokeWidth={1.75} />
            Install ZeroCRM app
          </MenuItem>
        )}
        {AUTH_ENABLED && (
          <>
            <MenuSeparator />
            <SignOutItem />
          </>
        )}
      </MenuContent>
    </Menu>
  );
}

function SignOutItem() {
  const { signOut } = useClerk();
  return (
    <MenuItem onSelect={() => void signOut({ redirectUrl: SIGN_IN_URL })} className="text-danger-dot data-[highlighted]:text-danger-dot">
      <LogOut className="size-[14px]" strokeWidth={1.75} />
      Sign out
    </MenuItem>
  );
}
