"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useForecast } from "@/lib/forecast-store";
import { TODAY } from "@/lib/deals-store";
import { formatNumber } from "@/lib/utils";
import { Modal, Button, SectionLabel } from "@/components/ui/overlay";
import { Input, Label, Textarea } from "@/components/ui/form";
import { useForecastData } from "./use-forecast-data";

function MoneyInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-[#5f5f5f]">$</span>
      <Input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d]/g, ""))}
        className="pl-[23px] font-medium tabular-nums"
      />
    </div>
  );
}

function SubmitForm({ onDone }: { onDone: () => void }) {
  const f = useForecastData();
  const period = useForecast((s) => s.period);
  const existing = useForecast((s) => s.call[s.period]);
  const submitCall = useForecast((s) => s.submitCall);
  const systemCommit = f.totals.closed + f.totals.commit;
  const systemBest = systemCommit + f.totals.best;
  const [commit, setCommit] = useState(String(existing?.commit ?? systemCommit));
  const [best, setBest] = useState(String(existing?.bestCase ?? systemBest));
  const [note, setNote] = useState(existing?.note ?? "");

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        submitCall(period, {
          commit: Number(commit) || 0,
          bestCase: Math.max(Number(best) || 0, Number(commit) || 0),
          note: note.trim(),
          submittedAt: TODAY,
        });
        onDone();
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-[19px] pb-[19px] sm:px-6">
        <SectionLabel className="font-normal text-fg-soft">System forecast</SectionLabel>
        <div className="mt-[16px] grid grid-cols-3 gap-2">
          {(
            [
              ["Commit", systemCommit],
              ["Best case", systemBest],
              ["Weighted", f.weighted],
            ] as const
          ).map(([label, v]) => (
            <div key={label} className="flex h-[62px] min-w-0 flex-col justify-between rounded-lg border border-line-card px-3 pt-[12px] pb-[11px]">
              <span className="text-[12px] leading-none text-fg-soft/80">{label}</span>
              <span className="truncate text-[14px] font-medium leading-none text-fg tabular-nums">${formatNumber(v)}</span>
            </div>
          ))}
        </div>

        <SectionLabel className="mt-[24px] font-normal text-fg-soft">Your call · {f.period.label}</SectionLabel>
        <div className="mt-[16px] grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="fc-commit">Commit</Label>
            <MoneyInput id="fc-commit" value={commit} onChange={setCommit} />
          </div>
          <div>
            <Label htmlFor="fc-best">Best case</Label>
            <MoneyInput id="fc-best" value={best} onChange={setBest} />
          </div>
        </div>
        <div className="mt-[15px]">
          <Label htmlFor="fc-note">Note for leadership</Label>
          <Textarea
            id="fc-note"
            placeholder="What would move the number up or down?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className="h-px shrink-0 bg-line-strong" />
      <div className="flex min-h-[64px] shrink-0 items-center justify-end gap-2 px-4 pb-[env(safe-area-inset-bottom)] sm:px-6">
        <Button onClick={onDone}>Cancel</Button>
        <Button type="submit" variant="primary" className="pr-[9px] pl-[8px]">
          <Send className="size-[12px]" strokeWidth={2} />
          {existing ? "Update Forecast" : "Submit Forecast"}
        </Button>
      </div>
    </form>
  );
}

export function SubmitForecastDialog() {
  const open = useForecast((s) => s.submitOpen);
  const setOpen = useForecast((s) => s.setSubmitOpen);
  const period = useForecast((s) => s.period);
  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Submit Forecast"
      description="Lock in your commit and best-case call for the period."
    >
      {open && <SubmitForm key={period} onDone={() => setOpen(false)} />}
    </Modal>
  );
}
