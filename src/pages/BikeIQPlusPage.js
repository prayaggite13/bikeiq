import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const TOOLS = [
  // Finders
  {
    category: 'Find Your Bike',
    color: 'rgba(0,212,255,0.08)',
    border: 'rgba(0,212,255,0.2)',
    accent: 'var(--accent)',
    items: [
      { id: 'quiz', emoji: '🎯', title: 'Bike Quiz', desc: 'Answer 6 questions — AI finds your perfect bike match' },
      { id: 'commute', emoji: '🧭', title: 'Commute Finder', desc: 'Input your daily km, road type & budget — get top picks' },
      { id: 'firstbike', emoji: '🌱', title: 'First Bike Finder', desc: 'For students & beginners — easiest bikes to start with' },
    ]
  },
  // Calculators
  {
    category: 'Cost & Finance',
    color: 'rgba(255,107,53,0.08)',
    border: 'rgba(255,107,53,0.2)',
    accent: 'var(--accent3)',
    items: [
      { id: 'ownership', emoji: '💰', title: 'Ownership Calculator', desc: 'True 3-5 year cost — fuel, insurance, service, EMI' },
      { id: 'insurance', emoji: '🛡️', title: 'Insurance Estimator', desc: 'City + bike + NCB → estimated annual premium' },
      { id: 'roadtax', emoji: '📋', title: 'Road Tax Calculator', desc: 'State-wise RTO charges + full on-road price breakdown' },
      { id: 'resale', emoji: '📉', title: 'Resale Predictor', desc: 'Input age & km → AI predicts your bike\'s resale value' },
      { id: 'usedprice', emoji: '💸', title: 'Used Bike Price Checker', desc: 'Fair market value for any used bike in India' },
    ]
  },
  // AI Tools
  {
    category: 'AI Diagnosis',
    color: 'rgba(0,230,118,0.08)',
    border: 'rgba(0,230,118,0.2)',
    accent: 'var(--green)',
    items: [
      { id: 'mechanic', emoji: '🔧', title: 'AI Mechanic', desc: 'Describe your bike problem — get instant diagnosis & fix' },
      { id: 'health', emoji: '🩺', title: 'Bike Health Advisor', desc: 'Accident or damage? AI estimates severity & repair cost' },
      { id: 'accessory', emoji: '🎽', title: 'AI Accessory Advisor', desc: 'Get helmet, gear & luggage recommendations for your ride' },
    ]
  },
  // Locators
  {
    category: 'Locate & Find',
    color: 'rgba(179,136,255,0.08)',
    border: 'rgba(179,136,255,0.2)',
    accent: 'var(--purple)',
    items: [
      { id: 'servicecenter', emoji: '🏪', title: 'Service Center Locator', desc: 'Find authorized service centers by city or GPS' },
      { id: 'dealer', emoji: '🏬', title: 'Dealer Locator', desc: 'Find nearby dealerships with offers & test ride info' },
    ]
  },
];

export default function BikeIQPlusPage({ navigate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', ...TOOLS.map(t => t.category)];

  const filtered = activeCategory === 'All'
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory);

  const totalTools = TOOLS.reduce((sum, t) => sum + t.items.length, 0);

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(179,136,255,0.1) 0%, rgba(0,212,255,0.06) 100%)',
        border: '1px solid rgba(179,136,255,0.2)',
        borderRadius: 20, padding: '20px', marginBottom: 20,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, background: 'radial-gradient(circle, rgba(179,136,255,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Sparkles size={20} color="var(--purple)" />
          <span style={{ fontFamily: 'Rajdhani', fontWeight: 800, fontSize: '1.5rem', color: 'var(--purple)' }}>BikeIQ+</span>
          <span style={{ background: 'rgba(179,136,255,0.15)', color: 'var(--purple)', border: '1px solid rgba(179,136,255,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{totalTools} Tools</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>
          Diagnose, calculate, locate, advise — everything a bike owner needs, all in one place.
        </p>
      </div>

      {/* Category filter */}
      <div className="chip-row" style={{ marginBottom: 20 }}>
        {categories.map(cat => (
          <span
            key={cat}
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Tool groups */}
      {filtered.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem', marginBottom: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 4, height: 16, borderRadius: 2, background: group.accent }} />
            {group.category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map((tool, ti) => (
              <div
                key={ti}
                onClick={() => navigate(tool.id)}
                className="fade-in"
                style={{
                  background: group.color,
                  border: `1px solid ${group.border}`,
                  borderRadius: 16, padding: '16px',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: 14,
                  transition: 'all 0.2s',
                  animationDelay: `${ti * 0.05}s`
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: group.color.replace('0.08', '0.15'),
                  border: `1px solid ${group.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', flexShrink: 0
                }}>
                  {tool.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 3 }}>
                    {tool.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text3)', lineHeight: 1.4 }}>
                    {tool.desc}
                  </div>
                </div>
                <div style={{ color: group.accent, fontSize: '1.1rem', flexShrink: 0 }}>→</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
