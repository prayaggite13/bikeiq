export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { query, max = 10 } = req.query;
  const GNEWS_KEY = process.env.REACT_APP_GNEWS_API_KEY;

  if (!query) return res.status(400).json({ articles: [] });

  // Try GNews first
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${GNEWS_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return res.status(200).json({ articles: data.articles, source: 'gnews' });
    }
  } catch (err) {
    console.log('GNews failed:', err.message);
  }

  // Return empty so frontend uses mock
  return res.status(200).json({ articles: [], source: 'none' });
}
