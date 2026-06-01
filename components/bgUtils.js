// Shared helpers for the WebGL background components — keep them light & lag-free.

export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const smallScreen = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia &&
  window.matchMedia('(max-width: 768px)').matches;

export const cappedDpr = (cap = 2) =>
  Math.min(cap, Math.max(1, (typeof window !== 'undefined' && window.devicePixelRatio) || 1));

// Calls cb(true/false) as `el` enters/leaves the viewport. Returns a disconnect fn.
export function observeVisible(el, cb) {
  if (typeof IntersectionObserver === 'undefined' || !el) {
    cb(true);
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => cb(entries[0]?.isIntersecting ?? true),
    { threshold: 0.01 }
  );
  io.observe(el);
  return () => io.disconnect();
}
