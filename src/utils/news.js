const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

export async function fetchBikeNews(query = 'two wheeler motorcycle scooter India', max = 10) {
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${GNEWS_API_KEY}&expand=content`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('GNews error');
    const data = await res.json();
    return data.articles || [];
  } catch {
    // Fallback to top-headlines endpoint
    try {
      const url2 = `https://gnews.io/api/v4/top-headlines?topic=technology&lang=en&country=in&max=${max}&apikey=${GNEWS_API_KEY}`;
      const res2 = await fetch(url2);
      const data2 = await res2.json();
      return data2.articles || [];
    } catch {
      return getMockNews();
    }
  }
}

function getMockNews() {
  return [
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
  ];
}

export async function fetchLatestLaunches() {
  return fetchBikeNews('new bike launch India 2025', 6);
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
