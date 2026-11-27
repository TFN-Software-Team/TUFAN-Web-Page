import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const shellPath = path.join(distDir, '_shell.html');

if (!fs.existsSync(indexPath)) {
  console.error('[prepare-ssr] dist/index.html not found — run vite build first.');
  process.exit(1);
}

// Copy built index.html to _shell.html so api/ssr.js can inject __INITIAL_DATA__ into it
fs.copyFileSync(indexPath, shellPath);

// On Vercel builds, remove dist/index.html so requests to "/" hit the /api/ssr rewrite
// instead of bypassing SSR via static index.html. Locally keep dist/index.html for vite preview.
if (process.env.VERCEL) {
  fs.unlinkSync(indexPath);
  console.log('[prepare-ssr] Vercel build detected: moved dist/index.html -> dist/_shell.html');
} else {
  console.log('[prepare-ssr] Local build: copied dist/index.html -> dist/_shell.html');
}
