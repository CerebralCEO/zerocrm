"use client";

import { useMemo } from "react";
import { useCrm } from "@/lib/store";
import { useDeals } from "@/lib/deals-store";
import { useContacts } from "@/lib/contacts-store";
import { useForecast } from "@/lib/forecast-store";
import { useInvoices } from "@/lib/invoices-store";
import { useSlips } from "@/lib/slips-store";
import { buildForecast, periodById } from "@/lib/forecast";
import { buildSlips } from "@/lib/slips";
import { statusOf } from "@/lib/invoices";

/** Live sidebar counts: companies, deals at risk this period, contacts, overdue invoices, slipped deals. */
export function useNavBadges(): Record<string, string | undefined> {
  const companies = useCrm((s) => s.companies.length);
  const contacts = useContacts((s) => s.contacts.length);
  const deals = useDeals((s) => s.deals);
  const period = useForecast((s) => s.period);
  const invoices = useInvoices((s) => s.invoices);
  const history = useSlips((s) => s.history);
  return useMemo(() => {
    const atRisk = buildForecast(deals, periodById(period), null).atRisk.length;
    const overdue = invoices.filter((i) => statusOf(i) === "overdue").length;
    const slipped = buildSlips(deals, history, null, "all").length;
    const n = (v: number) => (v > 0 ? String(v) : undefined);
    return {
      Companies: String(companies),
      Forecast: n(atRisk),
      Contacts: String(contacts),
      Invoices: n(overdue),
      "Slipping Deals": n(slipped),
    };
  }, [companies, contacts, deals, period, invoices, history]);
}
