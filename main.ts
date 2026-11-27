// HearthLedger hand-in program (Node 22, standard library only).
//
// The site itself is the static app/ folder next to this file: plain HTML,
// CSS and scripts a browser opens directly, nothing fetched over the
// network. This program packages it for judging — it copies app/ and
// screenshots/ into the output directory and writes dossier.json there
// with the vendored make.fun library, so the dossier matches byte for
// byte what the scorer computes from the same files.
//
// Run it with:  node main.ts
// Outside the grading container, point MAKEFUN_OUTPUT_DIR at a scratch
// folder to preview the hand-in:  MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });

// The site, copied exactly as authored.
cpSync(join(root, 'app'), join(outDir, 'app'), { recursive: true });

// Screenshots of the running site (the parent adds the captures; the
// folder may legitimately be empty before that, which copies as empty).
const shotsDir = join(root, 'screenshots');
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
}

// The judge's summary of the hand-in. The caps are the scorer's own: a
// dossier request beyond them describes an entry the scorer would refuse
// (too many screenshots or one too large, too many or too-large app files).
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
