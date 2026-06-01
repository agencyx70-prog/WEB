'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

/**
 * CardStack — a fanned, draggable, auto-advancing card carousel.
 * Ported from a shadcn/Tailwind TSX component to this project's stack
 * (plain JS + framer-motion + themed inline styles / CSS variables).
 *
 * item shape: { id, title, description?, imageSrc?, href?, ctaLabel?, tag? }
 */

function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (loop). */
function signedOffset(i, active, len, loop) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export default function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 5,

  cardWidth = 460,
  cardHeight = 300,

  overlap = 0.46,
  spreadDeg = 40,

  perspectivePx = 1100,
  depthPx = 130,
  tiltXDeg = 10,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.93,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  onActiveClick,
  renderCard,
}) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  // Responsive sizing — shrink the cards to fit narrow viewports.
  const stageRef = React.useRef(null);
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const measure = () => {
      const w = stageRef.current?.clientWidth ?? cardWidth;
      setScale(Math.min(1, (w - 24) / cardWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [cardWidth]);

  const W = Math.round(cardWidth * scale);
  const H = Math.round(cardHeight * scale);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(W * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;
  const activeItem = items[active];

  return (
    <div
      className={className}
      style={{ width: '100%' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        ref={stageRef}
        style={{ position: 'relative', width: '100%', height: Math.max(360, H + 80), outline: 'none' }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* spotlight washes */}
        <div aria-hidden style={{ pointerEvents: 'none', position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)', height: 200, width: '70%', borderRadius: '9999px', background: 'var(--red-glow)', filter: 'blur(80px)', opacity: 0.18 }} />
        <div aria-hidden style={{ pointerEvents: 'none', position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', height: 160, width: '76%', borderRadius: '9999px', background: 'rgba(0,0,0,0.45)', filter: 'blur(60px)' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', perspective: `${perspectivePx}px` }}>
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              if (abs > maxOffset) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;

              const isActive = off === 0;
              const sc = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: 'x',
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (_e, info) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, W * 0.22);
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  onClick={() => (isActive ? onActiveClick?.(i, item) : setActive(i))}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: W,
                    height: H,
                    zIndex,
                    borderRadius: 18,
                    border: '1px solid var(--glass-border)',
                    overflow: 'hidden',
                    boxShadow: isActive ? '0 30px 70px rgba(0,0,0,0.55)' : '0 16px 40px rgba(0,0,0,0.4)',
                    transformStyle: 'preserve-3d',
                    cursor: 'none',
                    userSelect: 'none',
                    willChange: 'transform',
                  }}
                  initial={reduceMotion ? false : { opacity: 0, x, y: y + 40, rotateZ, rotateX, scale: sc }}
                  animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale: sc }}
                  transition={{ type: 'spring', stiffness: springStiffness, damping: springDamping }}
                  {...dragProps}
                >
                  <div style={{ height: '100%', width: '100%', transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}>
                    {renderCard ? renderCard(item, { active: isActive }) : <DefaultFanCard item={item} active={isActive} />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      {showDots ? (
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to ${it.title}`}
                  style={{
                    height: 7,
                    width: on ? 22 : 7,
                    borderRadius: 9999,
                    background: on ? 'var(--red)' : 'var(--line-strong)',
                    transition: 'all 0.4s var(--ease)',
                    cursor: 'none',
                  }}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              aria-label="Open project"
              style={{ color: 'var(--muted)', display: 'inline-flex' }}
            >
              <SquareArrowOutUpRight style={{ width: 16, height: 16 }} />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item }) {
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', background: 'var(--bg-elev)' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {item.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageSrc} alt={item.title} draggable={false} loading="eager" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', color: 'var(--faint)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
            No image
          </div>
        )}
      </div>
      <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 55%)' }} />
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#fff' }}>{item.title}</div>
        {item.description ? <div style={{ marginTop: 4, fontSize: 13.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{item.description}</div> : null}
      </div>
    </div>
  );
}
