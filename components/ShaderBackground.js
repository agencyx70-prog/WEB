'use client';
import ShaderAnimation from './ShaderAnimation';

// Shared section background: the red shader, softly masked to fade out toward
// every edge so the strokes dissolve into the page (no visible rectangle/seam).
const MASK =
  'radial-gradient(ellipse 82% 78% at 50% 50%, rgba(0,0,0,1) 24%, rgba(0,0,0,0.5) 58%, rgba(0,0,0,0) 100%)';

export default function ShaderBackground({ opacity = 0.55 }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <ShaderAnimation />
    </div>
  );
}
