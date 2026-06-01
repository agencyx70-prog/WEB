// Ambient drifting blur orbs — soft atmosphere behind all content.
// Pure CSS animation (classes defined in globals.css), no JS.

const orbs = [
  { size: 460, top: '12%', left: '-8%', color: 'rgba(255,43,43,0.07)', anim: 'orbDrift1 22s ease-in-out infinite' },
  { size: 380, top: '55%', right: '-6%', color: 'rgba(255,43,43,0.05)', anim: 'orbDrift2 28s ease-in-out infinite' },
  { size: 300, top: '120%', left: '30%', color: 'rgba(120,20,20,0.08)', anim: 'orbDrift3 26s ease-in-out infinite' },
];

export default function AmbientBlur() {
  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {orbs.map((o, i) => (
        <span
          key={i}
          className="orb"
          style={{
            width: o.size,
            height: o.size,
            top: o.top,
            left: o.left,
            right: o.right,
            background: o.color,
            animation: o.anim,
          }}
        />
      ))}
    </div>
  );
}
