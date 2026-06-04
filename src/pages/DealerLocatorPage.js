import React, { useState } from 'react';

const GROQ_KEY = process.env.REACT_APP_GROQ_API_KEY;

const BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Ola Electric', 'Ather', 'Simple Energy', 'Revolt', 'BMW', 'Kawasaki', 'Triumph', 'Harley-Davidson'];

async function findDealers(city, brand) {
  const prompt = `You are a helpful assistant for Indian bike dealerships.
List 5 authorized ${brand || 'two-wheeler'} dealerships near ${city}, India.

Respond ONLY in this JSON format (no markdown):
{
  "dealers": [
    {
      "name": "Dealership name",
      "brand": "Brand",
      "address": "Full address",
      "phone": "Phone number",
      "hours": "Working hours",
      "distance": "Approx km from city center",
      "rating": "X.X",
      "offers": ["offer or feature 1", "offer or feature 2"],
      "test_ride": true or false
    }
  ],
  "tip": "one useful tip for visiting bike dealers in this city"
}

Use realistic Indian dealership names and addresses for ${city}.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GROQ_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export default function DealerLocatorPage({ navigate }) {
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await findDealers(city, brand)); }
    catch { setError('Search failed. Please try again.'); }
    setLoading(false);
  };

  const useGPS = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
          const data = await res.json();
          setCity(data.address?.city || data.address?.town || data.address?.state_district || '');
        } catch { setCity('Your location'); }
        setLocating(false);
      },
      () => { setError('GPS not available.'); setLocating(false); }
    );
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#a855f7', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    inputRow: { display: 'flex', gap: 8, marginBottom: 12 },
    input: { flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none' },
    gpsBtn: { padding: '12px 14px', background: '#a855f711', border: '1px solid #a855f744', borderRadius: 10, color: '#a855f7', cursor: 'pointer', fontSize: 18 },
    select: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 16, appearance: 'none' },
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    dealerCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 16, marginBottom: 10 },
    dealerName: { fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 },
    brandBadge: { display: 'inline-block', background: '#a855f711', color: '#a855f7', border: '1px solid #a855f733', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, marginBottom: 8 },
    info: { fontSize: 12, color: '#888', marginBottom: 4 },
    testRideBadge: { background: '#00ff8811', color: '#00ff88', border: '1px solid #00ff8833', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 },
    actionRow: { display: 'flex', gap: 8, marginTop: 12 },
    callBtn: { flex: 1, padding: '8px 0', background: '#a855f711', border: '1px solid #a855f733', borderRadius: 8, color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    mapBtn: { flex: 1, padding: '8px 0', background: '#00d4ff11', border: '1px solid #00d4ff33', borderRadius: 8, color: '#00d4ff', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center' },
    tipBox: { background: '#a855f711', border: '1px solid #a855f733', borderRadius: 10, padding: 12, fontSize: 13, color: '#a855f7' },
    errorBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>🏬 Dealer Locator</h1>
          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Find authorized dealerships near you</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>City or Pincode</span>
          <div style={s.inputRow}>
            <input style={s.input} placeholder="e.g. Bangalore, Delhi, 400001" value={city} onChange={e => setCity(e.target.value)} />
            <button style={s.gpsBtn} onClick={useGPS}>{locating ? '⌛' : '📍'}</button>
          </div>

          <span style={s.label}>Brand</span>
          <select style={s.select} value={brand} onChange={e => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {error && <div style={s.errorBox}>{error}</div>}
          <button style={s.btn} onClick={search} disabled={loading || !city.trim()}>
            {loading ? '🔍 Searching...' : '🔍 Find Dealers'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏬</div>
            <div style={{ color: '#a855f7', fontWeight: 600 }}>Finding dealers...</div>
          </div>
        )}

        {result && (
          <>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
              Found {result.dealers?.length || 0} dealers near {city}
            </div>
            {result.dealers?.map((d, i) => (
              <div key={i} style={s.dealerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={s.dealerName}>{d.name}</div>
                  {d.test_ride && <span style={s.testRideBadge}>Test Ride ✓</span>}
                </div>
                <div style={s.brandBadge}>{d.brand}</div>
                <div style={s.info}>📍 {d.address}</div>
                <div style={s.info}>⏰ {d.hours} &nbsp;·&nbsp; 📏 {d.distance} &nbsp;·&nbsp; ⭐ {d.rating}</div>
                {d.offers?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {d.offers.map((o, j) => (
                      <span key={j} style={{ background: '#1e1e1e', color: '#888', fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>{o}</span>
                    ))}
                  </div>
                )}
                <div style={s.actionRow}>
                  <a href={`tel:${d.phone}`} style={s.callBtn}>📞 {d.phone}</a>
                  <div style={s.mapBtn} onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(d.address)}`, '_blank')}>🗺️ Directions</div>
                </div>
              </div>
            ))}
            {result.tip && <div style={s.tipBox}>💡 {result.tip}</div>}
          </>
        )}
      </div>
    </div>
  );
}
