import React, { useState, useEffect } from 'react';
import { formatINR } from '../utils/calculator';
import { Zap, Fuel, RefreshCw } from 'lucide-react';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const TABS = ['Trending', 'Popular', 'Electric', 'Upcoming'];

// Bike names per tab — names are stable, prices fetched live
const TAB_BIKES = {
  Trending: [
    { name: 'Royal Enfield Classic 350', brand: 'Royal Enfield', type: 'Cruiser',  fuelType: 'Petrol' },
    { name: 'Bajaj Pulsar N160',         brand: 'Bajaj',         type: 'Sport',    fuelType: 'Petrol' },
    { name: 'TVS Apache RTR 160 4V',     brand: 'TVS',           type: 'Sport',    fuelType: 'Petrol' },
    { name: 'Honda Activa 6G',           brand: 'Honda',         type: 'Scooter',  fuelType: 'Petrol' },
    { name: 'Hero Splendor Plus',        brand: 'Hero',          type: 'Commuter', fuelType: 'Petrol' },
    { name: 'Yamaha R15 V4',             brand: 'Yamaha',        type: 'Sport',    fuelType: 'Petrol' },
  ],
  Popular: [
    { name: 'Honda SP 125',              brand: 'Honda',         type: 'Commuter', fuelType: 'Petrol' },
    { name: 'Hero HF Deluxe',            brand: 'Hero',          type: 'Commuter', fuelType: 'Petrol' },
    { name: 'TVS Jupiter 125',           brand: 'TVS',           type: 'Scooter',  fuelType: 'Petrol' },
    { name: 'Bajaj Pulsar 150',          brand: 'Bajaj',         type: 'Sport',    fuelType: 'Petrol' },
    { name: 'Royal Enfield Hunter 350',  brand: 'Royal Enfield', type: 'Roadster', fuelType: 'Petrol' },
    { name: 'KTM Duke 390',              brand: 'KTM',           type: 'Naked',    fuelType: 'Petrol' },
  ],
  Electric: [
    { name: 'Ola S1 Pro',                brand: 'Ola Electric',  type: 'Electric Scooter', fuelType: 'Electric' },
    { name: 'Ather 450X',                brand: 'Ather',         type: 'Electric Scooter', fuelType: 'Electric' },
    { name: 'TVS iQube Electric',        brand: 'TVS',           type: 'Electric Scooter', fuelType: 'Electric' },
    { name: 'Bajaj Chetak Electric',     brand: 'Bajaj',         type: 'Electric Scooter', fuelType: 'Electric' },
    { name: 'Ather Rizta',               brand: 'Ather',         type: 'Electric Scooter', fuelType: 'Electric' },
    { name: 'Simple One',                brand: 'Simple Energy', type: 'Electric Scooter', fuelType: 'Electric' },
  ],
  Upcoming: [
    { name: 'Honda Activa EV',           brand: 'Honda',         type: 'Electric Scooter', fuelType: 'Electric', status: 'Launching Soon' },
    { name: 'Royal Enfield Classic 650', brand: 'Royal Enfield', type: 'Cruiser',          fuelType: 'Petrol',   status: 'Expected 2025' },
    { name: 'KTM Duke 250 2025',         brand: 'KTM',           type: 'Naked',            fuelType: 'Petrol',   status: 'Coming Soon'   },
    { name: 'Bajaj Pulsar NS400Z',       brand: 'Bajaj',         type: 'Sport',            fuelType: 'Petrol',   status: 'Just Launched' },
    { name: 'Triumph Speed T4',          brand: 'Triumph',       type: 'Roadster',         fuelType: 'Petrol',   status: 'Just Launched' },
    { name: 'Hero Mavrick 440',          brand: 'Hero',          type: 'Roadster',         fuelType: 'Petrol',   status: 'Just Launched' },
  ],
};

// Fallback prices if Groq fails
const FALLBACK_PRICES = {
  'Royal Enfield Classic 350': 193000, 'Bajaj Pulsar N160': 132000,
  'TVS Apache RTR 160 4V': 122000,     'Honda Activa 6G': 80000,
  'Hero Splendor Plus': 78000,         'Yamaha R15 V4': 185000,
  'Honda SP 125': 92000,               'Hero HF Deluxe': 68000,
  'TVS Jupiter 125': 85000,            'Bajaj Pulsar 150': 113000,
  'Royal Enfield Hunter 350': 155000,  'KTM Duke 390': 320000,
  'Ola S1 Pro': 135000,                'Ather 450X': 145000,
  'TVS iQube Electric': 99000,         'Bajaj Chetak Electric': 120000,
  'Ather Rizta': 115000,               'Simple One': 155000,
  'Honda Activa EV': 125000,           'Royal Enfield Classic 650': 360000,
  'KTM Duke 250 2025': 240000,         'Bajaj Pulsar NS400Z': 197000,
  'Triumph Speed T4': 225000,          'Hero Mavrick 440': 215000,
};

const FALLBACK_INFO = {
  mileage: { 'Petrol': '45 kmpl' },
  range:   { 'Electric': '120 km' },
};

// Fetch live prices + key info for a tab's bikes from Groq
async function fetchLivePrices(bikes) {
  const names = bikes.map(b => b.name).join(', ');
  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 800,
        temperature: 0.1,
        messages: [
          {
            role: 'system',
            content: 'You are a bike pricing API for India. Return only valid JSON. No markdown, no explanation.',
          },
          {
            role: 'user',
            content: `Return current 2025 ex-showroom prices and key info for these bikes in India: ${names}

Return ONLY this JSON array (one object per bike, same order):
[
  {
    "name": "exact bike name",
    "price": 193000,
    "mileage": "35-40 kmpl",
    "range": null,
    "rating": 4.5
  }
]
For electric bikes set mileage to null and fill range (e.g. "146 km").
For petrol bikes set range to null.`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1) throw new Error('No JSON');
    const parsed = JSON.parse(text.slice(start, end + 1));
    // Merge live data into the static bike list
    return bikes.map(bike => {
      const live = parsed.find(p => p.name?.toLowerCase().includes(bike.name.toLowerCase().split(' ')[2] || bike.name.toLowerCase().split(' ')[1]) || bike.name.toLowerCase().includes(p.name?.toLowerCase().split(' ')[1] || ''));
      const matched = parsed.find(p => p.name === bike.name) || live;
      return {
        ...bike,
        price:   matched?.price   || FALLBACK_PRICES[bike.name] || 100000,
        mileage: matched?.mileage || (bike.fuelType !== 'Electric' ? FALLBACK_INFO.mileage.Petrol : null),
        range:   matched?.range   || (bike.fuelType === 'Electric' ? FALLBACK_INFO.range.Electric : null),
        rating:  matched?.rating  || 4.0,
      };
    });
  } catch {
    // Return fallback prices silently
    return bikes.map(bike => ({
      ...bike,
      price:   FALLBACK_PRICES[bike.name] || 100000,
      mileage: bike.fuelType !== 'Electric' ? FALLBACK_INFO.mileage.Petrol : null,
      range:   bike.fuelType === 'Electric' ? FALLBACK_INFO.range.Electric : null,
      rating:  4.0,
    }));
  }
}

const BIKE_EMOJIS = {
  'Cruiser': '🏍️', 'Sport': '🏎️', 'Scooter': '🛵', 'Commuter': '🏍️',
  'Naked': '🏍️', 'Roadster': '🏍️', 'Adventure': '🏔️',
  'Electric Scooter': '⚡', 'Electric Bike': '⚡',
};

const STATUS_COLORS = {
  'Launching Soon': { bg: 'rgba(255,215,64,0.9)',  color: '#000' },
  'Expected 2025':  { bg: 'rgba(179,136,255,0.9)', color: '#000' },
  'Coming Soon':    { bg: 'rgba(255,107,53,0.9)',   color: '#fff' },
  'Just Launched':  { bg: 'rgba(0,212,255,0.9)',    color: '#000' },
};

function BikeCard({ bike, navigate, isLive }) {
  const emoji       = BIKE_EMOJIS[bike.type] || '🏍️';
  const statusStyle = bike.status ? STATUS_COLORS[bike.status] || { bg: 'rgba(0,212,255,0.9)', color: '#000' } : null;

  return (
    <div
      className="card"
      style={{ flexShrink: 0, width: 190, cursor: 'pointer', padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}
      onClick={() => navigate('search', { autoSearch: true, query: bike.name })}
    >
      {/* Visual top */}
      <div style={{ height: 110, background: 'linear-gradient(135deg, var(--bg3), var(--bg4))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontSize: '3rem' }}>
        {emoji}
        {bike.status && statusStyle && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: statusStyle.bg, color: statusStyle.color, fontSize: '0.58rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {bike.status}
          </div>
        )}
        <div style={{ position: 'absolute', top: 8, right: 8, background: bike.fuelType === 'Electric' ? 'rgba(0,230,118,0.9)' : 'rgba(0,0,0,0.55)', color: bike.fuelType === 'Electric' ? '#000' : '#fff', fontSize: '0.58rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
          {bike.fuelType === 'Electric' ? <><Zap size={9} />EV</> : <><Fuel size={9} />Petrol</>}
        </div>
        <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: '#ccc', fontSize: '0.58rem', padding: '2px 7px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {bike.type}
        </div>
        {/* Live price indicator */}
        {isLive && (
          <div style={{ position: 'absolute', bottom: 8, right: 8, width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} title="Live price" />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: '0.62rem', color: 'var(--text3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{bike.brand}</div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.2, marginBottom: 6, color: 'var(--text)' }}>{bike.name}</div>

        {/* Price — skeleton while loading, live value when ready */}
        {bike.price ? (
          <div style={{ fontFamily: 'Rajdhani', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
            {formatINR(bike.price)}
            <span style={{ fontSize: '0.62rem', color: 'var(--text3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 3 }}>ex-showroom</span>
          </div>
        ) : (
          <div style={{ height: 20, width: 90, background: 'var(--bg3)', borderRadius: 4, marginBottom: 4, animation: 'pulse 1.2s ease infinite' }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
            {bike.fuelType === 'Electric' ? `⚡ ${bike.range || '—'}` : `⛽ ${bike.mileage || '—'}`}
          </div>
          {bike.rating && <div style={{ fontSize: '0.68rem', color: 'var(--yellow)' }}>★ {bike.rating}</div>}
        </div>
      </div>
    </div>
  );
}

// Cache fetched tab data so switching tabs doesn't re-fetch
const priceCache = {};

export default function FeaturedSection({ navigate }) {
  const [activeTab, setActiveTab] = useState('Trending');
  const [bikes, setBikes]         = useState(TAB_BIKES['Trending'].map(b => ({ ...b, price: null })));
  const [isLive, setIsLive]       = useState(false);
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTab = async (tab) => {
    // Show skeletons immediately with no prices
    setBikes(TAB_BIKES[tab].map(b => ({ ...b, price: null })));
    setIsLive(false);

    // Use cache if available
    if (priceCache[tab]) {
      setBikes(priceCache[tab]);
      setIsLive(true);
      return;
    }

    setLoading(true);
    const live = await fetchLivePrices(TAB_BIKES[tab]);
    priceCache[tab] = live;
    setBikes(live);
    setIsLive(true);
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem' }}>🏍️ Browse Bikes</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isLive && (
            <span style={{ fontSize: '0.65rem', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', boxShadow: '0 0 5px var(--green)' }} />
              Live prices
            </span>
          )}
          {loading && <RefreshCw size={12} color="var(--text3)" style={{ animation: 'spin 0.8s linear infinite' }} />}
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 14 }}>
        {TABS.map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'Electric' ? '⚡ ' : tab === 'Upcoming' ? '🚀 ' : ''}{tab}
          </button>
        ))}
      </div>

      <div className="scroll-row">
        {bikes.map((bike, i) => (
          <BikeCard key={i} bike={bike} navigate={navigate} isLive={isLive} />
        ))}
      </div>
    </div>
  );
}
