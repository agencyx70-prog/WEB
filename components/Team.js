'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CardStack from './CardStack';
import TeamMemberModal from './TeamMemberModal';

const ease = [0.22, 1, 0.36, 1];

/* ---------- Team data ---------- */
// Photos live in /public/team/ — filenames mapped exactly in `img`.
const team = [
  { id: 'vamshi', title: 'Vamshi Krishna', role: 'Founder & Developer', initials: 'VK', img: 'Vamshikrishna.jpeg', bio: 'Founder and lead developer. Builds restaurant sites, e-commerce platforms, and digital menus end-to-end, and drives the studio’s AI-automation work.' },
  { id: 'siri', title: 'Siri Goud', role: 'Finance Manager', initials: 'SG', img: 'siri.jpeg', bio: 'Keeps the studio healthy — budgeting, finances, and financial planning across every project.' },
  { id: 'praneet', title: 'Praneet Yadav', role: 'Content Creator', initials: 'PY', img: 'Praneet.jpeg', bio: 'Shapes how the studio looks and sounds — visual content and social presence.' },
  { id: 'kaushik', title: 'Kaushik Varma', role: 'Video Editor', initials: 'KV', img: 'kaushik.jpeg', bio: 'Turns raw footage into story — video editing and content for digital platforms.' },
  { id: 'mounika', title: 'Mounika', role: 'Team Member', initials: 'MO', img: 'Mounika.jpeg', bio: 'Supports the team across design and day-to-day operations.' },
  { id: 'mohanasai', title: 'Mohana Sai', role: 'Team Member', initials: 'MS', img: 'mohana sai.jpeg', bio: 'Supports the team across content and day-to-day operations.' },
  { id: 'akshith', title: 'Akshith Devaraya', role: 'Business Development', initials: 'AD', img: null, bio: 'Opens doors — business strategy, market research, and client relationships.' },
];

function TeamCard({ item, active }) {
  const [err, setErr] = useState(false);
  const showImg = item.img && !err;

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%', background: 'var(--bg-elev)', overflow: 'hidden' }}>
      {/* brand glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(255,43,43,0.12), transparent 60%)' }} />

      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/team/${encodeURIComponent(item.img)}`}
          alt={item.title}
          onError={() => setErr(true)}
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            filter: active ? 'grayscale(0)' : 'grayscale(0.55)',
            transform: active ? 'scale(1.03)' : 'scale(1)',
            transition: 'filter 0.5s var(--ease), transform 0.6s var(--ease)',
          }}
        />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '88px', fontWeight: 800, letterSpacing: '-0.02em', color: 'transparent', WebkitTextStroke: `1px ${active ? 'var(--red)' : 'var(--line-strong)'}`, transition: 'all 0.4s' }}>
            {item.initials}
          </span>
        </div>
      )}

      {/* top index */}
      <span className="index-num" style={{ position: 'absolute', top: '16px', left: '18px', zIndex: 2, color: 'rgba(255,255,255,0.7)' }}>
        {item.initials}
      </span>

      {/* readability gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.2) 45%, transparent 70%)', pointerEvents: 'none' }} />

      {/* content */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '24px', zIndex: 2 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px' }}>
          {item.role}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 600, lineHeight: 1.02, color: '#fff' }}>
          {item.title}
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="team" className="section" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px', marginBottom: '56px' }}>
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '24px', display: 'inline-flex' }}>
              The Team
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading">
              The minds behind<br /><span className="outline-text">the magic.</span>
            </motion.h2>
          </div>
          <p className="text-muted" style={{ fontSize: '14px', maxWidth: '280px', lineHeight: 1.7, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
            Drag to browse · tap the front card to open a profile.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <CardStack
            items={team}
            initialIndex={0}
            maxVisible={7}
            cardWidth={340}
            cardHeight={440}
            overlap={0.52}
            spreadDeg={34}
            springStiffness={460}
            springDamping={32}
            autoAdvance
            intervalMs={1800}
            pauseOnHover
            loop
            showDots
            onActiveClick={(i) => setOpenIndex(i)}
            renderCard={(item, state) => <TeamCard item={item} active={state.active} />}
          />
        </motion.div>
      </div>

      <TeamMemberModal
        members={team}
        index={openIndex}
        setIndex={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
}
