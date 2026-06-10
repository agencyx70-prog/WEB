'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Info } from 'lucide-react';

const GREETING = { role: 'assistant', content: "Hi! I'm the TheSevenZ assistant. Ask me about our services, pricing, or projects — or say hello." };
const MAX = 2000;

export default function FloatingAiAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([GREETING]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  // autoscroll to newest
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  // click outside / Esc to close
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('.fab-ai')) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const send = async () => {
    const text = message.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setMessage('');
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9000 }}>
      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          className="ai-panel"
          style={{
            position: 'absolute',
            bottom: '78px',
            right: 0,
            width: 'min(92vw, 400px)',
            transformOrigin: 'bottom right',
            animation: 'aiPopIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="glass" style={{ display: 'flex', flexDirection: 'column', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.55)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 8px var(--red-glow)' }} className="ai-pulse" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>AI Assistant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--red)', border: '1px solid rgba(255,43,43,0.3)', borderRadius: '100px', padding: '3px 9px' }}>GEMINI</span>
                <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ display: 'flex', color: 'var(--muted)' }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="ai-scroll" style={{ maxHeight: '320px', overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    fontSize: '14px',
                    lineHeight: 1.55,
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role === 'user' ? 'var(--red)' : 'rgba(255,255,255,0.04)',
                    color: m.role === 'user' ? '#fff' : 'var(--fg)',
                    border: m.role === 'user' ? 'none' : '1px solid var(--line)',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '4px', padding: '12px 14px', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)' }}>
                    <span className="ai-dot" /><span className="ai-dot" style={{ animationDelay: '0.15s' }} /><span className="ai-dot" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ borderTop: '1px solid var(--line)', padding: '12px 14px' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder="Ask anything…"
                className="ai-input"
                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--fg)', fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.6, minHeight: '46px' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--faint)' }}>
                  <Info size={11} /> Shift+Enter for newline
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--faint)' }}>{message.length}/{MAX}</span>
                  <button
                    onClick={send}
                    disabled={loading || !message.trim()}
                    aria-label="Send"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '11px', background: 'var(--red)', color: '#fff', opacity: loading || !message.trim() ? 0.5 : 1, transition: 'opacity 0.2s, background 0.2s' }}
                  >
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        className="fab-ai"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        style={{
          position: 'relative',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          background: 'radial-gradient(circle at 30% 25%, #ff5a5a, var(--red) 45%, var(--red-deep))',
          boxShadow: '0 0 22px var(--red-glow), 0 8px 24px rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.18)',
          transition: 'transform 0.4s var(--ease), box-shadow 0.4s var(--ease)',
        }}
      >
        <span className="fab-ping" />
        <span style={{ position: 'relative', zIndex: 2, display: 'flex', transition: 'transform 0.4s', transform: open ? 'rotate(90deg)' : 'none' }}>
          {open ? <X size={26} /> : <Bot size={28} />}
        </span>
      </button>

      <style jsx>{`
        @keyframes aiPopIn {
          0% { opacity: 0; transform: scale(0.85) translateY(16px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .fab-ai:hover {
          transform: scale(1.08) rotate(4deg);
          box-shadow: 0 0 34px var(--red-glow), 0 10px 30px rgba(0,0,0,0.5);
        }
        .fab-ping {
          position: absolute; inset: 0; border-radius: 50%;
          background: var(--red); opacity: 0.25;
          animation: fabPing 2s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes fabPing { 70%, 100% { transform: scale(1.45); opacity: 0; } }
        .ai-pulse { animation: aiPulse 1.6s ease-in-out infinite; }
        @keyframes aiPulse { 50% { opacity: 0.35; } }
        .ai-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); display: inline-block; animation: aiBounce 1s ease-in-out infinite; }
        @keyframes aiBounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
        .ai-input::placeholder { color: var(--faint); }
        .ai-scroll::-webkit-scrollbar { width: 5px; }
        .ai-scroll::-webkit-scrollbar-thumb { background: #2a2624; border-radius: 10px; }
      `}</style>
    </div>
  );
}
