// Fase D (v2): portada como ficha de producto.
import { test, expect, type Page } from '@playwright/test';
import cvEs from '../src/data/cv.es.json' with { type: 'json' };
import cvEn from '../src/data/cv.en.json' with { type: 'json' };

// Todos los textos del JSON (hojas string), salvo metadatos, URLs, fechas ISO e identificadores.
function jsonStrings(node: unknown, key = ''): string[] {
  if (typeof node === 'string') {
    if (!node.trim() || ['url', 'credentialUrl', 'start', 'end', 'id', 'source', 'lang', 'pdf'].includes(key)) return [];
    // Una certificación obtenida no lleva etiqueta de estado (solo las pendientes muestran «en preparación»)
    if (key === 'status' && !/prepar/i.test(node)) return [];
    return [node];
  }
  if (Array.isArray(node)) return node.flatMap((n) => jsonStrings(n, key));
  if (node && typeof node === 'object') return Object.entries(node).flatMap(([k, v]) => (k === 'meta' ? [] : jsonStrings(v, k)));
  return [];
}

const pageText = (page: Page) => page.evaluate(() => document.body.textContent!.replace(/\s+/g, ' '));

test('bloques en orden: barra, cabecera, datos, sala, apps, vista previa, novedades, versiones, información, contacto', async ({ page }) => {
  await page.goto('/');
  const order = await page.evaluate(() => {
    const sel = ['.bar', '.product-head', '.stats', '.hero', '.apps', '.preview', '.news', '.versions', '.info', '.contact-card'];
    const els = sel.map((s) => document.querySelector(s));
    return { found: els.map((e) => !!e), sorted: els.every((e, i) => i === 0 || !!(els[i - 1]!.compareDocumentPosition(e!) & Node.DOCUMENT_POSITION_FOLLOWING)) };
  });
  expect(order.found.every(Boolean)).toBe(true);
  expect(order.sorted).toBe(true);
});

for (const [lang, cv] of [['es', cvEs], ['en', cvEn]] as const) {
  test(`todo el texto del JSON aparece en la página renderizada · ${lang}`, async ({ page }) => {
    await page.goto(`/?lang=${lang}`);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    const text = await pageText(page);
    const missing = jsonStrings(cv).filter((s) => !text.includes(s.replace(/\s+/g, ' ')));
    expect(missing).toEqual([]);
  });
}

test('sin valoraciones, estrellas ni reseñas', async ({ page }) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/?lang=${lang}`);
    const text = (await pageText(page)).toLowerCase();
    // «human review» es texto real del CV; lo prohibido son valoraciones/reseñas/estrellas de ficha de app
    for (const re of [/[★☆]/, /valoraci[oó]n/, /reseñas?/, /\bratings?\b/, /\breviews\b/, /\bestrellas\b/, /\bstars\b/]) expect(text).not.toMatch(re);
  }
});

test('1440×900: nombre, puesto y «Obtener CV» visibles sin scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  for (const loc of [page.locator('.ph-name'), page.locator('.ph-sub'), page.locator('.product-head [data-cta]')]) {
    await expect(loc).toBeInViewport({ ratio: 1 });
  }
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('390×844: sin scroll horizontal en ES y EN', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const lang of ['es', 'en']) {
    await page.goto(`/?lang=${lang}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});

test('datos derivados del JSON: 10+ años (suma real de puestos) y 8 certificaciones obtenidas', async ({ page }) => {
  await page.goto('/');
  const values = await page.locator('.st-value').allTextContents();
  expect(values[0]).toBe('10+');
  expect(values[1]).toBe(String(cvEs.certifications.filter((c) => !/prepar/i.test(c.status)).length));
  await expect(page.locator('.news')).toContainText('Microsoft Azure Administrator (AZ-104)');
  await expect(page.locator('.news')).toContainText('Proyecto destacado');
});

test('«más» despliega el perfil completo', async ({ page }) => {
  await page.goto('/');
  const text = page.locator('#ph-desc-text');
  const collapsed = await text.evaluate((e) => e.getBoundingClientRect().height);
  await page.locator('[data-more]').click();
  await expect(page.locator('[data-more]')).toHaveAttribute('aria-expanded', 'true');
  expect(await text.evaluate((e) => e.getBoundingClientRect().height)).toBeGreaterThan(collapsed);
});

test('el carrusel de vista previa avanza con el botón', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const track = page.locator('#carousel');
  await track.scrollIntoViewIfNeeded();
  await page.locator('[data-carousel="1"]').click();
  await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeGreaterThan(100);
});

test('Información muestra el tamaño real de la web medido en el build', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-bundle-size]')).toHaveText(/^\d+ KB \(JS \+ CSS, gzip\)$/);
});

test('cada app de la estantería abre su sección', async ({ page }) => {
  await page.goto('/');
  for (const [id, title] of [['infra', 'Infraestructura y Azure'], ['terminal', 'Terminal'], ['contact', '¿Hablamos?']]) {
    await page.locator(`.app[data-open="${id}"]`).click();
    await expect(page.locator('#panel-title')).toHaveText(title);
    await page.keyboard.press('Escape');
    await expect(page.locator('.app[data-open="' + id + '"]')).toBeFocused();
  }
});

for (const scheme of ['light', 'dark'] as const) {
  for (const [w, h, n] of [[1440, 900, 'desktop'], [390, 844, 'mobile']] as const) {
    test(`captura portada · ${n} · ${scheme}`, async ({ page }) => {
      test.slow();
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3300);
      await page.evaluate(() => window.skyCycle?.at('19:00'));
      await page.screenshot({ path: `screenshots/product-${n}-${scheme}.png` });
      await page.screenshot({ path: `screenshots/product-${n}-${scheme}-full.png`, fullPage: true });
    });
  }
}
