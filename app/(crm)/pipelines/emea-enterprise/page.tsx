import type { Metadata } from "next";
import { PipelinePage } from "@/components/pipelines/pipeline-page";
import { NewDealDialog } from "@/components/deals/new-deal-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "EMEA Enterprise · ZeroCRM",
};

export default function EMEAEnterprisePage() {
  return (
    <>
      <PipelinePage id="emea" />
      <NewDealDialog />
      <DealDetailSheet />
    </>
  );
}
