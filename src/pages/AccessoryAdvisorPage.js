import React, { useState } from 'react';

const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY;

const USAGE_TYPES = ['Daily Commute', 'Long Distance Touring', 'Weekend Rides', 'Off-Roading', 'Track / Sport', 'Delivery / Commercial'];
const BUDGETS = ['Under ₹5,000', '₹5,000 – ₹15,000', '₹15,000 – ₹30,000', '₹30,000+'];

async function getAccessories(bikeModel, usage, budget) {
  const prompt = `You are an expert motorcycle accessories advisor for Indian riders.
Bike: ${bikeModel}
Usage: ${usage}
Budget: ${budget}

Recommend accessories in this exact JSON format (no markdown):
{
  "helmet": {
    "recommendation": "Specific helmet model and brand",
    "price": "₹X,XXX – ₹X,XXX",
    "reason": "why this helmet",
    "safety_rating": "DOT / ISI / ECE"
  },
  "riding_gear": [
    { "item": "item name", "brand": "brand", "price": "price range", "tip": "tip" }
  ],
  "bike_protection": [
    { "item": "item name", "price": "price", "benefit": "benefit" }
  ],
  "luggage": [
    { "item": "item name", "price": "price", "capacity": "litres or size" }
  ],
  "electronics": [
    { "item": "item name", "price": "price", "feature": "key feature" }
  ],
  "touring_extras": [
    { "item": "item name", "price": "price", "for": "what riding type" }
  ],
  "total_budget_estimate": "₹X,XXX – ₹X,XXX",
  "priority_buy": "The one accessory to buy first",
  "tip": "one expert tip for this bike and usage combination"
}

Focus on accessories available in India, practical for ${usage}.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GROQ_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export default function AccessoryAdvisorPage({ navigate }) {
  const [bikeModel, setBikeModel] = useState('');
  const [usage, setUsage] = useState('');
  const [budget, setBudget] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAdvice = async () => {
    if (!bikeModel.trim() || !usage) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await getAccessories(bikeModel, usage, budget || 'any budget')); }
    catch { setError('Could not fetch recommendations. Try again.'); }
    setLoading(false);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#fbbf24', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    input: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none', boxSizing: 'border-box', marginBottom: 14 },
    usageGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 },
    usageBtn: (active) => ({ padding: '10px 8px', borderRadius: 10, border: `1px solid ${active ? '#fbbf24' : '#2a2a2a'}`, background: active ? '#fbbf2411' : '#1a1a1a', color: active ? '#fbbf24' : '#888', fontWeight: active ? 700 : 400, fontSize: 12, cursor: 'pointer', textAlign: 'center' }),
    budgetRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    budgetBtn: (active) => ({ padding: '7px 12px', borderRadius: 20, border: `1px solid ${active ? '#fbbf24' : '#2a2a2a'}`, background: active ? '#fbbf2411' : '#1a1a1a', color: active ? '#fbbf24' : '#888', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer' }),
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    sectionTitle: { fontSize: 13, fontWeight: 700, color: '#fbbf24', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 },
    itemRow: { background: '#1a1a1a', borderRadius: 10, padding: '10px 12px', marginBottom: 8 },
    itemName: { fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 },
    itemSub: { fontSize: 11, color: '#888' },
    itemPrice: { fontSize: 12, fontWeight: 700, color: '#fbbf24', marginTop: 4 },
    helmetCard: { background: '#fbbf2411', border: '1px solid #fbbf2433', borderRadius: 12, padding: 14, marginBottom: 14 },
    priorityBox: { background: '#fbbf2411', border: '1px solid #fbbf2444', borderRadius: 10, padding: 12, fontSize: 13, color: '#fbbf24', marginBottom: 10 },
    tipBox: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: 12, fontSize: 13, color: '#aaa' },
    errorBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>🎽 AI Accessory Advisor</h1>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Perfect gear recommendations for your bike</p>
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

          {error && <div style={s.errorBox}>{error}</div>}
          <button style={s.btn} onClick={getAdvice} disabled={loading || !bikeModel.trim() || !usage}>
            {loading ? '🎽 Getting Recommendations...' : '🎽 Get Accessory Advice'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎽</div>
            <div style={{ color: '#fbbf24', fontWeight: 600 }}>Curating accessories for your ride...</div>
          </div>
        )}

        {result && (
          <>
            {result.priority_buy && (
              <div style={s.priorityBox}>⭐ <strong>Buy First:</strong> {result.priority_buy}</div>
            )}

            {/* Helmet */}
            {result.helmet && (
              <div style={s.helmetCard}>
                <div style={s.sectionTitle}>🪖 Recommended Helmet</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{result.helmet.recommendation}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{result.helmet.reason}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#00ff88', fontWeight: 600 }}>{result.helmet.safety_rating}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{result.helmet.price}</span>
                </div>
              </div>
            )}

            {/* Riding Gear */}
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

            {/* Protection */}
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

            {/* Luggage */}
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

            {/* Electronics */}
            {result.electronics?.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>📱 Electronics & Gadgets</div>
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

            {/* Total estimate */}
            {result.total_budget_estimate && (
              <div style={{ ...s.card, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total Accessory Budget</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24' }}>{result.total_budget_estimate}</div>
              </div>
            )}

            {result.tip && <div style={s.tipBox}>💡 {result.tip}</div>}
          </>
        )}
      </div>
    </div>
  );
}
