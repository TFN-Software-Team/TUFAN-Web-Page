import fs from 'node:fs/promises';
import path from 'node:path';

const BACKEND_URL = (process.env.BACKEND_URL || 'https://tufan-backend.onrender.com').replace(/\/$/, '');
const FETCH_TIMEOUT_MS = 7500;

let cachedShellHtml = null;

function serializeSafeJson(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

async function fetchJsonWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, status: res.status, data: null };
    const data = await res.json();
    return { ok: true, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchBootstrapData() {
  // 1. Tek istekte tüm veriyi çek (/bootstrap/)
  const bootstrapRes = await fetchJsonWithTimeout(`${BACKEND_URL}/bootstrap/`);
  if (bootstrapRes.ok && bootstrapRes.data && typeof bootstrapRes.data === 'object') {
    return bootstrapRes.data;
  }

  // 2. Fallback: /bootstrap/ henüz canlı backend'de yoksa (örn. preview branch)
  // mevcut endpoint'leri paralel çekip aynı yapıyı oluştur
  if (bootstrapRes.status === 404 || bootstrapRes.status === 405) {
    const [settingsRes, projectsRes, mediaRes, sponsorsRes] = await Promise.all([
      fetchJsonWithTimeout(`${BACKEND_URL}/settings/`),
      fetchJsonWithTimeout(`${BACKEND_URL}/projeler/`),
      fetchJsonWithTimeout(`${BACKEND_URL}/media/`),
      fetchJsonWithTimeout(`${BACKEND_URL}/sponsors/`),
    ]);

    if (!settingsRes.ok && !projectsRes.ok && !mediaRes.ok && !sponsorsRes.ok) {
      return null;
    }

    const settingsMap = {};
    if (Array.isArray(settingsRes.data)) {
      for (const s of settingsRes.data) {
        if (s && s.key) settingsMap[s.key] = s.value;
      }
    }

    let sponsorsList = [];
    if (sponsorsRes.ok && Array.isArray(sponsorsRes.data)) {
      sponsorsList = sponsorsRes.data;
    } else if (settingsMap.site_sponsors) {
      try {
        const parsed = JSON.parse(settingsMap.site_sponsors);
        if (Array.isArray(parsed)) sponsorsList = parsed;
      } catch {
        // ignore invalid JSON
      }
    }

    return {
      settings: settingsMap,
      projects: Array.isArray(projectsRes.data) ? projectsRes.data : [],
      media: Array.isArray(mediaRes.data) ? mediaRes.data : [],
      sponsors: sponsorsList,
    };
  }

  return null;
}

async function getHtmlShell(req) {
  if (cachedShellHtml) return cachedShellHtml;

  // Önce yerel diskte _shell.html veya index.html var mı bak (local test / bundled fallback)
  const candidates = [
    path.resolve(process.cwd(), 'dist', '_shell.html'),
    path.resolve(process.cwd(), 'dist', 'index.html'),
  ];
  for (const filePath of candidates) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      if (content && content.includes('<div id="root">')) {
        cachedShellHtml = content;
        return content;
      }
    } catch {
      // devam et
    }
  }

  // Vercel static CDN'den _shell.html'i çek (preview protection için cookie başlığını aktar)
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (!host) {
    throw new Error('Missing host header for _shell.html lookup');
  }

  const headers = { Accept: 'text/html' };
  if (req.headers.cookie) headers.cookie = req.headers.cookie;
  if (req.headers.authorization) headers.authorization = req.headers.authorization;

  const shellUrl = `${proto}://${host}/_shell.html`;
  const shellRes = await fetch(shellUrl, { headers });
  if (!shellRes.ok) {
    throw new Error(`Failed to fetch _shell.html: HTTP ${shellRes.status}`);
  }
  const html = await shellRes.text();
  if (!html.includes('<div id="root">')) {
    throw new Error('Unexpected _shell.html content');
  }

  cachedShellHtml = html;
  return html;
}

function injectInitialData(html, initialData) {
  if (!initialData) return html;
  const payload = serializeSafeJson(initialData);
  const scriptTag = `<script id="__TUFAN_INITIAL_DATA__">window.__INITIAL_DATA__=${payload};</script>`;
  if (html.includes('</head>')) {
    return html.replace('</head>', `    ${scriptTag}\n  </head>`);
  }
  return `${scriptTag}${html}`;
}

export default async function handler(req, res) {
  try {
    // HTML şablonu ve backend verisini paralel olarak al
    const [shellHtml, initialData] = await Promise.all([
      getHtmlShell(req),
      fetchBootstrapData(),
    ]);

    const finalHtml = injectInitialData(shellHtml, initialData);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (initialData) {
      // Tarayıcı yerel diskte eski HTML tutmasın; Vercel Edge CDN 15 sn taze tutup
      // 5 dk boyunca arka planda yenileyerek anında (ms) sunsun
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.setHeader('CDN-Cache-Control', 'public, s-maxage=15, stale-while-revalidate=300');
      res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=15, stale-while-revalidate=300');
      res.setHeader('X-Tufan-SSR', 'hit');
    } else {
      // Backend zaman aşımına uğradıysa boş/eksik yanıtı CDN'de asla önbellekleme
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Tufan-SSR', 'fallback');
    }

    res.status(200).send(finalHtml);
  } catch (err) {
    console.error('[api/ssr] error:', err);
    res.setHeader('Cache-Control', 'no-store');
    res.redirect(307, '/_shell.html');
  }
}

