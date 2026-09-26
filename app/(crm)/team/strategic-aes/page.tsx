import type { Metadata } from "next";
import { TeamPage } from "@/components/team/team-page";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Strategic AEs · ZeroCRM",
};

export default function StrategicAEsPage() {
  return (
    <>
      <TeamPage teamId="strategic" />
      <DealDetailSheet />
    </>
  );
}
