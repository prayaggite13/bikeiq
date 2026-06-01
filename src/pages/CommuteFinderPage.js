import React, { useState } from 'react';
import { Navigation, Zap, ChevronRight } from 'lucide-react';
import { getCommuteRecommendations } from '../utils/gemini';
import { formatINR } from '../utils/calculator';

export default function CommuteFinderPage({ navigate, addToCompare }) {
  const [step, setStep] = useState(1);
  const [dailyKm, setDailyKm] = useState(30);
  const [roadType, setRoadType] = useState('City roads');
  const [budget, setBudget] = useState(150000);
  const [preference, setPreference] = useState('Comfort & practicality');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const roadTypes = ['City roads', 'Highway mostly', 'Mixed city+highway', 'Rough/rural roads'];
  const preferences = ['Comfort & practicality', 'Performance & sporty', 'Maximum mileage', 'EV only', 'Low maintenance', 'Style & looks'];

  const handleFind = async () => {
    setLoading(true);
    const recs = await getCommuteRecommendations(dailyKm, roadType, budget, preference);
    setResults(recs);
    setLoading(false);
    setStep(3);
  };

  const getFitColor = (score) => {
    if (score >= 85) return 'var(--green)';
    if (score >= 70) return 'var(--yellow)';
    return 'var(--accent3)';
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(0,212,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={20} color="var(--accent)" />
        </div>
        <div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem' }}>Commute Finder</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>AI picks the perfect bike for your commute</div>
        </div>
      </div>

      {step < 3 && (
        <div className="card" style={{ marginBottom: 16 }}>
          {/* Step 1 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>
              1. Daily Commute Distance
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text2)' }}>
              <span>5 km</span>
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>{dailyKm} km/day</span>
              <span>150 km</span>
            </div>
            <input type="range" min={5} max={150} step={5} value={dailyKm} onChange={e => setDailyKm(+e.target.value)} />
          </div>

          {/* Step 2 - Road type */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>
              2. Typical Road Type
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {roadTypes.map(rt => (
                <div
                  key={rt}
                  onClick={() => setRoadType(rt)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: `1px solid ${roadType === rt ? 'var(--accent)' : 'var(--border)'}`,
                    background: roadType === rt ? 'rgba(0,212,255,0.08)' : 'var(--bg3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', color: roadType === rt ? 'var(--accent)' : 'var(--text2)', fontWeight: roadType === rt ? 600 : 400 }}>{rt}</span>
                  {roadType === rt && <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 8, color: 'var(--accent)' }}>
              3. Budget
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text2)' }}>
              <span>₹50K</span>
              <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent)', fontWeight: 700, fontSize: '1.1rem' }}>{formatINR(budget)}</span>
              <span>₹10L</span>
            </div>
            <input type="range" min={50000} max={1000000} step={10000} value={budget} onChange={e => setBudget(+e.target.value)} />
          </div>

          {/* Preference */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>
              4. What matters most to you?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {preferences.map(p => (
                <span
                  key={p}
                  className={`chip ${preference === p ? 'active' : ''}`}
                  onClick={() => setPreference(p)}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleFind} disabled={loading}>
            <Zap size={16} /> Find My Perfect Bike
          </button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.85rem' }}>AI is finding your best match...</div>
        </div>
      )}

      {step === 3 && results.length > 0 && (
        <div className="fade-in">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-title" style={{ marginBottom: 0 }}>Top Picks for You</div>
            <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>Edit</button>
          </div>

          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: '0.78rem', color: 'var(--text2)' }}>
            📍 {dailyKm}km/day · {roadType} · {formatINR(budget)} budget · {preference}
          </div>

          {results.map((bike, i) => (
            <div key={i} className="card glow fade-in" style={{ marginBottom: 12, animationDelay: `${i * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ background: 'var(--accent)', color: '#000', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                      {bike.rank}
                    </span>
                    <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem' }}>{bike.name}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{bike.brand} · {bike.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent)', fontWeight: 700 }}>{formatINR(bike.price)}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>ex-showroom</div>
                </div>
              </div>

              {/* Fit score */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commute Fit Score</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: getFitColor(bike.fitScore), fontWeight: 700 }}>{bike.fitScore}/100</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${bike.fitScore}%`, background: getFitColor(bike.fitScore) }} />
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10 }}>{bike.whyFit}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {bike.pros?.slice(0, 3).map((p, j) => (
                  <span key={j} style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 8, padding: '3px 8px', fontSize: '0.7rem', color: 'var(--green)' }}>
                    ✓ {p}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => navigate('search', { query: bike.name })}>
                  View Details <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))}

          <button className="btn btn-outline" style={{ width: '100%', marginTop: 8 }} onClick={() => { setStep(1); setResults([]); }}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
