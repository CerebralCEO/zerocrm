"use client";

import { create } from "zustand";
import { DEALS } from "./deals";
import { TODAY, useDeals } from "./deals-store";
import { itemsFor, seedInvoices, totalOf, type Invoice, type InvoiceStatus, type LineItem } from "./invoices";
import { emit } from "./events";
import { formatCompactCurrency } from "./utils";

type InvoicesState = {
  invoices: Invoice[];
  statusFilter: InvoiceStatus | "all";
  ownerFilter: string | null;
  /** Invoice open in the studio. */
  openId: string | null;
  pickerOpen: boolean;
  /** Template new invoices start from (the last one picked). */
  defaultTemplate: string;
  lastCreatedId: string | null;

  setStatusFilter: (s: InvoiceStatus | "all") => void;
  setOwnerFilter: (id: string | null) => void;
  openInvoice: (id: string | null) => void;
  setPickerOpen: (open: boolean) => void;
  /** Create a draft from a Closed Won deal (or open its existing invoice) and open it in the studio. */
  createFromDeal: (dealId: string) => string | null;
  update: (id: string, patch: Partial<Invoice>) => void;
  setTemplate: (id: string, templateId: string) => void;
  updateItem: (id: string, itemId: string, patch: Partial<LineItem>) => void;
  addItem: (id: string) => void;
  removeItem: (id: string, itemId: string) => void;
  send: (id: string) => void;
  markPaid: (id: string) => void;
};

export const useInvoices = create<InvoicesState>((set, get) => ({
  invoices: seedInvoices(DEALS),
  statusFilter: "all",
  ownerFilter: null,
  openId: null,
  pickerOpen: false,
  defaultTemplate: "graphite",
  lastCreatedId: null,

  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  openInvoice: (openId) => set({ openId }),
  setPickerOpen: (pickerOpen) => set({ pickerOpen }),

  createFromDeal: (dealId) => {
    const existing = get().invoices.find((i) => i.dealId === dealId);
    if (existing) {
      set({ openId: existing.id, pickerOpen: false });
      return existing.id;
    }
    const deal = useDeals.getState().deals.find((d) => d.id === dealId);
    if (!deal) return null;
    const next = Math.max(130, ...get().invoices.map((i) => Number(i.number.slice(-3)))) + 1;
    const invoice: Invoice = {
      id: `inv-${next}`,
      number: `INV-2026-${String(next).padStart(4, "0")}`,
      dealId,
      companyId: deal.companyId,
      ownerId: deal.ownerId,
      issueDate: TODAY,
      terms: 30,
      status: "draft",
      items: itemsFor(deal),
      discount: 0,
      taxRate: 0,
      taxLabel: "Sales tax",
      notes: "Thank you for choosing ZeroCRM. Please include the invoice number with your payment.",
      templateId: get().defaultTemplate,
    };
    set((s) => ({ invoices: [invoice, ...s.invoices], openId: invoice.id, pickerOpen: false, lastCreatedId: invoice.id }));
    emit({
      text: `drafted invoice ${invoice.number}`,
      body: `${deal.title} · ${formatCompactCurrency(totalOf(invoice))}`,
      companyId: deal.companyId,
      dealId,
      ownerId: deal.ownerId,
    });
    return invoice.id;
  },

  update: (id, patch) => set((s) => ({ invoices: s.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)) })),
  setTemplate: (id, templateId) =>
    set((s) => ({ defaultTemplate: templateId, invoices: s.invoices.map((i) => (i.id === id ? { ...i, templateId } : i)) })),
  updateItem: (id, itemId, patch) =>
    set((s) => ({
      invoices: s.invoices.map((i) => (i.id === id ? { ...i, items: i.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)) } : i)),
    })),
  addItem: (id) =>
    set((s) => ({
      invoices: s.invoices.map((i) =>
        i.id === id ? { ...i, items: [...i.items, { id: `${id}-${Date.now().toString(36)}`, description: "New item", qty: 1, unitPrice: 0 }] } : i,
      ),
    })),
  removeItem: (id, itemId) =>
    set((s) => ({
      invoices: s.invoices.map((i) => (i.id === id && i.items.length > 1 ? { ...i, items: i.items.filter((it) => it.id !== itemId) } : i)),
    })),
  send: (id) => {
    const inv = get().invoices.find((i) => i.id === id);
    if (!inv || inv.status !== "draft") return;
    set((s) => ({ invoices: s.invoices.map((i) => (i.id === id ? { ...i, status: "sent", sentDate: TODAY } : i)) }));
    emit({
      text: `sent invoice ${inv.number}`,
      body: `${formatCompactCurrency(totalOf(inv))} due in ${inv.terms} days`,
      companyId: inv.companyId,
      dealId: inv.dealId,
      ownerId: inv.ownerId,
    });
  },
  markPaid: (id) => {
    const inv = get().invoices.find((i) => i.id === id);
    if (!inv || inv.status === "paid") return;
    set((s) => ({ invoices: s.invoices.map((i) => (i.id === id ? { ...i, status: "paid", paidDate: TODAY } : i)) }));
    emit({
      text: `recorded payment for ${inv.number}`,
      body: `${formatCompactCurrency(totalOf(inv))} received`,
      companyId: inv.companyId,
      dealId: inv.dealId,
      ownerId: inv.ownerId,
      notify: true,
    });
  },
}));
