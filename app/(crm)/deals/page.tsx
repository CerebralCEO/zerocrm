import type { Metadata } from "next";
import { DealsToolbar } from "@/components/deals/deals-toolbar";
import { DealsSummary } from "@/components/deals/deals-summary";
import { DealsBoard } from "@/components/deals/deals-board";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";
import { NewDealDialog } from "@/components/deals/new-deal-dialog";

export const metadata: Metadata = {
  title: "Deals Board · ZeroCRM",
};

export default function DealsPage() {
  return (
    <>
      <DealsToolbar />
      <DealsSummary />
      <DealsBoard />
      <DealDetailSheet />
      <NewDealDialog />
    </>
  );
}
