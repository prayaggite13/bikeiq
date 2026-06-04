import React, { useState } from 'react';
import { askGemini } from '../utils/gemini';

const BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Ola Electric', 'Ather', 'Revolt'];

export default function ServiceCenterPage({ navigate }) {
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);

  const search = async () => {
  if (!city.trim()) return;

  setLoading(true);
  setError('');
  setResult(null);

  try {
    const systemPrompt =
      'You are a helpful assistant for Indian bike service centers. Respond only with valid JSON. No markdown or explanations.';

    const prompt = `List 5 authorized service centers for ${brand || 'all major brands'} near ${city}, India.

Return this exact JSON:
{
  "centers": [
    {
      "name": "Service center name",
      "brand": "Brand name",
      "address": "Full address with area and city",
      "phone": "Phone number",
      "hours": "Mon-Sat 9AM-6PM",
      "distance": "2.5 km",
      "rating": "4.2",
      "services": ["General Service", "Warranty Repairs", "Spare Parts"]
    }
  ],
  "tip": "one useful tip for visiting service centers in this city"
}

Use realistic Indian service center names and addresses for ${city}.`;

    const response = await askGemini(prompt, systemPrompt);

    const clean = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let data;

    try {
      data = JSON.parse(clean);
    } catch (parseError) {
      console.error(parseError);
      setError('AI returned invalid data. Please try again.');
      setLoading(false);
      return;
    }

    setResult(data);
  } catch (err) {
    console.error(err);
    setError('Search failed. Please try again.');
  }

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
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: 'var(--green)', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    inputRow: { display: 'flex', gap: 8, marginBottom: 12 },
    input: { flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none' },
    gpsBtn: { padding: '12px 14px', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 10, color: 'var(--green)', cursor: 'pointer', fontSize: 18 },
    select: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 16, appearance: 'none' },
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, var(--green), #00aa55)', color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    centerCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 10 },
    centerName: { fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 },
    centerBrand: { fontSize: 11, color: 'var(--green)', fontWeight: 600, marginBottom: 8 },
    info: { fontSize: 12, color: 'var(--text3)', marginBottom: 4 },
    actionRow: { display: 'flex', gap: 8, marginTop: 12 },
    callBtn: { flex: 1, padding: '8px 0', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 8, color: 'var(--green)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    mapBtn: { flex: 1, padding: '8px 0', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center' },
    tipBox: { background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--green)' },
    errorBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>🏪 Service Center Locator</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Find authorized service centers near you</p>
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
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !city.trim() ? 0.6 : 1 }} onClick={search} disabled={loading || !city.trim()}>
            {loading ? '🔍 Searching...' : '🔍 Find Service Centers'}
          </button>
        </div>

        {loading && (
          <div style={{ ...s.card, textAlign: 'center', padding: 40 }}>
            <div className="spinner" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: 'var(--green)', fontWeight: 600 }}>Finding service centers...</div>
          </div>
        )}

        {result && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>Found {result.centers?.length || 0} service centers near {city}</div>
            {result.centers?.map((c, i) => (
              <div key={i} style={s.centerCard}>
                <div style={s.centerName}>{c.name}</div>
                <div style={s.centerBrand}>{c.brand}</div>
                <div style={s.info}>📍 {c.address}</div>
                <div style={s.info}>⏰ {c.hours} · 📏 {c.distance} · ⭐ {c.rating}</div>
                {c.services?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {c.services.map((sv, j) => (
                      <span key={j} style={{ background: 'var(--bg3)', color: 'var(--text3)', fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>{sv}</span>
                    ))}
                  </div>
                )}
                <div style={s.actionRow}>
                  <a href={`tel:${c.phone}`} style={s.callBtn}>📞 Call {c.phone}</a>
                  <div style={s.mapBtn} onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(c.address)}`, '_blank')}>🗺️ Directions</div>
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
