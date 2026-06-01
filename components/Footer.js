'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const ease = [0.22, 1, 0.36, 1];

const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const socials = [
  { label: 'Twitter', d: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /> },
  { label: 'LinkedIn', d: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></> },
  { label: 'Instagram', d: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></> },
];

const columns = {
  Pages: [{ name: 'Services', href: '/services' }, { name: 'Work', href: '/work' }, { name: 'Packages', href: '/packages' }, { name: 'Team', href: '/team' }],
  Company: [{ name: 'About', href: '/team' }, { name: 'Contact', href: '/contact' }, { name: 'Careers', href: '/contact' }],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sub, setSub] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (email) { setSub(true); setEmail(''); setTimeout(() => setSub(false), 3000); }
  };

  return (
    <footer style={{ position: 'relative', zIndex: 2, borderTop: '1px solid var(--line)', paddingTop: '100px' }}>
      <div className="container">
        {/* Big CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}>
          <span className="kicker" style={{ marginBottom: '28px', display: 'inline-flex' }}>Start a project</span>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <h2 className="display-xl outline-text" style={{ textTransform: 'uppercase', lineHeight: 0.9 }}>
              Let's Talk
            </h2>
            <ArrowUpRight size={48} strokeWidth={1} color="var(--red)" />
          </Link>
        </motion.div>

        <div className="hairline" style={{ margin: '80px 0 56px' }} />

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '48px', marginBottom: '72px' }}>
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              AGENCY<span style={{ color: 'var(--red)' }}>.X</span>
            </div>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.7, maxWidth: '240px' }}>
              A new agency building beautiful websites for businesses. Starting small, dreaming big.
            </p>
          </div>

          {Object.entries(columns).map(([cat, links]) => (
            <div key={cat}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '20px' }}>{cat}</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {links.map((l) => (
                  <li key={l.name}><Link href={l.href} className="ul-link text-muted" style={{ fontSize: '14px' }}>{l.name}</Link></li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '20px' }}>Newsletter</div>
            <form onSubmit={subscribe} style={{ display: 'flex', borderBottom: '1px solid var(--line-strong)', paddingBottom: '8px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--fg)', fontFamily: 'var(--font-body)', fontSize: '14px' }}
              />
              <button type="submit" aria-label="Subscribe" style={{ color: 'var(--red)' }}>
                <ArrowUpRight size={18} />
              </button>
            </form>
            {sub && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', marginTop: '8px', display: 'block' }}>Subscribed ✓</motion.span>}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hairline" style={{ marginBottom: '28px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '40px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--faint)' }}>
            © {new Date().getFullYear()} AGENCY.X — Telangana, India
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="glass"
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', color: 'var(--muted)', transition: 'all 0.3s var(--ease)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
              >
                <Icon d={s.d} size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
