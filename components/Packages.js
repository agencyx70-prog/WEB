'use client';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DottedSurface from './DottedSurface';
import SwipeRow from './SwipeRow';

const ease = [0.22, 1, 0.36, 1];

// Content & social packages — pricing not finalised yet.
const contentPlans = [
  {
    name: 'Content Creation',
    desc: 'Scroll-stopping photo & video content, graphics, and concepts tailored to your brand.',
    features: ['Photo & video shoots', 'Graphic design', 'Content strategy', 'Branded templates'],
    comingSoon: true,
  },
  {
    name: 'Video Editing',
    desc: 'Reels, shorts, and long-form edits with motion graphics, captions, and sound design.',
    features: ['Reels & shorts', 'Long-form edits', 'Motion graphics', 'Captions & sound'],
    comingSoon: true,
  },
  {
    name: 'Social Media Management',
    desc: 'End-to-end account management — strategy, posting, community, and steady growth.',
    features: ['Content calendar', 'Posting & scheduling', 'Community management', 'Monthly analytics'],
    comingSoon: true,
    popular: true,
  },
  {
    name: 'Brand Deals',
    desc: 'We connect creators with brands and manage partnerships from outreach to reporting.',
    features: ['Brand outreach', 'Deal negotiation', 'Campaign management', 'Performance reporting'],
    comingSoon: true,
  },
];

// Website design — priced & ready to book.
const webPlans = [
  {
    name: 'Starter Pack',
    price: '₹20,000',
    cut: '₹25,000',
    priceNote: 'one-time',
    desc: 'A clean, single-page presence to get you online fast.',
    features: ['Custom domain', 'Basic landing page', 'Mobile-responsive', 'Contact section'],
  },
  {
    name: 'Most Picked',
    price: '₹45,000',
    cut: '₹50,000',
    priceNote: 'one-time',
    desc: 'A complete full-stack website, built end-to-end with your data.',
    features: ['Custom domain', 'Full-stack build', 'End-to-end + data', 'Mobile-responsive', 'Content / admin setup'],
    footnote: '+ ₹2,000 / month maintenance — only if changes are needed.',
    popular: true,
  },
  {
    name: 'Premium',
    price: 'From ₹75,000+',
    custom: true,
    desc: 'For agencies, brands, and e-commerce — fully custom to your requirements.',
    features: ['Everything in Most Picked', 'E-commerce / advanced features', 'Custom integrations', 'Priority support', 'Scoped to your needs'],
  },
];

function PlanCard({ plan, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease, delay: i * 0.08 }}
      className="glass"
      style={{
        padding: '36px 30px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: plan.popular ? 'rgba(255,43,43,0.06)' : 'var(--glass)',
        borderColor: plan.popular ? 'rgba(255,43,43,0.35)' : 'var(--glass-border)',
        boxShadow: plan.popular ? '0 0 60px rgba(255,43,43,0.12)' : 'none',
      }}
    >
      {(plan.popular || plan.custom) && (
        <span style={{ position: 'absolute', top: '20px', right: '22px', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--red)' }}>
          {plan.custom ? 'Custom' : plan.popular && plan.comingSoon ? '★ Flagship' : '★ Most Picked'}
        </span>
      )}

      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)' }}>{plan.name}</span>

      {/* price block */}
      <div style={{ margin: '18px 0 10px' }}>
        {plan.comingSoon ? (
          <>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg)' }}>Coming Soon</span>
            <div style={{ marginTop: '8px' }}>
              <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', border: '1px solid rgba(255,43,43,0.3)', borderRadius: '100px', padding: '4px 12px' }}>
                Pricing TBA
              </span>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: plan.custom ? '32px' : '42px', fontWeight: 600, letterSpacing: '-0.02em' }}>{plan.price}</span>
            {plan.cut && <span style={{ fontSize: '15px', color: 'var(--faint)', textDecoration: 'line-through' }}>{plan.cut}</span>}
            {plan.priceNote && <span className="text-muted" style={{ fontSize: '12px' }}>{plan.priceNote}</span>}
          </div>
        )}
      </div>

      <p className="text-muted" style={{ fontSize: '14.5px', lineHeight: 1.6, marginBottom: '26px' }}>{plan.desc}</p>

      <div className="hairline" style={{ marginBottom: '26px' }} />

      <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: plan.footnote ? '18px' : '34px', flex: 1 }}>
        {plan.features.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
            <Check size={15} color="var(--red)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span className="text-muted">{f}</span>
          </li>
        ))}
      </ul>

      {plan.footnote && (
        <p style={{ fontSize: '12px', lineHeight: 1.5, color: 'var(--red)', marginBottom: '26px', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
          {plan.footnote}
        </p>
      )}

      <Link
        href="/contact"
        className={plan.popular && !plan.comingSoon ? 'btn btn-fill' : 'btn btn-ghost'}
        style={{ width: '100%', justifyContent: 'center' }}
      >
        <span>{plan.custom ? 'Get a Quote' : plan.comingSoon ? 'Enquire' : 'Get Started'}</span>
        <ArrowRight size={15} />
      </Link>
    </motion.div>
  );
}

function GroupLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 0 28px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{children}</span>
      <span className="hairline" />
    </div>
  );
}

export default function Packages() {
  const dotMask = 'radial-gradient(ellipse 92% 82% at 50% 45%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.5) 64%, rgba(0,0,0,0) 100%)';
  return (
    <section id="packages" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dotted wave surface background — faded at the edges */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55, maskImage: dotMask, WebkitMaskImage: dotMask }}>
        <DottedSurface color="#ff2b2b" opacity={0.5} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '24px' }}>
            Packages
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading" style={{ marginTop: '16px' }}>
            Built for creators <span className="red">&amp; brands.</span>
          </motion.h2>
          <p className="text-muted" style={{ fontSize: '15px', maxWidth: '480px', margin: '20px auto 0', lineHeight: 1.7 }}>
            Content &amp; social packages land soon — website design is priced and ready to book today.
          </p>
        </div>

        {/* Website design — priced */}
        <GroupLabel>Website Design · Ready to book · swipe →</GroupLabel>
        <div style={{ marginBottom: '64px' }}>
          <SwipeRow basis="330px">
            {webPlans.map((plan, i) => <PlanCard key={plan.name} plan={plan} i={i} />)}
          </SwipeRow>
        </div>

        {/* Content & social — coming soon */}
        <GroupLabel>Content &amp; Social · Coming soon · swipe →</GroupLabel>
        <SwipeRow basis="290px">
          {contentPlans.map((plan, i) => <PlanCard key={plan.name} plan={plan} i={i} />)}
        </SwipeRow>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-muted"
          style={{ textAlign: 'center', fontSize: '13px', marginTop: '44px', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em' }}
        >
          Content &amp; social pricing is being finalised — get in touch for early-bird rates.
        </motion.p>
      </div>
    </section>
  );
}
