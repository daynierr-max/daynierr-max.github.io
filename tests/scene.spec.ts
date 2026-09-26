import { test, expect, type Page } from '@playwright/test';

const SECTIONS = [
  ['about', 'Sobre mí'],
  ['infra', 'Infraestructura y Azure'],
  ['security', 'Ciberseguridad'],
  ['ai', 'IA y MCP'],
  ['projects', 'Proyectos'],
  ['experience', 'Experiencia'],
  ['certs', 'Certificaciones y formación'],
  ['contact', '¿Hablamos?'],
  ['terminal', 'Terminal'],
] as const;

const hotspot = (page: Page, id: string) => page.locator(`.hotspot[data-open="${id}"]`);
const panel = (page: Page) => page.locator('#panel');

test.describe('Hotspots de la escena', () => {
  for (const [id, title] of SECTIONS) {
    test(`«${title}» se abre con clic y se cierra con Esc`, async ({ page }) => {
      await page.goto('/');
      await hotspot(page, id).click();
      await expect(panel(page)).toBeVisible();
      await expect(page.locator('#panel-title')).toHaveText(title);
      await page.keyboard.press('Escape');
      await expect(panel(page)).toBeHidden();
      await expect(hotspot(page, id)).toBeFocused(); // el foco vuelve al objeto
    });

    test(`«${title}» se abre con teclado (Tab + Enter)`, async ({ page }) => {
      await page.goto('/');
      await page.locator('[data-read]').focus();
      // Tab desde la barra superior hasta llegar al hotspot
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        if (await hotspot(page, id).evaluate((el) => el === document.activeElement)) break;
      }
      await expect(hotspot(page, id)).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(panel(page)).toBeVisible();
      await expect(page.locator('#panel-title')).toHaveText(title);
      await page.keyboard.press('Escape');
      await expect(panel(page)).toBeHidden();
    });
  }

  test('cada hotspot es un <button> con aria-label', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('.hotspot');
    await expect(buttons).toHaveCount(SECTIONS.length);
    for (const b of await buttons.all()) {
      expect(await b.evaluate((el) => el.tagName)).toBe('BUTTON');
      await expect(b).toHaveAttribute('aria-label', /.+: .+/);
    }
  });

  test('Espacio también abre el panel y el botón Cerrar lo cierra', async ({ page }) => {
    await page.goto('/');
    await hotspot(page, 'experience').focus();
    await page.keyboard.press('Space');
    await expect(panel(page)).toBeVisible();
    await expect(page.locator('#panel-body')).toContainText('Tunstall Televida');
    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect(panel(page)).toBeHidden();
  });

  test('los paneles muestran datos del CV', async ({ page }) => {
    await page.goto('/');
    await hotspot(page, 'security').click();
    await expect(page.locator('#panel-body')).toContainText('Google Cybersecurity Professional Certificate');
    await page.keyboard.press('Escape');
    await hotspot(page, 'contact').click();
    await expect(page.locator('#panel-body').getByRole('link', { name: 'daynierr@gmail.com' })).toBeVisible();
    await page.keyboard.press('Escape');
    await hotspot(page, 'projects').click();
    await expect(page.locator('#panel-body').getByRole('link', { name: 'tradingview-mcp' })).toHaveAttribute(
      'href',
      'https://github.com/daynierr-max/tradingview-mcp',
    );
  });
});
