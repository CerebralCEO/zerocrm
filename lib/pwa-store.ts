"use client";

import { create } from "zustand";

/** Chromium's install prompt event (not in the DOM typings yet). */
export type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

type PwaState = {
  installPrompt: InstallPromptEvent | null;
  installed: boolean;
  online: boolean;
};

export const usePwa = create<PwaState>(() => ({ installPrompt: null, installed: false, online: true }));

/** Show the browser's install dialog (when it offered one). */
export async function installApp() {
  const e = usePwa.getState().installPrompt;
  if (!e) return;
  await e.prompt();
  const { outcome } = await e.userChoice;
  usePwa.setState({ installPrompt: null, installed: outcome === "accepted" });
}
