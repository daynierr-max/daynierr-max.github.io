// Escena v2: avatar, taza, luz de la ventana, zamioculca, hover iluminado, gota y ciclo 24 h.
import { test, expect } from '@playwright/test';

test.describe('Escena v2', () => {
  test('avatar con gorra, barba y auriculares; la planta antigua ya no está', async ({ page }) => {
    await page.goto('/');
    const head = page.locator('.scene-svg .head-inner');
    await expect(head.locator('path[fill="url(#tf-cap)"]')).toHaveCount(1);
    await expect(head.locator('path[fill="#2b1a10"]').first()).toBeAttached(); // barba
    await expect(page.locator('.scene-svg .avatar .torso path[fill="url(#tf-shirt)"]')).toHaveCount(1);
    await expect(page.locator('.scene-svg g.plant')).toHaveCount(0);
    await expect(page.locator('.scene-svg .zz-plant .zz-sway')).toHaveCount(1);
  });

  test('taza a la derecha del ratón con vapor', async ({ page }) => {
    await page.goto('/');
    const mug = await page.locator('#obj-about polygon[fill="#ded3c1"]').first().boundingBox();
    const steam = await page.locator('#obj-about .steam').boundingBox();
    expect(mug && steam).toBeTruthy();
    expect(Math.abs(steam!.x + steam!.width / 2 - (mug!.x + mug!.width / 2))).toBeLessThan(12);
    expect(steam!.y).toBeLessThan(mug!.y);
  });

  test('la mancha de luz se pinta encima de la alfombra y el haz tras la estantería', async ({ page }) => {
    await page.goto('/');
    const order = await page.evaluate(() => {
      const layer = document.querySelector('.floor-layer')!;
      const rug = layer.firstElementChild!;
      const patch = layer.querySelector('.beam-patch-wrap')!;
      const aboutAfterLayer = layer.nextElementSibling?.id === 'obj-about';
      const kids = [...document.querySelector('.scene-svg')!.children].map((e) => e.id || e.getAttribute('class'));
      return {
        patchAfterRug: !!(rug.compareDocumentPosition(patch) & Node.DOCUMENT_POSITION_FOLLOWING) && aboutAfterLayer,
        beamAfterShelf: kids.indexOf('beam') === kids.indexOf('obj-experience') + 1,
        noOldFloor: !document.querySelector('.beam-floor'),
      };
    });
    expect(order).toEqual({ patchAfterRug: true, beamAfterShelf: true, noOldFloor: true });
  });

  test('hover: sin recuadro, el objeto se ilumina y el resto se atenúa', async ({ page }) => {
    await page.goto('/');
    const hs = page.locator('.hotspot[data-open="infra"]');
    await hs.hover();
    await expect(page.locator('.scene-svg')).toHaveClass(/has-lit/);
    await expect(page.locator('#obj-infra')).toHaveClass(/is-lit/);
    await expect(hs).toHaveCSS('box-shadow', 'none');
    await expect(hs).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.mouse.move(5, 300);
    await expect(page.locator('.scene-svg')).not.toHaveClass(/has-lit/);
    // con teclado también se ilumina (foco visible) y aparece la etiqueta
    await hs.focus();
    await expect(page.locator('#obj-infra')).toHaveClass(/is-lit/);
  });

  test('clic en un objeto reproduce la gota (Web Audio)', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __blips: number }).__blips = 0;
      const orig = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function () {
        (window as unknown as { __blips: number }).__blips++;
        return orig.call(this);
      };
    });
    await page.goto('/');
    await page.locator('.hotspot[data-open="certs"]').click();
    expect(await page.evaluate(() => (window as unknown as { __blips: number }).__blips)).toBe(2);
  });

  test('ciclo 24 h: noche con estrellas y sin rayo; tarde con rayo por la ventana oeste', async ({ page }) => {
    await page.goto('/');
    const state = () =>
      page.evaluate(() => ({
        stars: +getComputedStyle(document.querySelector('.scene-svg .stars')!).opacity,
        beam: +(document.querySelector<SVGGElement>('.beam-sun')!.style.opacity || 0),
        patchHidden: document.querySelector<SVGGElement>('.beam-patch-wrap')!.style.display === 'none',
      }));
    await page.evaluate(() => window.skyCycle!.at('02:00'));
    let s = await state();
    expect(s.stars).toBeGreaterThan(0.9);
    expect(s.beam).toBe(0);
    expect(s.patchHidden).toBe(true);
    await page.evaluate(() => window.skyCycle!.at('10:00')); // sol al este: no entra por la ventana oeste
    expect((await state()).beam).toBeLessThan(0.01);
    const pos = await page.evaluate(() => window.skyCycle!.at('18:30')); // tarde: sol al oeste
    expect(pos.az).toBeGreaterThan(230);
    s = await state();
    expect(s.beam).toBeGreaterThan(0.3);
    expect(s.stars).toBe(0);
    await page.evaluate(() => window.skyCycle!.live());
    expect(await page.evaluate(() => window.skyCycle!.mode)).toBe('live');
  });

  test('el ciclo sobrevive al cambio de idioma sin duplicar la ventana', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lang-toggle').click();
    await expect(page.locator('#win-clip')).toHaveCount(1);
    await expect(page.locator('.scene-svg .stars')).toHaveCount(1);
    await page.evaluate(() => window.skyCycle!.at('02:00'));
    expect(+(await page.locator('.scene-svg .stars').evaluate((e) => getComputedStyle(e).opacity))).toBeGreaterThan(0.9);
  });
});
