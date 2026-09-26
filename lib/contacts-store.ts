"use client";

import { create } from "zustand";
import { CONTACTS, type Contact, type Persona } from "./contacts";

export type ContactSort = "name" | "strength" | "recent" | "company";
export type ContactShow = "all" | "starred" | "cold";
export type ContactView = "grid" | "list";

type ContactsState = {
  contacts: Contact[];
  query: string;
  sortBy: ContactSort;
  persona: Persona | null;
  ownerFilter: string | null;
  show: ContactShow;
  view: ContactView;
  openId: string | null;
  newOpen: boolean;
  lastAddedId: string | null;

  setQuery: (q: string) => void;
  setSortBy: (s: ContactSort) => void;
  setPersona: (p: Persona | null) => void;
  setOwnerFilter: (id: string | null) => void;
  setShow: (s: ContactShow) => void;
  setView: (v: ContactView) => void;
  openContact: (id: string | null) => void;
  setNewOpen: (open: boolean) => void;
  toggleStar: (id: string) => void;
  addContact: (c: Omit<Contact, "id">) => void;
};

export const useContacts = create<ContactsState>((set) => ({
  contacts: CONTACTS,
  query: "",
  sortBy: "name",
  persona: null,
  ownerFilter: null,
  show: "all",
  view: "grid",
  openId: null,
  newOpen: false,
  lastAddedId: null,

  setQuery: (query) => set({ query }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPersona: (persona) => set({ persona }),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  setShow: (show) => set({ show }),
  setView: (view) => set({ view }),
  openContact: (openId) => set({ openId }),
  setNewOpen: (newOpen) => set({ newOpen }),
  toggleStar: (id) => set((s) => ({ contacts: s.contacts.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c)) })),
  addContact: (c) =>
    set((s) => {
      const id = `c-new-${s.contacts.length}`;
      return { contacts: [...s.contacts, { ...c, id }], lastAddedId: id };
    }),
}));
