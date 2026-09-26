import type { Metadata } from "next";
import { ForecastToolbar } from "@/components/forecast/forecast-toolbar";
import { ForecastView } from "@/components/forecast/forecast-view";
import { SubmitForecastDialog } from "@/components/forecast/submit-forecast-dialog";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Forecast · ZeroCRM",
};

export default function ForecastPage() {
  return (
    <>
      <ForecastToolbar />
      <ForecastView />
      <SubmitForecastDialog />
      <DealDetailSheet />
    </>
  );
}
