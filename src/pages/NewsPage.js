import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { timeAgo } from '../utils/news';

const FILTERS = [
  { label: 'All News', query: 'two wheeler motorcycle scooter India' },
  { label: '🚀 Launches', query: 'new bike launch India 2025' },
  { label: '⚡ EV', query: 'electric scooter bike India EV 2025' },
  { label: '🏍️ Reviews', query: 'bike scooter review India 2025' },
  { label: '💰 Prices', query: 'bike price hike India 2025' },
  { label: '🏆 Royal Enfield', query: 'Royal Enfield new model India 2025' },
  { label: '🟠 KTM', query: 'KTM Duke RC India 2025' },
];

const MOCK_NEWS = {
  'All News': [
    { title: "Ola Electric S1 Pro Gen 2 launched at ₹1.29 lakh", description: "Ola Electric launches updated S1 Pro with improved range, faster charging, and new features.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "Royal Enfield Guerrilla 450 review: Best middleweight from RE?", description: "We ride the Guerrilla 450 across city and highway to find out if it lives up to the hype.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "TVS Apache RTR 310 bookings open — deliveries next month", description: "TVS Motor Company opens bookings for the Apache RTR 310, deliveries begin next month.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Honda Activa EV launch confirmed — price under ₹1.2 lakh", description: "Honda confirms Activa EV launch date. The electric scooter expected to be priced competitively.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Bajaj Pulsar NS400Z launched at ₹1.97 lakh", description: "Bajaj launches flagship Pulsar NS400Z with 373cc engine, USD forks, and Bluetooth.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 14400000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Hero MotoCorp Karizma XMR 210 — 10,000 km long term review", description: "After 10,000 km on the Karizma XMR 210 — real-world performance, mileage, and reliability.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 18000000).toISOString(), source: { name: "BikeIQ" } },
  ],
  'launches': [
    { title: "Triumph Speed T4 launched in India at ₹2.17 lakh", description: "Triumph brings the Speed T4 to India, targeting the middleweight segment dominated by Royal Enfield.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "Yamaha MT-03 2025 launched — what's new?", description: "Yamaha updates the MT-03 for 2025 with new colours, improved electronics, and sharper styling.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "KTM 390 Adventure X launched at ₹3.46 lakh", description: "KTM launches the 390 Adventure X in India with off-road focused upgrades and new colour options.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Simple One EV gets major update — 212km range now claimed", description: "Simple Energy updates the One EV with larger battery and claims 212km range on a single charge.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Honda CB350RS 2025 launched with new colours and features", description: "Honda launches the CB350RS 2025 with new dual-tone colours and updated instrument cluster.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 14400000).toISOString(), source: { name: "BikeIQ" } },
  ],
  'ev': [
    { title: "Ather 450X vs Ola S1 Pro vs TVS iQube — 2025 EV comparison", description: "Three best electric scooters in India go head to head. Which one should you buy in 2025?", url: "https://www.bikewale.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "Bajaj Chetak Premium gets 150km real world range — tested", description: "We test the updated Bajaj Chetak Premium in city conditions and find it delivers on its range promise.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "FAME III subsidy announced — EVs to get cheaper by ₹15,000-30,000", description: "Government announces FAME III subsidies for electric two-wheelers, making EVs significantly more affordable.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Revolt RV400 BRZ review — best looking EV bike in India?", description: "Revolt updates the RV400 with BRZ edition. We test it across Pune's roads for a week.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Hero Vida V2 Pro launched — range, price and features", description: "Hero MotoCorp launches the Vida V2 Pro electric scooter with improved battery and fast charging.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 14400000).toISOString(), source: { name: "BikeIQ" } },
  ],
  'reviews': [
    { title: "Yamaha R15 V4 long-term review — still the best 150cc sportsbike?", description: "After 15,000 km on the R15 V4, here's our honest verdict on ownership, mileage, and reliability.", url: "https://www.bikewale.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "KTM Duke 390 2025 first ride review — sharper and faster", description: "KTM updates the Duke 390 with ride-by-wire, traction control, and a sharper chassis. We ride it.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Honda Activa 6G vs TVS Jupiter 125 — which is better for city?", description: "India's two best-selling scooters go head to head in our comprehensive real-world comparison test.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Royal Enfield Classic 350 Signals review — worth the premium?", description: "The Signals edition adds heritage looks to the Classic 350. But is it worth the extra money?", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: "BikeIQ" } },
  ],
  'prices': [
    { title: "Hero MotoCorp hikes prices across range — up to ₹3,000 increase", description: "Hero MotoCorp announces price hike across its entire lineup effective from next month.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "Honda cuts prices of CB350 range by ₹5,000 — festive offer?", description: "Honda reduces prices on the CB350 and CB350RS ahead of the festive season to boost sales.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Insurance costs rise for bikes above 350cc — what you need to know", description: "IRDAI revises insurance premium calculation for premium motorcycles. Here's how it affects you.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Best bikes under ₹1 lakh in India — 2025 updated list", description: "Looking for a reliable bike under ₹1 lakh? Here are the best options available right now.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: "BikeIQ" } },
  ],
  'royal enfield': [
    { title: "Royal Enfield Himalayan 450 BS7 update — what changes?", description: "RE updates the Himalayan 450 to meet upcoming BS7 norms. Here's what changes under the hood.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "Royal Enfield Classic 650 spied testing — launch soon?", description: "A test mule of the Classic 650 has been spotted testing in Chennai. Launch expected in late 2025.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "RE Bullet 350 vs Classic 350 — which should you buy in 2025?", description: "Both share the same engine but cater to different buyers. We break down the differences.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
    { title: "Royal Enfield Super Meteor 650 long-term — best cruiser under ₹4L?", description: "After 8,000 km on the Super Meteor 650, here's our honest verdict on India's favourite cruiser.", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), source: { name: "BikeIQ" } },
  ],
  'ktm': [
    { title: "KTM RC 390 2025 launched — faster, sharper, more track focused", description: "KTM launches the updated RC 390 with improved aerodynamics, new electronics, and track mode.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date().toISOString(), source: { name: "BikeIQ" } },
    { title: "KTM Duke 250 vs Bajaj Dominar 250 — which is better value?", description: "Both bikes share DNA but target different riders. Which one wins on value in 2025?", url: "https://www.bikewale.com", image: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), source: { name: "BikeIQ" } },
    { title: "KTM 390 Adventure X off-road test — Himalayan rival?", description: "We take the 390 Adventure X off the beaten path to see if it can rival the Royal Enfield Himalayan.", url: "https://www.bikedekho.com", image: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), source: { name: "BikeIQ" } },
  ],
};

function getMockForFilter(idx) {
  const keys = ['All News', 'launches', 'ev', 'reviews', 'prices', 'royal enfield', 'ktm'];
  return MOCK_NEWS[keys[idx]] || MOCK_NEWS['All News'];
}

async function fetchNews(query, max, filterIdx) {
  try {
    const res = await fetch(`/api/news?query=${encodeURIComponent(query)}&max=${max}`);
    if (!res.ok) throw new Error('failed');
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) throw new Error('empty');
    return data.articles;
  } catch {
    return getMockForFilter(filterIdx);
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
    const data = await fetchNews(FILTERS[idx].query, 10, idx);
    setArticles(data);
    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => { load(0); }, []); // eslint-disable-line

  const handleFilter = (idx) => {
    setActiveFilter(idx);
    load(idx);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>📰 Live News</div>
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
          <span key={i} className={`chip ${activeFilter === i ? 'active' : ''}`} onClick={() => handleFilter(i)}>
            {f.label}
          </span>
        ))}
      </div>

      {loading && <div className="loading"><div className="spinner" /><div style={{ fontSize: '0.82rem' }}>Fetching latest news...</div></div>}

      {!loading && articles.length === 0 && (
        <div className="empty"><div className="empty-icon">📭</div><h3>No articles found</h3><p>Try a different filter or refresh</p></div>
      )}

      {!loading && articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {articles.map((article, i) => (
            <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <div className="card glow fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                {article.image && (
                  <img src={article.image} alt={article.title} className="news-img" style={{ marginBottom: 10 }} onError={e => e.target.style.display = 'none'} />
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
