import React, { useState } from 'react';
import { X, Plus, GitCompare, Zap, Search } from 'lucide-react';
import { formatINR } from '../utils/calculator';
import { comparebikes, searchBikeInfo } from '../utils/gemini';

const QUICK_BIKES = [
  'Honda Activa 6G', 'Hero Splendor Plus', 'Bajaj Pulsar NS200',
  'TVS Apache RTR 160 4V', 'Royal Enfield Classic 350', 'Yamaha R15 V4',
  'KTM Duke 390', 'Ola S1 Pro', 'Ather 450X', 'Honda CB350',
  'Royal Enfield Meteor 350', 'Bajaj Dominar 400', 'TVS Ntorq 125',
  'Hero Xpulse 200', 'Suzuki Gixxer SF', 'KTM Duke 200',
];

const ALL_SUGGESTIONS = [
  'Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan',
  'Royal Enfield Hunter 350', 'Honda Activa 6G', 'Honda SP 125', 'Honda Shine',
  'Honda CB350', 'Honda CB350RS', 'Honda Hornet 2.0',
  'TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Apache RR 310',
  'TVS Ntorq 125', 'TVS Jupiter 125', 'TVS Raider 125',
  'Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R', 'Hero Xpulse 200',
  'Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Pulsar N160', 'Bajaj Dominar 400',
  'Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125',
  'KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM 390 Adventure',
  'Ola S1 Pro', 'Ola S1 Air', 'Ather 450X', 'Ather 450S', 'Ather Rizta',
  'BMW G 310 R', 'Kawasaki Ninja 300', 'Triumph Speed 400',
  'Suzuki Gixxer SF', 'Suzuki Gixxer 250', 'Suzuki Access 125',
];

// Inline add-bike panel
function AddBikePanel({ onAdd, existingNames, onCancel }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleType = (val) => {
    setQuery(val);
    setError('');
    if (val.length >= 1) {
      const filtered = ALL_SUGGESTIONS
        .filter(s => s.toLowerCase().includes(val.toLowerCase()) && !existingNames.includes(s))
        .slice(0, 6);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (name) => {
    setQuery(name);
    setSuggestions([]);
    setLoading(true);
    setError('');
    const bike = await searchBikeInfo(name);
    if (bike) {
      onAdd(bike);
    } else {
      setError('Could not load this bike. Try another.');
    }
    setLoading(false);
  };

  // Bold the matching part
  const Highlight = ({ text }) => {
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
  };

  return (
    <div style={{
      border: '2px solid var(--accent)',
      borderRadius: 16, overflow: 'hidden',
      background: 'rgba(0,212,255,0.04)',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Search input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: suggestions.length > 0 ? '1px solid var(--border)' : 'none' }}>
        <Search size={15} color="var(--accent)" />
        <input
          autoFocus
          value={query}
          onChange={e => handleType(e.target.value)}
          onKeyDown={e => { if (e.key === 'Escape') onCancel(); if (e.key === 'Enter' && suggestions[0]) handleSelect(suggestions[0]); }}
          placeholder="Type bike name..."
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit' }}
        />
        {loading && <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, flexShrink: 0 }} />}
        <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 18, lineHeight: 1 }}>✕</button>
      </div>

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <div>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSelect(s)}
              style={{
                padding: '10px 14px', cursor: 'pointer', fontSize: 13,
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', gap: 10,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 16 }}>🏍️</span>
              <span style={{ color: 'var(--text)' }}><Highlight text={s} /></span>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--red)' }}>⚠️ {error}</div>
      )}

      {/* Quick picks */}
      {!query && !loading && (
        <div style={{ padding: '10px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
            Quick Add
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_BIKES.filter(b => !existingNames.includes(b)).slice(0, 10).map(name => (
              <span
                key={name}
                onClick={() => handleSelect(name)}
                style={{
                  fontSize: 11, padding: '4px 10px', borderRadius: 20, cursor: 'pointer',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  color: 'var(--text2)', fontWeight: 500,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage({ compareList, addToCompare, removeFromCompare, navigate }) {
  const [verdict, setVerdict] = useState(null);
  const [loadingVerdict, setLoadingVerdict] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const fetchVerdict = async () => {
    if (compareList.length < 2) return;
    setLoadingVerdict(true);
    const result = await comparebikes(compareList[0], compareList[1]);
    setVerdict(result);
    setLoadingVerdict(false);
  };

  const handleAdd = (bike) => {
    addToCompare(bike);
    setShowAddPanel(false);
    setVerdict(null); // reset verdict when bikes change
  };

  const handleRemove = (name) => {
    removeFromCompare(name);
    setVerdict(null);
  };

  const specRows = [
    { label: 'Price (Base)',  key: (b) => formatINR(b.basePrice),                           numKey: (b) => b.basePrice,        lower: true },
    { label: 'Engine',        key: (b) => b.specs?.engine || b.evSpecs?.batteryCapacity || '—' },
    { label: 'Power',         key: (b) => b.specs?.power || '—' },
    { label: 'Torque',        key: (b) => b.specs?.torque || '—' },
    { label: 'Mileage',       key: (b) => b.mileage?.claimed || b.evSpecs?.range?.claimed || '—' },
    { label: 'Real Mileage',  key: (b) => b.mileage?.realWorld || b.evSpecs?.range?.realWorld || '—' },
    { label: 'Weight',        key: (b) => b.specs?.weight || '—' },
    { label: 'Seat Height',   key: (b) => b.specs?.seatHeight || '—' },
    { label: 'ABS',           key: (b) => b.specs?.abs ? '✅' : '❌' },
    { label: 'Fuel Type',     key: (b) => b.fuelType || '—' },
    { label: 'Owner Rating',  key: (b) => b.ownerRating ? `★ ${b.ownerRating}` : '—',      numKey: (b) => b.ownerRating },
    { label: 'Service Cost',  key: (b) => b.avgServiceCost ? `₹${b.avgServiceCost}` : '—', numKey: (b) => b.avgServiceCost,   lower: true },
  ];

  const getBetterIdx = (row) => {
    if (!row.numKey || compareList.length < 2) return -1;
    const vals = compareList.map(b => row.numKey(b) || 0);
    const best = row.lower ? Math.min(...vals) : Math.max(...vals);
    return vals.indexOf(best);
  };

  const slots = compareList.length;
  const canAddMore = slots < 3;
  const gridCols = slots + (canAddMore ? 1 : 0);

  return (
    <div className="page">
      <div className="section-title" style={{ marginBottom: 16 }}>
        <GitCompare size={18} color="var(--accent)" /> Compare Bikes
      </div>

      {/* ── Bike slots + Add button ── */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(gridCols, 1)}, 1fr)`, gap: 8, marginBottom: 12 }}>
        {compareList.map((bike, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', position: 'relative', padding: 12 }}>
            <button
              style={{ position: 'absolute', top: 8, right: 8, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text3)' }}
              onClick={() => handleRemove(bike.name)}
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

        {/* Add bike slot */}
        {canAddMore && !showAddPanel && (
          <div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', minHeight: 90, border: '2px dashed var(--accent)', background: 'rgba(0,212,255,0.03)', transition: 'all 0.2s' }}
            onClick={() => setShowAddPanel(true)}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.07)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
          >
            <Plus size={22} color="var(--accent)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600 }}>
              {slots === 0 ? 'Add first bike' : 'Add bike'}
            </span>
          </div>
        )}
      </div>

      {/* ── Inline Add Panel ── */}
      {showAddPanel && canAddMore && (
        <div style={{ marginBottom: 14 }}>
          <AddBikePanel
            onAdd={handleAdd}
            existingNames={compareList.map(b => b.name)}
            onCancel={() => setShowAddPanel(false)}
          />
        </div>
      )}

      {/* ── Empty state ── */}
      {compareList.length === 0 && !showAddPanel && (
        <div className="fade-in">
          <div style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,107,53,0.04))', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 20px', marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚖️</div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem', marginBottom: 8 }}>Compare Any 2 or 3 Bikes</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
              Side-by-side specs with AI verdict — who wins on value, performance, mileage & more.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowAddPanel(true)}>
              <Plus size={16} /> Add Your First Bike
            </button>
          </div>

          {/* How it works */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>How it works</div>
            {[
              { step: '1', text: 'Tap "Add first bike" above and type any bike name', icon: '🔍' },
              { step: '2', text: 'Select from suggestions — specs load automatically', icon: '⚡' },
              { step: '3', text: 'Add a second (or third) bike the same way', icon: '🏍️' },
              { step: '4', text: 'Tap Get AI Verdict for a full breakdown', icon: '🤖' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0, fontFamily: 'Rajdhani' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: '0.85rem' }}>{item.icon} {item.text}</div>
              </div>
            ))}
          </div>

          {/* Popular comparisons */}
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Popular comparisons</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Honda Activa 6G vs TVS Jupiter 125',    bikes: ['Honda Activa 6G', 'TVS Jupiter 125'] },
                { label: 'Royal Enfield Classic 350 vs Jawa 42',  bikes: ['Royal Enfield Classic 350', 'Jawa 42'] },
                { label: 'Ola S1 Pro vs Ather 450X',              bikes: ['Ola S1 Pro', 'Ather 450X'] },
                { label: 'KTM Duke 390 vs Yamaha MT-03',          bikes: ['KTM Duke 390', 'Yamaha MT-03'] },
              ].map((comp, i) => (
                <div
                  key={i}
                  className="card"
                  style={{ cursor: 'pointer', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={async () => {
                    setShowAddPanel(false);
                    // Load both bikes
                    const [b1, b2] = await Promise.all(comp.bikes.map(name => searchBikeInfo(name)));
                    if (b1) addToCompare(b1);
                    if (b2) addToCompare(b2);
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{comp.label}</span>
                  <GitCompare size={14} color="var(--accent)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Needs 1 more bike prompt ── */}
      {compareList.length === 1 && !showAddPanel && (
        <div style={{ background: 'rgba(255,215,64,0.06)', border: '1px solid rgba(255,215,64,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>👆</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--yellow)', marginBottom: 2 }}>Add one more bike</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>You need at least 2 bikes to compare specs and get AI verdict.</div>
          </div>
        </div>
      )}

      {/* ── Specs table ── */}
      {compareList.length >= 2 && (
        <>
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
                      borderRight: j < compareList.length - 1 ? '1px solid var(--border)' : 'none',
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
                <button className="btn btn-outline btn-sm" style={{ marginTop: 12, width: '100%' }} onClick={() => { setVerdict(null); }}>
                  Refresh Verdict
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
