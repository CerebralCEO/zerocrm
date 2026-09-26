"use client";

import { create } from "zustand";
import { SEQUENCES, type Sequence, type SequenceStatus, type Step } from "./sequences";

export type StatusFilter = SequenceStatus | "all";

type SequencesState = {
  sequences: Sequence[];
  selectedId: string;
  /** Phones show the detail as a pushed screen. */
  detailOpen: boolean;
  statusFilter: StatusFilter;
  ownerFilter: string | null;
  editor: { sequenceId: string; stepId: string | null } | null;
  newOpen: boolean;
  enrollOpen: boolean;

  select: (id: string) => void;
  closeDetail: () => void;
  setStatusFilter: (s: StatusFilter) => void;
  setOwnerFilter: (id: string | null) => void;
  setStatus: (id: string, status: SequenceStatus) => void;
  openEditor: (sequenceId: string, stepId: string | null) => void;
  closeEditor: () => void;
  saveStep: (sequenceId: string, step: Omit<Step, "id" | "stats"> & { id?: string }) => void;
  deleteStep: (sequenceId: string, stepId: string) => void;
  setNewOpen: (open: boolean) => void;
  addSequence: (s: Omit<Sequence, "id">) => void;
  setEnrollOpen: (open: boolean) => void;
  enroll: (sequenceId: string, contactIds: string[]) => void;
};

const patch = (list: Sequence[], id: string, fn: (s: Sequence) => Sequence) => list.map((s) => (s.id === id ? fn(s) : s));

export const useSequences = create<SequencesState>((set) => ({
  sequences: SEQUENCES,
  selectedId: SEQUENCES[0].id,
  detailOpen: false,
  statusFilter: "all",
  ownerFilter: null,
  editor: null,
  newOpen: false,
  enrollOpen: false,

  select: (selectedId) => set({ selectedId, detailOpen: true }),
  closeDetail: () => set({ detailOpen: false }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setOwnerFilter: (ownerFilter) => set({ ownerFilter }),
  setStatus: (id, status) => set((s) => ({ sequences: patch(s.sequences, id, (q) => ({ ...q, status })) })),
  openEditor: (sequenceId, stepId) => set({ editor: { sequenceId, stepId } }),
  closeEditor: () => set({ editor: null }),
  saveStep: (sequenceId, step) =>
    set((s) => ({
      sequences: patch(s.sequences, sequenceId, (q) =>
        step.id
          ? { ...q, steps: q.steps.map((x) => (x.id === step.id ? { ...x, ...step, id: x.id } : x)) }
          : { ...q, steps: [...q.steps, { ...step, id: `s-new-${Date.now().toString(36)}`, stats: { sent: 0, opened: 0, replied: 0 } }] },
      ),
    })),
  deleteStep: (sequenceId, stepId) =>
    set((s) => ({
      sequences: patch(s.sequences, sequenceId, (q) => ({
        ...q,
        steps: q.steps.filter((x) => x.id !== stepId).map((x, i) => (i === 0 ? { ...x, delayDays: 0 } : x)),
      })),
    })),
  setNewOpen: (newOpen) => set({ newOpen }),
  addSequence: (seq) =>
    set((s) => {
      const id = `seq-new-${s.sequences.length}`;
      return { sequences: [{ ...seq, id }, ...s.sequences], selectedId: id, detailOpen: true };
    }),
  setEnrollOpen: (enrollOpen) => set({ enrollOpen }),
  enroll: (sequenceId, contactIds) =>
    set((s) => ({
      sequences: patch(s.sequences, sequenceId, (q) => ({
        ...q,
        enrollments: [
          ...q.enrollments,
          ...contactIds
            .filter((id) => !q.enrollments.some((e) => e.contactId === id))
            .map((contactId) => ({ contactId, step: 0, state: "active" as const })),
        ],
      })),
    })),
}));
