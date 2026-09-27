import { createJSONStorage, type PersistOptions } from "zustand/middleware";

/**
 * Browser persistence for the domain stores. Each store saves only its data
 * (never UI state like open sheets or filters) under a versioned key, starts
 * from the seed on the server, and rehydrates after mount (see StoreSync) so
 * server and client HTML always match.
 */
export const STORAGE_PREFIX = "zerocrm:v1:";

type Rehydratable = { persist: { rehydrate: () => Promise<void> | void; getOptions: () => { name?: string } } };
export const persisted: Rehydratable[] = [];

export function persistOptions<S, K extends keyof S>(name: string, keys: K[]): PersistOptions<S, Pick<S, K>> {
  return {
    name: `${STORAGE_PREFIX}${name}`,
    version: 1,
    storage: createJSONStorage(() => localStorage),
    skipHydration: true,
    partialize: (s) => Object.fromEntries(keys.map((k) => [k, s[k]])) as Pick<S, K>,
  };
}

/** Register a persisted store so the shell can rehydrate it and keep tabs in sync. */
export function track<T extends Rehydratable>(store: T) {
  persisted.push(store);
  return store;
}

/** Wipe every saved store (Reset demo data). */
export function clearPersisted() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}
