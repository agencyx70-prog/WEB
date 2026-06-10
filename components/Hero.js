'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

const ease = [0.22, 1, 0.36, 1];

const lineVariant = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: '0%',
    transition: { duration: 0.9, ease, delay: 0.15 + i * 0.12 },
  }),
};

function MaskLine({ children, i, className, style }) {
  return (
    <span style={{ display: 'block', overflow: 'hidden' }}>
      <motion.span
        custom={i}
        variants={lineVariant}
        className={className}
        style={{ display: 'block', ...style }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const stats = [
  { num: '10+', label: 'Projects shipped' },
  { num: '100%', label: 'Client satisfaction' },
  { num: '24h', label: 'Reply window' },
  { num: 'IN', label: 'Telangana based' },
];

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '64px', overflow: 'hidden' }}>
      <motion.div className="container" style={{ y, opacity: fade, width: '100%' }}>
        {/* Top kicker row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}
        >
          <span className="kicker">New Agency · Est. 2024</span>
          <span className="kicker" style={{ color: 'var(--faint)' }}>Web Design Studio</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          className="display-xl"
          style={{ textTransform: 'uppercase', marginBottom: '48px' }}
        >
          <MaskLine i={0}>Start Small.</MaskLine>
          <MaskLine i={1} style={{ color: 'var(--red)' }}>Dream Big.</MaskLine>
        </motion.h1>

        {/* Sub row: paragraph + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px', marginBottom: '64px' }}
        >
          <p className="text-muted" style={{ fontSize: '17px', maxWidth: '440px', lineHeight: 1.7 }}>
            A creative studio for content, video, social, and web — we help brands and
            creators grow with work crafted with care and shipped with intent.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link href="/work" className="btn btn-fill"><span>View Work</span></Link>
            <Link href="/services" className="btn btn-ghost"><span>Our Services</span></Link>
          </div>
        </motion.div>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8, ease }}
          className="glass hero-stats"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', overflow: 'hidden' }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                padding: '26px 28px',
                borderRight: i < stats.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 600, color: 'var(--red)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '8px' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ position: 'absolute', right: '32px', bottom: '64px', zIndex: 2 }}
        className="scroll-cue"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ color: 'var(--faint)' }}>
          <ArrowDownRight size={28} strokeWidth={1.2} />
        </motion.div>
      </motion.div>

      <style jsx>{`
        @media (max-width: 700px) {
          :global(.hero-stats) { grid-template-columns: repeat(2, 1fr) !important; }
          :global(.hero-stats) > div:nth-child(2) { border-right: none !important; }
          :global(.hero-stats) > div:nth-child(1),
          :global(.hero-stats) > div:nth-child(2) { border-bottom: 1px solid var(--line); }
          .scroll-cue { display: none; }
        }
      `}</style>
    </section>
  );
}
