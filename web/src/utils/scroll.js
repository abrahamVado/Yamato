// src/utils/scroll.js
export function smoothScrollToY(targetY, { duration = 220, easing = t => t } = {}) {
  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) return window.scrollTo({ top: targetY, behavior: "auto" });

  const startY = window.scrollY || window.pageYOffset;
  const delta = targetY - startY;
  let start;

  function step(ts) {
    if (start === undefined) start = ts;
    const t = Math.min(1, (ts - start) / duration);
    const eased = easing(t);
    window.scrollTo(0, startY + delta * eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function scrollToEl(el, opts) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const headerOffset = 64; // adjust if you have a sticky header height
  const targetY = window.scrollY + rect.top - headerOffset;
  smoothScrollToY(targetY, opts);
}

// nice default easing
export const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
