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

[Features](#-features) · [Screenshots](#-screenshots) · [Quick start](#-quick-start) · [Architecture](#-architecture) · [Design system](#-design-system) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

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

### Mobile

<img src="./docs/screenshots/mobile-showcase.png" alt="ZeroCRM on mobile: pipeline, company detail bottom sheet, navigation drawer and filters" width="100%" />

<p align="center"><sub>Pipeline table · Company detail bottom sheet · Navigation drawer · Filters popover</sub></p>

---

## 🚀 Quick start

**Requirements:** Node.js **20.9+** and [pnpm](https://pnpm.io) 9 (npm / yarn / bun work too).

```bash
git clone https://github.com/ZeroFounder/zerocrm.git
cd zerocrm
pnpm install
pnpm dev
```

Open **http://localhost:3000** — you'll be redirected to `/companies`.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint (Next.js + React Hooks rules) |

> **No backend required.** ZeroCRM ships with realistic mock data in [`lib/data.ts`](./lib/data.ts), so it runs instantly. State lives in memory and resets on reload — see the [Roadmap](#-roadmap) for persistence.

### Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZeroFounder/zerocrm)

Or build it anywhere that runs Node: `pnpm build && pnpm start`. Every route is statically prerendered.

---

## 🧱 Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) · [React 19](https://react.dev) · TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) — CSS-first `@theme` tokens, no config file |
| UI primitives | [Radix UI](https://www.radix-ui.com) (Dialog, Dropdown Menu, Popover, Select, Slider) — fully restyled |
| Command palette | [cmdk](https://cmdk.paco.me) |
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
│   │   └── companies/page.tsx    # Toolbar, table, detail sheet, dialogs
│   ├── globals.css               # Design tokens, motion curves, global UX rules
│   ├── layout.tsx                # Root layout, fonts, metadata, viewport
│   └── page.tsx                  # Redirects / → /companies
├── components/
│   ├── companies/                # Table, toolbar, detail sheet, new-company dialog, ⌘K search
│   ├── profile/                  # My Profile sheet
│   ├── shell/                    # Sidebar (+ mobile drawer), topbar, notifications
│   ├── primitives/               # Tag, SegmentedMeter, Sparkline, Checkbox, Avatar, CompanyLogo
│   └── ui/                       # Restyled Radix wrappers + gesture hooks
│       ├── overlay.tsx           # Sheet (side drawer ↔ bottom sheet) and Modal
│       ├── use-swipe-dismiss.ts  # iOS-style swipe-to-dismiss
│       └── use-tab-indicator.ts  # Gliding tab underline
├── lib/
│   ├── data.ts                   # Types + mock companies, owners, notifications
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
- [ ] Deals board (Kanban) and Forecast views
- [ ] Inline editing and bulk actions for selected rows
- [ ] Real "Last activity" window filtering
- [ ] Light theme
- [ ] Unit and end-to-end tests (Vitest + Playwright)

Have an idea? [Open an issue](https://github.com/ZeroFounder/zerocrm/issues) — feedback is very welcome.

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
