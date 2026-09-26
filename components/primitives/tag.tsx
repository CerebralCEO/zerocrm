import type { Tag as TagName } from "@/lib/data";
import { cn } from "@/lib/utils";

type Tone = { bg: string; border: string; text: string };

/* Sampled from the reference: each tag is an opaque tinted pill with a 1px border. */
export const TONES: Record<string, Tone> = {
  pilot: { bg: "#3e291d", border: "#764d35", text: "#eeb390" },
  blue: { bg: "#1d2b3e", border: "#23354c", text: "#bfdbfe" },
  green: { bg: "#23451d", border: "#2e5029", text: "#b1ebc5" },
  teal: { bg: "#1f3a2d", border: "#275137", text: "#b1ebc5" },
  yellow: { bg: "#33301a", border: "#5a5228", text: "#fde68a" },
  purple: { bg: "#231f3a", border: "#4b437b", text: "#b7aee9" },
  orange: { bg: "#31221b", border: "#6c4830", text: "#fed7aa" },
  red: { bg: "#3e1d1e", border: "#4c2324", text: "#fecaca" },
  land: { bg: "#102a27", border: "#3b6149", text: "#22c55e" },
  neutral: { bg: "#2a2a2a", border: "#363636", text: "#cfcfcf" },
};

const TAG_TONE: Record<TagName, keyof typeof TONES> = {
  Pilot: "pilot",
  Enterprise: "blue",
  "Mid-Market": "green",
  Expansion: "teal",
  "New Logo": "teal",
  Renewal: "teal",
  SMB: "yellow",
  Upsell: "purple",
  "Co-Sell": "orange",
  Strategic: "red",
  "Land & Expand": "land",
};

export function Tag({
  children,
  tone,
  className,
}: {
  children: React.ReactNode;
  tone: keyof typeof TONES;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex h-[22px] shrink-0 items-center rounded-full border px-[7.5px] text-[14px] leading-none tracking-[-0.1px] whitespace-nowrap",
        className,
      )}
      style={{ background: t.bg, borderColor: t.border, color: t.text }}
    >
      {children}
    </span>
  );
}

export function TagPill({ tag, className }: { tag: TagName; className?: string }) {
  return (
    <Tag tone={TAG_TONE[tag]} className={className}>
      {tag}
    </Tag>
  );
}

/**
 * Shows up to two tags (when their combined label fits ~20 chars),
 * collapsing the rest into a "+N" pill — same behaviour as the reference.
 */
export function TagGroup({ tags, className }: { tags: TagName[]; className?: string }) {
  let visible = tags.slice(0, 2);
  if (visible.length === 2 && visible[0].length + visible[1].length > 20) visible = visible.slice(0, 1);
  const rest = tags.length - visible.length;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {visible.map((t) => (
        <TagPill key={t} tag={t} />
      ))}
      {rest > 0 && (
        <Tag tone="neutral" className="px-[6px]">
          +{rest}
        </Tag>
      )}
    </div>
  );
}
