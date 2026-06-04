import React, { useState } from 'react';
import { TrendingDown, Search, ChevronRight, Zap } from 'lucide-react';
import { askGemini } from '../utils/gemini';
import { formatINR } from '../utils/calculator';

const ALL_BIKES = [
  // Honda — current & old
  'Honda Activa 6G', 'Honda Activa 5G', 'Honda Activa 4G', 'Honda Activa 3G', 'Honda Activa 125',
  'Honda Activa i', 'Honda Dio', 'Honda Grazia', 'Honda Aviator',
  'Honda SP 125', 'Honda Shine', 'Honda Shine SP', 'Honda CB Shine', 'Honda CB Unicorn',
  'Honda CB Unicorn 160', 'Honda CB Trigger', 'Honda CB Twister', 'Honda CB350', 'Honda CB350RS',
  'Honda Hornet 2.0', 'Honda CB Hornet 160R', 'Honda CBR 150R', 'Honda CBR 250R',
  'Honda Livo', 'Honda Dream Yuga', 'Honda Dream Neo', 'Honda CD 110 Dream',
  'Honda Africa Twin', 'Honda CB500F',

  // Hero — current & old
  'Hero Splendor Plus', 'Hero Splendor iSmart', 'Hero Splendor Pro', 'Hero Super Splendor',
  'Hero HF Deluxe', 'Hero HF Dawn', 'Hero HF Eco', 'Hero Passion Pro', 'Hero Passion X Pro',
  'Hero Glamour', 'Hero Glamour FI', 'Hero Achiever', 'Hero Ignitor', 'Hero Hunk',
  'Hero Xtreme 160R', 'Hero Xtreme Sports', 'Hero Xtreme 200R', 'Hero Xtreme 200S',
  'Hero Xpulse 200', 'Hero Xpulse 200T', 'Hero Karizma R', 'Hero Karizma ZMR',
  'Hero Destini 125', 'Hero Maestro Edge', 'Hero Maestro Edge 125', 'Hero Pleasure',
  'Hero Pleasure Plus', 'Hero Duet', 'Hero Duet 125',

  // TVS — current & old
  'TVS Apache RTR 160', 'TVS Apache RTR 160 4V', 'TVS Apache RTR 180', 'TVS Apache RTR 200 4V',
  'TVS Apache RR 310', 'TVS Ntorq 125', 'TVS Jupiter 125', 'TVS Jupiter Classic',
  'TVS Jupiter', 'TVS Wego', 'TVS Scooty Pep Plus', 'TVS Scooty Zest', 'TVS Scooty Streak',
  'TVS Star City Plus', 'TVS Radeon', 'TVS Sport', 'TVS Max 4R', 'TVS Victor', 'TVS Raider 125',
  'TVS Ronin', 'TVS iQube Electric',

  // Bajaj — current & old
  'Bajaj Pulsar 150', 'Bajaj Pulsar 150 Twin Disc', 'Bajaj Pulsar 180', 'Bajaj Pulsar 180F',
  'Bajaj Pulsar 200 NS', 'Bajaj Pulsar NS200', 'Bajaj Pulsar RS200', 'Bajaj Pulsar 220F',
  'Bajaj Pulsar AS150', 'Bajaj Pulsar AS200', 'Bajaj Pulsar N160', 'Bajaj Pulsar N250',
  'Bajaj Dominar 400', 'Bajaj Dominar 250', 'Bajaj Avenger 220', 'Bajaj Avenger 220 Cruise',
  'Bajaj Avenger 150', 'Bajaj Avenger 160 Street', 'Bajaj Avenger 220 Street',
  'Bajaj CT 100', 'Bajaj CT 110', 'Bajaj Platina 100', 'Bajaj Platina 110 H Gear',
  'Bajaj Discover 100', 'Bajaj Discover 125', 'Bajaj Discover 150',
  'Bajaj Chetak Electric', 'Bajaj Chetak',

  // Royal Enfield — current & old
  'Royal Enfield Classic 350', 'Royal Enfield Classic 500', 'Royal Enfield Classic 350 Signals',
  'Royal Enfield Bullet 350', 'Royal Enfield Bullet 500', 'Royal Enfield Bullet Electra',
  'Royal Enfield Thunderbird 350', 'Royal Enfield Thunderbird 500', 'Royal Enfield Thunderbird 350X',
  'Royal Enfield Himalayan', 'Royal Enfield Meteor 350', 'Royal Enfield Hunter 350',
  'Royal Enfield Continental GT 535', 'Royal Enfield Continental GT 650',
  'Royal Enfield Interceptor 650', 'Royal Enfield Super Meteor 650',
  'Royal Enfield Guerrilla 450', 'Royal Enfield Shotgun 650',

  // Yamaha — current & old
  'Yamaha R15 V4', 'Yamaha R15 V3', 'Yamaha R15 V2', 'Yamaha R15 S',
  'Yamaha MT-15', 'Yamaha MT-15 V2', 'Yamaha FZ-S V3', 'Yamaha FZ-S V2', 'Yamaha FZ-S',
  'Yamaha FZ 25', 'Yamaha FZS 25', 'Yamaha Fazer 25', 'Yamaha Fazer FI V2',
  'Yamaha SZ-RR', 'Yamaha SZ-S', 'Yamaha SS125', 'Yamaha Saluto',
  'Yamaha Fascino 125', 'Yamaha Fascino', 'Yamaha RayZR 125', 'Yamaha Ray ZR Street Rally',
  'Yamaha Alpha', 'Yamaha Cygnus Ray', 'Yamaha YZF R3',

  // Suzuki — current & old
  'Suzuki Gixxer SF', 'Suzuki Gixxer SF 250', 'Suzuki Gixxer 250', 'Suzuki Gixxer',
  'Suzuki Access 125', 'Suzuki Burgman Street', 'Suzuki Lets', 'Suzuki Swish 125',
  'Suzuki Hayate', 'Suzuki Slingshot Plus', 'Suzuki GS150R', 'Suzuki Inazuma',

  // KTM — current & old
  'KTM Duke 390', 'KTM Duke 250', 'KTM Duke 200', 'KTM Duke 125',
  'KTM RC 390', 'KTM RC 200', 'KTM RC 125', 'KTM 390 Adventure',

  // EV
  'Ola S1 Pro', 'Ola S1 Air', 'Ola S1 X', 'Ather 450X', 'Ather 450S', 'Ather Rizta',
  'Ather 450 Plus', 'Ather 340', 'Simple One', 'Revolt RV400', 'Revolt RV300',
  'Bajaj Chetak Electric', 'TVS iQube Electric', 'Hero Vida V1 Pro',

  // Others
  'BMW G 310 R', 'BMW G 310 GS', 'Kawasaki Ninja 300', 'Kawasaki Ninja 650', 'Kawasaki Z400',
  'Triumph Speed 400', 'Triumph Scrambler 400', 'Jawa 42', 'Jawa Perak', 'Jawa 350',
  'Mahindra Mojo', 'Mahindra Gusto', 'Mahindra Centuro',
  'India Yamaha SZ', 'Hyosung GT250R', 'Benelli TNT 300', 'Benelli TNT 600',
  'Honda CB650F', 'Honda CBR650F', 'Ducati Monster', 'Harley Davidson Street 750',
  'Harley Davidson Iron 883',
];

const CONDITIONS = [
  { value: 'excellent', label: 'Excellent', desc: 'Like new, no scratches, full service history', emoji: '⭐' },
  { value: 'good', label: 'Good', desc: 'Minor wear, regular servicing done', emoji: '✅' },
  { value: 'fair', label: 'Fair', desc: 'Some scratches, occasional service gaps', emoji: '🟡' },
  { value: 'poor', label: 'Poor', desc: 'Visible damage, irregular maintenance', emoji: '🔴' },
];

const SYSTEM_PROMPT = `You are BikeIQ's resale value expert for India. Analyze a used bike and return ONLY a valid JSON object:
{
  "currentResale": 85000,
  "resalePercent": 72,
  "marketDemand": "High",
  "bestTimeToSell": "Now",
  "priceRange": { "low": 78000, "high": 92000 },
  "depreciationRate": 15,
  "factors": [
    { "factor": "Brand reputation", "impact": "positive", "detail": "Honda has excellent resale in India" },
    { "factor": "High km driven", "impact": "negative", "detail": "Above average km reduces price by 8-10%" },
    { "factor": "Service history", "impact": "positive", "detail": "Regular service adds 5-7% to value" }
  ],
  "tips": [
    "Get the bike serviced before selling",
    "Clean and polish thoroughly",
    "Gather all documents — RC, insurance, service records"
  ],
  "futureValue": [
    { "months": 6, "value": 80000 },
    { "months": 12, "value": 74000 },
    { "months": 24, "value": 63000 }
  ],
  "verdict": "2-3 sentence honest verdict on this bike's resale prospects in India"
}
Return ONLY the JSON. No markdown. No explanation.`;

export default function ResalePage({ navigate }) {
  const [bikeName, setBikeName] = useState('');
  const [age, setAge] = useState(2);
  const [km, setKm] = useState(20000);
  const [condition, setCondition] = useState('good');
  const [originalPrice, setOriginalPrice] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const handleInputChange = (val) => {
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

  const calculate = async () => {
    if (!bikeName.trim()) return;
    setLoading(true);
    setResult(null);
    setShowSuggestions(false);

    const prompt = `Predict resale value for this used bike in India:
- Bike: ${bikeName}
- Age: ${age} year${age > 1 ? 's' : ''}
- Kilometers driven: ${km.toLocaleString()} km
- Condition: ${condition}
- Original purchase price: ${originalPrice ? '₹' + parseInt(originalPrice).toLocaleString() : 'unknown'}

Give realistic Indian used bike market resale estimate.`;

    try {
      const response = await askGemini(prompt, SYSTEM_PROMPT);
      const clean = response.replace(/```json|```/g, '').trim();
      // Find JSON object in response
      const jsonMatch = clean.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
        setError(false);
      } else {
        setError(true);
      }
    } catch (e) {
      console.error('Resale parse error:', e);
      setError(true);
    }
    setLoading(false);
  };

  const getImpactColor = (impact) => {
    if (impact === 'positive') return 'var(--green)';
    if (impact === 'negative') return 'var(--red)';
    return 'var(--yellow)';
  };

  const getImpactIcon = (impact) => {
    if (impact === 'positive') return '↑';
    if (impact === 'negative') return '↓';
    return '→';
  };

  const getDemandColor = (demand) => {
    if (!demand) return 'var(--text3)';
    const d = demand.toLowerCase();
    if (d === 'high' || d === 'very high') return 'var(--green)';
    if (d === 'medium' || d === 'moderate') return 'var(--yellow)';
    return 'var(--red)';
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(179,136,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingDown size={20} color="var(--purple)" />
        </div>
        <div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem' }}>Resale Value Predictor</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>AI-powered used bike price estimator</div>
        </div>
      </div>

      {/* Input form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 14, color: 'var(--accent)' }}>Bike Details</div>

        {/* Bike search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>Bike Name</div>
          <div className="search-bar">
            <Search size={15} color="var(--text3)" />
            <input
              placeholder="e.g. Honda Activa 6G"
              value={bikeName}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && calculate()}
              onFocus={() => bikeName.length >= 2 && setShowSuggestions(suggestions.length > 0)}
            />
          </div>
          {showSuggestions && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 12, marginTop: 4, overflow: 'hidden', boxShadow: 'var(--shadow)'
            }}>
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => { setBikeName(s); setShowSuggestions(false); }}
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

        {/* Age slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: 'var(--text3)' }}>
            <span>Bike Age</span>
            <strong style={{ color: 'var(--accent)' }}>{age} year{age > 1 ? 's' : ''}</strong>
          </div>
          <input type="range" min={1} max={15} value={age} onChange={e => { setAge(+e.target.value); setResult(null); }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text3)', marginTop: 2 }}>
            <span>1 yr</span><span>15 yrs</span>
          </div>
        </div>

        {/* KM slider */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.78rem', color: 'var(--text3)' }}>
            <span>Kilometers Driven</span>
            <strong style={{ color: 'var(--accent)' }}>{km.toLocaleString()} km</strong>
          </div>
          <input type="range" min={1000} max={100000} step={1000} value={km} onChange={e => { setKm(+e.target.value); setResult(null); }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text3)', marginTop: 2 }}>
            <span>1,000</span><span>1,00,000</span>
          </div>
        </div>

        {/* Original price */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 6 }}>Original Purchase Price (optional)</div>
          <div className="search-bar">
            <span style={{ color: 'var(--text3)', fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>₹</span>
            <input
              type="number"
              placeholder="e.g. 95000"
              value={originalPrice}
              onChange={e => { setOriginalPrice(e.target.value); setResult(null); }}
            />
          </div>
        </div>

        {/* Condition */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 8 }}>Bike Condition</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CONDITIONS.map(c => (
              <div
                key={c.value}
                onClick={() => { setCondition(c.value); setResult(null); }}
                style={{
                  padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${condition === c.value ? 'var(--accent)' : 'var(--border)'}`,
                  background: condition === c.value ? 'rgba(0,212,255,0.06)' : 'var(--bg3)',
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{c.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: condition === c.value ? 700 : 400, color: condition === c.value ? 'var(--accent)' : 'var(--text)' }}>{c.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{c.desc}</div>
                </div>
                {condition === c.value && <span style={{ marginLeft: 'auto', color: 'var(--accent)' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={calculate} disabled={loading || !bikeName.trim()}>
          <Zap size={16} /> {loading ? 'Predicting...' : 'Predict Resale Value'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.82rem' }}>Analyzing Indian used bike market...</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: 24, border: '1px solid rgba(255,82,82,0.2)', background: 'rgba(255,82,82,0.04)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚠️</div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 6 }}>Couldn't calculate right now</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 16 }}>AI rate limit hit. Please wait 10 seconds and try again.</div>
          <button className="btn btn-primary btn-sm" onClick={calculate}>Try Again</button>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="fade-in">
          {/* Main value card */}
          <div className="card" style={{ marginBottom: 12, background: 'linear-gradient(135deg, rgba(179,136,255,0.08), rgba(0,212,255,0.04))', border: '1px solid rgba(179,136,255,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                Estimated Resale Value
              </div>
              <div style={{ fontFamily: 'Rajdhani', fontSize: '2.6rem', fontWeight: 700, color: 'var(--purple)' }}>
                {formatINR(result.currentResale)}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: 4 }}>
                Range: {formatINR(result.priceRange?.low)} – {formatINR(result.priceRange?.high)}
              </div>
              {originalPrice && (
                <div style={{ marginTop: 8, fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--red)' }}>
                    Lost: {formatINR(parseInt(originalPrice) - result.currentResale)}
                  </span>
                  <span style={{ color: 'var(--text3)', marginLeft: 8 }}>
                    ({result.resalePercent}% retained)
                  </span>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div className="stat-box" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', color: getDemandColor(result.marketDemand) }}>
                  {result.marketDemand || 'Medium'}
                </div>
                <div className="stat-label">Demand</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent3)' }}>
                  {result.depreciationRate}%/yr
                </div>
                <div className="stat-label">Depreciation</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem', color: 'var(--green)' }}>
                  {result.bestTimeToSell || 'Now'}
                </div>
                <div className="stat-label">Best to Sell</div>
              </div>
            </div>
          </div>

          {/* Verdict */}
          {result.verdict && (
            <div className="card" style={{ marginBottom: 12, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 8 }}>🤖 AI Verdict</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>{result.verdict}</p>
            </div>
          )}

          {/* Future value */}
          {result.futureValue?.length > 0 && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 12 }}>📉 Value Over Time</div>
              {result.futureValue.map((fv, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text2)' }}>
                      {fv.months < 12 ? `${fv.months} months` : `${fv.months / 12} year${fv.months > 12 ? 's' : ''}`} from now
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--accent3)', fontWeight: 600 }}>{formatINR(fv.value)}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${(fv.value / result.currentResale) * 100}%`,
                      background: 'var(--accent3)'
                    }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 8 }}>* Values are estimates based on current market trends</p>
            </div>
          )}

          {/* Factors */}
          {result.factors?.length > 0 && (
            <div className="card" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 12 }}>📊 What's Affecting the Price</div>
              {result.factors.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < result.factors.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: f.impact === 'positive' ? 'rgba(0,230,118,0.1)' : f.impact === 'negative' ? 'rgba(255,82,82,0.1)' : 'rgba(255,215,64,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, color: getImpactColor(f.impact), fontSize: '0.9rem'
                  }}>
                    {getImpactIcon(f.impact)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{f.factor}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{f.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selling tips */}
          {result.tips?.length > 0 && (
            <div className="card" style={{ marginBottom: 12, background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.1)' }}>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, marginBottom: 10, color: 'var(--green)' }}>💡 Tips to Get Better Price</div>
              {result.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>{tip}</span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setResult(null)}>
            Check Another Bike
          </button>
        </div>
      )}
    </div>
  );
}
