import type { Metadata } from "next";
import { Q1Toolbar } from "@/components/reports/q1/q1-toolbar";
import { Q1View } from "@/components/reports/q1/q1-view";
import { NewDealDialog } from "@/components/deals/new-deal-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Q1 Forecast · ZeroCRM",
};

export default function Q1ForecastPage() {
  return (
    <>
      <Q1Toolbar />
      <Q1View />
      <NewDealDialog />
      <DealDetailSheet />
    </>
  );
}
