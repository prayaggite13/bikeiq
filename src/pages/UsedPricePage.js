import React, { useState } from 'react';
import { groqJSON } from '../utils/groq';

const CONDITIONS = [
  { id: 'excellent', label: 'Excellent', desc: 'Like new, no scratches', color: 'var(--green)' },
  { id: 'good', label: 'Good', desc: 'Minor wear, well maintained', color: 'var(--accent)' },
  { id: 'fair', label: 'Fair', desc: 'Visible wear, serviced', color: 'var(--yellow)' },
  { id: 'poor', label: 'Poor', desc: 'Damage, needs repair', color: 'var(--accent3)' },
];

const YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);
const IMPACT_COLOR = { Positive: 'var(--green)', Negative: 'var(--accent3)', Neutral: 'var(--yellow)' };

export default function UsedPricePage({ navigate }) {
  const [bikeModel, setBikeModel] = useState('');
  const [year, setYear] = useState('');
  const [km, setKm] = useState('');
  const [condition, setCondition] = useState('');
  const [city, setCity] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const check = async () => {
    if (!bikeModel.trim() || !year || !km || !condition) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await groqJSON(
        'You are an expert used bike valuation specialist for the Indian two-wheeler market. Respond only with valid JSON.',
        `Bike: ${bikeModel}, Year: ${year}, Kilometers: ${km} km, Condition: ${condition}, City: ${city || 'India'}

Return this exact JSON:
{
  "fair_value": "₹75,000",
  "price_range": { "low": "₹65,000", "high": "₹85,000" },
  "depreciation_pct": 35,
  "market_demand": "High",
  "sell_recommendation": "Good time to sell",
  "value_factors": [
    { "factor": "factor name", "impact": "Positive", "detail": "explanation" }
  ],
  "negotiation_tips": ["tip 1", "tip 2", "tip 3"],
  "best_platforms": ["OLX", "BikeWale", "CarDekho"],
  "red_flags_for_buyer": ["flag 1", "flag 2"],
  "service_history_value": "How much service history adds to value",
  "summary": "2-sentence market summary for this bike"
}`
      );
      setResult(data);
    } catch (e) {
      setError('Valuation failed. Check your Groq API key or try again.');
    }
    setLoading(false);
  };

  const demandColor = { High: 'var(--green)', Medium: 'var(--yellow)', Low: 'var(--accent3)' };

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#f472b6', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    input: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', boxSizing: 'border-box', marginBottom: 14 },
    select: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 14, appearance: 'none' },
    condGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 },
    condBtn: (c, active) => ({ padding: '10px 8px', borderRadius: 10, border: `1px solid ${active ? c.color : 'var(--border)'}`, background: active ? `rgba(244,114,182,0.08)` : 'var(--bg2)', cursor: 'pointer', textAlign: 'center' }),
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    priceCard: { background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 16, padding: 20, marginBottom: 14, textAlign: 'center' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 },
    bullet: { display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text2)', alignItems: 'flex-start' },
    dot: { width: 6, height: 6, borderRadius: '50%', background: '#f472b6', marginTop: 5, flexShrink: 0 },
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 },
    errorBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>💰 Used Bike Price Checker</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Get accurate resale value & fair market price</p>
        </div>
      </div>
      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>Bike Model</span>
          <input style={s.input} placeholder="e.g. Royal Enfield Meteor 350, Bajaj Pulsar NS200" value={bikeModel} onChange={e => setBikeModel(e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <span style={s.label}>Year</span>
              <select style={{ ...s.select, marginBottom: 0 }} value={year} onChange={e => setYear(e.target.value)}>
                <option value="">Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <span style={s.label}>Kilometers</span>
              <input style={{ ...s.input, marginBottom: 0 }} type="number" placeholder="e.g. 25000" value={km} onChange={e => setKm(e.target.value)} />
            </div>
          </div>
          <div style={{ height: 14 }} />
          <span style={s.label}>Condition</span>
          <div style={s.condGrid}>
            {CONDITIONS.map(c => (
              <div key={c.id} style={s.condBtn(c, condition === c.id)} onClick={() => setCondition(c.id)}>
                <div style={{ fontSize: 13, fontWeight: 700, color: condition === c.id ? c.color : 'var(--text)', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <span style={s.label}>Your City (optional)</span>
          <input style={s.input} placeholder="e.g. Mumbai, Hyderabad" value={city} onChange={e => setCity(e.target.value)} />
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !bikeModel.trim() || !year || !km || !condition ? 0.6 : 1 }} onClick={check} disabled={loading || !bikeModel.trim() || !year || !km || !condition}>
            {loading ? '💰 Calculating...' : '💰 Check Resale Value'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: '#f472b6', fontWeight: 600 }}>Analysing market value...</div>
          </div>
        )}

        {result && (
          <>
            <div style={s.priceCard}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Fair Market Value</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: '#f472b6', fontFamily: 'Rajdhani,sans-serif' }}>{result.fair_value}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 8 }}>
                Range: <strong style={{ color: '#f472b6' }}>{result.price_range?.low}</strong> — <strong style={{ color: '#f472b6' }}>{result.price_range?.high}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent3)' }}>{result.depreciation_pct}%</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Depreciation</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: demandColor[result.market_demand] || 'var(--yellow)' }}>{result.market_demand}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Market Demand</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center', maxWidth: 80 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>{result.sell_recommendation}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Advice</div>
                </div>
              </div>
            </div>
            {result.summary && <div style={{ ...s.card, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{result.summary}</div>}
            {result.value_factors?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>Value Factors</div>
                {result.value_factors.map((f, i) => (
                  <div key={i} style={s.row}>
                    <span style={{ color: 'var(--text2)' }}>{f.factor}<br /><span style={{ fontSize: 11, color: 'var(--text3)' }}>{f.detail}</span></span>
                    <span style={{ color: IMPACT_COLOR[f.impact] || 'var(--yellow)', fontWeight: 700, fontSize: 12, flexShrink: 0, marginLeft: 8 }}>{f.impact}</span>
                  </div>
                ))}
              </div>
            )}
            {result.negotiation_tips?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>Negotiation Tips</div>
                {result.negotiation_tips.map((t, i) => (
                  <div key={i} style={s.bullet}><div style={s.dot} /><span>{t}</span></div>
                ))}
              </div>
            )}
            {result.red_flags_for_buyer?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>⚠️ Red Flags for Buyers</div>
                {result.red_flags_for_buyer.map((f, i) => (
                  <div key={i} style={{ ...s.bullet, color: 'var(--accent3)' }}>
                    <div style={{ ...s.dot, background: 'var(--accent3)' }} /><span>{f}</span>
                  </div>
                ))}
              </div>
            )}
            {result.best_platforms?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>Best Platforms to Sell</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {result.best_platforms.map((p, i) => (
                    <span key={i} style={{ background: 'rgba(244,114,182,0.08)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{p}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
