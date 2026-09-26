// Fase B (v2): sistema de diseño.
import { test, expect } from '@playwright/test';

test('Inter autoalojada y ninguna petición a dominios externos', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (!['localhost', '127.0.0.1'].includes(u.hostname) && u.protocol.startsWith('http')) external.push(r.url());
  });
  const fonts: string[] = [];
  page.on('response', (r) => r.url().endsWith('.woff2') && fonts.push(r.url()));
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('700 48px "Inter Variable"'))).toBe(true);
  expect(fonts.length).toBeGreaterThan(0);
  expect(fonts.every((f) => f.startsWith('http://localhost:4173/'))).toBe(true);
  await page.goto('/styleguide/');
  await page.evaluate(() => document.fonts.ready);
  expect(external).toEqual([]);
});

test('la CSP sigue intacta (font-src self)', async ({ page }) => {
  await page.goto('/');
  const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(csp).toContain("font-src 'self'");
  expect(csp).toContain("script-src 'self'");
});

test.describe('Tema claro/oscuro', () => {
  test('sigue al sistema', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('el conmutador cambia el tema y se recuerda', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    const btn = page.locator('#theme-toggle');
    await expect(btn).toHaveAccessibleName('Activar tema oscuro');
    await btn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(btn).toHaveAccessibleName('Activar tema claro');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test('la barra es de cristal (backdrop-filter) y fija', async ({ page }) => {
  await page.goto('/');
  const s = await page.locator('.bar').evaluate((el) => {
    const c = getComputedStyle(el);
    return { pos: c.position, bf: c.backdropFilter || (c as unknown as Record<string, string>).webkitBackdropFilter };
  });
  expect(s.pos).toBe('sticky');
  expect(s.bf).toContain('blur(20px)');
  expect(s.bf).toContain('saturate(1.8)');
});

for (const scheme of ['light', 'dark'] as const) {
  test(`captura /styleguide · ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/styleguide/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { name: 'Sistema de diseño' })).toBeVisible();
    await expect(page.locator('.sg-theme')).toHaveCount(2);
    await page.screenshot({ path: `screenshots/styleguide-${scheme}.png`, fullPage: true });
  });
}
