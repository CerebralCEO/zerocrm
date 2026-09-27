"use client";

import { useEffect } from "react";
import { WifiOff } from "lucide-react";
import { usePwa, type InstallPromptEvent } from "@/lib/pwa-store";

/**
 * PWA plumbing: registers the service worker (production builds only, so dev
 * never serves stale code), keeps the browser's install prompt for the
 * "Install app" menu item, and shows a small pill while the device is offline.
 */
export function Pwa() {
  const online = usePwa((s) => s.online);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    }
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    usePwa.setState({ online: navigator.onLine, installed: standalone });
    const onPrompt = (e: Event) => {
      e.preventDefault();
      usePwa.setState({ installPrompt: e as InstallPromptEvent });
    };
    const onInstalled = () => usePwa.setState({ installPrompt: null, installed: true });
    const onOnline = () => usePwa.setState({ online: true });
    const onOffline = () => usePwa.setState({ online: false });
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div
      role="status"
      className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 z-[70] flex h-[30px] -translate-x-1/2 animate-pop-in items-center gap-[7px] rounded-full border border-[#5a5228] bg-[#33301a] px-3 text-[12px] leading-none font-medium text-[#fde68a] shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
    >
      <WifiOff className="size-[13px]" strokeWidth={2} />
      Offline — changes will sync when you&apos;re back
    </div>
  );
}
