import { test, expect } from '@playwright/test';

test.describe('Movimiento', () => {
  test('con prefers-reduced-motion no hay animaciones en marcha', async ({ page }) => {
    // Lista legible de lo que siga en marcha (si falla, el mensaje dice qué es)
    const running = () =>
      page.evaluate(() =>
        document
          .getAnimations()
          .filter((a) => a.playState === 'running')
          .map((a) => {
            const t = (a.effect as KeyframeEffect).target as Element | null;
            const name = (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty;
            return `${a.constructor.name}:${name} ${t?.tagName}.${t?.getAttribute('class') ?? ''}#${t?.id ?? ''}`;
          }),
      );
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('.hotspot[data-open="infra"]').hover(); // micro-interacción incluida
    await page.waitForTimeout(300);
    expect(await running()).toEqual([]);
    // y todo sigue accesible: el panel abre igual
    await page.locator('.hotspot[data-open="infra"]').click();
    await expect(page.locator('#panel')).toBeVisible();
    await page.waitForTimeout(250); // con movimiento reducido solo quedan fundidos de 150 ms
    expect(await running()).toEqual([]);
  });

  test('sin preferencia, el bucle ambiental está en marcha', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    expect(running).toBeGreaterThan(20);
  });

  test('hover y foco activan la micro-interacción del objeto', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hotspot[data-open="security"]').hover();
    await expect(page.locator('#obj-security')).toHaveClass(/is-active/);
    await page.mouse.move(5, 300);
    await expect(page.locator('#obj-security')).not.toHaveClass(/is-active/);
    await page.locator('.hotspot[data-open="certs"]').focus();
    await expect(page.locator('#obj-certs')).toHaveClass(/is-active/);
  });

  test('el bucle solo anima transform, rotate, opacity o trazo SVG', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    for (const id of ['about', 'infra', 'security', 'ai', 'projects', 'experience', 'certs', 'contact', 'terminal']) {
      await page.locator(`.hotspot[data-open="${id}"]`).hover();
    }
    const props = await page.evaluate(() => {
      const set = new Set<string>();
      // Solo animaciones CSS en bucle; las transiciones del hover (filter) son puntuales
      // (la expansión de la sala va ligada al scroll, no al tiempo: no es parte del bucle)
      const scrollDriven = (x: Animation) => typeof ViewTimeline !== 'undefined' && x.timeline instanceof ViewTimeline;
      for (const a of document.getAnimations().filter((x) => x instanceof CSSAnimation && !scrollDriven(x))) {
        const eff = a.effect as KeyframeEffect | null;
        for (const kf of eff?.getKeyframes() ?? []) {
          for (const k of Object.keys(kf)) if (!['offset', 'easing', 'composite', 'computedOffset'].includes(k)) set.add(k);
        }
      }
      return [...set];
    });
    for (const p of props) expect(['transform', 'rotate', 'opacity', 'strokeDashoffset']).toContain(p);
  });
});
