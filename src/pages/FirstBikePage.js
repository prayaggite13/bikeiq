import React, { useState } from 'react';
import { Zap, ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { askGemini } from '../utils/gemini';
import { formatINR } from '../utils/calculator';

const QUESTIONS = [
  {
    id: 1, question: "Who is this bike for?", emoji: '👤',
    options: [
      { label: 'Student — college commute', value: 'college student for daily college commute', emoji: '🎓' },
      { label: 'First job — office commute', value: 'first job office goer for daily commute', emoji: '💼' },
      { label: 'Teen — learning to ride', value: 'teenager learning to ride for the first time', emoji: '🌱' },
      { label: 'Family member gift', value: 'buying as gift for family member beginner', emoji: '🎁' },
    ]
  },
  {
    id: 2, question: "What's your daily riding distance?", emoji: '📍',
    options: [
      { label: 'Under 15 km/day', value: 'under 15 km per day', emoji: '🏘️' },
      { label: '15 – 30 km/day', value: '15 to 30 km per day', emoji: '🏙️' },
      { label: '30 – 60 km/day', value: '30 to 60 km per day', emoji: '🛣️' },
      { label: 'Above 60 km/day', value: 'above 60 km per day', emoji: '🗺️' },
    ]
  },
  {
    id: 3, question: "What's your budget?", emoji: '💰',
    options: [
      { label: 'Under ₹60,000', value: 'under 60000', emoji: '💚' },
      { label: '₹60K – ₹1L', value: '60000 to 100000', emoji: '💛' },
      { label: '₹1L – ₹1.5L', value: '100000 to 150000', emoji: '🟠' },
      { label: '₹1.5L – ₹2.5L', value: '150000 to 250000', emoji: '🔴' },
    ]
  },
  {
    id: 4, question: "What type of roads?", emoji: '🛣️',
    options: [
      { label: 'Mostly city traffic', value: 'city traffic roads', emoji: '🚦' },
      { label: 'College campus + city', value: 'college campus and city roads', emoji: '🏫' },
      { label: 'Mix of city + highway', value: 'mix of city and highway', emoji: '🔀' },
      { label: 'Small town / village roads', value: 'small town or village roads', emoji: '🌾' },
    ]
  },
  {
    id: 5, question: "What matters most for a first bike?", emoji: '⭐',
    options: [
      { label: 'Easy to handle & light', value: 'easy to handle lightweight and beginner friendly', emoji: '🤝' },
      { label: 'Maximum mileage', value: 'maximum fuel efficiency', emoji: '⛽' },
      { label: 'Low maintenance cost', value: 'low maintenance and service cost', emoji: '🔧' },
      { label: 'Looks & style', value: 'good looks and style', emoji: '😎' },
    ]
  },
  {
    id: 6, question: "Scooter or bike?", emoji: '🏍️',
    options: [
      { label: 'Scooter (automatic, easy)', value: 'automatic scooter', emoji: '🛵' },
      { label: 'Motorcycle (manual gear)', value: 'manual gear motorcycle', emoji: '🏍️' },
      { label: 'No preference', value: 'no preference between scooter or motorcycle', emoji: '🤷' },
      { label: 'Open to EV scooter', value: 'open to electric scooter', emoji: '⚡' },
    ]
  },
];

const SYSTEM = `You are BikeIQ's first bike expert for India. Recommend 3 perfect first bikes based on the user's profile. Return ONLY valid JSON array:
[
  {
    "rank": 1,
    "name": "Honda Activa 6G",
    "brand": "Honda",
    "type": "Scooter",
    "fuelType": "Petrol",
    "price": 75000,
    "emi": 2200,
    "mileage": "50 kmpl",
    "matchScore": 95,
    "whyFirst": "2-3 sentences on why this is perfect as a first bike for this specific user",
    "beginnerFriendly": ["Light weight easy to handle", "Automatic no gear stress", "Wide service network"],
    "watchOut": ["Storage space limited", "Not great on highways"],
    "runningCost": "₹800-1000/month fuel",
    "verdict": "One line strong recommendation"
  }
]
No markdown. No explanation. Only JSON.`;

export default function FirstBikePage({ navigate }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(false);

  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  const handleNext = async () => {
    if (!selected && !answers[q.id]) return;
    const val = selected || answers[q.id];
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);
    setSelected(null);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      await submit(newAnswers);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setSelected(answers[QUESTIONS[step - 1].id] || null);
    }
  };

  const submit = async (finalAnswers) => {
    setLoading(true);
    setError(false);
    const text = Object.entries(finalAnswers).map(([id, val]) => {
      const q = QUESTIONS.find(q => q.id === parseInt(id));
      return `${q.question}: ${val}`;
    }).join('\n');

    try {
      const res = await askGemini(`First bike seeker profile:\n${text}\n\nRecommend 3 best first bikes for this person in India.`, SYSTEM);
      const clean = res.replace(/```json|```/g, '').trim();
      const match = clean.match(/\[[\s\S]*\]/);
      if (match) {
        setResults(JSON.parse(match[0]));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  const reset = () => { setStep(0); setAnswers({}); setSelected(null); setResults(null); setError(false); setLoading(false); };

  if (loading) return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>Finding your first bike...</div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 24 }}>AI is analyzing your profile</div>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
    </div>
  );

  if (error) return (
    <div className="page">
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>⚠️</div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>Couldn't generate results</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 20 }}>AI rate limit hit. Wait 10 seconds and retry.</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => submit(answers)}>Retry</button>
          <button className="btn btn-outline" onClick={reset}>Start Over</button>
        </div>
      </div>
    </div>
  );

  if (results) return (
    <div className="page fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem' }}>Your First Bike 🎉</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Perfect picks for a beginner</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={reset}><RotateCcw size={13} /> Redo</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {results.map((bike, i) => (
          <div key={i} className="card glow fade-in" style={{ animationDelay: `${i * 0.15}s`, border: i === 0 ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: i === 0 ? 'var(--accent)' : 'var(--bg3)', color: i === 0 ? '#000' : 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rajdhani', fontWeight: 800, flexShrink: 0 }}>
                  {i === 0 ? '🏆' : `#${bike.rank}`}
                </div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.1rem' }}>{bike.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{bike.brand} · {bike.type}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{formatINR(bike.price)}</div>
                {bike.emi && <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>~₹{bike.emi}/mo EMI</div>}
              </div>
            </div>

            {/* Match score */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.72rem', color: 'var(--text3)' }}>
                <span>Beginner Match</span>
                <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--green)', fontWeight: 700 }}>{bike.matchScore}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${bike.matchScore}%`, background: 'var(--green)' }} />
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10 }}>{bike.whyFirst}</p>

            {bike.mileage && <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8 }}>⛽ {bike.mileage} · {bike.runningCost}</div>}

            <div className="grid-2" style={{ gap: 8, marginBottom: 10 }}>
              <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--green)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Why It's Great</div>
                {bike.beginnerFriendly?.slice(0, 3).map((p, j) => (
                  <div key={j} style={{ fontSize: '0.73rem', color: 'var(--text2)', marginBottom: 3 }}>✓ {p}</div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,82,82,0.05)', border: '1px solid rgba(255,82,82,0.15)', borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--red)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>Watch Out</div>
                {bike.watchOut?.slice(0, 3).map((c, j) => (
                  <div key={j} style={{ fontSize: '0.73rem', color: 'var(--text2)', marginBottom: 3 }}>✗ {c}</div>
                ))}
              </div>
            </div>

            {bike.verdict && (
              <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 500 }}>
                💡 {bike.verdict}
              </div>
            )}

            <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('search', { autoSearch: true, query: bike.name })}>
              View Full Details <ChevronRight size={13} />
            </button>
          </div>
        ))}
        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={reset}>
          <RotateCcw size={14} /> Start Over
        </button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(0,230,118,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌱</div>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem' }}>First Bike Finder</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>For students, beginners & first-time buyers</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.72rem', color: 'var(--text3)' }}>
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--green)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, rgba(0,230,118,0.05), transparent)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{q.emoji}</div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem', lineHeight: 1.3 }}>{q.question}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {q.options.map((opt, i) => {
          const active = selected === opt.value || (!selected && answers[q.id] === opt.value);
          return (
            <div key={i} onClick={() => setSelected(opt.value)} className="fade-in"
              style={{ padding: '14px 18px', borderRadius: 14, border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`, background: active ? 'rgba(0,230,118,0.08)' : 'var(--bg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', animationDelay: `${i * 0.07}s` }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{opt.emoji}</span>
              <span style={{ fontSize: '0.92rem', fontWeight: active ? 600 : 400, color: active ? 'var(--green)' : 'var(--text)' }}>{opt.label}</span>
              {active && <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>✓</span>}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {step > 0 && <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleBack}><ChevronLeft size={16} /> Back</button>}
        <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center', opacity: (selected || answers[q.id]) ? 1 : 0.5 }} onClick={handleNext} disabled={!selected && !answers[q.id]}>
          {step === QUESTIONS.length - 1 ? <><Zap size={15} /> Find My Bike</> : <>Next <ChevronRight size={15} /></>}
        </button>
      </div>
    </div>
  );
}
