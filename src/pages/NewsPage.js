import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/news';

const GNEWS_KEY     = process.env.REACT_APP_GNEWS_API_KEY;
const NEWSDATA_KEY  = process.env.REACT_APP_NEWSDATA_API_KEY;

// Cache per tab so switching doesn't re-fetch
const cache = {};

const FILTERS = [
  { label: '🗞️ All News',      gnews: 'motorcycle scooter India 2026',          newsdata: 'motorcycle scooter bike India' },
  { label: '🚀 Launches',      gnews: 'new bike launch India 2026',              newsdata: 'new bike launch India 2026' },
  { label: '⚡ Electric',      gnews: 'electric scooter bike India EV 2026',     newsdata: 'electric scooter EV India' },
  { label: '🏍️ Reviews',      gnews: 'bike scooter review India test ride',      newsdata: 'bike review India test ride' },
  { label: '💰 Prices',        gnews: 'bike price India 2026',                   newsdata: 'bike price hike discount India' },
  { label: '🏆 Royal Enfield', gnews: 'Royal Enfield India 2026',               newsdata: 'Royal Enfield India' },
  { label: '🟠 KTM Bajaj',    gnews: 'KTM Bajaj motorcycle India 2026',        newsdata: 'KTM Bajaj motorcycle India' },
];

// Real fallback links — shown only when both APIs fail
const FALLBACK = [
  { title: 'Latest Bike News — BikeDekho',    description: 'New launches, prices and reviews.',        url: 'https://www.bikedekho.com/news/',                       source: 'BikeDekho',    publishedAt: new Date().toISOString(), image: null },
  { title: 'Bike News — BikeWale',            description: 'Price updates, comparisons and reviews.',  url: 'https://www.bikewale.com/news/',                        source: 'BikeWale',     publishedAt: new Date().toISOString(), image: null },
  { title: 'Two-Wheeler News — ZigWheels',    description: 'Road tests and buying guides.',             url: 'https://www.zigwheels.com/motorcycle-news',             source: 'ZigWheels',    publishedAt: new Date().toISOString(), image: null },
  { title: 'Motorcycle News — Overdrive',     description: 'In-depth reviews and news.',               url: 'https://www.overdrive.in/news-cars-auto/two-wheelers/', source: 'Overdrive',    publishedAt: new Date().toISOString(), image: null },
  { title: 'Bike News — AutocarIndia',        description: 'Latest launches and test drives.',         url: 'https://www.autocarindia.com/bikes',                    source: 'AutocarIndia', publishedAt: new Date().toISOString(), image: null },
];

async function fromGNews(query, max = 10) {
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${GNEWS_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GNews ${res.status}`);
  const data = await res.json();
  const articles = data.articles || [];
  if (articles.length === 0) throw new Error('empty');
  return articles.map(a => ({
    title:       a.title,
    description: a.description || '',
    url:         a.url,
    image:       a.image || null,
    publishedAt: a.publishedAt,
    source:      a.source?.name || 'News',
  }));
}

async function fromNewsData(query, max = 10) {
  const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(query)}&country=in&language=en&size=${max}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NewsData ${res.status}`);
  const data = await res.json();
  if (data.status !== 'success') throw new Error(data.message || 'bad');
  const articles = (data.results || []).filter(a => a.link && a.title);
  if (articles.length === 0) throw new Error('empty');
  return articles.map(a => ({
    title:       a.title,
    description: a.description || a.content?.slice(0, 200) || '',
    url:         a.link,
    image:       a.image_url || null,
    publishedAt: a.pubDate || new Date().toISOString(),
    source:      a.source_id || a.source_name || 'News',
  }));
}

async function loadNews(filter) {
  // Try GNews first
  try {
    const articles = await fromGNews(filter.gnews);
    return { articles, api: 'gnews' };
  } catch (e1) {
    console.warn('GNews failed:', e1.message);
  }
  // Fallback to NewsData
  try {
    const articles = await fromNewsData(filter.newsdata);
    return { articles, api: 'newsdata' };
  } catch (e2) {
    console.warn('NewsData failed:', e2.message);
  }
  return { articles: FALLBACK, api: 'fallback' };
}

function sourceColor(name = '') {
  const n = name.toLowerCase();
  if (n.includes('bikedekho'))    return '#e53935';
  if (n.includes('bikewale'))     return '#1e88e5';
  if (n.includes('zigwheels'))    return '#f9a825';
  if (n.includes('overdrive'))    return '#6d4c41';
  if (n.includes('autocar'))      return '#00897b';
  if (n.includes('zigwheels'))    return '#f9a825';
  if (n.includes('timesnow'))     return '#e53935';
  if (n.includes('ndtv'))         return '#e53935';
  if (n.includes('hindu'))        return '#1565c0';
  if (n.includes('india'))        return '#1565c0';
  if (n.includes('gaadiwaadi'))   return '#e65100';
  if (n.includes('bharatfast') || n.includes('bfast')) return '#6d4c41';
  return 'var(--accent)';
}

function ArticleCard({ article, index }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="card glow fade-in" style={{ animationDelay: `${index * 0.04}s` }}>
        {article.image && !imgFailed && (
          <img
            src={article.image} alt=""
            style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }}
            onError={() => setImgFailed(true)}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: sourceColor(article.source) }}>
            {article.source}
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>
        <h3 style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3, marginBottom: 6, color: 'var(--text)' }}>
          {article.title}
        </h3>
        {article.description && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 8 }}>
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
  const [articles, setArticles]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [apiUsed, setApiUsed]           = useState('');
  const loadingRef = useRef(false);

  const load = async (idx, forceRefresh = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setArticles([]);

    const cacheKey = idx;
    if (!forceRefresh && cache[cacheKey]) {
      setArticles(cache[cacheKey].articles);
      setApiUsed(cache[cacheKey].api);
      setLastUpdated(cache[cacheKey].time);
      setLoading(false);
      loadingRef.current = false;
      return;
    }

    const { articles: fetched, api } = await loadNews(FILTERS[idx]);
    cache[cacheKey] = { articles: fetched, api, time: new Date() };
    setArticles(fetched);
    setApiUsed(api);
    setLastUpdated(new Date());
    setLoading(false);
    loadingRef.current = false;
  };

  useEffect(() => { load(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    load(idx);
  };

  const statusText = () => {
    if (apiUsed === 'fallback') return '⚠️ Live feed unavailable — showing top news sources';
    if (apiUsed === 'gnews')    return `Updated ${lastUpdated ? timeAgo(lastUpdated.toISOString()) : ''}`;
    if (apiUsed === 'newsdata') return `Updated ${lastUpdated ? timeAgo(lastUpdated.toISOString()) : ''}`;
    return '';
  };

  return (
    <div className="page" style={{ paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>📰 Live News</h2>
        <button
          className="icon-btn" onClick={() => load(activeFilter, true)}
          disabled={loading} style={{ opacity: loading ? 0.5 : 1 }} title="Refresh"
        >
          <RefreshCw size={15} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
        </button>
      </div>

      {lastUpdated && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginBottom: 14 }}>{statusText()}</div>
      )}

      {/* Filters */}
      <div className="chip-row" style={{ marginBottom: 16 }}>
        {FILTERS.map((f, i) => (
          <span key={i} className={`chip ${activeFilter === i ? 'active' : ''}`} onClick={() => handleFilter(i)}>
            {f.label}
          </span>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 16 }}>
              <div style={{ height: 160, background: 'var(--bg3)', borderRadius: 10, marginBottom: 10, animation: 'pulse 1.2s ease infinite' }} />
              <div style={{ height: 12, width: '30%', background: 'var(--bg3)', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.2s ease infinite' }} />
              <div style={{ height: 18, width: '80%', background: 'var(--bg3)', borderRadius: 6, marginBottom: 6, animation: 'pulse 1.2s ease infinite' }} />
              <div style={{ height: 12, width: '60%', background: 'var(--bg3)', borderRadius: 6, animation: 'pulse 1.2s ease infinite' }} />
            </div>
          ))}
        </div>
      )}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((article, i) => <ArticleCard key={i} article={article} index={i} />)}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="empty">
          <div className="empty-icon">📭</div>
          <h3>No articles found</h3>
          <p>Try a different filter or refresh</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => load(activeFilter, true)}>Retry</button>
        </div>
      )}
    </div>
  );
}
