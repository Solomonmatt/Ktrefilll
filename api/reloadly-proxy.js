const http = require('http');
const https = require('https');
const { URL } = require('url');

const RELOADLY_CLIENT_ID = process.env.RELOADLY_CLIENT_ID || 'H6KbktQKut6yCIKTApt9LMrxgZuk0GHS';
const RELOADLY_CLIENT_SECRET = process.env.RELOADLY_CLIENT_SECRET || '0yopzY6UnO-j0ovKpgsEvzjIGOsoOm-LK9fMffQPQ62Hogj0SB5eUbpEXYaiTaM';
const RELOADLY_AUDIENCE = process.env.RELOADLY_AUDIENCE || 'https://topups.reloadly.com';
const RELOADLY_TOKEN_URL = process.env.RELOADLY_TOKEN_URL || 'https://auth.reloadly.com/oauth/token';
const RELOADLY_API_BASE = process.env.RELOADLY_API_BASE || 'https://topups.reloadly.com';

let cachedReloadlyToken = null;
let cachedReloadlyTokenExpiresAt = 0;

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,Accept'
  });
  res.end(body);
}

function setCachedReloadlyToken(tokenData) {
  if (!tokenData?.access_token) {
    return;
  }

  cachedReloadlyToken = tokenData.access_token;
  const expiresIn = Number(tokenData.expires_in || 3600);
  cachedReloadlyTokenExpiresAt = Date.now() + Math.max(60, expiresIn - 60) * 1000;
}

function getCachedReloadlyToken() {
  if (cachedReloadlyToken && Date.now() < cachedReloadlyTokenExpiresAt) {
    return cachedReloadlyToken;
  }

  return null;
}

function proxyToReloadly(pathname, search, headers, method = 'GET', body = null) {
  const targetUrl = new URL(`${RELOADLY_API_BASE}${pathname}${search}`);
  const cachedToken = getCachedReloadlyToken();
  const requestOptions = {
    method,
    headers: {
      Accept: 'application/json',
      ...(cachedToken ? { Authorization: `Bearer ${cachedToken}` } : {}),
      ...(headers.authorization ? { Authorization: headers.authorization } : {}),
      ...(headers.Authorization ? { Authorization: headers.Authorization } : {})
    }
  };

  if (body && typeof body === 'string') {
    requestOptions.headers['Content-Length'] = Buffer.byteLength(body);
  }

  const transport = targetUrl.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
    const req = transport.request(targetUrl, requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ statusCode: res.statusCode || 200, data: parsed, raw: data });
        } catch (error) {
          resolve({ statusCode: res.statusCode || 200, data: data, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {});
    return;
  }

  const url = new URL(req.url, 'http://127.0.0.1');
  const pathname = url.pathname;

  if (pathname === '/api/reloadly/token') {
    const bodyChunks = [];
    req.on('data', (chunk) => bodyChunks.push(chunk));
    req.on('end', async () => {
      const payload = bodyChunks.length ? JSON.parse(Buffer.concat(bodyChunks).toString()) : {};
      const tokenBody = JSON.stringify({
        client_id: RELOADLY_CLIENT_ID,
        client_secret: RELOADLY_CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience: payload.audience || RELOADLY_AUDIENCE
      });

      try {
        const tokenResponse = await fetch(RELOADLY_TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: tokenBody
        });
        const tokenData = await tokenResponse.json();
        setCachedReloadlyToken(tokenData);
        sendJson(res, tokenResponse.status, tokenData);
      } catch (error) {
        sendJson(res, 502, { error: 'Unable to obtain Reloadly token', details: String(error.message || error) });
      }
    });
    return;
  }

  if (!pathname.startsWith('/api/reloadly')) {
    sendJson(res, 404, { error: 'Not found' });
    return;
  }

  const route = pathname.replace(/^\/api\/reloadly/, '');
  const method = req.method || 'GET';
  const headers = req.headers || {};
  let body = null;

  if (method !== 'GET' && method !== 'HEAD') {
    const rawChunks = [];
    req.on('data', (chunk) => rawChunks.push(chunk));
    req.on('end', async () => {
      body = Buffer.concat(rawChunks).toString();
      try {
        const response = await proxyToReloadly(route, url.search, headers, method, body);
        sendJson(res, response.statusCode, response.data);
      } catch (error) {
        sendJson(res, 502, { error: 'Reloadly proxy error', details: String(error.message || error) });
      }
    });
    return;
  }

  try {
    const response = await proxyToReloadly(route, url.search, headers, method, body);
    sendJson(res, response.statusCode, response.data);
  } catch (error) {
    sendJson(res, 502, { error: 'Reloadly proxy error', details: String(error.message || error) });
  }
});

const port = Number(process.env.PORT || 8000);
server.listen(port, '127.0.0.1', () => {
  console.log(`Reloadly proxy listening on http://127.0.0.1:${port}`);
});
