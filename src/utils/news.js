const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

export async function fetchBikeNews(query = 'two wheeler motorcycle scooter India', max = 10) {
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${GNEWS_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.articles || [];
  } catch {
    return [];
  }
}

export async function fetchLatestLaunches() {
  return fetchBikeNews('new bike launch India 2024 2025', 6);
}

export async function fetchEVNews() {
  return fetchBikeNews('electric scooter bike India EV launch', 6);
}

export async function fetchBikeSpecificNews(bikeName) {
  return fetchBikeNews(`${bikeName} India`, 5);
}

export function timeAgo(dateStr) {
  const now = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
