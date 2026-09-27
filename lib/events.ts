/**
 * App-wide event bus. Stores emit what happened (a deal moved, an invoice was
 * paid…) without importing each other; one subscriber (lib/wire.ts) turns
 * events into activity-feed entries and notifications. Keeping this module
 * dependency-free avoids import cycles between the stores.
 */
export type CrmEvent = {
  /** Sentence after the actor's name: "moved Retail analytics pilot to Negotiation". */
  text: string;
  body?: string;
  companyId: string;
  dealId?: string;
  /** Rep the event belongs to (feed owner filter, team stats). */
  ownerId: string;
  /** Also raise a notification (wins, payments, new records). */
  notify?: boolean;
  /** The close date moved later — recorded as a slip. */
  push?: { from: string; to: string };
};

type Listener = (e: CrmEvent) => void;
const listeners = new Set<Listener>();

export function onEvent(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emit(e: CrmEvent) {
  listeners.forEach((fn) => fn(e));
}
