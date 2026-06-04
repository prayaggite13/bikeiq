import React, { useState } from 'react';

const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY;

const QUICK_ISSUES = [
  'Engine not starting', 'Unusual knocking sound', 'Excessive vibration',
  'Poor fuel efficiency', 'Chain slipping', 'Brakes squeaking',
  'Overheating', 'Oil leaking', 'Clutch slipping', 'Electrical issue',
];

async function diagnose(description) {
  const prompt = `You are an expert Indian motorcycle mechanic with 20+ years of experience.
A user describes this bike problem: "${description}"

Respond in this exact JSON format (no markdown, no extra text):
{
  "likely_causes": ["cause 1", "cause 2", "cause 3"],
  "severity": "Low | Medium | High | Critical",
  "severity_reason": "one sentence why",
  "diy_fixes": ["fix 1", "fix 2"],
  "mechanic_needed": true or false,
  "parts_involved": ["part 1", "part 2"],
  "estimated_cost": "₹X,XXX – ₹X,XXX",
  "urgent_action": "what to do right now if anything",
  "tip": "one expert tip"
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GROQ_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = text.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

const SEV_COLOR = { Low: '#00ff88', Medium: '#fbbf24', High: '#ff6b35', Critical: '#ff3b3b' };

export default function AIMechanicPage({ navigate }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiagnose = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await diagnose(input);
      setResult(r);
    } catch (e) {
      setError('Could not diagnose. Please try again.');
    }
    setLoading(false);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#00d4ff', background: 'none', border: 'none' },
    title: { fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 },
    sub: { fontSize: 12, color: '#666', margin: 0 },
    container: { padding: '16px' },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    textarea: {
      width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10,
      color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none',
      resize: 'vertical', minHeight: 90, boxSizing: 'border-box', fontFamily: 'inherit',
    },
    quickWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, padding: '6px 12px', fontSize: 12, color: '#aaa', cursor: 'pointer' },
    btn: {
      width: '100%', padding: 14, background: 'linear-gradient(135deg, #00d4ff, #0096b3)',
      color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer',
    },
    sevBadge: (sev) => ({
      display: 'inline-block', padding: '4px 12px', borderRadius: 20,
      background: `${SEV_COLOR[sev]}22`, color: SEV_COLOR[sev],
      fontWeight: 700, fontSize: 12, border: `1px solid ${SEV_COLOR[sev]}44`,
    }),
    sectionTitle: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 },
    bullet: { display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#ccc', alignItems: 'flex-start' },
    dot: { width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', marginTop: 5, flexShrink: 0 },
    infoRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a', fontSize: 13 },
    tipBox: { background: '#00d4ff11', border: '1px solid #00d4ff33', borderRadius: 10, padding: 12, fontSize: 13, color: '#00d4ff', marginTop: 4 },
    urgentBox: { background: '#ff6b3511', border: '1px solid #ff6b3544', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b35', marginBottom: 12 },
    errorBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={s.title}>🔧 AI Mechanic</h1>
          <p style={s.sub}>Describe your issue — get an instant diagnosis</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>Quick Select Issue</span>
          <div style={s.quickWrap}>
            {QUICK_ISSUES.map(q => (
              <div key={q} style={s.chip} onClick={() => setInput(q)}>{q}</div>
            ))}
          </div>

          <span style={s.label}>Describe the Problem</span>
          <textarea
            style={s.textarea}
            placeholder="e.g. My bike makes a loud knocking sound when I accelerate above 40 kmph, especially in 3rd gear..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          {error && <div style={s.errorBox}>{error}</div>}
          <div style={{ height: 12 }} />
          <button style={s.btn} onClick={handleDiagnose} disabled={loading || !input.trim()}>
            {loading ? '🔍 Diagnosing...' : '🔧 Diagnose My Bike'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔧</div>
            <div style={{ color: '#00d4ff', fontWeight: 600 }}>Analyzing your issue...</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Consulting AI mechanic</div>
          </div>
        )}

        {result && (
          <>
            {/* Severity */}
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={s.sectionTitle}>Severity</span>
                <span style={s.sevBadge(result.severity)}>{result.severity}</span>
              </div>
              <div style={{ fontSize: 13, color: '#aaa' }}>{result.severity_reason}</div>
            </div>

            {/* Urgent action */}
            {result.urgent_action && result.urgent_action !== 'None' && (
              <div style={s.urgentBox}>⚠️ <strong>Do this now:</strong> {result.urgent_action}</div>
            )}

            {/* Likely causes */}
            <div style={s.card}>
              <div style={s.sectionTitle}>Likely Causes</div>
              {result.likely_causes?.map((c, i) => (
                <div key={i} style={s.bullet}><div style={s.dot} /><span>{c}</span></div>
              ))}
            </div>

            {/* Parts + Cost */}
            <div style={s.card}>
              <div style={s.infoRow}>
                <span style={{ color: '#888' }}>Parts Involved</span>
                <span style={{ color: '#e0e0e0', textAlign: 'right', maxWidth: '60%' }}>{result.parts_involved?.join(', ')}</span>
              </div>
              <div style={{ ...s.infoRow, borderBottom: 'none' }}>
                <span style={{ color: '#888' }}>Estimated Repair Cost</span>
                <span style={{ color: '#00d4ff', fontWeight: 700 }}>{result.estimated_cost}</span>
              </div>
            </div>

            {/* DIY Fixes */}
            {result.diy_fixes?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>DIY Fixes You Can Try</div>
                {result.diy_fixes.map((f, i) => (
                  <div key={i} style={s.bullet}>
                    <div style={{ ...s.dot, background: '#00ff88' }} />
                    <span>{f}</span>
                  </div>
                ))}
                {result.mechanic_needed && (
                  <div style={{ fontSize: 12, color: '#ff6b35', marginTop: 8 }}>
                    ⚠️ Professional mechanic visit recommended regardless
                  </div>
                )}
              </div>
            )}

            {/* Expert tip */}
            {result.tip && (
              <div style={s.tipBox}>💡 <strong>Expert Tip:</strong> {result.tip}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
