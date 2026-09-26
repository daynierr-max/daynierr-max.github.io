// Genera public/og.png (1200×630) a partir de la escena real.
// Uso: npm run build && npm run preview (en otra terminal) && node scripts/og.mjs
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1232, height: 1200 } });
await page.emulateMedia({ reducedMotion: 'reduce' }); // imagen estable
await page.goto(process.argv[2] ?? 'http://localhost:4173/');
await page.addStyleTag({
  content: `.topbar,.hint,.foot,.hotspots{display:none!important}
  .og{position:absolute;left:40px;font-family:system-ui,sans-serif;color:#e8eef8;z-index:5}
  .og b{display:block;font-size:44px;letter-spacing:.01em}
  .og span{display:block;margin-top:6px;font:500 20px ui-monospace,Menlo,monospace;color:#34e0ff}`,
});
await page.evaluate(() => {
  const d = document.createElement('div');
  d.className = 'og';
  d.innerHTML = '<b>Daynier Rodríguez</b><span>Sistemas · Azure · Ciberseguridad · IA aplicada</span>';
  document.querySelector('.stage')?.append(d);
});
const box = await page.locator('.stage').boundingBox();
const y = box.y + box.height * 0.47 - 315;
// texto dentro del recorte, abajo a la izquierda
await page.locator('.og').evaluate((el, top) => (el.style.top = `${top}px`), y - box.y + 630 - 118);
await page.screenshot({ path: 'public/og.png', clip: { x: box.x, y, width: 1200, height: 630 } });
await browser.close();
console.log('public/og.png generado');
