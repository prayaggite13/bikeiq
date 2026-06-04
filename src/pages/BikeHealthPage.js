import React, { useState } from 'react';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const SYMPTOMS = [
  'Loud accident impact', 'Frame damage visible', 'Continuous vibration',
  'Grinding noise from brakes', 'Engine knocking', 'Smoke from engine',
  'Oil leak', 'Coolant leak', 'Suspension bottoming out', 'Wheel wobble',
];

async function analyzeHealth(description) {
  const prompt = `You are a senior motorcycle health diagnostic expert in India.
A user describes this bike damage/issue: "${description}"

Respond ONLY in this JSON format (no markdown):
{
  "condition": "Critical | Poor | Fair | Good",
  "immediate_service": true or false,
  "safety_to_ride": "Safe | Ride with Caution | Do NOT Ride",
  "diagnosis": "2-3 sentence summary of what is likely wrong",
  "affected_systems": ["system 1", "system 2"],
  "recommended_repairs": ["repair 1", "repair 2", "repair 3"],
  "estimated_repair_cost": "₹X,XXX – ₹X,XXX",
  "estimated_time": "X–Y hours / days",
  "insurance_claimable": true or false,
  "insurance_tip": "one sentence insurance advice",
  "warning": "most important warning to the user"
}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

const COND_COLOR = { Critical: '#ff3b3b', Poor: '#ff6b35', Fair: '#fbbf24', Good: '#00ff88' };
const RIDE_COLOR = { Safe: '#00ff88', 'Ride with Caution': '#fbbf24', 'Do NOT Ride': '#ff3b3b' };

export default function BikeHealthPage({ navigate }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await analyzeHealth(input)); }
    catch { setError('Analysis failed. Please try again.'); }
    setLoading(false);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#ff6b35', background: 'none', border: 'none' },
    title: { fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 },
    sub: { fontSize: 12, color: '#666', margin: 0 },
    container: { padding: 16 },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    textarea: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical', minHeight: 90, boxSizing: 'border-box', fontFamily: 'inherit' },
    quickWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 20, padding: '6px 12px', fontSize: 12, color: '#aaa', cursor: 'pointer' },
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #ff6b35, #cc4400)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    badge: (val, colorMap) => ({ display: 'inline-block', padding: '4px 14px', borderRadius: 20, background: `${colorMap[val]}22`, color: colorMap[val], fontWeight: 700, fontSize: 12, border: `1px solid ${colorMap[val]}44` }),
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #1a1a1a', fontSize: 13 },
    bullet: { display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#ccc', alignItems: 'flex-start' },
    dot: (c) => ({ width: 6, height: 6, borderRadius: '50%', background: c || '#ff6b35', marginTop: 5, flexShrink: 0 }),
    warnBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b' },
    infoBox: { background: '#a855f711', border: '1px solid #a855f733', borderRadius: 10, padding: 12, fontSize: 13, color: '#a855f7' },
    errorBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={s.title}>🩺 Bike Health Advisor</h1>
          <p style={s.sub}>Damage, accident & performance issue analysis</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>Common Symptoms</span>
          <div style={s.quickWrap}>
            {SYMPTOMS.map(q => (
              <div key={q} style={s.chip} onClick={() => setInput(prev => prev ? prev + ', ' + q : q)}>{q}</div>
            ))}
          </div>
          <span style={s.label}>Describe the Damage / Issue</span>
          <textarea style={s.textarea} placeholder="e.g. Had a minor accident yesterday, front forks feel stiff, bike pulls to the left when braking, vibration at 60 kmph..." value={input} onChange={e => setInput(e.target.value)} />
          {error && <div style={s.errorBox}>{error}</div>}
          <div style={{ height: 12 }} />
          <button style={s.btn} onClick={analyze} disabled={loading || !input.trim()}>
            {loading ? '🩺 Analyzing...' : '🩺 Analyze Bike Health'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🩺</div>
            <div style={{ color: '#ff6b35', fontWeight: 600 }}>Running health check...</div>
          </div>
        )}

        {result && (
          <>
            <div style={s.card}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={s.badge(result.condition, COND_COLOR)}>{result.condition} Condition</span>
                <span style={s.badge(result.safety_to_ride, RIDE_COLOR)}>{result.safety_to_ride}</span>
                {result.immediate_service && <span style={{ ...s.badge('Critical', COND_COLOR), background: '#ff3b3b22' }}>⚠️ Immediate Service</span>}
              </div>
              <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>{result.diagnosis}</div>
            </div>

            {result.warning && (
              <div style={s.warnBox}>⚠️ <strong>Warning:</strong> {result.warning}</div>
            )}
            <div style={{ height: 12 }} />

            <div style={s.card}>
              <span style={s.label}>Affected Systems</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.affected_systems?.map((sys, i) => (
                  <span key={i} style={{ background: '#ff6b3511', color: '#ff6b35', border: '1px solid #ff6b3533', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{sys}</span>
                ))}
              </div>
            </div>

            <div style={s.card}>
              <span style={s.label}>Recommended Repairs</span>
              {result.recommended_repairs?.map((r, i) => (
                <div key={i} style={s.bullet}><div style={s.dot('#ff6b35')} /><span>{r}</span></div>
              ))}
            </div>

            <div style={s.card}>
              <div style={s.row}><span style={{ color: '#888' }}>Estimated Cost</span><span style={{ color: '#ff6b35', fontWeight: 700 }}>{result.estimated_repair_cost}</span></div>
              <div style={{ ...s.row, borderBottom: 'none' }}><span style={{ color: '#888' }}>Estimated Time</span><span style={{ color: '#e0e0e0' }}>{result.estimated_time}</span></div>
            </div>

            {result.insurance_claimable && (
              <div style={s.infoBox}>🛡️ <strong>Insurance Tip:</strong> {result.insurance_tip}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
