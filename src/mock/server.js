import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'dummy.json');

async function loadDb() {
  const txt = await fs.readFile(DB_FILE, 'utf8');
  return JSON.parse(txt);
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(body);
}

function sendOptions(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end();
}

async function start() {
  const db = await loadDb();
  const tokens = new Map();

  const server = http.createServer(async (req, res) => {
    try {
      if (req.method === 'OPTIONS') { sendOptions(res); return; }

      const base = `http://${req.headers.host}`;
      const url = new URL(req.url || '', base);
      const pathname = url.pathname;

      if (req.method === 'POST' && pathname === '/auth/login') {
        let body = '';
        for await (const chunk of req) body += chunk;
        let parsed;
        try { parsed = body ? JSON.parse(body) : {}; } catch { sendJson(res, 400, { message: 'Invalid JSON' }); return; }
        const { username, password } = parsed || {};
        const user = Array.isArray(db.users) ? db.users.find(u => u.username === username && u.password === password) : undefined;
        if (user) {
          const token = `token-${Math.random().toString(36).slice(2)}`;
          tokens.set(token, user);
          const safeUser = Object.assign({}, user); delete safeUser.password;
          sendJson(res, 200, { token, user: safeUser });
        } else {
          sendJson(res, 400, { message: 'Invalid credentials' });
        }
        return;
      }

      if (req.method === 'GET' && pathname === '/auth/me') {
        const auth = req.headers['authorization'] || '';
        const parts = String(auth).split(' ');
        const token = parts[1];
        if (!token) { sendJson(res, 401, { message: 'No token' }); return; }
        const user = tokens.get(token);
        if (!user) { sendJson(res, 401, { message: 'Invalid token' }); return; }
        const safeUser = Object.assign({}, user); delete safeUser.password;
        sendJson(res, 200, safeUser);
        return;
      }

      if (req.method === 'GET' && pathname === '/users') {
        const users = Array.isArray(db.users) ? db.users.map(u => { const s = Object.assign({}, u); delete s.password; return s; }) : [];
        sendJson(res, 200, users);
        return;
      }

      if (req.method === 'GET' && pathname === '/products/search') {
        const q = url.searchParams.get('q') || '';
        const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10));
        const skip = Math.max(0, parseInt(url.searchParams.get('skip') || '0', 10));
        let products = Array.isArray(db.products) ? db.products.slice() : [];
        if (q) {
          const qq = q.toLowerCase();
          products = products.filter(p => String(p.title).toLowerCase().includes(qq) || String(p.description || '').toLowerCase().includes(qq));
        }
        const total = products.length;
        const items = products.slice(skip, skip + limit);
        sendJson(res, 200, { products: items, total, skip, limit });
        return;
      }

      if (req.method === 'GET' && pathname.startsWith('/products')) {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length === 1) {
          const limit = Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10));
          const skip = Math.max(0, parseInt(url.searchParams.get('skip') || '0', 10));
          const products = Array.isArray(db.products) ? db.products.slice() : [];
          const total = products.length;
          const items = products.slice(skip, skip + limit);
          sendJson(res, 200, { products: items, total, skip, limit });
          return;
        } else if (parts.length === 2) {
          const id = parts[1];
          const pid = isNaN(Number(id)) ? id : Number(id);
          const product = Array.isArray(db.products) ? db.products.find(p => p.id === pid) : undefined;
          if (!product) { sendJson(res, 404, { message: 'Not found' }); return; }
          sendJson(res, 200, product);
          return;
        }
      }

      sendJson(res, 404, { message: 'Not found' });
    } catch (err) {
      console.error('Mock server error', err);
      sendJson(res, 500, { message: 'Server error' });
    }
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  server.listen(port, () => { console.log(`Simple mock server running at http://localhost:${port}`); });
}

start().catch(err => { console.error('Failed to start mock server', err); process.exit(1); });