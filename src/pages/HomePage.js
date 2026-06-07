import React, { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, ChevronRight, RefreshCw, GitCompare } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import FeaturedSection from '../components/FeaturedSection';
import { formatINR } from '../utils/calculator';
import { useLang } from '../utils/LanguageContext';

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

// Brand gradient colors for bike cards (reliable, never fails)
const BRAND_GRADIENTS = {
  'Honda':         'linear-gradient(135deg, #cc000022 0%, #ff000011 100%)',
  'Royal Enfield': 'linear-gradient(135deg, #3a3a3a44 0%, #6a6a6a22 100%)',
  'Ola Electric':  'linear-gradient(135deg, #1B5E2044 0%, #00e67622 100%)',
  'Bajaj':         'linear-gradient(135deg, #E6510022 0%, #ff6b3511 100%)',
  'Ather':         'linear-gradient(135deg, #1B5E2044 0%, #00d4ff22 100%)',
  'KTM':           'linear-gradient(135deg, #E6510044 0%, #ff6b3522 100%)',
  'Hero':          'linear-gradient(135deg, #1565C044 0%, #00d4ff22 100%)',
  'Yamaha':        'linear-gradient(135deg, #1565C044 0%, #0044aa22 100%)',
  'TVS':           'linear-gradient(135deg, #e6510022 0%, #ffd74022 100%)',
  'Suzuki':        'linear-gradient(135deg, #1a1a1a44 0%, #4a4a4a22 100%)',
  'default':       'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(255,107,53,0.05) 100%)',
};

// Large emoji per bike type for visual cards
const TYPE_BIG_EMOJI = {
  Scooter:   '🛵', Commuter:  '🏍️', Sport:     '🏎️',
  Cruiser:   '🏍️', Adventure: '🏔️', Electric:  '⚡',
};

const TYPE_EMOJI = {
  Scooter: '🛵', Commuter: '🏍️', Sport: '🏎️',
  Cruiser: '🏍️', Adventure: '🏍️', Electric: '⚡',
};

// CATEGORIES defined inside component (uses t() for translation)

const FEATURED_BIKES = [
  'Honda Activa 6G',
  'Royal Enfield Classic 350',
  'Ola S1 Pro',
  'Bajaj Pulsar NS200',
  'Ather 450X',
  'KTM Duke 390',
];

// Brand logo — Brandfetch CDN with styled initial fallback
function BrandLogo({ brand }) {
  const [failed, setFailed] = useState(false);
  const initial = brand.name.slice(0, 2).toUpperCase();

  return (
    <div style={{
      width: 48, height: 48, borderRadius: 14,
      background: failed || !brand.logo ? brand.bg : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', margin: '0 auto 8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {brand.logo && !failed ? (
        <img
          src={brand.logo}
          alt={brand.name}
          style={{ width: '76%', height: '76%', objectFit: 'contain' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={{
          fontSize: initial.length > 1 ? 14 : 20,
          fontWeight: 800, color: '#fff',
          fontFamily: 'Rajdhani, sans-serif',
          letterSpacing: '-0.5px',
        }}>
          {initial}
        </span>
      )}
    </div>
  );
}

// Styled bike visual — gradient background + large type emoji
function BikeImage({ name, type, brand }) {
  const gradient = BRAND_GRADIENTS[brand] || BRAND_GRADIENTS['default'];
  const emoji = TYPE_BIG_EMOJI[type] || TYPE_EMOJI[type] || '🏍️';

  return (
    <div style={{
      width: '100%', height: 90, borderRadius: 10,
      background: gradient,
      border: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 54, marginBottom: 4,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* subtle glow behind emoji */}
      <div style={{
        position: 'absolute', width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)', filter: 'blur(20px)',
      }} />
      <span style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))', position: 'relative' }}>
        {emoji}
      </span>
    </div>
  );
}

function FeaturedBikeCard({ bike, navigate, toggleWatchlist, isWatchlisted, addToCompare }) {
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
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--accent3)' : 'var(--text3)', fontSize: '1rem', padding: 2 }}
            onClick={() => toggleWatchlist(bike)}
            title="Save"
          >
            {saved ? '♥' : '♡'}
          </button>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', padding: 2, display: 'flex', alignItems: 'center' }}
            onClick={() => addToCompare(bike)}
            title="Add to Compare"
          >
            <GitCompare size={14} />
          </button>
        </div>
      </div>

      {/* Styled bike visual */}
      <BikeImage name={bike.name} type={bike.type} brand={bike.brand} />

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

export default function HomePage({ navigate, toggleWatchlist, isWatchlisted, addToCompare }) {
  const { t } = useLang();
  const [query, setQuery] = useState('');
  const CATEGORIES = [
    { label: t('scooters'),  query: 'Honda Activa 6G',            icon: '🛵' },
    { label: t('commuters'), query: 'Hero Splendor Plus',          icon: '🏍️' },
    { label: t('sports'),    query: 'Bajaj Pulsar NS200',          icon: '🏎️' },
    { label: t('cruisers'),  query: 'Royal Enfield Classic 350',   icon: '🛣️' },
    { label: t('adventure'), query: 'Royal Enfield Himalayan',     icon: '🏔️' },
    { label: t('electric'),  query: 'Ola S1 Pro',                  icon: '⚡' },
  ];
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

      {/* ── Hero Section ── */}
      <div style={{
        background: 'linear-gradient(160deg, rgba(0,212,255,0.09) 0%, rgba(179,136,255,0.06) 50%, rgba(255,107,53,0.05) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 24, padding: '32px 20px 28px',
        marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 140, height: 140, background: 'radial-gradient(circle, rgba(179,136,255,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 20, padding: '4px 12px', marginBottom: 14 }}>
          <Zap size={11} color="var(--accent)" fill="var(--accent)" />
          <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t('platformBadge')}</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: 'Rajdhani', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>
          {t('heroTitle1')}<br /><span style={{ color: 'var(--accent)' }}>{t('heroTitle2')}</span>
        </h1>

        {/* Subheading */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: 20, lineHeight: 1.6, maxWidth: 420 }}>
          {t('heroDesc')}
        </p>

        {/* Search */}
        <div className="search-bar" style={{ marginBottom: 20 }}>
          <Search size={18} color="var(--text3)" />
          <input
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
          />
          <button className="btn btn-primary btn-sm" onClick={() => handleSearch(query)} style={{ padding: '7px 16px' }}>
            Go
          </button>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
          {[
            { icon: '🔍', label: t('featuresSearch') },
            { icon: '⚖️', label: t('featuresCompare') },
            { icon: '⚡', label: t('featuresEV') },
            { icon: '🤖', label: t('featuresAI') },
            { icon: '📰', label: t('featuresLiveNews') },
            { icon: '💰', label: t('featuresPrices') },
          ].map(f => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '5px 10px',
              fontSize: '0.72rem', color: 'var(--text2)', fontWeight: 500,
            }}>
              <span style={{ fontSize: '0.82rem' }}>{f.icon}</span> {f.label}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { value: '500+', label: t('statBikes') },
            { value: '16',   label: t('statBrands') },
            { value: '8',    label: t('statCities') },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '10px 8px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'Rajdhani', fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
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
            <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.2rem', color: 'var(--purple)' }}>{t('bikeiqPlusTools')}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.4 }}>
            {t('bikeiqPlusDesc')}
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
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 0 }}>{t('featuredWeek')}</div>
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
            {t('couldNotLoad')} <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={loadFeatured}>{t('retry')}</span>
          </div>
        )}

        {featuredBikes.length > 0 && (
          <div className="scroll-row">
            {featuredBikes.map((bike, i) => (
              <FeaturedBikeCard key={i} bike={bike} navigate={navigate} toggleWatchlist={toggleWatchlist} isWatchlisted={isWatchlisted} addToCompare={addToCompare} />
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
        <div className="section-title" style={{ fontSize: '1rem' }}>{t('browseType')}</div>
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
          <TrendingUp size={16} color="var(--accent3)" /> {t('trendingSearches')}
        </div>
        <div className="chip-row">
          {POPULAR_SEARCHES.map(name => (
            <span key={name} className="chip" onClick={() => navigate('search', { autoSearch: true, query: name })}>{name}</span>
          ))}
        </div>
      </div>

      {/* {t('allBrands')} — real logos */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>{t('allBrands')}</div>
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
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{t('latestNews')}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>{t('newsLive')}</div>
          </div>
          <ChevronRight size={20} color="var(--accent)" />
        </div>
      </div>
    </div>
  );
}
