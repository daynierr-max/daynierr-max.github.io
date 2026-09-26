import { test, expect } from '@playwright/test';

test('la página carga', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Daynier');
});
