import { test, expect } from '@playwright/test';

test('sin errores de consola (CSP incluida) al cargar e interactuar', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('.hotspot[data-open="terminal"]').click();
  await page.keyboard.type('whoami');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Escape');
  await page.locator('#lang-toggle').click();
  await page.locator('[data-read]').click();
  expect(errors).toEqual([]);
});

test('SEO: título, descripción, Open Graph y schema.org/Person', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Daynier Rodríguez/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Azure/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://daynierr-max.github.io/og.png');
  expect((await page.request.get('/og.png')).status()).toBe(200);
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? '{}');
  expect(ld['@type']).toBe('Person');
  expect(ld.name).toBe('Daynier Rodríguez Ruíz');
  expect(JSON.stringify(ld)).not.toContain('634'); // sin teléfono
});

test('el contenido está prerenderizado en el HTML (sin depender del JS)', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('Tunstall Televida');
  expect(html).toContain('class="hotspot"');
  expect(html).not.toContain('634 203');
});
