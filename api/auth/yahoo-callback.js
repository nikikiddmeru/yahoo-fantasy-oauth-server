const fetch = require('node-fetch');

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { endpoint } = req.query;
  const accessToken = req.headers.authorization?.replace('Bearer ', '');
  
  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  
  if (!endpoint) {
    return res.status(400).json({ error: 'No endpoint specified' });
  }
  
  try {
    const yahooUrl = `https://fantasysports.yahooapis.com/fantasy/v2/${endpoint}?format=json`;
    
    const response = await fetch(yahooUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Yahoo API error: ${response.status}`,
        details: errorText
      });
    }
    
    const data = await response.json();
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request to Yahoo API' });
  }
}
