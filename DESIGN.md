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
  # Pipeline identity colours — the sidebar dots; used only on that pipeline's own page (map heat, site markers, owner-mix shades)
  pipeline-na: "#ffdb4b"
  pipeline-emea: "#f25c8f"
  pipeline-apac: "#8b7bff"
  # Activity heatmap levels (0 → 4)
  heat-0: "rgba(255,255,255,0.05)"
  heat-1: "rgb(0 181 98 / 0.28)"
  heat-2: "rgb(0 181 98 / 0.5)"
  heat-3: "rgb(0 181 98 / 0.75)"
  heat-4: "{colors.spark}"
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
  display-hero:        # the single gauge readout on a report page (Q1 Forecast) — nothing else
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -1.2px
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
  segmented-control:
    height: 34px
    track: "{colors.surface-control}, 1px {colors.border-control}, {rounded.pill}, 3px padding"
    thumb: "{colors.surface-raised} + 1px rgba(255,255,255,0.13) + 0 1px 2px rgba(0,0,0,.4) — glides on --ease-ios (500ms)"
    item: "{typography.control}, active {colors.ink} / inactive {colors.muted}, optional 13px icon (hidden on phones)"
  activity-icon:
    sizes: "24px (rows, rounded.sm) · 28px (deal sheet) · 32px (feed)"
    backgroundColor: "{colors.surface-raised}"
    border: "1px {colors.border-card}"
    icon: "42% of tile, {colors.body}, stroke 1.75 — Phone / Mail / Video / FileText / CircleCheck"
  feed-item:
    layout: "32px activity-icon on a 1px {colors.hairline} spine · sentence in {typography.body-copy} with bold actor and linked company · time {typography.label} right-aligned"
    body: "{typography.label} at 80% {colors.body}; notes use the quote block ({colors.surface-raised}, 1px #3a3a3a, {rounded.md})"
    dealChip: "22px pill, {colors.surface-card} fill, 1px {colors.border-card}, 14px logo + deal title in {typography.label}"
    gap: "20px between items"
  day-header:
    typography: "{typography.section-label} + '· n' count in {colors.muted}"
    behaviour: "sticky to the top of the scroll area on a 90% canvas + 6px blur (iOS list headers)"
  agenda-row:
    height: "52px min"
    content: "checkbox · time (58px, {typography.label}; overdue → date in {colors.alert}) · 24px activity-icon · title {typography.body-strong} over company {typography.label} · 20px avatar"
    done: "title → {colors.muted} + line-through"
    swipeAction: "touch only: row tracks the finger left, revealing a green tinted action (Done / Undo); commits past 88px, rubber-bands past 132px, springs back 420ms --ease-ios"
  heatmap:
    grid: "12 weeks × 7 days, Monday-first, 4px gaps, square cells {rounded: 3px}"
    levels: "heat-0 … heat-4 at 0 / 1–2 / 3–4 / 5–7 / 8+ per day"
    labels: "months above first week of each month, Mon/Wed/Fri at left, 11px {colors.muted}"
    readout: "one line above the grid names the hovered / tapped / busiest day — no floating tooltip"
    legend: "Less ■■■■■ More, 10px swatches, right-aligned"
  search-pill:
    size: "220px × 30px (full width inside the phone Filters popover)"
    look: "filter-chip shell, 13px search icon, {typography.label} input, 18px round clear button"
    focus: "border rgba(255,255,255,0.18)"
  contact-card:
    backgroundColor: "{colors.surface-card}"
    border: "1px {colors.border-card} (hover #3a3c3f)"
    rounded: "{rounded.md}"
    padding: 16px
    rows: "40px avatar + name 15px/500 over role {typography.label} + star · 16px logo + company · persona tags · 'Relationship' win-meter + score · hairline · last touch (cold → {colors.alert}) + 26px round mail/call actions"
    grid: "auto-fill minmax(272px, 1fr), 12px gap"
    actions: "revealed on hover/focus from md, always visible on touch"
  star-toggle:
    size: 28px
    off: "{colors.muted} outline star"
    on: "{colors.meter-amber} filled, scale 1.1 on --ease-pop"
  alphabet-index:
    visibility: "phones, name sort only"
    look: "fixed to the right edge, 11px/600 {colors.body} letters, 17px rows"
    behaviour: "tap or drag to jump; a 48px canvas bubble previews the letter; 4ms haptic tick"
  action-tile:
    size: "62px tall, 4 across"
    look: "{colors.surface-card}, 1px {colors.border-card}, {rounded.md}, 16px icon over {typography.label}"
    use: "primary actions at the top of a person/entity sheet (Email · Call · Log · Company)"
  info-row:
    height: "43px min, hairline separated"
    content: "14px muted icon · 72px {typography.label} {colors.muted} label · value {typography.body-strong}"
  toggle-tag:
    look: "a regular tag; unselected at 45% opacity (75% on hover), selected 100%"
    use: "multi-select of categories inside forms (e.g. buying roles)"
  switch:
    size: "40 × 24px track, 20px white thumb"
    off: "#2a2a2a + 1px {colors.border-control}"
    on: "{colors.live}"
    motion: "thumb springs 16px on --ease-pop (420ms); track colour 300ms"
    use: "binary on/off state of a running thing (e.g. sequence Running / Paused)"
  sequence-row:
    padding: "14px 16px, hairline below"
    content: "name {typography.body-strong} over status-pill + 'n steps · n enrolled' {typography.label}; right: reply % over open % + owner avatar"
    selected: "{colors.row-selected} + 2px {colors.ink} bar on the left edge (desktop master/detail)"
  step-card:
    layout: "24px index circle on a 1px {colors.hairline} spine (40px left gutter); optional 'Wait n days' pill (20px, 11px text, clock) above the card"
    card: "{colors.surface-card}, 1px {colors.border-card}, {rounded.md}, 12px padding"
    content: "24px step icon + kind {typography.control} + 'Day n' + sent count · subject {typography.body-strong} · 2-line body preview {typography.label} · hairline · Open (spark) / Reply (amber) rate bars (4px × 40px)"
    variables: "{{variable}} rendered as a 4px-radius chip at 7% white"
  delay-stepper:
    size: "36px tall, − / value / + with hairline dividers"
    look: "input shell ({colors.surface-input}, 1px {colors.border-input}, {rounded.md})"
  enrollment-row:
    height: "52px min"
    content: "28px avatar · name over role · company · one 10×6px segment per step (done green, current amber, pending empty) · 'Step n/m' · state tag (active blue, replied land, bounced red, finished neutral)"
  rep-card:
    backgroundColor: "{colors.surface-card}"
    border: "1px {colors.border-card} (hover #3a3c3f)"
    rounded: "{rounded.md}"
    padding: 16px
    rows: "44px avatar with an 18px rank badge · name 15px/500 over title · territory · status tag · 'Quota attainment' 28px/600 % (unit 18px muted) with closed-of-quota + projected % · 34-segment win-meter-bar · hairline · Pipeline / Avg win / Activity 7d figures (11px label over 14px/500 value) · top deal + 14-week activity sparkline · 'Open profile ↗'"
    grid: "auto-fill minmax(300px, 1fr), 12px gap"
  rep-status:
    rule: "projected = closed + probability-weighted open pipeline closing in the period; ≥100% On track (tag-land) · ≥70% At risk (tag-yellow) · otherwise Behind (tag-red)"
    sdr: "pacing = meetings ÷ share of the period elapsed ÷ meeting quota, same thresholds"
  sdr-card:
    base: "rep-card"
    hero: "'Meetings booked' 28px/600 count with '/quota' in 18px muted; % of quota + pacing % on the right; 34-segment bar"
    figures: "Calls · Emails · Connect rate"
    footer: "partner AE chip ('Books for …') + sourced $ · n deals; 14-week meetings sparkline"
  radial-gauge:
    geometry: "semicircle, 41 annular segments (R 148, 24px thick, 0.9° gaps) in a 320-wide viewBox, max 360px"
    fill: "win-meter ramp (gradientColors) for round(attainment × 41) segments, rest {colors.meter-empty}"
    marker: "2px {colors.ink} tick for the secured share, rotated into place on --ease-ios (700ms)"
    readout: "{typography.display-hero} % inside the arc + {typography.label} projected $ + gap line ({colors.alert} short / {colors.meter-green} ahead)"
    motion: "segments seg-in staggered 14ms; readout numbers count up with useTween"
  waterfall:
    height: 280px
    columns: "six equal columns: sources float on the running total, a restacked total, then the gap (hatched coral) or cushion (hatched green)"
    bars: "42% of column, max 64px, {rounded.bar}; not-yet-created value = dashed {colors.muted} outline on 4% white"
    connectors: "1px dashed {colors.hairline-overlay} from each bar top to the next bar"
    target: "dashed {colors.series-target} line across all columns with inline 'Quota $3.4M'"
    labels: "value 12px above each bar; name {typography.control} + hint 11px under the baseline (short names on phones)"
  scenario-tile:
    look: "8px card, 1px {colors.border-card}; active = #55585c border + {colors.surface-card} fill + 6px {colors.live} dot"
    content: "name {typography.control} · {typography.metric} $ · 34-segment win-meter-bar · % of quota + gap · 11px assumptions line"
  bubble-chart:
    axes: "x = close date (month dividers dashed 2 4), y = win probability 0–100% on hairlines"
    bubble: "r ∝ √value (max 28px, 18px on phones), fill = stage tag text colour at 18% (32% hover), 1px stroke at 75%, 2px centre dot"
    hover: "others dim to 35%, chart-tooltip (208px) with value / probability / weighted / close / owner; click opens the deal sheet"
    labels: "company name beside bubbles ≥ $250K on desktop, flipped left near the edge"
  slip-trail:
    row: "grid 260px label · track · 132px values, 52px min (phones: label row over a full-width track)"
    marks: "11px hollow ring = first commit, 7px rings = intermediate pushes, 12px solid dot ringed in {colors.canvas} = current close"
    line: "2px, {colors.meter-amber} within quarter / {colors.meter-red} left quarter · repeat · overdue; overdue adds a dashed coral run to Today and a live-pulse dot"
    axis: "quarter labels ({typography.overline}-style, 11px) on hairline boundaries, months 11px {colors.muted}, a 'Today' pill on {colors.hairline-overlay}"
    motion: "lines grow-x from the original date (45ms stagger), dots bubble-in after; recommitted rows play row-in"
  sankey:
    height: 272px
    nodes: "8px {colors.body} bars, {rounded.bar}, 14px gaps; label + compact $ outside"
    ribbons: "cubic bands, {colors.meter-amber} (stayed) / {colors.meter-red} (moved out) at 34% — 55% hovered, 14% others"
  review-deck:
    container: "{components.dialog}; progress = one 10×4px pill per deal (done green, current ink, pending empty)"
    card: "{colors.surface-card} card with date chips (current chip tinted by severity), three figures and a stage tag; enters with deck-in (460ms --ease-ios)"
    actions: "four 74px action tiles (Keep · +2 weeks · Next quarter · Mark won) + a native date input; toggle-tag reasons"
  dot-matrix-map:
    grid: "84 columns of land cells from Natural Earth 1:50m (lib/pipeline-maps.ts), square after cos(latitude) scaling; 10-unit cells, 2.3-unit dots"
    land: "white at 8.5% — one <path> for all base dots"
    heat: "Σ value-weighted Gaussian (σ 3.6 cells) from each site; 4 levels in the pipeline colour at 20 / 36 / 56 / 85%"
    markers: "r = 7 + √(share) × 15, pipeline colour at 16% fill (34% active) with a 1.5px ring (2.5px active) and a 3.5-unit centre dot"
    labels: "top six sites that don't collide, 17-unit Geist 500 in {colors.body} with a canvas halo; hidden on phones"
    size: "full width up to 600px tall, centred; beside a 340px territory list from lg"
    motion: "land scans in with reveal, heat fades in by level, markers bubble-in 60ms apart"
  territory-row:
    height: "52px min"
    content: "8px pipeline dot · city {typography.body-strong} + country {typography.label} · compact $ · 4px share bar in the pipeline colour · deal count"
    behaviour: "hover lights the map marker; tap focuses the deal list on the city"
  stage-funnel:
    height: 200px
    bars: "one per stage, height ∝ value that reached it (at or beyond), 30% of column (max 56px), stage tag text colour at 90% (25% when another stage is focused)"
    bands: "cubic tapered joins in white 5%; conversion % in a 22px canvas pill on each band"
    labels: "stage {typography.control} + reached $ 16px/500 above, 'n here' below"
  owner-mix:
    bar: "10px bar split by owner, pipeline colour stepping down 16% opacity per owner"
    rows: "leaderboard-row style: shade dot · avatar · name · deals · $ · share %"
  invoice-studio:
    container: "full-screen dialog on {colors.canvas} (sheet-up on phones, pop-in from md); 56px header with close, number + status tag, Download PDF, one primary action"
    stage: "the page scaled to fit (max 100%), 1px {colors.border-card} ring + 0 24px 64px rgba(0,0,0,.55) — the paper is the one object that floats on the page; phones give it 62dvh"
    panel: "424px from lg; segmented-control Templates · Details; gallery = 2-up thumbnails (3-up on tablets) with a 2px {colors.ink} ring when selected, a bg/accent swatch, name and layout"
    details: "section-label groups (Dates · Line items · Adjustments · Notes), line items as {colors.surface-card} cards, a totals summary; paid invoices are locked"
  invoice-status:
    tones: "Draft tag-neutral · Sent tag-blue · Viewed tag-purple · Paid tag-land · Overdue tag-red (derived: sent/viewed past due)"
  aging-bar:
    buckets: "Current {colors.meter-green} · 1–30 {colors.meter-amber} · 31–60 tag-orange text (#fed7aa) · 60+ {colors.meter-red}"
  invoice-template:
    page: "A4 at 96 dpi (794 × 1123), laid out once and scaled for previews, thumbnails and print"
    colour: "every value a solid hex — tints are pre-mixed with mix(), never opacity; the page prints with print-color-adjust: exact"
    layouts: "classic · banner · sidebar · hero · split · ledger · editorial · card · swiss · band"
    voices: "Geist (sans), Geist Mono (ledger/mono), Instrument Serif (editorial titles and figures)"
    library: "34 templates, 16 dark and 18 light, in lib/invoice-templates.ts"
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
- **Activities page** — KPI strip (counts, `currency={false}`), then the `feed-item` timeline grouped under sticky `day-header`s with "Show older activity" paging (6 days per page); the right column holds *Today's agenda* (`agenda-row`s with a win-meter of completion) and *Team activity* (`heatmap` + a by-type list with 6px `{colors.spark}` share bars). Company names and deal chips open their sheets; logging an activity inserts it into the feed and the deal sheet's timeline.
- **`segmented-control`** — the activity-type picker in *Log Activity*; use it for any 2–5 option exclusive choice inside forms. `iconOnly` keeps labels for screen readers (Contacts grid/list switch).
- **Contacts page** — KPI strip, then a `contact-card` grid (continuous from `md`; on phones grouped under sticky letter/company headers with the `alphabet-index`) or a dense list view (desktop/tablet, horizontal scroll + mouse pan). Persona tags use the tag palette: Champion `tag-land`, Decision maker `tag-blue`, Economic buyer `tag-purple`, Influencer `tag-teal`, Technical `tag-yellow`, Blocker `tag-red`. Relationship strength reuses the `win-meter`; >21 days without a touch reads "Going cold" in `{colors.alert}`.
- **Team pages** (`components/team`, routes `/team/strategic-aes`, `/team/mid-market`, `/team/sdr-team`, all rendered by `TeamPage`) — AE teams share one template: KPI strip (team closed vs. quota, projected, pipeline coverage, activity), a grid of `rep-card`s, then *Leaderboard* (ranked by attainment) beside *Strategic accounts* (accounts owned by the team with furthest stage, open pipeline and health). The rep sheet reuses the entity-sheet pattern: header + `rep-status` tag, four `action-tile`s (Email · Deals · Forecast · Activity — the last three navigate with that rep's owner filter applied), quota section, open deals, account chips and recent activity. Rosters live in `lib/teams.ts` and reference existing owners, so all numbers stay live; each AE team sets its own `accountsLabel`.
- **SDR variant** — same page skeleton with meetings as the quota: KPI strip (meetings booked + pacing, pipeline sourced, connect rate, activities), `sdr-card`s, a leaderboard by meeting attainment and a *Sourced pipeline* list (deals an SDR created; values and stages come live from the deals store). The SDR sheet shows meetings, activity tiles, the partner AE and sourced deals; *AE deals* opens the board filtered to the partner.
- **Q1 Forecast** (`/reports/q1-forecast`, `components/reports/q1`) — next fiscal year's first quarter (FQ1 FY28, Feb–Apr) planned from today: KPI strip (quota, open Q1 pipeline + coverage, projected bookings, days to Q1), the `radial-gauge` with the scenario planner underneath (`segmented-control` presets + three sliders: win rate, weekly pipeline creation, FQ4 slip-in), a `waterfall` *Path to quota* (renewals → weighted open pipeline → FQ4 slip-in → new pipeline × win rate → projected → gap) with `scenario-tile`s, a `bubble-chart` *Q1 deal map*, a *Monthly plan* (stacked pipeline/weighted bars vs. target markers) and *Rep readiness* (coverage meter + Ready ≥1.5× `tag-land` / Building ≥0.75× `tag-yellow` / Thin `tag-red`; tapping a rep re-plans the page for them). Scenario changes glide (bars, tick, tweened numbers); owner changes replay the entrances.
- **Slipping Deals** (`/reports/slipping-deals`, `components/reports/slipping`) — open deals whose close date has moved later or passed. KPI strip (slipped value, pushed out of quarter, average slip, repeat slippers), the `slip-trail` hero, then *Quarter flow* (`sankey`), *Why deals slip* (reason tags with share bars in the tag's text colour, days lost + pushes) and *Slip by rep* (slip rate meter, top 7 with an *All* toggle). *Start Review* opens the `review-deck`; recommitting writes the new date to the deals store and records the push, so the board, forecast and trail all update.
- **Pipeline pages** (`/pipelines/north-america`, `/pipelines/emea-enterprise`, `/pipelines/apac-expansion`, all rendered by `PipelinePage`) — every deal is sold into an account *site* (city) and each site belongs to one pipeline (`lib/pipelines.ts`), so one company can appear in several regions. Page: toolbar (Closing window · Owner · Export · *New Deal*, preset to the pipeline's HQ city), KPI strip (open pipeline + share of company pipeline, weighted, closed won, pipeline velocity = weighted ÷ average days to close), the `dot-matrix-map` beside `territory-row`s, the `stage-funnel`, *When it closes* (monthly bars Aug → Apr stacked by stage colour with a Today divider) beside `owner-mix`, and the deal list (12 rows, *Show all*). The city (map/list), the stage (funnel) and the owner (owner mix) all focus the page; focus chips on the deal list clear them. The pipeline colour appears only on its own page.
- **Invoices** (`/invoices`, `components/invoices`) — every invoice is raised from a Closed Won deal (lines prefilled so they sum to the deal value; the bill-to contact is the account's economic buyer). Page: toolbar (Status · Owner · Export · *New Invoice* → deal picker), KPI strip (outstanding, overdue, collected this quarter, average days to pay), *Receivables aging* (`aging-bar` + bucket rows) beside *Ready to invoice* (won deals without an invoice, each with an *Invoice* pill) and the default-template picker, then the invoice list (mono number, account, deal, dates with "+n d" when late, amount, `invoice-status` tag, template swatch, owner). Rows open the `invoice-studio`, which is mounted app-wide so the deal sheet's *Create invoice / View invoice* works from any page. *Download PDF* prints only the page through a body-level portal (`@page A4, margin 0`).
- **Invoice templates** — the only place other palettes appear, and only *inside the paper*. Each template = one of ten layouts + palette + type voice; both tones cover every layout family. Templates never use transparency, gradients or shadows; depth comes from solid fills (bands, sidebars, total blocks) and rules. The app chrome around them follows this document as usual.
- **Email Sequences page** — KPI strip (with `%` suffix values), then a master/detail split: `sequence-row` list (380px) and the detail (title + status pill + goal + `switch`, four stat tiles, `step-card` stepper with *Add step*, and the enrolled list with *Enroll contacts*). Below `lg` it becomes iOS navigation: the list is the root screen and the detail pushes in from the right (`sheet-in`) with a "‹ Sequences" back bar.
- **Step editor sheet** — `segmented-control` for the step type, `delay-stepper`, subject + message with one-tap `{{first_name}}` / `{{company}}` / `{{sender}}` chips that insert at the cursor, and a live preview rendered for the first enrolled contact. Delete lives bottom-left in `{colors.alert}`.
- **Contact sheet** — header (52px avatar, name, role · company, star), persona tags, four `action-tile`s, `info-row`s, relationship (28px score, account-touch sparkline, 64-segment meter), open deals and recent activity. *Log Activity* opens the log dialog prefilled with the contact's company.
- **Activity timeline (deal sheet)** — 28px `surface-raised` icon tiles on a 1px `{colors.hairline-overlay}` spine, `body-copy` text, `label` time.

### Footer
The table footer is the only footer: 39px, four equal cells separated by hairlines, `label` text in `#7c7f7f`, `+ Add calculation` affordances. On phones it becomes a 2×2 grid.

### Extension patterns for upcoming pages (derived — not yet built)
These are *compositions of the tokens above* for Deals Board, Forecast, Activities, Contacts and Email Sequences. Build from them; promote each to a real component entry once implemented.
- **KPI deltas** — when a metric needs a trend, append it to the `kpi-strip` meta line in `label`, coloured `{colors.meter-green}` (up) / `{colors.meter-red}` (down).
- **New charts** — follow `line-chart` / `bar-chart`: hairline gridlines, `label` axes, series colours only from the `series-*` tokens (actual → closed, committed → commit, upside → best, remainder → pipeline, goals → target), no chart backgrounds, no boxed legends. Past = solid, future = dashed.
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
- **Team pages** → rep cards stack one per row on phones; leaderboard hides closed $ below `md`, projected below `sm` and activity below `lg`; the accounts list drops owner, stage and health progressively.
- **Email Sequences** → master/detail becomes a pushed detail screen below `lg`; detail stat tiles 2×2 below `sm`; steps and enrolled stack into one column below `xl`; enrollment step segments hide below `sm`.
- **Contacts** → one card per row on phones with sticky section headers and the A–Z index; the list view is replaced by cards below `md`; the view switch hides on phones.
- **Activities** → single column below `lg` with the agenda + heatmap *first* (what matters today), then the feed; agenda owner avatars hide below `sm`; segmented-control icons hide on phones.
- **Rule:** every horizontally scrolling region must also be operable with a mouse in a narrow window (tabs, click-drag pan or header wheel) — never rely on touch swipes alone.
- **Sheets / New Company** → bottom sheets, dismissable by dragging the header down.
- **Topbar** → hamburger added, user pill shows avatar only.
- **Q1 Forecast** → gauge/planner, waterfall, deal map and monthly plan stack below `lg`; waterfall labels switch to short names and hints hide on phones; bubbles shrink (max 18px) and lose their labels; rep readiness is one column below `xl` and hides deals / pipeline progressively.
- **Slipping Deals** → trail rows become label-over-track on phones (value + slip badge beside the name), quarter labels shorten to "FQ3", alternate month labels hide; the three bottom panels stack below `xl`; the review deck is a bottom sheet with a 2×2 action grid.
- **Invoices** → the aging and ready panels stack below `lg`; list rows become two-line (company over number · due) with amount and status; the studio stacks the preview (62dvh) over the panel and scrolls as one page; the header drops the company logo and the Download label.
- **Pipeline pages** → KPI strip 2×2; the territory list drops under the map below `lg`; map labels hide on phones; funnel stage names truncate and the 'here' suffix hides; deal rows become two-line (company over title · city) with value only.
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
- Reports: gauge `seg-in` (520ms --ease-pop, 14ms stagger), `useTween` count-ups (700–900ms ease-out cubic), `grow-x` 900ms for slip lines and share bars, `bubble-in` 620ms --ease-pop, `deck-in` 460ms for review cards; slider-driven values transition 700ms on --ease-ios instead of re-animating.
- Activities: heatmap cells `fade-in` staggered 35ms per week column; agenda swipe tracks 1:1 and springs back 420ms `--ease-ios`; completing an item cross-fades the title to muted + strike-through (300ms).
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

## Data Model (how pages stay consistent)
- Numbers are **derived, never stored**: company metrics come from deals + activity (`lib/company-metrics.ts`), contacts' last touch from activity, and every report from the deals store. New UI must read these hooks (`useCompanies`, `useLiveContacts`, the page data hooks) rather than the raw seeds.
- Stores never import each other to report changes; they `emit()` a `CrmEvent` and `lib/wire.ts` records it. System events are kept apart from logged activity (`events` vs `activities`) so rep activity counts stay honest.
- **`feed-event`** — system entries in the activity feed and deal timeline: the `activity-icon` tile with a `Zap` glyph, "{actor} {what happened} · {company}" in `{typography.body-copy}`, detail line in `{typography.label}`. Wins, payments and new records also raise a notification.
- Domain stores persist to `localStorage` (`zerocrm:v1:*`), rehydrate after mount and resync on the `storage` event; UI state (filters, open sheets) is never persisted. *My Profile → Demo Data → Reset* clears it.

## Known Gaps
- **Light theme:** not designed; the system is dark-only.
- **Error / validation states** exist only for the Company name field and the logo upload; no global toast/banner system yet.
- **Loading / skeleton states** are not designed.
- **Disabled states** are only generic (50% opacity).
- Every page beyond Companies (Kanban, Forecast, Activities, Contacts, Email Sequences) was designed from this system without an external reference and is documented here as built.
- Company numbers are now live, so the Companies table no longer shows the reference screenshot's values (layout and styling are unchanged).
- Sync is per browser (localStorage + tabs); multi-user, multi-device realtime needs a server.
- Pipeline sites are demo coordinates at city level; the maps are static region crops (no pan/zoom) and very close cities merge into one site (e.g. the SF Bay Area).
- Q1 renewals ($480K) and the flat $300K rep Q1 quota are plan constants; close-date push history is seeded demo data (new pushes from the review are recorded live).
- SDR call / email / meeting counts are roster demo data (sourced pipeline is live); FQ4 shows zeros because it hasn't started.
- Sequences don't actually send email; step stats are demo data.
- Demo contacts are fictional and use reserved `.example` emails and 555-01xx phone numbers.
- Timestamps are timezone-free local strings in the demo data; a real backend must supply the viewer's timezone.
- Invoices are not emailed and "viewed" only comes from the seed data; PDF export uses the browser's print dialog (Save as PDF). Seller, bank and payment details are fictional placeholders.
- Chart tooltips are pointer/touch driven; there is no keyboard scrubbing for the line chart yet.
- Backdrop-blur strength and `linear()` spring rendering vary slightly by browser; they are not pixel tokens.
