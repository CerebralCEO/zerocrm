import type { Metadata } from "next";
import { ActivitiesToolbar } from "@/components/activities/activities-toolbar";
import { ActivitiesView } from "@/components/activities/activities-view";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Activities · ZeroCRM",
};

export default function ActivitiesPage() {
  return (
    <>
      <ActivitiesToolbar />
      <ActivitiesView />
      <LogActivityDialog />
      <DealDetailSheet />
    </>
  );
}
