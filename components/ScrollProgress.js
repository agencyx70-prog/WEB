'use client';
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: '2px',
        background: 'var(--red)',
        transformOrigin: '0%',
        scaleX: scrollYProgress,
        zIndex: 100000,
        boxShadow: '0 0 12px var(--red-glow)',
      }}
    />
  );
}
