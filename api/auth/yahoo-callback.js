const fetch = require('node-fetch');

export default async function handler(req, res) {
  const { code, error } = req.query;
  
  if (error) {
    return res.redirect(`https://claude.ai?auth_error=${error}`);
  }
  
  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }
  
  const CLIENT_ID = 'dj0yJmk9YU81dFBpd3ZwNXRZJmQ9WVdrOVFuUlNNVTUxV25BbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTJk';
  const CLIENT_SECRET = '29c3e46f8a4d70f439707ac35ef2ac71ed6b1e52';
  const REDIRECT_URI = 'https://yahoo-fantasy-oauth-server.vercel.app/api/auth/yahoo-callback';
  
  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.login.yahoo.com/oauth2/get_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: code,
        grant_type: 'authorization_code'
      })
    });
    
    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      return res.redirect(`https://claude.ai?auth_error=${tokens.error}`);
    }
    
    // For demo purposes, we'll redirect back with the token in a secure way
    // In production, you'd store this in a database associated with the user
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    
    // Create a simple HTML page that passes the token back to the Claude app
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Yahoo Fantasy OAuth - Success</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; text-align: center; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success { color: #22c55e; font-size: 24px; margin-bottom: 20px; }
        .token { background: #f3f4f6; padding: 15px; border-radius: 5px; word-break: break-all; font-family: monospace; font-size: 14px; margin: 20px 0; }
        button { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background: #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success">✅ Yahoo OAuth Successful!</div>
        <p>Your access token has been generated. Copy the token below and paste it into your Claude Fantasy Draft app:</p>
        
        <div class="token" id="token">${accessToken}</div>
        
        <button onclick="copyToken()">Copy Access Token</button>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          <strong>Next steps:</strong><br>
          1. Copy the access token above<br>
          2. Go back to your Claude app<br>
          3. Choose "Advanced: Server-Side Integration"<br>
          4. Paste the token and connect!
        </p>
        
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Token expires in ${tokens.expires_in} seconds (~${Math.floor(tokens.expires_in / 3600)} hours)
        </p>
      </div>
      
      <script>
        function copyToken() {
          const token = document.getElementById('token').textContent;
          navigator.clipboard.writeText(token).then(() => {
            alert('Token copied to clipboard!');
          }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = token;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Token copied to clipboard!');
          });
        }
      </script>
    </body>
    </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({ error: 'Failed to exchange authorization code for access token' });
  }
}
