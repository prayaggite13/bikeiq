import React, { useState } from 'react';
import { Zap, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import { askGemini } from '../utils/gemini';
import { formatINR } from '../utils/calculator';

const QUESTIONS = [
  {
    id: 1,
    question: "What's your main reason for buying a bike?",
    emoji: '🎯',
    options: [
      { label: 'Daily office commute', value: 'daily commute to office', emoji: '🏢' },
      { label: 'College & city travel', value: 'college and city travel', emoji: '🎓' },
      { label: 'Weekend rides & fun', value: 'weekend rides and fun', emoji: '🌄' },
      { label: 'Long highway touring', value: 'long distance highway touring', emoji: '🛣️' },
    ]
  },
  {
    id: 2,
    question: "What's your budget?",
    emoji: '💰',
    options: [
      { label: 'Under ₹80,000', value: 'under 80000', emoji: '💚' },
      { label: '₹80K – ₹1.5L', value: '80000 to 150000', emoji: '💛' },
      { label: '₹1.5L – ₹3L', value: '150000 to 300000', emoji: '🟠' },
      { label: 'Above ₹3L', value: 'above 300000', emoji: '🔴' },
    ]
  },
  {
    id: 3,
    question: 'What kind of roads do you mostly ride on?',
    emoji: '🛣️',
    options: [
      { label: 'City stop-go traffic', value: 'city stop and go traffic', emoji: '🚦' },
      { label: 'Mix of city & highway', value: 'mix of city and highway', emoji: '🔀' },
      { label: 'Mostly highways', value: 'mostly highways', emoji: '🛤️' },
      { label: 'Off-road & rough roads', value: 'off-road and rough roads', emoji: '🏔️' },
    ]
  },
  {
    id: 4,
    question: 'What matters most to you?',
    emoji: '⭐',
    options: [
      { label: 'Maximum mileage', value: 'maximum fuel efficiency and mileage', emoji: '⛽' },
      { label: 'Performance & speed', value: 'performance and speed', emoji: '🏎️' },
      { label: 'Comfort & ergonomics', value: 'comfort and ergonomics', emoji: '🛋️' },
      { label: 'Style & looks', value: 'style and looks', emoji: '😎' },
    ]
  },
  {
    id: 5,
    question: 'Your riding experience level?',
    emoji: '🏍️',
    options: [
      { label: 'First bike ever', value: 'complete beginner buying first bike', emoji: '🌱' },
      { label: 'Rode before, upgrading', value: 'some experience upgrading from smaller bike', emoji: '📈' },
      { label: 'Experienced rider', value: 'experienced rider', emoji: '⭐' },
      { label: 'Expert/enthusiast', value: 'expert enthusiast rider', emoji: '🏆' },
    ]
  },
  {
    id: 6,
    question: 'Petrol or Electric?',
    emoji: '⚡',
    options: [
      { label: 'Petrol only', value: 'petrol only', emoji: '⛽' },
      { label: 'Open to EV', value: 'open to electric vehicle', emoji: '⚡' },
      { label: 'EV preferred', value: 'prefer electric vehicle', emoji: '🟢' },
      { label: 'No preference', value: 'no preference between petrol and electric', emoji: '🤷' },
    ]
  },
];

const SYSTEM_PROMPT = `You are BikeIQ's expert bike recommendation engine for India. Based on a user's quiz answers, recommend exactly 3 bikes.

Return ONLY a valid JSON array with this structure:
[
  {
    "rank": 1,
    "name": "Honda Activa 6G",
    "brand": "Honda",
    "type": "Scooter",
    "fuelType": "Petrol",
    "price": 75000,
    "matchScore": 96,
    "mileage": "50 kmpl",
    "whyMatch": "2-3 sentence explanation of why this bike matches the user perfectly",
    "bestFor": "Short phrase like 'City commuter who wants reliability'",
    "pros": ["Low maintenance", "Excellent resale", "Wide service network"],
    "cons": ["Not suitable for highways", "Basic features"],
    "alternatives": ["Honda Dio", "TVS Jupiter"]
  }
]

Rules:
- Recommend real bikes available in India
- Match budget strictly
- Consider experience level — don't recommend 390cc to a beginner
- matchScore should be realistic (75-98)
- Return ONLY the JSON array, no markdown, no explanation`;

export default function BikeQuizPage({ navigate, addToCompare }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = (value) => {
    setSelectedOption(value);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [QUESTIONS[currentQ].id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Submit quiz
      await submitQuiz(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedOption(answers[QUESTIONS[currentQ - 1].id] || null);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    const answerText = Object.entries(finalAnswers)
      .map(([id, val]) => {
        const q = QUESTIONS.find(q => q.id === parseInt(id));
        return `${q.question}: ${val}`;
      })
      .join('\n');

    const prompt = `A user answered a bike quiz with these responses:\n${answerText}\n\nRecommend the top 3 bikes for this user in India.`;

    try {
      const response = await askGemini(prompt, SYSTEM_PROMPT);
      const clean = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResults(parsed);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const reset = () => {
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setResults(null);
    setLoading(false);
  };

  const progress = ((currentQ) / QUESTIONS.length) * 100;

  // Results screen
  if (results !== null && !loading) {
    return (
      <div className="page fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.4rem' }}>Your Perfect Bikes 🎯</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Based on your quiz answers</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={reset}>
            <RotateCcw size={13} /> Retake
          </button>
        </div>

        {results.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">😕</div>
            <h3>Couldn't generate results</h3>
            <p>Please try again</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={reset}>Try Again</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {results.map((bike, i) => (
              <div key={i} className="card glow fade-in" style={{ animationDelay: `${i * 0.15}s`, border: i === 0 ? '1px solid var(--accent)' : '1px solid var(--border)' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i === 0 ? 'var(--accent)' : 'var(--bg3)',
                      color: i === 0 ? '#000' : 'var(--text2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1rem', flexShrink: 0
                    }}>
                      {i === 0 ? '🏆' : `#${bike.rank}`}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>{bike.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{bike.brand} · {bike.type}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>{formatINR(bike.price)}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>ex-showroom</div>
                  </div>
                </div>

                {/* Match score */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Match Score</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: bike.matchScore >= 90 ? 'var(--green)' : bike.matchScore >= 80 ? 'var(--yellow)' : 'var(--accent3)', fontSize: '0.85rem' }}>
                      {bike.matchScore}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{
                      width: `${bike.matchScore}%`,
                      background: bike.matchScore >= 90 ? 'var(--green)' : bike.matchScore >= 80 ? 'var(--yellow)' : 'var(--accent3)'
                    }} />
                  </div>
                </div>

                {/* Best for tag */}
                {bike.bestFor && (
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: '0.75rem', color: 'var(--accent)' }}>
                      ✦ Best for: {bike.bestFor}
                    </span>
                  </div>
                )}

                {/* Why match */}
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{bike.whyMatch}</p>

                {/* Mileage */}
                {bike.mileage && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 12 }}>⛽ {bike.mileage}</div>
                )}

                {/* Pros & Cons */}
                <div className="grid-2" style={{ gap: 8, marginBottom: 12 }}>
                  <div style={{ background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--green)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pros</div>
                    {bike.pros?.slice(0, 3).map((p, j) => (
                      <div key={j} style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 3, display: 'flex', gap: 5 }}>
                        <span style={{ color: 'var(--green)' }}>✓</span> {p}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,82,82,0.05)', border: '1px solid rgba(255,82,82,0.15)', borderRadius: 10, padding: 10 }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--red)', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cons</div>
                    {bike.cons?.slice(0, 3).map((c, j) => (
                      <div key={j} style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: 3, display: 'flex', gap: 5 }}>
                        <span style={{ color: 'var(--red)' }}>✗</span> {c}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => navigate('search', { autoSearch: true, query: bike.name })}>
                    View Details <ChevronRight size={13} />
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => navigate('ownership')}>
                    Cost Calc
                  </button>
                </div>

                {/* Alternatives */}
                {bike.alternatives?.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: '0.72rem', color: 'var(--text3)' }}>
                    Also consider: {bike.alternatives.map((a, j) => (
                      <span
                        key={j}
                        style={{ color: 'var(--accent)', cursor: 'pointer', marginLeft: 4 }}
                        onClick={() => navigate('search', { autoSearch: true, query: a })}
                      >
                        {a}{j < bike.alternatives.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={reset}>
              <RotateCcw size={14} /> Take Quiz Again
            </button>
          </div>
        )}
      </div>
    );
  }

  // Loading screen
  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '3rem', marginBottom: 20 }}>🤖</div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem', marginBottom: 8 }}>Analyzing your answers...</div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: 30, textAlign: 'center' }}>
          BikeIQ AI is finding your perfect bike match
        </div>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        {[100, 75, 85, 60, 90].map((w, i) => (
          <div key={i} style={{
            height: 8, borderRadius: 4, background: 'var(--bg3)',
            width: `${w}%`, maxWidth: 300, marginTop: 12,
            animation: 'pulse 1.5s ease infinite', animationDelay: `${i * 0.2}s`
          }} />
        ))}
      </div>
    );
  }

  const question = QUESTIONS[currentQ];

  // Quiz screen
  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(0,212,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🎯
          </div>
          <div>
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem' }}>Bike Quiz</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Find your perfect match in 6 questions</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.72rem', color: 'var(--text3)' }}>
          <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}% done</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, rgba(0,212,255,0.05), transparent)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{question.emoji}</div>
        <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem', lineHeight: 1.3 }}>
          {question.question}
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === opt.value;
          const isPrevAnswer = !selectedOption && answers[question.id] === opt.value;
          const active = isSelected || isPrevAnswer;
          return (
            <div
              key={i}
              onClick={() => handleAnswer(opt.value)}
              className="fade-in"
              style={{
                padding: '14px 18px',
                borderRadius: 14,
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(0,212,255,0.08)' : 'var(--bg2)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
                animationDelay: `${i * 0.07}s`
              }}
            >
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{opt.emoji}</span>
              <span style={{ fontSize: '0.92rem', fontWeight: active ? 600 : 400, color: active ? 'var(--accent)' : 'var(--text)' }}>
                {opt.label}
              </span>
              {active && <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: '1rem' }}>✓</span>}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10 }}>
        {currentQ > 0 && (
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={handleBack}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <button
          className="btn btn-primary"
          style={{ flex: 2, justifyContent: 'center', opacity: selectedOption || answers[question.id] ? 1 : 0.5 }}
          onClick={handleNext}
          disabled={!selectedOption && !answers[question.id]}
        >
          {currentQ === QUESTIONS.length - 1 ? (
            <><Zap size={15} /> Find My Bike</>
          ) : (
            <>Next <ChevronRight size={15} /></>
          )}
        </button>
      </div>
    </div>
  );
}
