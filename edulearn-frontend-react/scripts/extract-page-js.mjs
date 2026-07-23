/**
 * Lift each static page's inline <script> into a module.
 *
 * The body is copied VERBATIM and wrapped in a function whose parameters
 * shadow `location`, `document` and `window` (see pageScriptEnv.ts). That is
 * the whole trick: the page's own, already-working code keeps running against
 * a DOM that the converted markup reproduces exactly, instead of being
 * re-derived in React idiom — which is where behaviour drift would come from.
 *
 * Emitted as .js, not .ts: this is untouched legacy source and should not have
 * to satisfy strict type checking. tsconfig sets allowJs so it can be imported.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const STATIC = join(HERE, '../../edulearn-frontend');
const OUT = join(HERE, '../src/pages/scripts');

const PAGES = ['dashboard', 'learn', 'lesson', 'videos', 'mocktest', 'take-test',
  'create-test', 'challenge', 'pal', 'live', 'login', 'signup', 'upload', 'admin'];

mkdirSync(OUT, { recursive: true });

const rows = [];
for (const page of PAGES) {
  const html = readFileSync(join(STATIC, `${page}.html`), 'utf8');

  // Inline scripts only, in source order. <script src="..."> are shared files
  // (api.js, curriculum.js, account-menu.js) loaded globally in index.html.
  const bodies = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (/\bsrc\s*=/.test(m[1])) continue;
    if (m[2].trim()) bodies.push(m[2]);
  }
  if (!bodies.length) { rows.push([page, 0, 'no inline script']); continue; }

  const body = bodies.join('\n\n/* ---- next <script> block ---- */\n\n');

  const src =
    `/* Lifted verbatim from edulearn-frontend/${page}.html — do not hand-edit.\n` +
    `   Regenerate with \`npm run sync:js\`.\n\n` +
    `   Runs inside the page-script environment: the destructured parameters\n` +
    `   shadow the real globals so ".html" navigations become route changes and\n` +
    `   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */\n` +
    `/* eslint-disable */\n` +
    `export default function init({ location, document, window, onCleanup }) {\n` +
    body + '\n' +
    `}\n`;

  writeFileSync(join(OUT, `${page}.js`), src);
  rows.push([page, bodies.length, `${src.split('\n').length} lines`]);
}

console.log('page             blocks  output');
for (const [p, n, note] of rows) console.log(`${p.padEnd(16)} ${String(n).padStart(6)}  ${note}`);
