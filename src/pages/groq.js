// utils/groq.js
// Shared Groq API helper for BikeIQ+ pages

const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192';

export async function groqJSON(systemPrompt, userPrompt) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no backticks, no explanation. Just raw JSON.',
        },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}
