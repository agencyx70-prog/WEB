// Server-side AI proxy — the API key stays here and is never sent to the browser.
export const runtime = 'nodejs';

const SYSTEM = `You are the TheSevenZ assistant — a friendly creative studio with a minimal black/red aesthetic.
Services: content creation, video editing, social media management, and brand deals, plus website design and AI automations.
Website design pricing (ready to book): Starter ₹20,000 one-time (domain + basic landing page); Most Picked ₹45,000 one-time (domain + full-stack, end-to-end with data; +₹2,000/month maintenance only if changes are needed); Premium from ₹75,000+ custom (for agencies, brands, and e-commerce).
Content & social packages (content creation, video editing, social media management, brand deals) are "coming soon" — pricing not finalised; for those, invite the visitor to enquire via the contact page for early-bird rates.
Based in Telangana, India; we reply within 24 hours. Contact: agencyx70@gmail.com, +91 94914 64007, Instagram @thesevenzagency (https://www.instagram.com/thesevenzagency/).
Live web projects: RK Photoshoppy (photo-printing e-commerce), Pratarasah (fine-dining), Varalakshmi Tiffins (multi-branch QSR).
Style: warm and concise (2–5 sentences or a short bullet list). Use light markdown — **bold** for key terms and "- " for bullets. Always steer project enquiries to the contact page. If you're unsure, say so and suggest getting in touch.`;

// Helpful, on-brand answer used whenever the live model is unavailable.
function fallbackAnswer(q = '') {
  const t = q.toLowerCase();
  const has = (...k) => k.some((w) => t.includes(w));

  if (has('price', 'pricing', 'cost', 'package', 'rate', 'how much', 'quote', 'budget')) {
    return `Here's our pricing:\n\n**Website Design** — ready to book\n- Starter — ₹20,000 (domain + basic landing page)\n- Most Picked — ₹45,000 (full-stack, end-to-end + data; +₹2,000/mo maintenance only if changes)\n- Premium — from ₹75,000+ (custom: agencies, brands, e-commerce)\n\n**Content & Social** (content creation, video editing, social media management, brand deals) — pricing is **coming soon**.\n\nWant a tailored quote? Reach us via the contact page.`;
  }
  if (has('video', 'edit', 'reel', 'short')) {
    return `**Video Editing** — reels, shorts, and long-form edits with motion graphics, captions, and sound design. Pricing is coming soon; tell us about your project on the contact page.`;
  }
  if (has('social', 'instagram', 'smm', 'manage')) {
    return `**Social Media Management** — strategy, content calendar, posting & scheduling, community management, and monthly analytics. Pricing coming soon — enquire via the contact page.`;
  }
  if (has('brand deal', 'sponsor', 'collab', 'partnership', 'brand')) {
    return `**Brand Deals** — we connect creators with brands and manage partnerships from outreach to negotiation, campaigns, and reporting. Enquire via the contact page.`;
  }
  if (has('content', 'photo', 'graphic')) {
    return `**Content Creation** — photo & video shoots, graphic design, content strategy, and branded templates. Pricing coming soon — let's chat on the contact page.`;
  }
  if (has('website', 'web ', 'site', 'landing', 'domain', 'develop')) {
    return `**Website Design** is ready to book:\n- Starter — ₹20,000 (domain + landing page)\n- Most Picked — ₹45,000 (full-stack, end-to-end + data)\n- Premium — ₹75,000+ (custom)\n\nWe've shipped sites like RK Photoshoppy, Pratarasah, and Varalakshmi Tiffins. Start one via the contact page.`;
  }
  if (has('ai', 'automation', 'chatbot', 'bot')) {
    return `**AI Automations** — chatbots, lead-capture flows, and AI integrations that save hours every week. Enquire on the contact page.`;
  }
  if (has('contact', 'email', 'reach', 'phone', 'call', 'talk', 'hire')) {
    return `Reach TheSevenZ at **agencyx70@gmail.com**, **+91 94914 64007**, or on Instagram [@thesevenzagency](https://www.instagram.com/thesevenzagency/) — or use the contact page and we'll reply within 24 hours.`;
  }
  if (has('team', 'who', 'founder', 'people')) {
    return `We're **TheSevenZ** — a small creative studio in Telangana. The team covers development, content creation, video editing, content management, business, and finance. Meet everyone on the Team page.`;
  }
  if (has('work', 'project', 'portfolio', 'example')) {
    return `Some live work: **RK Photoshoppy** (photo-printing e-commerce), **Pratarasah** (fine-dining), and **Varalakshmi Tiffins** (multi-branch QSR). See more on the Work page.`;
  }
  if (has('hi', 'hello', 'hey', 'yo', 'sup', 'namaste')) {
    return `Hey! I'm the TheSevenZ assistant 👋 We do **content creation, video editing, social media management, brand deals**, plus **website design** and **AI automations**. Ask me about any of them — or our pricing.`;
  }
  return `**TheSevenZ** is a creative studio for content creation, video editing, social media management, and brand deals — plus website design and AI automations. Website pricing starts at ₹20,000; content & social pricing is coming soon. Ask me anything, or reach out via the contact page.`;
}

export async function POST(request) {
  let messages = [];
  try {
    ({ messages = [] } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m?.role === 'user')?.content || '';
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // No key configured → answer from local knowledge instead of erroring.
  if (!key || key.startsWith('PASTE_') || key.startsWith('AQ.')) {
    return Response.json({ reply: fallbackAnswer(lastUser), fallback: true });
  }

  const contents = messages
    .filter((m) => m && m.content)
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: String(m.content) }] }));

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim();

    if (!res.ok || !reply) {
      // Quota/auth/empty → graceful local answer, not an error bubble.
      return Response.json({ reply: fallbackAnswer(lastUser), fallback: true });
    }
    return Response.json({ reply });
  } catch {
    return Response.json({ reply: fallbackAnswer(lastUser), fallback: true });
  }
}
