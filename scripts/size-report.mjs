// Informe de tamaño del JS inicial (gzip). Falla si supera 150 KB.
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const LIMIT = 150 * 1024;
const html = readFileSync('dist/index.html', 'utf8');
const initial = [...html.matchAll(/<script[^>]+src="\/([^"]+\.js)"/g)].map((m) => m[1]);
const modulepreload = [...html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="\/([^"]+\.js)"/g)].map((m) => m[1]);
const files = [...new Set([...initial, ...modulepreload])];
let total = 0;
for (const f of files) {
  const gz = gzipSync(readFileSync(join('dist', f))).length;
  total += gz;
  console.log(`  ${f}  ${(gz / 1024).toFixed(2)} KB gzip`);
}
const all = readdirSync('dist/assets').filter((f) => f.endsWith('.js'));
console.log(`JS inicial: ${(total / 1024).toFixed(2)} KB gzip (límite 150 KB) · ${all.length} chunk(s) JS en total`);
if (total > LIMIT) {
  console.error('ERROR: el JS inicial supera 150 KB gzip');
  process.exit(1);
}
