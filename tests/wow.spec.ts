// Fases E y F (v2): ilustración, efecto wow y hojas.
import { test, expect, type Page } from '@playwright/test';

const band = (page: Page) => page.locator('.hero-band');

test.describe('Ilustración', () => {
  test('caras con degradado, sombras de contacto y un único filtro de bloom compartido', async ({ page }) => {
    await page.goto('/');
    const info = await page.evaluate(() => ({
      shaded: document.querySelectorAll('.scene-svg polygon[fill="url(#sh-side)"]').length,
      ao: document.querySelectorAll('.scene-svg .ao ellipse[fill="url(#g-ao)"]').length,
      bloomFilters: document.querySelectorAll('.scene-svg filter[id^="f-bloom"]').length,
      bloomUses: document.querySelectorAll('.scene-svg [filter="url(#f-bloom)"]').length,
    }));
    expect(info.shaded).toBeGreaterThanOrEqual(12); // 2 caras por mueble con presencia
    expect(info.ao).toBeGreaterThanOrEqual(6);
    expect(info.bloomFilters).toBe(1);
    expect(info.bloomUses).toBeGreaterThanOrEqual(5);
  });

  test('hotspots de cristal con icono, sin los puntos naranjas', async ({ page }) => {
    await page.goto('/');
    const hs = page.locator('.hotspot');
    await expect(hs).toHaveCount(9);
    for (const h of await hs.all()) {
      await expect(h.locator('.hs-chip svg')).toHaveCount(1);
      expect(await h.evaluate((el) => getComputedStyle(el, '::before').content)).toBe('none');
    }
  });
});

test.describe('Tarjeta protagonista', () => {
  test('se expande con el scroll (animation-timeline: view())', async ({ page }) => {
    await page.goto('/');
    expect(await band(page).evaluate((el) => getComputedStyle(el).animationTimeline)).toContain('view');
    const vw = await page.evaluate(() => document.documentElement.clientWidth);
    await page.evaluate(() => scrollTo(0, 0));
    const w0 = (await band(page).boundingBox())!.width;
    await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect.poll(async () => (await band(page).boundingBox())!.width).toBeGreaterThan(vw - 2);
    expect(w0).toBeLessThan(vw - 20); // al principio es una tarjeta más estrecha
  });

  test('alternativa sin animation-timeline: IntersectionObserver', async ({ page }) => {
    await page.addInitScript(() => {
      const orig = CSS.supports.bind(CSS);
      CSS.supports = ((a: string, b?: string) => (/animation-timeline/.test(a + (b ?? '')) ? false : b ? orig(a, b) : orig(a))) as typeof CSS.supports;
    });
    await page.goto('/');
    await expect(band(page)).toHaveClass(/js-expand/);
    await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(band(page)).toHaveClass(/is-expanded/);
  });

  test('inclinación con el puntero: como mucho 6°, y vuelve a 0 al salir', async ({ page }) => {
    await page.goto('/');
    await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const box = (await band(page).boundingBox())!;
    const vh = page.viewportSize()!.height;
    // dentro de la parte visible de la franja (su borde inferior puede quedar fuera del viewport)
    const top = Math.max(box.y, 60) + 10;
    const bottom = Math.min(box.y + box.height, vh) - 10;
    await page.mouse.move(box.x + 20, top);
    await page.mouse.move(box.x + box.width - 20, bottom, { steps: 4 });
    const tilt = page.locator('.stage-tilt');
    await expect.poll(() => tilt.evaluate((el) => parseFloat(el.style.getPropertyValue('--ry')) || 0)).not.toBe(0);
    const [rx, ry] = await tilt.evaluate((el) => [parseFloat(el.style.getPropertyValue('--rx')), parseFloat(el.style.getPropertyValue('--ry'))]);
    expect(Math.abs(rx)).toBeLessThanOrEqual(6);
    expect(Math.abs(ry)).toBeLessThanOrEqual(6);
    await page.mouse.move(2, 2);
    await expect.poll(() => tilt.evaluate((el) => el.style.getPropertyValue('--ry'))).toBe('0deg');
  });

  test('«Encender la luz» alterna noche y amanecer', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.skyCycle!.at('02:00'));
    const skyTop = () => page.locator('#g-sky stop').first().getAttribute('stop-color');
    const night = await skyTop();
    const sw = page.getByRole('switch', { name: 'Encender la luz' });
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('.scene-svg')).toHaveClass(/lights-on/);
    expect(await page.evaluate(() => window.skyCycle!.mode)).toBe('dawn');
    expect(await skyTop()).not.toBe(night);
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('.scene-svg')).not.toHaveClass(/lights-on/);
    expect(await page.evaluate(() => window.skyCycle!.mode)).toBe('live');
  });
});

test.describe('Scroll con el puntero encima de la sala (regresión)', () => {
  const paused = (page: Page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'paused').length);

  test('el bucle sigue en marcha aunque el puntero quede sobre la sala o sobre un objeto', async ({ page }) => {
    await page.goto('/');
    const [x, y] = [520, 450];
    await page.mouse.move(x, y);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 120);
      await page.waitForTimeout(150);
      await page.mouse.move(x + (i % 2), y); // movimiento sintético de hover tras el scroll
    }
    await page.waitForTimeout(500);
    await expect(band(page)).not.toHaveClass(/is-tilting/);
    expect(await paused(page)).toBe(0);
    const hs = (await page.locator('.hotspot[data-open="infra"]').boundingBox())!;
    await page.mouse.move(hs.x + hs.width / 2, hs.y + hs.height / 2);
    await page.mouse.wheel(0, 40);
    await page.waitForTimeout(400);
    await expect(page.locator('.scene-svg')).not.toHaveClass(/has-lit/);
    expect(await paused(page)).toBe(0);
  });

  test('con movimiento real sí se inclina, y se endereza sola tras 1,2 s quieto', async ({ page }) => {
    await page.goto('/');
    await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(500); // fuera del margen de gracia del scroll
    const box = (await band(page).boundingBox())!;
    await page.mouse.move(box.x + 200, 300);
    await page.mouse.move(box.x + 260, 340, { steps: 4 });
    await expect(band(page)).toHaveClass(/is-tilting/);
    await expect(band(page)).not.toHaveClass(/is-tilting/, { timeout: 3000 });
    expect(await paused(page)).toBe(0);
  });

  test('el scroll endereza al instante una sala inclinada', async ({ page }) => {
    await page.goto('/');
    await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(500);
    const box = (await band(page).boundingBox())!;
    await page.mouse.move(box.x + 200, 300);
    await page.mouse.move(box.x + 260, 340, { steps: 4 });
    await expect(band(page)).toHaveClass(/is-tilting/);
    await page.mouse.wheel(0, 60);
    await expect(band(page)).not.toHaveClass(/is-tilting/, { timeout: 800 });
  });
});

test.describe('Hojas', () => {
  test('escritorio: modal centrado y abierto con View Transition', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __vt: number }).__vt = 0;
      const orig = (document as Document & { startViewTransition: (cb: () => void) => unknown }).startViewTransition.bind(document);
      (document as Document & { startViewTransition: unknown }).startViewTransition = (cb: () => void) => {
        (window as unknown as { __vt: number }).__vt++;
        return orig(cb);
      };
    });
    await page.goto('/');
    await page.locator('.app[data-open="projects"]').click();
    const dlg = page.locator('#panel');
    await expect(dlg).toBeVisible();
    const r = (await dlg.boundingBox())!;
    const vp = page.viewportSize()!;
    expect(Math.abs(r.x + r.width / 2 - vp.width / 2)).toBeLessThan(4);
    expect(Math.abs(r.y + r.height / 2 - vp.height / 2)).toBeLessThan(4);
    expect(r.width).toBeLessThanOrEqual(720);
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(page.locator('.app[data-open="projects"]')).toBeFocused();
    expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBeGreaterThanOrEqual(1);
  });

  test('móvil: hoja inferior a todo el ancho', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('.app[data-open="experience"]').click();
    const dlg = page.locator('#panel');
    await expect(dlg).toBeVisible();
    await expect.poll(async () => Math.round((await dlg.boundingBox())!.y + (await dlg.boundingBox())!.height)).toBe(844);
    expect(Math.round((await dlg.boundingBox())!.width)).toBe(390);
  });

  test('el foco queda atrapado en la hoja (modal) y vuelve al origen', async ({ page }) => {
    await page.goto('/');
    const origin = page.locator('.hotspot[data-open="contact"]');
    await origin.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#panel')).toBeVisible();
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('#panel') || document.activeElement === document.body)).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(origin).toBeFocused();
  });
});

test.describe('Movimiento reducido', () => {
  test('sin parallax, sin expansión y sin transiciones de hoja', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    expect(await band(page).evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const box = (await band(page).boundingBox())!;
    await page.mouse.move(box.x + box.width - 10, box.y + 10, { steps: 3 });
    expect(await page.locator('.stage-tilt').evaluate((el) => el.style.getPropertyValue('--ry'))).toBe('');
    expect(await page.locator('.stage-tilt').evaluate((el) => getComputedStyle(el).transform)).toBe('none');
    await page.locator('.app[data-open="certs"]').click();
    await expect(page.locator('#panel')).toBeVisible();
    await expect(page.locator('#panel')).not.toHaveClass(/vt/);
  });
});

test.describe('Capturas', () => {
  for (const [w, h, n] of [[1440, 900, 'desktop'], [390, 844, 'mobile']] as const) {
    test(`noche, amanecer y hoja abierta · ${n}`, async ({ page }) => {
      test.slow();
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(3300);
      await band(page).evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await page.evaluate(() => window.skyCycle!.at('23:30'));
      await page.waitForTimeout(600);
      await page.screenshot({ path: `screenshots/wow-${n}-noche.png` });
      await page.getByRole('switch', { name: 'Encender la luz' }).click();
      await page.waitForTimeout(2800);
      await page.screenshot({ path: `screenshots/wow-${n}-amanecer.png` });
      await page.locator('.app[data-open="projects"]').click();
      await page.waitForTimeout(900);
      await page.screenshot({ path: `screenshots/wow-${n}-hoja.png` });
    });
  }
});
