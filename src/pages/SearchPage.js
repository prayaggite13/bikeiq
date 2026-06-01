import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { searchBikeInfo } from '../utils/gemini';
import BikeCard from '../components/BikeCard';

const SUGGESTIONS = [
  'Royal Enfield Classic 350', 'Honda Activa 6G', 'Ola S1 Pro',
  'Bajaj Pulsar NS200', 'TVS Apache RTR 160', 'Ather 450X',
  'Hero Splendor Plus', 'KTM Duke 390', 'Yamaha R15 V4',
  'Simple One EV', 'Jawa 42', 'Triumph Speed 400',
  'Kawasaki Ninja 300', 'BMW G 310 R', 'Suzuki Gixxer SF',
  'Honda CB350', 'TVS Ntorq 125', 'Bajaj Chetak Electric',
];

export default function SearchPage({ navigate, selectedBike, toggleWatchlist, isWatchlisted, addToCompare }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (selectedBike?.query) {
      const q = selectedBike.query;
      setQuery(q);
      searchBikeInfo(q).then(bike => {
        if (bike) setResults([bike]);
        setLoading(false);
        setSearched(true);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (q) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);
    setResults([]);

    const bike = await searchBikeInfo(searchQuery);
    if (bike) {
      setResults([bike]);
    } else {
      setError('Could not find info on this bike. Try a different name.');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      {/* Search bar */}
      <div className="search-bar" style={{ marginBottom: 16 }}>
        <Search size={18} color="var(--text3)" />
        <input
          placeholder="Search any bike, scooter, brand..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          autoFocus
        />
        {query && (
          <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <X size={14} />
          </button>
        )}
        <button className="btn btn-primary btn-sm" onClick={() => handleSearch()} style={{ flexShrink: 0 }}>
          Go
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.85rem' }}>Fetching bike data with AI...</div>
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
            Search Result
          </div>
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
      )}

      {/* Suggestions when empty */}
      {!searched && !loading && (
        <div>
          <div className="section-title" style={{ fontSize: '1rem', marginBottom: 10 }}>Popular Bikes</div>
          <div className="chip-row" style={{ flexWrap: 'wrap', gap: 8 }}>
            {SUGGESTIONS.map(s => (
              <span
                key={s}
                className="chip"
                onClick={() => { setQuery(s); handleSearch(s); }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
