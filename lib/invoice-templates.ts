/**
 * Invoice templates. A template is a layout (one of ten compositions) plus a
 * palette and a type voice. Every colour here is a solid hex — tints are
 * pre-mixed with `mix()` instead of using opacity, so invoices print and
 * export with no transparency anywhere.
 */
export type LayoutId = "classic" | "banner" | "sidebar" | "hero" | "split" | "ledger" | "editorial" | "card" | "swiss" | "band";
export type FontVoice = "sans" | "serif" | "mono";

export type InvoiceTemplate = {
  id: string;
  name: string;
  tone: "dark" | "light";
  layout: LayoutId;
  font: FontVoice;
  /** Page background. */
  bg: string;
  /** Primary text. */
  ink: string;
  /** Brand fill (bands, sidebars, total blocks). */
  accent: string;
  /** Text set on the accent fill. */
  onAccent: string;
  /** Accent used as text on the page (defaults to accent). */
  accentText?: string;
  /** Inset panels (cards, sidebar); pre-mixed if omitted. */
  panel?: string;
};

type Seed = [id: string, name: string, tone: "dark" | "light", layout: LayoutId, font: FontVoice, bg: string, ink: string, accent: string, onAccent: string, accentText?: string, panel?: string];

const SEEDS: Seed[] = [
  // Dark
  ["graphite", "Graphite", "dark", "classic", "sans", "#161616", "#fafafa", "#6b56ff", "#ffffff", "#9d8cff"],
  ["midnight", "Midnight", "dark", "banner", "sans", "#0e1525", "#e8edf6", "#2f6fe4", "#ffffff", "#7fb0ff"],
  ["obsidian-gold", "Obsidian Gold", "dark", "editorial", "serif", "#111110", "#f3efe6", "#c9a45c", "#15120b", "#d9b873"],
  ["forest", "Forest", "dark", "sidebar", "sans", "#0f1a14", "#e9f2ec", "#1f7a55", "#ffffff", "#5fd3a0", "#15251c"],
  ["oxblood", "Oxblood", "dark", "hero", "sans", "#1a0e10", "#f6ecee", "#c2323d", "#ffffff", "#ff7b84"],
  ["terminal", "Terminal", "dark", "ledger", "mono", "#0b0d0b", "#d6f5d6", "#3ddc6a", "#061208", "#5ff08a"],
  ["carbon-lime", "Carbon Lime", "dark", "swiss", "sans", "#121212", "#f4f4f4", "#c6f432", "#141a02"],
  ["deep-ocean", "Deep Ocean", "dark", "card", "sans", "#06121c", "#e3f1f7", "#1aa39a", "#ffffff", "#5fe0d3", "#0d2231"],
  ["aubergine", "Aubergine", "dark", "split", "sans", "#191223", "#f1eaf8", "#9b5de5", "#ffffff", "#c9a4ff"],
  ["espresso", "Espresso", "dark", "band", "serif", "#1b1410", "#f4ebe1", "#c98a4b", "#1b1006", "#e3a86b"],
  ["slate-ember", "Slate Ember", "dark", "classic", "sans", "#1d2025", "#eef1f5", "#f07b2c", "#ffffff", "#ffa266"],
  ["noir-serif", "Noir", "dark", "editorial", "serif", "#0a0a0a", "#f5f5f5", "#f5f5f5", "#0a0a0a"],
  ["cobalt-night", "Cobalt Night", "dark", "hero", "sans", "#0b1230", "#e7ebff", "#4f6bff", "#ffffff", "#93a6ff"],
  ["jade-mono", "Jade Ledger", "dark", "ledger", "mono", "#0e1614", "#dcefe8", "#34b58a", "#04140e", "#57d6ab"],
  ["rosewood", "Rosewood", "dark", "sidebar", "serif", "#1f1216", "#f7e9ee", "#b8456f", "#ffffff", "#f08db1", "#2a1920"],
  ["steel", "Steel", "dark", "swiss", "mono", "#1a1d21", "#e6ebf0", "#8fb8e8", "#0c1622"],
  // Light
  ["paper", "Paper", "light", "classic", "sans", "#ffffff", "#141414", "#4327fa", "#ffffff"],
  ["ivory-editorial", "Ivory", "light", "editorial", "serif", "#fbf8f1", "#1d1a15", "#8a5a2b", "#ffffff"],
  ["mint-banner", "Mint", "light", "banner", "sans", "#ffffff", "#10201c", "#0f766e", "#ffffff"],
  ["blush", "Blush", "light", "card", "sans", "#fbeef1", "#2a1219", "#be185d", "#ffffff", undefined, "#ffffff"],
  ["swiss-red", "Swiss Red", "light", "swiss", "sans", "#ffffff", "#111111", "#e11d2a", "#ffffff"],
  ["receipt", "Receipt", "light", "ledger", "mono", "#fafaf6", "#161616", "#161616", "#fafaf6"],
  ["sky-sidebar", "Sky", "light", "sidebar", "sans", "#ffffff", "#0f1b33", "#2563eb", "#ffffff", undefined, "#eef3ff"],
  ["sand", "Sand", "light", "hero", "serif", "#f5efe4", "#2b2116", "#b45309", "#ffffff"],
  ["lavender", "Lavender", "light", "split", "sans", "#faf8ff", "#1c1330", "#6d28d9", "#ffffff"],
  ["monochrome", "Monochrome", "light", "classic", "mono", "#ffffff", "#111111", "#111111", "#ffffff"],
  ["olive", "Olive", "light", "band", "sans", "#f6f6ee", "#1f2410", "#4d5b23", "#ffffff"],
  ["coral", "Coral", "light", "hero", "sans", "#ffffff", "#221414", "#e5484d", "#ffffff"],
  ["ink-banner", "Ink", "light", "banner", "serif", "#ffffff", "#161616", "#161616", "#ffffff"],
  ["sage", "Sage", "light", "card", "serif", "#ecf1ec", "#18261c", "#3f6b4a", "#ffffff", undefined, "#ffffff"],
  ["newsprint", "Newsprint", "light", "editorial", "serif", "#f3f0e8", "#1c1c1c", "#1c1c1c", "#f3f0e8"],
  ["citrus", "Citrus", "light", "swiss", "sans", "#fffdf6", "#1a1606", "#f5b014", "#1a1606", "#b27a00"],
  ["arctic", "Arctic", "light", "split", "mono", "#f4f8fb", "#0f1d29", "#0e7490", "#ffffff"],
  ["royal", "Royal", "light", "band", "serif", "#ffffff", "#141a33", "#27348b", "#ffffff"],
];

export const TEMPLATES: InvoiceTemplate[] = SEEDS.map(([id, name, tone, layout, font, bg, ink, accent, onAccent, accentText, panel]) => ({
  id,
  name,
  tone,
  layout,
  font,
  bg,
  ink,
  accent,
  onAccent,
  accentText,
  panel,
}));

export const templateById = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
/** Solid blend of `a` toward `b` by `amount` (0–1) — used instead of opacity. */
export function mix(a: string, b: string, amount: number) {
  const x = hex(a);
  const y = hex(b);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * amount).toString(16).padStart(2, "0")).join("")}`;
}

/** Derived, solid palette a layout paints with. */
export function paletteOf(t: InvoiceTemplate) {
  return {
    bg: t.bg,
    ink: t.ink,
    soft: mix(t.ink, t.bg, 0.28),
    muted: mix(t.ink, t.bg, 0.48),
    line: mix(t.bg, t.ink, t.tone === "dark" ? 0.16 : 0.12),
    faint: mix(t.bg, t.ink, t.tone === "dark" ? 0.07 : 0.045),
    panel: t.panel ?? mix(t.bg, t.ink, t.tone === "dark" ? 0.05 : 0.035),
    accent: t.accent,
    onAccent: t.onAccent,
    accentText: t.accentText ?? t.accent,
    onAccentSoft: mix(t.onAccent, t.accent, 0.3),
  };
}
export type Palette = ReturnType<typeof paletteOf>;

export const FONT: Record<FontVoice, string> = {
  sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  serif: "var(--font-serif), ui-serif, Georgia, serif",
  mono: "var(--font-geist-mono), ui-monospace, monospace",
};
