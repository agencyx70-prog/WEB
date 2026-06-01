'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    setEnabled(true);

    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const t = e.target;
      setHover(
        t.tagName === 'A' || t.tagName === 'BUTTON' ||
        !!t.closest('a') || !!t.closest('button') ||
        t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
      );
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, x, y,
          width: 6, height: 6, marginLeft: -3, marginTop: -3,
          background: 'var(--red)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99999,
        }}
      />
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, x: ringX, y: ringY,
          width: 34, height: 34, marginLeft: -17, marginTop: -17,
          border: '1px solid var(--red)', borderRadius: '50%',
          pointerEvents: 'none', zIndex: 99998,
        }}
        animate={{ scale: hover ? 1.8 : 1, opacity: hover ? 0.6 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      />
    </>
  );
}
