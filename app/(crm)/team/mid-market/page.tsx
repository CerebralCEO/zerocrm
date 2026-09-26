import type { Metadata } from "next";
import { TeamPage } from "@/components/team/team-page";
import { DealDetailSheet } from "@/components/deals/deal-detail-sheet";

export const metadata: Metadata = {
  title: "Mid Market · ZeroCRM",
};

export default function MidMarketPage() {
  return (
    <>
      <TeamPage teamId="mid-market" />
      <DealDetailSheet />
    </>
  );
}
