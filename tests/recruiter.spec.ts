import { test, expect } from '@playwright/test';

test.describe('Carga inicial', () => {
  test('Modo reclutador y PDF visibles desde la carga', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Modo reclutador' })).toBeVisible();
    const pdf = page.getByRole('link', { name: 'Descargar PDF' });
    await expect(pdf).toBeVisible();
    await expect(pdf).toHaveAttribute('href', '/Daynier_Rodriguez_CV2026.pdf');
    const res = await page.request.get('/Daynier_Rodriguez_CV2026.pdf');
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('pdf');
  });

  test('la pista inicial aparece y desaparece sola en ~3 s', async ({ page }) => {
    await page.goto('/');
    const hint = page.locator('#hint');
    await expect(hint).toHaveText(/Haz clic en los objetos/);
    await expect(hint).not.toHaveClass(/is-hidden/);
    await expect(hint).toHaveClass(/is-hidden/, { timeout: 5000 });
  });
});

test.describe('Modo reclutador', () => {
  test('un clic muestra el CV clásico y otro vuelve a la sala', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#recruiter-toggle');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#recruiter-view')).toBeVisible();
    await expect(page.locator('#scene-view')).toBeHidden();
    await expect(page).toHaveURL(/#cv$/);
    const sheet = page.locator('#recruiter-view');
    for (const h of ['Perfil profesional', 'Experiencia profesional', 'Habilidades técnicas', 'Proyectos', 'Idiomas']) {
      await expect(sheet.getByRole('heading', { name: h, level: 2 })).toBeVisible();
    }
    await expect(sheet).toContainText('Tunstall Televida');
    await expect(sheet).toContainText('ETECSA');
    await expect(sheet).not.toContainText('634'); // el teléfono no se publica en la web
    await toggle.click();
    await expect(page.locator('#scene-view')).toBeVisible();
    await expect(toggle).toHaveText('Modo reclutador');
  });

  test('se puede enlazar directamente con #cv', async ({ page }) => {
    await page.goto('/#cv');
    await expect(page.locator('#recruiter-view')).toBeVisible();
  });

  test('funciona con teclado', async ({ page }) => {
    await page.goto('/');
    await page.locator('#recruiter-toggle').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#recruiter-view')).toBeVisible();
  });
});

test.describe('Idioma', () => {
  test('el selector ES/EN cambia los textos y se recuerda', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'Recruiter mode' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Download PDF' })).toBeVisible();
    await expect(page.locator('#lang-toggle')).toBeFocused();
    await page.locator('#recruiter-toggle').click();
    await expect(page.locator('#recruiter-view')).toContainText('Professional experience');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('#recruiter-view')).toContainText('Experiencia profesional');
  });
});
