"use client";

import { useEffect, useState } from "react";
import type { Snapshot } from "@/db/snapshot";
import { applySnapshot, startDbSync } from "@/lib/db-sync";
import { wireEvents } from "@/lib/wire";

wireEvents();

/**
 * Neon is the single source of truth. With a database, every store change is
 * written back to it and every open tab / device pulls other people's changes
 * every few seconds. Without one, ZeroCRM runs on in-memory demo data that
 * resets on reload.
 */
export function StoreSync({ mode, loadedAt }: { mode: "db" | "memory"; loadedAt: string | null }) {
  useEffect(() => {
    if (mode === "db" && loadedAt) return startDbSync(loadedAt);
  }, [mode, loadedAt]);
  return null;
}

/**
 * Seeds the stores with the database snapshot before anything else renders,
 * so server HTML and the first client render show the same (live) data.
 */
export function DbHydrate({ snapshot }: { snapshot: Snapshot | null }) {
  useState(() => {
    if (snapshot) applySnapshot(snapshot);
    return null;
  });
  return null;
}
