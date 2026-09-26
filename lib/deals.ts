import type { InteractionType } from "./data";

export type StageId = "discovery" | "qualified" | "proposal" | "negotiation" | "won";

export type Stage = {
  id: StageId;
  label: string;
  /** Tag tone from the design system's tag palette. */
  tone: "blue" | "purple" | "yellow" | "orange" | "land";
  /** Default win probability when a deal enters this stage. */
  probability: number;
};

export const STAGES: Stage[] = [
  { id: "discovery", label: "Discovery", tone: "blue", probability: 15 },
  { id: "qualified", label: "Qualified", tone: "purple", probability: 35 },
  { id: "proposal", label: "Proposal", tone: "yellow", probability: 55 },
  { id: "negotiation", label: "Negotiation", tone: "orange", probability: 75 },
  { id: "won", label: "Closed Won", tone: "land", probability: 100 },
];

export const stageById = (id: StageId) => STAGES.find((s) => s.id === id)!;

export type DealActivity = {
  kind: "call" | "email" | "meeting" | "note";
  text: string;
  time: string;
};

export type Deal = {
  id: string;
  companyId: string;
  title: string;
  value: number;
  stage: StageId;
  ownerId: string;
  probability: number;
  closeDate: string; // ISO date
  nextStep: string;
  lastTouch: { type: InteractionType; date: string };
  activity: DealActivity[];
};

type Seed = [
  id: string,
  companyId: string,
  title: string,
  value: number,
  stage: StageId,
  ownerId: string,
  probability: number,
  closeDate: string,
  nextStep: string,
  touchType: InteractionType,
  touchDate: string,
];

const SEEDS: Seed[] = [
  ["d-apple-pilot", "apple", "Retail analytics pilot", 530111, "negotiation", "alex", 82, "2026-10-14", "Legal redlines on the MSA", "Exec", "2026-09-24"],
  ["d-apple-exp", "apple", "Services org expansion", 184000, "discovery", "alex", 20, "2026-12-05", "Map the services buying committee", "Discovery", "2026-09-20"],
  ["d-snowflake", "snowflake", "Data cloud seat expansion", 520000, "qualified", "grace", 34, "2026-11-20", "Confirm budget owner in finance", "Pricing", "2026-09-11"],
  ["d-stripe", "stripe", "Billing workflow add-on", 442231, "proposal", "noah", 44, "2026-10-30", "Send revised proposal with SSO", "Demo", "2026-09-09"],
  ["d-attio", "attio", "Mid-market upsell", 420222, "proposal", "jamie", 38, "2026-11-08", "Pricing review with RevOps", "Pricing", "2026-09-18"],
  ["d-lvmh", "lvmh", "Global renewal · 3 maisons", 420000, "negotiation", "sarah", 70, "2026-10-03", "Procurement sign-off", "QBR Call", "2026-09-21"],
  ["d-slack", "slack", "Co-sell partnership", 333221, "discovery", "ava", 23, "2026-12-12", "Intro call with partner team", "Discovery", "2026-09-12"],
  ["d-ms-strategic", "microsoft", "Strategic platform deal", 320222, "negotiation", "mark", 86, "2026-09-30", "Security walkthrough on Friday", "Pilot", "2026-09-25"],
  ["d-ms-azure", "microsoft", "Marketplace listing", 96000, "won", "mark", 100, "2026-09-02", "Kickoff with onboarding", "Exec", "2026-09-02"],
  ["d-disney", "disney", "New logo · Parks division", 311242, "qualified", "james", 51, "2026-11-15", "Demo for the Parks ops leads", "Demo", "2026-09-22"],
  ["d-zoom", "zoom", "Land & expand · Rooms", 289921, "proposal", "oliver", 38, "2026-09-22", "Partner pricing approval", "Partner", "2026-09-08"],
  ["d-intercom", "intercom", "Support suite rollout", 230112, "negotiation", "lina", 61, "2026-10-09", "Final product sign-off", "Product", "2026-09-19"],
  ["d-united", "united", "Loyalty renewal", 221231, "won", "nia", 100, "2026-09-17", "Hand off to customer success", "Legal", "2026-09-17"],
  ["d-netflix", "netflix", "Studio analytics pilot", 221221, "proposal", "ricky", 72, "2026-10-18", "Pilot success review", "Pilot", "2026-09-18"],
  ["d-hubspot", "hubspot", "Co-sell renewal", 210123, "qualified", "chloe", 52, "2026-11-02", "QBR prep deck", "QBR Call", "2026-09-18"],
  ["d-spotify", "spotify", "Creator tools expansion", 170991, "discovery", "hannah", 25, "2026-12-01", "Scope the creator tools team", "Expansion", "2026-09-15"],
  ["d-shopify", "shopify", "Merchant renewal", 139007, "won", "emma", 100, "2026-08-28", "Renewal signed — plan QBR", "Renewal", "2026-08-28"],
  ["d-paypal", "paypal", "Risk & security module", 124232, "qualified", "maria", 22, "2026-11-25", "Security questionnaire", "Security", "2026-09-12"],
  ["d-airbnb", "airbnb", "Host tools upsell", 122230, "discovery", "drew", 18, "2026-12-18", "Pricing discovery call", "Pricing", "2026-09-18"],
  ["d-google", "google", "SMB program pilot", 112277, "proposal", "kate", 48, "2026-10-26", "Renewal terms draft", "Renewal", "2026-09-07"],
  ["d-snow-ai", "snowflake", "AI workloads add-on", 88000, "discovery", "grace", 12, "2026-12-20", "Technical deep-dive", "Discovery", "2026-09-23"],
  ["d-stripe-won", "stripe", "Payments data connector", 64000, "won", "noah", 100, "2026-09-10", "Kickoff scheduled", "Demo", "2026-09-10"],
  ["d-netflix-won", "netflix", "Ads measurement add-on", 78000, "won", "ricky", 100, "2026-08-12", "Onboarding complete", "Pilot", "2026-08-12"],
  ["d-intercom-won", "intercom", "Seat top-up", 54000, "won", "lina", 100, "2026-08-21", "Usage review in Q4", "Product", "2026-08-21"],
  ["d-spotify-won", "spotify", "Podcast analytics", 112000, "won", "hannah", 100, "2026-09-05", "Expansion discovery", "Expansion", "2026-09-05"],
  ["d-paypal-won", "paypal", "Fraud alerts module", 96000, "won", "maria", 100, "2026-09-22", "Security onboarding", "Security", "2026-09-22"],
  ["d-apple-maps", "apple", "Maps data add-on", 210000, "won", "alex", 100, "2026-08-26", "Rollout with the Maps team", "Exec", "2026-08-26"],
  ["d-lvmh-clienteling", "lvmh", "Clienteling pilot", 180000, "won", "sarah", 100, "2026-09-08", "Kickoff in Paris", "QBR Call", "2026-09-08"],
  ["d-disney-ads", "disney", "Ad analytics expansion", 245000, "won", "james", 100, "2026-08-19", "Onboard the ads team", "Demo", "2026-08-19"],
  ["d-snowflake-market", "snowflake", "Marketplace listing", 120000, "won", "grace", 100, "2026-09-15", "Co-marketing plan", "Pricing", "2026-09-15"],
];

const KINDS: DealActivity["kind"][] = ["call", "email", "meeting", "note"];
const TEMPLATES: Record<DealActivity["kind"], string> = {
  call: "Call with the champion about timeline",
  email: "Sent follow-up with the updated proposal",
  meeting: "Stakeholder meeting — agreed on success criteria",
  note: "Note: procurement wants a security review",
};

export const DEALS: Deal[] = SEEDS.map(
  ([id, companyId, title, value, stage, ownerId, probability, closeDate, nextStep, touchType, touchDate], i) => ({
    id,
    companyId,
    title,
    value,
    stage,
    ownerId,
    probability,
    closeDate,
    nextStep,
    lastTouch: { type: touchType, date: touchDate },
    activity: [0, 1, 2].map((k) => {
      const kind = KINDS[(i + k) % KINDS.length];
      return { kind, text: TEMPLATES[kind], time: ["2h ago", "Yesterday", "3 days ago"][k] };
    }),
  }),
);
