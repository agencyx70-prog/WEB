'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const ease = [0.22, 1, 0.36, 1];

const projects = [
  {
    title: 'RK Photoshoppy',
    tag: 'E-Commerce · Photography',
    desc: 'Premium photo-printing platform with drag-and-drop upload, bulk pricing, framing, and automated order management.',
    meta: ['Next.js', 'E-commerce'],
    url: 'https://rkphotoshoppy.com/',
    accent: '#38d6ee',
    accent2: '#e879f9',
    wordmark: 'RKPhotoShoppy',
    tagline: 'Print Your Memories',
    kind: 'gradient',
  },
  {
    title: 'Pratarasah',
    tag: 'Fine Dining · Hospitality',
    desc: 'High-end Indian restaurant with a cinematic digital menu, motion-rich plating gallery, and reservation system.',
    meta: ['Framer Motion', 'UI/UX'],
    url: 'https://pratarasah.vercel.app/',
    accent: '#c9a24b',
    wordmark: 'Pratarasah',
    tagline: 'A Festival of Flavors',
    kind: 'serif',
  },
  {
    title: 'Varalakshmi Tiffins',
    tag: 'QSR · Restaurant Chain',
    desc: 'Multi-branch South Indian breakfast chain with cinematic hero, menu, catering, and Swiggy / Zomato ordering.',
    meta: ['Next.js', 'Multi-branch'],
    url: 'https://varalakshmi-two.vercel.app/',
    accent: '#34c759',
    wordmark: 'VARALAKSHMI',
    tagline: 'A Cinematic Journey',
    kind: 'outline',
  },
];

function Wordmark({ p }) {
  if (p.kind === 'gradient') {
    return (
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 800, letterSpacing: '-0.02em', background: `linear-gradient(90deg, ${p.accent}, ${p.accent2})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {p.wordmark}
      </span>
    );
  }
  if (p.kind === 'serif') {
    return (
      <span style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '34px', fontWeight: 600, letterSpacing: '0.04em', color: p.accent }}>
        {p.wordmark}
      </span>
    );
  }
  // outline (cinematic)
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, letterSpacing: '0.02em', color: 'transparent', WebkitTextStroke: `1px ${p.accent}` }}>
      {p.wordmark}
    </span>
  );
}

function ProjectCard({ p, i }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 20 });
  const sy = useSpring(y, { stiffness: 250, damping: 20 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(sx, [-0.5, 0.5], ['-5deg', '5deg']);
  const [hover, setHover] = useState(false);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay: i * 0.1 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); x.set(0); y.set(0); }}
      className="glass"
      style={{ display: 'block', rotateX, rotateY, transformStyle: 'preserve-3d', overflow: 'hidden', cursor: 'none' }}
    >
      {/* brand preview panel */}
      <div style={{ position: 'relative', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderBottom: '1px solid var(--line)', overflow: 'hidden', background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.45))' }}>
        <motion.div
          animate={{ opacity: hover ? 0.3 : 0.14 }}
          transition={{ duration: 0.4 }}
          style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 120%, ${p.accent}, transparent 70%)` }}
        />
        <span className="index-num" style={{ position: 'absolute', top: '16px', left: '18px' }}>0{i + 1}</span>
        <motion.div
          animate={{ opacity: hover ? 1 : 0, x: hover ? 0 : -6, y: hover ? 0 : 6 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', top: '16px', right: '18px', color: p.accent }}
        >
          <ArrowUpRight size={24} strokeWidth={1.6} />
        </motion.div>

        <div style={{ transform: 'translateZ(40px)', textAlign: 'center' }}>
          <Wordmark p={p} />
        </div>
        <span style={{ transform: 'translateZ(30px)', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          {p.tagline}
        </span>
      </div>

      <div style={{ padding: '28px', transform: 'translateZ(20px)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: p.accent }}>{p.tag}</span>
        <h3 style={{ fontSize: '24px', fontWeight: 600, margin: '14px 0 10px' }}>{p.title}</h3>
        <p className="text-muted" style={{ fontSize: '14.5px', lineHeight: 1.65, marginBottom: '22px' }}>{p.desc}</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {p.meta.map((m) => (
            <span key={m} style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.08em', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '100px', padding: '6px 12px' }}>{m}</span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function PastWorks() {
  return (
    <section id="work" className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '64px' }}>
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              Selected Work
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading">
              Work that speaks<br /><span className="red">for itself.</span>
            </motion.h2>
          </div>
          <span className="index-num">03 — Live Projects</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', perspective: '1200px' }}>
          {projects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
