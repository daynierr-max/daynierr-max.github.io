// Fase A (v2): correcciones rápidas.
import { test, expect, type Page } from '@playwright/test';

const visiblePdfLinks = (page: Page) =>
  page.locator('a[href$=".pdf"]').evaluateAll((els) =>
    els.filter((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && !(el as HTMLElement).closest('[hidden], [inert]');
    }).length,
  );

test.describe('Un solo botón de PDF por vista', () => {
  test('sala, modo reclutador y panel de contacto', async ({ page }) => {
    await page.goto('/');
    expect(await visiblePdfLinks(page)).toBe(1);
    await page.locator('.hotspot[data-open="contact"]').click();
    const inPanel = await page.locator('#panel a[href$=".pdf"]').count();
    expect(inPanel).toBe(0);
    await page.keyboard.press('Escape');
    await page.locator('#recruiter-toggle').click();
    expect(await visiblePdfLinks(page)).toBe(1);
  });
});

test('la credencial de Google Cybersecurity enlaza a Coursera', async ({ page }) => {
  await page.goto('/#cv');
  const link = page.locator('#recruiter-view a[href*="XUCBUQ2O56IQ"]');
  await expect(link).toHaveAttribute('href', 'https://www.coursera.org/account/accomplishments/professional-cert/XUCBUQ2O56IQ');
});

test.describe('Pista inicial en táctil', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('a 390×844 no se solapa con ningún elemento', async ({ page }) => {
    await page.goto('/');
    const hint = page.locator('#hint');
    const box = await hint.boundingBox();
    if (box) {
      // si se mostrara, no puede cubrir ningún elemento interactivo ni texto
      const overlaps = await page.evaluate(({ x, y, width, height }) => {
        const els = [...document.querySelectorAll('button, a, h1, h2, h3, p, .card')].filter((el) => el.id !== 'hint');
        return els.some((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.left < x + width && r.right > x && r.top < y + height && r.bottom > y;
        });
      }, box);
      expect(overlaps).toBe(false);
    } else {
      await expect(hint).toBeHidden();
    }
  });
});

test.describe('Pista en tablet táctil', () => {
  test.use({ viewport: { width: 1024, height: 768 }, isMobile: true, hasTouch: true });

  test('dice «Toca», no «Haz clic»', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hint')).toHaveText(/^Toca/);
  });
});
