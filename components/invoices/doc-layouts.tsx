import { FONT } from "@/lib/invoice-templates";
import { Barcode, BillTo, Brand, Items, Label, Meta, PayBlock, Seller, Stamp, Totals, body, head, longDate, money, type LayoutProps } from "./doc-parts";

const PAGE = "relative flex h-full w-full flex-col";

/** 1 · Classic — brand left, big title right, hairline table, accent total. */
export function Classic({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={{ padding: "60px 60px 52px", ...body(t) }}>
      <div className="flex items-start justify-between">
        <Brand t={t} p={p} />
        <div className="flex flex-col items-end gap-[10px]">
          <span className="text-[40px] leading-none font-semibold tracking-[-1.4px]" style={{ color: p.ink, ...head(t) }}>
            Invoice
          </span>
          <span className="text-[12px] leading-none tabular-nums" style={{ color: p.muted }}>
            {d.number}
          </span>
        </div>
      </div>
      <div className="mt-[56px] flex items-start justify-between gap-10">
        <BillTo d={d} p={p} t={t} />
        <Meta d={d} p={p} cols={2} gap={36} />
      </div>
      <div className="mt-[52px]">
        <Items d={d} p={p} t={t} variant="lines" />
      </div>
      <div className="mt-[22px] flex items-start justify-between">
        <Stamp d={d} t={t} p={p} style={{ marginTop: 18 }} />
        <Totals d={d} p={p} t={t} />
      </div>
      <div className="mt-auto pt-6" style={{ borderTop: `1px solid ${p.line}` }}>
        <PayBlock d={d} p={p} />
      </div>
    </div>
  );
}

/** 2 · Banner — solid accent header band with the amount due inside it. */
export function Banner({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={body(t)}>
      <div className="flex flex-col gap-[40px] px-[60px] pt-[52px] pb-[40px]" style={{ background: p.accent }}>
        <div className="flex items-center justify-between">
          <Brand t={t} p={p} inverse />
          <span className="text-[12px] leading-none font-medium tabular-nums" style={{ color: p.onAccentSoft }}>
            {d.number}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-[56px] leading-none font-semibold tracking-[-2px]" style={{ color: p.onAccent, ...head(t) }}>
            Invoice
          </span>
          <div className="flex flex-col items-end gap-[9px]">
            <span className="text-[10px] leading-none font-semibold tracking-[1.4px] uppercase" style={{ color: p.onAccentSoft }}>
              Amount due
            </span>
            <span className="text-[34px] leading-none font-semibold tracking-[-1px] tabular-nums" style={{ color: p.onAccent, ...head(t) }}>
              {money(d.total)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-[60px] pt-[40px] pb-[52px]">
        <div className="flex items-start justify-between gap-10">
          <BillTo d={d} p={p} t={t} />
          <Seller p={p} align="right" />
        </div>
        <div className="mt-[36px] py-[18px]" style={{ borderTop: `1px solid ${p.line}`, borderBottom: `1px solid ${p.line}` }}>
          <Meta d={d} p={p} />
        </div>
        <div className="mt-[36px]">
          <Items d={d} p={p} t={t} variant="zebra" />
        </div>
        <div className="mt-[22px] flex items-start justify-between">
          <Stamp d={d} t={t} p={p} style={{ marginTop: 14 }} />
          <Totals d={d} p={p} t={t} strong="ink" />
        </div>
        <div className="mt-auto pt-6">
          <PayBlock d={d} p={p} />
        </div>
      </div>
    </div>
  );
}

/** 3 · Sidebar — a solid panel column carries the brand, meta and payment. */
export function Sidebar({ d, t, p }: LayoutProps) {
  return (
    <div className={`${PAGE} flex-row`} style={body(t)}>
      <aside className="flex w-[250px] shrink-0 flex-col gap-[40px] px-[34px] py-[52px]" style={{ background: p.panel, borderRight: `1px solid ${p.line}` }}>
        <Brand t={t} p={p} />
        <div className="flex flex-col gap-[20px]">
          <Meta d={d} p={p} cols={1} />
        </div>
        <div className="mt-auto flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <Label p={p}>From</Label>
            <Seller p={p} />
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col px-[46px] py-[52px]">
        <div className="flex items-start justify-between">
          <span className="text-[44px] leading-none font-semibold tracking-[-1.6px]" style={{ color: p.ink, ...head(t) }}>
            Invoice
          </span>
          <Stamp d={d} t={t} p={p} />
        </div>
        <div className="mt-[34px] flex items-end justify-between gap-6">
          <BillTo d={d} p={p} t={t} />
          <div className="flex flex-col items-end gap-[9px]">
            <Label p={p}>Amount due</Label>
            <span className="text-[30px] leading-none font-semibold tracking-[-1px] tabular-nums" style={{ color: p.accentText, ...head(t) }}>
              {money(d.total)}
            </span>
          </div>
        </div>
        <div className="mt-[44px]">
          <Items d={d} p={p} t={t} variant="lines" />
        </div>
        <div className="mt-[20px]">
          <Totals d={d} p={p} t={t} width={260} strong="ink" />
        </div>
        <div className="mt-auto pt-6" style={{ borderTop: `1px solid ${p.line}` }}>
          <PayBlock d={d} p={p} cols={1} />
        </div>
      </div>
    </div>
  );
}

/** 4 · Hero — the amount due is the headline. */
export function Hero({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={{ padding: "56px 60px 52px", ...body(t) }}>
      <div className="flex items-center justify-between">
        <Brand t={t} p={p} />
        <span className="text-[12px] leading-none tabular-nums" style={{ color: p.muted }}>
          Invoice {d.number}
        </span>
      </div>
      <div className="mt-[64px] flex flex-col gap-[16px]">
        <Label p={p}>Amount due</Label>
        <div className="flex items-end justify-between gap-6">
          <span className="text-[78px] leading-[0.9] font-semibold tracking-[-3px] tabular-nums" style={{ color: p.ink, ...head(t) }}>
            {money(d.total)}
          </span>
          <Stamp d={d} t={t} p={p} style={{ marginBottom: 10 }} />
        </div>
        <span className="text-[13px] leading-none" style={{ color: p.soft }}>
          Due <span style={{ color: p.accentText }} className="font-semibold">{longDate(d.due)}</span> · {d.terms}
        </span>
      </div>
      <div className="mt-[34px] h-[6px] w-full" style={{ background: p.accent }} />
      <div className="mt-[34px] grid grid-cols-[1.2fr_1fr] gap-10">
        <BillTo d={d} p={p} t={t} />
        <Meta d={d} p={p} cols={2} gap={30} />
      </div>
      <div className="mt-[40px]">
        <Items d={d} p={p} t={t} variant="lines" />
      </div>
      <div className="mt-[18px]">
        <Totals d={d} p={p} t={t} strong="none" />
      </div>
      <div className="mt-auto pt-6" style={{ borderTop: `1px solid ${p.line}` }}>
        <PayBlock d={d} p={p} />
      </div>
    </div>
  );
}

/** 5 · Split — a solid accent half holds the invoice identity. */
export function Split({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={body(t)}>
      <div className="grid grid-cols-2">
        <div className="flex h-[330px] flex-col justify-between px-[56px] py-[52px]" style={{ background: p.accent }}>
          <Brand t={t} p={p} inverse />
          <div className="flex flex-col gap-[14px]">
            <span className="text-[52px] leading-none font-semibold tracking-[-2px]" style={{ color: p.onAccent, ...head(t) }}>
              Invoice
            </span>
            <span className="text-[13px] leading-none tabular-nums" style={{ color: p.onAccentSoft }}>
              {d.number} · {longDate(d.issue)}
            </span>
          </div>
        </div>
        <div className="flex h-[330px] flex-col justify-between px-[48px] py-[52px]" style={{ background: p.panel }}>
          <BillTo d={d} p={p} t={t} />
          <div className="flex flex-col gap-[9px]">
            <Label p={p}>Amount due · {longDate(d.due)}</Label>
            <span className="text-[32px] leading-none font-semibold tracking-[-1px] tabular-nums" style={{ color: p.ink, ...head(t) }}>
              {money(d.total)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-[56px] pt-[40px] pb-[52px]">
        <div className="flex items-start justify-between">
          <Meta d={d} p={p} />
          <Stamp d={d} t={t} p={p} />
        </div>
        <div className="mt-[36px]">
          <Items d={d} p={p} t={t} variant="boxed" />
        </div>
        <div className="mt-[20px]">
          <Totals d={d} p={p} t={t} strong="fill" />
        </div>
        <div className="mt-auto pt-6">
          <PayBlock d={d} p={p} />
        </div>
      </div>
    </div>
  );
}

/** One receipt line with a dotted leader between label and value. */
function LedgerRow({ p, k, v, strong }: { p: LayoutProps["p"]; k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 text-[12px] leading-[18px]" style={{ color: strong ? p.ink : p.soft, fontFamily: FONT.mono }}>
      <span className={strong ? "font-semibold" : ""}>{k}</span>
      <span className="flex-1 translate-y-[-3px] border-b border-dotted" style={{ borderColor: p.line }} />
      <span className={`tabular-nums ${strong ? "font-semibold" : ""}`} style={{ color: p.ink }}>
        {v}
      </span>
    </div>
  );
}

/** 6 · Ledger — a monospaced receipt column with dotted leaders and a barcode. */
export function Ledger({ d, t, p }: LayoutProps) {
  const rule = { borderTop: `1px dashed ${p.line}` };
  return (
    <div className={`${PAGE} items-center`} style={{ padding: "60px 0 52px", fontFamily: FONT.mono }}>
      <div className="flex w-[500px] flex-1 flex-col">
        <div className="flex flex-col items-center gap-[14px]">
          <Brand t={t} p={p} />
          <span className="text-[11px] tracking-[3px] uppercase" style={{ color: p.muted }}>
            *** Tax invoice ***
          </span>
        </div>
        <div className="mt-[30px] flex flex-col gap-[6px] pt-[18px]" style={rule}>
          <LedgerRow p={p} k="INVOICE" v={d.number} />
          <LedgerRow p={p} k="ISSUED" v={longDate(d.issue)} />
          <LedgerRow p={p} k="DUE" v={longDate(d.due)} />
          <LedgerRow p={p} k="TERMS" v={d.terms.toUpperCase()} />
        </div>
        <div className="mt-[20px] flex flex-col gap-[5px] pt-[18px] text-[12px] leading-[18px]" style={{ ...rule, color: p.soft }}>
          <span style={{ color: p.muted }}>BILL TO</span>
          <span className="font-semibold" style={{ color: p.ink }}>
            {d.company.toUpperCase()}
          </span>
          {d.contact && <span>{d.contact.name}</span>}
          <span>{d.place}</span>
        </div>
        <div className="mt-[20px] flex flex-col gap-[14px] pt-[18px]" style={rule}>
          {d.items.map((it) => (
            <div key={it.id} className="flex flex-col gap-[3px]">
              <LedgerRow p={p} k={it.description} v={money(it.qty * it.unitPrice)} strong />
              <span className="text-[11px]" style={{ color: p.muted }}>
                {it.qty} × {money(it.unitPrice)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-[20px] flex flex-col gap-[6px] pt-[18px]" style={rule}>
          <LedgerRow p={p} k="SUBTOTAL" v={money(d.subtotal)} />
          {d.discount > 0 && <LedgerRow p={p} k="DISCOUNT" v={`-${money(d.discount)}`} />}
          <LedgerRow p={p} k={`${d.taxLabel.toUpperCase()} ${d.taxRate}%`} v={money(d.tax)} />
        </div>
        <div className="mt-[16px] flex items-center justify-between px-[14px] py-[14px]" style={{ background: p.accent, color: p.onAccent }}>
          <span className="text-[13px] font-semibold tracking-[2px]">TOTAL DUE</span>
          <span className="text-[22px] font-semibold tabular-nums">{money(d.total)}</span>
        </div>
        <div className="mt-[18px] flex justify-center">
          <Stamp d={d} t={t} p={p} />
        </div>
        <div className="mt-auto flex flex-col items-center gap-[12px]">
          <span className="text-[11px] leading-[16px]" style={{ color: p.soft }}>
            PAY ONLINE · pay.zerocrm.example
          </span>
          <Barcode seed={d.number} color={p.ink} bg={p.bg} />
          <span className="text-[11px] tracking-[3px]" style={{ color: p.muted }}>
            THANK YOU
          </span>
        </div>
      </div>
    </div>
  );
}

/** 7 · Editorial — a serif masthead, double rules and generous margins. */
export function Editorial({ d, t, p }: LayoutProps) {
  const serif = { fontFamily: FONT.serif };
  return (
    <div className={PAGE} style={{ padding: "64px 68px 56px", ...body(t) }}>
      <div className="flex items-end justify-between pb-[18px]" style={{ borderBottom: `3px double ${p.ink}` }}>
        <span className="text-[96px] leading-[0.8] tracking-[-2px] italic" style={{ color: p.ink, ...serif }}>
          Invoice
        </span>
        <div className="flex flex-col items-end gap-[8px] pb-[6px]">
          <Brand t={t} p={p} size={26} />
          <span className="text-[12px] leading-none tabular-nums" style={{ color: p.muted }}>
            No. {d.number.split("-").pop()}
          </span>
        </div>
      </div>
      <div className="mt-[36px] grid grid-cols-3 gap-8">
        <BillTo d={d} p={p} t={t} label="Prepared for" />
        <div className="flex flex-col gap-[9px]">
          <Label p={p}>From</Label>
          <Seller p={p} />
        </div>
        <div className="flex flex-col gap-[14px]">
          {(
            [
              ["Issued", longDate(d.issue)],
              ["Due", longDate(d.due)],
              ["Terms", d.terms],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 pb-[8px]" style={{ borderBottom: `1px solid ${p.line}` }}>
              <Label p={p}>{k}</Label>
              <span className="text-[15px] leading-none" style={{ color: p.ink, ...serif }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[48px]">
        <Items d={d} p={p} t={t} variant="ruled" />
      </div>
      <div className="mt-[26px] flex items-end justify-between">
        <Stamp d={d} t={t} p={p} />
        <div className="ml-auto flex flex-col items-end gap-[6px]">
          <span className="text-[12px] leading-none" style={{ color: p.soft }}>
            Subtotal {money(d.subtotal)}
            {d.discount ? ` · Discount −${money(d.discount)}` : ""} · {d.taxLabel} {money(d.tax)}
          </span>
          <span className="mt-[10px] text-[15px] leading-none italic" style={{ color: p.muted, ...serif }}>
            Amount due
          </span>
          <span className="text-[56px] leading-none tracking-[-1.5px] tabular-nums" style={{ color: p.accentText, ...serif }}>
            {money(d.total)}
          </span>
        </div>
      </div>
      <div className="mt-auto pt-6" style={{ borderTop: `3px double ${p.ink}` }}>
        <PayBlock d={d} p={p} />
      </div>
    </div>
  );
}

/** 8 · Card — the whole invoice sits on one solid panel on a tinted page. */
export function Card({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={{ padding: 40, ...body(t) }}>
      <div className="flex flex-1 flex-col rounded-[22px] px-[46px] py-[44px]" style={{ background: p.panel, border: `1px solid ${p.line}` }}>
        <div className="flex items-center justify-between">
          <Brand t={t} p={p} />
          <span className="rounded-full px-[14px] py-[8px] text-[11px] leading-none font-semibold tracking-[1px] uppercase" style={{ background: p.accent, color: p.onAccent }}>
            Invoice {d.number.split("-").pop()}
          </span>
        </div>
        <div className="mt-[44px] grid grid-cols-2 gap-8">
          <BillTo d={d} p={p} t={t} />
          <div className="flex flex-col items-end gap-[10px]">
            <Label p={p}>Amount due</Label>
            <span className="text-[38px] leading-none font-semibold tracking-[-1.2px] tabular-nums" style={{ color: p.ink, ...head(t) }}>
              {money(d.total)}
            </span>
            <span className="text-[12px] leading-none" style={{ color: p.soft }}>
              by {longDate(d.due)}
            </span>
          </div>
        </div>
        <div className="mt-[30px] rounded-[14px] px-[20px] py-[16px]" style={{ background: p.bg }}>
          <Meta d={d} p={p} />
        </div>
        <div className="mt-[30px]">
          <Items d={d} p={p} t={t} variant="lines" />
        </div>
        <div className="mt-[18px] flex items-start justify-between">
          <Stamp d={d} t={t} p={p} style={{ marginTop: 16 }} />
          <Totals d={d} p={p} t={t} strong="fill" />
        </div>
        <div className="mt-auto pt-6">
          <PayBlock d={d} p={p} />
        </div>
      </div>
    </div>
  );
}

/** 9 · Swiss — strict grid, heavy rules, an oversized invoice number. */
export function Swiss({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={{ padding: "52px 56px 48px", ...body(t) }}>
      <div className="grid grid-cols-[1fr_auto] items-start gap-6">
        <div className="flex flex-col gap-[20px]">
          <Brand t={t} p={p} />
          <span className="text-[13px] leading-none font-bold tracking-[4px] uppercase" style={{ color: p.ink }}>
            Invoice
          </span>
        </div>
        <span className="text-[124px] leading-[0.78] font-bold tracking-[-6px] tabular-nums" style={{ color: p.accentText, ...head(t) }}>
          {d.number.slice(-3)}
        </span>
      </div>
      <div className="mt-[30px] h-[5px]" style={{ background: p.ink }} />
      <div className="grid grid-cols-4">
        {(
          [
            ["Billed to", d.company],
            ["Issued", longDate(d.issue)],
            ["Due", longDate(d.due)],
            ["Terms", d.terms],
          ] as const
        ).map(([k, v], i) => (
          <div key={k} className="flex flex-col gap-[10px] py-[16px] pr-3" style={{ borderLeft: i ? `1px solid ${p.line}` : undefined, paddingLeft: i ? 14 : 0 }}>
            <Label p={p}>{k}</Label>
            <span className="text-[14px] leading-[18px] font-semibold" style={{ color: p.ink }}>
              {v}
            </span>
          </div>
        ))}
      </div>
      <div className="h-px" style={{ background: p.ink }} />
      <div className="mt-[14px] text-[11px] leading-[15px]" style={{ color: p.soft }}>
        {d.contact ? `${d.contact.name}, ${d.contact.role} · ${d.contact.email} · ` : ""}
        {d.place}
      </div>
      <div className="mt-[40px]">
        <Items d={d} p={p} t={t} variant="bold" />
      </div>
      <div className="mt-[26px] grid grid-cols-[1fr_300px] items-end gap-8">
        <div className="flex items-end gap-4">
          <div className="size-[56px]" style={{ background: p.accent }} />
          <Stamp d={d} t={t} p={p} />
        </div>
        <Totals d={d} p={p} t={t} width={300} strong="ink" />
      </div>
      <div className="mt-auto pt-5" style={{ borderTop: `5px solid ${p.ink}` }}>
        <PayBlock d={d} p={p} />
      </div>
    </div>
  );
}

/** 10 · Band — a quiet page that ends in a solid accent band with the total. */
export function Band({ d, t, p }: LayoutProps) {
  return (
    <div className={PAGE} style={body(t)}>
      <div className="flex flex-1 flex-col px-[60px] pt-[56px]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[26px]">
            <Brand t={t} p={p} />
            <span className="text-[48px] leading-none font-semibold tracking-[-1.6px]" style={{ color: p.ink, ...head(t) }}>
              Invoice
            </span>
          </div>
          <Seller p={p} align="right" />
        </div>
        <div className="mt-[44px] flex items-start justify-between gap-10">
          <BillTo d={d} p={p} t={t} />
          <Meta d={d} p={p} cols={2} gap={34} />
        </div>
        <div className="mt-[44px]">
          <Items d={d} p={p} t={t} variant="lines" />
        </div>
        <div className="mt-[18px] flex items-start justify-between">
          <Stamp d={d} t={t} p={p} style={{ marginTop: 14 }} />
          <Totals d={d} p={p} t={t} strong="none" />
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-[28px] px-[60px] pt-[34px] pb-[40px]" style={{ background: p.accent }}>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-[10px]">
            <span className="text-[10px] leading-none font-semibold tracking-[1.4px] uppercase" style={{ color: p.onAccentSoft }}>
              Total due · {longDate(d.due)}
            </span>
            <span className="text-[44px] leading-none font-semibold tracking-[-1.4px] tabular-nums" style={{ color: p.onAccent, ...head(t) }}>
              {money(d.total)}
            </span>
          </div>
          <span className="text-[12px] leading-none tabular-nums" style={{ color: p.onAccentSoft }}>
            {d.number}
          </span>
        </div>
        <PayBlock d={d} p={p} inverse />
      </div>
    </div>
  );
}
