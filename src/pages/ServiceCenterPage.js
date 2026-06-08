import React, { useState, useEffect, useRef } from 'react';

const MAPTILER_KEY = process.env.REACT_APP_MAPTILER_KEY;
const BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Ola Electric', 'Ather', 'Revolt'];

async function geocodeCity(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ' India')}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  if (!data?.length) throw new Error('City not found. Try a different spelling.');
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function searchServiceCentersOverpass(lat, lng) {
  const query = `
    [out:json][timeout:25];
    (
      node["shop"="motorcycle"](around:15000,${lat},${lng});
      node["amenity"="motorcycle_service"](around:15000,${lat},${lng});
      node["service"="motorcycle_repair"](around:15000,${lat},${lng});
      way["shop"="motorcycle"](around:15000,${lat},${lng});
    );
    out body center 20;
  `;
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query });
    const data = await res.json();
    return (data.elements || [])
      .filter(e => e.tags?.name)
      .map(e => {
        const elat = e.lat || e.center?.lat;
        const elng = e.lon || e.center?.lon;
        return {
          name: e.tags.name,
          address: [e.tags['addr:street'], e.tags['addr:city']].filter(Boolean).join(', ') || 'Address not listed',
          phone: e.tags.phone || e.tags['contact:phone'] || null,
          hours: e.tags.opening_hours || null,
          brand: e.tags.brand || null,
          lat: elat, lng: elng,
          distance: elat && elng ? distKm(lat, lng, elat, elng) : null,
          mapsUrl: `https://www.openstreetmap.org/?mlat=${elat}&mlon=${elng}&zoom=17`,
        };
      })
      .sort((a, b) => (parseFloat(a.distance) || 99) - (parseFloat(b.distance) || 99))
      .slice(0, 8);
  } catch { return []; }
}

async function fallbackGroqCenters(city, brand) {
  const key = process.env.REACT_APP_GROQ_API_KEY;
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant', temperature: 0.3, max_tokens: 800,
      messages: [
        { role: 'system', content: 'You are a bike service center database for India. Return only valid JSON.' },
        { role: 'user', content: `List 5 authorized ${brand || 'two-wheeler'} service centers near ${city}, India.
Return ONLY this JSON array:
[{"name":"Center name","address":"Full address","phone":"phone","hours":"Mon-Sat 9AM-6PM","distance":"2 km","brand":"${brand || 'Multi-brand'}","services":["General Service","Warranty Repairs"]}]` }
      ]
    })
  });
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  const start = text.indexOf('['), end = text.lastIndexOf(']');
  if (start === -1) return [];
  return JSON.parse(text.slice(start, end + 1)).map(d => ({ ...d, isAI: true, mapsUrl: `https://www.google.com/maps/search/${encodeURIComponent(d.name + ' ' + d.address)}` }));
}

function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return (R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1);
}

function MapTilerMap({ centers, center }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !center || !MAPTILER_KEY) return;
    const loadLeaflet = () => new Promise((resolve) => {
      if (window.L) { resolve(); return; }
      const link = document.createElement('link'); link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = resolve; document.head.appendChild(script);
    });
    loadLeaflet().then(() => {
      if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }
      const L = window.L;
      const map = L.map(mapRef.current).setView([center.lat, center.lng], 13);
      mapInst.current = map;
      L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, { attribution: '© MapTiler © OpenStreetMap', maxZoom: 19 }).addTo(map);
      centers.forEach((c, i) => {
        if (!c.lat || !c.lng) return;
        const icon = L.divIcon({ className: '', html: `<div style="width:28px;height:28px;border-radius:50%;background:#00e676;color:#000;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)">${i+1}</div>`, iconSize: [28,28], iconAnchor: [14,14] });
        L.marker([c.lat, c.lng], { icon }).addTo(map).bindPopup(`<b>${c.name}</b><br/>${c.address}${c.phone ? `<br/>📞 ${c.phone}` : ''}`);
      });
    });
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
  }, [centers, center]);

  if (!MAPTILER_KEY) return null;
  return <div ref={mapRef} style={{ width:'100%', height:240, borderRadius:14, border:'1px solid var(--border)', marginBottom:16, overflow:'hidden', background:'var(--bg2)' }} />;
}

export default function ServiceCenterPage({ navigate }) {
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [centers, setCenters] = useState([]);
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locating, setLocating] = useState(false);
  const [dataSource, setDataSource] = useState('');

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setCenters([]); setDataSource('');
    try {
      const coords = await geocodeCity(city);
      setCenter(coords);
      let results = await searchServiceCentersOverpass(coords.lat, coords.lng);
      if (results.length === 0) {
        results = await fallbackGroqCenters(city, brand);
        setDataSource('ai');
      } else {
        setDataSource('osm');
      }
      if (results.length === 0) { setError(`No service centers found near "${city}". Try a nearby major city.`); }
      else setCenters(results);
    } catch (err) { setError(err.message || 'Search failed.'); }
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
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        } catch { setCity('Your location'); }
        setLocating(false);
      },
      () => { setError('GPS not available.'); setLocating(false); }
    );
  };

  const s = {
    page: { minHeight:'100vh', background:'var(--bg)', color:'var(--text)', paddingBottom:100 },
    header: { padding:'20px 16px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 },
    back: { fontSize:20, cursor:'pointer', color:'var(--green)', background:'none', border:'none' },
    container: { padding:16 },
    card: { background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:16, padding:18, marginBottom:14 },
    label: { fontSize:11, fontWeight:700, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:8, display:'block' },
    inputRow: { display:'flex', gap:8, marginBottom:12 },
    input: { flex:1, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)', fontSize:14, padding:'12px 14px', outline:'none' },
    gpsBtn: { padding:'12px 14px', background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)', borderRadius:10, color:'var(--green)', cursor:'pointer', fontSize:18 },
    select: { width:'100%', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)', fontSize:14, padding:'12px 14px', outline:'none', marginBottom:16 },
    btn: { width:'100%', padding:14, background:'linear-gradient(135deg, var(--green), #00aa55)', color:'#000', fontWeight:700, fontSize:15, borderRadius:12, border:'none', cursor:'pointer', fontFamily:'inherit' },
    centerCard: { background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:14, padding:16, marginBottom:10 },
    info: { fontSize:12, color:'var(--text3)', marginBottom:4 },
    actionRow: { display:'flex', gap:8, marginTop:12 },
    callBtn: { flex:1, padding:'8px 0', background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)', borderRadius:8, color:'var(--green)', fontSize:12, fontWeight:600, cursor:'pointer', textAlign:'center', textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:4 },
    mapBtn: { flex:1, padding:'8px 0', background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:8, color:'var(--accent)', fontSize:12, fontWeight:600, cursor:'pointer', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:4 },
    errorBox: { background:'rgba(255,82,82,0.08)', border:'1px solid rgba(255,82,82,0.2)', borderRadius:10, padding:12, fontSize:13, color:'var(--red)', marginTop:8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:'var(--text)', margin:0, fontFamily:'Rajdhani,sans-serif' }}>🏪 Service Center Locator</h1>
          <p style={{ fontSize:12, color:'var(--text3)', margin:0 }}>Real centers from OpenStreetMap + AI fallback</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>City or Area</span>
          <div style={s.inputRow}>
            <input style={s.input} placeholder="e.g. Mumbai, Pune, Nashik" value={city}
              onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
            <button style={s.gpsBtn} onClick={useGPS}>{locating ? '⌛' : '📍'}</button>
          </div>
          <span style={s.label}>Brand (optional)</span>
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
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[1,2,3].map(i => <div key={i} style={{ ...s.centerCard, height:100, animation:'pulse 1.2s ease infinite', animationDelay:`${i*0.15}s` }} />)}
          </div>
        )}

        {!loading && centers.length > 0 && (
          <>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ fontSize:12, color:'var(--text3)' }}>📍 {centers.length} centers found near {city}</div>
              <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background: dataSource==='osm' ? 'rgba(0,230,118,0.1)' : 'rgba(0,212,255,0.1)', color: dataSource==='osm' ? 'var(--green)' : 'var(--accent)', fontWeight:700 }}>
                {dataSource === 'osm' ? '🗺️ OSM Data' : '🤖 AI Generated'}
              </span>
            </div>

            {center && <MapTilerMap centers={centers} center={center} />}
            {!MAPTILER_KEY && (
              <div style={{ background:'rgba(255,215,64,0.08)', border:'1px solid rgba(255,215,64,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:12, fontSize:12, color:'var(--yellow)' }}>
                💡 Add <code>REACT_APP_MAPTILER_KEY</code> to Vercel env vars to show the map
              </div>
            )}

            {centers.map((c, i) => (
              <div key={i} style={s.centerCard}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <span style={{ background:'rgba(0,230,118,0.15)', color:'var(--green)', fontSize:11, fontWeight:700, width:22, height:22, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
                  <span style={{ fontSize:15, fontWeight:700, color:'var(--text)' }}>{c.name}</span>
                  {c.isAI && <span style={{ fontSize:10, color:'var(--accent)', background:'rgba(0,212,255,0.08)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:4, padding:'1px 5px', fontWeight:700 }}>AI</span>}
                </div>
                <div style={s.info}>📍 {c.address}</div>
                {c.brand && <div style={s.info}>🏷️ {c.brand}</div>}
                {c.distance && <div style={s.info}>📏 {c.distance} km away</div>}
                {c.hours && <div style={s.info}>⏰ {c.hours}</div>}
                {c.services && <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
                  {c.services.map((sv, j) => <span key={j} style={{ background:'var(--bg3)', color:'var(--text3)', fontSize:11, padding:'3px 8px', borderRadius:6 }}>{sv}</span>)}
                </div>}
                <div style={s.actionRow}>
                  {c.phone
                    ? <a href={`tel:${c.phone}`} style={s.callBtn}>📞 {c.phone}</a>
                    : <div style={{ ...s.callBtn, opacity:0.4, cursor:'default' }}>📞 No number</div>
                  }
                  <div style={s.mapBtn} onClick={() => window.open(c.mapsUrl, '_blank')}>🗺️ Open in Maps</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
