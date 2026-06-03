import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import BikeCard from '../components/BikeCard';

const ALL_SUGGESTIONS = [
  'Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan',
  'Royal Enfield Hunter 350', 'Royal Enfield Thunderbird', 'Royal Enfield Bullet 350',
  'Honda Activa 6G', 'Honda SP 125', 'Honda Shine', 'Honda CB350', 'Honda CB350RS',
  'Honda Hornet 2.0', 'Honda CB500F', 'Honda Africa Twin',
  'TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Apache RR 310', 'TVS Ntorq 125',
  'TVS Jupiter 125', 'TVS Raider 125', 'TVS Ronin', 'TVS iQube Electric',
  'Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R',
  'Hero Xpulse 200', 'Hero Destini 125', 'Hero Maestro Edge',
  'Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Pulsar N160', 'Bajaj Dominar 400',
  'Bajaj Avenger 220', 'Bajaj CT110', 'Bajaj Chetak Electric',
  'Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125',
  'Yamaha RayZR 125', 'Yamaha R3', 'Yamaha MT-03',
  'KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM RC 200',
  'KTM 390 Adventure',
  'Ola S1 Pro', 'Ola S1 Air', 'Ola S1 X',
  'Ather 450X', 'Ather 450S', 'Ather Rizta',
  'Simple One', 'Revolt RV400', 'Bajaj Chetak',
  'BMW G 310 R', 'BMW G 310 GS', 'Kawasaki Ninja 300', 'Kawasaki Z400',
  'Triumph Speed 400', 'Triumph Scrambler 400', 'Jawa 42', 'Jawa Perak',
  'Suzuki Gixxer SF', 'Suzuki Gixxer 250', 'Suzuki Access 125',
];

const BRAND_BIKES = {
  'hero': ['Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R', 'Hero Xpulse 200'],
  'honda': ['Honda Activa 6G', 'Honda SP 125', 'Honda Shine', 'Honda CB350', 'Honda Hornet 2.0'],
  'tvs': ['TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Ntorq 125', 'TVS Jupiter 125', 'TVS Raider 125'],
  'bajaj': ['Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Dominar 400', 'Bajaj Avenger 220', 'Bajaj Chetak Electric'],
  'royal enfield': ['Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan', 'Royal Enfield Hunter 350', 'Royal Enfield Bullet 350'],
  'yamaha': ['Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125', 'Yamaha RayZR 125'],
  'ktm': ['KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM 390 Adventure'],
  'ola': ['Ola S1 Pro', 'Ola S1 Air', 'Ola S1 X'],
  'ather': ['Ather 450X', 'Ather 450S', 'Ather Rizta'],
  'suzuki': ['Suzuki Gixxer SF', 'Suzuki Gixxer 250', 'Suzuki Access 125'],
  'kawasaki': ['Kawasaki Ninja 300', 'Kawasaki Z400', 'Kawasaki Ninja 650'],
  'bmw': ['BMW G 310 R', 'BMW G 310 GS', 'BMW F 900 R'],
  'triumph': ['Triumph Speed 400', 'Triumph Scrambler 400', 'Triumph Tiger Sport 660'],
  'jawa': ['Jawa 42', 'Jawa Perak', 'Jawa 350'],
  'simple energy': ['Simple One'],
  'revolt': ['Revolt RV400', 'Revolt RV300'],
  'harley-davidson': ['Harley-Davidson X440', 'Harley-Davidson Iron 883'],
};

function getBrandBikes(query) {
  const q = query.toLowerCase().trim();
  for (const [brand, bikes] of Object.entries(BRAND_BIKES)) {
    if (q === brand || q === brand + ' bike' || q === brand + ' bikes') {
      return { isBrand: true, brand, bikes };
    }
  }
  return { isBrand: false };
}

export default function SearchPage({ navigate, selectedBike, toggleWatchlist, isWatchlisted, addToCompare }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [brandMode, setBrandMode] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (selectedBike?.autoSearch && selectedBike?.query) {
      const q = selectedBike.query;
      setQuery(q);
      setLoading(true);
      setSearched(true);
      triggerSearch(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerSearch = async (q) => {
    setShowSuggestions(false);
    setError('');
    setResults([]);
    setBrandMode(null);

    const { isBrand, brand, bikes } = getBrandBikes(q);

    if (isBrand) {
      // Brand mode — load bikes one by one to avoid rate limits
      setBrandMode(brand);
      setLoading(true);
      setSearched(true);

      // Load first bike immediately
      const firstBike = await searchBikeInfo(bikes[0]);
      if (firstBike) setResults([firstBike]);
      setLoading(false);

      // Load rest one by one with small delay
      setLoadingMore(true);
      for (let i = 1; i < bikes.length; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const bike = await searchBikeInfo(bikes[i]);
        if (bike) setResults(prev => [...prev, bike]);
      }
      setLoadingMore(false);
    } else {
      // Single bike search
      setLoading(true);
      setSearched(true);
      const bike = await searchBikeInfo(q);
      if (bike) {
        setResults([bike]);
      } else {
        setError('Could not find info on this bike. Try a specific name like "Honda Activa 6G".');
      }
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    triggerSearch(query);
  };

  const handleInputChange = (val) => {
    setQuery(val);
    if (val.length >= 2) {
      const filtered = ALL_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    triggerSearch(s);
  };

  return (
    <div className="page">
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <div className="search-bar">
          <Search size={18} color="var(--text3)" />
          <input
            ref={inputRef}
            placeholder="Search bike, brand, or model..."
            value={query}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); if (e.key === 'Escape') setShowSuggestions(false); }}
            onFocus={() => query.length >= 2 && setShowSuggestions(suggestions.length > 0)}
            autoFocus
          />
          {query && (
            <button className="icon-btn" style={{ width: 28, height: 28 }}
              onClick={() => { setQuery(''); setResults([]); setSearched(false); setBrandMode(null); setShowSuggestions(false); }}>
              <X size={14} />
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSearch} style={{ flexShrink: 0 }}>Go</button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 12, marginTop: 6, overflow: 'hidden',
            boxShadow: 'var(--shadow)'
          }}>
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: '10px 16px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Search size={13} color="var(--text3)" />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>{s}</span>
                </div>
                <ChevronRight size={14} color="var(--text3)" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brand mode header */}
      {brandMode && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'capitalize' }}>
            🏍️ Showing all {brandMode.charAt(0).toUpperCase() + brandMode.slice(1)} bikes
          </span>
          {loadingMore && <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Loading more...</span>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.85rem' }}>
            {brandMode ? `Loading ${brandMode} bikes...` : 'Fetching bike data with AI...'}
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="empty">
          <div className="empty-icon">😕</div>
          <h3>Not Found</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div className="fade-in">
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 12 }}>
            {brandMode ? `${results.length} bikes found` : 'Search Result'}
            {loadingMore && <span style={{ fontSize: '0.72rem', color: 'var(--text3)', fontFamily: 'DM Sans', fontWeight: 400, marginLeft: 8 }}>loading more...</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((bike, i) => (
              <BikeCard
                key={i}
                bike={bike}
                navigate={navigate}
                toggleWatchlist={toggleWatchlist}
                isWatchlisted={isWatchlisted}
                addToCompare={addToCompare}
              />
            ))}
          </div>
          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', gap: 8, alignItems: 'center', color: 'var(--text3)', fontSize: '0.82rem' }}>
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Loading more bikes...
            </div>
          )}
        </div>
      )}

      {/* Suggestions when empty */}
      {!searched && !loading && (
        <div>
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 10 }}>Popular Bikes</div>
          <div className="chip-row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {ALL_SUGGESTIONS.slice(0, 20).map(s => (
              <span key={s} className="chip" onClick={() => { setQuery(s); triggerSearch(s); }}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
