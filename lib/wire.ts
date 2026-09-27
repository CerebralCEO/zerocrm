"use client";

import { useActivities } from "./activities-store";
import { CURRENT_USER } from "./data";
import { TODAY } from "./deals-store";
import { onEvent } from "./events";
import { useCrm } from "./store";
import { useSlips } from "./slips-store";

/** Local wall-clock time on the demo's TODAY, as the feed's "YYYY-MM-DDTHH:mm" stamp. */
function stamp() {
  const now = new Date();
  return `${TODAY}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

let wired = false;

/**
 * Connect the event bus to the stores: every CrmEvent becomes a system entry
 * in the activity feed (and the deal's timeline); important ones also raise a
 * notification. Called once from the app shell.
 */
export function wireEvents() {
  if (wired) return;
  wired = true;
  onEvent((e) => {
    useActivities.getState().addEvent({
      kind: "note",
      title: e.text,
      body: e.body,
      companyId: e.companyId,
      dealId: e.dealId,
      ownerId: e.ownerId,
      at: stamp(),
      done: true,
      actor: CURRENT_USER.name,
    });
    if (e.push && e.dealId) useSlips.getState().recordPush(e.dealId, e.push.from, e.push.to);
    if (e.notify) {
      const company = useCrm.getState().companies.find((c) => c.id === e.companyId);
      useCrm.getState().pushNotification({
        actor: CURRENT_USER.name,
        companyId: e.companyId,
        company: company?.name ?? e.companyId,
        text: e.text,
        quote: e.body,
        time: "Just now",
      });
    }
  });
}
