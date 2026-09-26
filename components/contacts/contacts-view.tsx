"use client";

import { useEffect } from "react";
import { useContacts } from "@/lib/contacts-store";
import { ContactsSummary } from "./contacts-summary";
import { ContactsGrid } from "./contacts-grid";
import { ContactsList } from "./contacts-list";
import { useVisibleContacts } from "./shared";

export function ContactsView() {
  const contacts = useVisibleContacts();
  const view = useContacts((s) => s.view);
  const lastAddedId = useContacts((s) => s.lastAddedId);

  // Bring a freshly created contact into view.
  useEffect(() => {
    if (!lastAddedId) return;
    document.querySelector(`[data-contact-id="${lastAddedId}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [lastAddedId]);

  return (
    <div className="table-scroll min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <ContactsSummary />
      {/* List view is desktop/tablet only; phones always get cards. */}
      {view === "list" ? (
        <>
          <div className="max-md:hidden">
            <ContactsList contacts={contacts} />
          </div>
          <div className="md:hidden">
            <ContactsGrid contacts={contacts} />
          </div>
        </>
      ) : (
        <ContactsGrid contacts={contacts} />
      )}
    </div>
  );
}
