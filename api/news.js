export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { query, max = 10 } = req.query;
  const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY;

  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=in&max=${max}&apikey=${GNEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return res.status(200).json({ articles: data.articles });
    } else {
      return res.status(200).json({ articles: [] });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch news', articles: [] });
  }
}
