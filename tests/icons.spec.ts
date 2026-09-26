// Fase C (v2): iconos squircle.
import { test, expect } from '@playwright/test';

const IDS = ['infra', 'security', 'ai', 'projects', 'experience', 'certs', 'terminal', 'contact'];

test('los 8 iconos existen a 1024, 180, 64 y 32 px en claro y oscuro', async ({ page }) => {
  await page.goto('/styleguide/#icons');
  for (const theme of ['light', 'dark']) {
    const sheet = page.locator(`[data-sheet="${theme}"]`);
    await expect(sheet.locator('tbody tr')).toHaveCount(8);
    for (const size of [180, 64, 32]) await expect(sheet.locator(`svg.app-icon[width="${size}"]`)).toHaveCount(8);
  }
  await expect(page.locator('.sg-icon1024 svg.app-icon[width="1024"]')).toHaveCount(8);
});

test('squircle real (trazado de superelipse), no border-radius', async ({ page }) => {
  await page.goto('/styleguide/#icons');
  const info = await page.locator('.sg-icon1024 svg.app-icon').first().evaluate((svg) => ({
    clip: svg.querySelector('clipPath path')?.getAttribute('d')?.split('L').length ?? 0,
    radius: getComputedStyle(svg).borderRadius,
  }));
  expect(info.clip).toBeGreaterThan(64); // polilínea de la superelipse
  expect(info.radius).toBe('0px');
});

test('capturas de la hoja de iconos', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/styleguide/#icons');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.sg-shelf-demo').screenshot({ path: 'screenshots/icons-shelf.png' });
  await page.locator('[data-sheet="light"]').screenshot({ path: 'screenshots/icons-sheet-light.png' });
  await page.locator('[data-sheet="dark"]').screenshot({ path: 'screenshots/icons-sheet-dark.png' });
  for (const id of IDS) await page.locator(`.sg-icon1024 [data-icon="${id}"] svg`).screenshot({ path: `screenshots/icon-${id}-1024.png` });
});
