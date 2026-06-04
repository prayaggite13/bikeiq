import React, { useState } from 'react';
import { groqJSON } from '../utils/groq';

const QUICK_ISSUES = [
  'Engine not starting', 'Unusual knocking sound', 'Excessive vibration',
  'Poor fuel efficiency', 'Chain slipping', 'Brakes squeaking',
  'Overheating', 'Oil leaking', 'Clutch slipping', 'Electrical issue',
];

const SEV_COLOR = { Low: '#00e676', Medium: '#ffd740', High: '#ff6b35', Critical: '#ff5252' };

export default function AIMechanicPage({ navigate }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDiagnose = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await groqJSON(
        'You are an expert Indian motorcycle mechanic with 20+ years of experience. Always respond with valid JSON only.',
        `A user describes this bike problem: "${input}"

Return this exact JSON structure:
{
  "likely_causes": ["cause 1", "cause 2", "cause 3"],
  "severity": "Low",
  "severity_reason": "one sentence why",
  "diy_fixes": ["fix 1", "fix 2"],
  "mechanic_needed": false,
  "parts_involved": ["part 1", "part 2"],
  "estimated_cost": "₹500 – ₹2,000",
  "urgent_action": "None",
  "tip": "one expert tip"
}`
      );
      setResult(data);
    } catch (e) {
      setError('Diagnosis failed. Check your Groq API key or try again.');
    }
    setLoading(false);
  };

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: 'var(--accent)', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    textarea: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', resize: 'vertical', minHeight: 90, boxSizing: 'border-box', fontFamily: 'inherit' },
    quickWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    chip: { background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 12px', fontSize: 12, color: 'var(--text2)', cursor: 'pointer' },
    btn: { width: '100%', padding: 14, background: 'var(--accent)', color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 12 },
    sevBadge: (sev) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: `${SEV_COLOR[sev] || '#ffd740'}22`, color: SEV_COLOR[sev] || '#ffd740', fontWeight: 700, fontSize: 12, border: `1px solid ${SEV_COLOR[sev] || '#ffd740'}44` }),
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 },
    bullet: { display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text2)', alignItems: 'flex-start' },
    dot: (c) => ({ width: 6, height: 6, borderRadius: '50%', background: c || 'var(--accent)', marginTop: 5, flexShrink: 0 }),
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 },
    tipBox: { background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--accent)' },
    urgentBox: { background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--accent3)', marginBottom: 12 },
    errorBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>🔧 AI Mechanic</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Describe your issue — get an instant diagnosis</p>
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
          <textarea style={s.textarea} placeholder="e.g. My bike makes a loud knocking sound when I accelerate above 40 kmph..." value={input} onChange={e => setInput(e.target.value)} />
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !input.trim() ? 0.6 : 1 }} onClick={handleDiagnose} disabled={loading || !input.trim()}>
            {loading ? '🔍 Diagnosing...' : '🔧 Diagnose My Bike'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: 'var(--accent)', fontWeight: 600 }}>Consulting AI mechanic...</div>
          </div>
        )}

        {result && (
          <>
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={s.sectionTitle}>Severity</span>
                <span style={s.sevBadge(result.severity)}>{result.severity}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{result.severity_reason}</div>
            </div>
            {result.urgent_action && result.urgent_action !== 'None' && (
              <div style={s.urgentBox}>⚠️ <strong>Do this now:</strong> {result.urgent_action}</div>
            )}
            <div style={s.card}>
              <div style={s.sectionTitle}>Likely Causes</div>
              {result.likely_causes?.map((c, i) => (
                <div key={i} style={s.bullet}><div style={s.dot()} /><span>{c}</span></div>
              ))}
            </div>
            <div style={s.card}>
              <div style={s.row}>
                <span style={{ color: 'var(--text3)' }}>Parts Involved</span>
                <span style={{ color: 'var(--text)', textAlign: 'right', maxWidth: '60%' }}>{result.parts_involved?.join(', ')}</span>
              </div>
              <div style={{ ...s.row, borderBottom: 'none' }}>
                <span style={{ color: 'var(--text3)' }}>Estimated Repair Cost</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{result.estimated_cost}</span>
              </div>
            </div>
            {result.diy_fixes?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>DIY Fixes You Can Try</div>
                {result.diy_fixes.map((f, i) => (
                  <div key={i} style={s.bullet}><div style={s.dot('var(--green)')} /><span>{f}</span></div>
                ))}
                {result.mechanic_needed && <div style={{ fontSize: 12, color: 'var(--accent3)', marginTop: 8 }}>⚠️ Professional mechanic visit recommended</div>}
              </div>
            )}
            {result.tip && <div style={s.tipBox}>💡 <strong>Expert Tip:</strong> {result.tip}</div>}
          </>
        )}
      </div>
    </div>
  );
}
