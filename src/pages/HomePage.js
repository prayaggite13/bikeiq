import React, { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import FeaturedSection from '../components/FeaturedSection';
import { formatINR } from '../utils/calculator';

const POPULAR_SEARCHES = [
  'Royal Enfield Classic 350', 'Honda Activa 6G', 'Ola S1 Pro',
  'Bajaj Pulsar NS200', 'TVS Apache RTR 160', 'Ather 450X',
  'Hero Splendor Plus', 'KTM Duke 390', 'Yamaha R15 V4',
  'Simple One', 'Jawa 42', 'BMW G 310 R'
];

// Brandfetch free CDN — logo by domain, no API key needed
// Format: https://cdn.brandfetch.io/{domain}/icon.png
const BRANDS = [
  { name: 'Hero',            logo: 'https://cdn.brandfetch.io/heromotocorp.com/icon.png',        bg: '#1565C0' },
  { name: 'Honda',           logo: 'https://cdn.brandfetch.io/honda.com/icon.png',               bg: '#CC0000' },
  { name: 'TVS',             logo: 'https://cdn.brandfetch.io/tvsmotor.com/icon.png',            bg: '#e65c00' },
  { name: 'Bajaj',           logo: 'https://cdn.brandfetch.io/bajajauto.com/icon.png',           bg: '#1565C0' },
  { name: 'Royal Enfield',   logo: 'https://cdn.brandfetch.io/royalenfield.com/icon.png',        bg: '#3a3a3a' },
  { name: 'Yamaha',          logo: 'https://cdn.brandfetch.io/yamaha-motor.com/icon.png',        bg: '#1565C0' },
  { name: 'Suzuki',          logo: 'https://cdn.brandfetch.io/suzuki.com/icon.png',              bg: '#1a1a1a' },
  { name: 'KTM',             logo: 'https://cdn.brandfetch.io/ktm.com/icon.png',                 bg: '#E65100' },
  { name: 'Ola Electric',    logo: 'https://cdn.brandfetch.io/olaelectric.com/icon.png',         bg: '#1B5E20' },
  { name: 'Ather',           logo: 'https://cdn.brandfetch.io/atherenergy.com/icon.png',         bg: '#1B5E20' },
  { name: 'Simple Energy',   logo: 'https://cdn.brandfetch.io/simpleenergy.in/icon.png',         bg: '#1B5E20' },
  { name: 'Revolt',          logo: 'https://cdn.brandfetch.io/revoltmotors.com/icon.png',        bg: '#1B5E20' },
  { name: 'BMW',             logo: 'https://cdn.brandfetch.io/bmw.com/icon.png',                 bg: '#1565C0' },
  { name: 'Kawasaki',        logo: 'https://cdn.brandfetch.io/kawasaki.com/icon.png',            bg: '#1B5E20' },
  { name: 'Triumph',         logo: 'https://cdn.brandfetch.io/triumphmotorcycles.com/icon.png',  bg: '#cc0000' },
  { name: 'Harley-Davidson', logo: 'https://cdn.brandfetch.io/harley-davidson.com/icon.png',     bg: '#E65100' },
];

// Bike images — using imgd.aeplcdn.com (BikeWale/CarDekho CDN, no hotlink block)
const BIKE_IMAGES = {
  'Honda Activa 6G':           'https://imgd.aeplcdn.com/664x374/n/cw/ec/44686/activa-6g-right-side-view-2.jpeg',
  'Royal Enfield Classic 350': 'https://imgd.aeplcdn.com/664x374/n/cw/ec/150577/classic-350-right-side-view-3.jpeg',
  'Ola S1 Pro':                'https://imgd.aeplcdn.com/664x374/n/cw/ec/130591/s1-pro-right-side-view-2.jpeg',
  'Bajaj Pulsar NS200':        'https://imgd.aeplcdn.com/664x374/n/cw/ec/150987/ns200-right-side-view-2.jpeg',
  'Ather 450X':                'https://imgd.aeplcdn.com/664x374/n/cw/ec/130611/450x-right-side-view-3.jpeg',
  'KTM Duke 390':              'https://imgd.aeplcdn.com/664x374/n/cw/ec/150177/390-duke-right-side-view-2.jpeg',
  'Hero Splendor Plus':        'https://imgd.aeplcdn.com/664x374/n/cw/ec/106257/splendor-plus-right-side-view-2.jpeg',
  'Yamaha R15 V4':             'https://imgd.aeplcdn.com/664x374/n/cw/ec/130806/yzf-r15-v4-right-side-view-3.jpeg',
  'TVS Apache RTR 160':        'https://imgd.aeplcdn.com/664x374/n/cw/ec/130977/apache-rtr-160-4v-right-side-view-3.jpeg',
};

const TYPE_EMOJI = {
  Scooter: '🛵', Commuter: '🏍️', Sport: '🏎️',
  Cruiser: '🏍️', Adventure: '🏍️', Electric: '⚡',
};

const CATEGORIES = [
  { label: 'Scooters',   query: 'Honda Activa 6G',            icon: '🛵' },
  { label: 'Commuters',  query: 'Hero Splendor Plus',          icon: '🏍️' },
  { label: 'Sports',     query: 'Bajaj Pulsar NS200',          icon: '🏎️' },
  { label: 'Cruisers',   query: 'Royal Enfield Classic 350',   icon: '🛣️' },
  { label: 'Adventure',  query: 'Royal Enfield Himalayan',     icon: '🏔️' },
  { label: 'Electric',   query: 'Ola S1 Pro',                  icon: '⚡' },
];

const FEATURED_BIKES = [
  'Honda Activa 6G',
  'Royal Enfield Classic 350',
  'Ola S1 Pro',
  'Bajaj Pulsar NS200',
  'Ather 450X',
  'KTM Duke 390',
];

// Brand logo with fallback to colored initial
function BrandLogo({ brand }) {
  const [failed, setFailed] = useState(false);
  const initial = brand.name[0].toUpperCase();

  return (
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: brand.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', margin: '0 auto 6px',
    }}>
      {brand.logo && !failed ? (
        <img
          src={brand.logo}
          alt={brand.name}
          style={{ width: '78%', height: '78%', objectFit: 'contain' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={{
          fontSize: 18, fontWeight: 800,
          color: '#fff', fontFamily: 'Rajdhani, sans-serif',
        }}>
          {initial}
        </span>
      )}
    </div>
  );
}

// Bike image with fallback to emoji
function BikeImage({ name, type }) {
  const [failed, setFailed] = useState(false);
  const imgSrc = BIKE_IMAGES[name];
  const emoji = TYPE_EMOJI[type] || '🏍️';

  if (!imgSrc || failed) {
    return (
      <div style={{
        width: '100%', height: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 52,
      }}>
        {emoji}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={name}
      style={{ width: '100%', height: 90, objectFit: 'contain', borderRadius: 8 }}
      onError={() => setFailed(true)}
    />
  );
}

function FeaturedBikeCard({ bike, navigate, toggleWatchlist, isWatchlisted }) {
  const saved = isWatchlisted(bike);
  return (
    <div
      className="card glow"
      style={{ flexShrink: 0, width: 200, cursor: 'pointer' }}
      onClick={() => navigate('bike', bike)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <span className={`tag ${bike.fuelType === 'Electric' ? 'tag-ev' : 'tag-petrol'}`} style={{ fontSize: '0.65rem' }}>
          {bike.fuelType === 'Electric' ? '⚡ EV' : '⛽ Petrol'}
        </span>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--accent3)' : 'var(--text3)', fontSize: '1rem', padding: 0 }}
          onClick={e => { e.stopPropagation(); toggleWatchlist(bike); }}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      {/* Real bike image */}
      <BikeImage name={bike.name} type={bike.type} />

      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, marginBottom: 2, marginTop: 6 }}>{bike.name}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 6 }}>{bike.brand}</div>
      <div style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>
        {formatINR(bike.basePrice)}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {bike.mileage && (
          <div style={{ background: 'var(--bg3)', borderRadius: 6, padding: '4px 8px', fontSize: '0.68rem', color: 'var(--text2)' }}>
            ⛽ {bike.mileage.claimed}
          </div>
        )}
        {bike.evSpecs && (
          <div style={{ background: 'var(--bg3)', borderRadius: 6, padding: '4px 8px', fontSize: '0.68rem', color: 'var(--green)' }}>
            ⚡ {bike.evSpecs.range?.claimed}
          </div>
        )}
      </div>
      {bike.ownerRating && (
        <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--yellow)' }}>
          ★ {bike.ownerRating} <span style={{ color: 'var(--text3)' }}>({bike.totalReviews?.toLocaleString()})</span>
        </div>
      )}
    </div>
  );
}

export default function HomePage({ navigate, toggleWatchlist, isWatchlisted }) {
  const [query, setQuery] = useState('');
  const [featuredBikes, setFeaturedBikes] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState(false);

  useEffect(() => { loadFeatured(); }, []);

  const loadFeatured = async () => {
    setLoadingFeatured(true);
    setFeaturedError(false);
    setFeaturedBikes([]);
    try {
      const first3 = await Promise.all(FEATURED_BIKES.slice(0, 3).map(name => searchBikeInfo(name)));
      setFeaturedBikes(first3.filter(Boolean));
      setLoadingFeatured(false);
      const rest = await Promise.all(FEATURED_BIKES.slice(3).map(name => searchBikeInfo(name)));
      setFeaturedBikes(prev => [...prev, ...rest.filter(Boolean)]);
    } catch {
      setFeaturedError(true);
      setLoadingFeatured(false);
    }
  };

  const handleSearch = (q) => {
    if (!q.trim()) return;
    navigate('search', { autoSearch: true, query: q });
  };

  return (
    <div className="page slide-up">

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(255,107,53,0.05) 100%)',
        border: '1px solid var(--border)', borderRadius: 20, padding: '28px 20px',
        marginBottom: 20, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} color="var(--accent)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            India's Smartest 2-Wheeler Platform
          </span>
        </div>
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '2rem', fontWeight: 700, lineHeight: 1.1, marginBottom: 6 }}>
          Find Your<br /><span style={{ color: 'var(--accent)' }}>Perfect Ride</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 20, lineHeight: 1.5 }}>
          Every bike. Every scooter. EV to petrol. Real specs, real prices across India.
        </p>
        <div className="search-bar">
          <Search size={18} color="var(--text3)" />
          <input
            placeholder="Search any bike or scooter..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
          />
          <button className="btn btn-primary btn-sm" onClick={() => handleSearch(query)} style={{ padding: '7px 16px' }}>
            Search
          </button>
        </div>
      </div>

      {/* BikeIQ+ Banner */}
      <div
        onClick={() => navigate('bikeiqplus')}
        style={{
          marginBottom: 20, cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(179,136,255,0.12) 0%, rgba(0,212,255,0.06) 100%)',
          border: '1px solid rgba(179,136,255,0.25)',
          borderRadius: 18, padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'radial-gradient(circle, rgba(179,136,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '1.3rem' }}>✨</span>
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.2rem', color: 'var(--purple)' }}>BikeIQ+ Tools</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.4 }}>
            Bike Quiz · Commute Finder · Insurance · Resale · Road Tax · AI Mechanic & more
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['🎯 Quiz', '🔧 AI Mechanic', '🛡️ Insurance', '📉 Resale', '🌱 First Bike'].map(t => (
              <span key={t} style={{ fontSize: '0.68rem', background: 'rgba(179,136,255,0.1)', color: 'var(--purple)', border: '1px solid rgba(179,136,255,0.2)', borderRadius: 20, padding: '2px 8px' }}>{t}</span>
            ))}
          </div>
        </div>
        <div style={{ color: 'var(--purple)', fontSize: '1.2rem', flexShrink: 0, marginLeft: 12 }}>→</div>
      </div>

      {/* Browse Bikes */}
      <FeaturedSection navigate={navigate} />

      {/* Featured This Week */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 0 }}>🔥 Featured This Week</div>
          <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={loadFeatured} title="Refresh">
            <RefreshCw size={13} />
          </button>
        </div>

        {loadingFeatured && featuredBikes.length === 0 && (
          <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flexShrink: 0, width: 200, height: 180, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, animation: 'pulse 1.5s ease infinite', animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        )}

        {featuredError && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text3)', fontSize: '0.82rem' }}>
            Could not load featured bikes. <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={loadFeatured}>Retry</span>
          </div>
        )}

        {featuredBikes.length > 0 && (
          <div className="scroll-row">
            {featuredBikes.map((bike, i) => (
              <FeaturedBikeCard key={i} bike={bike} navigate={navigate} toggleWatchlist={toggleWatchlist} isWatchlisted={isWatchlisted} />
            ))}
            {loadingFeatured && (
              <div style={{ flexShrink: 0, width: 200, height: 180, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>Browse by Type</div>
        <div className="scroll-row">
          {CATEGORIES.map(cat => (
            <div key={cat.label} onClick={() => navigate('search', { autoSearch: true, query: cat.query })}
              style={{ flexShrink: 0, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 16px', cursor: 'pointer', textAlign: 'center', minWidth: 90, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{cat.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text2)' }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>
          <TrendingUp size={16} color="var(--accent3)" /> Trending Searches
        </div>
        <div className="chip-row">
          {POPULAR_SEARCHES.map(name => (
            <span key={name} className="chip" onClick={() => navigate('search', { autoSearch: true, query: name })}>{name}</span>
          ))}
        </div>
      </div>

      {/* All Brands — real logos */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>All Brands</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {BRANDS.map(brand => (
            <div
              key={brand.name}
              className="card"
              style={{ padding: '12px 8px', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('search', { autoSearch: true, query: `${brand.name} bike` })}
            >
              <BrandLogo brand={brand} />
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text2)', lineHeight: 1.2 }}>{brand.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* News teaser */}
      <div className="card" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,107,53,0.04))' }} onClick={() => navigate('news')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>📰 Latest 2-Wheeler News</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Launches, updates & reviews — live</div>
          </div>
          <ChevronRight size={20} color="var(--accent)" />
        </div>
      </div>
    </div>
  );
}
