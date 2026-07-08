import { test as base, expect } from '@playwright/test';
import { captureErrorScreenshot } from '../utils/error-screenshot';
import { captureRedErrorIfVisible } from '../utils/red-error-capture';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    page.on('response', async (response) => {
      if (response.status() >= 400 && response.url().includes('/api/')) {
        console.log('HTTP error:', response.status(), response.url());
        await page.waitForTimeout(800);
        await captureRedErrorIfVisible(page, testInfo);
      }
    });

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      await captureRedErrorIfVisible(page, testInfo);
      await captureErrorScreenshot(page, 'test-failure', testInfo);
    }
  },
});

export { expect };
