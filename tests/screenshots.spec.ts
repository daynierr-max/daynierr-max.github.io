// Capturas de revisión visual (escritorio 1440×900 y móvil 375×812) en /screenshots.
import { test } from '@playwright/test';

const sizes = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
];

for (const s of sizes) {
  test(`captura escena + reclutador · ${s.name}`, async ({ page }) => {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await page.waitForTimeout(3600); // deja que la pista inicial desaparezca
    await page.screenshot({ path: `screenshots/scene-${s.name}.png` });
    await page.screenshot({ path: `screenshots/scene-${s.name}-full.png`, fullPage: true });
    await page.locator('.app[data-open="experience"]').click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `screenshots/panel-${s.name}.png` });
    await page.keyboard.press('Escape');
    await page.locator('[data-read]').click();
    await page.screenshot({ path: `screenshots/recruiter-${s.name}.png` });
    await page.screenshot({ path: `screenshots/recruiter-${s.name}-full.png`, fullPage: true });
  });
}
