'use client';
import { motion } from 'framer-motion';
import { SquareArrowOutUpRight } from 'lucide-react';
import CardStack from './CardStack';

const ease = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: 'rk',
    title: 'RK Photoshoppy',
    description: 'Premium photo-printing platform — upload, bulk pricing, framing & order management.',
    tag: 'E-Commerce · Photography',
    href: 'https://rkphotoshoppy.com/',
    accent: '#38d6ee',
    accent2: '#e879f9',
    wordmark: 'RKPhotoShoppy',
    tagline: 'Print Your Memories',
    kind: 'gradient',
  },
  {
    id: 'pratarasah',
    title: 'Pratarasah',
    description: 'High-end Indian restaurant with a cinematic digital menu and reservation system.',
    tag: 'Fine Dining · Hospitality',
    href: 'https://pratarasah.vercel.app/',
    accent: '#c9a24b',
    wordmark: 'Pratarasah',
    tagline: 'A Festival of Flavors',
    kind: 'serif',
  },
  {
    id: 'varalakshmi',
    title: 'Varalakshmi Tiffins',
    description: 'Multi-branch South Indian QSR chain — menu, branches, catering & food-app ordering.',
    tag: 'QSR · Restaurant Chain',
    href: 'https://varalakshmi-two.vercel.app/',
    accent: '#34c759',
    wordmark: 'VARALAKSHMI',
    tagline: 'A Cinematic Journey',
    kind: 'outline',
  },
];

function Wordmark({ p }) {
  if (p.kind === 'gradient') {
    return (
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {p.wordmark}
      </span>
    );
  }
  if (p.kind === 'serif') {
    return (
      <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(28px, 4.4vw, 44px)', fontWeight: 600, letterSpacing: '0.05em', color: p.accent }}>
        {p.wordmark}
      </span>
    );
  }
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '0.03em', color: 'transparent', WebkitTextStroke: `1px ${p.accent}` }}>
      {p.wordmark}
    </span>
  );
}

function ProjectCover(item, { active }) {
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', background: 'var(--bg-elev)', overflow: 'hidden' }}>
      {/* brand glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${item.accent}22, transparent 60%)` }} />
      <div style={{ position: 'absolute', inset: 0, opacity: active ? 0.16 : 0.08, transition: 'opacity 0.4s', background: `radial-gradient(circle at 50% 120%, ${item.accent}, transparent 65%)` }} />

      {/* centred wordmark */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 24px', textAlign: 'center' }}>
        <Wordmark p={item} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>{item.tagline}</span>
      </div>

      {/* bottom info bar */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: item.accent, marginBottom: 5 }}>{item.tag}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600, color: '#fff' }}>{item.title}</div>
        </div>
        <div style={{ color: active ? item.accent : 'var(--faint)', transition: 'color 0.3s', flexShrink: 0 }}>
          <SquareArrowOutUpRight style={{ width: 18, height: 18 }} />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  return (
    <section className="section" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '22px' }}>
            Featured Work
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading" style={{ marginTop: '16px' }}>
            Live projects, <span className="red">real results.</span>
          </motion.h2>
          <p className="text-muted" style={{ fontSize: '14px', marginTop: '18px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}>
            Drag · swipe · or tap a card to explore
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <CardStack
            items={projects}
            initialIndex={1}
            cardWidth={460}
            cardHeight={300}
            springStiffness={460}
            springDamping={32}
            autoAdvance
            intervalMs={2000}
            pauseOnHover
            loop
            showDots
            renderCard={ProjectCover}
          />
        </motion.div>
      </div>
    </section>
  );
}
