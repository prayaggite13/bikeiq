import React, { useState } from 'react';
import { askGemini } from '../utils/gemini';

const USAGE_TYPES = ['Daily Commute', 'Long Distance Touring', 'Weekend Rides', 'Off-Roading', 'Track / Sport', 'Delivery / Commercial'];
const BUDGETS = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹30,000', '₹30,000+'];

export default function AccessoryAdvisorPage({ navigate }) {
  const [bikeModel, setBikeModel] = useState('');
  const [usage, setUsage] = useState('');
  const [budget, setBudget] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

 const getAdvice = async () => {
  if (!bikeModel.trim() || !usage) return;

  setLoading(true);
  setError('');
  setResult(null);

  try {
    const systemPrompt =
      'You are an expert motorcycle accessories advisor for Indian riders. Respond ONLY with valid JSON. No markdown or explanations.';

    const prompt = `
Bike: ${bikeModel}
Usage: ${usage}
Budget: ${budget || 'any budget'}

Return this exact JSON:

{
  "helmet": {
    "recommendation": "Specific helmet model and brand",
    "price": "₹3,000 – ₹6,000",
    "reason": "why this helmet suits the usage",
    "safety_rating": "ISI / DOT / ECE"
  },
  "riding_gear": [
    {
      "item": "item name",
      "brand": "brand name",
      "price": "₹X,XXX",
      "tip": "short tip"
    }
  ],
  "bike_protection": [
    {
      "item": "item name",
      "price": "₹X,XXX",
      "benefit": "benefit"
    }
  ],
  "luggage": [
    {
      "item": "item name",
      "price": "₹X,XXX",
      "capacity": "size or litres"
    }
  ],
  "electronics": [
    {
      "item": "item name",
      "price": "₹X,XXX",
      "feature": "key feature"
    }
  ],
  "total_budget_estimate": "₹X,XXX – ₹X,XXX",
  "priority_buy": "The single most important accessory to buy first",
  "tip": "one expert tip for this bike and usage combination"
}

Focus on accessories available in India and practical for ${usage}.
`;

    const response = await askGemini(prompt, systemPrompt);

    const clean = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const data = JSON.parse(clean);

    setResult(data);
  } catch (err) {
    console.error(err);
    setError('Could not fetch recommendations. Please try again.');
  }

  setLoading(false);
};


  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: 'var(--yellow)', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    input: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', boxSizing: 'border-box', marginBottom: 14 },
    usageGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 },
    usageBtn: (active) => ({ padding: '10px 8px', borderRadius: 10, border: `1px solid ${active ? 'var(--yellow)' : 'var(--border)'}`, background: active ? 'rgba(255,215,64,0.08)' : 'var(--bg2)', color: active ? 'var(--yellow)' : 'var(--text3)', fontWeight: active ? 700 : 400, fontSize: 12, cursor: 'pointer', textAlign: 'center' }),
    budgetRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    budgetBtn: (active) => ({ padding: '7px 12px', borderRadius: 20, border: `1px solid ${active ? 'var(--yellow)' : 'var(--border)'}`, background: active ? 'rgba(255,215,64,0.08)' : 'var(--bg2)', color: active ? 'var(--yellow)' : 'var(--text3)', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer' }),
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, var(--yellow), #d97706)', color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 },
    itemRow: { background: 'var(--bg2)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 },
    itemName: { fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 },
    itemSub: { fontSize: 11, color: 'var(--text3)' },
    itemPrice: { fontSize: 12, fontWeight: 700, color: 'var(--yellow)', marginTop: 4 },
    helmetCard: { background: 'rgba(255,215,64,0.06)', border: '1px solid rgba(255,215,64,0.2)', borderRadius: 12, padding: 14, marginBottom: 14 },
    priorityBox: { background: 'rgba(255,215,64,0.08)', border: '1px solid rgba(255,215,64,0.25)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--yellow)', marginBottom: 10 },
    tipBox: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--text2)' },
    errorBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>🎽 AI Accessory Advisor</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Perfect gear recommendations for your bike</p>
        </div>
      </div>
      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>Bike Model</span>
          <input style={s.input} placeholder="e.g. Royal Enfield Classic 350, Honda Activa 6G" value={bikeModel} onChange={e => setBikeModel(e.target.value)} />
          <span style={s.label}>Riding Style</span>
          <div style={s.usageGrid}>
            {USAGE_TYPES.map(u => (
              <div key={u} style={s.usageBtn(usage === u)} onClick={() => setUsage(u)}>{u}</div>
            ))}
          </div>
          <span style={s.label}>Budget (optional)</span>
          <div style={s.budgetRow}>
            {BUDGETS.map(b => (
              <div key={b} style={s.budgetBtn(budget === b)} onClick={() => setBudget(b === budget ? '' : b)}>{b}</div>
            ))}
          </div>
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !bikeModel.trim() || !usage ? 0.6 : 1 }} onClick={getAdvice} disabled={loading || !bikeModel.trim() || !usage}>
            {loading ? '🎽 Getting Recommendations...' : '🎽 Get Accessory Advice'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: 'var(--yellow)', fontWeight: 600 }}>Curating accessories...</div>
          </div>
        )}

        {result && (
          <>
            {result.priority_buy && <div style={s.priorityBox}>⭐ <strong>Buy First:</strong> {result.priority_buy}</div>}
            {result.helmet && (
              <div style={s.helmetCard}>
                <div style={s.sectionTitle}>🪖 Recommended Helmet</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{result.helmet.recommendation}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>{result.helmet.reason}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{result.helmet.safety_rating}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--yellow)' }}>{result.helmet.price}</span>
                </div>
              </div>
            )}
            {result.riding_gear?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>🧥 Riding Gear</div>
                {result.riding_gear.map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={s.itemName}>{item.item}</div>
                      <div style={s.itemPrice}>{item.price}</div>
                    </div>
                    <div style={s.itemSub}>{item.brand} · {item.tip}</div>
                  </div>
                ))}
              </div>
            )}
            {result.bike_protection?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>🛡️ Bike Protection</div>
                {result.bike_protection.map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={s.itemName}>{item.item}</div>
                      <div style={s.itemPrice}>{item.price}</div>
                    </div>
                    <div style={s.itemSub}>{item.benefit}</div>
                  </div>
                ))}
              </div>
            )}
            {result.luggage?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>🎒 Luggage</div>
                {result.luggage.map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={s.itemName}>{item.item}</div>
                      <div style={s.itemPrice}>{item.price}</div>
                    </div>
                    <div style={s.itemSub}>{item.capacity}</div>
                  </div>
                ))}
              </div>
            )}
            {result.electronics?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>📱 Electronics</div>
                {result.electronics.map((item, i) => (
                  <div key={i} style={s.itemRow}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={s.itemName}>{item.item}</div>
                      <div style={s.itemPrice}>{item.price}</div>
                    </div>
                    <div style={s.itemSub}>{item.feature}</div>
                  </div>
                ))}
              </div>
            )}
            {result.total_budget_estimate && (
              <div style={{ ...s.card, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Total Accessory Budget</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--yellow)', fontFamily: 'Rajdhani,sans-serif' }}>{result.total_budget_estimate}</div>
              </div>
            )}
            {result.tip && <div style={s.tipBox}>💡 {result.tip}</div>}
          </>
        )}
      </div>
    </div>
  );
}
