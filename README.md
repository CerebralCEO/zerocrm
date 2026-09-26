<div align="center">

<img src="./public/logo/zerocrm-icon.png" alt="ZeroCRM logo" width="96" height="96" />

# ZeroCRM

**A pixel-perfect, open-source sales CRM pipeline — built with Next.js 16, React 19 and Tailwind CSS v4.**

Dark, dense and fast. Fully responsive from 375&nbsp;px phones to 4K monitors, with iOS-grade spring motion and gestures.

[![License: MIT](https://img.shields.io/badge/License-MIT-4327fa.svg?style=flat-square)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg?style=flat-square)](#-contributing)

**[🔗 Live demo](https://trythezerocrm.vercel.app/)** · [Features](#-features) · [Screenshots](#-screenshots) · [Quick start](#-quick-start) · [Architecture](#-architecture) · [Design system](#-design-system) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

<br />

<img src="./docs/screenshots/desktop-pipeline.png" alt="ZeroCRM — companies pipeline, desktop" width="100%" />

</div>

---

## ✨ Features

### Pipeline table
- **Everything that matters, in one row** — segment & stage tags, account owner, open deals, pipeline value, a 17-segment **win-probability meter**, an **activity sparkline** and the last interaction.
- **Sort** by pipeline value, win probability, open deals, last interaction or name.
- **Filter** by account owner and by segment / stage.
- **Multi-select** rows with a tri-state header checkbox.
- **Footer calculations** — companies in view, sum of pipeline, average win probability.
- **CSV export** of exactly what's on screen (respects filters and sort).

### Deals board
- **Kanban pipeline** across Discovery → Qualified → Proposal → Negotiation → Closed Won, with per-stage totals and weighted value.
- **KPI strip** — open pipeline, weighted forecast, closed won and average deal size, always in sync with the filters.
- **Drag & drop that feels native** — mouse drag, touch long-press (quick swipes still scroll), and full keyboard support (Space · ←/→ · Enter) with screen-reader announcements. Cards lift with a spring, drop into place and glow once.
- **Deal detail** — value, weighted forecast, stage track, editable stage / win probability / next step, and a recent-activity timeline.
- **New Deal** from the toolbar or any column's `+` (the stage is preselected), sort within columns, filter by owner and close date (incl. *Overdue*), CSV export.

### Forecast
- **Live from the board** — every number is derived from the deals board, so dragging a deal to *Closed Won* moves the forecast instantly.
- **Quota attainment chart** — cumulative closed-won to date, commit and best-case projections from *today*, the quota line, a live pulse on the latest actual and a week-by-week crosshair tooltip (mouse and touch).
- **Forecast categories** — closed → commit → best case → pipeline against quota, plus closed + commit and pipeline coverage.
- **Monthly bookings**, a **team attainment** leaderboard and **deals at risk** (overdue, low confidence, closing soon) that open straight into the deal sheet.
- **Submit Forecast** — lock in your commit / best-case call with a note; it shows up as a *Your call* marker. Fiscal periods (FQ3 · Aug–Oct, FQ4 · Nov–Jan) and owner filter.

### Activities
- **Today's agenda** — calls, meetings and tasks for today plus anything overdue; tick them off (or **swipe left** on a phone, iOS-style) and watch the completion meter fill.
- **Activity feed** — every call, email, meeting, note and task grouped by day under sticky headers, linked to its company and deal.
- **Team activity heatmap** — 12 weeks of activity in a contribution grid, with a by-type breakdown.
- **Log Activity** with an iOS-style segmented control: log what just happened (it lands in the feed *and* the deal's timeline) or schedule it for later (it lands in the agenda).
- Filter by type, owner and range; CSV export.

### Contacts
- **Card grid or dense list** (toggle), with instant search, sort (name, relationship, last touch, company) and filters for buying role, owner, starred and *going cold*.
- **Buying roles** — Champion, Decision maker, Economic buyer, Influencer, Technical, Blocker — as colour-coded tags.
- **Relationship strength** on the win-meter, with a red *Going cold* warning after 21 days without a touch.
- **iOS Contacts touches on phones** — sticky A–Z sections and a draggable alphabet index with a letter bubble.
- **Contact sheet** with Email · Call · Log · Company action tiles, contact details, account-touch sparkline, open deals and recent activity. *Log* opens the activity dialog prefilled with the account.

### Email Sequences
- **Master / detail** — every sequence with status, steps, enrolled, open and reply rates; an iOS-style **switch** to run or pause.
- **Visual stepper** — email, call, task and social steps on a timeline with *Wait n days* gaps and per-step open / reply rates.
- **Step editor** — segmented step type, a delay stepper, one-tap `{{first_name}}` / `{{company}}` / `{{sender}}` variables inserted at the cursor, and a live preview rendered for a real enrolled contact.
- **Enrollments** — see who is on which step (active, replied, bounced, finished) and enroll more contacts with search + multi-select.
- **New Sequence** from Blank, Outbound or Renewal templates (saved as a draft). On phones the detail pushes in like an iOS screen.

### Teams — Strategic AEs, Mid Market & SDR Team
- **Rep cards** — quota attainment front and centre, projected attainment, an *On track / At risk / Behind* status, pipeline, average win probability, 7-day activity, top deal and a 14-week activity sparkline.
- **Leaderboard** ranked by attainment and **strategic accounts** the team covers, with furthest stage, open pipeline and health.
- **Rep profile** — quota progress, open deals, accounts and recent activity; *Deals*, *Forecast* and *Activity* jump to those pages filtered to the rep.
- Fiscal-period switch, sort, CSV export and **Add Rep** with a period quota. One template powers both AE teams (Strategic, Mid Market).
- **SDR Team** — meetings are the quota: meetings booked vs. quota with pacing to period end, calls, emails, connect rate, the partner AE each SDR books for, and a live **sourced pipeline** of the deals they created.

### Reports — Q1 Forecast & Slipping Deals
- **Q1 Forecast** — plan next fiscal quarter from today: a 41-segment attainment gauge, a scenario planner (win rate, weekly pipeline creation, FQ4 slip-in) that re-lights it live, a *Path to quota* waterfall from renewals to the gap, side-by-side scenarios, a bubble map of every Q1 deal and rep readiness by coverage.
- **Slipping Deals** — every deal whose close date moved, drawn as a trail from first commit to today, a quarter-flow Sankey, why deals slip and slip rate per rep. **Start Review** walks the list deal by deal: keep, push, move to next quarter or mark won, and the whole app updates.

### Company workflow
- **Company detail drawer** — account summary, pipeline health by stage (Discovery → Evaluation → Procurement), activity trend with touch breakdown, and editable **score cards** (star ratings saved on *Save Update*).
- **New Company** dialog — logo upload (click or drag-and-drop, PNG/JPG/WebP/SVG ≤ 2 MB), segment, stage, owner, pipeline value, a live win-probability slider + meter, and last interaction. New rows appear instantly, glide into view and flash a soft accent.
- **Command palette** (`⌘K` / `Ctrl+K`) — instant search across companies, owners, tags and interaction types, full keyboard navigation.
- **Notifications** — mentions, stage moves and alerts with *All / Unread* tabs and *Mark all as read*.
- **My Profile** — team pipeline totals and every account ranked by value.

### Responsive & motion
- **Desktop:** matches the reference design pixel-for-pixel at 1920 px.
- **Tablet:** off-canvas navigation; the table scrolls horizontally.
- **Phone:** compact toolbar with a single *Filters* popover; drawers become **bottom sheets**.
- **Gestures:** drag a sheet's header down or swipe the nav drawer left to dismiss — with 1:1 tracking, rubber-banding and flick velocity. Mouse users can **click-drag the table with inertia**.
- **Spring physics:** sheet, drawer and popover curves are sampled from a damped-spring simulation (`linear()` easing), popovers grow from their trigger, tab underlines glide, and buttons dip to 97 % on press.
- **Respectful:** honours `prefers-reduced-motion`, safe-area insets (notch / home indicator), no tap flash, no page rubber-banding.

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-company-detail.png" alt="Company detail drawer" /><p align="center"><sub><b>Company detail</b> — pipeline health, activity & score cards</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-new-company.png" alt="New company dialog" /><p align="center"><sub><b>New company</b> — logo upload, live win-probability meter</sub></p></td>
  </tr>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-search.png" alt="Command palette" /><p align="center"><sub><b>Command palette</b> — <code>⌘K</code> search with keyboard navigation</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-notifications.png" alt="Notifications" /><p align="center"><sub><b>Notifications</b> — mentions, stage moves and alerts</sub></p></td>
  </tr>
  <tr>
    <td colspan="2"><img src="./docs/screenshots/desktop-profile.png" alt="My profile" /><p align="center"><sub><b>My profile</b> — team pipeline and ranked accounts</sub></p></td>
  </tr>
</table>

### Deals board

<img src="./docs/screenshots/desktop-deals.png" alt="Deals board — Kanban pipeline" width="100%" />

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-deals-drag.png" alt="Dragging a deal between stages" /><p align="center"><sub><b>Drag & drop</b> — spring lift, dimmed source, smooth drop</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-deal-detail.png" alt="Deal detail sheet" /><p align="center"><sub><b>Deal detail</b> — stage track, win probability, activity</sub></p></td>
  </tr>
</table>

### Forecast

<img src="./docs/screenshots/desktop-forecast.png" alt="Forecast — quota attainment, categories and KPIs" width="100%" />

<details>
<summary>Full forecast page</summary>
<br />
<img src="./docs/screenshots/desktop-forecast-full.png" alt="Forecast — monthly bookings, team attainment and deals at risk" width="100%" />
</details>

### Activities

<img src="./docs/screenshots/desktop-activities.png" alt="Activities — feed, today's agenda and team heatmap" width="100%" />

### Contacts

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-contacts.png" alt="Contacts — card grid" /><p align="center"><sub><b>Contacts</b> — buying roles, relationship strength, going cold</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-contact-sheet.png" alt="Contact sheet" /><p align="center"><sub><b>Contact sheet</b> — action tiles, details, deals, activity</sub></p></td>
  </tr>
</table>

### Email Sequences

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-sequences.png" alt="Email Sequences — stepper and enrollments" /><p align="center"><sub><b>Sequences</b> — stepper, rates, enrollments</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-step-editor.png" alt="Step editor with live preview" /><p align="center"><sub><b>Step editor</b> — variables and live preview</sub></p></td>
  </tr>
</table>

### Teams

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-team.png" alt="Strategic AEs — rep cards" /><p align="center"><sub><b>Strategic AEs</b> — attainment, status, pipeline per rep</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-rep-sheet.png" alt="Rep profile" /><p align="center"><sub><b>Rep profile</b> — quota, deals, accounts, activity</sub></p></td>
  </tr>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-mid-market.png" alt="Mid Market team" /><p align="center"><sub><b>Mid Market</b> — same template, own roster</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-sdr-team.png" alt="SDR Team" /><p align="center"><sub><b>SDR Team</b> — meetings, pacing, sourced pipeline</sub></p></td>
  </tr>
</table>

### Reports

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-q1-forecast.png" alt="Q1 Forecast" /><p align="center"><sub><b>Q1 Forecast</b> — gauge, scenario planner, path to quota</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/desktop-slipping-deals.png" alt="Slipping Deals" /><p align="center"><sub><b>Slipping Deals</b> — slip trail from first commit to today</sub></p></td>
  </tr>
  <tr>
    <td width="50%"><img src="./docs/screenshots/desktop-slip-review.png" alt="Slip review" /><p align="center"><sub><b>Slip review</b> — recommit deal by deal</sub></p></td>
    <td width="50%"><img src="./docs/screenshots/mobile-q1-forecast.png" alt="Q1 Forecast on mobile" /><p align="center"><sub><b>Mobile</b> — the planner on a phone</sub></p></td>
  </tr>
</table>

### Mobile

<img src="./docs/screenshots/mobile-showcase.png" alt="ZeroCRM on mobile: pipeline, company detail bottom sheet, navigation drawer and filters" width="100%" />

<p align="center"><sub>Pipeline table · Company detail bottom sheet · Navigation drawer · Filters popover</sub></p>

---

## 🚀 Quick start

**Requirements:** Node.js **20.9+** and [pnpm](https://pnpm.io) 9 (npm / yarn / bun work too).

```bash
git clone https://github.com/CerebralCEO/zerocrm.git
cd zerocrm
pnpm install
pnpm dev
```

Open **http://localhost:3000** — you'll be redirected to `/companies`.

Or try it right now at **[trythezerocrm.vercel.app](https://trythezerocrm.vercel.app/)**.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint (Next.js + React Hooks rules) |

> **No backend required.** ZeroCRM ships with realistic mock data in [`lib/data.ts`](./lib/data.ts), so it runs instantly. State lives in memory and resets on reload — see the [Roadmap](#-roadmap) for persistence.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/CerebralCEO/zerocrm)

Or build it anywhere that runs Node: `pnpm build && pnpm start`. Every route is statically prerendered.

---

## 🧱 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) · [React 19](https://react.dev) · TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) — CSS-first `@theme` tokens, no config file |
| UI primitives | [Radix UI](https://www.radix-ui.com) (Dialog, Dropdown Menu, Popover, Select, Slider) — fully restyled |
| Command palette | [cmdk](https://cmdk.paco.me) |
| Drag & drop | [dnd-kit](https://dndkit.com) |
| State | [Zustand](https://zustand.docs.pmnd.rs) |
| Icons | [Lucide](https://lucide.dev) · brand logos from [Simple Icons](https://simpleicons.org) |
| Avatars | [DiceBear](https://www.dicebear.com) — *Avataaars* style, generated locally |
| Font | [Geist](https://vercel.com/font) via `next/font` |

---

## 🏗 Architecture

```
zerocrm/
├── app/
│   ├── (crm)/
│   │   ├── layout.tsx            # App shell: sidebar + topbar + profile sheet
│   │   ├── companies/page.tsx    # Toolbar, table, new-company dialog
│   │   ├── deals/page.tsx        # KPI strip, Kanban board, deal sheet, new-deal dialog
│   │   ├── forecast/page.tsx     # Attainment chart, categories, monthly, team, risk
│   │   ├── activities/page.tsx   # Agenda, activity feed, heatmap, log-activity dialog
│   │   ├── contacts/page.tsx     # Contact cards / list, contact sheet, new-contact dialog
│   │   ├── sequences/page.tsx    # Sequence list, stepper, step editor, enroll + new dialogs
│   │   ├── team/                 # strategic-aes · mid-market · sdr-team (one TeamPage template)
│   │   └── reports/              # q1-forecast · slipping-deals
│   ├── globals.css               # Design tokens, motion curves, global UX rules
│   ├── layout.tsx                # Root layout, fonts, metadata, viewport
│   └── page.tsx                  # Redirects / → /companies
├── components/
│   ├── companies/                # Table, toolbar, detail sheet, new-company dialog, ⌘K search
│   ├── deals/                    # Kanban board, deal card, KPI strip, deal sheet, new-deal dialog
│   ├── forecast/                 # Hand-built SVG charts, category bar, leaderboard, submit dialog
│   ├── activities/               # Feed, swipeable agenda, heatmap, log-activity dialog
│   ├── contacts/                 # Contact card, grid + A–Z index, list view, contact sheet
│   ├── sequences/                # Sequence list/detail, step cards, step editor, enroll dialog
│   ├── team/                     # Team template (rep card, leaderboard, rep sheet) + sdr/ variant
│   ├── reports/                  # q1/ (gauge, waterfall, deal map) · slipping/ (slip trail, sankey, review)
│   ├── profile/                  # My Profile sheet
│   ├── shell/                    # Sidebar (+ mobile drawer), topbar, notifications
│   ├── primitives/               # Tag, SegmentedMeter, Sparkline, Checkbox, Avatar, CompanyLogo
│   └── ui/                       # Restyled Radix wrappers + gesture hooks
│       ├── overlay.tsx           # Sheet (side drawer ↔ bottom sheet) and Modal
│       ├── use-swipe-dismiss.ts  # iOS-style swipe-to-dismiss
│       └── use-tab-indicator.ts  # Gliding tab underline
├── lib/
│   ├── data.ts                   # Types + mock companies, owners, notifications
│   ├── deals.ts / deals-store.ts # Deal stages, mock deals and the deals store
│   ├── forecast.ts               # Fiscal periods + forecast math (derived from deals)
│   ├── activities.ts             # Activity types, seeded history, agenda, time helpers
│   ├── contacts.ts               # Contacts, buying roles (fictional, reserved emails/phones)
│   ├── sequences.ts              # Sequences, steps, enrollments, template rendering
│   ├── teams.ts                  # Team rosters (territories, quotas) over existing owners
│   ├── store.ts                  # Zustand store (selection, filters, sort, overlays)
│   └── utils.ts                  # cn(), number & date formatting
└── docs/screenshots/             # Images used in this README
```

**Data flow.** Components read from a single Zustand store ([`lib/store.ts`](./lib/store.ts)). The visible list is derived in [`useVisibleCompanies`](./components/companies/use-visible-companies.ts) — filter → sort — so the table, footer totals, CSV export and counts always agree.

**Swapping in a real backend.** Replace the `COMPANIES` seed in `lib/data.ts` with a fetch (Server Component, Route Handler or Server Action) and point `addCompany` / `updateCompany` at your API. The `Company` type is the contract.

---

## 🎨 Design system

Every colour and measurement was sampled from the reference design and lives as a token in [`app/globals.css`](./app/globals.css):

| Token | Value | Used for |
| --- | --- | --- |
| `--color-app` | `#161616` | Page background |
| `--color-sidebar` | `#171717` | Sidebar |
| `--color-line` | `#232323` | Row & section dividers |
| `--color-fg` | `#fafafa` | Primary text |
| `--color-fg-muted` | `#666767` | Column headers, labels |
| `--color-primary` | `#4327fa` | Primary actions |
| `--color-check` | `#ffdb4b` | Selection |
| `--color-meter-{red,amber,green}` | `#f97373` · `#fbbf24` · `#22c55e` | Win-probability meter |

**The win-probability meter** fills `round(p × 17)` segments and splits them red → amber → green: red gets `⌊n/3⌋`, the rest is halved (amber takes the extra one).

**Table columns** use `minmax(0, Nfr)` tracks whose `fr` values equal their pixel widths at 1920 px, so the grid is exact on the reference screen and scales proportionally elsewhere.

**Motion tokens:** `--ease-ios` (critically damped spring for sheets and drawers), `--ease-pop` (gentle spring with 0.7 % overshoot for popovers and presses) and `--ease-exit`.

---

## ♿ Accessibility

- Radix primitives provide focus trapping, `Esc` to close and correct ARIA roles for dialogs, menus, selects and sliders.
- Rows are keyboard-reachable: `Enter` opens details, `Space` toggles selection.
- The command palette is fully keyboard-driven (`↑` `↓` `↵` `Esc`).
- Checkboxes expose `aria-checked="mixed"` for the indeterminate state; meters use `role="meter"`.
- All animations collapse under `prefers-reduced-motion: reduce`.

---

## 🗺 Roadmap

- [ ] Persistence (PostgreSQL + Drizzle) behind Server Actions
- [ ] Authentication and team workspaces
- [x] Deals board (Kanban) with drag & drop
- [x] Forecast with live quota attainment
- [x] Activities with agenda, feed and heatmap
- [x] Contacts with cards, list view and A–Z index
- [x] Email Sequences with stepper, step editor and enrollments
- [x] Team views — Strategic AEs, Mid Market and SDR Team
- [x] Reports — Q1 Forecast planner and Slipping Deals
- [ ] Reporting and pipeline views from the sidebar
- [ ] Inline editing and bulk actions for selected rows
- [ ] Real "Last activity" window filtering
- [ ] Light theme
- [ ] Unit and end-to-end tests (Vitest + Playwright)

Have an idea? [Open an issue](https://github.com/CerebralCEO/zerocrm/issues) — feedback is very welcome.

---

## 🤝 Contributing

Contributions of every size are welcome.

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`
2. Install and run: `pnpm install && pnpm dev`
3. Keep it clean: `pnpm lint` and `pnpm build` must pass
4. Commit with a clear message and open a pull request describing the change (screenshots for UI changes, please)

**Design rule:** ZeroCRM is pixel-perfect by intent. For visual changes, compare against the screenshots in [`docs/screenshots`](./docs/screenshots) at 1920 px and on a phone-sized viewport, and reuse the tokens in `globals.css` rather than hard-coding new values.

---

## 📄 License

Released under the [MIT License](./LICENSE) — © 2026 **ZeroFounder**. Use it, fork it, ship it.

---

## 🙏 Acknowledgements

- [Radix UI](https://www.radix-ui.com), [cmdk](https://cmdk.paco.me), [Zustand](https://zustand.docs.pmnd.rs), [Lucide](https://lucide.dev) and the [Next.js](https://nextjs.org) team.
- Avatars: [DiceBear](https://www.dicebear.com) *Avataaars* style, based on [Avataaars](https://avataaars.com) by Pablo Stanley.
- Brand icons: [Simple Icons](https://simpleicons.org) (CC0).

> **Disclaimer:** company names and logos appear only as sample data. They are trademarks of their respective owners, and ZeroCRM is not affiliated with or endorsed by any of them. All people, deals and figures are fictional.

<div align="center">
<br />

Built with care by **ZeroFounder** · If ZeroCRM helps you, a ⭐ on GitHub means a lot.

</div>
