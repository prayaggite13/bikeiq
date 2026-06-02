import React, { useState } from 'react';
import { X, Plus, GitCompare, Zap } from 'lucide-react';
import { formatINR } from '../utils/calculator';
import { comparebikes } from '../utils/gemini';

export default function ComparePage({ compareList, removeFromCompare, navigate }) {
  const [verdict, setVerdict] = useState(null);
  const [loadingVerdict, setLoadingVerdict] = useState(false);

  const fetchVerdict = async () => {
    if (compareList.length < 2) return;
    setLoadingVerdict(true);
    const result = await comparebikes(compareList[0], compareList[1]);
    setVerdict(result);
    setLoadingVerdict(false);
  };

  const specRows = [
    { label: 'Price (Base)', key: (b) => formatINR(b.basePrice), numKey: (b) => b.basePrice, lower: true },
    { label: 'Engine', key: (b) => b.specs?.engine || b.evSpecs?.batteryCapacity || '—' },
    { label: 'Power', key: (b) => b.specs?.power || '—' },
    { label: 'Torque', key: (b) => b.specs?.torque || '—' },
    { label: 'Mileage', key: (b) => b.mileage?.claimed || b.evSpecs?.range?.claimed || '—' },
    { label: 'Real Mileage', key: (b) => b.mileage?.realWorld || b.evSpecs?.range?.realWorld || '—' },
    { label: 'Weight', key: (b) => b.specs?.weight || '—' },
    { label: 'Seat Height', key: (b) => b.specs?.seatHeight || '—' },
    { label: 'ABS', key: (b) => b.specs?.abs ? '✅' : '❌' },
    { label: 'Fuel Type', key: (b) => b.fuelType || '—' },
    { label: 'Owner Rating', key: (b) => b.ownerRating ? `★ ${b.ownerRating}` : '—', numKey: (b) => b.ownerRating },
    { label: 'Service Cost', key: (b) => b.avgServiceCost ? `₹${b.avgServiceCost}` : '—', numKey: (b) => b.avgServiceCost, lower: true },
  ];

  const getBetterIdx = (row) => {
    if (!row.numKey || compareList.length < 2) return -1;
    const vals = compareList.map(b => row.numKey(b) || 0);
    const best = row.lower ? Math.min(...vals) : Math.max(...vals);
    return vals.indexOf(best);
  };

  return (
    <div className="page">
      <div className="section-title" style={{ marginBottom: 16 }}>
        <GitCompare size={18} color="var(--accent)" />
        Compare Bikes
      </div>

      {/* Bike slots */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(compareList.length + (compareList.length < 3 ? 1 : 0), 1)}, 1fr)`, gap: 8, marginBottom: 16 }}>
        {compareList.map((bike, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', position: 'relative', padding: 12 }}>
            <button
              style={{ position: 'absolute', top: 8, right: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text3)' }}
              onClick={() => removeFromCompare(bike.name)}
            >
              <X size={12} />
            </button>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {bike.fuelType === 'Electric' ? '⚡' : '⛽'} {bike.type}
            </div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2, marginBottom: 4 }}>{bike.name}</div>
            <div style={{ color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontSize: '0.85rem' }}>{formatINR(bike.basePrice)}</div>
          </div>
        ))}
        {compareList.length < 3 && (
          <div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', minHeight: 90, border: '2px dashed var(--border)', background: 'transparent' }}
            onClick={() => navigate('search')}
          >
            <Plus size={20} color="var(--text3)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Add bike</span>
          </div>
        )}
      </div>

      {compareList.length === 0 && (
        <div className="fade-in">
          <div style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,107,53,0.04))', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 20px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚖️</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem', marginBottom: 8 }}>Compare Any 2 or 3 Bikes</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
              Get a side-by-side spec comparison with AI verdict — who wins on value, performance, mileage, and more.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('search')}>
              <GitCompare size={16} /> Search a Bike to Add
            </button>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>How it works</div>
            {[
              { step: '1', text: 'Search any bike from the Search tab', icon: '🔍' },
              { step: '2', text: 'Tap the Compare button on the bike card', icon: '➕' },
              { step: '3', text: 'Add a second (or third) bike the same way', icon: '🏍️' },
              { step: '4', text: 'Come back here and tap Get AI Verdict', icon: '🤖' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0, fontFamily: 'Rajdhani' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '0.85rem' }}>{item.icon} {item.text}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Popular comparisons</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Honda Activa 6G vs TVS Jupiter 125',
                'Royal Enfield Classic 350 vs Jawa 42',
                'Ola S1 Pro vs Ather 450X',
                'KTM Duke 390 vs Yamaha MT-03',
              ].map((comp, i) => (
                <div key={i} className="card" style={{ cursor: 'pointer', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => navigate('search')}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{comp}</span>
                  <GitCompare size={14} color="var(--accent)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {compareList.length >= 2 && (
        <>
          {/* Specs table */}
          <div className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
            {specRows.map((row, i) => {
              const betterIdx = getBetterIdx(row);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: `120px repeat(${compareList.length}, 1fr)`, borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <div style={{ padding: '10px 12px', fontSize: '0.75rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }}>
                    {row.label}
                  </div>
                  {compareList.map((bike, j) => (
                    <div key={j} style={{
                      padding: '10px 8px', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'JetBrains Mono',
                      color: betterIdx === j ? 'var(--green)' : 'var(--text)',
                      fontWeight: betterIdx === j ? 700 : 400,
                      borderRight: j < compareList.length - 1 ? '1px solid var(--border)' : 'none'
                    }}>
                      {row.key(bike)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* AI Verdict */}
          <div className="card" style={{ background: 'rgba(0,212,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Zap size={16} color="var(--accent)" />
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>AI Verdict</span>
            </div>
            {!verdict && !loadingVerdict && (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={fetchVerdict}>
                <Zap size={14} /> Get AI Verdict
              </button>
            )}
            {loadingVerdict && <div className="loading"><div className="spinner" /></div>}
            {verdict && (
              <div className="fade-in">
                <div style={{ background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', borderRadius: 12, padding: 12, marginBottom: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginBottom: 4 }}>WINNER</div>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '1.3rem', fontWeight: 700, color: 'var(--green)' }}>🏆 {verdict.winner}</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{verdict.summary}</p>
                {verdict.categories && Object.entries(verdict.categories).map(([cat, data]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'capitalize' }}>{cat}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }}>{data.winner}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{data.reason}</div>
                    </div>
                  </div>
                ))}
                {verdict.buyBike1If && (
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginBottom: 4, fontWeight: 600 }}>BUY {compareList[0]?.name} IF</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{verdict.buyBike1If}</div>
                    </div>
                    <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: 10 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--accent3)', marginBottom: 4, fontWeight: 600 }}>BUY {compareList[1]?.name} IF</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{verdict.buyBike2If}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
