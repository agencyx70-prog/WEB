'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';

const ease = [0.4, 0, 0.2, 1];

function MemberImage({ m }) {
  const [err, setErr] = useState(false);
  const showImg = m.img && !err;
  if (showImg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/team/${encodeURIComponent(m.img)}`}
        alt={m.title}
        onError={() => setErr(true)}
        draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
      />
    );
  }
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elev)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, rgba(255,43,43,0.14), transparent 65%)' }} />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '96px', fontWeight: 800, color: 'transparent', WebkitTextStroke: '1px var(--red)' }}>{m.initials}</span>
    </div>
  );
}

export default function TeamMemberModal({ members, index, setIndex, onClose }) {
  const open = index !== null;
  const [direction, setDirection] = useState('right');
  const len = members.length;
  const active = open ? members[index] : null;

  const next = () => { setDirection('right'); setIndex((p) => (p + 1) % len); };
  const prev = () => { setDirection('left'); setIndex((p) => (p - 1 + len) % len); };
  const goTo = (i) => { setDirection(i > index ? 'right' : 'left'); setIndex(i); };

  // keyboard + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  const imageVariants = {
    enter: (d) => ({ y: d === 'right' ? '100%' : '-100%', opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (d) => ({ y: d === 'right' ? '-100%' : '100%', opacity: 0 }),
  };
  const textVariants = {
    enter: (d) => ({ x: d === 'right' ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d === 'right' ? -50 : 50, opacity: 0 }),
  };

  const thumbs = open ? members.filter((_, i) => i !== index).slice(0, 4) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 100050, background: 'rgba(8,7,6,0.9)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease }}
            onClick={(e) => e.stopPropagation()}
            className="glass tmm"
            style={{ width: '100%', maxWidth: '1040px', padding: '32px', position: 'relative', display: 'grid', gridTemplateColumns: 'minmax(110px, 0.9fr) 1.2fr 1.6fr', gap: '28px', overflow: 'hidden' }}
          >
            {/* close */}
            <button onClick={onClose} aria-label="Close" className="tmm-close" style={{ position: 'absolute', top: '18px', right: '18px', zIndex: 5, width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', transition: 'all 0.3s var(--ease)' }}>
              <X size={18} />
            </button>

            {/* left: meta + thumbnails */}
            <div className="tmm-meta" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', order: 1 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--muted)' }}>
                {String(index + 1).padStart(2, '0')} / {String(len).padStart(2, '0')}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '24px' }}>
                {thumbs.map((m) => {
                  const orig = members.findIndex((x) => x.id === m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => goTo(orig)}
                      aria-label={`View ${m.title}`}
                      style={{ position: 'relative', width: '56px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--line)', opacity: 0.65, transition: 'all 0.3s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'var(--red)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.65'; e.currentTarget.style.borderColor = 'var(--line)'; }}
                    >
                      <MemberImage m={m} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* center: photo (sliding) */}
            <div className="tmm-image" style={{ position: 'relative', minHeight: '420px', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--line)', order: 2 }}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={index}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <MemberImage m={active} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* right: text + nav */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', order: 3 }}>
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: '220px', paddingTop: '20px' }}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease }}
                  >
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)' }}>{active.role}</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 600, marginTop: '10px', lineHeight: 1 }}>{active.title}</h3>
                    <p className="text-muted" style={{ marginTop: '22px', fontSize: '16px', lineHeight: 1.7 }}>{active.bio}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
                <button onClick={prev} aria-label="Previous member" className="tmm-nav" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--line-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg)', transition: 'all 0.3s var(--ease)' }}>
                  <ArrowLeft size={18} />
                </button>
                <button onClick={next} aria-label="Next member" className="tmm-nav-fill" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s var(--ease)' }}>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            .tmm-close:hover { border-color: var(--red); color: var(--red); }
            .tmm-nav:hover { border-color: var(--red); color: var(--red); }
            .tmm-nav-fill:hover { background: var(--red-deep); }
            @media (max-width: 820px) {
              :global(.tmm) { grid-template-columns: 1fr !important; padding: 24px !important; }
              :global(.tmm) .tmm-image { order: 1 !important; min-height: 320px !important; }
              :global(.tmm) .tmm-meta { order: 3 !important; flex-direction: row; align-items: center; justify-content: space-between; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
