import React from 'react';

const TOOLS = [
  {
    id: 'mechanic',
    icon: '🔧',
    title: 'AI Mechanic',
    subtitle: 'Diagnose any bike issue instantly',
    desc: 'Describe your problem — get possible causes, fixes & parts needed.',
    color: '#00d4ff',
    bg: '#00d4ff11',
    border: '#00d4ff33',
  },
  {
    id: 'health',
    icon: '🩺',
    title: 'Bike Health Advisor',
    subtitle: 'Accident, noise, vibration analysis',
    desc: 'AI estimates severity, repair cost & whether immediate service is needed.',
    color: '#ff6b35',
    bg: '#ff6b3511',
    border: '#ff6b3533',
  },
  {
    id: 'servicecenter',
    icon: '🏪',
    title: 'Service Center Locator',
    subtitle: 'Find authorized service centers',
    desc: 'Search by city, pincode or GPS. Get contact details & directions.',
    color: '#00ff88',
    bg: '#00ff8811',
    border: '#00ff8833',
  },
  {
    id: 'dealer',
    icon: '🏬',
    title: 'Dealer Locator',
    subtitle: 'Find nearby dealerships',
    desc: 'Search by brand, city or pincode. Address, phone & map directions.',
    color: '#a855f7',
    bg: '#a855f711',
    border: '#a855f733',
  },
  {
    id: 'accessory',
    icon: '🎽',
    title: 'AI Accessory Advisor',
    subtitle: 'Perfect gear for your ride',
    desc: 'Get helmet, gear, luggage & touring accessory recommendations for your bike.',
    color: '#fbbf24',
    bg: '#fbbf2411',
    border: '#fbbf2433',
  },
  {
    id: 'usedprice',
    icon: '💰',
    title: 'Used Bike Price Checker',
    subtitle: 'Fair market value estimator',
    desc: 'Enter model, year, km & condition — get resale range & fair price.',
    color: '#f472b6',
    bg: '#f472b611',
    border: '#f472b633',
  },
];

export default function BikeIQPlusPage({ navigate }) {
  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', paddingBottom: 100 },
    hero: {
      padding: '28px 16px 20px',
      background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
      borderBottom: '1px solid #1a1a1a',
    },
    badge: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'linear-gradient(135deg, #00d4ff22, #a855f722)',
      border: '1px solid #00d4ff44',
      borderRadius: 20, padding: '4px 12px',
      fontSize: 11, fontWeight: 700, color: '#00d4ff',
      letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12,
    },
    title: { fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 6px', lineHeight: 1.2 },
    sub: { fontSize: 13, color: '#666', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '20px 16px' },
    card: (tool) => ({
      background: tool.bg,
      border: `1px solid ${tool.border}`,
      borderRadius: 16,
      padding: '18px 14px',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      position: 'relative',
      overflow: 'hidden',
    }),
    iconBox: (tool) => ({
      width: 44, height: 44, borderRadius: 12,
      background: `${tool.color}22`,
      border: `1px solid ${tool.color}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 22, marginBottom: 10,
    }),
    cardTitle: { fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 },
    cardSub: { fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 6 },
    cardDesc: { fontSize: 11, color: '#666', lineHeight: 1.5 },
    arrow: (tool) => ({
      position: 'absolute', bottom: 12, right: 12,
      fontSize: 16, color: tool.color, opacity: 0.7,
    }),
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={s.badge}>⚡ BikeIQ+</div>
        <h1 style={s.title}>Premium AI Tools</h1>
        <p style={s.sub}>Diagnose, locate, advise — all in one place</p>
      </div>

      <div style={s.grid}>
        {TOOLS.map(tool => (
          <div
            key={tool.id}
            style={s.card(tool)}
            onClick={() => navigate(tool.id)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${tool.color}22`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={s.iconBox(tool)}>{tool.icon}</div>
            <div style={s.cardTitle}>{tool.title}</div>
            <div style={s.cardSub}>{tool.subtitle}</div>
            <div style={s.cardDesc}>{tool.desc}</div>
            <div style={s.arrow(tool)}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}
