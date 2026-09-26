// Contraste WCAG AA de los tokens de texto en ambos temas (Lighthouse solo mide el claro).
import { test, expect } from '@playwright/test';

for (const theme of ['light', 'dark'] as const) {
  test(`contraste ≥ 4.5:1 en tema ${theme}`, async ({ page }) => {
    await page.goto('/styleguide/');
    const results = await page.evaluate((theme) => {
      const host = document.createElement('div');
      host.dataset.theme = theme;
      document.body.append(host);
      const rgb = (c: string) => c.match(/[\d.]+/g)!.map(Number);
      const lum = ([r, g, b]: number[]) =>
        [r, g, b].map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
      const blend = (fg: number[], bg: number[]) => {
        const a = fg[3] ?? 1;
        return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
      };
      const probe = (color: string, bgs: string[]) => {
        const el = document.createElement('span');
        host.append(el);
        el.style.color = `var(${color})`;
        const fg = rgb(getComputedStyle(el).color);
        let bg = [255, 255, 255];
        for (const b of bgs) {
          el.style.backgroundColor = `var(${b})`;
          bg = blend(rgb(getComputedStyle(el).backgroundColor), bg);
        }
        const [l1, l2] = [lum(blend(fg, bg)), lum(bg)].sort((a, b) => b - a);
        el.remove();
        return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2);
      };
      return {
        'texto/fondo': probe('--text', ['--bg']),
        'secundario/fondo': probe('--text-2', ['--bg']),
        'secundario/superficie': probe('--text-2', ['--surface']),
        'acento/superficie': probe('--accent', ['--surface']),
        'acento/fondo': probe('--accent', ['--bg']),
        'acento/superficie-2': probe('--accent', ['--surface-2']),
        'acento-sobre-relleno/fondo+relleno': probe('--accent-on-fill', ['--bg', '--fill']),
        'acento-sobre-relleno/superficie+relleno': probe('--accent-on-fill', ['--surface', '--fill']),
        'acento-sobre-relleno/acento-suave': probe('--accent-on-fill', ['--surface', '--accent-soft']),
        'on-accent/acento-relleno': probe('--on-accent', ['--accent-fill']),
      };
    }, theme);
    for (const [pair, ratio] of Object.entries(results)) expect(ratio, `${theme} · ${pair}`).toBeGreaterThanOrEqual(4.5);
  });
}
