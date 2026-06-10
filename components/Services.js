'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

const services = [
  {
    title: 'Content Creation',
    desc: 'Scroll-stopping photo and video content, graphics, and concepts tailored to your brand.',
    tags: ['Photography', 'Video', 'Graphics', 'Concepts'],
  },
  {
    title: 'Video Editing',
    desc: 'Reels, shorts, and long-form edits with motion graphics, captions, and sound design.',
    tags: ['Reels & Shorts', 'Long-form', 'Motion Graphics', 'Sound Design'],
  },
  {
    title: 'Social Media Management',
    desc: 'End-to-end account management — strategy, posting, community, and steady growth.',
    tags: ['Strategy', 'Scheduling', 'Community', 'Analytics'],
  },
  {
    title: 'Brand Deals',
    desc: 'We connect creators with brands and manage partnerships from outreach to reporting.',
    tags: ['Outreach', 'Negotiation', 'Campaigns', 'Reporting'],
  },
  {
    title: 'Website Design',
    desc: 'Custom, responsive websites for restaurants, e-commerce, and small businesses.',
    tags: ['Restaurant Sites', 'E-commerce', 'Digital Menus', 'Business Sites'],
  },
  {
    title: 'AI Automations',
    desc: 'Chatbots, lead-capture flows, and AI integrations that save hours every week.',
    tags: ['AI Chatbots', 'Workflow', 'Lead Capture', 'API Integrations'],
  },
];

const ease = [0.22, 1, 0.36, 1];

function Row({ s, i }) {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const expanded = hover || open;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease, delay: i * 0.08 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setOpen((o) => !o)}
      style={{ position: 'relative', borderTop: '1px solid var(--line)', padding: '40px 0', overflow: 'hidden' }}
    >
      {/* hover/active wash */}
      <motion.div
        animate={{ opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 15% 50%, rgba(255,43,43,0.06), transparent 60%)', pointerEvents: 'none' }}
      />
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '24px', alignItems: 'start' }} className="svc-grid">
        <span className="index-num" style={{ paddingTop: '10px' }}>0{i + 1}</span>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <motion.h3
              animate={{ x: expanded ? 12 : 0 }}
              transition={{ duration: 0.4, ease }}
              style={{ fontSize: 'clamp(28px, 7vw, 56px)', fontWeight: 600 }}
            >
              {s.title}
            </motion.h3>
            {s.soon && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--red)', border: '1px solid var(--red)', borderRadius: '100px', padding: '4px 12px' }}>
                Soon
              </span>
            )}
            <motion.div
              animate={{ opacity: expanded ? 1 : 0.4, rotate: expanded ? 0 : -45 }}
              transition={{ duration: 0.4, ease }}
              style={{ marginLeft: 'auto', color: 'var(--red)', flexShrink: 0 }}
            >
              <ArrowUpRight size={30} strokeWidth={1.4} />
            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.45, ease }}
            style={{ overflow: 'hidden' }}
          >
            <p className="text-muted" style={{ fontSize: '16px', maxWidth: '560px', lineHeight: 1.7, marginTop: '20px' }}>{s.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
              {s.tags.map((t) => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: '100px', padding: '7px 14px' }}>{t}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '72px' }}>
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              What We Do
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading">
              Services that<br /><span className="outline-text">move the needle.</span>
            </motion.h2>
          </div>
          <p className="text-muted" style={{ fontSize: '15px', maxWidth: '320px', lineHeight: 1.7 }}>
            Content, video, social, and web — everything your brand needs to grow online.
          </p>
        </div>

        <div style={{ borderBottom: '1px solid var(--line)' }}>
          {services.map((s, i) => <Row key={i} s={s} i={i} />)}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          :global(.svc-grid) { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </section>
  );
}
