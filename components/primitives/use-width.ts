"use client";

import { useLayoutEffect, useState } from "react";

/** Width of an element, kept in sync with a ResizeObserver (for hand-built SVG charts). */
export function useWidth() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return { ref: setEl, width };
}
