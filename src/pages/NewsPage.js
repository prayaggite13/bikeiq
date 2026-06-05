import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ExternalLink, Zap } from 'lucide-react';
import { timeAgo } from '../utils/news';

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const FILTERS = [
  { label: 'All News',        topic: 'latest Indian motorcycle and scooter news, launches, reviews, prices' },
  { label: '🚀 Launches',     topic: 'new bike and scooter launches in India 2025' },
  { label: '⚡ EV',           topic: 'electric scooter and bike news India 2025, Ola Ather TVS EV' },
  { label: '🏍️ Reviews',     topic: 'bike and scooter reviews and test rides India 2025' },
  { label: '💰 Prices',       topic: 'bike price hike, discounts, offers India 2025' },
  { label: '🏆 Royal Enfield',topic: 'Royal Enfield news launches India 2025' },
  { label: '🟠 KTM Bajaj',    topic: 'KTM and Bajaj motorcycle news India 2025' },
];

const SOURCES = ['BikeDekho', 'BikeWale', 'ZigWheels', 'Overdrive', 'AutocarIndia', 'BikeIQ Digest'];

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

  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  const clean = text.replace(/```json|```/g, '').trim();
  const articles = JSON.parse(clean);

  // Convert minutesAgo to real timestamps
  return articles.map(a => ({
    ...a,
    publishedAt: new Date(Date.now() - (a.minutesAgo || 30) * 60 * 1000).toISOString(),
    isAI: true,
  }));
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async (idx) => {
    setLoading(true);
    setError('');
    setArticles([]);
    try {
      const fetched = await fetchAINews(FILTERS[idx].topic);
      setArticles(fetched);
      setLastUpdated(new Date());
    } catch (e) {
      setError('Could not load news. Check your Groq API key.');
      setArticles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(0); }, [load]);

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    load(idx);
  };

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 className="section-title">📰 Live News</h2>
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
          <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>AI POWERED</span>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
            Updated {timeAgo(lastUpdated.toISOString())} · BikeIQ News Engine
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
          <div style={{ fontSize: '0.82rem' }}>Generating latest news...</div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ background: 'rgba(255,82,82,0.08)', border: '1px solid rgba(255,82,82,0.2)', borderRadius: 12, padding: 20, textAlign: 'center', color: 'var(--red)', fontSize: 13 }}>
          ⚠️ {error}
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => load(activeFilter)}>Try Again</button>
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
                      background: 'rgba(0,212,255,0.08)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(0,212,255,0.25)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      fontWeight: 700
                    }}>
                      AI
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
                  <ExternalLink size={11} /> Read full article
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>No articles found</h3>
          <p>Try a different filter or refresh</p>
        </div>
      )}
    </div>
  );
}
