import type { Metadata } from "next";
import { PipelinePage } from "@/components/pipelines/pipeline-page";
import { NewDealDialog } from "@/components/deals/new-deal-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "APAC Expansion · ZeroCRM",
};

export default function APACExpansionPage() {
  return (
    <>
      <PipelinePage id="apac" />
      <NewDealDialog />
      <DealDetailSheet />
    </>
  );
}
