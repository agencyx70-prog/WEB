'use client';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/packages', label: 'Packages' },
  { href: '/team', label: 'Team' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > prev && latest > 200 && !isOpen);
  });

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '14px 0' : '24px 0',
          transition: 'padding 0.4s var(--ease)',
        }}
      >
        <nav className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>
            AGENCY<span style={{ color: 'var(--red)' }}>.X</span>
          </Link>

          {/* Desktop */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', gap: '32px' }}>
              {navLinks.map((l, i) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="ul-link"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}
                >
                  <span style={{ color: 'var(--faint)', marginRight: '6px' }}>0{i + 1}</span>
                  {l.label}
                </Link>
              ))}
            </div>
            <Link href="/contact" className="btn btn-fill">
              <span>Get Started</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav-toggle"
            aria-label="Menu"
            style={{ display: 'none', color: 'var(--fg)', padding: '6px' }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              background: 'rgba(10,9,8,0.96)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0 32px',
            }}
          >
            {navLinks.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <Link
                  href={l.href}
                  onClick={() => setIsOpen(false)}
                  style={{ display: 'flex', alignItems: 'baseline', gap: '16px', padding: '24px 0', fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 600 }}
                >
                  <span className="index-num">0{i + 1}</span>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{ marginTop: '40px' }}
            >
              <Link href="/contact" onClick={() => setIsOpen(false)} className="btn btn-fill" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Get Started</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 820px) {
          .nav-desktop { display: none !important; }
          .nav-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}
