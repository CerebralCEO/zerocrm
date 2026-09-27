"use client";

import { create } from "zustand";
import { syncChanges } from "@/app/actions/sync";
import { pullChanges } from "@/app/actions/pull";
import { SETTINGS, type PullResult, type Snapshot, type SyncChange, type SyncTable } from "@/db/snapshot";
import { useActivities } from "./activities-store";
import { useContacts } from "./contacts-store";
import { useDeals } from "./deals-store";
import { useForecast } from "./forecast-store";
import { useInvoices } from "./invoices-store";
import { useQ1 } from "./q1-store";
import { useSequences } from "./sequences-store";
import { useSlips } from "./slips-store";
import { useCrm } from "./store";
import { useTeams } from "./teams-store";
import type { Push } from "./slips";

/**
 * Neon is the only source of truth. The server loads a snapshot of the
 * workspace and the stores start from it; every store change is diffed and
 * written back through the `syncChanges` server action, and every few seconds
 * each tab pulls what other tabs, users and devices changed (`pullChanges`)
 * and merges it in. Nothing is kept in localStorage.
 */

/** Put the database snapshot into the stores (runs during the first render, on server and client). */
export function applySnapshot(s: Snapshot) {
  const settings = s.settings ?? {};
  useCrm.setState({ companies: s.companies, notifications: s.notifications });
  useDeals.setState({ deals: s.deals });
  useActivities.setState({ activities: s.activities, events: s.events });
  useContacts.setState({ contacts: s.contacts });
  useSequences.setState((st) => ({
    sequences: s.sequences,
    selectedId: s.sequences.some((q) => q.id === st.selectedId) ? st.selectedId : (s.sequences[0]?.id ?? st.selectedId),
  }));
  useTeams.setState({ teams: s.teams });
  useInvoices.setState((st) => ({ invoices: s.invoices, defaultTemplate: (settings[SETTINGS.defaultTemplate] as string) ?? st.defaultTemplate }));
  useSlips.setState({ history: s.slipHistory });
  if (settings[SETTINGS.forecastCall]) useForecast.setState({ call: settings[SETTINGS.forecastCall] as never });
  if (settings[SETTINGS.q1Plan]) useQ1.setState(settings[SETTINGS.q1Plan] as never);
}

/** Save state for status indicators. */
export const useSyncStatus = create<{ mode: "db" | "memory"; state: "idle" | "saving" | "error"; lastError: string | null }>(() => ({
  mode: "memory",
  state: "idle",
  lastError: null,
}));

/* ---------- writes ---------- */

type Pending = { upserts: Map<string, unknown>; deletes: Set<string> };
const pending = new Map<SyncTable, Pending>();
let timer: ReturnType<typeof setTimeout> | undefined;
let retries = 0;
let applyingRemote = false;

function queue(table: SyncTable, upserts: [string, unknown][], deletes: string[]) {
  if (!upserts.length && !deletes.length) return;
  const p = pending.get(table) ?? { upserts: new Map(), deletes: new Set() };
  for (const [id, v] of upserts) {
    p.upserts.set(id, v);
    p.deletes.delete(id);
  }
  for (const id of deletes) {
    p.deletes.add(id);
    p.upserts.delete(id);
  }
  pending.set(table, p);
  clearTimeout(timer);
  timer = setTimeout(flush, 350);
}

async function flush() {
  if (!pending.size) return;
  const batch = new Map(pending);
  pending.clear();
  const changes: SyncChange[] = [...batch].map(([table, p]) => ({ table, upserts: [...p.upserts.values()], deletes: [...p.deletes] }));
  useSyncStatus.setState({ state: "saving" });
  let res: { ok: boolean; error?: string };
  try {
    res = await syncChanges(changes);
  } catch {
    res = { ok: false, error: "Network error" };
  }
  if (res.ok) {
    retries = 0;
    useSyncStatus.setState({ state: pending.size ? "saving" : "idle", lastError: null });
    return;
  }
  // Put the batch back (newer local edits win) and retry with backoff.
  for (const [table, p] of batch)
    queue(
      table,
      [...p.upserts].filter(([id]) => !pending.get(table)?.upserts.has(id)),
      [...p.deletes],
    );
  clearTimeout(timer);
  retries += 1;
  useSyncStatus.setState({ state: "error", lastError: res.error ?? "Could not save" });
  timer = setTimeout(flush, Math.min(30_000, 1500 * 2 ** retries));
}

/** Records whose object identity changed (stores replace what they edit), plus removed ids. */
function diff<T>(prev: T[], next: T[], id: (x: T) => string) {
  const before = new Map(prev.map((x) => [id(x), x]));
  const upserts: [string, unknown][] = [];
  const seen = new Set<string>();
  for (const x of next) {
    const k = id(x);
    seen.add(k);
    if (before.get(k) !== x) upserts.push([k, x]);
  }
  const deletes = [...before.keys()].filter((k) => !seen.has(k));
  return { upserts, deletes };
}

/* ---------- reads (realtime pull) ---------- */

const POLL_MS = 4000;

/** Is this record still waiting to be written by this tab? Remote copies must not overwrite it. */
const isPending = (table: SyncTable, id: string) => !!(pending.get(table)?.upserts.has(id) || pending.get(table)?.deletes.has(id));

/** Merge changed records into a list by id and drop deleted ones, keeping this tab's unsaved edits. */
function merge<T extends { id: string }>(table: SyncTable, list: T[], changed: T[], deleted: string[] = []) {
  const incoming = changed.filter((x) => !isPending(table, x.id));
  const gone = new Set(deleted.filter((id) => !isPending(table, id)));
  if (!incoming.length && !gone.size) return list;
  const byId = new Map(incoming.map((x) => [x.id, x]));
  const known = new Set(list.map((x) => x.id));
  const kept = list.filter((x) => !gone.has(x.id)).map((x) => byId.get(x.id) ?? x);
  const fresh = incoming.filter((x) => !known.has(x.id) && !gone.has(x.id));
  return fresh.length ? [...fresh, ...kept] : kept;
}

function applyPull(r: PullResult) {
  const del = r.deleted;
  applyingRemote = true;
  try {
    useCrm.setState((s) => ({
      companies: merge("companies", s.companies, r.companies, del.companies),
      notifications: merge("notifications", s.notifications, r.notifications, del.notifications),
    }));
    useDeals.setState((s) => ({ deals: merge("deals", s.deals, r.deals, del.deals) }));
    useActivities.setState((s) => ({
      activities: merge(
        "activities",
        s.activities,
        r.activities.filter((a) => !a.system),
        del.activities,
      ),
      events: merge(
        "activities",
        s.events,
        r.activities.filter((a) => a.system),
        del.activities,
      ),
    }));
    useContacts.setState((s) => ({ contacts: merge("contacts", s.contacts, r.contacts, del.contacts) }));
    useSequences.setState((s) => ({ sequences: merge("sequences", s.sequences, r.sequences, del.sequences) }));
    useTeams.setState((s) => ({ teams: merge("teams", s.teams, r.teams, del.teams) }));
    useInvoices.setState((s) => ({ invoices: merge("invoices", s.invoices, r.invoices, del.invoices) }));
    const pushDeals = Object.keys(r.slipHistory).filter((id) => !isPending("slipPushes", id));
    if (pushDeals.length) useSlips.setState((s) => ({ history: { ...s.history, ...Object.fromEntries(pushDeals.map((id) => [id, r.slipHistory[id]])) } }));
    const set = r.settings;
    if (SETTINGS.defaultTemplate in set && !isPending("settings", SETTINGS.defaultTemplate))
      useInvoices.setState({ defaultTemplate: set[SETTINGS.defaultTemplate] as string });
    if (SETTINGS.forecastCall in set && !isPending("settings", SETTINGS.forecastCall)) useForecast.setState({ call: set[SETTINGS.forecastCall] as never });
    if (SETTINGS.q1Plan in set && !isPending("settings", SETTINGS.q1Plan)) useQ1.setState(set[SETTINGS.q1Plan] as never);
  } finally {
    applyingRemote = false;
  }
}

/* ---------- wiring ---------- */

let started = false;

/** Start writing changes to Neon and pulling everyone else's. Returns a cleanup for effects. */
export function startDbSync(loadedAt: string) {
  if (started) return;
  started = true;
  useSyncStatus.setState({ mode: "db" });
  const byId = (x: { id: string }) => x.id;
  const unsubs: (() => void)[] = [];

  unsubs.push(
    useCrm.subscribe((s, p) => {
      if (applyingRemote) return;
      if (s.companies !== p.companies) {
        const d = diff(p.companies, s.companies, byId);
        queue("companies", d.upserts, d.deletes);
      }
      if (s.notifications !== p.notifications) {
        const d = diff(p.notifications, s.notifications, byId);
        queue("notifications", d.upserts, d.deletes);
      }
    }),
    useDeals.subscribe((s, p) => {
      if (applyingRemote || s.deals === p.deals) return;
      const d = diff(p.deals, s.deals, byId);
      queue("deals", d.upserts, d.deletes);
    }),
    useActivities.subscribe((s, p) => {
      if (applyingRemote || (s.activities === p.activities && s.events === p.events)) return;
      const a = diff(p.activities, s.activities, byId);
      const e = diff(p.events, s.events, byId);
      queue("activities", [...a.upserts, ...e.upserts], [...a.deletes, ...e.deletes]);
    }),
    useContacts.subscribe((s, p) => {
      if (applyingRemote || s.contacts === p.contacts) return;
      const d = diff(p.contacts, s.contacts, byId);
      queue("contacts", d.upserts, d.deletes);
    }),
    useSequences.subscribe((s, p) => {
      if (applyingRemote || s.sequences === p.sequences) return;
      const d = diff(p.sequences, s.sequences, byId);
      queue("sequences", d.upserts, d.deletes);
    }),
    useTeams.subscribe((s, p) => {
      if (applyingRemote || s.teams === p.teams) return;
      const d = diff(p.teams, s.teams, byId);
      queue("teams", d.upserts, d.deletes);
    }),
    useInvoices.subscribe((s, p) => {
      if (applyingRemote) return;
      if (s.invoices !== p.invoices) {
        const d = diff(p.invoices, s.invoices, byId);
        queue("invoices", d.upserts, d.deletes);
      }
      if (s.defaultTemplate !== p.defaultTemplate)
        queue("settings", [[SETTINGS.defaultTemplate, { key: SETTINGS.defaultTemplate, value: s.defaultTemplate }]], []);
    }),
    useSlips.subscribe((s, p) => {
      if (applyingRemote || s.history === p.history) return;
      const upserts: [string, unknown][] = [];
      const deletes: string[] = [];
      for (const dealId of new Set([...Object.keys(p.history), ...Object.keys(s.history)])) {
        const a: Push[] = p.history[dealId] ?? [];
        const b: Push[] = s.history[dealId] ?? [];
        if (a === b) continue;
        upserts.push([dealId, { dealId, pushes: b }]);
        for (let i = b.length; i < a.length; i++) deletes.push(`${dealId}#${i}`);
      }
      queue("slipPushes", upserts, deletes);
    }),
    useForecast.subscribe((s, p) => {
      if (applyingRemote || s.call === p.call) return;
      queue("settings", [[SETTINGS.forecastCall, { key: SETTINGS.forecastCall, value: s.call }]], []);
    }),
    useQ1.subscribe((s, p) => {
      if (applyingRemote || (s.preset === p.preset && s.scenario === p.scenario)) return;
      queue("settings", [[SETTINGS.q1Plan, { key: SETTINGS.q1Plan, value: { preset: s.preset, scenario: s.scenario } }]], []);
    }),
  );

  // Pull loop: only while the tab is visible, and right away when it comes back into view.
  let since = loadedAt;
  let pulling = false;
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  const pull = async () => {
    if (pulling || document.visibilityState !== "visible") return;
    pulling = true;
    try {
      const r = await pullChanges(since);
      if (r) {
        applyPull(r);
        since = r.now;
      }
    } catch {
      // Offline or mid-deploy — the next tick retries.
    } finally {
      pulling = false;
    }
  };
  const loop = () => {
    pollTimer = setTimeout(async () => {
      await pull();
      loop();
    }, POLL_MS);
  };
  loop();
  const onVisible = () => {
    if (document.visibilityState === "visible") void pull();
  };
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);

  // Send anything still queued when the tab closes.
  const onHide = () => {
    if (pending.size) void flush();
  };
  window.addEventListener("pagehide", onHide);

  return () => {
    unsubs.forEach((u) => u());
    clearTimeout(pollTimer);
    document.removeEventListener("visibilitychange", onVisible);
    window.removeEventListener("focus", onVisible);
    window.removeEventListener("pagehide", onHide);
    started = false;
  };
}
