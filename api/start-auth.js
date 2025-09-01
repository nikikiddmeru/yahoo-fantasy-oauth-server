export default function handler(req, res) {
  const CLIENT_ID = 'dj0yJmk9YU81dFBpd3ZwNXRZJmQ9WVdrOVFuUlNNVTUxV25BbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTJk';
  const REDIRECT_URI = 'https://yahoo-fantasy-oauth-server.vercel.app/api/auth/yahoo-callback';
  const SCOPE = 'fspt-r';
  
  const authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${SCOPE}`;
  
  // Redirect to Yahoo OAuth
  res.redirect(302, authUrl);
}
