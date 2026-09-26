// Mide los fps de la portada (bucle, hover, inclinación y scroll) en Chrome con GPU si está instalado.
// Uso: npm run preview (en otra terminal) && npm run fps [-- url]
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4173/';
// Chrome real con GPU si está instalado (como un visitante); si no, el Chromium de Playwright,
// que rasteriza por software y da cifras más bajas en scroll.
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', args: ['--headless=new', '--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
  console.log('Navegador: Chrome (GPU)');
} catch {
  browser = await chromium.launch();
  console.log('Navegador: Chromium de Playwright (rasterizado por software)');
}

async function measure(label, setup, during) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url);
  await page.waitForTimeout(1500); // calentamiento: la primera ráfaga tras cargar va en frío
  if (setup) await setup(page);
  const stamps = await page.evaluate(
    (scroll) =>
      new Promise((resolve) => {
        const t = [];
        const y0 = scrollY;
        const tick = (ts) => {
          t.push(ts);
          if (scroll) scrollTo(0, y0 + t.length * 6); // scroll continuo, ~360 px/s
          t.length < 241 ? requestAnimationFrame(tick) : resolve(t);
        };
        requestAnimationFrame(tick);
      }),
    during === 'scroll',
  );
  const d = stamps.slice(1).map((v, i) => v - stamps[i]);
  const avg = d.reduce((a, b) => a + b) / d.length;
  const fps = 1000 / avg;
  console.log(`${label.padEnd(26)} ${fps.toFixed(1)} fps · frames >25 ms: ${d.filter((x) => x > 25).length}/${d.length}`);
  await page.close();
  return fps;
}

const results = [
  await measure('bucle (sala centrada)', (p) => p.locator('.hero-band').evaluate((el) => el.scrollIntoView({ block: 'center' }))),
  await measure('hover sobre «Sobre mí»', async (p) => {
    await p.locator('.hero-band').evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await p.locator('.hotspot[data-open="about"]').hover();
  }),
  await measure('inclinada (diorama)', async (p) => {
    const band = p.locator('.hero-band');
    await band.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const b = await band.boundingBox();
    await p.mouse.move(b.x + 60, b.y + b.height - 60, { steps: 3 });
  }),
  await measure('scroll a través de la sala', (p) => p.evaluate(() => scrollTo(0, 0)), 'scroll'),
];
await browser.close();
const min = Math.min(...results);
console.log(`mínimo: ${min.toFixed(1)} fps ${min >= 55 ? '✓ (≥ 55)' : '✗ (< 55)'}`);
