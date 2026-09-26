"use client";

import { useTeams, type RepSort } from "@/lib/teams-store";
import { PERIODS, periodById } from "@/lib/forecast";
import { ownerById } from "@/lib/data";
import type { TeamId } from "@/lib/teams";
import { MenuItem } from "@/components/ui/menu";
import { ExportButton, FilterChip, PageToolbar, PrimaryAction, downloadCsv } from "@/components/ui/toolbar";
import { useTeamData } from "./use-team-data";
import { useSdrData } from "./sdr/use-sdr-data";

const SORTS: { key: RepSort; label: string }[] = [
  { key: "attainment", label: "Attainment" },
  { key: "pipeline", label: "Pipeline" },
  { key: "activity", label: "Activity" },
  { key: "name", label: "Name" },
];

export function TeamToolbar({ teamId }: { teamId: TeamId }) {
  const { period, sortBy, setPeriod, setSortBy, setAddOpen } = useTeams();
  const { reps, team } = useTeamData(teamId);
  const sdr = useSdrData();
  const isSdr = teamId === "sdr";
  const p = periodById(period);

  const exportSdr = () =>
    downloadCsv(
      "sdr-team.csv",
      ["Rep", "Title", "Territory", "Partner AE", "Meetings", "Meeting quota", "Attainment", "Pacing", "Calls", "Emails", "Connect rate", "Pipeline sourced", "Status"],
      sdr.reps.map((r) => [
        r.member.name,
        r.member.title,
        r.member.territory,
        ownerById(r.member.partnerId).name,
        r.meetings,
        r.member.meetingQuota,
        `${r.attainment}%`,
        `${r.projectedPct}%`,
        r.calls,
        r.emails,
        `${r.connectRate}%`,
        r.sourcedValue,
        r.status,
      ]),
    );

  const exportCsv = () =>
    downloadCsv(
      `${team?.name.toLowerCase().replace(/\s+/g, "-") ?? "team"}.csv`,
      ["Rep", "Title", "Territory", "Quota", "Closed", "Attainment", "Projected", "Pipeline", "Avg win", "Activities (7d)", "Status"],
      reps.map((r) => [
        ownerById(r.member.ownerId).name,
        r.member.title,
        r.member.territory,
        r.member.quota,
        r.closed,
        `${r.attainment}%`,
        r.projected,
        r.pipeline,
        `${r.avgWin}%`,
        r.activity7d,
        r.status,
      ]),
    );

  return (
    <PageToolbar
      filters={
        <>
          <FilterChip label="Period" value={`${p.label} · ${p.range}`}>
            {PERIODS.map((x) => (
              <MenuItem key={x.id} selected={x.id === period} onSelect={() => setPeriod(x.id)}>
                {x.label}
                <span className="text-fg-muted">{x.range}</span>
              </MenuItem>
            ))}
          </FilterChip>
          <FilterChip label="Sort by" value={SORTS.find((s) => s.key === sortBy)!.label}>
            {SORTS.map((s) => (
              <MenuItem key={s.key} selected={s.key === sortBy} onSelect={() => setSortBy(s.key)}>
                {s.label}
              </MenuItem>
            ))}
          </FilterChip>
        </>
      }
      actions={
        <>
          <ExportButton onClick={isSdr ? exportSdr : exportCsv} />
          <PrimaryAction label={isSdr ? "Add SDR" : "Add Rep"} onClick={() => setAddOpen(true)} />
        </>
      }
    />
  );
}
