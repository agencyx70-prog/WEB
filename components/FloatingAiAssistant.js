'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUp, RotateCcw } from 'lucide-react';

/* ---------- Animated color orb (ported, red-tinted) ---------- */
function ColorOrb({ dimension = '24px', tones, spinDuration = 18 }) {
  const fallback = {
    base: 'oklch(22% 0 0)',
    accent1: 'oklch(62% 0.23 25)',
    accent2: 'oklch(48% 0.20 18)',
    accent3: 'oklch(74% 0.19 34)',
  };
  const p = { ...fallback, ...tones };
  const d = parseInt(dimension, 10);
  const blur = d < 50 ? Math.max(d * 0.008, 1) : Math.max(d * 0.015, 4);
  const contrast = d < 50 ? Math.max(d * 0.004, 1.2) : Math.max(d * 0.008, 1.5);
  const dot = d < 50 ? Math.max(d * 0.004, 0.05) : Math.max(d * 0.008, 0.1);
  const shadow = d < 50 ? Math.max(d * 0.004, 0.5) : Math.max(d * 0.008, 2);
  const mask = d < 30 ? '0%' : d < 50 ? '5%' : d < 100 ? '15%' : '25%';
  const adjustedContrast = d < 30 ? 1.1 : d < 50 ? Math.max(contrast * 1.2, 1.3) : contrast;

  return (
    <div
      className="color-orb"
      style={{
        width: dimension,
        height: dimension,
        flexShrink: 0,
        '--base': p.base,
        '--accent1': p.accent1,
        '--accent2': p.accent2,
        '--accent3': p.accent3,
        '--spin-duration': `${spinDuration}s`,
        '--blur': `${blur}px`,
        '--contrast': adjustedContrast,
        '--dot': `${dot}px`,
        '--shadow': `${shadow}px`,
        '--mask': mask,
      }}
    />
  );
}

/* ---------- Tiny markdown renderer (bold, links, bullets) ---------- */
function inline(text, kp) {
  const re = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^)]+)\))|((https?:\/\/[^\s]+))/g;
  const out = [];
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2]) out.push(<strong key={`${kp}-${k}`} style={{ color: 'var(--fg)', fontWeight: 600 }}>{m[2]}</strong>);
    else if (m[4]) out.push(<a key={`${kp}-${k}`} href={m[5]} target="_blank" rel="noreferrer" style={{ color: 'var(--red)', textDecoration: 'underline' }}>{m[4]}</a>);
    else if (m[7]) out.push(<a key={`${kp}-${k}`} href={m[7]} target="_blank" rel="noreferrer" style={{ color: 'var(--red)', textDecoration: 'underline' }}>{m[7]}</a>);
    last = m.index + m[0].length; k++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function renderRich(content) {
  const lines = String(content).split('\n');
  const blocks = [];
  let bullets = null;
  const flush = (key) => { if (bullets) { blocks.push(<ul key={`ul-${key}`} style={{ display: 'flex', flexDirection: 'column', gap: '5px', margin: 0, padding: 0, listStyle: 'none' }}>{bullets}</ul>); bullets = null; } };
  lines.forEach((line, i) => {
    const b = line.match(/^\s*[-•*]\s+(.*)/);
    if (b) {
      (bullets || (bullets = [])).push(
        <li key={`li-${i}`} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--red)', lineHeight: 1.5, flexShrink: 0 }}>•</span>
          <span>{inline(b[1], `li${i}`)}</span>
        </li>
      );
    } else {
      flush(i);
      if (line.trim() !== '') blocks.push(<span key={`p-${i}`}>{inline(line, `p${i}`)}</span>);
    }
  });
  flush('end');
  return blocks;
}

const GREETING = { role: 'assistant', content: "Hi! I'm the TheSevenZ assistant. Ask about our services, packages, or projects." };
const SUGGESTIONS = [
  { label: 'Pricing', q: 'What are your prices?' },
  { label: 'See work', q: 'Show me your work' },
  { label: 'Book a website', q: 'I want a website' },
  { label: 'Video editing', q: 'Do you edit videos?' },
];
const STORE_KEY = 'sevenz-chat';
const PANEL_W = 360;
const PANEL_H = 440;
const DOCK_W = 150;
const DOCK_H = 48;

export default function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([GREETING]);
  const [loading, setLoading] = useState(false);

  const wrapRef = useRef(null);
  const taRef = useRef(null);
  const scrollRef = useRef(null);
  const loaded = useRef(false);

  // load saved conversation (after mount → no hydration mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) { const arr = JSON.parse(saved); if (Array.isArray(arr) && arr.length) setMessages(arr); }
    } catch {}
    loaded.current = true;
  }, []);

  // persist
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-30))); } catch {}
  }, [messages]);

  const openPanel = () => { setOpen(true); setTimeout(() => taRef.current?.focus(), 60); };
  const closePanel = () => { setOpen(false); taRef.current?.blur(); };
  const resetChat = () => { setMessages([GREETING]); try { localStorage.removeItem(STORE_KEY); } catch {} };

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) closePanel(); };
    const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (override) => {
    const text = (typeof override === 'string' ? override : message).trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    if (typeof override !== 'string') setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: res.ok ? data.reply : `⚠ ${data.error || 'Something went wrong.'}` }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: '⚠ Network error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closePanel();
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div
      ref={wrapRef}
      style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9000, width: 'min(360px, 88vw)', height: PANEL_H, maxHeight: '72vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', pointerEvents: 'none' }}
    >
      <motion.div
        initial={false}
        animate={{ width: open ? PANEL_W : DOCK_W, height: open ? PANEL_H : DOCK_H, borderRadius: open ? 18 : 100 }}
        transition={{ type: 'spring', stiffness: 520, damping: 44, mass: 0.7, delay: open ? 0 : 0.06 }}
        style={{ position: 'absolute', bottom: 0, right: 0, maxWidth: '88vw', maxHeight: '72vh', overflow: 'hidden', pointerEvents: 'auto', background: '#000', border: '1px solid var(--line-strong)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
      >
        {/* Collapsed dock */}
        <AnimatePresence>
          {!open && (
            <motion.button
              key="dock"
              onClick={openPanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: '10px', padding: '0 18px', width: '100%', color: 'var(--fg)' }}
            >
              <ColorOrb dimension="24px" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ask AI</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Expanded chat */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ColorOrb dimension="22px" />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>TheSevenZ AI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={resetChat} aria-label="New chat" title="New chat" style={{ display: 'flex', color: 'var(--muted)' }}>
                    <RotateCcw size={14} />
                  </button>
                  <button onClick={closePanel} aria-label="Close" style={{ display: 'flex', color: 'var(--muted)' }}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="ai-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '84%',
                      fontSize: '14px',
                      lineHeight: 1.55,
                      padding: '10px 13px',
                      borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: m.role === 'user' ? 'var(--red)' : 'rgba(255,255,255,0.05)',
                      color: m.role === 'user' ? '#fff' : 'var(--fg)',
                      border: m.role === 'user' ? 'none' : '1px solid var(--line)',
                      whiteSpace: m.role === 'user' ? 'pre-wrap' : 'normal',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}>
                      {m.role === 'user' ? m.content : renderRich(m.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '4px', padding: '12px 13px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)' }}>
                      <span className="ai-dot" /><span className="ai-dot" style={{ animationDelay: '0.15s' }} /><span className="ai-dot" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}

                {messages.length <= 1 && !loading && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {SUGGESTIONS.map((s) => (
                      <button key={s.label} className="ai-chip" onClick={() => send(s.q)}>{s.label}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ borderTop: '1px solid var(--line)', padding: '12px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <textarea
                  ref={taRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Ask me anything…"
                  className="ai-input"
                  spellCheck={false}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--fg)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.5, maxHeight: '80px' }}
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !message.trim()}
                  aria-label="Send"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', background: 'var(--red)', color: '#fff', flexShrink: 0, opacity: loading || !message.trim() ? 0.5 : 1, transition: 'opacity 0.2s' }}
                >
                  <ArrowUp size={17} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        .ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); display: inline-block; animation: aiBounce 1s ease-in-out infinite; }
        @keyframes aiBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        .ai-input::placeholder { color: var(--faint); }
        .ai-chip { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.04em; color: var(--muted); border: 1px solid var(--line); border-radius: 100px; padding: 7px 12px; transition: all 0.2s var(--ease); }
        .ai-chip:hover { border-color: var(--red); color: var(--red); }
        .ai-scroll::-webkit-scrollbar { width: 5px; }
        .ai-scroll::-webkit-scrollbar-thumb { background: #2a2624; border-radius: 10px; }
      `}</style>
    </div>
  );
}
