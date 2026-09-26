import type { Metadata } from "next";
import { TeamPage } from "@/components/team/team-page";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "SDR Team · ZeroCRM",
};

export default function SdrTeamPage() {
  return (
    <>
      <TeamPage teamId="sdr" />
      <DealDetailSheet />
    </>
  );
}
