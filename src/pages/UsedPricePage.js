import React, { useState } from 'react';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const CONDITIONS = [
  { id: 'excellent', label: 'Excellent', desc: 'Like new, no scratches', color: '#00ff88' },
  { id: 'good', label: 'Good', desc: 'Minor wear, well maintained', color: '#00d4ff' },
  { id: 'fair', label: 'Fair', desc: 'Visible wear, serviced', color: '#fbbf24' },
  { id: 'poor', label: 'Poor', desc: 'Damage, needs repair', color: '#ff6b35' },
];

const YEARS = Array.from({ length: 15 }, (_, i) => 2025 - i);

async function checkPrice(bikeModel, year, km, condition, city) {
  const prompt = `You are an expert used bike valuation specialist for the Indian two-wheeler market.

Bike: ${bikeModel}
Year: ${year}
Kilometers: ${km} km
Condition: ${condition}
City: ${city || 'India'}

Provide used bike valuation in this exact JSON format (no markdown):
{
  "fair_value": "₹X,XX,XXX",
  "price_range": { "low": "₹X,XX,XXX", "high": "₹X,XX,XXX" },
  "depreciation_pct": XX,
  "market_demand": "High | Medium | Low",
  "sell_recommendation": "Good time to sell | Wait 3-6 months | Sell quickly",
  "value_factors": [
    { "factor": "factor name", "impact": "Positive | Negative | Neutral", "detail": "explanation" }
  ],
  "negotiation_tips": ["tip 1", "tip 2", "tip 3"],
  "best_platforms": ["platform 1", "platform 2"],
  "red_flags_for_buyer": ["flag 1", "flag 2"],
  "service_history_value": "How much service history adds to value",
  "summary": "2-sentence market summary for this bike"
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

const IMPACT_COLOR = { Positive: '#00ff88', Negative: '#ff6b35', Neutral: '#fbbf24' };

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
    try { setResult(await checkPrice(bikeModel, year, km, condition, city)); }
    catch { setError('Valuation failed. Please try again.'); }
    setLoading(false);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#f472b6', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    input: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none', boxSizing: 'border-box', marginBottom: 14 },
    select: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 14, appearance: 'none' },
    condGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 },
    condBtn: (c, active) => ({ padding: '10px 8px', borderRadius: 10, border: `1px solid ${active ? c.color : '#2a2a2a'}`, background: active ? `${c.color}11` : '#1a1a1a', cursor: 'pointer', textAlign: 'center' }),
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    priceCard: { background: '#f472b611', border: '1px solid #f472b633', borderRadius: 16, padding: 20, marginBottom: 14, textAlign: 'center' },
    fairVal: { fontSize: 34, fontWeight: 900, color: '#f472b6', lineHeight: 1 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #1a1a1a', fontSize: 13 },
    bullet: { display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#ccc', alignItems: 'flex-start' },
    dot: { width: 6, height: 6, borderRadius: '50%', background: '#f472b6', marginTop: 5, flexShrink: 0 },
    sectionTitle: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 },
    errorBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b', marginTop: 8 },
  };

  const demandColor = { High: '#00ff88', Medium: '#fbbf24', Low: '#ff6b35' };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>💰 Used Bike Price Checker</h1>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Get accurate resale value & fair market price</p>
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
                <option value="">Select Year</option>
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
                <div style={{ fontSize: 13, fontWeight: 700, color: condition === c.id ? c.color : '#e0e0e0', marginBottom: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{c.desc}</div>
              </div>
            ))}
          </div>

          <span style={s.label}>Your City (optional)</span>
          <input style={s.input} placeholder="e.g. Mumbai, Hyderabad" value={city} onChange={e => setCity(e.target.value)} />

          {error && <div style={s.errorBox}>{error}</div>}
          <button style={s.btn} onClick={check} disabled={loading || !bikeModel.trim() || !year || !km || !condition}>
            {loading ? '💰 Calculating...' : '💰 Check Resale Value'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💰</div>
            <div style={{ color: '#f472b6', fontWeight: 600 }}>Analysing market value...</div>
          </div>
        )}

        {result && (
          <>
            <div style={s.priceCard}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Fair Market Value</div>
              <div style={s.fairVal}>{result.fair_value}</div>
              <div style={{ fontSize: 13, color: '#aaa', marginTop: 8 }}>
                Range: <strong style={{ color: '#f472b6' }}>{result.price_range?.low}</strong> — <strong style={{ color: '#f472b6' }}>{result.price_range?.high}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ff6b35' }}>{result.depreciation_pct}%</div>
                  <div style={{ fontSize: 11, color: '#666' }}>Depreciation</div>
                </div>
                <div style={{ width: 1, background: '#2a2a2a' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: demandColor[result.market_demand] || '#fbbf24' }}>{result.market_demand}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>Market Demand</div>
                </div>
                <div style={{ width: 1, background: '#2a2a2a' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#00ff88', maxWidth: 80 }}>{result.sell_recommendation}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>Advice</div>
                </div>
              </div>
            </div>

            {result.summary && (
              <div style={{ ...s.card, fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>{result.summary}</div>
            )}

            {result.value_factors?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>Value Factors</div>
                {result.value_factors.map((f, i) => (
                  <div key={i} style={s.row}>
                    <span style={{ color: '#ccc' }}>{f.factor}<br /><span style={{ fontSize: 11, color: '#666' }}>{f.detail}</span></span>
                    <span style={{ color: IMPACT_COLOR[f.impact], fontWeight: 700, fontSize: 12, flexShrink: 0, marginLeft: 8 }}>{f.impact}</span>
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
                  <div key={i} style={{ ...s.bullet, color: '#ff6b35' }}>
                    <div style={{ ...s.dot, background: '#ff6b35' }} /><span>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {result.best_platforms?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>Best Platforms to Sell</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {result.best_platforms.map((p, i) => (
                    <span key={i} style={{ background: '#f472b611', color: '#f472b6', border: '1px solid #f472b633', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{p}</span>
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
