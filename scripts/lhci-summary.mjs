// Resume las puntuaciones de Lighthouse CI guardadas en .lighthouseci/
import { readdirSync, readFileSync } from 'node:fs';

const runs = readdirSync('.lighthouseci').filter((f) => /^lhr-.*\.json$/.test(f));
for (const f of runs) {
  const r = JSON.parse(readFileSync(`.lighthouseci/${f}`, 'utf8'));
  const cats = Object.entries(r.categories).map(([k, v]) => `${k}: ${Math.round(v.score * 100)}`);
  const lcp = Math.round(r.audits['largest-contentful-paint'].numericValue);
  const cls = r.audits['cumulative-layout-shift'].numericValue.toFixed(3);
  console.log(`${cats.join(' · ')} | LCP ${lcp} ms · CLS ${cls}`);
}
