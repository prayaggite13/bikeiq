const NEWSDATA_API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY;

// NewsData.io — returns real articles with real URLs
export async function fetchBikeNews(query = 'motorcycle scooter bike India', max = 10) {
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&q=${encodeURIComponent(query)}&country=in&language=en&category=technology,business&size=${max}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`NewsData error ${res.status}`);
    const data = await res.json();
    if (data.status !== 'success') throw new Error('NewsData bad response');
    return (data.results || []).map(a => ({
      title:       a.title,
      description: a.description || a.content?.slice(0, 200) || '',
      url:         a.link,           // real article URL
      image:       a.image_url,
      publishedAt: a.pubDate,
      source:      { name: a.source_id || a.source_name || 'News' },
    }));
  } catch (err) {
    console.warn('NewsData fetch failed:', err.message);
    return [];
  }
}

export async function fetchLatestLaunches() {
  return fetchBikeNews('new bike launch India 2025 2026', 6);
}

export async function fetchEVNews() {
  return fetchBikeNews('electric scooter bike India EV 2025', 6);
}

export async function fetchBikeSpecificNews(bikeName) {
  return fetchBikeNews(`${bikeName} India`, 5);
}

export function timeAgo(dateStr) {
  const now  = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
