import React, { useState } from 'react';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Ola Electric', 'Ather', 'Revolt'];

async function findServiceCenters(city, brand) {
  const prompt = `You are a helpful assistant for Indian bike service centers.
List 5 authorized service centers for ${brand || 'all major brands'} near ${city}, India.

Respond ONLY in this JSON format (no markdown):
{
  "centers": [
    {
      "name": "Service center name",
      "brand": "Brand name",
      "address": "Full address with area and city",
      "phone": "Phone number",
      "hours": "Working hours",
      "distance": "Approx distance from city center",
      "rating": "X.X",
      "services": ["service 1", "service 2"]
    }
  ],
  "tip": "one useful tip for visiting service centers in this city"
}

Use realistic Indian service center names, addresses and phone numbers for ${city}.`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

export default function ServiceCenterPage({ navigate }) {
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try { setResult(await findServiceCenters(city, brand)); }
    catch { setError('Search failed. Please try again.'); }
    setLoading(false);
  };

  const useGPS = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const detectedCity = data.address?.city || data.address?.town || data.address?.state_district || '';
          setCity(detectedCity);
        } catch { setCity('Your location'); }
        setLocating(false);
      },
      () => { setError('Could not get GPS location.'); setLocating(false); }
    );
  };

  const openMaps = (address) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
  };

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: '#00ff88', background: 'none', border: 'none' },
    title: { fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 },
    sub: { fontSize: 12, color: '#666', margin: 0 },
    container: { padding: 16 },
    card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    inputRow: { display: 'flex', gap: 8, marginBottom: 12 },
    input: { flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none' },
    gpsBtn: { padding: '12px 14px', background: '#00ff8811', border: '1px solid #00ff8844', borderRadius: 10, color: '#00ff88', cursor: 'pointer', fontSize: 18 },
    select: { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, color: '#e0e0e0', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 16, appearance: 'none' },
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, #00ff88, #00aa55)', color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    centerCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, padding: 16, marginBottom: 10 },
    centerName: { fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 },
    centerBrand: { fontSize: 11, color: '#00ff88', fontWeight: 600, marginBottom: 8 },
    centerInfo: { fontSize: 12, color: '#888', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'flex-start' },
    actionRow: { display: 'flex', gap: 8, marginTop: 12 },
    callBtn: { flex: 1, padding: '8px 0', background: '#00ff8811', border: '1px solid #00ff8433', borderRadius: 8, color: '#00ff88', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center' },
    mapBtn: { flex: 1, padding: '8px 0', background: '#00d4ff11', border: '1px solid #00d4ff33', borderRadius: 8, color: '#00d4ff', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center' },
    tipBox: { background: '#00ff8811', border: '1px solid #00ff8833', borderRadius: 10, padding: 12, fontSize: 13, color: '#00ff88' },
    errorBox: { background: '#ff3b3b11', border: '1px solid #ff3b3b33', borderRadius: 10, padding: 12, fontSize: 13, color: '#ff6b6b', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={s.title}>🏪 Service Center Locator</h1>
          <p style={s.sub}>Find authorized service centers near you</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>City or Pincode</span>
          <div style={s.inputRow}>
            <input style={s.input} placeholder="e.g. Mumbai, Pune, 411001" value={city} onChange={e => setCity(e.target.value)} />
            <button style={s.gpsBtn} onClick={useGPS} title="Use my location">{locating ? '⌛' : '📍'}</button>
          </div>

          <span style={s.label}>Filter by Brand (optional)</span>
          <select style={s.select} value={brand} onChange={e => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {error && <div style={s.errorBox}>{error}</div>}
          <button style={s.btn} onClick={search} disabled={loading || !city.trim()}>
            {loading ? '🔍 Searching...' : '🔍 Find Service Centers'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
            <div style={{ color: '#00ff88', fontWeight: 600 }}>Finding service centers...</div>
          </div>
        )}

        {result && (
          <>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
              Found {result.centers?.length || 0} service centers near {city}
            </div>
            {result.centers?.map((c, i) => (
              <div key={i} style={s.centerCard}>
                <div style={s.centerName}>{c.name}</div>
                <div style={s.centerBrand}>{c.brand}</div>
                <div style={s.centerInfo}>📍 {c.address}</div>
                <div style={s.centerInfo}>⏰ {c.hours}</div>
                <div style={s.centerInfo}>📏 {c.distance} &nbsp;·&nbsp; ⭐ {c.rating}</div>
                {c.services?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {c.services.map((sv, j) => (
                      <span key={j} style={{ background: '#1e1e1e', color: '#888', fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>{sv}</span>
                    ))}
                  </div>
                )}
                <div style={s.actionRow}>
                  <a href={`tel:${c.phone}`} style={{ ...s.callBtn, textDecoration: 'none' }}>📞 Call {c.phone}</a>
                  <div style={s.mapBtn} onClick={() => openMaps(c.address)}>🗺️ Directions</div>
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
