import React, { useState } from 'react';
import { Shield, Search, ChevronRight, Zap } from 'lucide-react';
import { formatINR } from '../utils/calculator';

const ALL_BIKES = [
  'Honda Activa 6G', 'Honda Activa 5G', 'Honda Activa 125', 'Honda SP 125', 'Honda Shine',
  'Honda CB350', 'Honda Hornet 2.0', 'Honda CB Unicorn', 'Honda Livo', 'Honda Dream Yuga',
  'Hero Splendor Plus', 'Hero HF Deluxe', 'Hero Glamour', 'Hero Xtreme 160R', 'Hero Passion Pro',
  'Hero Xpulse 200', 'Hero Destini 125', 'Hero Maestro Edge', 'Hero Pleasure Plus',
  'TVS Apache RTR 160', 'TVS Apache RTR 200', 'TVS Apache RR 310', 'TVS Ntorq 125',
  'TVS Jupiter 125', 'TVS Jupiter', 'TVS Raider 125', 'TVS Ronin', 'TVS iQube Electric',
  'Bajaj Pulsar 150', 'Bajaj Pulsar NS200', 'Bajaj Pulsar 220F', 'Bajaj Dominar 400',
  'Bajaj Avenger 220', 'Bajaj CT 100', 'Bajaj Platina 110', 'Bajaj Chetak Electric',
  'Royal Enfield Classic 350', 'Royal Enfield Bullet 350', 'Royal Enfield Meteor 350',
  'Royal Enfield Himalayan', 'Royal Enfield Hunter 350', 'Royal Enfield Thunderbird 350',
  'Royal Enfield Interceptor 650', 'Royal Enfield Super Meteor 650',
  'Yamaha R15 V4', 'Yamaha MT-15', 'Yamaha FZ-S V3', 'Yamaha Fascino 125', 'Yamaha FZ 25',
  'KTM Duke 390', 'KTM Duke 200', 'KTM Duke 125', 'KTM RC 390', 'KTM 390 Adventure',
  'Ola S1 Pro', 'Ather 450X', 'Ather Rizta', 'Bajaj Chetak', 'TVS iQube',
  'Suzuki Gixxer SF', 'Suzuki Access 125', 'BMW G 310 R', 'Kawasaki Ninja 300',
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ludhiana', 'Agra',
];

// Insurance calculation based on bike price, age, city
function calculateInsurance(bikePrice, bikeAgeYears, city, riderAge, ncb) {
  // IDV calculation
  const depreciationRates = [0, 0.15, 0.20, 0.30, 0.40, 0.50];
  const depRate = depreciationRates[Math.min(bikeAgeYears, 5)] || 0.50;
  const idv = Math.round(bikePrice * (1 - depRate));

  // Base OD premium (roughly 1.5-2% of IDV)
  let odPremium = Math.round(idv * 0.018);

  // TP premium (fixed by IRDAI based on engine cc — we estimate)
  let tpPremium = bikePrice < 75000 ? 2901 : bikePrice < 150000 ? 3851 : 7897;

  // NCB discount on OD
  const ncbRates = { 0: 0, 1: 0.20, 2: 0.25, 3: 0.35, 4: 0.45, 5: 0.50 };
  const ncbDiscount = Math.round(odPremium * (ncbRates[Math.min(ncb, 5)] || 0));
  odPremium -= ncbDiscount;

  // Rider age loading (young riders pay more)
  if (riderAge < 25) odPremium = Math.round(odPremium * 1.10);

  // Metro city loading
  const metroгорода = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
  if (metroгорода.includes(city)) odPremium = Math.round(odPremium * 1.08);

  const gst = Math.round((odPremium + tpPremium) * 0.18);
  const comprehensive = odPremium + tpPremium + gst;
  const thirdPartyOnly = tpPremium + Math.round(tpPremium * 0.18);

  return {
    idv,
    odPremium,
    tpPremium,
    ncbDiscount: Math.round(bikePrice * 0.018 * (ncbRates[Math.min(ncb, 5)] || 0)),
    gst,
    comprehensive,
    thirdPartyOnly,
    addons: {
      zeroDepreciation: Math.round(odPremium * 0.15),
      engineProtection: Math.round(odPremium * 0.08),
      roadside: 500,
      consumables: Math.round(odPremium * 0.05),
    }
  };
}

// Rough bike price lookup by name
function estimateBikePrice(name) {
  const n = name.toLowerCase();
  if (n.includes('ktm duke 390') || n.includes('rc 390') || n.includes('390 adventure')) return 320000;
  if (n.includes('ktm duke 200') || n.includes('rc 200')) return 200000;
  if (n.includes('ktm duke 125') || n.includes('rc 125')) return 155000;
  if (n.includes('r15') || n.includes('r 15')) return 185000;
  if (n.includes('mt-15') || n.includes('mt 15')) return 168000;
  if (n.includes('fz 25') || n.includes('fzs 25') || n.includes('fazer 25')) return 145000;
  if (n.includes('fz-s') || n.includes('fzs')) return 115000;
  if (n.includes('apache rr 310') || n.includes('rr310')) return 275000;
  if (n.includes('apache rtr 200') || n.includes('rtr200')) return 135000;
  if (n.includes('apache rtr 160') || n.includes('rtr160')) return 125000;
  if (n.includes('dominar 400')) return 225000;
  if (n.includes('dominar 250')) return 165000;
  if (n.includes('pulsar ns200') || n.includes('ns 200')) return 148000;
  if (n.includes('pulsar 220') || n.includes('rs200')) return 140000;
  if (n.includes('pulsar 180')) return 120000;
  if (n.includes('pulsar 150') || n.includes('pulsar n160')) return 115000;
  if (n.includes('avenger 220')) return 135000;
  if (n.includes('classic 350') || n.includes('classic350')) return 195000;
  if (n.includes('meteor 350')) return 205000;
  if (n.includes('hunter 350')) return 155000;
  if (n.includes('himalayan')) return 230000;
  if (n.includes('thunderbird')) return 185000;
  if (n.includes('interceptor 650') || n.includes('super meteor') || n.includes('continental gt 650')) return 335000;
  if (n.includes('bullet 350') || n.includes('bullet350')) return 165000;
  if (n.includes('ola s1 pro')) return 130000;
  if (n.includes('ather 450x')) return 140000;
  if (n.includes('ather rizta')) return 115000;
  if (n.includes('chetak electric')) return 120000;
  if (n.includes('iqube electric') || n.includes('iqube')) return 95000;
  if (n.includes('hornet 2.0') || n.includes('hornet160')) return 135000;
  if (n.includes('cb350') || n.includes('cb 350')) return 210000;
  if (n.includes('shine') || n.includes('cb shine')) return 82000;
  if (n.includes('unicorn') || n.includes('cb unicorn')) return 95000;
  if (n.includes('activa 6g') || n.includes('activa6g')) return 78000;
  if (n.includes('activa 5g') || n.includes('activa5g')) return 68000;
  if (n.includes('activa 125') || n.includes('activa125')) return 82000;
  if (n.includes('activa')) return 75000;
  if (n.includes('dio')) return 68000;
  if (n.includes('grazia')) return 80000;
  if (n.includes('sp 125') || n.includes('sp125')) return 90000;
  if (n.includes('livo')) return 78000;
  if (n.includes('dream yuga') || n.includes('dream neo')) return 70000;
  if (n.includes('splendor plus') || n.includes('splendor pro')) return 78000;
  if (n.includes('splendor ismart') || n.includes('super splendor')) return 85000;
  if (n.includes('hf deluxe') || n.includes('hf dawn')) return 64000;
  if (n.includes('glamour')) return 88000;
  if (n.includes('xtreme 160r') || n.includes('xtreme160')) return 118000;
  if (n.includes('xtreme 200') || n.includes('xtreme200')) return 140000;
  if (n.includes('xpulse 200') || n.includes('xpulse200')) return 140000;
  if (n.includes('karizma')) return 165000;
  if (n.includes('passion pro') || n.includes('passion x')) return 82000;
  if (n.includes('destini 125') || n.includes('destini125')) return 80000;
  if (n.includes('maestro edge 125') || n.includes('maestro125')) return 82000;
  if (n.includes('maestro edge') || n.includes('maestro')) return 76000;
  if (n.includes('pleasure plus') || n.includes('pleasure')) return 68000;
  if (n.includes('ntorq 125') || n.includes('ntorq125')) return 88000;
  if (n.includes('jupiter 125') || n.includes('jupiter125')) return 84000;
  if (n.includes('jupiter')) return 78000;
  if (n.includes('raider 125') || n.includes('raider125')) return 92000;
  if (n.includes('ronin')) return 145000;
  if (n.includes('ct 100') || n.includes('ct100')) return 55000;
  if (n.includes('ct 110') || n.includes('ct110')) return 60000;
  if (n.includes('platina 110') || n.includes('platina100')) return 68000;
  if (n.includes('discover 125') || n.includes('discover125')) return 80000;
  if (n.includes('gixxer sf 250') || n.includes('gixxer250')) return 180000;
  if (n.includes('gixxer sf') || n.includes('gixxer')) return 130000;
  if (n.includes('access 125') || n.includes('access125')) return 82000;
  if (n.includes('burgman')) return 95000;
  if (n.includes('bmw g 310') || n.includes('bmw310')) return 310000;
  if (n.includes('kawasaki ninja 300') || n.includes('ninja300')) return 300000;
  if (n.includes('triumph speed 400') || n.includes('triumph scrambler')) return 230000;
  if (n.includes('jawa 42') || n.includes('jawa350')) return 210000;
  if (n.includes('fascino 125') || n.includes('fascino125')) return 82000;
  if (n.includes('rayzr') || n.includes('ray zr')) return 88000;
  return 100000; // default
}

export default function InsurancePage() {
  const [bikeName, setBikeName] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [bikeAge, setBikeAge] = useState(0);
  const [riderAge, setRiderAge] = useState(25);
  const [ncb, setNcb] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const handleInput = (val) => {
    setBikeName(val);
    setResult(null);
    if (val.length >= 2) {
      const filtered = ALL_BIKES.filter(b => b.toLowerCase().includes(val.toLowerCase())).slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const calculate = () => {
    if (!bikeName.trim()) return;
    setShowSuggestions(false);
    const price = estimateBikePrice(bikeName);
    const res = calculateInsurance(price, bikeAge, city, riderAge, ncb);
    setResult({ ...res, bikePrice: price });
  };

  const toggleAddon = (key) => {
    setSelectedAddons(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const addonTotal = result ? selectedAddons.reduce((sum, key) => sum + (result.addons[key] || 0), 0) : 0;

  const ADDONS = [
    { key: 'zeroDepreciation', label: 'Zero Depreciation', desc: 'Get full claim without depreciation deduction', icon: '🛡️' },
    { key: 'engineProtection', label: 'Engine Protection', desc: 'Covers engine damage from waterlogging etc.', icon: '⚙️' },
    { key: 'roadside', label: 'Roadside Assistance', desc: '24/7 breakdown help anywhere in India', icon: '🚨' },
    { key: 'consumables', label: 'Consumables Cover', desc: 'Covers nuts, bolts, oil during claims', icon: '🔧' },
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(0,230,118,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={20} color="var(--green)" />
        </div>
        <div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem' }}>Insurance Estimator</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Estimate your bike insurance premium</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 14, color: 'var(--accent)' }}>Bike Details</div>

        {/* Bike search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>Bike Name</div>
          <div className="search-bar">
            <Search size={15} color="var(--text3)" />
            <input placeholder="e.g. Honda Activa 6G" value={bikeName} onChange={e => handleInput(e.target.value)} onFocus={() => bikeName.length >= 2 && setShowSuggestions(suggestions.length > 0)} />
          </div>
          {showSuggestions && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, marginTop: 4, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => { setBikeName(s); setShowSuggestions(false); setResult(null); }}
                  style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '0.85rem' }}>{s}</span>
                  <ChevronRight size={13} color="var(--text3)" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>Registration City</div>
          <select value={city} onChange={e => { setCity(e.target.value); setResult(null); }}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Bike age */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: 'var(--text3)' }}>
            <span>Bike Age</span>
            <strong style={{ color: 'var(--accent)' }}>{bikeAge === 0 ? 'Brand New' : `${bikeAge} year${bikeAge > 1 ? 's' : ''} old`}</strong>
          </div>
          <input type="range" min={0} max={10} value={bikeAge} onChange={e => { setBikeAge(+e.target.value); setResult(null); }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text3)', marginTop: 2 }}><span>New</span><span>10 yrs</span></div>
        </div>

        {/* Rider age */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: 'var(--text3)' }}>
            <span>Rider Age</span>
            <strong style={{ color: 'var(--accent)' }}>{riderAge} years</strong>
          </div>
          <input type="range" min={18} max={65} value={riderAge} onChange={e => { setRiderAge(+e.target.value); setResult(null); }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text3)', marginTop: 2 }}><span>18</span><span>65</span></div>
          {riderAge < 25 && <div style={{ fontSize: '0.7rem', color: 'var(--yellow)', marginTop: 4 }}>⚠️ Riders under 25 pay ~10% higher premium</div>}
        </div>

        {/* NCB */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 8 }}>No Claim Bonus (NCB) Years</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2, 3, 4, 5].map(y => (
              <button key={y} className={`btn btn-sm ${ncb === y ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                onClick={() => { setNcb(y); setResult(null); }}>
                {y === 0 ? 'None' : `${y}yr`}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 6 }}>NCB = discount for not making claims. {ncb > 0 ? `${[0,20,25,35,45,50][ncb]}% discount on OD premium` : 'No discount yet'}</div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={calculate} disabled={!bikeName.trim()}>
          <Zap size={16} /> Calculate Insurance
        </button>
      </div>

      {result && (
        <div className="fade-in">
          {/* Main result */}
          <div className="card" style={{ marginBottom: 12, background: 'linear-gradient(135deg, rgba(0,230,118,0.06), rgba(0,212,255,0.04))', border: '1px solid rgba(0,230,118,0.2)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Estimated IDV</div>
            <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>{formatINR(result.idv)}</div>

            <div className="grid-2" style={{ gap: 10, marginBottom: 16 }}>
              <div style={{ textAlign: 'center', background: 'var(--bg2)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, color: 'var(--green)' }}>{formatINR(result.comprehensive)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Comprehensive</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>OD + TP + GST</div>
              </div>
              <div style={{ textAlign: 'center', background: 'var(--bg2)', borderRadius: 12, padding: 14, border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)' }}>{formatINR(result.thirdPartyOnly)}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Third Party Only</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>Mandatory minimum</div>
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10 }}>Premium Breakdown</div>
            {[
              { label: 'Own Damage (OD) Premium', value: result.odPremium, color: 'var(--text)' },
              { label: 'Third Party (TP) Premium', value: result.tpPremium, color: 'var(--text)' },
              result.ncbDiscount > 0 && { label: `NCB Discount (${ncb} yr${ncb > 1 ? 's' : ''})`, value: -result.ncbDiscount, color: 'var(--green)' },
              { label: 'GST (18%)', value: result.gst, color: 'var(--text3)' },
            ].filter(Boolean).map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text2)' }}>{row.label}</span>
                <span style={{ fontFamily: 'JetBrains Mono', color: row.color, fontWeight: 600 }}>{row.value < 0 ? `-${formatINR(Math.abs(row.value))}` : formatINR(row.value)}</span>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 12 }}>🛡️ Add-on Covers</div>
            {ADDONS.map(addon => (
              <div key={addon.key}
                onClick={() => toggleAddon(addon.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: selectedAddons.includes(addon.key) ? 'rgba(0,212,255,0.1)' : 'var(--bg3)', border: `1px solid ${selectedAddons.includes(addon.key) ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {addon.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{addon.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{addon.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--accent)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>+{formatINR(result.addons[addon.key])}</div>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${selectedAddons.includes(addon.key) ? 'var(--accent)' : 'var(--border)'}`, background: selectedAddons.includes(addon.key) ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginTop: 4 }}>
                    {selectedAddons.includes(addon.key) && <span style={{ color: '#000', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}

            {selectedAddons.length > 0 && (
              <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(0,212,255,0.06)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total with Add-ons</span>
                <span style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{formatINR(result.comprehensive + addonTotal)}</span>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card" style={{ background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.1)' }}>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--green)' }}>💡 Insurance Tips</div>
            {[
              'Comprehensive is always better than TP-only for bikes under 5 years',
              'Zero Depreciation is worth it for new bikes — you get full claim amount',
              'NCB can save up to 50% on OD premium — never make small claims',
              'Compare quotes on Policybazaar, Coverfox before buying',
              bikeAge === 0 ? 'First year insurance: Buy from dealer is convenient but compare online too' : null,
              riderAge < 25 ? 'Young riders pay higher premium — this reduces as you cross 25' : null,
            ].filter(Boolean).map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{tip}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, fontSize: '0.72rem', color: 'var(--text3)', lineHeight: 1.5 }}>
            ⚠️ These are estimates based on standard IRDAI rates. Actual premium may vary by insurer. Always compare quotes online before purchasing.
          </div>
        </div>
      )}
    </div>
  );
}
