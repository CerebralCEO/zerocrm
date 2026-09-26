import type { PeriodId } from "./forecast";

export type TeamId = "strategic" | "mid-market" | "sdr";

/** Quota-carrying seller (AE). References an existing owner, so every number is live. */
export type TeamMember = {
  ownerId: string;
  title: string;
  territory: string;
  /** Quota for the selected fiscal period. */
  quota: number;
};

export type SdrStats = { meetings: number; calls: number; emails: number; connects: number };

/** Pipeline-generating rep (SDR / BDR). Meetings, not revenue, are the quota. */
export type SdrMember = {
  id: string;
  name: string;
  title: string;
  territory: string;
  /** AE this SDR books meetings for (an owner id). */
  partnerId: string;
  meetingQuota: number;
  stats: Partial<Record<PeriodId, SdrStats>>;
  /** Meetings booked per week, last 14 weeks (oldest → newest). */
  weekly: number[];
  /** Deals this SDR sourced — values/stages come live from the deals store. */
  sourced: string[];
};

type Base = { id: TeamId; name: string; description: string };
export type AeTeam = Base & { kind: "ae"; accountsLabel: string; members: TeamMember[] };
export type SdrTeam = Base & { kind: "sdr"; members: SdrMember[] };
export type Team = AeTeam | SdrTeam;

export const TEAMS: Team[] = [
  {
    id: "strategic",
    kind: "ae",
    name: "Strategic AEs",
    description: "Enterprise and strategic accounts with multi-stakeholder deals.",
    accountsLabel: "Strategic accounts",
    members: [
      { ownerId: "alex", title: "Principal AE", territory: "West · Big Tech", quota: 600_000 },
      { ownerId: "mark", title: "Strategic AE", territory: "Northwest · Platforms", quota: 500_000 },
      { ownerId: "sarah", title: "Strategic AE", territory: "EMEA · Luxury & Retail", quota: 500_000 },
      { ownerId: "james", title: "Strategic AE", territory: "Southeast · Media", quota: 450_000 },
      { ownerId: "grace", title: "Senior AE", territory: "West · Data Infra", quota: 450_000 },
      { ownerId: "lina", title: "Senior AE", territory: "EMEA · SaaS", quota: 400_000 },
    ],
  },
  {
    id: "mid-market",
    kind: "ae",
    name: "Mid Market",
    description: "High-velocity mid-market deals with shorter cycles.",
    accountsLabel: "Mid-market accounts",
    members: [
      { ownerId: "noah", title: "Mid-Market AE", territory: "West · Fintech", quota: 300_000 },
      { ownerId: "ricky", title: "Mid-Market AE", territory: "West · Media", quota: 280_000 },
      { ownerId: "emma", title: "Mid-Market AE", territory: "Central · Commerce", quota: 250_000 },
      { ownerId: "hannah", title: "Mid-Market AE", territory: "EMEA · Consumer", quota: 250_000 },
      { ownerId: "oliver", title: "Mid-Market AE", territory: "West · Collaboration", quota: 300_000 },
      { ownerId: "jamie", title: "Mid-Market AE", territory: "UK · SaaS", quota: 220_000 },
      { ownerId: "ava", title: "Mid-Market AE", territory: "Mountain · SaaS", quota: 220_000 },
      { ownerId: "chloe", title: "Mid-Market AE", territory: "East · Partners", quota: 220_000 },
    ],
  },
  {
    id: "sdr",
    kind: "sdr",
    name: "SDR Team",
    description: "Outbound and inbound reps who book first meetings for the AEs.",
    members: [
      {
        id: "sdr-priya", name: "Priya Nair", title: "SDR Lead", territory: "West", partnerId: "alex", meetingQuota: 24,
        stats: { fq3: { meetings: 21, calls: 412, emails: 980, connects: 58 } },
        weekly: [1, 2, 1, 2, 3, 2, 2, 3, 2, 3, 2, 3, 3, 4], sourced: ["d-apple-exp", "d-apple-pilot"],
      },
      {
        id: "sdr-amara", name: "Amara Obi", title: "Senior SDR", territory: "EMEA", partnerId: "sarah", meetingQuota: 20,
        stats: { fq3: { meetings: 22, calls: 298, emails: 1020, connects: 51 } },
        weekly: [2, 1, 2, 2, 3, 2, 3, 2, 3, 3, 2, 4, 3, 3], sourced: ["d-lvmh", "d-lvmh-clienteling"],
      },
      {
        id: "sdr-tyler", name: "Tyler Brooks", title: "BDR", territory: "Central", partnerId: "emma", meetingQuota: 22,
        stats: { fq3: { meetings: 15, calls: 330, emails: 700, connects: 41 } },
        weekly: [1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 3, 2], sourced: ["d-shopify", "d-hubspot"],
      },
      {
        id: "sdr-leo", name: "Leo Martins", title: "SDR", territory: "Northwest", partnerId: "mark", meetingQuota: 20,
        stats: { fq3: { meetings: 11, calls: 356, emails: 870, connects: 44 } },
        weekly: [0, 1, 1, 1, 0, 1, 2, 1, 1, 1, 2, 1, 1, 2], sourced: ["d-ms-strategic"],
      },
      {
        id: "sdr-kenji", name: "Kenji Watanabe", title: "SDR", territory: "West · Mid-market", partnerId: "noah", meetingQuota: 22,
        stats: { fq3: { meetings: 10, calls: 380, emails: 760, connects: 36 } },
        weekly: [1, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 2, 1], sourced: ["d-stripe", "d-attio"],
      },
      {
        id: "sdr-sofia", name: "Sofia Rossi", title: "SDR", territory: "Southeast", partnerId: "james", meetingQuota: 20,
        stats: { fq3: { meetings: 7, calls: 240, emails: 640, connects: 22 } },
        weekly: [0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1], sourced: ["d-disney"],
      },
    ],
  },
];

export const teamById = (id: TeamId) => TEAMS.find((t) => t.id === id);
