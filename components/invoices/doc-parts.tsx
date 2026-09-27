import type { CSSProperties } from "react";
import { SELLER, type InvoiceStatus } from "@/lib/invoices";
import { FONT, mix, type InvoiceTemplate, type Palette } from "@/lib/invoice-templates";

/** Everything a layout needs, resolved from the invoice + CRM data. */
export type DocData = {
  number: string;
  status: InvoiceStatus;
  issue: string;
  due: string;
  terms: string;
  company: string;
  contact: { name: string; role: string; email: string } | null;
  place: string;
  deal: string;
  owner: string;
  items: { id: string; description: string; qty: number; unitPrice: number }[];
  subtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  taxLabel: string;
  total: number;
  notes: string;
  paidDate?: string;
};

export type LayoutProps = { d: DocData; t: InvoiceTemplate; p: Palette };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const longDate = (iso: string) => {
  const [y, m, day] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${day}, ${y}`;
};
export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const head = (t: InvoiceTemplate): CSSProperties => ({ fontFamily: FONT[t.font] });
/** Mono voice sets the whole page in mono; serif only titles. */
export const body = (t: InvoiceTemplate): CSSProperties => ({ fontFamily: t.font === "mono" ? FONT.mono : FONT.sans });

/** Uppercase field label. */
export function Label({ p, children, style }: { p: Palette; children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div className="text-[10px] leading-none font-semibold tracking-[1.4px] uppercase" style={{ color: p.muted, ...style }}>
      {children}
    </div>
  );
}

/** Seller mark: a solid tile with the Z glyph + wordmark. `inverse` sets it on the accent fill. */
export function Brand({ t, p, inverse, size = 30 }: { t: InvoiceTemplate; p: Palette; inverse?: boolean; size?: number }) {
  const tile = inverse ? p.onAccent : p.accent;
  const glyph = inverse ? p.accent : p.onAccent;
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex items-center justify-center" style={{ width: size, height: size, borderRadius: size * 0.26, background: tile }}>
        <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} aria-hidden>
          <path d="M5 5h14v3.2L9.6 16H19v3H5v-3.2L14.4 8H5z" fill={glyph} />
        </svg>
      </div>
      <div className="flex flex-col gap-[3px]">
        <span className="text-[15px] leading-none font-semibold tracking-[-0.3px]" style={{ color: inverse ? p.onAccent : p.ink, ...head(t) }}>
          ZeroCRM
        </span>
        <span className="text-[9.5px] leading-none tracking-[0.6px]" style={{ color: inverse ? p.onAccentSoft : p.muted }}>
          ZeroCRM, Inc.
        </span>
      </div>
    </div>
  );
}

export function Seller({ p, inverse, align = "left" }: { p: Palette; inverse?: boolean; align?: "left" | "right" }) {
  return (
    <div className="flex flex-col gap-[5px] text-[11px] leading-[15px]" style={{ color: inverse ? p.onAccentSoft : p.soft, textAlign: align }}>
      <span style={{ color: inverse ? p.onAccent : p.ink }} className="font-semibold">
        {SELLER.name}
      </span>
      {SELLER.lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  );
}

export function BillTo({ d, p, t, inverse, label = "Billed to" }: { d: DocData; p: Palette; t: InvoiceTemplate; inverse?: boolean; label?: string }) {
  const c = inverse ? p.onAccentSoft : p.soft;
  return (
    <div className="flex flex-col gap-[9px]">
      <Label p={p} style={inverse ? { color: p.onAccentSoft } : undefined}>
        {label}
      </Label>
      <div className="text-[19px] leading-none font-semibold tracking-[-0.4px]" style={{ color: inverse ? p.onAccent : p.ink, ...head(t) }}>
        {d.company}
      </div>
      <div className="flex flex-col gap-[4px] text-[11px] leading-[15px]" style={{ color: c }}>
        {d.contact && (
          <span>
            Attn: {d.contact.name} · {d.contact.role}
          </span>
        )}
        {d.contact && <span>{d.contact.email}</span>}
        <span>{d.place}</span>
      </div>
    </div>
  );
}

/** Invoice no / issued / due / terms as label-over-value cells. */
export function Meta({ d, p, inverse, cols = 4, gap = 28 }: { d: DocData; p: Palette; inverse?: boolean; cols?: number; gap?: number }) {
  const cells: [string, string][] = [
    ["Invoice no.", d.number],
    ["Issued", longDate(d.issue)],
    ["Due", longDate(d.due)],
    ["Terms", d.terms],
  ];
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, auto))`, columnGap: gap, rowGap: 16 }}>
      {cells.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-[7px]">
          <Label p={p} style={inverse ? { color: p.onAccentSoft } : undefined}>
            {k}
          </Label>
          <span className="text-[12.5px] leading-none font-medium whitespace-nowrap" style={{ color: inverse ? p.onAccent : p.ink }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

export type TableStyle = "lines" | "zebra" | "boxed" | "bold" | "ruled";

export function Items({ d, p, t, variant = "lines", headFill }: { d: DocData; p: Palette; t: InvoiceTemplate; variant?: TableStyle; headFill?: string }) {
  const boxed = variant === "boxed";
  const cols = "minmax(0,1fr) 54px 110px 118px";
  return (
    <div style={boxed ? { border: `1px solid ${p.line}`, borderRadius: 10, overflow: "hidden" } : undefined}>
      <div
        className="grid items-center text-[10px] leading-none font-semibold tracking-[1.3px] uppercase"
        style={{
          gridTemplateColumns: cols,
          padding: boxed || headFill ? "11px 14px" : "0 0 10px",
          background: headFill ?? (boxed ? p.faint : undefined),
          color: headFill ? p.onAccent : p.muted,
          borderBottom: variant === "bold" ? `2px solid ${p.ink}` : headFill ? undefined : `1px solid ${p.line}`,
        }}
      >
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Unit price</span>
        <span className="text-right">Amount</span>
      </div>
      {d.items.map((it, i) => (
        <div
          key={it.id}
          className="grid items-center text-[12.5px] leading-[16px]"
          style={{
            gridTemplateColumns: cols,
            padding: boxed || headFill || variant === "zebra" ? "15px 14px" : "15px 0",
            background: variant === "zebra" && i % 2 === 1 ? p.faint : undefined,
            borderBottom: variant === "zebra" ? undefined : `1px solid ${variant === "ruled" ? p.ink : p.line}`,
            color: p.soft,
          }}
        >
          <span className="pr-4 font-medium" style={{ color: p.ink, ...(t.font === "serif" ? { fontFamily: FONT.serif, fontSize: 15 } : {}) }}>
            {it.description}
          </span>
          <span className="text-right tabular-nums">{it.qty}</span>
          <span className="text-right tabular-nums">{money(it.unitPrice)}</span>
          <span className="text-right font-medium tabular-nums" style={{ color: p.ink }}>
            {money(it.qty * it.unitPrice)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Totals({ d, p, t, width = 280, strong = "accent" }: { d: DocData; p: Palette; t: InvoiceTemplate; width?: number; strong?: "accent" | "fill" | "ink" | "none" }) {
  const rows: [string, string][] = [["Subtotal", money(d.subtotal)]];
  if (d.discount) rows.push(["Discount", `−${money(d.discount)}`]);
  rows.push([`${d.taxLabel} (${d.taxRate}%)`, money(d.tax)]);
  return (
    <div className="ml-auto flex flex-col" style={{ width }}>
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between py-[7px] text-[12px] leading-none" style={{ color: p.soft }}>
          <span>{k}</span>
          <span className="tabular-nums" style={{ color: p.ink }}>
            {v}
          </span>
        </div>
      ))}
      {strong === "fill" ? (
        <div className="mt-[8px] flex items-center justify-between rounded-[8px] px-[14px] py-[13px]" style={{ background: p.accent, color: p.onAccent }}>
          <span className="text-[11px] font-semibold tracking-[1.2px] uppercase">Amount due</span>
          <span className="text-[20px] leading-none font-semibold tracking-[-0.4px] tabular-nums" style={head(t)}>
            {money(d.total)}
          </span>
        </div>
      ) : strong !== "none" ? (
        <div className="mt-[6px] flex items-baseline justify-between pt-[12px]" style={{ borderTop: `${strong === "ink" ? 2 : 1}px solid ${strong === "ink" ? p.ink : p.line}` }}>
          <span className="text-[11px] font-semibold tracking-[1.2px] uppercase" style={{ color: p.muted }}>
            Amount due
          </span>
          <span
            className="text-[24px] leading-none font-semibold tracking-[-0.6px] tabular-nums"
            style={{ color: strong === "accent" ? p.accentText : p.ink, ...head(t) }}
          >
            {money(d.total)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function PayBlock({ d, p, inverse, cols = 2 }: { d: DocData; p: Palette; inverse?: boolean; cols?: number }) {
  const txt = inverse ? p.onAccentSoft : p.soft;
  const strong = inverse ? p.onAccent : p.ink;
  const lab = inverse ? { color: p.onAccentSoft } : undefined;
  return (
    <div className="grid gap-x-10 gap-y-6" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      <div className="flex flex-col gap-[8px]">
        <Label p={p} style={lab}>
          Payment details
        </Label>
        <div className="flex flex-col gap-[4px] text-[11px] leading-[15px]" style={{ color: txt }}>
          <span style={{ color: strong }} className="font-medium">
            Pay online · {SELLER.payUrl}
          </span>
          <span>{SELLER.bank}</span>
          <span>{SELLER.taxId}</span>
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <Label p={p} style={lab}>
          Notes
        </Label>
        <p className="text-[11px] leading-[16px]" style={{ color: txt }}>
          {d.notes}
        </p>
      </div>
    </div>
  );
}

/** PAID / DRAFT / OVERDUE rubber stamp — solid ink, no transparency. */
export function Stamp({ d, t, p, style }: { d: DocData; t: InvoiceTemplate; p: Palette; style?: CSSProperties }) {
  if (d.status !== "paid" && d.status !== "draft" && d.status !== "overdue") return null;
  const color =
    d.status === "paid" ? (t.tone === "dark" ? "#3ddc84" : "#15803d") : d.status === "overdue" ? (t.tone === "dark" ? "#ff6b6b" : "#c81e1e") : mix(p.ink, p.bg, 0.4);
  const label = d.status === "paid" ? `Paid${d.paidDate ? ` · ${longDate(d.paidDate)}` : ""}` : d.status === "overdue" ? "Overdue" : "Draft";
  return (
    <div
      className="inline-flex items-center rounded-[6px] px-[12px] py-[7px] text-[12px] leading-none font-bold tracking-[2px] uppercase"
      style={{ color, border: `2px solid ${color}`, transform: "rotate(-6deg)", ...style }}
    >
      {label}
    </div>
  );
}

/** Solid bars that read as a barcode (ledger layouts). */
export function Barcode({ seed, color, bg, height = 40 }: { seed: string; color: string; bg: string; height?: number }) {
  const bars = Array.from({ length: 46 }, (_, i) => ((seed.charCodeAt(i % seed.length) * (i + 7)) % 4) + 1);
  return (
    <div className="flex items-stretch gap-[2px]" style={{ height }}>
      {bars.map((w, i) => (
        <span key={i} style={{ width: w, background: i % 3 === 2 ? bg : color }} />
      ))}
    </div>
  );
}
