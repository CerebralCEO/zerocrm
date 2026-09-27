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
  /** Account site the deal is sold into (see lib/pipelines.ts); seeds resolve it from a lookup. */
  siteId?: string;
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
  // FQ1 FY28 (Feb – Apr 2027) — early pipeline for the Q1 plan
  ["d-apple-fy28", "apple", "FY28 enterprise renewal", 640000, "qualified", "alex", 40, "2027-03-18", "Align on FY28 scope with procurement", "Exec", "2026-09-21"],
  ["d-snow-cortex", "snowflake", "Cortex AI workloads", 360000, "proposal", "grace", 52, "2027-03-02", "Pricing workshop with data team", "Pricing", "2026-09-19"],
  ["d-ms-copilot", "microsoft", "Copilot analytics add-on", 380000, "discovery", "mark", 20, "2027-02-26", "Discovery with the Copilot PMs", "Discovery", "2026-09-16"],
  ["d-lvmh-asia", "lvmh", "APAC maisons rollout", 455000, "discovery", "sarah", 18, "2027-04-15", "Map APAC stakeholders", "Discovery", "2026-09-14"],
  ["d-disney-parks2", "disney", "Parks phase two", 290000, "qualified", "james", 35, "2027-03-05", "Business case for phase two", "Demo", "2026-09-22"],
  ["d-google-cloud", "google", "Cloud marketplace deal", 265000, "proposal", "kate", 55, "2027-02-18", "Marketplace private offer", "Renewal", "2026-09-24"],
  ["d-shopify-plus", "shopify", "Plus merchant expansion", 210000, "qualified", "emma", 38, "2027-03-24", "Rebuild budget case for FY28", "Renewal", "2026-09-21"],
  ["d-slack-grid", "slack", "Enterprise Grid migration", 310000, "discovery", "ava", 16, "2027-04-28", "Technical scoping call", "Discovery", "2026-09-17"],
  ["d-stripe-intl", "stripe", "International billing", 240000, "discovery", "noah", 22, "2027-04-22", "Intro to the EMEA billing lead", "Discovery", "2026-09-15"],
  ["d-united-cargo", "united", "Cargo analytics", 185000, "discovery", "nia", 15, "2027-04-08", "Cargo ops discovery", "Discovery", "2026-09-11"],
  ["d-intercom-ai", "intercom", "AI agent seats", 175000, "qualified", "lina", 42, "2027-03-12", "Pilot success criteria", "Product", "2026-09-20"],
  ["d-zoom-events", "zoom", "Events platform upsell", 150000, "proposal", "oliver", 58, "2027-02-12", "Partner quote review", "Partner", "2026-09-23"],
  ["d-hubspot-apac", "hubspot", "APAC co-sell", 120000, "qualified", "chloe", 30, "2027-02-24", "Joint account plan", "QBR Call", "2026-09-18"],
  ["d-airbnb-exp", "airbnb", "Experiences host tools", 98000, "discovery", "drew", 14, "2027-03-30", "Pricing discovery", "Pricing", "2026-09-12"],
  // Regional pipelines — APAC expansion and EMEA enterprise deals
  ["d-netflix-kr", "netflix", "Korea studio analytics", 260000, "negotiation", "ricky", 72, "2026-10-22", "Final terms with the Seoul studio", "Pilot", "2026-09-23"],
  ["d-apple-jp", "apple", "Japan retail analytics", 360000, "proposal", "alex", 48, "2026-11-26", "Proposal review with Apple Japan", "Exec", "2026-09-22"],
  ["d-shopify-apac", "shopify", "APAC merchant launch", 240000, "qualified", "emma", 36, "2026-11-12", "Partner plan for ANZ merchants", "Expansion", "2026-09-19"],
  ["d-stripe-in", "stripe", "India payments pilot", 150000, "proposal", "noah", 50, "2026-11-18", "Pilot scope with the Bengaluru team", "Demo", "2026-09-21"],
  ["d-slack-jp", "slack", "Japan workspace expansion", 210000, "qualified", "ava", 40, "2026-12-15", "Localisation review", "Discovery", "2026-09-16"],
  ["d-spotify-sea", "spotify", "SEA creator program", 180000, "discovery", "hannah", 20, "2026-12-08", "Scope creator tools for Jakarta", "Expansion", "2026-09-14"],
  ["d-zoom-anz", "zoom", "ANZ Rooms rollout", 140000, "won", "oliver", 100, "2026-09-03", "Rollout kickoff in Melbourne", "Partner", "2026-09-03"],
  ["d-google-anz", "google", "ANZ SMB program", 88000, "won", "kate", 100, "2026-08-18", "Program launch", "Renewal", "2026-08-18"],
  ["d-ms-emea", "microsoft", "EMEA partner program", 290000, "proposal", "mark", 55, "2026-10-28", "Partner terms with Munich", "Pilot", "2026-09-24"],
  ["d-disney-paris", "disney", "Disneyland Paris analytics", 230000, "qualified", "james", 38, "2026-11-30", "Ops review at the park", "Demo", "2026-09-20"],
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
