import { test, expect, type Page } from '@playwright/test';

async function openTerminal(page: Page) {
  await page.goto('/');
  await page.locator('.hotspot[data-open="terminal"]').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Comando de terminal')).toBeFocused();
}

async function run(page: Page, cmd: string) {
  await page.keyboard.type(cmd);
  await page.keyboard.press('Enter');
}

test.describe('Terminal (easter egg)', () => {
  test('help, whoami, skills y contact funcionan solo con teclado', async ({ page }) => {
    await openTerminal(page);
    const log = page.locator('.term-log');
    await run(page, 'help');
    await expect(log).toContainText('whoami · skills · contact · cv --pdf');
    await run(page, 'whoami');
    await expect(log).toContainText('Daynier Rodríguez Ruíz');
    await run(page, 'skills');
    await expect(log).toContainText('Cloud (Microsoft Azure');
    await run(page, 'contact');
    await expect(log).toContainText('daynierr@gmail.com');
    await expect(log).toContainText('https://github.com/daynierr-max');
    await run(page, 'sudo rm -rf /');
    await expect(log).toContainText('comando no encontrado');
  });

  test('cv --pdf descarga el CV', async ({ page }) => {
    await openTerminal(page);
    const download = page.waitForEvent('download');
    await run(page, 'cv --pdf');
    expect((await download).suggestedFilename()).toBe('Daynier_Rodriguez_CV2026.pdf');
  });

  test('flecha arriba recupera el historial; clear limpia; exit cierra', async ({ page }) => {
    await openTerminal(page);
    await run(page, 'whoami');
    await page.keyboard.press('ArrowUp');
    await expect(page.getByLabel('Comando de terminal')).toHaveValue('whoami');
    await page.getByLabel('Comando de terminal').fill('');
    await run(page, 'clear');
    await expect(page.locator('.term-log p')).toHaveCount(0);
    await run(page, 'exit');
    await expect(page.locator('#panel')).toBeHidden();
    await expect(page.locator('.hotspot[data-open="terminal"]')).toBeFocused();
  });

  test('la tecla ` abre la terminal y Esc la cierra', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Backquote');
    await expect(page.locator('#panel-title')).toHaveText('Terminal');
    await expect(page.getByLabel('Comando de terminal')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#panel')).toBeHidden();
  });

  test('en inglés responde en inglés', async ({ page }) => {
    await page.goto('/?lang=en');
    await page.locator('.hotspot[data-open="terminal"]').click();
    await expect(page.getByLabel('Terminal command')).toBeFocused();
    await run(page, 'nope');
    await expect(page.locator('.term-log')).toContainText('command not found: nope');
  });
});
