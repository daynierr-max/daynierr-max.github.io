import { test, expect } from '@playwright/test';

test.describe('Móvil (375 px)', () => {
  test('sin scroll horizontal en la escena, los paneles ni el modo reclutador', async ({ page }) => {
    const noHScroll = () =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    await page.goto('/');
    expect(await noHScroll()).toBe(true);
    await page.locator('.app[data-open="projects"]').click();
    await expect(page.locator('#panel')).toBeVisible();
    expect(await noHScroll()).toBe(true);
    await page.keyboard.press('Escape');
    await page.locator('[data-read]').click();
    expect(await noHScroll()).toBe(true);
    await page.locator('#lang-toggle').click();
    expect(await noHScroll()).toBe(true);
  });

  test('los hotspots se sustituyen por la estantería de 8 apps', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hotspots')).toBeHidden();
    const apps = page.locator('.app');
    await expect(apps).toHaveCount(8);
    await apps.first().click();
    await expect(page.locator('#panel-title')).toHaveText('Infraestructura y Azure');
    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect(page.locator('#panel')).toBeHidden();
  });

  test('Modo reclutador y PDF visibles y funcionando', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Leer ahora' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Obtener CV' }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Leer ahora' }).click();
    await expect(page.locator('#recruiter-view')).toBeVisible();
  });
});
