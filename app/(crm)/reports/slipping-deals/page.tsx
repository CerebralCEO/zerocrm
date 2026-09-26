import type { Metadata } from "next";
import { SlipToolbar } from "@/components/reports/slipping/slip-toolbar";
import { SlipView } from "@/components/reports/slipping/slip-view";
import { ReviewDialog } from "@/components/reports/slipping/review-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Slipping Deals · ZeroCRM",
};

export default function SlippingDealsPage() {
  return (
    <>
      <SlipToolbar />
      <SlipView />
      <ReviewDialog />
      <DealDetailSheet />
    </>
  );
}
