import React, { useState } from 'react';
import { Heart, GitCompare, ArrowLeft, Zap, Star, AlertTriangle, CheckCircle, TrendingDown, Share2, Bell } from 'lucide-react';
import { formatINR, calculateOwnershipCost, calculateSubsidy } from '../utils/calculator';
import { savePriceAlert } from '../utils/supabase';
import { askGemini } from '../utils/gemini';

const TABS = ['Specs', 'Variants', 'Prices', 'Mileage', 'Features', 'Safety', 'EV', 'Rivals', 'AI Review'];

export default function BikeDetailPage({ selectedBike: bike, navigate, toggleWatchlist, isWatchlisted, addToCompare }) {
  const [tab, setTab] = useState('Specs');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [aiReview, setAiReview] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [dailyKm, setDailyKm] = useState(30);

  if (!bike) return <div className="page"><div className="empty"><div className="empty-icon">🏍️</div><h3>No bike selected</h3></div></div>;

  const saved = isWatchlisted(bike);
  const subsidy = calculateSubsidy(bike);
  const ownership = calculateOwnershipCost({ bike, dailyKm });

  const fetchAIReview = async () => {
    setAiLoading(true);
    const review = await askGemini(
      `Give a comprehensive expert review of the ${bike.name} for Indian buyers. Cover: performance, real-world mileage, comfort, build quality, value for money, who should buy it, and who shouldn't. Be honest and specific. Format with clear sections.`,
      'You are BikeIQ, India\'s most trusted 2-wheeler expert with 15 years of experience testing bikes across Indian conditions.'
    );
    setAiReview(review);
    setAiLoading(false);
  };

  const handleAlert = async () => {
    if (!alertEmail) return;
    await savePriceAlert(alertEmail, bike.name);
    setAlertSent(true);
  };

  const visibleTabs = TABS.filter(t => {
    if (t === 'EV') return bike.fuelType === 'Electric';
    if (t === 'Mileage') return bike.fuelType !== 'Electric';
    return true;
  });

  return (
    <div className="page fade-in">
      {/* Back */}
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate('search')}>
        <ArrowLeft size={14} /> Back
      </button>

      {/* Hero card */}
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(255,107,53,0.03))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <span className={`tag ${bike.fuelType === 'Electric' ? 'tag-ev' : 'tag-petrol'}`} style={{ marginBottom: 8, display: 'inline-flex' }}>
              {bike.fuelType === 'Electric' ? '⚡ Electric' : '⛽ Petrol'} · {bike.type}
            </span>
            <h1 style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, lineHeight: 1.1 }}>{bike.name}</h1>
            <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginTop: 2 }}>{bike.brand} · {bike.launchYear}</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className={`icon-btn ${saved ? 'active' : ''}`} onClick={() => toggleWatchlist(bike)}>
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
            </button>
            <button className="icon-btn" onClick={() => addToCompare(bike)}>
              <GitCompare size={16} />
            </button>
            <button className="icon-btn" onClick={() => navigator.share?.({ title: bike.name, url: window.location.href })}>
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {bike.tagline && <p style={{ fontSize: '0.82rem', color: 'var(--text2)', fontStyle: 'italic', marginBottom: 12 }}>"{bike.tagline}"</p>}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span className="price-big">{formatINR(bike.basePrice)}</span>
          {bike.topPrice && <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>– {formatINR(bike.topPrice)}</span>}
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>ex-showroom</span>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {bike.ownerRating && (
            <div className="rating">
              <span className="stars">★</span>
              <span className="rating-num">{bike.ownerRating}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>({bike.totalReviews?.toLocaleString()})</span>
            </div>
          )}
          {bike.specs?.abs && <span className="tag tag-new" style={{ fontSize: '0.65rem' }}>ABS</span>}
          {bike.status === 'Upcoming' && <span className="tag tag-upcoming">Upcoming</span>}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-2" style={{ marginBottom: 16, gap: 8 }}>
        {bike.mileage && <>
          <div className="stat-box"><div className="stat-value">{bike.mileage.claimed}</div><div className="stat-label">ARAI Mileage</div></div>
          <div className="stat-box"><div className="stat-value" style={{ color: 'var(--green)' }}>{bike.mileage.realWorld}</div><div className="stat-label">Real World</div></div>
        </>}
        {bike.evSpecs && <>
          <div className="stat-box"><div className="stat-value">{bike.evSpecs.range?.claimed}</div><div className="stat-label">Claimed Range</div></div>
          <div className="stat-box"><div className="stat-value" style={{ color: 'var(--green)' }}>{bike.evSpecs.range?.realWorld}</div><div className="stat-label">Real Range</div></div>
        </>}
        {bike.specs?.power && <div className="stat-box"><div className="stat-value">{bike.specs.power}</div><div className="stat-label">Max Power</div></div>}
        {bike.specs?.torque && <div className="stat-box"><div className="stat-value">{bike.specs.torque}</div><div className="stat-label">Max Torque</div></div>}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 16 }}>
        {visibleTabs.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); if (t === 'AI Review' && !aiReview) fetchAIReview(); }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="fade-in" key={tab}>
        {/* SPECS */}
        {tab === 'Specs' && bike.specs && (
          <div className="card">
            {Object.entries(bike.specs).filter(([k]) => k !== 'abs').map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text3)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                <span style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'JetBrains Mono' }}>{String(val)}</span>
              </div>
            ))}
          </div>
        )}

        {/* VARIANTS */}
        {tab === 'Variants' && bike.variants && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bike.variants.map((v, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem' }}>{v.name}</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{formatINR(v.price)}</span>
                </div>
                {v.features?.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <CheckCircle size={12} color="var(--green)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{f}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PRICES */}
        {tab === 'Prices' && bike.cityPrices && (
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 12 }}>On-road prices vary by city (RTO + insurance). These are estimated ex-showroom prices.</div>
              {Object.entries(bike.cityPrices).map(([city, price]) => (
                <div key={city} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text2)' }}>📍 {city}</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{formatINR(price)}</span>
                </div>
              ))}
            </div>
            {/* Price alert */}
            <div className="card" style={{ background: 'rgba(0,212,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Bell size={16} color="var(--accent)" />
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>Price Drop Alert</span>
              </div>
              {alertSent ? (
                <div style={{ color: 'var(--green)', fontSize: '0.85rem' }}>✅ Alert set! We'll notify you.</div>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={alertEmail}
                    onChange={e => setAlertEmail(e.target.value)}
                    style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleAlert}>Set Alert</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MILEAGE */}
        {tab === 'Mileage' && bike.mileage && (
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', padding: '12px 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '2rem', fontWeight: 700, color: 'var(--text2)' }}>{bike.mileage.claimed}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ARAI Claimed</div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '2rem', fontWeight: 700, color: 'var(--green)' }}>{bike.mileage.realWorld}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Real World</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div style={{ marginBottom: 12, fontFamily: 'Rajdhani', fontWeight: 700 }}>Fuel Cost Calculator</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text2)' }}>
                  <span>Daily km: <strong style={{ color: 'var(--accent)' }}>{dailyKm} km</strong></span>
                </div>
                <input type="range" min={5} max={150} value={dailyKm} onChange={e => setDailyKm(+e.target.value)} />
              </div>
              <div className="grid-2" style={{ gap: 8 }}>
                <div className="stat-box">
                  <div className="stat-value">₹{Math.round((dailyKm / parseFloat(bike.mileage.realWorld)) * 106)}</div>
                  <div className="stat-label">Daily Fuel Cost</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value">₹{Math.round((dailyKm * 30 / parseFloat(bike.mileage.realWorld)) * 106).toLocaleString()}</div>
                  <div className="stat-label">Monthly Cost</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEATURES */}
        {tab === 'Features' && (
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10 }}>Features</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {bike.features?.map((f, i) => (
                  <span key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: '0.78rem', color: 'var(--text2)' }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--green)' }}>Pros</div>
              {bike.pros?.map((p, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><CheckCircle size={14} color="var(--green)" /><span style={{ fontSize: '0.85rem' }}>{p}</span></div>)}
            </div>
            <div className="card">
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--red)' }}>Cons</div>
              {bike.cons?.map((c, i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><AlertTriangle size={14} color="var(--red)" /><span style={{ fontSize: '0.85rem' }}>{c}</span></div>)}
            </div>
          </div>
        )}

        {/* SAFETY */}
        {tab === 'Safety' && (
          <div className="card">
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 12 }}>Safety Features</div>
            {bike.safetyFeatures?.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, background: 'rgba(0,230,118,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={14} color="var(--green)" />
                </div>
                <span style={{ fontSize: '0.85rem' }}>{f}</span>
              </div>
            ))}
            {bike.commonIssues && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--yellow)' }}>Known Issues</div>
                {bike.commonIssues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <AlertTriangle size={14} color="var(--yellow)" />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EV TAB */}
        {tab === 'EV' && bike.evSpecs && (
          <div>
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 12, color: 'var(--green)' }}>⚡ EV Specifications</div>
              {[
                ['Battery', bike.evSpecs.batteryCapacity],
                ['Claimed Range', bike.evSpecs.range?.claimed],
                ['Real World Range', bike.evSpecs.range?.realWorld],
                ['Slow Charging', bike.evSpecs.chargingTime?.slow],
                ['Fast Charging', bike.evSpecs.chargingTime?.fast],
                ['Top Speed', bike.evSpecs.topSpeed],
              ].map(([label, val]) => val && (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>{label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: 'var(--green)' }}>{val}</span>
                </div>
              ))}
            </div>
            {/* Subsidy calculator */}
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10 }}>🏛️ Subsidy Calculator</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>FAME II Subsidy</span>
                <span style={{ color: 'var(--green)', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>-{formatINR(subsidy.fameSubsidy)}</span>
              </div>
              {Object.entries(subsidy.stateSubsidies).map(([state, amt]) => amt > 0 && (
                <div key={state} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>{state} State</span>
                  <span style={{ color: 'var(--green)', fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>-{formatINR(amt)}</span>
                </div>
              ))}
            </div>
            {/* Range anxiety */}
            <div className="card">
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10 }}>Range Anxiety Check</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text2)' }}>
                  <span>Daily km: <strong style={{ color: 'var(--accent)' }}>{dailyKm} km</strong></span>
                </div>
                <input type="range" min={5} max={150} value={dailyKm} onChange={e => setDailyKm(+e.target.value)} />
              </div>
              {(() => {
                const realRange = parseFloat(bike.evSpecs?.range?.realWorld) || 100;
                const fits = dailyKm <= realRange * 0.8;
                return (
                  <div style={{ background: fits ? 'rgba(0,230,118,0.08)' : 'rgba(255,82,82,0.08)', border: `1px solid ${fits ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)'}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{fits ? '✅' : '⚠️'}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, color: fits ? 'var(--green)' : 'var(--red)' }}>
                      {fits ? 'This EV fits your commute!' : 'Range might be tight'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: 4 }}>
                      {fits ? `You use ${dailyKm}km, real range is ${realRange}km. Comfortable.` : `Daily ${dailyKm}km vs ~${realRange}km real range. Consider charging options.`}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* RIVALS */}
        {tab === 'Rivals' && bike.rivals && (
          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 12 }}>Tap a rival to look it up</p>
            {bike.rivals.map((rival, i) => (
              <div
                key={i}
                className="card"
                style={{ marginBottom: 10, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => navigate('search', { query: rival })}
              >
                <div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{rival}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Tap to search →</div>
                </div>
                <GitCompare size={16} color="var(--accent)" />
              </div>
            ))}
          </div>
        )}

        {/* AI REVIEW */}
        {tab === 'AI Review' && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Zap size={16} color="var(--accent)" />
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>AI Expert Review</span>
              <span className="tag tag-new" style={{ fontSize: '0.65rem' }}>Powered by Gemini</span>
            </div>
            {aiLoading && <div className="loading"><div className="spinner" /><div style={{ fontSize: '0.82rem' }}>Generating review...</div></div>}
            {aiReview && <div style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text2)', whiteSpace: 'pre-wrap' }}>{aiReview}</div>}
            {!aiLoading && !aiReview && (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={fetchAIReview}>
                <Zap size={14} /> Generate AI Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
