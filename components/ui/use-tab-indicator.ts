"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Measures the active tab (the child with `data-active="true"`) so a single
 * underline can glide between tabs. Until the first measurement (SSR / first
 * paint) it returns `style: null`, and callers render the static per-tab
 * underline — both land on the same pixels, so there is no flash.
 */
export function useTabIndicator(activeKey: string, inset = 0) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [style, setStyle] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!container) return;
    const measure = () => {
      const active = container.querySelector<HTMLElement>('[data-active="true"]');
      if (active) setStyle({ left: active.offsetLeft - inset, width: active.offsetWidth + inset * 2 });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [container, activeKey, inset]);

  return { ref: setContainer, style };
}
