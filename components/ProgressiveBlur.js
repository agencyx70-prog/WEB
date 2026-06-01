// Progressive (gradient) blur strip — content gently frosts toward one edge.
// A cheap gradient gives the fade everywhere; the stacked backdrop-filter layers
// (which are costly) are disabled on mobile via CSS for a lag-free experience.

const LAYERS = [
  { blur: 2, fade: 100 },
  { blur: 6, fade: 56 },
  { blur: 14, fade: 32 },
  { blur: 26, fade: 18 },
];

export default function ProgressiveBlur({ position = 'top', height = 130, zIndex = 999 }) {
  const dir = position === 'top' ? 'to bottom' : 'to top';
  const anchor = position === 'top' ? { top: 0 } : { bottom: 0 };
  const grad = `linear-gradient(${dir}, var(--bg) 0%, rgba(10,9,8,0.6) 35%, transparent 100%)`;

  return (
    <div
      aria-hidden
      className="prog-blur"
      style={{ position: 'fixed', left: 0, right: 0, height, zIndex, pointerEvents: 'none', ...anchor }}
    >
      {/* cheap gradient fade — always on, no compositing cost */}
      <div style={{ position: 'absolute', inset: 0, background: grad, opacity: 0.7 }} />

      {/* layered real blur — hidden on mobile via .prog-blur__layers media rule */}
      <div className="prog-blur__layers" style={{ position: 'absolute', inset: 0 }}>
        {LAYERS.map((l, i) => {
          const mask = `linear-gradient(${dir}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${l.fade * 0.4}%, rgba(0,0,0,0) ${l.fade}%)`;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                backdropFilter: `blur(${l.blur}px)`,
                WebkitBackdropFilter: `blur(${l.blur}px)`,
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
