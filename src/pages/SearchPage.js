import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, Clock } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import BikeCard from '../components/BikeCard';

const ALL_SUGGESTIONS = [
  'Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan',
  'Royal Enfield Hunter 350', 'Royal Enfield Thunderbird', 'Royal Enfield Bullet 350',
  'Royal Enfield Guerrilla 450', 'Royal Enfield Bear 650',
  'Honda Activa 6G', 'Honda SP 125', 'Honda Shine', 'Honda CB350', 'Honda CB350RS',
  'Honda Hornet 2.0', 'Honda CB500F', 'Honda Africa Twin', 'Honda CB300R',
  'TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Apache RR 310', 'TVS Ntorq 125',
  'TVS Jupiter 125', 'TVS Raider 125', 'TVS Ronin', 'TVS iQube Electric',
  'Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R',
  'Hero Xpulse 200', 'Hero Destini 125', 'Hero Maestro Edge', 'Hero Vida V2',
  'Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Pulsar N160', 'Bajaj Dominar 400',
  'Bajaj Avenger 220', 'Bajaj CT110', 'Bajaj Chetak Electric', 'Bajaj Pulsar NS400Z',
  'Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125',
  'Yamaha RayZR 125', 'Yamaha R3', 'Yamaha MT-03', 'Yamaha FZ 25',
  'KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM RC 200',
  'KTM 390 Adventure', 'KTM 250 Adventure',
  'Ola S1 Pro', 'Ola S1 Air', 'Ola S1 X',
  'Ather 450X', 'Ather 450S', 'Ather Rizta',
  'Simple One', 'Revolt RV400', 'Bajaj Chetak',
  'BMW G 310 R', 'BMW G 310 GS', 'Kawasaki Ninja 300', 'Kawasaki Z400',
  'Triumph Speed 400', 'Triumph Scrambler 400', 'Jawa 42', 'Jawa Perak',
  'Suzuki Gixxer SF', 'Suzuki Gixxer 250', 'Suzuki Access 125',
  'Harley-Davidson X440', 'Harley-Davidson Iron 883',
];

// Brand color dots for suggestions
const BRAND_COLOR = {
  'Royal Enfield': '#6b6b6b', 'Honda': '#cc0000', 'TVS': '#f9a825',
  'Hero': '#1565c0', 'Bajaj': '#e65100', 'Yamaha': '#1565c0',
  'KTM': '#e65100', 'Ola': '#1b5e20', 'Ather': '#1b5e20',
  'Simple': '#1b5e20', 'Revolt': '#1b5e20', 'BMW': '#1565c0',
  'Kawasaki': '#1b5e20', 'Triumph': '#cc0000', 'Jawa': '#cc0000',
  'Suzuki': '#1a1a1a', 'Harley-Davidson': '#e65100',
};

function getBrandColor(name) {
  for (const [brand, color] of Object.entries(BRAND_COLOR)) {
    if (name.startsWith(brand)) return color;
  }
  return 'var(--text3)';
}

function getBrandInitial(name) {
  return name[0].toUpperCase();
}

// Bold the matching part of a suggestion
function HighlightMatch({ text, query }) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ color: 'var(--accent)' }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

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

const MAX_RECENT = 6;

function getRecent() {
  try { return JSON.parse(localStorage.getItem('bikeiq_recent') || '[]'); } catch { return []; }
}
function saveRecent(query) {
  const prev = getRecent().filter(q => q !== query);
  const next = [query, ...prev].slice(0, MAX_RECENT);
  localStorage.setItem('bikeiq_recent', JSON.stringify(next));
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
  const [activeIdx, setActiveIdx] = useState(-1); // keyboard nav
  const [recentSearches, setRecentSearches] = useState(getRecent());
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const triggerSearch = async (q) => {
    setShowSuggestions(false);
    setActiveIdx(-1);
    setError('');
    setResults([]);
    setBrandMode(null);
    saveRecent(q);
    setRecentSearches(getRecent());

    const { isBrand, brand, bikes } = getBrandBikes(q);

    if (isBrand) {
      setBrandMode(brand);
      setLoading(true);
      setSearched(true);
      const topBikes = bikes.slice(0, 3);
      const firstBike = await searchBikeInfo(topBikes[0]);
      if (firstBike) setResults([firstBike]);
      setLoading(false);
      setLoadingMore(true);
      for (let i = 1; i < topBikes.length; i++) {
        await new Promise(r => setTimeout(r, 1200));
        const bike = await searchBikeInfo(topBikes[i]);
        if (bike) setResults(prev => [...prev, bike]);
      }
      setLoadingMore(false);
    } else {
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
    setActiveIdx(-1);
    if (val.length >= 1) {
      const filtered = ALL_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(recentSearches.length > 0); // show recent when empty
    }
  };

  const handleFocus = () => {
    if (query.length >= 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (query.length === 0 && recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    triggerSearch(s);
  };

  const clearRecent = () => {
    localStorage.removeItem('bikeiq_recent');
    setRecentSearches([]);
    setShowSuggestions(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const items = query.length === 0 ? recentSearches : suggestions;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, items.length - 1));
      setShowSuggestions(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && items[activeIdx]) {
        handleSuggestionClick(items[activeIdx]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIdx(-1);
    }
  };

  const displayItems = query.length === 0 ? recentSearches : suggestions;
  const isRecent = query.length === 0;

  return (
    <div className="page">
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <div className="search-bar" style={{ borderColor: showSuggestions ? 'var(--accent)' : undefined }}>
          <Search size={18} color="var(--text3)" />
          <input
            ref={inputRef}
            placeholder="Search bike, brand, or model..."
            value={query}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            autoFocus
          />
          {query && (
            <button className="icon-btn" style={{ width: 28, height: 28 }}
              onClick={() => {
                setQuery(''); setResults([]); setSearched(false);
                setBrandMode(null); setSuggestions([]);
                setShowSuggestions(recentSearches.length > 0);
                inputRef.current?.focus();
              }}>
              <X size={14} />
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={handleSearch} style={{ flexShrink: 0 }}>Go</button>
        </div>

        {/* Suggestions / Recent dropdown */}
        {showSuggestions && displayItems.length > 0 && (
          <div ref={dropdownRef} style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 14, marginTop: 6, overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            {/* Header row for recent */}
            {isRecent && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 14px 4px',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Recent Searches
                </span>
                <span onClick={clearRecent} style={{ fontSize: 11, color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
                  Clear
                </span>
              </div>
            )}

            {displayItems.map((s, i) => (
              <div
                key={i}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  borderBottom: i < displayItems.length - 1 ? '1px solid var(--border)' : 'none',
                  background: activeIdx === i ? 'var(--bg3)' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(-1)}
              >
                {/* Brand dot or clock icon */}
                {isRecent ? (
                  <Clock size={13} color="var(--text3)" style={{ flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                    background: getBrandColor(s),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: '#fff',
                  }}>
                    {getBrandInitial(s)}
                  </div>
                )}

                {/* Text with bold match */}
                <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text)' }}>
                  {isRecent ? s : <HighlightMatch text={s} query={query} />}
                </span>

                <ChevronRight size={13} color="var(--text3)" />
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

      {/* Empty state — popular bikes */}
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
