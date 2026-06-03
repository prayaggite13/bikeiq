import React, { useState } from 'react';
import { Calculator, Zap, Search, ChevronRight } from 'lucide-react';
import { calculateOwnershipCost, formatINR } from '../utils/calculator';
import { searchBikeInfo } from '../utils/gemini';

const ALL_BIKES = [
  'Honda Activa 6G', 'Honda SP 125', 'Honda Shine', 'Honda CB350', 'Honda Hornet 2.0',
  'TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Ntorq 125', 'TVS Jupiter 125', 'TVS Raider 125',
  'Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R', 'Hero Xpulse 200',
  'Bajaj Pulsar NS200', 'Bajaj Pulsar 150', 'Bajaj Dominar 400', 'Bajaj Avenger 220', 'Bajaj Chetak Electric',
  'Royal Enfield Classic 350', 'Royal Enfield Meteor 350', 'Royal Enfield Himalayan', 'Royal Enfield Hunter 350',
  'Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125', 'Yamaha RayZR 125',
  'KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM 390 Adventure',
  'Ola S1 Pro', 'Ola S1 Air', 'Ather 450X', 'Ather 450S', 'Ather Rizta',
  'Simple One', 'Revolt RV400', 'BMW G 310 R', 'Kawasaki Ninja 300',
  'Triumph Speed 400', 'Jawa 42', 'Suzuki Gixxer SF', 'Suzuki Access 125',
];

export default function OwnershipPage() {
  const [bikeName, setBikeName] = useState('');
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dailyKm, setDailyKm] = useState(30);
  const [years, setYears] = useState(3);
  const [downPayment, setDownPayment] = useState(0);
  const [fuelPrice, setFuelPrice] = useState(106);
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (val) => {
    setBikeName(val);
    setResult(null);
    setBike(null);
    if (val.length >= 2) {
      const filtered = ALL_BIKES.filter(b => b.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchBike = async (name) => {
    const searchName = name || bikeName;
    if (!searchName.trim()) return;
    setShowSuggestions(false);
    setLoading(true);
    setResult(null);
    const b = await searchBikeInfo(searchName);
    setBike(b);
    setLoading(false);
  };

  const calculate = () => {
    if (!bike) return;
    const r = calculateOwnershipCost({ bike, dailyKm, years, downPayment, loanTenure: 24, fuelPrice });
    setResult(r);
  };

  const breakdownItems = result ? [
    { label: 'Purchase Price', value: result.purchasePrice, color: 'var(--text)' },
    { label: `Fuel/Charging (${years}yr)`, value: result.fuelCost, color: 'var(--accent3)' },
    { label: 'Insurance', value: result.totalInsurance, color: 'var(--yellow)' },
    { label: 'Service/Maintenance', value: result.serviceCost, color: 'var(--purple)' },
    { label: 'Tyres (if applicable)', value: result.tyreReplacement, color: 'var(--accent)' },
  ] : [];

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(255,107,53,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calculator size={20} color="var(--accent3)" />
        </div>
        <div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem' }}>Ownership Cost Calculator</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>True cost beyond showroom price</div>
        </div>
      </div>

      {/* Bike search with suggestions */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>Search Bike</div>
        <div style={{ position: 'relative' }}>
          <div className="search-bar" style={{ marginBottom: showSuggestions ? 0 : 0 }}>
            <Search size={16} color="var(--text3)" />
            <input
              placeholder="e.g. Yamaha R15 V4, Honda Activa..."
              value={bikeName}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchBike()}
              onFocus={() => bikeName.length >= 2 && setShowSuggestions(suggestions.length > 0)}
            />
            <button className="btn btn-primary btn-sm" onClick={() => fetchBike()} disabled={loading}>
              {loading ? '...' : 'Fetch'}
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, marginTop: 6, overflow: 'hidden',
              boxShadow: 'var(--shadow)'
            }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => { setBikeName(s); setShowSuggestions(false); fetchBike(s); }}
                  style={{
                    padding: '10px 16px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Search size={12} color="var(--text3)" />
                    <span style={{ fontSize: '0.85rem' }}>{s}</span>
                  </div>
                  <ChevronRight size={13} color="var(--text3)" />
                </div>
              ))}
            </div>
          )}
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, color: 'var(--text3)', fontSize: '0.82rem' }}>
            <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            Fetching bike data...
          </div>
        )}

        {bike && !loading && (
          <div style={{ marginTop: 10, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>{bike.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{bike.brand} · Base price: {formatINR(bike.basePrice)}</div>
          </div>
        )}
      </div>

      {/* Parameters */}
      {bike && !loading && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 14, color: 'var(--accent)' }}>Your Usage</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text2)' }}>
              <span>Daily km</span>
              <strong style={{ color: 'var(--accent)' }}>{dailyKm} km</strong>
            </div>
            <input type="range" min={5} max={150} value={dailyKm} onChange={e => { setDailyKm(+e.target.value); setResult(null); }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 600, marginBottom: 8, fontSize: '0.88rem' }}>Ownership Period</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 5].map(y => (
                <button key={y} className={`btn btn-sm ${years === y ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => { setYears(y); setResult(null); }}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text2)' }}>
              <span>Down Payment</span>
              <strong style={{ color: 'var(--accent)' }}>{formatINR(downPayment)}</strong>
            </div>
            <input type="range" min={0} max={bike.basePrice} step={5000} value={downPayment} onChange={e => { setDownPayment(+e.target.value); setResult(null); }} />
          </div>

          {bike.fuelType !== 'Electric' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem', color: 'var(--text2)' }}>
                <span>Petrol Price (₹/litre)</span>
                <strong style={{ color: 'var(--accent)' }}>₹{fuelPrice}</strong>
              </div>
              <input type="range" min={80} max={130} step={1} value={fuelPrice} onChange={e => { setFuelPrice(+e.target.value); setResult(null); }} />
            </div>
          )}

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={calculate}>
            <Zap size={16} /> Calculate True Cost
          </button>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="fade-in">
          <div className="card" style={{ marginBottom: 12, background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(255,107,53,0.04))' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Total {result.years}-Year Cost
              </div>
              <div style={{ fontFamily: 'Rajdhani', fontSize: '2.4rem', fontWeight: 700, color: 'var(--accent)' }}>
                {formatINR(result.totalCost)}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 4 }}>
                ≈ ₹{result.costPerKm}/km · {result.totalKm.toLocaleString()} km total
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {breakdownItems.map((item, i) => (
                item.value > 0 && (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.82rem' }}>
                      <span style={{ color: 'var(--text2)' }}>{item.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono', color: item.color, fontWeight: 600 }}>{formatINR(item.value)}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(item.value / result.totalCost) * 100}%`, background: item.color }} />
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {downPayment < bike?.basePrice && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10 }}>EMI Breakdown (24 months @ 9%)</div>
              <div className="grid-2" style={{ gap: 8 }}>
                <div className="stat-box">
                  <div className="stat-value">₹{result.emi.toLocaleString()}</div>
                  <div className="stat-label">Monthly EMI</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value" style={{ color: 'var(--accent3)' }}>{formatINR(result.totalLoanCost - (bike?.basePrice - downPayment))}</div>
                  <div className="stat-label">Interest Paid</div>
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.1)' }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 8, color: 'var(--green)' }}>💡 Insight</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              At {dailyKm}km/day over {years} years, you'll ride ~{result.totalKm.toLocaleString()}km. Your biggest expense after purchase is {result.fuelCost > result.totalInsurance ? 'fuel/charging' : 'insurance'} at {formatINR(Math.max(result.fuelCost, result.totalInsurance))}. Plan accordingly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
