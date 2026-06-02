import React, { useState } from 'react';
import { Search, Zap, TrendingUp, Navigation, Calculator, ChevronRight } from 'lucide-react';

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

export default function HomePage({ navigate }) {
  const [query, setQuery] = useState('');

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

        {/* Search */}
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
