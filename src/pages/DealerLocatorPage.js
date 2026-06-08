import React, { useState, useEffect, useRef } from 'react';

const MAPTILER_KEY = process.env.REACT_APP_MAPTILER_KEY;

const BRANDS = [
  'Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha',
  'Suzuki', 'KTM', 'Ola Electric', 'Ather', 'Simple Energy',
  'Revolt', 'BMW', 'Kawasaki', 'Triumph', 'Harley-Davidson',
];

// ── Geocode city via Nominatim (free, no key) ─────────────────────
async function geocodeCity(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ' India')}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  if (!data?.length) throw new Error('City not found. Try a different spelling.');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), displayName: data[0].display_name };
}

// ── Search dealers via Overpass API (real OSM data, free) ─────────
async function searchDealersOverpass(lat, lng, brand) {
  const radius = 15000; // 15km
  const brandKeywords = brand ? [brand.toLowerCase()] : ['bike', 'motorcycle', 'two wheeler', 'scooter'];
  
  // Build Overpass query for motorcycle dealers/shops
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="motorcycle"](around:${radius},${lat},${lng});
      node["amenity"="motorcycle_dealer"](around:${radius},${lat},${lng});
      way["shop"="motorcycle"](around:${radius},${lat},${lng});
      node["shop"="bicycle"]["motorcycle"="yes"](around:${radius},${lat},${lng});
    );
    out body center 20;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
    });
    const data = await res.json();
    return (data.elements || [])
      .filter(e => e.tags?.name)
      .map(e => {
        const elat = e.lat || e.center?.lat;
        const elng = e.lon || e.center?.lon;
        const dist = elat && elng ? distanceKm(lat, lng, elat, elng) : null;
        return {
          name: e.tags.name,
          address: [e.tags['addr:street'], e.tags['addr:city'], e.tags['addr:state']].filter(Boolean).join(', ') || 'Address not listed',
          phone: e.tags.phone || e.tags['contact:phone'] || null,
          hours: e.tags.opening_hours || null,
          website: e.tags.website || e.tags['contact:website'] || null,
          brand: e.tags.brand || e.tags.name,
          lat: elat, lng: elng, distance: dist,
          mapsUrl: `https://www.openstreetmap.org/?mlat=${elat}&mlon=${elng}&zoom=17`,
        };
      })
      .sort((a, b) => (parseFloat(a.distance) || 99) - (parseFloat(b.distance) || 99))
      .slice(0, 8);
  } catch { return []; }
}

// ── Fallback: Groq AI dealers when OSM has no data ────────────────
async function fallbackGroqDealers(city, brand) {
  const key = process.env.REACT_APP_GROQ_API_KEY;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', temperature: 0.3, max_tokens: 800,
      messages: [
        { role: 'system', content: 'You are a bike dealer database for India. Return only valid JSON.' },
        { role: 'user', content: `List 5 authorized ${brand || 'two-wheeler'} dealerships near ${city}, India.
Return ONLY this JSON array:
[{"name":"Dealer name","address":"Full address","phone":"phone","hours":"Mon-Sat 9AM-7PM","distance":"2 km","brand":"${brand || 'Various'}"}]
Use realistic Indian dealer names for ${city}.` }
      ]
    })
  });
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  const start = text.indexOf('['), end = text.lastIndexOf(']');
  if (start === -1) return [];
  return JSON.parse(text.slice(start, end + 1)).map(d => ({ ...d, isAI: true, mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(d.name + ' ' + d.address)}` }));
}

// ── Distance calculation ──────────────────────────────────────────
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
}

// ── MapTiler map component ────────────────────────────────────────
function MapTilerMap({ dealers, center }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !center || !MAPTILER_KEY) return;

    // Load Leaflet CSS + JS dynamically
    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(); return; }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve;
      document.head.appendChild(script);
    });

    loadLeaflet().then(() => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([center.lat, center.lng], 13);
      mapInstance.current = map;

      // MapTiler tiles
      L.tileLayer(
        `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
        { attribution: '© MapTiler © OpenStreetMap', maxZoom: 19 }
      ).addTo(map);

      // Purple markers for dealers
      dealers.forEach((d, i) => {
        if (!d.lat || !d.lng) return;
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:28px;height:28px;border-radius:50%;background:#b388ff;color:#000;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${i+1}</div>`,
          iconSize: [28, 28], iconAnchor: [14, 14],
        });
        L.marker([d.lat, d.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${d.name}</b><br/>${d.address}${d.phone ? `<br/>📞 ${d.phone}` : ''}`);
      });
    });

    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [dealers, center]);

  if (!MAPTILER_KEY) return null;

  return (
    <div ref={mapRef} style={{ width: '100%', height: 240, borderRadius: 14, border: '1px solid var(--border)', marginBottom: 16, overflow: 'hidden', background: 'var(--bg2)' }} />
  );
}

// ── Main component ────────────────────────────────────────────────
export default function DealerLocatorPage({ navigate }) {
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [dealers, setDealers] = useState([]);
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [dataSource, setDataSource] = useState(''); // 'osm' | 'ai'

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setDealers([]); setDataSource('');
    try {
      const coords = await geocodeCity(city);
      setCenter(coords);

      // Try OSM Overpass first
      let results = await searchDealersOverpass(coords.lat, coords.lng, brand);

      if (results.length === 0) {
        // Fallback to Groq AI
        results = await fallbackGroqDealers(city, brand);
        setDataSource('ai');
      } else {
        setDataSource('osm');
      }

      if (results.length === 0) {
        setError(`No dealers found near "${city}". Try a nearby major city.`);
      } else {
        setDealers(results);
      }
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
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
          const det = data.address?.city || data.address?.town || data.address?.state_district || '';
          setCity(det);
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        } catch { setCity('Your location'); }
        setLocating(false);
      },
      () => { setError('GPS not available. Enter city manually.'); setLocating(false); }
    );
  };

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: 'var(--purple)', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    inputRow: { display: 'flex', gap: 8, marginBottom: 12 },
    input: { flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none' },
    gpsBtn: { padding: '12px 14px', background: 'rgba(179,136,255,0.08)', border: '1px solid rgba(179,136,255,0.2)', borderRadius: 10, color: 'var(--purple)', cursor: 'pointer', fontSize: 18 },
    select: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 16 },
    btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg, var(--purple), #7c3aed)', color: '#fff', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
    dealerCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 10 },
    info: { fontSize: 12, color: 'var(--text3)', marginBottom: 4 },
    actionRow: { display: 'flex', gap: 8, marginTop: 12 },
    callBtn: { flex: 1, padding: '8px 0', background: 'rgba(179,136,255,0.08)', border: '1px solid rgba(179,136,255,0.2)', borderRadius: 8, color: 'var(--purple)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
    mapBtn: { flex: 1, padding: '8px 0', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
    errorBox: { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>🏬 Dealer Locator</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Real dealers from OpenStreetMap + AI fallback</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>City or Area</span>
          <div style={s.inputRow}>
            <input style={s.input} placeholder="e.g. Nashik, Andheri Mumbai, Pune" value={city}
              onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
            <button style={s.gpsBtn} onClick={useGPS} title="Use my location">{locating ? '⌛' : '📍'}</button>
          </div>
          <span style={s.label}>Brand (optional)</span>
          <select style={s.select} value={brand} onChange={e => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !city.trim() ? 0.6 : 1 }} onClick={search} disabled={loading || !city.trim()}>
            {loading ? '🔍 Searching...' : '🔍 Find Dealers'}
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} style={{ ...s.dealerCard, height: 100, animation: 'pulse 1.2s ease infinite', animationDelay: `${i * 0.15}s` }} />)}
          </div>
        )}

        {!loading && dealers.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>📍 {dealers.length} dealers found near {city}</div>
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: dataSource === 'osm' ? 'rgba(0,230,118,0.1)' : 'rgba(0,212,255,0.1)', color: dataSource === 'osm' ? 'var(--green)' : 'var(--accent)', fontWeight: 700 }}>
                {dataSource === 'osm' ? '🗺️ OSM Data' : '🤖 AI Generated'}
              </span>
            </div>

            {/* Map */}
            {center && <MapTilerMap dealers={dealers} center={center} />}
            {!MAPTILER_KEY && center && (
              <div style={{ background: 'rgba(255,215,64,0.08)', border: '1px solid rgba(255,215,64,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 12, color: 'var(--yellow)' }}>
                💡 Add <code>REACT_APP_MAPTILER_KEY</code> to Vercel env vars to show the map
              </div>
            )}

            {dealers.map((d, i) => (
              <div key={i} style={s.dealerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ background: 'rgba(179,136,255,0.15)', color: 'var(--purple)', fontSize: 11, fontWeight: 700, width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{d.name}</span>
                      {d.isAI && <span style={{ fontSize: 10, color: 'var(--accent)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>AI</span>}
                    </div>
                    <div style={s.info}>📍 {d.address}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  {d.distance && <span style={{ fontSize: 11, color: 'var(--accent)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '2px 8px' }}>📏 {d.distance} km</span>}
                </div>
                {d.hours && <div style={s.info}>⏰ {d.hours}</div>}
                <div style={s.actionRow}>
                  {d.phone
                    ? <a href={`tel:${d.phone}`} style={s.callBtn}>📞 {d.phone}</a>
                    : <div style={{ ...s.callBtn, opacity: 0.4, cursor: 'default' }}>📞 No number</div>
                  }
                  <div style={s.mapBtn} onClick={() => window.open(d.mapsUrl, '_blank')}>🗺️ Open in Maps</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
