// Server-side AI proxy — the API key stays here and is never sent to the browser.
export const runtime = 'nodejs';

const SYSTEM = `You are the TheSevenZ assistant — a friendly creative studio with a minimal black/red aesthetic.
TheSevenZ offers content creation, video editing, social media management, and brand deals, plus website design and AI automations.
Website design pricing (ready to book): Starter Pack ₹20,000 one-time (domain + basic landing page); Most Picked ₹45,000 one-time (domain + full-stack, end-to-end with data, +₹2,000/month maintenance only if changes are needed); Premium from ₹75,000+ custom (for agencies, brands, and e-commerce, scoped to requirements).
Content & social packages (content creation, video editing, social media management, brand deals) are "coming soon" — pricing not finalised, so invite the visitor to enquire via the contact page for early-bird rates.
Based in Telangana, India; replies within 24 hours. Real web projects: RK Photoshoppy (photo-printing e-commerce), Pratarasah (fine-dining), Varalakshmi Tiffins (QSR chain).
Answer concisely and helpfully. Encourage visitors to use the contact page for enquiries.`;

export async function POST(request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json({ error: 'Server is missing GEMINI_API_KEY.' }, { status: 500 });
  }

  let messages = [];
  try {
    ({ messages = [] } = await request.json());
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const contents = messages
    .filter((m) => m && m.content)
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content) }],
    }));

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error?.message || `AI request failed (${res.status})`;
      return Response.json({ error: msg }, { status: res.status });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() ||
      "Sorry — I couldn't generate a response. Try rephrasing?";
    return Response.json({ reply });
  } catch (e) {
    return Response.json({ error: 'Network error reaching the AI provider.' }, { status: 502 });
  }
}
