'use client';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DottedSurface from './DottedSurface';

const ease = [0.22, 1, 0.36, 1];

const plans = [
  {
    name: 'Basic',
    price: '₹15,000',
    desc: 'A simple online presence for small businesses.',
    features: ['3–5 page website', 'Mobile-responsive', 'Basic contact form', '1 revision round', '7-day support'],
  },
  {
    name: 'Standard',
    price: '₹30,000',
    desc: 'For restaurants, cafes, and service businesses.',
    features: ['5–10 page website', 'Mobile-responsive', 'Online menu integration', 'Map integration', '2 revision rounds', '14-day support'],
    popular: true,
  },
  {
    name: 'E-Commerce',
    price: '₹50,000',
    desc: 'For businesses ready to sell online.',
    features: ['Product catalog', 'Shopping cart', 'Payment gateway', 'Order management', '3 revision rounds', '30-day support'],
  },
];

export default function Packages() {
  const dotMask = 'radial-gradient(ellipse 92% 82% at 50% 45%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0) 100%)';
  return (
    <section id="packages" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dotted wave surface background — faded at the edges */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55, maskImage: dotMask, WebkitMaskImage: dotMask }}>
        <DottedSurface color="#ff2b2b" opacity={0.5} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '24px' }}>
            Pricing
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading" style={{ marginTop: '16px' }}>
            Transparent <span className="red">pricing.</span>
          </motion.h2>
          <p className="text-muted" style={{ fontSize: '15px', maxWidth: '420px', margin: '20px auto 0', lineHeight: 1.7 }}>
            No hidden fees, no surprises. Pick a plan that fits your goals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              className="glass"
              style={{
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                background: plan.popular ? 'rgba(255,43,43,0.06)' : 'var(--glass)',
                borderColor: plan.popular ? 'rgba(255,43,43,0.35)' : 'var(--glass-border)',
                boxShadow: plan.popular ? '0 0 60px rgba(255,43,43,0.12)' : 'none',
              }}
            >
              {plan.popular && (
                <span style={{ position: 'absolute', top: '20px', right: '24px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red)' }}>
                  ★ Popular
                </span>
              )}

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>{plan.name}</span>

              <div style={{ margin: '18px 0 10px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 600, letterSpacing: '-0.02em' }}>{plan.price}</span>
                <span className="text-muted" style={{ fontSize: '13px' }}>/project</span>
              </div>

              <p className="text-muted" style={{ fontSize: '14.5px', lineHeight: 1.6, marginBottom: '28px' }}>{plan.desc}</p>

              <div className="hairline" style={{ marginBottom: '28px' }} />

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px', flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                    <Check size={15} color="var(--red)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    <span className="text-muted">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={plan.popular ? 'btn btn-fill' : 'btn btn-ghost'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-muted"
          style={{ textAlign: 'center', fontSize: '13px', marginTop: '40px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}
        >
          All plans include a satisfaction guarantee — not happy? We'll work with you until you are.
        </motion.p>
      </div>
    </section>
  );
}
