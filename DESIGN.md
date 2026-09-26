---
version: 1.0
name: ZeroCRM-design-analysis
description: ZeroCRM is a dense, dark sales-operations dashboard that reads like a trading terminal with good manners. Everything sits on a near-black graphite canvas ({colors.canvas}) and is separated by hairlines, not boxes; depth comes from 1px lines and three steps of charcoal, never from drop shadows on the page itself. Its visual voltage comes from data, not decoration — the red→amber→green segmented win-probability meter, green bar sparklines and a family of tinted-pill tags carry all the color, while a single electric indigo ({colors.primary}) is reserved for the one primary action per view. Type is Geist at small, precise sizes (12–14px) with tight tracking; there are no decorative gradients, no illustrations, no light theme, and no second accent. Motion is iOS-grade: spring-driven sheets, gliding tab underlines, swipe-to-dismiss and a 97% press dip.

colors:
  # Surfaces (darkest → lightest)
  canvas: "#161616"            # page background, sheets, dialogs, popovers
  sidebar: "#171717"           # left navigation column
  row-hover: "#1a1a1b"
  row-selected: "#1b1d20"      # selected table row; also score-card fill
  surface-card: "#1b1d20"      # inset cards inside sheets
  surface-control: "#1b1b1b"   # pill buttons, filter chips, icon buttons
  surface-control-hover: "#232323"
  surface-input: "#1e1e1e"     # text inputs, selects, upload button
  surface-raised: "#2a2a2a"    # logo tiles, neutral tag, active nav row, quote blocks, kbd
  surface-unread: "#1f1f1f"    # unread notification item
  surface-pressed: "#242424"   # selected command-palette row
  # Lines
  hairline: "#232323"          # every divider on the main page
  hairline-overlay: "#393939"  # dividers inside sheets, dialogs, popovers
  border-card: "#2d2f31"       # stat tiles, score cards
  border-input: "#2e2e2e"
  border-input-focus: "#666666"
  border-control: "rgba(255,255,255,0.09)"   # pill buttons / chips
  border-dialog: "#2a2a2a"
  # Text
  ink: "#fafafa"               # primary text and values
  body: "#cfcfcf"              # secondary text, badge numerals, message copy
  nav: "#7f7f7f"               # inactive sidebar items, currency "$"
  muted: "#666767"             # column headers, labels, timestamps
  faint: "#454545"             # sidebar group overlines
  placeholder: "#5f5f5f"
  # Accent (the only interactive color)
  primary: "#4327fa"
  primary-gradient-top: "#4a2ffc"
  primary-gradient-bottom: "#3a1fe6"
  primary-border: "#6b56ff"    # used at 60% opacity
  on-primary: "#ffffff"
  # Status signals (never used for buttons)
  selection: "#ffdb4b"         # checkboxes, "North America" pipeline dot
  live: "#16c89e"              # "Active" status dot
  alert: "#f97373"             # unread dots, validation text
  # Data-viz palette
  meter-red: "#f97373"
  meter-amber: "#fbbf24"
  meter-green: "#22c55e"
  meter-empty: "#3a3a3a"
  meter-empty-bar: "#393939"
  meter-track: "rgba(255,255,255,0.075)"
  meter-track-bar: "#282828"
  meter-track-border: "#303030"
  spark: "#00b562"
  spark-dim: "#395e4d"
  # Chart series (forecast)
  series-closed: "{colors.spark}"                 # actuals / closed won (solid line + 12% area)
  series-commit: "{colors.meter-amber}"           # commit projection (dashed) / bar segment
  series-best: "rgba(253,230,138,0.5)"            # best-case upside (dashed, lighter amber)
  series-pipeline: "{colors.meter-empty}"         # early-stage remainder
  series-target: "{colors.primary-border}"        # quota / target lines — dashed, never filled
  # Tag system — opaque tinted pills: {bg, border, text}
  tag-pilot: { bg: "#3e291d", border: "#764d35", text: "#eeb390" }
  tag-blue: { bg: "#1d2b3e", border: "#23354c", text: "#bfdbfe" }
  tag-green: { bg: "#23451d", border: "#2e5029", text: "#b1ebc5" }
  tag-teal: { bg: "#1f3a2d", border: "#275137", text: "#b1ebc5" }
  tag-yellow: { bg: "#33301a", border: "#5a5228", text: "#fde68a" }
  tag-purple: { bg: "#231f3a", border: "#4b437b", text: "#b7aee9" }
  tag-orange: { bg: "#31221b", border: "#6c4830", text: "#fed7aa" }
  tag-red: { bg: "#3e1d1e", border: "#4c2324", text: "#fecaca" }
  tag-land: { bg: "#102a27", border: "#3b6149", text: "#22c55e" }
  tag-neutral: { bg: "#2a2a2a", border: "#363636", text: "#cfcfcf" }
  # Scrims
  scrim-sheet: "rgba(0,0,0,0.60)"   # + 6px backdrop blur
  scrim-modal: "rgba(0,0,0,0.25)"   # + 6px backdrop blur

typography:
  display-metric:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.5px
  metric:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.5px
  page-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.6px
  heading:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  card-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  body-strong:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 450
    lineHeight: 1
    letterSpacing: 0
  body-copy:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.15   # 16px
    letterSpacing: 0
  tag:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.1px
  menu-item:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0
  control:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  section-label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 1.1px   # UPPERCASE
  overline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 1.7px   # UPPERCASE
  kbd:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0
  micro:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0

rounded:
  none: 0px
  bar: 2px        # meters
  xs: 3px         # checkbox, logo badge on avatar
  kbd: 5px
  sm: 6px         # menu items, row action button, 24px logo tiles
  md: 8px         # nav rows, inputs, stat tiles, cards, list items, 32px logo tiles
  menu: 10px      # dropdown / select panels
  lg: 12px        # dialogs, popovers, 52px logo tile, bottom-sheet top corners
  pill: 9999px    # buttons, chips, tags, badges
  full: 9999px    # avatars, icon buttons, dots

spacing:
  base: 4px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px        # page gutter, card padding-x
  lg: 20px        # sheet section padding-x
  xl: 24px        # dialog / sheet header padding-x
  section-y: 21px # sheet & dialog section top padding (19–26px band)
  control-h: 30px # every pill button, chip and icon button
  input-h: 36px
  row-h: 43px     # table body row (incl. 1px hairline)
  header-row-h: 40px
  toolbar-h: 62px
  topbar-h: 58px
  tabs-h: 44px
  sheet-header-h: 56px
  sheet-footer-h: 62px
  sidebar-w: 254px

components:
  button-primary:
    background: "linear-gradient({colors.primary-gradient-top}, {colors.primary-gradient-bottom})"
    border: "1px {colors.primary-border} @60%"
    shadow: "inset 0 1px 0 rgba(255,255,255,0.18)"
    textColor: "{colors.on-primary}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-h}"
    padding: "0 8px 0 9px"
  button-secondary:
    backgroundColor: "{colors.surface-control}"
    border: "1px {colors.border-control}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-h}"
    padding: "0 9px 0 8px"
  button-icon:
    backgroundColor: "{colors.surface-control}"
    border: "1px {colors.border-control}"
    size: 30px
    icon: 14px @ stroke 1.75
    rounded: "{rounded.full}"
  filter-chip:
    backgroundColor: "{colors.surface-control}"
    border: "1px {colors.border-control}"
    rounded: "{rounded.pill}"
    height: "{spacing.control-h}"
    label: "{typography.label} {colors.muted}, pl 8px pr 9px, right hairline"
    value: "{typography.control} {colors.ink}, px 9px, 12px chevron"
  nav-row:
    height: 30px
    textColor: "{colors.nav}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.md}"
    padding: "0 6px"
    icon: 15px @ stroke 1.75, color #676767
  nav-row-active:
    height: 32px
    backgroundColor: "{colors.surface-raised}"
    border: "1px rgba(255,255,255,0.13)"
    shadow: "0 1px 2px rgba(0,0,0,0.4)"
    textColor: "{colors.ink}"
  count-badge:
    height: 16px
    minWidth: 24px
    backgroundColor: "#222222"
    border: "1px rgba(255,255,255,0.10)"
    textColor: "{colors.body}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
  status-pill:
    height: 20px
    backgroundColor: "#222222"
    border: "1px rgba(255,255,255,0.08)"
    dot: "8px {colors.live}"
    typography: "{typography.control}"
    rounded: "{rounded.pill}"
  tag:
    height: 22px
    padding: "0 7.5px"
    border: 1px
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
  tag-overflow:
    tone: "{colors.tag-neutral}"
    padding: "0 6px"
  table-header-row:
    height: "{spacing.header-row-h}"
    typography: "{typography.label}"
    textColor: "{colors.muted}"
    borderBottom: "1px {colors.hairline}"
  table-row:
    height: "{spacing.row-h}"
    typography: "{typography.body}"
    textColor: "{colors.ink}"
    borderBottom: "1px {colors.hairline}"
  table-row-selected:
    backgroundColor: "{colors.row-selected}"
  checkbox:
    size: 14px
    border: "1px #323232"
    rounded: "{rounded.xs}"
  checkbox-checked:
    backgroundColor: "{colors.selection}"
    iconColor: "#1a1a1a"
    icon: 10px check / minus @ stroke 4
  win-meter:
    size: 74x14px
    padding: 2px
    gap: 2px
    segments: 17
    track: "{colors.meter-track}"
    empty: "{colors.meter-empty}"
    rounded: "{rounded.bar}"
  win-meter-bar:
    height: 12px
    padding: 1px
    gap: 2px
    track: "{colors.meter-track-bar}"
    border: "1px {colors.meter-track-border}"
    empty: "{colors.meter-empty-bar}"
  sparkline:
    height: 14px
    bar: 4px wide, 1px gap, top radius 1px
    colors: "{colors.spark} / {colors.spark-dim}, pattern dBBdBBdBdBdBBd"
  stat-tile:
    height: 62px
    border: "1px {colors.border-card}"
    rounded: "{rounded.md}"
    padding: "12px 12px 11px"
    label: "{typography.label} {colors.body}@80% + 12px filled icon"
    value: "{typography.body-strong} {colors.ink}"
  score-card:
    backgroundColor: "{colors.surface-card}"
    border: "1px {colors.border-card}"
    rounded: "{rounded.md}"
    padding: "15px 16px 14px"
  input:
    height: "{spacing.input-h}"
    backgroundColor: "{colors.surface-input}"
    border: "1px {colors.border-input}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    typography: "14px / 400 (16px on touch screens)"
  input-focus:
    border: "1px {colors.border-input-focus}"
  menu:
    backgroundColor: "{colors.canvas}"
    border: "1px {colors.hairline-overlay}"
    rounded: "{rounded.menu}"
    padding: 4px
    shadow: "0 12px 32px rgba(0,0,0,0.5)"
  menu-item:
    height: 32px
    typography: "{typography.menu-item}"
    textColor: "{colors.body}"
    rounded: "{rounded.sm}"
  menu-item-highlighted:
    backgroundColor: "rgba(255,255,255,0.06)"
    textColor: "{colors.ink}"
  popover:
    backgroundColor: "{colors.canvas}"
    border: "1px {colors.hairline-overlay}"
    rounded: "{rounded.lg}"
    shadow: "0 16px 48px rgba(0,0,0,0.55)"
  dialog:
    width: 560px
    backgroundColor: "{colors.canvas}"
    border: "1px {colors.border-dialog}"
    rounded: "{rounded.lg}"
    shadow: "0 24px 64px rgba(0,0,0,0.6)"
  sheet:
    width: "560px (detail) / 480px (profile)"
    backgroundColor: "{colors.canvas}"
    border: "1px {colors.hairline-overlay} (leading edge)"
    header: "{spacing.sheet-header-h}, {typography.body-strong} + 14px icon"
    footer: "{spacing.sheet-footer-h}"
  logo-tile:
    backgroundColor: "{colors.surface-raised}"
    sizes: "24 / 32 / 52px, radius ≈ 22% of size, glyph ≈ 50%"
  avatar:
    sizes: "12 / 18 / 20 / 32 / 52px"
    background: "#f3f3f3"
    rounded: "{rounded.full}"
  kbd:
    height: 18px
    backgroundColor: "{colors.surface-raised}"
    border: "1px #3a3a3a"
    typography: "{typography.kbd}"
    rounded: "{rounded.kbd}"
  page-toolbar:
    height: "{spacing.toolbar-h}"
    padding: "0 16px"
    borderBottom: "1px {colors.hairline}"
    left: "filter-chip × n (8px gap) — collapses to one Filters popover below md"
    right: "button-secondary (Export) + button-primary, 4px gap"
  kpi-strip:
    borderBottom: "1px {colors.hairline}"
    cellPadding: "14px 16px (12px 16px below sm)"
    layout: "4 across ≥ lg · 2×2 below lg — never a swipe row, so every value is reachable by mouse too"
    cellDivider: "1px {colors.hairline}"
    label: "{typography.label} {colors.muted} + 12px icon"
    value: "{typography.metric} {colors.ink} (20px below sm), muted $ prefix"
    meta: "{typography.label} {colors.muted}, highlighted number in {colors.body} or {colors.meter-green}"
  kanban-column:
    width: "flex-1, min 292px (≥ md) · 86vw, max 360px, snap-start (phone)"
    divider: "1px {colors.hairline} between columns — no column fill"
    header: "16px 16px 12px; stage tag + count-badge + 24px add button; total {typography.body-strong} + weighted {typography.label}"
    body: "12px side padding, 8px gap, own vertical scroll"
    over: "background rgba(255,255,255,0.022)"
    empty: "96px dashed {colors.hairline-overlay} box, {typography.label} {colors.muted}"
  deal-card:
    backgroundColor: "{colors.surface-card}"
    border: "1px {colors.border-card}"
    hoverBorder: "#3a3c3f"
    focusBorder: "#55585c"
    rounded: "{rounded.md}"
    padding: 12px
    rows: "20px logo + {typography.body-strong} company + ⋯ · {typography.label} title · value + win-meter · hairline · 18px avatar owner + close date"
  deal-card-lifted:
    animation: "lift — scale 1.03, rotate 1.5deg, shadow 0 16px 40px rgba(0,0,0,.55), 240ms --ease-pop"
  deal-card-dimmed:
    opacity: 0.4
  panel:
    padding: "18px 16px 16px"
    title: "{typography.body-strong} {colors.ink}"
    subtitle: "{typography.label} {colors.muted}, 7px below title"
    divider: "1px {colors.hairline} between panels (grid gutters are hairlines, not gaps)"
  chart-legend-item:
    swatch: "8px dot, or 12px dashed line for projections/targets"
    typography: "{typography.label} {colors.body}"
    gap: "6px (items 16px apart)"
  line-chart:
    height: "280px (220px below 640px)"
    padding: "18 16 30 52"
    grid: "1px {colors.hairline}, 4–5 ticks on clean steps"
    axis: "{typography.label} {colors.muted}, compact currency"
    actual: "2px {colors.series-closed} + area at 12% opacity"
    projection: "2px {colors.series-commit} / 1.5px {colors.series-best}, dash 5 4, 3–3.5px end dots"
    target: "1px {colors.series-target}, dash 4 4, inline label 'Quota $2.4M'"
    today: "1px {colors.hairline-overlay} vertical + 'Today' label + live-pulse dot"
    crosshair: "1px rgba(255,255,255,0.18) + 3.5px dots ringed in {colors.canvas}"
  chart-tooltip:
    width: 188px
    backgroundColor: "{colors.canvas}"
    border: "1px {colors.hairline-overlay}"
    rounded: "{rounded.menu}"
    padding: "10px 12px"
    shadow: "0 12px 32px rgba(0,0,0,0.5)"
    rows: "8px dot + {typography.label} {colors.muted} label · {typography.control} {colors.ink} value"
  stacked-bar:
    height: 10px
    gap: 2px
    track: "{colors.meter-track-bar}"
    rounded: "{rounded.bar}"
    marker: "1px vertical line 8px beyond the bar + 11px/500 label in the marker colour"
  bar-chart:
    height: 180px
    barWidth: "42% of column, max 72px"
    segmentGap: 2px
    topRadius: "{rounded.bar}"
    target: "dashed 1px {colors.series-target} across the column"
    valueLabel: "{typography.control} {colors.ink} 8px above the bar"
  leaderboard-row:
    height: "{spacing.row-h}"
    content: "rank {typography.label} {colors.muted} · 20px avatar · name {typography.body-strong} · value {typography.body} · win-meter · %"
  risk-row:
    height: "{spacing.row-h}"
    content: "logo + company · title · stage tag · reason tag · value · win-meter · close date"
    reasonTones: "Overdue → tag-red · Low confidence → tag-orange · Closing soon → tag-yellow"
  stage-tabs:
    height: "{spacing.tabs-h}"
    visibility: "below md only (the board shows one column at a time)"
    item: "{typography.control}, active {colors.ink} 500 / inactive {colors.muted}, 20px apart, count-badge (11px)"
    indicator: "1px {colors.ink} underline gliding on --ease-ios (500ms)"
    behaviour: "tap → smooth-scroll to column; board scroll → active tab follows"
  stage-track:
    segments: "5 × 6px bars, 4px gap, {rounded.bar}"
    filled: "{colors.meter-green} (completed + current)"
    empty: "{colors.meter-empty-bar}"
    labels: "11px, current {colors.ink} 500, others {colors.muted}"
---

## Overview

ZeroCRM is a **graphite, hairline-driven data dashboard**. Recognition comes from three things working together: a near-black canvas with only three charcoal steps above it, 1px lines instead of boxes, and colour that appears *only* where data lives — the segmented win-probability meter, the green sparkline and the tinted-pill tags. A single electric indigo button per view is the only saturated interactive element on screen.

It feels premium because it is **disciplined**: everything is 12–14px Geist, every control is 30px tall and pill-shaped, every divider is the same `{colors.hairline}`, and nothing floats unless it is an overlay. A builder must never add a second accent, a light surface, a drop-shadowed page card or a decorative gradient — the calm is the brand.

## Colors

### Brand & Accent
- **`{colors.primary}` Electric indigo** — the one primary action per view (*New Company*, *Create Company*, *Save Update*, *Show all accounts*). Always rendered as the vertical gradient `{colors.primary-gradient-top}` → `{colors.primary-gradient-bottom}` with a 60% `{colors.primary-border}` edge and a 1px inner top highlight — that tiny highlight is what makes it look machined rather than flat. It also fills the tiny filter-count badge. Never used for text links, icons, charts or large fills.

### Surface
- `{colors.canvas}` — page, sheets, dialogs, popovers, menus. Overlays are *the same colour* as the page; they separate through scrim, border and shadow, not a lighter fill.
- `{colors.sidebar}` — one step lighter, left column only.
- `{colors.surface-control}` / `{colors.surface-control-hover}` — pill buttons, chips, icon buttons.
- `{colors.surface-input}` — form fields.
- `{colors.surface-card}` — inset cards inside sheets (score cards); equals `{colors.row-selected}`.
- `{colors.surface-raised}` — logo tiles, neutral tags, active nav row, quote blocks, keyboard hints.
- `{colors.row-hover}`, `{colors.row-selected}`, `{colors.surface-unread}`, `{colors.surface-pressed}` — state fills for lists.

### Text
- `{colors.ink}` primary text and all numbers. `{colors.body}` secondary copy and badge numerals (often at 80% opacity for descriptions). `{colors.nav}` inactive navigation and the `$` currency glyph. `{colors.muted}` column headers, labels, timestamps. `{colors.faint}` sidebar overlines only. Pure white is never used for text.

### Hairlines & Borders
- `{colors.hairline}` — every divider on the page surface (rows, toolbar, topbar, sidebar sections, footer cells).
- `{colors.hairline-overlay}` — dividers *inside* overlays (they sit on a scrim, so they need more contrast).
- `{colors.border-control}` — the white-9% ring around pills; `{colors.border-card}` around tiles/cards; `{colors.border-input}` → `{colors.border-input-focus}` on focus.

### Brand Gradient
The only gradient in the system is the primary button's vertical gradient. There are **no decorative gradients**, glows, mesh backgrounds or illustrations.

### Semantic
- `{colors.selection}` yellow — selection state only (checkboxes).
- `{colors.live}` teal — "live / active" status dots.
- `{colors.alert}` coral — unread dots and validation text.
- Data meaning is carried by `{colors.meter-red}` / `{colors.meter-amber}` / `{colors.meter-green}` (low → high) and `{colors.spark}`.

### Tag palette
Tags are **opaque tinted pills** — a dark hue-tinted fill, a slightly brighter border of the same hue and a pastel text. Mapping: Pilot → `tag-pilot`, Enterprise → `tag-blue`, Mid-Market → `tag-green`, Expansion / New Logo / Renewal → `tag-teal`, SMB → `tag-yellow`, Upsell → `tag-purple`, Co-Sell → `tag-orange`, Strategic → `tag-red`, Land & Expand → `tag-land`, overflow `+N` → `tag-neutral`. New categories must pick an existing tone before a new one is defined.

## Typography

### Font Family
**Geist** (via `next/font`) for everything; **Geist Mono** is loaded but currently unused — reserve it for IDs, code or tabular figures that must align. Numbers use `tabular-nums`.

### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-metric` | 28px | 600 | 1 | -0.5px | Hero KPI in a sheet (82%) |
| `metric` | 24px | 500 | 1 | -0.5px | Secondary KPI (activity score 90) |
| `page-title` | 17px | 500 | 1 | -0.6px | Topbar page title |
| `heading` | 16px | 600 | 1 | 0 | Entity name in sheet, dialog & popover titles |
| `card-title` | 16px | 500 | 1 | 0 | Score-card titles |
| `body-strong` | 14px | 500 | 1 | 0 | Nav rows, names, sheet header, stat values |
| `body` | 14px | 450 | 1 | 0 | Table cell text |
| `body-copy` | 14px | 400 | 16–17px | 0 | Multi-line descriptions, notification copy |
| `tag` | 14px | 400 | 1 | -0.1px | Tag pills |
| `menu-item` | 13px | 400 | 1 | 0 | Dropdown / select options |
| `label` | 12px | 400 | 1 | 0 | Column headers, field labels, chip labels, footer |
| `control` | 12px | 500 | 1 | 0 | Button & chip values, tabs, badges |
| `section-label` | 12px | 500 | 1 | 1.1px | UPPERCASE section headings in sheets/dialogs |
| `overline` | 11px | 500 | 1 | 1.7px | UPPERCASE sidebar group titles |
| `kbd` | 11px | 500 | 1 | 0 | Keyboard hints |
| `micro` | 10px | 600 | 1 | 0 | Count dot on the Filters button |

### Principles
1. **Small and exact.** Working UI never exceeds 14px; 16px is for titles, 24–28px only for a single hero number.
2. **Weight 450 is deliberate** for dense table text — 400 looks thin on the dark canvas, 500 looks shouty across hundreds of cells.
3. `leading-none` (1) for single-line UI; only wrapped copy gets 16–17px line height.
4. Uppercase appears only in `section-label` and `overline`, always with wide tracking.
5. Titles tighten (-0.5 to -0.6px); labels never do.
6. Bold (700) is absent from the system.

### Note on Font Substitutes
Geist is open source (SIL OFL). If unavailable, use Inter at the same sizes with -0.1px extra tracking on 14px text.

## Layout

### Spacing System
4px base. Page gutter `{spacing.md}`; sheet sections `{spacing.lg}` horizontal and `{spacing.section-y}` top; dialog/sheet headers `{spacing.xl}`. Heights are fixed tokens, not padding-derived: controls `{spacing.control-h}`, inputs `{spacing.input-h}`, rows `{spacing.row-h}`, header rows `{spacing.header-row-h}`, toolbar `{spacing.toolbar-h}`, topbar `{spacing.topbar-h}` + tabs `{spacing.tabs-h}`. Gaps: 4px between tags and adjacent buttons, 8px between chips/tiles, 16px between form columns.

### Grid & Container
- App shell: fixed sidebar `{spacing.sidebar-w}` + fluid main column; no max-width — the product fills the screen.
- Tables are CSS grids with `minmax(0, Nfr)` tracks whose `fr` equal their pixel width at 1920px; below the grid's minimum width (~1400px of content) the grid scrolls horizontally.
- Sheets: 560px (entity detail) or 480px (list-style); dialogs 560px.
- Stat tiles: 4 columns on ≥640px, 2 on phones.

### Whitespace Philosophy
Dense by design — this is a tool for scanning hundreds of values. Density comes from small type and fixed row heights, **not** from cramped padding: every region keeps a 16px gutter and every section inside an overlay breathes with ~20px padding. Separation is always a hairline, never a gap-plus-card.

## Elevation & Depth
| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | `{colors.canvas}` + `{colors.hairline}` | Page, table, toolbar, topbar |
| 1 — Inset | `{colors.surface-card}` or border `{colors.border-card}` | Stat tiles, score cards, active nav row |
| 2 — Menu | border `{colors.hairline-overlay}` + `0 12px 32px rgba(0,0,0,.5)` | Dropdowns, selects |
| 3 — Popover | + `0 16px 48px rgba(0,0,0,.55)` | Notifications, Filters |
| 4 — Modal | scrim + 6px blur + `0 24px 64px rgba(0,0,0,.6)` | Dialogs, command palette, sheets |

Shadow philosophy: **the page itself never casts a shadow.** Shadows exist only on things that float above a scrim or the page. Two micro-shadows exist for tactility: the active nav row (`0 1px 2px rgba(0,0,0,.4)`) and the primary button's inner top highlight.

### Decorative Depth
Backdrop blur (6px) on scrims is the only atmospheric effect. Contrast between overlays and page comes from the scrim (`{colors.scrim-sheet}` for sheets/drawers, `{colors.scrim-modal}` for dialogs/search).

## Shapes

### Border Radius Scale
| Token | Value | Use |
|---|---|---|
| `bar` | 2px | Meters |
| `xs` | 3px | Checkbox, avatar logo badge |
| `kbd` | 5px | Keyboard hints |
| `sm` | 6px | Menu items, row action button, 24px logo tiles |
| `md` | 8px | Nav rows, inputs, stat tiles, cards, list items |
| `menu` | 10px | Dropdown / select panels |
| `lg` | 12px | Dialogs, popovers, large logo tiles, bottom-sheet top corners |
| `pill` | 9999px | Buttons, chips, tags, badges |
| `full` | 9999px | Avatars, icon buttons, status dots |

Rule of thumb: **interactive = pill, container = 8px, floating panel = 10–12px.**

### Photography Geometry
No photography. Imagery is limited to square brand logos on `logo-tile` (radius ≈ 22%, glyph ≈ 50%) and circular DiceBear avatars on `#f3f3f3`.

## Components

### Top Navigation
- **Topbar** (`{spacing.topbar-h}`): `page-title` + `status-pill` on the left; `button-icon` ×2 (search, notifications with a 6px `{colors.alert}` dot) and a user pill (20px avatar + name, name hidden on phones) on the right, 8px apart.
- **Tabs row** (`{spacing.tabs-h}`): `control` 12px labels 17px apart, inactive `{colors.muted}`, active `{colors.ink}`; a single 1px `{colors.ink}` underline glides between tabs (`--ease-ios`, 500ms) and sits on the header hairline.
- **Sidebar**: brand block (34px `surface-raised` tile with the ZeroCRM mark, name + "Company pipeline"), then `nav-row`s grouped under `overline` headings with hairline separators, `count-badge`s on the right, 8px coloured dots for pipelines, and a trial footer with a secondary pill button.

### Buttons
- **`button-primary`** — one per view, `Plus` icon 12px + label.
- **`button-secondary`** — everything else (Export, Cancel, Close, Upload logo, range pickers).
- **`button-icon`** — 30px circular.
- All buttons dip to **97% scale on press** and spring back (`--ease-pop`); disabled = 50% opacity.

### Cards & Containers
- **`stat-tile`** — label with a 12px filled icon on top, value at the bottom.
- **`score-card`** — `card-title`, `body-copy` description, meta row (12px avatar + name, clock + "Updated 2h ago") and a rating pill (`#282a2d` track, 9px `{colors.meter-green}` stars).
- **Sheet section** — `section-label`, 16–22px gap, content, hairline below.
- **List row (overlay)** — 52px, 32px logo tile + two-line text + right-aligned value; highlight instead of scale on press.

### Inputs & Forms
- **`input`** / **`input-focus`**; labels are `label` in `{colors.body}` with 9px bottom margin; required mark `*` in `{colors.muted}`; errors in `{colors.alert}` 12px below the field.
- **Select** — same shell as `input`, `body-strong` value, 13px chevron; panel is a `menu` matching trigger width.
- **Slider** — 4px track `#333`, range `#a4a4a4`, 16px `{colors.ink}` thumb.
- **Upload tile** — 56px `surface-raised`, `rounded.lg`, border turns `{colors.primary-border}` while a file is dragged over.

### Tags / Badges
- **`tag`** pills per the tag palette; groups show up to two tags (only if their labels total ≤ 20 characters) then a `tag-overflow` `+N`.
- **`count-badge`**, **`status-pill`**, **`kbd`** as specified above.

### Tab / Filter
- **`filter-chip`** — split pill "Label | Value ▾"; chevron rotates 180° while open.
- **Filters popover (phones)** — the chips stacked in a 300px `popover`; a `micro` count dot on the trigger shows active filters.
- **Menus** — `menu` + `menu-item`; selected item shows a 14px check on the right; groups use a `label`-style uppercase 11px heading.

### Signature Components
- **`win-meter`** — the brand's most recognisable element. `round(p × segments)` segments fill; red = ⌊n/3⌋, remaining split amber (ceil) / green (floor). Compact variant: 17 segments, 74×14px. Bar variant (`win-meter-bar`): full width, 12px, used with a single colour per pipeline stage (Discovery red, Evaluation amber, Procurement green) or the ramp (41 segments) in forms.
- **`sparkline`** — 14 bars, 4px wide, bottom-aligned, max 14px.
- **Data table** — `table-header-row` + `table-row`s; checkbox column 48px; right-aligned numerics with muted `$`; meter + fixed 29px percentage; calendar icon + date + 8px vertical hairline + interaction type; `…` row menu. Footer: equal cells split by hairlines with `+` calculations.
- **Command palette** — 960px `dialog` at 116px from top; 48px search row with `kbd` Esc; 44px result rows with `{colors.surface-pressed}` selection; keyboard-hint footer.
- **Notification item** — 32px avatar with a 13px company-logo badge, `body-copy` with bold actor, optional quote block (`surface-raised`, border `#3a3a3a`), `label` meta line "time · company", 6px unread dot; unread items filled `{colors.surface-unread}`.

- **`page-toolbar`** — shared by every page (`components/ui/toolbar.tsx`): chips left, Export + primary action right; below `md` the chips move into a *Filters* popover with a `micro` count of active filters.
- **`kpi-strip`** — hairline-separated metric cells directly under the toolbar (never cards). Desktop 4-up, 2×2 below `lg` with a 20px value on phones. Not a swipe row: mouse users in narrow windows could not reach hidden cells.
- **Kanban board** (Deals) — `kanban-column`s separated by hairlines on the bare canvas; each column scrolls vertically on its own and the board scrolls horizontally (column snap on phones, paused while dragging). Column header = stage `tag` (Discovery `tag-blue`, Qualified `tag-purple`, Proposal `tag-yellow`, Negotiation `tag-orange`, Closed Won `tag-land`) + `count-badge` + add button, then total and weighted value.
- **`deal-card`** — the one place the page uses a filled card, because cards are the draggable objects. Overdue close dates switch to `{colors.alert}` with an "Overdue ·" prefix. The ⋯ menu offers Open deal, View company, Move to next stage and Mark as won (a no-drag path for keyboard and touch users).
- **`stage-tabs`** — phone-only switcher above the board so columns are reachable without gestures.
- **Board navigation** — besides touch swipes: mouse click-drag on any empty board area pans with inertia (cards and buttons are excluded so they still drag/click), the mouse wheel over a column header pans sideways, and Shift+wheel works everywhere. Snapping pauses while panning.
- **Drag & drop** — mouse: 6px drag threshold; touch: 180ms long-press (quick swipes still scroll); keyboard: Space to pick up, ←/→ to jump columns, Space/Enter to drop, Esc to cancel, with screen-reader announcements. The overlay is `deal-card-lifted`; the source card dims (`deal-card-dimmed`); the drop settles on `--ease-ios` (420ms) and the landed card plays `card-wash`.
- **`stage-track`** — five-step progress bar in the deal sheet.
- **`panel`** (Forecast) — page regions laid out in a CSS grid whose gutters are hairlines; each panel is a title/subtitle header plus content, never a card. Legends sit in the header's right slot.
- **`line-chart`** — cumulative quota attainment: actuals, projections from *today*, target line, live pulse on the latest actual, week-by-week crosshair (mouse and touch; vertical swipes still scroll the page) and a `chart-tooltip`. Series draw in left→right with `reveal` and replay when the period/owner changes.
- **`stacked-bar`** — forecast categories (closed → commit → best → pipeline) with a Quota marker above and a *Your call* marker below, followed by one 43px row per category (dot, name, "n deals · hint", value, % of quota) and two `stat-tile`s (Closed + commit, Pipeline coverage coloured ≥2× green / ≥1× amber / <1× alert).
- **`bar-chart`** — monthly stacked bookings vs. a dashed target; bars rise with `bar-grow`, staggered 90ms.
- **`leaderboard-row`** / **`risk-row`** — list rows on hairlines; risk rows open the deal sheet.
- **Activity timeline (deal sheet)** — 28px `surface-raised` icon tiles on a 1px `{colors.hairline-overlay}` spine, `body-copy` text, `label` time.

### Footer
The table footer is the only footer: 39px, four equal cells separated by hairlines, `label` text in `#7c7f7f`, `+ Add calculation` affordances. On phones it becomes a 2×2 grid.

### Extension patterns for upcoming pages (derived — not yet built)
These are *compositions of the tokens above* for Deals Board, Forecast, Activities, Contacts and Email Sequences. Build from them; promote each to a real component entry once implemented.
- **KPI deltas** — when a metric needs a trend, append it to the `kpi-strip` meta line in `label`, coloured `{colors.meter-green}` (up) / `{colors.meter-red}` (down).
- **New charts** — follow `line-chart` / `bar-chart`: hairline gridlines, `label` axes, series colours only from the `series-*` tokens (actual → closed, committed → commit, upside → best, remainder → pipeline, goals → target), no chart backgrounds, no boxed legends. Past = solid, future = dashed.
- **Timeline (Activities page)** — scale up the deal-sheet activity timeline: day group headers as `section-label`, 32px icon tiles on a 1px `{colors.hairline}` spine, `body-copy` text with bold actor, `label` meta.
- **Contact card (grid view)** — `surface-card`, `rounded.md`, 16px padding, 32px avatar, `body-strong` name, `label` role/company, tags row, `button-icon` actions revealed on hover (desktop) / always visible (touch).
- **Stepper (Email Sequences)** — vertical steps as 8px-radius cards joined by a hairline spine, step index in a 24px `surface-raised` circle, open/reply rates as compact `win-meter`s.
- **Empty state** — centered 13px `{colors.muted}` sentence inside the region; no illustrations.

## Do's and Don'ts

### Do
- Use `{colors.canvas}` for page *and* overlays; separate with hairlines, scrims and the elevation table.
- Keep every interactive control `{spacing.control-h}` tall and `{rounded.pill}`.
- Put colour only on data: `win-meter`, `sparkline`, tags, status dots.
- Use `{typography.body}` (450) for table/list cell text and `tabular-nums` for every number.
- Prefix currency with a `{colors.nav}` `$` and right-align numeric columns.
- Use `section-label` to title every block inside sheets and dialogs.
- Give every overlay the Radix transform-origin so it grows from its trigger.
- Reuse the motion tokens (`--ease-ios`, `--ease-pop`, `--ease-exit`) for any new animation.
- In charts, draw actuals solid and projections dashed; targets are always dashed `series-target` lines with an inline label.

### Don't
- Don't introduce a second accent colour, a light theme or a light card on the dark canvas.
- Don't use `{colors.primary}` for anything other than the single primary action (and its count dot).
- Don't wrap page regions in shadowed cards — shadows are for floating layers only.
- Don't exceed 14px for working UI text or use weight 700.
- Don't add decorative gradients, glows, illustrations or photography.
- Don't invent new radii — pick from the scale (pill / 8 / 10–12).
- Don't use pure `#000`/`#fff` for surfaces or text.
- Don't animate with default `ease` — use the spring tokens, and keep exits shorter than entrances.
- Don't use a chart library's default styling, gradients or filled chart backgrounds — charts are hand-built SVG on the bare canvas.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Phone | < 640px | New Company becomes a bottom sheet; stat tiles 2-up; touch inputs 16px |
| `sm` | ≥ 640px | Dialogs become centered 560px cards |
| `md` | ≥ 768px | Filter chips inline (below: one *Filters* popover); sheets dock right (below: bottom sheets with 8px top gap, `rounded.lg` top corners); command palette shows all columns |
| `lg` | ≥ 1024px | Sidebar docked (below: off-canvas drawer, 280px / max 85vw, opened from a hamburger `button-icon`) |
| Wide | ≥ ~1650px | Table fits without horizontal scroll; 1920px is the pixel-perfect reference |

### Touch Targets
Visual controls stay 30px for density; on phones close buttons grow to 32px and every control uses `touch-action: manipulation` with no tap highlight. Checkbox (14px) sits inside a 43px row that is itself tappable.

### Collapsing Strategy
- **Sidebar** → swipe-to-close drawer.
- **Toolbar** → *Filters* popover + Export + New Company on one 62px row.
- **Table** → unchanged grid, horizontal scroll (touch swipe or mouse click-drag with inertia); footer becomes 2×2.
- **Kanban** → one column per screen (86vw, snap) with `stage-tabs` above; KPI strip 2×2.
- **Rule:** every horizontally scrolling region must also be operable with a mouse in a narrow window (tabs, click-drag pan or header wheel) — never rely on touch swipes alone.
- **Sheets / New Company** → bottom sheets, dismissable by dragging the header down.
- **Topbar** → hamburger added, user pill shows avatar only.
- **Forecast grid** → panels stack into one column below `lg` (hairlines move from vertical to horizontal); line chart drops to 220px below 640px; leaderboard hides values and commit hints on phones; below `sm` risk rows become two-line (company over deal title, value over reason tag).

### Image Behavior
Logos are inline SVG (Simple Icons / hand-drawn); avatars are generated SVG data URIs; the brand mark is a 187px transparent PNG rendered at 22px via `next/image`. No responsive image sets are needed.

### Motion
| Token | Curve | Used for |
|---|---|---|
| `--ease-ios` | critically damped spring (`linear()`) | Sheets 520ms, bottom sheets 560ms, drawer 500ms, tab underline 500ms |
| `--ease-pop` | spring, ~0.7% overshoot | Popovers/menus 360ms (scale .95→1), checkbox pop 320ms, press release 220ms |
| `--ease-exit` | `cubic-bezier(.32,0,.67,0)` | All exits (~50% of entrance duration) |
- Press: `scale: .97` in 90ms; wide list rows highlight instead.
- New rows: fade/slide in with a 20% indigo wash that settles (1.6s) and scroll into view.
- Charts: `reveal` 1.1s (clip scaleX from the plot's left edge), `bar-grow` 700ms staggered 90ms, `live-pulse` 2.4s loop on the latest actual, tooltip `pop-in`, values/markers transition 700ms on `--ease-ios` when data changes.
- Kanban: `lift` 240ms on pick-up, drop animation 420ms `--ease-ios`, `card-wash` 1.4s on the landed card, drag auto-scroll capped at ~400px/s so a finger at the edge moves one column at a time.
- Swipe-to-dismiss: 1:1 tracking, 0.2× rubber-band past rest, dismiss past 30% or at > 0.5 px/ms.
- `prefers-reduced-motion` collapses everything to 1ms.

## Iteration Guide
1. Read this file before building any page; reference YAML keys (`{components.stat-tile}`) instead of writing raw values.
2. Start new pages from the shell: topbar (`page-title` + tabs) → 62px toolbar (chips left, secondary + primary right) → content region with 16px gutters.
3. Prefer composition: a new page should be 80% existing components (tiles, tags, meters, sparklines, menus, sheets) and 20% a new layout.
4. Any genuinely new colour, size or radius goes into the YAML block (and `app/globals.css` `@theme`) with a one-line reason — never inline a one-off hex.
5. Verify at 1920px, 1024px, 768px and 375–390px; overlays must become bottom sheets / drawers below `md` / `lg`.
6. When emphasis is needed, reach for weight (450 → 500 → 600) or `{colors.ink}` before adding colour or borders.
7. When an extension pattern gets built, move it from "derived" into its category with real measurements.

## Known Gaps
- **Light theme:** not designed; the system is dark-only.
- **Error / validation states** exist only for the Company name field and the logo upload; no global toast/banner system yet.
- **Loading / skeleton states** are not designed.
- **Disabled states** are only generic (50% opacity).
- **Full-page timeline, contact grid, stepper** are *derived* patterns above, not measured from a reference. The Kanban board, deal card, KPI strip, stage track and all Forecast charts were designed from this system (no external reference) and are documented as built.
- **Activities, Contacts, Email Sequences** and the team/pipeline sidebar destinations have no pages yet (nav items show "Coming soon").
- Chart tooltips are pointer/touch driven; there is no keyboard scrubbing for the line chart yet.
- Backdrop-blur strength and `linear()` spring rendering vary slightly by browser; they are not pixel tokens.
