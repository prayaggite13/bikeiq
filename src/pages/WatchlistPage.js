import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import BikeCard from '../components/BikeCard';

export default function WatchlistPage({ watchlist, toggleWatchlist, isWatchlisted, addToCompare, navigate }) {
  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          <Heart size={18} color="var(--accent3)" fill="var(--accent3)" />
          Saved Bikes
        </div>
        {watchlist.length > 0 && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{watchlist.length} bike{watchlist.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">❤️</div>
          <h3>No saved bikes</h3>
          <p>Tap the heart icon on any bike to save it here for easy access</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('search')}>
            Browse Bikes
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {watchlist.map((bike, i) => (
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
    </div>
  );
}
