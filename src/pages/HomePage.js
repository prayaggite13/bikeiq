import React, { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Navigation, Calculator, ChevronRight, RefreshCw } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import FeaturedSection from '../components/FeaturedSection';
import { formatINR } from '../utils/calculator';

const POPULAR_SEARCHES = [
  'Royal Enfield Classic 350', 'Honda Activa 6G', 'Ola S1 Pro',
  'Bajaj Pulsar NS200', 'TVS Apache RTR 160', 'Ather 450X',
  'Hero Splendor Plus', 'KTM Duke 390', 'Yamaha R15 V4',
  'Simple One', 'Jawa 42', 'BMW G 310 R'
];

const BRANDS = [
  { name: 'Hero', emoji: '🔵' }, { name: 'Honda', emoji: '🔴' },
  { name: 'TVS', emoji: '🟡' }, { name: 'Bajaj', emoji: '🟠' },
  { name: 'Royal Enfield', emoji: '⚫' }, { name: 'Yamaha', emoji: '🔵' },
  { name: 'Suzuki', emoji: '🔵' }, { name: 'KTM', emoji: '🟠' },
  { name: 'Ola Electric', emoji: '🟢' }, { name: 'Ather', emoji: '🟢' },
  { name: 'Simple Energy', emoji: '🟢' }, { name: 'Revolt', emoji: '🟢' },
  { name: 'BMW', emoji: '⚪' }, { name: 'Kawasaki', emoji: '🟢' },
  { name: 'Triumph', emoji: '🔴' }, { name: 'Harley-Davidson', emoji: '🟠' },
];

const CATEGORIES = [
  { label: 'Scooters', query: 'Honda Activa 6G', icon: '🛵' },
  { label: 'Commuters', query: 'Hero Splendor Plus', icon: '🏍️' },
  { label: 'Sports', query: 'Bajaj Pulsar NS200', icon: '🏎️' },
  { label: 'Cruisers', query: 'Royal Enfield Classic 350', icon: '🛣️' },
  { label: 'Adventure', query: 'Royal Enfield Himalayan', icon: '🏔️' },
  { label: 'Electric', query: 'Ola S1 Pro', icon: '⚡' },
];

const FEATURED_BIKES = [
  'Honda Activa 6G',
  'Royal Enfield Classic 350',
  'Ola S1 Pro',
  'Bajaj Pulsar NS200',
  'Ather 450X',
  'KTM Duke 390',
];

function FeaturedBikeCard({ bike, navigate, toggleWatchlist, isWatchlisted }) {
  const saved = isWatchlisted(bike);
  return (
    <div
      className="card glow"
      style={{ flexShrink: 0, width: 200, cursor: 'pointer' }}
      onClick={() => navigate('bike', bike)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
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
      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, marginBottom: 2 }}>{bike.name}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 8 }}>{bike.brand}</div>
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

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    setLoadingFeatured(true);
    setFeaturedError(false);
    setFeaturedBikes([]);
    try {
      // Load first 3 quickly, then rest
      const first3 = await Promise.all(
        FEATURED_BIKES.slice(0, 3).map(name => searchBikeInfo(name))
      );
      const validFirst = first3.filter(Boolean);
      setFeaturedBikes(validFirst);
      setLoadingFeatured(false);

      // Load remaining in background
      const rest = await Promise.all(
        FEATURED_BIKES.slice(3).map(name => searchBikeInfo(name))
      );
      const validRest = rest.filter(Boolean);
      setFeaturedBikes(prev => [...prev, ...validRest]);
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
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '28px 20px',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 150, height: 150,
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
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

      {/* Quick Tools */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>Quick Tools</div>
        <div className="grid-2">
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('commute')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(0,212,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={18} color="var(--accent)" />
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>Commute Finder</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>AI picks your best bike</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('quiz')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(179,136,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                🎯
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>Bike Quiz</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Find your perfect match</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('firstbike')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(0,230,118,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                🌱
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>First Bike Finder</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>For students & beginners</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('insurance')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(0,230,118,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                🛡️
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>Insurance Estimator</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Calculate your premium</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('resale')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(179,136,255,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                📉
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>Resale Predictor</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Know your bike's worth</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('ownership')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, background: 'rgba(255,107,53,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={18} color="var(--accent3)" />
              </div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem' }}>Cost Calculator</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>True ownership cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Browse Bikes - Trending/Popular/Electric/Upcoming */}
      <FeaturedSection navigate={navigate} />

      {/* Featured Bikes */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 0 }}>
            🔥 Featured This Week
          </div>
          <button
            className="icon-btn"
            style={{ width: 30, height: 30 }}
            onClick={loadFeatured}
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {loadingFeatured && featuredBikes.length === 0 && (
          <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flexShrink: 0, width: 200, height: 160,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 16, animation: 'pulse 1.5s ease infinite',
                animationDelay: `${i * 0.2}s`
              }} />
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
              <FeaturedBikeCard
                key={i}
                bike={bike}
                navigate={navigate}
                toggleWatchlist={toggleWatchlist}
                isWatchlisted={isWatchlisted}
              />
            ))}
            {loadingFeatured && (
              <div style={{
                flexShrink: 0, width: 200, height: 160,
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
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
            <div
              key={cat.label}
              onClick={() => navigate('search', { autoSearch: true, query: cat.query })}
              style={{
                flexShrink: 0,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: '12px 16px',
                cursor: 'pointer',
                textAlign: 'center',
                minWidth: 90,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{cat.icon}</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text2)' }}>{cat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>
          <TrendingUp size={16} color="var(--accent3)" />
          Trending Searches
        </div>
        <div className="chip-row">
          {POPULAR_SEARCHES.map(name => (
            <span
              key={name}
              className="chip"
              onClick={() => navigate('search', { autoSearch: true, query: name })}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ fontSize: '1rem' }}>All Brands</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {BRANDS.map(brand => (
            <div
              key={brand.name}
              className="card"
              style={{ padding: '10px 8px', textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate('search', { autoSearch: true, query: `${brand.name} bike` })}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{brand.emoji}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text2)', lineHeight: 1.2 }}>{brand.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* News teaser */}
      <div
        className="card"
        style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,107,53,0.04))' }}
        onClick={() => navigate('news')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>
              📰 Latest 2-Wheeler News
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text2)' }}>Launches, updates & reviews — live</div>
          </div>
          <ChevronRight size={20} color="var(--accent)" />
        </div>
      </div>
    </div>
  );
}
