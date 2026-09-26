// Mide los fps del bucle de la escena en Chromium headless (orientativo).
// Uso: npm run preview (en otra terminal) && node scripts/fps.mjs [url]
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2] ?? 'http://localhost:4173/');
await page.waitForTimeout(1000);
const stamps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const t = [];
      const tick = (ts) => (t.push(ts), t.length < 301 ? requestAnimationFrame(tick) : resolve(t));
      requestAnimationFrame(tick);
    }),
);
const deltas = stamps.slice(1).map((v, i) => v - stamps[i]);
const avg = deltas.reduce((a, b) => a + b) / deltas.length;
const p95 = [...deltas].sort((a, b) => a - b)[Math.floor(deltas.length * 0.95)];
console.log(
  `fps medio: ${(1000 / avg).toFixed(1)} · frame p95: ${p95.toFixed(1)} ms · frames >25 ms: ${deltas.filter((x) => x > 25).length}/${deltas.length}`,
);
await browser.close();
