import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Zap } from 'lucide-react';
import { fetchBikeNews, fetchLatestLaunches, fetchEVNews, timeAgo } from '../utils/news';

const FILTERS = [
  { label: 'All News', query: 'two wheeler motorcycle scooter India' },
  { label: '🚀 Launches', query: 'new bike launch India 2024 2025' },
  { label: '⚡ EV', query: 'electric scooter bike India EV' },
  { label: '🏍️ Reviews', query: 'bike review India test ride' },
  { label: '💰 Prices', query: 'bike price hike cut India 2025' },
  { label: '🏆 Royal Enfield', query: 'Royal Enfield India 2025' },
  { label: '🟠 KTM', query: 'KTM bike India launch 2025' },
];

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async (idx = activeFilter) => {
    setLoading(true);
    const data = await fetchBikeNews(FILTERS[idx].query, 12);
    setArticles(data);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { load(0); }, []);

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
        <button className="icon-btn" onClick={() => load()} title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {lastUpdated && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 10 }}>
          Updated {timeAgo(lastUpdated)}
        </div>
      )}

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
