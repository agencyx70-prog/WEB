'use client';

export default function MarqueeBanner() {
  const items = ['Web Design', 'E-Commerce', 'Restaurant Sites', 'Digital Menus', 'Branding', 'Responsive'];
  const loop = [...items, ...items];

  return (
    <div style={{ position: 'relative', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '34px 0', overflow: 'hidden', zIndex: 2 }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 32s linear infinite' }}>
        {loop.map((item, i) => (
          <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '40px', paddingRight: '40px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 600, letterSpacing: '-0.02em', color: i % 2 ? 'var(--fg)' : 'transparent', WebkitTextStroke: i % 2 ? 'none' : '1px var(--line-strong)' }}>
              {item}
            </span>
            <span style={{ width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
