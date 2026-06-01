import React from 'react';
import { Heart, GitCompare, Star, Zap, Fuel } from 'lucide-react';
import { formatINR } from '../utils/calculator';

export default function BikeCard({ bike, navigate, toggleWatchlist, isWatchlisted, addToCompare, compact = false }) {
  const saved = isWatchlisted(bike);

  return (
    <div
      className="card glow fade-in"
      style={{ cursor: 'pointer', position: 'relative' }}
      onClick={() => navigate('bike', bike)}
    >
      {/* Fuel type tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span className={`tag ${bike.fuelType === 'Electric' ? 'tag-ev' : 'tag-petrol'}`}>
          {bike.fuelType === 'Electric' ? <><Zap size={10} /> EV</> : <><Fuel size={10} /> Petrol</>}
        </span>
        <span className="tag" style={{ background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)', fontSize: '0.68rem' }}>
          {bike.type}
        </span>
      </div>

      {/* Bike name */}
      <h3 style={{ fontFamily: 'Rajdhani', fontSize: '1.15rem', fontWeight: 700, marginBottom: 2, lineHeight: 1.2 }}>
        {bike.name}
      </h3>
      <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 10 }}>{bike.brand}</p>

      {/* Price */}
      <div style={{ marginBottom: 10 }}>
        <span className="price-big" style={{ fontSize: '1.4rem' }}>{formatINR(bike.basePrice)}</span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text3)', marginLeft: 4 }}>ex-showroom</span>
      </div>

      {/* Quick stats */}
      {!compact && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 12 }}>
          {bike.mileage && (
            <div className="stat-box" style={{ padding: 8 }}>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{bike.mileage.claimed}</div>
              <div className="stat-label">Claimed</div>
            </div>
          )}
          {bike.evSpecs && (
            <div className="stat-box" style={{ padding: 8 }}>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{bike.evSpecs.range?.claimed}</div>
              <div className="stat-label">Range</div>
            </div>
          )}
          {bike.specs?.power && (
            <div className="stat-box" style={{ padding: 8 }}>
              <div className="stat-value" style={{ fontSize: '1rem' }}>{bike.specs.power}</div>
              <div className="stat-label">Power</div>
            </div>
          )}
          {bike.ownerRating && (
            <div className="stat-box" style={{ padding: 8 }}>
              <div className="stat-value" style={{ fontSize: '1rem', color: 'var(--yellow)' }}>★ {bike.ownerRating}</div>
              <div className="stat-label">Rating</div>
            </div>
          )}
        </div>
      )}

      {/* Tagline */}
      {bike.tagline && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 12, fontStyle: 'italic' }}>"{bike.tagline}"</p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
        <button
          className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => toggleWatchlist(bike)}
          style={{ flex: 1 }}
        >
          <Heart size={13} fill={saved ? 'currentColor' : 'none'} />
          {saved ? 'Saved' : 'Save'}
        </button>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => addToCompare(bike)}
          style={{ flex: 1 }}
        >
          <GitCompare size={13} />
          Compare
        </button>
      </div>
    </div>
  );
}
