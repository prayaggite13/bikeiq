import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/news';

const NEWSDATA_API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY;

const FILTERS = [
  { label: '🗞️ All News',      query: 'motorcycle scooter bike India' },
  { label: '🚀 Launches',      query: 'new bike launch India 2026' },
  { label: '⚡ Electric',      query: 'electric scooter bike India EV' },
  { label: '🏍️ Reviews',      query: 'bike scooter review India test ride' },
  { label: '💰 Prices',        query: 'bike price hike discount India 2026' },
  { label: '🏆 Royal Enfield', query: 'Royal Enfield India 2026' },
  { label: '🟠 KTM Bajaj',    query: 'KTM Bajaj motorcycle India' },
];

// Real fallback articles with real URLs users can actually read
const FALLBACK_ARTICLES = [
  { title: 'Latest Bike News — BikeDekho',      description: 'Read the latest bike and scooter news, launches and reviews on BikeDekho.',      url: 'https://www.bikedekho.com/news/',                    source: { name: 'BikeDekho' },    publishedAt: new Date().toISOString() },
  { title: 'Latest Bike News — BikeWale',       description: 'New launches, price updates and reviews on BikeWale.',                           url: 'https://www.bikewale.com/news/',                     source: { name: 'BikeWale' },     publishedAt: new Date().toISOString() },
  { title: 'Bike Reviews & News — ZigWheels',   description: 'Road tests, comparisons and buying guides on ZigWheels.',                        url: 'https://www.zigwheels.com/motorcycle-news',          source: { name: 'ZigWheels' },    publishedAt: new Date().toISOString() },
  { title: 'Two-Wheeler News — Overdrive',       description: 'In-depth bike reviews and motorcycle news from Overdrive India.',                 url: 'https://www.overdrive.in/news-cars-auto/two-wheelers/', source: { name: 'Overdrive' },  publishedAt: new Date().toISOString() },
  { title: 'Motorcycle News — AutocarIndia',     description: 'Latest motorcycle launches, test drives and news from AutocarIndia.',             url: 'https://www.autocarindia.com/bikes',                  source: { name: 'AutocarIndia' }, publishedAt: new Date().toISOString() },
];

async function loadNews(query, max = 10) {
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&q=${encodeURIComponent(query)}&country=in&language=en&category=technology,business&size=${max}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error(data.message || 'bad response');
    const articles = (data.results || []).filter(a => a.link && a.title);
    if (articles.length === 0) return null; // trigger fallback
    return articles.map(a => ({
      title:       a.title,
      description: a.description || a.content?.slice(0, 220) || '',
      url:         a.link,        // ← real article URL
      image:       a.image_url || null,
      publishedAt: a.pubDate || new Date().toISOString(),
      source:      { name: a.source_id || a.source_name || 'News' },
    }));
  } catch (err) {
    console.warn('NewsData.io error:', err.message);
    return null;
  }
}

// Source name → brand colour
function sourceColor(name = '') {
  const n = name.toLowerCase();
  if (n.includes('bikedekho'))   return '#e53935';
  if (n.includes('bikewale'))    return '#1e88e5';
  if (n.includes('zigwheels'))   return '#f9a825';
  if (n.includes('overdrive'))   return '#6d4c41';
  if (n.includes('autocar'))     return '#00897b';
  if (n.includes('ndtv'))        return '#e53935';
  if (n.includes('india'))       return '#1565c0';
  return 'var(--accent)';
}

function ArticleCard({ article, index }) {
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div
        className="card glow fade-in"
        style={{ animationDelay: `${index * 0.04}s`, transition: 'all 0.2s' }}
      >
        {/* Image if available */}
        {article.image && (
          <img
            src={article.image} alt={article.title}
            style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }}
            onError={e => e.target.style.display = 'none'}
          />
        )}

        {/* Source + time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: sourceColor(article.source?.name),
          }}>
            {article.source?.name}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
          fontSize: '1.05rem', lineHeight: 1.3, marginBottom: 6, color: 'var(--text)',
        }}>
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p style={{
            fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8,
          }}>
            {article.description}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: '0.72rem', fontWeight: 600 }}>
          <ExternalLink size={11} /> Read full article
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = async (idx) => {
    setLoading(true);
    setArticles([]);
    setUsingFallback(false);

    const result = await loadNews(FILTERS[idx].query, 10);

    if (result && result.length > 0) {
      setArticles(result);
      setUsingFallback(false);
    } else {
      // API failed or no results — show real fallback links
      setArticles(FALLBACK_ARTICLES);
      setUsingFallback(true);
    }

    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { load(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page" style={{ paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>📰 Live News</h2>
        <button
          className="icon-btn" onClick={() => load(activeFilter)}
          disabled={loading} style={{ opacity: loading ? 0.5 : 1 }} title="Refresh"
        >
          <RefreshCw size={15} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 14 }}>
          {usingFallback
            ? '⚠️ Live feed unavailable — showing top news sources'
            : `Updated ${timeAgo(lastUpdated.toISOString())}`}
        </div>
      )}

      {/* Filters */}
      <div className="chip-row" style={{ marginBottom: 16 }}>
        {FILTERS.map((f, i) => (
          <span
            key={i}
            className={`chip ${activeFilter === i ? 'active' : ''}`}
            onClick={() => { setActiveFilter(i); load(i); }}
          >
            {f.label}
          </span>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.82rem' }}>Loading latest news...</div>
        </div>
      )}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((article, i) => (
            <ArticleCard key={i} article={article} index={i} />
          ))}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>No articles found</h3>
          <p>Try a different filter or refresh</p>
        </div>
      )}
    </div>
  );
}
