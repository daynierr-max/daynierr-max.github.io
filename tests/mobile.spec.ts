import { test, expect } from '@playwright/test';

test.describe('Móvil (375 px)', () => {
  test('sin scroll horizontal en la escena, los paneles ni el modo reclutador', async ({ page }) => {
    const noHScroll = () =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
    await page.goto('/');
    expect(await noHScroll()).toBe(true);
    await page.locator('.card[data-open="projects"]').click();
    await expect(page.locator('#panel')).toBeVisible();
    expect(await noHScroll()).toBe(true);
    await page.keyboard.press('Escape');
    await page.locator('#recruiter-toggle').click();
    expect(await noHScroll()).toBe(true);
    await page.locator('#lang-toggle').click();
    expect(await noHScroll()).toBe(true);
  });

  test('la escena se convierte en tarjetas-objeto que abren cada sección', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hotspots')).toBeHidden();
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(9);
    await cards.first().click();
    await expect(page.locator('#panel-title')).toHaveText('Sobre mí');
    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect(page.locator('#panel')).toBeHidden();
  });

  test('Modo reclutador y PDF visibles y funcionando', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Leer ahora' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Descargar CV' })).toBeVisible();
    await page.getByRole('button', { name: 'Leer ahora' }).click();
    await expect(page.locator('#recruiter-view')).toBeVisible();
  });
});
