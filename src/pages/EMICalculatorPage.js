import React, { useState, useMemo } from 'react';

function formatINR(n) {
  if (!n || isNaN(n)) return '₹0';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function formatINRFull(n) {
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

const POPULAR_BIKES = [
  { name: 'Honda Activa 6G',           price: 75000  },
  { name: 'Hero Splendor Plus',         price: 76000  },
  { name: 'Bajaj Pulsar NS160',         price: 132000 },
  { name: 'TVS Apache RTR 160 4V',      price: 122000 },
  { name: 'Royal Enfield Classic 350',  price: 193000 },
  { name: 'Yamaha R15 V4',             price: 181000 },
  { name: 'KTM Duke 390',              price: 316000 },
  { name: 'Ola S1 Pro',                price: 129000 },
  { name: 'Ather 450X',               price: 145000 },
  { name: 'Royal Enfield Meteor 350',  price: 210000 },
  { name: 'Bajaj Pulsar NS200',        price: 163000 },
  { name: 'Hero Xpulse 200',           price: 143000 },
];

const TENURES = [12, 18, 24, 36, 48, 60];

const LENDER_RATES = [
  { name: 'HDFC Bank',   rate: 8.75 },
  { name: 'SBI',         rate: 8.90 },
  { name: 'Bajaj Finance', rate: 9.25 },
  { name: 'ICICI Bank',  rate: 9.50 },
  { name: 'Axis Bank',   rate: 9.75 },
  { name: 'Hero FinCorp', rate: 10.25 },
];

export default function EMICalculatorPage({ navigate }) {
  const [bikePrice, setBikePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(9.5);
  const [selectedBike, setSelectedBike] = useState('');
  const [showBikeList, setShowBikeList] = useState(false);
  const [processingFee] = useState(1500);

  const price = parseFloat(bikePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const loanAmount = Math.max(0, price - down);
  const monthlyRate = interestRate / 100 / 12;

  const emi = useMemo(() => {
    if (!loanAmount || !tenure || !monthlyRate) return 0;
    if (monthlyRate === 0) return loanAmount / tenure;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
           (Math.pow(1 + monthlyRate, tenure) - 1);
  }, [loanAmount, tenure, monthlyRate]);

  const totalPayable = emi * tenure + down + processingFee;
  const totalInterest = emi * tenure - loanAmount;
  const downPct = price > 0 ? Math.round((down / price) * 100) : 0;

  // Amortization — first 6 months
  const amortization = useMemo(() => {
    if (!emi || !loanAmount) return [];
    let balance = loanAmount;
    return Array.from({ length: Math.min(tenure, 6) }, (_, i) => {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;
      return {
        month: i + 1,
        emi: Math.round(emi),
        principal: Math.round(principal),
        interest: Math.round(interest),
        balance: Math.max(0, Math.round(balance)),
      };
    });
  }, [emi, loanAmount, monthlyRate, tenure]);

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 100 },
    header: { padding: '20px 16px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
    back: { fontSize: 20, cursor: 'pointer', color: 'var(--accent3)', background: 'none', border: 'none' },
    container: { padding: 16 },
    card: { background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 18, marginBottom: 14 },
    label: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, display: 'block' },
    input: { width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text)', fontSize: 15, padding: '11px 14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
    inputPrefix: { position: 'relative' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: 13 },
    sectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 },
    tenureBtn: (active) => ({
      flex: 1, padding: '8px 4px', borderRadius: 10, textAlign: 'center',
      border: `1px solid ${active ? 'var(--accent3)' : 'var(--border)'}`,
      background: active ? 'rgba(255,107,53,0.1)' : 'var(--bg2)',
      color: active ? 'var(--accent3)' : 'var(--text3)',
      fontWeight: active ? 700 : 400, fontSize: 13, cursor: 'pointer',
    }),
    lenderBtn: (active) => ({
      padding: '7px 10px', borderRadius: 10, textAlign: 'center',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      background: active ? 'rgba(0,212,255,0.08)' : 'var(--bg2)',
      color: active ? 'var(--accent)' : 'var(--text3)',
      fontWeight: active ? 700 : 400, fontSize: 11, cursor: 'pointer',
      whiteSpace: 'nowrap',
    }),
    emiBox: {
      background: 'linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.05) 100%)',
      border: '1px solid rgba(255,107,53,0.3)', borderRadius: 16,
      padding: '20px', marginBottom: 14, textAlign: 'center',
    },
    bikeChip: {
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
      background: 'var(--bg2)', border: '1px solid var(--border)',
      fontSize: 13, color: 'var(--text2)', marginBottom: 6,
    },
  };

  const selectBike = (bike) => {
    setSelectedBike(bike.name);
    setBikePrice(String(bike.price));
    setDownPayment(String(Math.round(bike.price * 0.2)));
    setShowBikeList(false);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate('bikeiqplus')}>←</button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0, fontFamily: 'Rajdhani,sans-serif' }}>
            🧮 EMI Calculator
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>
            Calculate monthly payments, total cost & interest
          </p>
        </div>
      </div>

      <div style={s.container}>

        {/* Quick select bike */}
        <div style={s.card}>
          <span style={s.label}>Quick Select a Bike</span>
          <div
            onClick={() => setShowBikeList(!showBikeList)}
            style={{ ...s.input, cursor: 'pointer', color: selectedBike ? 'var(--text)' : 'var(--text3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{selectedBike || 'Choose a popular bike...'}</span>
            <span style={{ fontSize: 12 }}>{showBikeList ? '▲' : '▼'}</span>
          </div>

          {showBikeList && (
            <div style={{ marginTop: 10, maxHeight: 240, overflowY: 'auto', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg2)' }}>
              {POPULAR_BIKES.map((bike, i) => (
                <div key={i} style={{ ...s.bikeChip, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--border)', marginBottom: 0 }}
                  onClick={() => selectBike(bike)}>
                  <span style={{ flex: 1 }}>{bike.name}</span>
                  <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>{formatINR(bike.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inputs */}
        <div style={s.card}>
          <span style={s.label}>Ex-Showroom Price (₹)</span>
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent3)', fontWeight: 700 }}>₹</span>
            <input style={{ ...s.input, paddingLeft: 28 }} type="number"
              placeholder="e.g. 150000" value={bikePrice}
              onChange={e => setBikePrice(e.target.value)} />
          </div>

          <span style={s.label}>Down Payment (₹) — {downPct}% of price</span>
          <div style={{ position: 'relative', marginBottom: 6 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent3)', fontWeight: 700 }}>₹</span>
            <input style={{ ...s.input, paddingLeft: 28 }} type="number"
              placeholder="e.g. 30000" value={downPayment}
              onChange={e => setDownPayment(e.target.value)} />
          </div>
          {price > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
              {[10, 15, 20, 25, 30].map(pct => (
                <span key={pct}
                  onClick={() => setDownPayment(String(Math.round(price * pct / 100)))}
                  style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, cursor: 'pointer', background: downPct === pct ? 'var(--accent3)' : 'var(--bg3)', color: downPct === pct ? '#000' : 'var(--text3)', fontWeight: 600 }}>
                  {pct}%
                </span>
              ))}
            </div>
          )}

          <span style={s.label}>Loan Tenure</span>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {TENURES.map(t => (
              <div key={t} style={s.tenureBtn(tenure === t)} onClick={() => setTenure(t)}>
                {t < 12 ? `${t}m` : `${t / 12}yr`}
              </div>
            ))}
          </div>

          <span style={s.label}>Interest Rate — {interestRate}% p.a.</span>
          <input type="range" min="7" max="18" step="0.25" value={interestRate}
            onChange={e => setInterestRate(parseFloat(e.target.value))}
            style={{ width: '100%', marginBottom: 6 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>
            <span>7% (Low)</span><span>12% (Avg)</span><span>18% (High)</span>
          </div>
        </div>

        {/* Lender quick-select */}
        <div style={s.card}>
          <span style={s.label}>Select Lender (sets rate)</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LENDER_RATES.map(l => (
              <div key={l.name} style={s.lenderBtn(interestRate === l.rate)}
                onClick={() => setInterestRate(l.rate)}>
                {l.name}<br />
                <span style={{ fontSize: 10, opacity: 0.8 }}>{l.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* EMI Result */}
        {emi > 0 && (
          <>
            <div style={s.emiBox}>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Monthly EMI</div>
              <div style={{ fontSize: 38, fontWeight: 900, color: 'var(--accent3)', fontFamily: 'Rajdhani,sans-serif', lineHeight: 1 }}>
                {formatINRFull(Math.round(emi))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
                for {tenure} months @ {interestRate}% p.a.
              </div>
            </div>

            {/* Breakdown */}
            <div style={s.card}>
              <div style={s.sectionTitle}>Cost Breakdown</div>
              <div style={s.row}>
                <span style={{ color: 'var(--text3)' }}>Ex-Showroom Price</span>
                <span style={{ fontWeight: 600 }}>{formatINRFull(price)}</span>
              </div>
              <div style={s.row}>
                <span style={{ color: 'var(--text3)' }}>Down Payment</span>
                <span style={{ fontWeight: 600 }}>− {formatINRFull(down)}</span>
              </div>
              <div style={s.row}>
                <span style={{ color: 'var(--text3)' }}>Loan Amount</span>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatINRFull(loanAmount)}</span>
              </div>
              <div style={s.row}>
                <span style={{ color: 'var(--text3)' }}>Total Interest</span>
                <span style={{ color: 'var(--red)', fontWeight: 600 }}>{formatINRFull(Math.round(totalInterest))}</span>
              </div>
              <div style={s.row}>
                <span style={{ color: 'var(--text3)' }}>Processing Fee (est.)</span>
                <span style={{ color: 'var(--text2)' }}>{formatINRFull(processingFee)}</span>
              </div>
              <div style={{ ...s.row, borderBottom: 'none', paddingTop: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Total Amount Payable</span>
                <span style={{ color: 'var(--accent3)', fontWeight: 800, fontSize: 15 }}>{formatINRFull(Math.round(totalPayable))}</span>
              </div>
            </div>

            {/* Visual bar — principal vs interest */}
            <div style={s.card}>
              <div style={s.sectionTitle}>Principal vs Interest</div>
              <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${(loanAmount / (loanAmount + totalInterest)) * 100}%`, background: 'var(--accent)', borderRadius: '5px 0 0 5px' }} />
                <div style={{ flex: 1, background: 'var(--red)', borderRadius: '0 5px 5px 0' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)' }} />
                  <span style={{ color: 'var(--text3)' }}>Principal <strong style={{ color: 'var(--text)' }}>{formatINRFull(loanAmount)}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--red)' }} />
                  <span style={{ color: 'var(--text3)' }}>Interest <strong style={{ color: 'var(--text)' }}>{formatINRFull(Math.round(totalInterest))}</strong></span>
                </div>
              </div>
            </div>

            {/* Amortization — first 6 months */}
            {amortization.length > 0 && (
              <div style={s.card}>
                <div style={s.sectionTitle}>First {amortization.length} Month Breakdown</div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ color: 'var(--text3)' }}>
                        {['Mo.', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                          <th key={h} style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {amortization.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--text3)' }}>{row.month}</td>
                          <td style={{ padding: '7px 8px', textAlign: 'right', fontWeight: 600 }}>{formatINR(row.emi)}</td>
                          <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--accent)' }}>{formatINR(row.principal)}</td>
                          <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--red)' }}>{formatINR(row.interest)}</td>
                          <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--text2)' }}>{formatINR(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {tenure > 6 && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, textAlign: 'center' }}>
                    Showing first 6 of {tenure} months
                  </div>
                )}
              </div>
            )}

            {/* Tip */}
            <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, padding: 14, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 }}>
              💡 <strong>Tip:</strong> A 20%+ down payment reduces your EMI significantly and improves loan approval chances. Compare at least 2 lenders before finalising.
            </div>
          </>
        )}

        {/* Empty state */}
        {!emi && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧮</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Enter bike price to calculate EMI</div>
            <div style={{ fontSize: 13 }}>Pick a popular bike above or enter price manually</div>
          </div>
        )}
      </div>
    </div>
  );
}
