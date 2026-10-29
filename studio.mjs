// studio.mjs — Interactive Studio Director & Review Web Server
// Usage: node studio.mjs --project projects/asset-showcase [--port 3000]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = {};
{
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith('--')) {
      const k = a[i].slice(2);
      const v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true;
      args[k] = v;
    }
  }
}

const defaultProject = args.project || 'projects/asset-showcase';
const PROJECT = path.resolve(defaultProject);
const PORT = parseInt(args.port || 3000, 10);

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4'
};

function listScenes(dir, base) {
  let out = [];
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      out = out.concat(listScenes(p, `${base}/${f}`));
    } else if (f.endsWith('.js') && !f.startsWith('_')) {
      out.push(`${base}/${f}`);
    }
  }
  return out;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // Manifest endpoint for dynamic scene loading
  if (pathname === '/__manifest') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify(listScenes(path.join(PROJECT, 'scenes'), '/project/scenes')));
  }

  // Cloud Render Trigger API
  if (pathname === '/api/cloud-render' && req.method === 'POST') {
    const projParam = parsedUrl.searchParams.get('project') || path.relative(ROOT, PROJECT);
    console.log(`[API] Dispatching GitHub Actions render for ${projParam}...`);
    
    const proc = spawn('gh', ['workflow', 'run', 'render.yml', '-f', `project=${projParam}`, '-f', 'chunks=4'], {
      cwd: ROOT
    });
    
    let stderr = '';
    proc.stderr.on('data', d => stderr += d.toString());
    proc.on('close', code => {
      if (code === 0) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'Cloud render dispatched successfully' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: stderr || 'gh workflow run failed' }));
      }
    });
    return;
  }

  // Route root / to /studio.html
  let target = pathname === '/' ? '/studio.html' : pathname;
  const p = target.startsWith('/project/') ? path.join(PROJECT, target.slice(9)) : path.join(ROOT, target);

  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }

  const ext = path.extname(p);
  res.writeHead(200, {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(p).pipe(res);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🎬 GrowKaz Stickman Studio Review Suite LIVE!`);
  console.log(`   URL: http://localhost:${PORT}/studio.html?project=${encodeURIComponent(path.relative(ROOT, PROJECT))}`);
  console.log(`   Active Project: ${PROJECT}`);
  console.log(`======================================================\n`);
});

