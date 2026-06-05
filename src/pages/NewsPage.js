import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ExternalLink, Wifi, WifiOff } from 'lucide-react';
import { timeAgo } from '../utils/news';

const NEWSDATA_KEY = 'pub_da469a4067e341a6b5bda1276fd266ef';

const FILTERS = [
  { label: 'All News', keywords: 'motorcycle scooter bike two wheeler India' },
  { label: '🚀 Launches', keywords: 'bike launch India 2025 new model' },
  { label: '⚡ EV', keywords: 'electric scooter bike EV India Ola Ather' },
  { label: '🏍️ Reviews', keywords: 'bike scooter review test ride India' },
  { label: '💰 Prices', keywords: 'bike price India 2025 hike discount' },
  { label: '🏆 Royal Enfield', keywords: 'Royal Enfield India 2025' },
  { label: '🟠 KTM Bajaj', keywords: 'KTM Bajaj India motorcycle 2025' },
];

const MOCK_NEWS = {
  0: [
    { title: "Ola Electric S1 Pro Gen 2 launched at ₹1.29 lakh — biggest update yet", description: "Ola Electric launches updated S1 Pro with improved range, faster charging, and new features at an aggressive price.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "Royal Enfield Guerrilla 450 review: Best middleweight from RE?", description: "We ride the Guerrilla 450 across city and highway. Spoiler: it mostly lives up to the hype.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "TVS Apache RTR 310 bookings open — deliveries from next month", description: "TVS Motor Company has opened bookings for the Apache RTR 310, with deliveries scheduled to begin next month.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Honda Activa EV launch confirmed — price expected under ₹1.2 lakh", description: "Honda confirms Activa EV launch date. The electric scooter expected to be priced competitively against Ola and Ather.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 10800000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Bajaj Pulsar NS400Z launched at ₹1.97 lakh — specs and features", description: "Bajaj launches flagship Pulsar NS400Z with 373cc engine, USD forks, and Bluetooth connectivity.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 14400000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Hero MotoCorp Karizma XMR 210 — long term review after 10,000 km", description: "After 10,000 km on the Karizma XMR 210, here's what we found about real-world performance and reliability.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 18000000).toISOString(), source_id: "BikeIQ Digest" },
  ],
  1: [
    { title: "Triumph Speed T4 launched in India at ₹2.17 lakh", description: "Triumph brings the Speed T4 to India targeting the middleweight segment dominated by Royal Enfield.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "Yamaha MT-03 2025 launched with new colours and updated electronics", description: "Yamaha updates the MT-03 for 2025 with sharper styling and improved electronics package.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "KTM 390 Adventure X launched at ₹3.46 lakh", description: "KTM launches the 390 Adventure X in India with off-road focused upgrades and new colour options.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Simple One EV gets major update — 212km real range now claimed", description: "Simple Energy updates the One EV with larger battery and claims 212km range on a single charge.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 10800000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Honda CB350RS 2025 launched with new colours and features", description: "Honda launches the CB350RS 2025 with new dual-tone colours and updated instrument cluster.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 14400000).toISOString(), source_id: "BikeIQ Digest" },
  ],
  2: [
    { title: "Ather 450X vs Ola S1 Pro vs TVS iQube — 2025 EV comparison", description: "Three best electric scooters in India go head to head. Which one should you buy in 2025?", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "Bajaj Chetak Premium gets 150km real world range — tested", description: "We test the updated Bajaj Chetak Premium in city conditions and find it delivers on its range promise.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "FAME III subsidy announced — EVs to get cheaper by ₹15,000-30,000", description: "Government announces FAME III subsidies for electric two-wheelers, making EVs significantly more affordable.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Hero Vida V2 Pro launched — range, price and features explained", description: "Hero MotoCorp launches the Vida V2 Pro electric scooter with improved battery and fast charging support.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 10800000).toISOString(), source_id: "BikeIQ Digest" },
  ],
  3: [
    { title: "Yamaha R15 V4 long-term review — still the best 150cc sportsbike?", description: "After 15,000 km on the R15 V4, here's our honest verdict on ownership, mileage, and reliability.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "KTM Duke 390 2025 first ride — sharper, faster, more aggressive", description: "KTM updates the Duke 390 with ride-by-wire, traction control, and a sharper chassis. We ride it first.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Honda Activa 6G vs TVS Jupiter 125 — city scooter showdown", description: "India's two best-selling scooters go head to head in our comprehensive real-world comparison test.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Royal Enfield Classic 350 Signals review — worth the premium?", description: "The Signals edition adds heritage looks to the Classic 350. But is it worth the extra money over standard?", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 10800000).toISOString(), source_id: "BikeIQ Digest" },
  ],
  4: [
    { title: "Hero MotoCorp hikes prices across range — up to ₹3,000 increase", description: "Hero MotoCorp announces price hike across its entire lineup effective from next month onwards.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "Honda cuts prices of CB350 range by ₹5,000 ahead of festive season", description: "Honda reduces prices on the CB350 and CB350RS ahead of the festive season to boost sales.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Best bikes under ₹1 lakh in India — 2025 updated list", description: "Looking for a reliable bike under ₹1 lakh? Here are the best options available right now in India.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
  ],
  5: [
    { title: "Royal Enfield Himalayan 450 BS7 update — what changes?", description: "RE updates the Himalayan 450 to meet upcoming BS7 norms. Here's what changes under the hood.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "Royal Enfield Classic 650 spied testing — launch expected soon", description: "A test mule of the Classic 650 has been spotted testing in Chennai. Launch expected in late 2025.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "RE Bullet 350 vs Classic 350 — which should you buy in 2025?", description: "Both share the same engine but cater to different buyers. We break down the key differences clearly.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "Royal Enfield Super Meteor 650 long-term — best cruiser under ₹4L?", description: "After 8,000 km on the Super Meteor 650, here's our honest verdict on India's favourite cruiser.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 10800000).toISOString(), source_id: "BikeIQ Digest" },
  ],
  6: [
    { title: "KTM RC 390 2025 launched — faster, sharper, more track focused", description: "KTM launches the updated RC 390 with improved aerodynamics, new electronics package, and track mode.", url: "https://www.bikedekho.com/news/", image_url: null, pubDate: new Date().toISOString(), source_id: "BikeIQ Digest" },
    { title: "Bajaj Dominar 400 2025 gets new features and colour options", description: "Bajaj updates the Dominar 400 tourer with new features and two new colour options for 2025.", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 3600000).toISOString(), source_id: "BikeIQ Digest" },
    { title: "KTM Duke 250 vs Bajaj Dominar 250 — which is better value in 2025?", description: "Both bikes share DNA but target different riders. Which one wins on value in 2025?", url: "https://www.bikewale.com/news/", image_url: null, pubDate: new Date(Date.now() - 7200000).toISOString(), source_id: "BikeIQ Digest" },
  ],
};

async function fetchNewsData(keywords, max = 10) {
  try {
    const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_KEY}&q=${encodeURIComponent(keywords)}&country=in&language=en&size=${max}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status === 'success' && data.results?.length > 0) {
      return { articles: data.results, isLive: true };
    }
    throw new Error('No results');
  } catch (err) {
    console.log('NewsData.io failed:', err.message);
    return { articles: null, isLive: false };
  }
}

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLive, setIsLive] = useState(false);

  const load = useCallback(async (idx) => {
    setLoading(true);
    setArticles([]);
    const { articles: fetched } = await fetchNewsData(FILTERS[idx].keywords, 12);
    if (fetched && fetched.length > 0) {
      setArticles(fetched);
      setIsLive(true);
    } else {
      setArticles(MOCK_NEWS[idx] || MOCK_NEWS[0]);
      setIsLive(false);
    }
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { load(0); }, [load]);

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    load(idx);
  };

  // Normalize article fields between NewsData.io and mock
  const normalize = (article) => ({
    title: article.title || article.title,
    description: article.description,
    url: article.link || article.url,
    image: article.image_url,
    publishedAt: article.pubDate || article.publishedAt,
    source: article.source_id || article.source?.name || 'News',
  });

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>📰 Live News</div>
        <button className="icon-btn" onClick={() => load(activeFilter)} title="Refresh">
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Live/Curated indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: isLive ? 'rgba(0,230,118,0.1)' : 'rgba(255,215,64,0.1)', border: `1px solid ${isLive ? 'rgba(0,230,118,0.3)' : 'rgba(255,215,64,0.3)'}` }}>
          {isLive
            ? <><Wifi size={12} color="var(--green)" /><span style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 700 }}>LIVE</span></>
            : <><WifiOff size={12} color="var(--yellow)" /><span style={{ fontSize: '0.72rem', color: 'var(--yellow)', fontWeight: 700 }}>CURATED</span></>
          }
        </div>
        {lastUpdated && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
            Updated {timeAgo(lastUpdated)} · {isLive ? 'NewsData.io' : 'BikeIQ Digest'}
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="chip-row" style={{ marginBottom: 16 }}>
        {FILTERS.map((f, i) => (
          <span key={i} className={`chip ${activeFilter === i ? 'active' : ''}`} onClick={() => handleFilter(i)}>
            {f.label}
          </span>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner" />
          <div style={{ fontSize: '0.82rem' }}>Fetching latest news...</div>
        </div>
      )}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((raw, i) => {
            const article = normalize(raw);
            const isMock = !isLive;
            return (
              <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div className="card glow fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  {article.image && (
                    <img src={article.image} alt={article.title} className="news-img" style={{ marginBottom: 10 }}
                      onError={e => e.target.style.display = 'none'} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="news-source">{article.source}</span>
                      {!isMock ? (
                        <span style={{ fontSize: '0.62rem', background: 'rgba(0,230,118,0.1)', color: 'var(--green)', border: '1px solid rgba(0,230,118,0.25)', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>LIVE</span>
                      ) : (
                        <span style={{ fontSize: '0.62rem', background: 'rgba(255,215,64,0.1)', color: 'var(--yellow)', border: '1px solid rgba(255,215,64,0.25)', borderRadius: 4, padding: '1px 5px', fontWeight: 700 }}>CURATED</span>
                      )}
                    </div>
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
            );
          })}
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
