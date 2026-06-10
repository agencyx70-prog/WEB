'use client';
import { useRef, useState, Children } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Horizontal swipeable row: native touch-swipe + scroll-snap, mouse drag-to-scroll,
// desktop arrow buttons, and dot indicators.
export default function SwipeRow({ children, basis = '320px', gap = 20 }) {
  const ref = useRef(null);
  const st = useRef({ down: false, x: 0, left: 0, moved: false });
  const items = Children.toArray(children);
  const [active, setActive] = useState(0);

  const step = () => {
    const row = ref.current;
    const first = row?.children[0];
    return first ? first.getBoundingClientRect().width + gap : 1;
  };

  const onScroll = () => {
    const row = ref.current;
    if (row) setActive(Math.max(0, Math.min(items.length - 1, Math.round(row.scrollLeft / step()))));
  };

  const goTo = (i) => {
    const idx = Math.max(0, Math.min(items.length - 1, i));
    ref.current?.scrollTo({ left: idx * step(), behavior: 'smooth' });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    st.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    if (!st.current.down) return;
    const dx = e.clientX - st.current.x;
    if (Math.abs(dx) > 4) st.current.moved = true;
    ref.current.scrollLeft = st.current.left - dx;
  };
  const onPointerUp = () => { st.current.down = false; };
  const onClickCapture = (e) => {
    if (st.current.moved) { e.preventDefault(); e.stopPropagation(); st.current.moved = false; }
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div
          ref={ref}
          className="swipe-row"
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          onClickCapture={onClickCapture}
          style={{ display: 'flex', gap, overflowX: 'auto', paddingBottom: '10px' }}
        >
          {items.map((child, i) => (
            <div key={i} style={{ flex: `0 0 ${basis}`, maxWidth: '86vw', scrollSnapAlign: 'center' }}>
              {child}
            </div>
          ))}
        </div>

        <button className="swipe-arrow swipe-arrow--prev" aria-label="Previous" onClick={() => goTo(active - 1)} disabled={active <= 0}>
          <ArrowLeft size={18} />
        </button>
        <button className="swipe-arrow swipe-arrow--next" aria-label="Next" onClick={() => goTo(active + 1)} disabled={active >= items.length - 1}>
          <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to card ${i + 1}`}
            style={{
              height: '7px',
              width: i === active ? '22px' : '7px',
              borderRadius: '9999px',
              background: i === active ? 'var(--red)' : 'var(--line-strong)',
              transition: 'all 0.3s var(--ease)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
