"use client";

import { useEffect } from "react";
// Importing the stores registers them for persistence.
import "@/lib/store";
import "@/lib/deals-store";
import "@/lib/activities-store";
import "@/lib/contacts-store";
import "@/lib/sequences-store";
import "@/lib/teams-store";
import "@/lib/invoices-store";
import "@/lib/slips-store";
import "@/lib/forecast-store";
import "@/lib/q1-store";
import { persisted } from "@/lib/persist";
import { wireEvents } from "@/lib/wire";

wireEvents();

/**
 * Keeps the app's data alive and in sync: restores every store from the
 * browser after the first render (so SSR markup still matches), and when
 * another tab saves a change, reloads that store here — every open tab shows
 * the same numbers in real time.
 */
export function StoreSync() {
  useEffect(() => {
    persisted.forEach((s) => s.persist.rehydrate());
    const onStorage = (e: StorageEvent) => {
      if (!e.key) {
        persisted.forEach((s) => s.persist.rehydrate());
        return;
      }
      persisted.find((s) => s.persist.getOptions().name === e.key)?.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}
