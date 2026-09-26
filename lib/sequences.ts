export type StepKind = "email" | "call" | "task" | "social";

export const STEP_KINDS: { id: StepKind; label: string }[] = [
  { id: "email", label: "Email" },
  { id: "call", label: "Call" },
  { id: "task", label: "Task" },
  { id: "social", label: "Social" },
];

export type Step = {
  id: string;
  kind: StepKind;
  /** Days to wait after the previous step (0 for the first step). */
  delayDays: number;
  subject: string;
  body: string;
  stats: { sent: number; opened: number; replied: number };
};

export type EnrollmentState = "active" | "replied" | "bounced" | "finished";

export type Enrollment = {
  contactId: string;
  /** Index of the step the contact is on (or finished at). */
  step: number;
  state: EnrollmentState;
};

export type SequenceStatus = "active" | "paused" | "draft";

export type Sequence = {
  id: string;
  name: string;
  goal: string;
  status: SequenceStatus;
  ownerId: string;
  steps: Step[];
  enrollments: Enrollment[];
  meetings: number;
};

export const VARIABLES = ["first_name", "company", "sender"] as const;

/** Replace {{variables}} with a sample contact's values for previews. */
export function renderTemplate(text: string, vars: Record<(typeof VARIABLES)[number], string>) {
  return text.replace(/\{\{\s*(first_name|company|sender)\s*\}\}/g, (_, k: (typeof VARIABLES)[number]) => vars[k]);
}

let n = 0;
const step = (kind: StepKind, delayDays: number, subject: string, body: string, sent: number, opened: number, replied: number): Step => ({
  id: `s-${++n}`,
  kind,
  delayDays,
  subject,
  body,
  stats: { sent, opened, replied },
});

const enroll = (pairs: [string, number, EnrollmentState][]): Enrollment[] =>
  pairs.map(([contactId, s, state]) => ({ contactId, step: s, state }));

export const SEQUENCES: Sequence[] = [
  {
    id: "seq-outbound",
    name: "Outbound — Enterprise ICP",
    goal: "Book a discovery call with VP-level buyers at enterprise accounts.",
    status: "active",
    ownerId: "alex",
    meetings: 9,
    steps: [
      step("email", 0, "Quick idea for {{company}}", "Hi {{first_name}},\n\nTeams like yours use ZeroCRM to see pipeline risk a week earlier. Worth a 20-minute look next week?\n\n— {{sender}}", 124, 78, 14),
      step("call", 2, "Intro call", "Reference the email; ask how they forecast today.", 96, 0, 11),
      step("email", 3, "Re: Quick idea for {{company}}", "Hi {{first_name}}, following up with a 2-minute walkthrough of how {{company}} could spot slipping deals. Open to it?", 88, 51, 9),
      step("social", 2, "Connect on LinkedIn", "Personal note referencing a recent {{company}} post.", 70, 0, 4),
      step("email", 4, "Should I close the loop?", "Hi {{first_name}}, I don't want to crowd your inbox — should I check back next quarter instead?\n\n— {{sender}}", 61, 40, 7),
    ],
    enrollments: enroll([
      ["c-maya.chen", 2, "active"], ["c-daniel.brooks", 1, "active"], ["c-tom.keller", 4, "replied"], ["c-camille.laurent", 3, "replied"],
      ["c-ethan.park", 1, "active"], ["c-marcus.lee", 0, "active"], ["c-robert.vance", 4, "finished"], ["c-laura.kim", 2, "active"],
      ["c-victor.hughes", 3, "active"], ["c-aarav.mehta", 1, "bounced"], ["c-chris.novak", 4, "replied"], ["c-elin.berg", 2, "active"],
    ]),
  },
  {
    id: "seq-pilot",
    name: "Pilot → Paid conversion",
    goal: "Turn successful pilots into signed annual contracts.",
    status: "active",
    ownerId: "ricky",
    meetings: 6,
    steps: [
      step("email", 0, "{{company}} pilot — results so far", "Hi {{first_name}}, here's a one-page summary of the pilot results. Can we review them together this week?", 42, 35, 12),
      step("call", 2, "Results review", "Walk through adoption, time saved and next-step pricing.", 38, 0, 10),
      step("task", 1, "Send order form", "Prepare the order form with the pilot discount.", 24, 0, 0),
      step("email", 3, "Next steps for {{company}}", "Hi {{first_name}}, attaching the order form we discussed. Anything blocking signature?", 22, 19, 8),
    ],
    enrollments: enroll([
      ["c-diego.santos", 3, "replied"], ["c-jordan.blake", 2, "active"], ["c-sam.patel", 3, "finished"], ["c-maya.chen", 1, "active"], ["c-emily.shaw", 2, "active"],
    ]),
  },
  {
    id: "seq-renewal",
    name: "Renewal 90-day runway",
    goal: "Start renewals early and surface expansion before the contract ends.",
    status: "active",
    ownerId: "sarah",
    meetings: 4,
    steps: [
      step("email", 0, "Planning {{company}}'s next year", "Hi {{first_name}}, your renewal is about 90 days out — let's review what's working and what to add.", 30, 24, 9),
      step("call", 5, "Renewal check-in", "Confirm stakeholders and budget timing.", 26, 0, 8),
      step("email", 7, "Renewal proposal for {{company}}", "Hi {{first_name}}, sharing the renewal proposal with two expansion options.\n\n— {{sender}}", 20, 17, 6),
    ],
    enrollments: enroll([
      ["c-camille.laurent", 2, "active"], ["c-robert.vance", 1, "active"], ["c-nina.petrova", 2, "replied"], ["c-megan.wright", 0, "active"],
    ]),
  },
  {
    id: "seq-security",
    name: "Security review follow-up",
    goal: "Unblock procurement by answering security questions fast.",
    status: "paused",
    ownerId: "mark",
    meetings: 2,
    steps: [
      step("email", 0, "Security pack for {{company}}", "Hi {{first_name}}, attaching our SOC 2 report and security questionnaire answers.", 18, 15, 5),
      step("call", 3, "Security walkthrough", "Offer a 30-minute session with our security lead.", 12, 0, 4),
      step("email", 4, "Any open security questions?", "Hi {{first_name}}, is there anything else the security team needs from us?", 9, 7, 2),
    ],
    enrollments: enroll([["c-olivia.grant", 1, "active"], ["c-aisha.okafor", 2, "active"], ["c-victor.hughes", 0, "active"]]),
  },
  {
    id: "seq-reengage",
    name: "Re-engage going cold",
    goal: "Warm up contacts with no touch in 21+ days.",
    status: "active",
    ownerId: "emma",
    meetings: 3,
    steps: [
      step("email", 0, "Still a priority at {{company}}?", "Hi {{first_name}}, it's been a few weeks — is improving forecast accuracy still on your list this quarter?", 36, 19, 5),
      step("social", 3, "Engage on LinkedIn", "Comment on a recent post; no pitch.", 30, 0, 2),
      step("email", 5, "A resource for {{first_name}}", "Hi {{first_name}}, thought this benchmark on pipeline hygiene might be useful for {{company}}.\n\n— {{sender}}", 28, 14, 3),
    ],
    enrollments: enroll([
      ["c-ines.duarte", 1, "active"], ["c-ben.carter", 2, "replied"], ["c-grace.holloway", 0, "active"], ["c-yuki.tanaka", 1, "active"],
      ["c-elin.berg", 0, "active"], ["c-julia.costa", 2, "active"], ["c-zoe.martin", 1, "bounced"], ["c-hannah.weiss", 0, "active"],
    ]),
  },
  {
    id: "seq-webinar",
    name: "Webinar attendees — Q4",
    goal: "Follow up with attendees of the Q4 forecasting webinar.",
    status: "draft",
    ownerId: "chloe",
    meetings: 0,
    steps: [
      step("email", 0, "Thanks for joining, {{first_name}}", "Hi {{first_name}}, here's the recording and the forecast template we showed.", 0, 0, 0),
      step("email", 3, "Want the template set up for {{company}}?", "Hi {{first_name}}, happy to set the template up with your data in 15 minutes.", 0, 0, 0),
    ],
    enrollments: [],
  },
];

/** Rolled-up stats across a sequence's email steps. */
export function sequenceStats(s: Sequence) {
  const emails = s.steps.filter((x) => x.kind === "email");
  const sent = emails.reduce((a, x) => a + x.stats.sent, 0);
  const opened = emails.reduce((a, x) => a + x.stats.opened, 0);
  const replied = s.steps.reduce((a, x) => a + x.stats.replied, 0);
  const touches = s.steps.reduce((a, x) => a + x.stats.sent, 0);
  return {
    enrolled: s.enrollments.length,
    openRate: sent ? Math.round((opened / sent) * 100) : 0,
    replyRate: touches ? Math.round((replied / touches) * 100) : 0,
    meetings: s.meetings,
  };
}

/** Day on which each step runs (cumulative delays, day 1 = enrollment). */
export const stepDays = (steps: Step[]) => {
  let d = 1;
  return steps.map((s, i) => (i === 0 ? d : (d += s.delayDays)));
};
