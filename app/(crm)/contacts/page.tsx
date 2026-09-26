import type { Metadata } from "next";
import { ContactsToolbar } from "@/components/contacts/contacts-toolbar";
import { ContactsView } from "@/components/contacts/contacts-view";
import { ContactSheet } from "@/components/contacts/contact-sheet";
import { NewContactDialog } from "@/components/contacts/new-contact-dialog";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Contacts · ZeroCRM",
};

export default function ContactsPage() {
  return (
    <>
      <ContactsToolbar />
      <ContactsView />
      <ContactSheet />
      <NewContactDialog />
      <LogActivityDialog />
      <DealDetailSheet />
    </>
  );
}
