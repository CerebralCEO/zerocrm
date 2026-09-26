"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A number that glides to its new value (ease-out cubic) instead of jumping —
 * hero readouts count up on mount and roll when the data changes.
 */
export function useTween(value: number, { ms = 700, from = value }: { ms?: number; from?: number } = {}) {
  const [shown, setShown] = useState(from);
  const current = useRef(from);

  useEffect(() => {
    const start = current.current;
    if (start === value) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - t0) / ms);
      const v = start + (value - start) * (1 - Math.pow(1 - p, 3));
      current.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);

  return shown;
}
