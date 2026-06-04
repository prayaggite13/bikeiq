import React, { useState } from 'react';
import { askGemini } from '../utils/gemini';

const SYMPTOMS = [
  'Loud accident impact', 'Frame damage visible', 'Continuous vibration',
  'Grinding noise from brakes', 'Engine knocking', 'Smoke from engine',
  'Oil leak', 'Suspension bottoming out', 'Wheel wobble', 'Coolant leak',
];

const COND_COLOR = { Critical: '#ff5252', Poor: '#ff6b35', Fair: '#ffd740', Good: '#00e676' };
const RIDE_COLOR = { Safe: '#00e676', 'Ride with Caution': '#ffd740', 'Do NOT Ride': '#ff5252' };

export default function BikeHealthPage({ navigate }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
  if (!input.trim()) return;

  setLoading(true);
  setError('');
  setResult(null);

  try {
    const systemPrompt =
      'You are a senior motorcycle health diagnostic expert in India. Respond only with valid JSON. No markdown or explanations.';

    const prompt = `A user describes this bike damage/issue: "${input}"

Return this exact JSON:

{
  "condition": "Fair",
  "immediate_service": false,
  "safety_to_ride": "Ride with Caution",
  "diagnosis": "2-3 sentence summary of what is likely wrong",
  "affected_systems": ["system 1", "system 2"],
  "recommended_repairs": ["repair 1", "repair 2"],
  "estimated_repair_cost": "₹2,000 – ₹8,000",
  "estimated_time": "2–4 hours",
  "insurance_claimable": false,
  "insurance_tip": "one sentence insurance advice",
  "warning": "most important warning to the user"
}`;

    const response = await askGemini(prompt, systemPrompt);

    const clean = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const data = JSON.parse(clean);

    setResult(data);
  } catch (err) {
    console.error(err);
    setError('Analysis failed. Please try again.');
  }

  setLoading(false);
};

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#ff6b35', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    textarea: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical', minHeight: 90, boxSizing: 'border-box', fontFamily: 'inherit' },
    quickWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 12px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer' },
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #ff6b35, #cc4400)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 12 },
    badge: (val, map) => ({ display: 'inline-block', padding: '4px 14px', borderRadius: 20, background: `${map[val] || '#ffd740'}22`, color: map[val] || '#ffd740', fontWeight: 700, fontSize: 12, border: `1px solid ${map[val] || '#ffd740'}44` }),
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 },
    bullet: { display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text2)', alignItems: 'flex-start' },
    dot: (c) => ({ width: 6, height: 6, borderRadius: '50%', background: c || '#ff6b35', marginTop: 5, flexShrink: 0 }),
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 },
    warnBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginBottom: 12 },
    infoBox: { background: 'rgba(179,136,255,0.08)', border: '1px solid rgba(179,136,255,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--purple)' },
    errorBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>🩺 Bike Health Advisor</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Damage, accident & performance issue analysis</p>
        </div>
      </div>
      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>Common Symptoms</span>
          <div style={s.quickWrap}>
            {SYMPTOMS.map(q => (
              <div key={q} style={s.chip} onClick={() => setInput(p => p ? p + ', ' + q : q)}>{q}</div>
            ))}
          </div>
          <span style={s.label}>Describe the Damage / Issue</span>
          <textarea style={s.textarea} placeholder="e.g. Had a minor accident, front forks feel stiff, bike pulls to the left when braking..." value={input} onChange={e => setInput(e.target.value)} />
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !input.trim() ? 0.6 : 1 }} onClick={analyze} disabled={loading || !input.trim()}>
            {loading ? '🩺 Analyzing...' : '🩺 Analyze Bike Health'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: '#ff6b35', fontWeight: 600 }}>Running health check...</div>
          </div>
        )}

        {result && (
          <>
            <div style={s.card}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={s.badge(result.condition, COND_COLOR)}>{result.condition} Condition</span>
                <span style={s.badge(result.safety_to_ride, RIDE_COLOR)}>{result.safety_to_ride}</span>
                {result.immediate_service && <span style={{ ...s.badge('Critical', COND_COLOR) }}>⚠️ Immediate Service</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{result.diagnosis}</div>
            </div>
            {result.warning && <div style={s.warnBox}>⚠️ <strong>Warning:</strong> {result.warning}</div>}
            <div style={s.card}>
              <span style={s.sectionTitle}>Affected Systems</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.affected_systems?.map((sys, i) => (
                  <span key={i} style={{ background: 'rgba(255,107,53,0.1)', color: '#ff6b35', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{sys}</span>
                ))}
              </div>
            </div>
            <div style={s.card}>
              <span style={s.sectionTitle}>Recommended Repairs</span>
              {result.recommended_repairs?.map((r, i) => (
                <div key={i} style={s.bullet}><div style={s.dot()} /><span>{r}</span></div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.row}><span style={{ color: 'var(--text3)' }}>Estimated Cost</span><span style={{ color: '#ff6b35', fontWeight: 700 }}>{result.estimated_repair_cost}</span></div>
              <div style={{ ...s.row, borderBottom: 'none' }}><span style={{ color: 'var(--text3)' }}>Estimated Time</span><span style={{ color: 'var(--text)' }}>{result.estimated_time}</span></div>
            </div>
            {result.insurance_claimable && <div style={s.infoBox}>🛡️ <strong>Insurance Tip:</strong> {result.insurance_tip}</div>}
          </>
        )}
      </div>
    </div>
  );
}
