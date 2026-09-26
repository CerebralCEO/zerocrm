"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "down" | "left";

/**
 * iOS-style swipe-to-dismiss. The finger drags the panel 1:1 in the dismiss
 * direction (with rubber-band resistance the other way); releasing past 30% of
 * the panel or with a quick flick throws it off-screen, otherwise it springs
 * back. Only active while `media` matches, so desktop layouts are untouched.
 *
 * Returns callback refs: `panel` (the element that moves) and `handle`
 * (where the gesture may start — defaults to the panel).
 */
export function useSwipeDismiss({
  direction,
  media,
  onDismiss,
}: {
  direction: Direction;
  media: string;
  onDismiss: () => void;
}) {
  const [panelEl, setPanelEl] = useState<HTMLElement | null>(null);
  const [handle, setHandle] = useState<HTMLElement | null>(null);
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    const target = handle ?? panelEl; // gesture area defaults to the panel itself
    if (!target || !panelEl) return;
    const panel = panelEl;
    const vertical = direction === "down";
    let start = 0;
    let cross = 0;
    let pointerId: number | null = null;
    let state: "idle" | "pending" | "dragging" = "idle";
    let samples: { t: number; d: number }[] = [];

    const setTransform = (el: HTMLElement, d: number) => {
      el.style.transform = vertical ? `translate3d(0, ${d}px, 0)` : `translate3d(${-d}px, 0, 0)`;
    };

    const onDown = (e: PointerEvent) => {
      if (!window.matchMedia(media).matches) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("button, a, input, textarea, select, [role=slider]")) return;
      pointerId = e.pointerId;
      start = vertical ? e.clientY : e.clientX;
      cross = vertical ? e.clientX : e.clientY;
      state = "pending";
      samples = [{ t: e.timeStamp, d: 0 }];
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const along = vertical ? e.clientY - start : start - e.clientX; // + = toward dismiss
      const off = Math.abs((vertical ? e.clientX : e.clientY) - cross);
      if (state === "pending") {
        if (Math.abs(along) < 6 && off < 6) return;
        // A mostly-perpendicular gesture belongs to native scrolling.
        if (off > Math.abs(along)) {
          state = "idle";
          pointerId = null;
          return;
        }
        state = "dragging";
        target.setPointerCapture(e.pointerId);
        panel.style.transition = "none";
        panel.style.willChange = "transform";
      }
      const d = along >= 0 ? along : along * 0.2; // rubber band past the resting edge
      setTransform(panel, d);
      samples.push({ t: e.timeStamp, d });
      if (samples.length > 6) samples.shift();
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (state !== "dragging") {
        state = "idle";
        return;
      }
      state = "idle";
      const last = samples[samples.length - 1];
      const first = samples[0];
      const velocity = (last.d - first.d) / Math.max(1, last.t - first.t); // px/ms
      const size = vertical ? panel.offsetHeight : panel.offsetWidth;

      if (last.d > size * 0.3 || (velocity > 0.5 && last.d > 10)) {
        // Throw it off-screen, keeping the flick's momentum.
        const remaining = size - last.d;
        const duration = Math.max(140, Math.min(320, remaining / Math.max(velocity, 1.2)));
        panel.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.4, 1)`;
        setTransform(panel, size + 8);
        panel.addEventListener(
          "transitionend",
          () => {
            // Skip Radix's exit animation — the panel is already gone.
            panel.dataset.swiped = "";
            dismissRef.current();
          },
          { once: true },
        );
      } else {
        panel.style.transition = "transform 480ms var(--ease-ios)";
        setTransform(panel, 0);
        panel.addEventListener(
          "transitionend",
          () => {
            panel.style.transition = "";
            panel.style.transform = "";
            panel.style.willChange = "";
          },
          { once: true },
        );
      }
    };

    target.addEventListener("pointerdown", onDown);
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
    return () => {
      target.removeEventListener("pointerdown", onDown);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
    };
  }, [handle, panelEl, direction, media]);

  return { panel: setPanelEl, handle: setHandle };
}
