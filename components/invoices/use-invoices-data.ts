"use client";

import { useMemo } from "react";
import { useDeals } from "@/lib/deals-store";
import { useInvoices } from "@/lib/invoices-store";
import { statusOf } from "@/lib/invoices";

/** Invoices for the current status / owner filter, plus Closed Won deals still waiting for one. */
export function useInvoicesData() {
  const invoices = useInvoices((s) => s.invoices);
  const statusFilter = useInvoices((s) => s.statusFilter);
  const ownerFilter = useInvoices((s) => s.ownerFilter);
  const deals = useDeals((s) => s.deals);
  return useMemo(() => {
    const mine = invoices.filter((i) => !ownerFilter || i.ownerId === ownerFilter);
    const list = mine.filter((i) => statusFilter === "all" || statusOf(i) === statusFilter).sort((a, b) => b.number.localeCompare(a.number));
    const invoiced = new Set(invoices.map((i) => i.dealId));
    const ready = deals
      .filter((d) => d.stage === "won" && !invoiced.has(d.id) && (!ownerFilter || d.ownerId === ownerFilter))
      .sort((a, b) => b.closeDate.localeCompare(a.closeDate));
    return { all: mine, list, ready };
  }, [invoices, statusFilter, ownerFilter, deals]);
}
