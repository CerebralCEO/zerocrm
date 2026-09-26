import type { Metadata } from "next";
import { SequencesToolbar } from "@/components/sequences/sequences-toolbar";
import { SequencesView } from "@/components/sequences/sequences-view";
import { StepEditorSheet } from "@/components/sequences/step-editor-sheet";
import { NewSequenceDialog } from "@/components/sequences/new-sequence-dialog";
import { EnrollDialog } from "@/components/sequences/enroll-dialog";
import { ContactSheet } from "@/components/contacts/contact-sheet";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Email Sequences · ZeroCRM",
};

export default function SequencesPage() {
  return (
    <>
      <SequencesToolbar />
      <SequencesView />
      <StepEditorSheet />
      <NewSequenceDialog />
      <EnrollDialog />
      <ContactSheet />
      <LogActivityDialog />
      <DealDetailSheet />
    </>
  );
}
