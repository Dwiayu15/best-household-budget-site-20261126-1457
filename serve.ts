// A tiny static file server for previewing HearthLedger locally.
// Serves this repository's root folder on port 8080, so the site is at
// http://localhost:8080/app/ (the bare root redirects there).
// Node 22 standard library only:  node serve.ts

import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = 8080;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let path = decodeURIComponent(url.pathname);

  if (path === '/') {
    res.writeHead(302, { Location: '/app/' });
    res.end();
    return;
  }
  if (path.endsWith('/')) path += 'index.html';

  // Keep requests inside the repo root.
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    if (!statSync(file).isFile()) throw new Error('not a file');
    const body = readFileSync(file);
    res.writeHead(200, { 'Content-Type': types[extname(file).toLowerCase()] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log('HearthLedger preview at http://localhost:' + port + '/app/');
});
