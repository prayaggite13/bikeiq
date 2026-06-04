import React, { useState, useMemo } from 'react';

// ─── State-wise Road Tax Data ───────────────────────────────────────────────
// Sources: State Motor Vehicles Acts (as of 2024-25)
// Structure: { lifetime_pct, annual_pct, rto_fee, green_tax, note }
// lifetime_pct: % of vehicle cost (one-time)
// annual_pct: % for annual-tax states
// rto_fee: registration fee (flat, INR)
// green_tax: annual green/environment tax (INR)
const STATE_DATA = {
  'Maharashtra': {
    slabs: [
      { maxPrice: 300000, rate: 7 },
      { maxPrice: 500000, rate: 8 },
      { maxPrice: Infinity, rate: 9 },
    ],
    rto_fee: 600,
    green_tax: 0,
    note: 'One-time lifetime tax. Additional 1% for vehicles > ₹20L.',
    tax_type: 'lifetime',
  },
  'Delhi': {
    slabs: [
      { maxPrice: 60000, rate: 2 },
      { maxPrice: Infinity, rate: 4 },
    ],
    rto_fee: 600,
    green_tax: 3500,
    note: 'Lifetime tax. Green tax applicable on petrol/diesel bikes > 8 years old.',
    tax_type: 'lifetime',
  },
  'Karnataka': {
    slabs: [
      { maxPrice: 500000, rate: 13 },
      { maxPrice: Infinity, rate: 14 },
    ],
    rto_fee: 800,
    green_tax: 0,
    note: 'One-time lifetime tax. One of the highest in India.',
    tax_type: 'lifetime',
  },
  'Tamil Nadu': {
    slabs: [
      { maxPrice: 50000, rate: 8 },
      { maxPrice: 200000, rate: 9 },
      { maxPrice: Infinity, rate: 10 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: 'Lifetime tax collected at registration.',
    tax_type: 'lifetime',
  },
  'Telangana': {
    slabs: [
      { maxPrice: Infinity, rate: 9 },
    ],
    rto_fee: 600,
    green_tax: 0,
    note: 'Flat 9% lifetime road tax for 2-wheelers.',
    tax_type: 'lifetime',
  },
  'Andhra Pradesh': {
    slabs: [
      { maxPrice: Infinity, rate: 9 },
    ],
    rto_fee: 600,
    green_tax: 0,
    note: 'Lifetime tax at 9% of vehicle cost.',
    tax_type: 'lifetime',
  },
  'Gujarat': {
    slabs: [
      { maxPrice: Infinity, rate: 6 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: 'One-time 6% lifetime road tax. Lower than most states.',
    tax_type: 'lifetime',
  },
  'Rajasthan': {
    slabs: [
      { maxPrice: 200000, rate: 5 },
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: 'Lifetime road tax with two slabs.',
    tax_type: 'lifetime',
  },
  'Uttar Pradesh': {
    slabs: [
      { maxPrice: 50000, rate: 5 },
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: 'Lifetime tax. Annual option also available.',
    tax_type: 'lifetime',
  },
  'Madhya Pradesh': {
    slabs: [
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: '7% lifetime road tax on ex-showroom price.',
    tax_type: 'lifetime',
  },
  'Punjab': {
    slabs: [
      { maxPrice: Infinity, rate: 6 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: '6% one-time lifetime tax.',
    tax_type: 'lifetime',
  },
  'Haryana': {
    slabs: [
      { maxPrice: Infinity, rate: 6 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: '6% lifetime tax. Close to Punjab rates.',
    tax_type: 'lifetime',
  },
  'Bihar': {
    slabs: [
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 400,
    green_tax: 0,
    note: '7% lifetime tax.',
    tax_type: 'lifetime',
  },
  'West Bengal': {
    slabs: [
      { maxPrice: 300000, rate: 7 },
      { maxPrice: Infinity, rate: 8 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: 'Lifetime tax with two slabs.',
    tax_type: 'lifetime',
  },
  'Kerala': {
    slabs: [
      { maxPrice: Infinity, rate: 6 },
    ],
    rto_fee: 600,
    green_tax: 0,
    note: '6% lifetime tax. Additional tax for high-power bikes.',
    tax_type: 'lifetime',
  },
  'Odisha': {
    slabs: [
      { maxPrice: Infinity, rate: 6 },
    ],
    rto_fee: 400,
    green_tax: 0,
    note: '6% one-time lifetime road tax.',
    tax_type: 'lifetime',
  },
  'Chhattisgarh': {
    slabs: [
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 400,
    green_tax: 0,
    note: '7% lifetime tax.',
    tax_type: 'lifetime',
  },
  'Jharkhand': {
    slabs: [
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 400,
    green_tax: 0,
    note: '7% lifetime tax.',
    tax_type: 'lifetime',
  },
  'Assam': {
    slabs: [
      { maxPrice: Infinity, rate: 8 },
    ],
    rto_fee: 400,
    green_tax: 0,
    note: '8% lifetime road tax.',
    tax_type: 'lifetime',
  },
  'Himachal Pradesh': {
    slabs: [
      { maxPrice: Infinity, rate: 3 },
    ],
    rto_fee: 300,
    green_tax: 0,
    note: 'Very low 3% lifetime tax — among the cheapest in India.',
    tax_type: 'lifetime',
  },
  'Uttarakhand': {
    slabs: [
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 400,
    green_tax: 0,
    note: '7% lifetime tax.',
    tax_type: 'lifetime',
  },
  'Goa': {
    slabs: [
      { maxPrice: Infinity, rate: 7 },
    ],
    rto_fee: 500,
    green_tax: 0,
    note: '7% lifetime road tax.',
    tax_type: 'lifetime',
  },
};

// EV exemptions by state
const EV_EXEMPTIONS = {
  'Delhi': 100,
  'Maharashtra': 0,
  'Karnataka': 0,
  'Tamil Nadu': 100,
  'Telangana': 100,
  'Gujarat': 50,
  'Rajasthan': 100,
  'Uttar Pradesh': 100,
  'Madhya Pradesh': 100,
  'Kerala': 100,
  'West Bengal': 0,
  'Punjab': 0,
  'Haryana': 100,
  'Bihar': 0,
  'Andhra Pradesh': 100,
  'Odisha': 100,
  'Assam': 0,
  'Chhattisgarh': 0,
  'Jharkhand': 0,
  'Himachal Pradesh': 100,
  'Uttarakhand': 0,
  'Goa': 0,
};

const STATES = Object.keys(STATE_DATA).sort();

// ─── Helper ──────────────────────────────────────────────────────────────────
function calcRoadTax(state, exShowroomPrice, isEV) {
  const data = STATE_DATA[state];
  if (!data) return null;

  let rawRate = 0;
  for (const slab of data.slabs) {
    if (exShowroomPrice <= slab.maxPrice) {
      rawRate = slab.rate;
      break;
    }
  }

  const evExemptPct = isEV ? (EV_EXEMPTIONS[state] ?? 0) : 0;
  const effectiveRate = rawRate * (1 - evExemptPct / 100);
  const roadTax = Math.round((exShowroomPrice * effectiveRate) / 100);
  const rtoFee = data.rto_fee;
  const greenTax = isEV ? 0 : data.green_tax;
  const total = roadTax + rtoFee + greenTax;

  return { rawRate, effectiveRate, roadTax, rtoFee, greenTax, total, evExemptPct, note: data.note };
}

function formatINR(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function RoadTaxPage() {
  const [state, setState] = useState('');
  const [price, setPrice] = useState('');
  const [isEV, setIsEV] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const numPrice = parseFloat(price) || 0;
  const result = useMemo(() => {
    if (!state || !numPrice) return null;
    return calcRoadTax(state, numPrice, isEV);
  }, [state, numPrice, isEV]);

  // Top 5 cheapest states for this price
  const cheapestStates = useMemo(() => {
    if (!numPrice) return [];
    return STATES
      .map(s => ({ state: s, ...calcRoadTax(s, numPrice, isEV) }))
      .sort((a, b) => a.total - b.total)
      .slice(0, 5);
  }, [numPrice, isEV]);

  const handleCalculate = () => {
    if (state && numPrice > 0) setCalculated(true);
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#e0e0e0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      paddingBottom: '100px',
    },
    header: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
      borderBottom: '1px solid #1a1a1a',
      padding: '20px 16px 16px',
    },
    headerTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#00d4ff',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    headerSub: {
      fontSize: '13px',
      color: '#888',
      marginTop: '4px',
    },
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px 16px',
    },
    card: {
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: '8px',
      display: 'block',
    },
    select: {
      width: '100%',
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '10px',
      color: '#e0e0e0',
      fontSize: '15px',
      padding: '12px 14px',
      outline: 'none',
      cursor: 'pointer',
      marginBottom: '16px',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300d4ff' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center',
    },
    inputWrapper: {
      position: 'relative',
      marginBottom: '16px',
    },
    rupeeSign: {
      position: 'absolute',
      left: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#00d4ff',
      fontWeight: '700',
      fontSize: '16px',
    },
    input: {
      width: '100%',
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '10px',
      color: '#e0e0e0',
      fontSize: '15px',
      padding: '12px 14px 12px 30px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    toggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px',
      background: '#1a1a1a',
      borderRadius: '10px',
      border: `1px solid ${isEV ? '#00d4ff33' : '#2a2a2a'}`,
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'border-color 0.2s',
    },
    toggleKnob: {
      width: '44px',
      height: '24px',
      background: isEV ? '#00d4ff' : '#333',
      borderRadius: '12px',
      position: 'relative',
      transition: 'background 0.2s',
      flexShrink: 0,
    },
    toggleDot: {
      width: '18px',
      height: '18px',
      background: '#fff',
      borderRadius: '50%',
      position: 'absolute',
      top: '3px',
      left: isEV ? '23px' : '3px',
      transition: 'left 0.2s',
    },
    calcBtn: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #00d4ff, #0096b3)',
      color: '#000',
      fontWeight: '700',
      fontSize: '15px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      letterSpacing: '0.5px',
    },
    resultCard: {
      background: '#111',
      border: '1px solid #00d4ff22',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
    },
    bigNum: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#00d4ff',
      lineHeight: 1,
    },
    bigLabel: {
      fontSize: '12px',
      color: '#666',
      marginTop: '4px',
    },
    breakdownRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #1a1a1a',
    },
    breakdownLabel: {
      fontSize: '14px',
      color: '#aaa',
    },
    breakdownValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#e0e0e0',
    },
    badgeCyan: {
      background: '#00d4ff22',
      color: '#00d4ff',
      fontSize: '11px',
      fontWeight: '700',
      padding: '3px 8px',
      borderRadius: '6px',
      marginLeft: '8px',
    },
    badgeGreen: {
      background: '#00ff8822',
      color: '#00ff88',
      fontSize: '11px',
      fontWeight: '700',
      padding: '3px 8px',
      borderRadius: '6px',
      marginLeft: '8px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: '12px',
    },
    compareRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      borderRadius: '10px',
      marginBottom: '8px',
      background: '#1a1a1a',
    },
    rank1: {
      background: '#00d4ff11',
      border: '1px solid #00d4ff33',
    },
    noteBox: {
      background: '#1a1a1a',
      border: '1px solid #2a2a2a',
      borderRadius: '10px',
      padding: '12px',
      fontSize: '13px',
      color: '#888',
      marginTop: '12px',
      lineHeight: 1.5,
    },
    tabRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
    },
    tab: (active) => ({
      flex: 1,
      padding: '10px',
      borderRadius: '10px',
      border: `1px solid ${active ? '#00d4ff' : '#2a2a2a'}`,
      background: active ? '#00d4ff11' : '#1a1a1a',
      color: active ? '#00d4ff' : '#888',
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      textAlign: 'center',
    }),
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          🛣️ Road Tax Calculator
        </h1>
        <p style={styles.headerSub}>State-wise RTO registration & road tax breakdown</p>
      </div>

      <div style={styles.container}>
        {/* Tabs */}
        <div style={styles.tabRow}>
          <div
            style={styles.tab(!compareMode)}
            onClick={() => setCompareMode(false)}
          >
            Calculate Tax
          </div>
          <div
            style={styles.tab(compareMode)}
            onClick={() => { setCompareMode(true); setCalculated(true); }}
          >
            Compare States
          </div>
        </div>

        {/* Input Card */}
        <div style={styles.card}>
          <label style={styles.label}>State / UT</label>
          <select
            style={styles.select}
            value={state}
            onChange={e => { setState(e.target.value); setCalculated(false); }}
          >
            <option value="">Select your state</option>
            {STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <label style={styles.label}>Ex-Showroom Price (₹)</label>
          <div style={styles.inputWrapper}>
            <span style={styles.rupeeSign}>₹</span>
            <input
              style={styles.input}
              type="number"
              placeholder="e.g. 150000"
              value={price}
              onChange={e => { setPrice(e.target.value); setCalculated(false); }}
            />
          </div>

          {/* EV Toggle */}
          <div
            style={styles.toggle}
            onClick={() => { setIsEV(!isEV); setCalculated(false); }}
          >
            <div style={styles.toggleKnob}>
              <div style={styles.toggleDot} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: isEV ? '#00d4ff' : '#e0e0e0' }}>
                ⚡ Electric Vehicle (EV)
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                Toggle for EV road tax exemption
              </div>
            </div>
          </div>

          {!compareMode && (
            <button
              style={styles.calcBtn}
              onClick={handleCalculate}
              disabled={!state || !numPrice}
            >
              Calculate Road Tax →
            </button>
          )}
        </div>

        {/* ── Result Card ── */}
        {!compareMode && calculated && result && (
          <>
            <div style={styles.resultCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={styles.bigNum}>{formatINR(result.total)}</div>
                  <div style={styles.bigLabel}>Total Registration Cost</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#e0e0e0' }}>
                    {result.effectiveRate.toFixed(1)}%
                  </div>
                  <div style={styles.bigLabel}>Effective Tax Rate</div>
                </div>
              </div>

              {/* Breakdown */}
              <div style={styles.sectionTitle}>Breakdown</div>

              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Ex-Showroom Price</span>
                <span style={styles.breakdownValue}>{formatINR(numPrice)}</span>
              </div>

              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>
                  Road Tax
                  {isEV && result.evExemptPct > 0 && (
                    <span style={styles.badgeGreen}>{result.evExemptPct}% EV Exempt</span>
                  )}
                </span>
                <span style={styles.breakdownValue}>{formatINR(result.roadTax)}</span>
              </div>

              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>
                  RTO Registration Fee
                </span>
                <span style={styles.breakdownValue}>{formatINR(result.rtoFee)}</span>
              </div>

              {result.greenTax > 0 && (
                <div style={styles.breakdownRow}>
                  <span style={styles.breakdownLabel}>
                    Green Tax (Annual)
                    <span style={styles.badgeCyan}>Per Year</span>
                  </span>
                  <span style={styles.breakdownValue}>{formatINR(result.greenTax)}</span>
                </div>
              )}

              <div style={{ ...styles.breakdownRow, borderBottom: 'none', paddingTop: '14px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#e0e0e0' }}>
                  Total On-Road (Tax+RTO)
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#00d4ff' }}>
                  {formatINR(result.total)}
                </span>
              </div>

              <div style={styles.noteBox}>
                ℹ️ {result.note}
              </div>
            </div>

            {/* On-Road estimate */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Estimated On-Road Price</div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                Add insurance + dealer charges for full estimate
              </div>

              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Ex-Showroom</span>
                <span style={styles.breakdownValue}>{formatINR(numPrice)}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>Road Tax + RTO</span>
                <span style={styles.breakdownValue}>{formatINR(result.total)}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>
                  Insurance (est.)
                  <span style={styles.badgeCyan}>~3%</span>
                </span>
                <span style={styles.breakdownValue}>{formatINR(Math.round(numPrice * 0.03))}</span>
              </div>
              <div style={styles.breakdownRow}>
                <span style={styles.breakdownLabel}>
                  Dealer Handling (est.)
                  <span style={styles.badgeCyan}>Varies</span>
                </span>
                <span style={styles.breakdownValue}>₹2,000–5,000</span>
              </div>
              <div style={{ ...styles.breakdownRow, borderBottom: 'none', paddingTop: '14px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#e0e0e0' }}>Approx. On-Road</span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#00d4ff' }}>
                  {formatINR(numPrice + result.total + Math.round(numPrice * 0.03) + 3500)}
                </span>
              </div>
            </div>
          </>
        )}

        {/* ── Compare States ── */}
        {compareMode && numPrice > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              Cheapest States for {formatINR(numPrice)} Bike
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
              Total road tax + RTO fee comparison
            </div>

            {cheapestStates.map((item, i) => (
              <div
                key={item.state}
                style={{ ...styles.compareRow, ...(i === 0 ? styles.rank1 : {}) }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: i === 0 ? '#00d4ff' : '#2a2a2a',
                    color: i === 0 ? '#000' : '#888',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '12px', flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: i === 0 ? '#00d4ff' : '#e0e0e0' }}>
                      {item.state}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {item.effectiveRate.toFixed(1)}% tax rate
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: i === 0 ? '#00d4ff' : '#e0e0e0' }}>
                    {formatINR(item.total)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>total tax</div>
                </div>
              </div>
            ))}

            {isEV && (
              <div style={styles.noteBox}>
                ⚡ EV exemptions applied where applicable. Many states offer 50–100% road tax waiver on electric vehicles.
              </div>
            )}
          </div>
        )}

        {/* ── All States Quick Reference ── */}
        {compareMode && numPrice > 0 && (
          <div style={styles.card}>
            <div style={styles.sectionTitle}>All States — Quick Reference</div>
            {STATES.map(s => {
              const r = calcRoadTax(s, numPrice, isEV);
              const isSelected = s === state;
              return (
                <div
                  key={s}
                  style={{
                    ...styles.breakdownRow,
                    background: isSelected ? '#00d4ff11' : 'transparent',
                    padding: isSelected ? '10px 8px' : '10px 0',
                    borderRadius: isSelected ? '8px' : 0,
                    cursor: 'pointer',
                  }}
                  onClick={() => setState(s)}
                >
                  <span style={{ ...styles.breakdownLabel, color: isSelected ? '#00d4ff' : '#aaa' }}>
                    {s}
                    {isSelected && <span style={styles.badgeCyan}>Selected</span>}
                  </span>
                  <span style={{ ...styles.breakdownValue, color: isSelected ? '#00d4ff' : '#e0e0e0' }}>
                    {formatINR(r.total)}
                    <span style={{ fontSize: '11px', color: '#666', fontWeight: '400', marginLeft: '4px' }}>
                      ({r.effectiveRate.toFixed(1)}%)
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {compareMode && !numPrice && (
          <div style={{ ...styles.card, textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛣️</div>
            <div style={{ fontSize: '15px', color: '#888' }}>
              Enter a bike price above to compare road tax across all Indian states
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
