import React, { useState, useEffect, useRef } from 'react';

const MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const BRANDS = ['Hero', 'Honda', 'Bajaj', 'TVS', 'Royal Enfield', 'Yamaha', 'Suzuki', 'KTM', 'Ola Electric', 'Ather', 'Revolt'];

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    if (document.getElementById('gmap-script')) {
      document.getElementById('gmap-script').addEventListener('load', resolve);
      return;
    }
    const script = document.createElement('script');
    script.id  = 'gmap-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
    script.async = true;
    script.onload  = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function searchNearby(query, lat, lng) {
  await loadGoogleMaps();
  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.textSearch(
      { query, location: new window.google.maps.LatLng(lat, lng), radius: 15000 },
      (results, status) => resolve(status === window.google.maps.places.PlacesServiceStatus.OK ? results || [] : [])
    );
  });
}

async function getPlaceDetails(placeId) {
  await loadGoogleMaps();
  return new Promise((resolve) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(
      { placeId, fields: ['formatted_phone_number', 'opening_hours', 'website', 'rating', 'user_ratings_total'] },
      (place, status) => resolve(status === window.google.maps.places.PlacesServiceStatus.OK ? place : {})
    );
  });
}

async function geocodeCity(city) {
  await loadGoogleMaps();
  return new Promise((resolve, reject) => {
    new window.google.maps.Geocoder().geocode({ address: city + ', India' }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({ lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() });
      } else reject(new Error('City not found'));
    });
  });
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
}

function GoogleMap({ centers, center }) {
  const mapRef = useRef(null);
  useEffect(() => {
    if (!window.google?.maps || !mapRef.current || !center) return;
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: center.lat, lng: center.lng }, zoom: 13,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#0e1318' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0e1318' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#8ba3b8' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2430' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080c10' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      ],
    });
    centers.forEach((c, i) => {
      if (!c.lat || !c.lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat: c.lat, lng: c.lng }, map, title: c.name,
        label: { text: `${i+1}`, color: '#000', fontWeight: 'bold', fontSize: '12px' },
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 16, fillColor: '#00e676', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 },
      });
      const info = new window.google.maps.InfoWindow({
        content: `<div style="color:#000;font-size:13px;padding:4px"><strong>${c.name}</strong><br/>${c.address}<br/>⭐ ${c.rating}</div>`,
      });
      marker.addListener('click', () => info.open(map, marker));
    });
  }, [centers, center]);
  return <div ref={mapRef} style={{ width: '100%', height: 260, borderRadius: 14, border: '1px solid var(--border)', marginBottom: 16, overflow: 'hidden' }} />;
}

export default function ServiceCenterPage({ navigate }) {
  const [city, setCity]         = useState('');
  const [brand, setBrand]       = useState('');
  const [centers, setCenters]   = useState([]);
  const [center, setCenter]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [locating, setLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => { loadGoogleMaps().then(() => setMapReady(true)).catch(() => {}); }, []);

  const search = async () => {
    if (!city.trim()) return;
    setLoading(true); setError(''); setCenters([]);
    try {
      const coords = await geocodeCity(city);
      setCenter(coords);
      const query = brand
        ? `${brand} authorized service center ${city}`
        : `bike scooter service center ${city}`;
      const places = await searchNearby(query, coords.lat, coords.lng);
      if (places.length === 0) { setError('No service centers found. Try a different city or brand.'); setLoading(false); return; }
      const top = places.slice(0, 6);
      const detailed = await Promise.all(top.map(p => getPlaceDetails(p.place_id)));
      const results = top.map((p, i) => {
        const d = detailed[i] || {};
        const plat = p.geometry?.location?.lat();
        const plng = p.geometry?.location?.lng();
        return {
          name:     p.name,
          address:  p.formatted_address,
          rating:   p.rating?.toFixed(1) || 'N/A',
          reviews:  p.user_ratings_total || 0,
          phone:    d.formatted_phone_number || null,
          hours:    d.opening_hours?.weekday_text?.[0] || null,
          isOpen:   d.opening_hours?.isOpen?.() ?? null,
          mapsUrl:  `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
          distance: plat && plng ? distanceKm(coords.lat, coords.lng, plat, plng) : null,
          lat: plat, lng: plng,
        };
      });
      setCenters(results.sort((a, b) => (parseFloat(a.distance)||99) - (parseFloat(b.distance)||99)));
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
          setCity(data.address?.city || data.address?.town || data.address?.state_district || '');
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        } catch { setCity('Your location'); }
        setLocating(false);
      },
      () => { setError('GPS not available.'); setLocating(false); }
    );
  };

  const s = {
    page:      { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header:    { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back:      { fontSize: 20, cursor: 'pointer', color: 'var(--green)', background: 'none', border: 'none' },
    container: { padding: 16 },
    card:      { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label:     { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    inputRow:  { display: 'flex', gap: 8, marginBottom: 12 },
    input:     { flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none' },
    gpsBtn:    { padding: '12px 14px', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 10, color: 'var(--green)', cursor: 'pointer', fontSize: 18 },
    select:    { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 14, padding: '12px 14px', outline: 'none', marginBottom: 16 },
    btn:       { width: '100%', padding: 14, background: 'linear-gradient(135deg, var(--green), #00aa55)', color: '#000', fontWeight: 700, fontSize: 15, borderRadius: 12, border: 'none', cursor: 'pointer' },
    centerCard:{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 10 },
    info:      { fontSize: 12, color: 'var(--text3)', marginBottom: 4 },
    actionRow: { display: 'flex', gap: 8, marginTop: 12 },
    callBtn:   { flex: 1, padding: '8px 0', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 8, color: 'var(--green)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
    mapBtn:    { flex: 1, padding: '8px 0', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
    errorBox:  { background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--red)', marginTop: 8 },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>🏪 Service Center Locator</h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>Real service centers from Google Maps</p>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.card}>
          <span style={s.label}>City or Area</span>
          <div style={s.inputRow}>
            <input style={s.input} placeholder="e.g. Mumbai, Andheri West" value={city}
              onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()} />
            <button style={s.gpsBtn} onClick={useGPS} title="Use my location">{locating ? '⌛' : '📍'}</button>
          </div>
          <span style={s.label}>Brand (optional)</span>
          <select style={s.select} value={brand} onChange={e => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {error && <div style={s.errorBox}>⚠️ {error}</div>}
          <button style={{ ...s.btn, opacity: loading || !city.trim() ? 0.6 : 1 }}
            onClick={search} disabled={loading || !city.trim()}>
            {loading ? '🔍 Searching Google Maps...' : '🔍 Find Service Centers'}
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} style={{ ...s.centerCard, height: 100, animation: 'pulse 1.2s ease infinite', animationDelay: `${i*0.15}s` }} />)}
          </div>
        )}

        {!loading && centers.length > 0 && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>
              📍 {centers.length} service centers found near {city}
            </div>
            {mapReady && center && <GoogleMap centers={centers} center={center} />}
            {centers.map((c, i) => (
              <div key={i} style={s.centerCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <span style={{ background: 'var(--bg3)', color: 'var(--text3)', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i+1}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{c.name}</span>
                    </div>
                    <div style={s.info}>📍 {c.address}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                    {c.rating !== 'N/A' && <div style={{ color: 'var(--yellow)', fontSize: 13, fontWeight: 700 }}>★ {c.rating}</div>}
                    {c.reviews > 0 && <div style={{ fontSize: 10, color: 'var(--text3)' }}>{c.reviews} reviews</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  {c.distance && <span style={{ fontSize: 11, color: 'var(--accent)', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '2px 8px' }}>📏 {c.distance} km</span>}
                  {c.isOpen === true  && <span style={{ fontSize: 11, color: 'var(--green)', background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 6, padding: '2px 8px' }}>● Open Now</span>}
                  {c.isOpen === false && <span style={{ fontSize: 11, color: 'var(--red)', background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 6, padding: '2px 8px' }}>● Closed</span>}
                </div>

                {c.hours && <div style={s.info}>⏰ {c.hours}</div>}

                <div style={s.actionRow}>
                  {c.phone
                    ? <a href={`tel:${c.phone}`} style={s.callBtn}>📞 {c.phone}</a>
                    : <div style={{ ...s.callBtn, opacity: 0.4, cursor: 'default' }}>📞 No number</div>
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
