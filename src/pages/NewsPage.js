import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Zap } from 'lucide-react';
import { useLang } from '../utils/LanguageContext';
import { timeAgo } from '../utils/news';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// FILTERS moved inside component for translation support

const FALLBACK_NEWS = {
  0: [
    { title: "Ola Electric S1 Pro Gen 2 launched at ₹1.29 lakh", description: "Ola Electric launches updated S1 Pro with improved range, faster charging, and new features at an aggressive price.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "Royal Enfield Guerrilla 450 review: Best middleweight from RE?", description: "We ride the Guerrilla 450 across city and highway. It mostly lives up to the hype.", source: "BikeIQ Digest", url: "https://www.bikewale.com/news/", publishedAt: new Date(Date.now() - 3600000).toISOString(), isAI: false },
    { title: "TVS Apache RTR 310 bookings open — deliveries from next month", description: "TVS Motor Company has opened bookings for the Apache RTR 310, with deliveries scheduled to begin next month.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
    { title: "Honda Activa EV launch confirmed — price expected under ₹1.2 lakh", description: "Honda confirms Activa EV launch date. The electric scooter is expected to be priced competitively against Ola and Ather.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 10800000).toISOString(), isAI: false },
    { title: "Bajaj Pulsar NS400Z launched at ₹1.97 lakh", description: "Bajaj launches flagship Pulsar NS400Z with 373cc engine, USD forks, and Bluetooth connectivity.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 14400000).toISOString(), isAI: false },
    { title: "Hero MotoCorp Karizma XMR 210 — long term review after 10,000 km", description: "After 10,000 km on the Karizma XMR 210, here's what we found about real-world performance and reliability.", source: "BikeIQ Digest", url: "https://www.bikewale.com/news/", publishedAt: new Date(Date.now() - 18000000).toISOString(), isAI: false },
  ],
  1: [
    { title: "Triumph Speed T4 launched in India at ₹2.17 lakh", description: "Triumph brings the Speed T4 to India targeting the middleweight segment dominated by Royal Enfield.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "KTM 390 Adventure X launched at ₹3.46 lakh", description: "KTM launches the 390 Adventure X in India with off-road focused upgrades and new colour options.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
    { title: "Honda CB350RS 2025 launched with new colours", description: "Honda launches the CB350RS 2025 with new dual-tone colours and updated instrument cluster.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 14400000).toISOString(), isAI: false },
  ],
  2: [
    { title: "Ather 450X vs Ola S1 Pro vs TVS iQube — 2025 EV comparison", description: "Three best electric scooters in India go head to head. Which one should you buy in 2025?", source: "BikeIQ Digest", url: "https://www.bikewale.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "FAME III subsidy announced — EVs to get cheaper by ₹15,000-30,000", description: "Government announces FAME III subsidies for electric two-wheelers, making EVs significantly more affordable.", source: "BikeIQ Digest", url: "https://www.bikewale.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
    { title: "Hero Vida V2 Pro launched — range, price and features explained", description: "Hero MotoCorp launches the Vida V2 Pro electric scooter with improved battery and fast charging support.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 10800000).toISOString(), isAI: false },
  ],
  3: [
    { title: "Yamaha R15 V4 long-term review — still the best 150cc sportsbike?", description: "After 15,000 km on the R15 V4, here's our honest verdict on ownership, mileage, and reliability.", source: "BikeIQ Digest", url: "https://www.bikewale.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "KTM Duke 390 2025 first ride — sharper, faster, more aggressive", description: "KTM updates the Duke 390 with ride-by-wire, traction control, and a sharper chassis.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
  ],
  4: [
    { title: "Hero MotoCorp hikes prices across range — up to ₹3,000 increase", description: "Hero MotoCorp announces price hike across its entire lineup effective from next month.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "Best bikes under ₹1 lakh in India — 2025 updated list", description: "Looking for a reliable bike under ₹1 lakh? Here are the best options available right now in India.", source: "BikeIQ Digest", url: "https://www.bikewale.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
  ],
  5: [
    { title: "Royal Enfield Classic 650 spied testing — launch expected soon", description: "A test mule of the Classic 650 has been spotted testing in Chennai. Launch expected in late 2025.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "RE Bullet 350 vs Classic 350 — which should you buy in 2025?", description: "Both share the same engine but cater to different buyers. We break down the key differences clearly.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
  ],
  6: [
    { title: "KTM RC 390 2025 launched — faster, sharper, more track focused", description: "KTM launches the updated RC 390 with improved aerodynamics, new electronics package, and track mode.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 1800000).toISOString(), isAI: false },
    { title: "Bajaj Dominar 400 2025 gets new features and colour options", description: "Bajaj updates the Dominar 400 tourer with new features and two new colour options for 2025.", source: "BikeIQ Digest", url: "https://www.bikedekho.com/news/", publishedAt: new Date(Date.now() - 7200000).toISOString(), isAI: false },
  ],
};

async function fetchAINews(topic) {
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const prompt = `You are a motorcycle news editor for India. Generate 8 realistic, current news articles about: ${topic}

Today's date: ${today}

Return ONLY a JSON array, no markdown:
[
  {
    "title": "Compelling news headline about Indian bikes/scooters",
    "description": "2-sentence news summary with specific details like prices, specs, dates",
    "source": "one of: BikeDekho, BikeWale, ZigWheels, Overdrive, AutocarIndia, BikeIQ Digest",
    "url": "https://www.bikedekho.com/news/",
    "minutesAgo": 30
  }
]

Rules:
- Use real Indian bike brands: Hero, Honda, Bajaj, TVS, Royal Enfield, Yamaha, Suzuki, KTM, Ola Electric, Ather, Revolt
- Include specific prices in rupees (₹), real model names, realistic specs
- minutesAgo: vary between 15 and 480 (8 hours)
- Make headlines sound like real breaking news
- Alternate sources from the list
- No duplicate titles`;

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.85,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: 'You are a motorcycle news API. Return only valid JSON arrays. No markdown, no explanation.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!res.ok) throw new Error(`Groq API error ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';

  // Robustly extract JSON array from response
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) throw new Error('No JSON array found');
  const articles = JSON.parse(text.slice(start, end + 1));

  return articles.map(a => ({
    ...a,
    publishedAt: new Date(Date.now() - (a.minutesAgo || 30) * 60 * 1000).toISOString(),
    isAI: true,
  }));
}

export default function NewsPage() {
  const { t, lang } = useLang();
  const langPrompt = lang === 'hi' ? 'Respond entirely in Hindi language.' : 'Respond in English.';
  const FILTERS = [
    { label: t('allNews'),      topic: `latest Indian motorcycle and scooter news, launches, reviews, prices. ${langPrompt}` },
    { label: t('launches'),     topic: `new bike and scooter launches in India 2025. ${langPrompt}` },
    { label: t('ev'),           topic: `electric scooter and bike news India 2025. ${langPrompt}` },
    { label: t('reviews'),      topic: `bike and scooter reviews and test rides India 2025. ${langPrompt}` },
    { label: t('prices'),       topic: `bike price hike, discounts, offers India 2025. ${langPrompt}` },
    { label: t('royalEnfield'), topic: `Royal Enfield news launches India 2025. ${langPrompt}` },
    { label: t('ktmBajaj'),     topic: `KTM and Bajaj motorcycle news India 2025. ${langPrompt}` },
  ];
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  const load = async (idx) => {
    setLoading(true);
    setError('');
    setArticles([]);
    try {
      const fetched = await fetchAINews(FILTERS[idx].topic);
      setArticles(fetched);
      setLastUpdated(new Date());
      setError('');
    } catch (e) {
      console.error('News fetch failed:', e.message);
      const fallback = FALLBACK_NEWS[idx] || FALLBACK_NEWS[0];
      setArticles(fallback);
      setLastUpdated(new Date());
      setError('');
    }
    setLoading(false);
  };

  useEffect(() => { load(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    load(idx);
  };

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 className="section-title">{t('liveNews')}</h2>
        <button
          className="icon-btn"
          onClick={() => load(activeFilter)}
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
          title="Refresh news"
        >
          <RefreshCw size={15} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* AI badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)' }}>
          <Zap size={12} color="var(--accent)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>{t('aiPowered')}</span>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
            Updated {timeAgo(lastUpdated.toISOString())} · {t('bikeiqEngine')}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="chip-row" style={{ marginBottom: 16 }}>
        {FILTERS.map((f, i) => (
          <span
            key={i}
            className={`chip ${activeFilter === i ? 'active' : ''}`}
            onClick={() => handleFilter(i)}
          >
            {f.label}
          </span>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.82rem' }}>{t('generatingNews')}</div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 12, padding: 20, textAlign: 'center', color: 'var(--red)', fontSize: 13 }}>
          ⚠️ {error}
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => load(activeFilter)}>{t('tryAgain')}</button>
          </div>
        </div>
      )}

      {/* Articles */}
      {!loading && !error && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div className="card glow fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="news-source">{article.source}</span>
                    <span style={{
                      fontSize: '0.62rem',
                      background: article.isAI ? 'rgba(0,212,255,0.08)' : 'rgba(255,215,64,0.1)',
                      color: article.isAI ? 'var(--accent)' : 'var(--yellow)',
                      border: article.isAI ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(255,215,64,0.25)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      fontWeight: 700
                    }}>
                      {article.isAI ? 'AI' : 'CURATED'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  lineHeight: 1.3,
                  marginBottom: 6,
                  color: 'var(--text)'
                }}>
                  {article.title}
                </h3>

                {article.description && (
                  <p style={{
                    fontSize: '0.78rem',
                    color: 'var(--text2)',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.description}
                  </p>
                )}

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  marginTop: 8, color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 600
                }}>
                  <ExternalLink size={11} /> {t('readFullArticle')}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>{t('noArticles')}</h3>
          <p>{t('tryDifferentFilter')}</p>
        </div>
      )}
    </div>
  );
}
