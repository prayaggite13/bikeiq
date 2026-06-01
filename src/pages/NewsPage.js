import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/news';

const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

const FILTERS = [
  { label: 'All News', query: 'two wheeler motorcycle scooter India' },
  { label: '🚀 Launches', query: 'new bike launch India 2025' },
  { label: '⚡ EV', query: 'electric scooter bike India EV' },
  { label: '🏍️ Reviews', query: 'bike review India test ride' },
  { label: '💰 Prices', query: 'bike price India 2025' },
  { label: '🏆 Royal Enfield', query: 'Royal Enfield India 2025' },
  { label: '🟠 KTM', query: 'KTM bike India 2025' },
];

const MOCK_NEWS = [
  {
    title: "Ola Electric S1 Pro Gen 2 launched at ₹1.29 lakh — biggest update yet",
    description: "Ola Electric has launched the updated S1 Pro with improved range, faster charging, and new features at an aggressive price point.",
    url: "https://www.bikedekho.com",
    image: null,
    publishedAt: new Date().toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "Royal Enfield Guerrilla 450 review: The best middleweight from RE?",
    description: "We ride the Guerrilla 450 across city and highway to find out if it lives up to the hype. Spoiler: it mostly does.",
    url: "https://www.bikewale.com",
    image: null,
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "TVS Apache RTR 310 bookings open — deliveries from next month",
    description: "TVS Motor Company has opened bookings for the highly anticipated Apache RTR 310, with deliveries scheduled to begin next month.",
    url: "https://www.bikedekho.com",
    image: null,
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "Hero MotoCorp Karizma XMR 210 — long term review after 10,000 km",
    description: "After 10,000 km on the Karizma XMR 210, here's what we found about real-world performance, mileage, and reliability.",
    url: "https://www.bikewale.com",
    image: null,
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "Bajaj Pulsar NS400Z launched at ₹1.97 lakh — specs and features",
    description: "Bajaj has launched its flagship Pulsar NS400Z with a 373cc engine, USD forks, and Bluetooth connectivity.",
    url: "https://www.bikedekho.com",
    image: null,
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "Ather Rizta vs TVS iQube vs Bajaj Chetak — which EV scooter should you buy?",
    description: "A detailed comparison of the three most popular electric scooters in India to help you make the right choice.",
    url: "https://www.bikewale.com",
    image: null,
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "Honda Activa EV launch date confirmed — price expected under ₹1.2 lakh",
    description: "Honda has confirmed the launch date for the much-awaited Activa EV. The electric scooter is expected to be priced competitively.",
    url: "https://www.bikedekho.com",
    image: null,
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    source: { name: "BikeIQ News" }
  },
  {
    title: "Yamaha R15 V4 vs KTM RC 125 — which is better for beginners?",
    description: "Both bikes target sporty beginners, but which one delivers more value? We find out in our detailed comparison.",
    url: "https://www.bikewale.com",
    image: null,
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    source: { name: "BikeIQ News" }
  },
];

async function fetchNews(query, max = 10) {
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${GNEWS_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) throw new Error('empty');
    return data.articles;
  } catch {
    return MOCK_NEWS;
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async (idx) => {
    setLoading(true);
    setArticles([]);
    const data = await fetchNews(FILTERS[idx].query, 12);
    setArticles(data);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    load(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    load(idx);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          📰 Live News
        </div>
        <button className="icon-btn" onClick={() => load(activeFilter)} title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {lastUpdated && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 10 }}>
          Updated {timeAgo(lastUpdated)}
        </div>
      )}

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

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.82rem' }}>Fetching latest news...</div>
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>No articles found</h3>
          <p>Try a different filter or refresh</p>
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <div className="card glow fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="news-img"
                    style={{ marginBottom: 10 }}
                    onError={e => e.target.style.display = 'none'}
                  />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="news-source">{article.source?.name || 'News'}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{timeAgo(article.publishedAt)}</span>
                </div>
                <h3 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3, marginBottom: 6, color: 'var(--text)' }}>
                  {article.title}
                </h3>
                {article.description && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 600 }}>
                  <ExternalLink size={11} /> Read full article
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
