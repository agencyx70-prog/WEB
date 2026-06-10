'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const ease = [0.22, 1, 0.36, 1];

const info = [
  { icon: <Mail size={16} />, label: 'Email', value: 'agencyx70@gmail.com' },
  { icon: <Phone size={16} />, label: 'Phone', value: '+91 94914 64007' },
  { icon: <MapPin size={16} />, label: 'Studio', value: 'Telangana, India · Remote' },
];

const budgetOptions = ['Content Creation', 'Video Editing', 'Social Media Management', 'Brand Deals', 'Website / Other'];

const fieldStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--line)',
  borderRadius: '12px',
  color: 'var(--fg)',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  padding: '24px 16px 8px',
  outline: 'none',
  transition: 'border-color 0.3s var(--ease)',
};

function Field({ label, name, type = 'text', value, onChange, textarea, error }) {
  const [focused, setFocused] = useState(false);
  const floating = focused || value.length > 0;
  const El = textarea ? 'textarea' : 'input';
  return (
    <div style={{ position: 'relative' }}>
      <label style={{
        position: 'absolute', left: '16px',
        top: floating ? '8px' : (textarea ? '22px' : '50%'),
        transform: floating ? 'none' : 'translateY(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: floating ? '9.5px' : '14px',
        letterSpacing: floating ? '0.14em' : '0',
        textTransform: floating ? 'uppercase' : 'none',
        color: error ? 'var(--red)' : (floating ? 'var(--muted)' : 'var(--faint)'),
        pointerEvents: 'none',
        transition: 'all 0.25s var(--ease)',
      }}>{label}</label>
      <El
        name={name}
        {...(textarea ? {} : { type })}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...fieldStyle,
          ...(textarea ? { minHeight: '120px', paddingTop: '28px', resize: 'vertical' } : { height: '58px' }),
          borderColor: error ? 'var(--red)' : (focused ? 'var(--line-strong)' : 'var(--line)'),
        }}
      />
      {error && <span style={{ position: 'absolute', bottom: '-18px', left: '2px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--red)' }}>{error}</span>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Valid email required';
    if (!form.budget) er.budget = 'Select a service';
    if (form.message.trim().length < 10) er.message = 'Tell us a bit more';
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setForm({ name: '', email: '', budget: '', message: '' });
    }, 1400);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div style={{ marginBottom: '64px' }}>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            Contact
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="heading">
            Let's build something<br /><span className="red">extraordinary.</span>
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'start' }}>
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <p className="text-muted" style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px' }}>
              Have a project in mind? Whether it's a detailed brief or a rough idea, we'll help shape it into something remarkable. We reply within 24 hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {info.map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px 0', borderTop: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--red)' }}>{it.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '3px' }}>{it.label}</div>
                    <div style={{ fontSize: '15px' }}>{it.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }} className="glass" style={{ padding: '36px' }}>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle size={48} color="var(--red)" strokeWidth={1.4} style={{ marginBottom: '20px' }} />
                  <h3 style={{ fontSize: '26px', marginBottom: '12px' }}>Message sent.</h3>
                  <p className="text-muted" style={{ fontSize: '15px', marginBottom: '28px' }}>We'll get back to you within 24 hours.</p>
                  <button onClick={() => setDone(false)} className="btn btn-ghost"><span>Send another</span></button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
                    <Field label="Your Name" name="name" value={form.name} onChange={change} error={errors.name} />
                    <Field label="Email Address" name="email" type="email" value={form.email} onChange={change} error={errors.email} />
                  </div>

                  {/* Budget dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setOpen(!open)}
                      style={{ ...fieldStyle, height: '58px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left', borderColor: errors.budget ? 'var(--red)' : 'var(--line)', paddingTop: '8px', cursor: 'pointer' }}
                    >
                      <span style={{ color: form.budget ? 'var(--fg)' : 'var(--faint)', fontSize: form.budget ? '15px' : '14px', fontFamily: form.budget ? 'var(--font-body)' : 'var(--font-mono)', letterSpacing: form.budget ? '0' : '0' }}>
                        {form.budget || 'What do you need?'}
                      </span>
                      <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ color: 'var(--muted)' }}><ChevronDown size={16} /></motion.span>
                    </button>
                    {errors.budget && <span style={{ position: 'absolute', bottom: '-18px', left: '2px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--red)' }}>{errors.budget}</span>}
                    <AnimatePresence>
                      {open && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 50, background: 'var(--bg-elev)', border: '1px solid var(--line-strong)', borderRadius: '12px', overflow: 'hidden' }}
                        >
                          {budgetOptions.map((opt, i) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => { setForm({ ...form, budget: opt }); setErrors({ ...errors, budget: '' }); setOpen(false); }}
                              style={{ width: '100%', textAlign: 'left', padding: '14px 16px', fontSize: '14px', color: 'var(--fg)', borderBottom: i < budgetOptions.length - 1 ? '1px solid var(--line)' : 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,43,43,0.08)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              {opt}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Field label="Tell us about your project" name="message" textarea value={form.message} onChange={change} error={errors.message} />

                  <button type="submit" disabled={loading} className="btn btn-fill" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                    {loading ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }} />
                    ) : (
                      <><span>Send Message</span><ArrowRight size={15} /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
