"use client";

import type { TeamId } from "@/lib/teams";
import { TeamToolbar } from "./team-toolbar";
import { TeamView } from "./team-view";
import { RepSheet } from "./rep-sheet";
import { AddRepDialog } from "./add-rep-dialog";
import { SdrView } from "./sdr/sdr-view";
import { SdrSheet } from "./sdr/sdr-sheet";
import { AddSdrDialog } from "./sdr/add-sdr-dialog";

/** Every team route renders this: AE teams get quota views, the SDR team gets meeting views. */
export function TeamPage({ teamId }: { teamId: TeamId }) {
  const isSdr = teamId === "sdr";
  return (
    <>
      <TeamToolbar teamId={teamId} />
      {isSdr ? <SdrView /> : <TeamView teamId={teamId} />}
      {isSdr ? <SdrSheet /> : <RepSheet teamId={teamId} />}
      {isSdr ? <AddSdrDialog /> : <AddRepDialog teamId={teamId} />}
    </>
  );
}
