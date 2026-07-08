import { type Page, type TestInfo } from '@playwright/test';
import { captureErrorScreenshot } from './error-screenshot';

function sanitizeLabel(text: string): string {
  return text.replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').slice(0, 60);
}

/** Screenshot only when a visible red error UI is on screen (dialog / danger alert). */
export async function captureRedErrorIfVisible(
  page: Page,
  testInfo?: TestInfo,
): Promise<boolean> {
  const errorDialog = page.getByRole('dialog', { name: 'error message' });
  if (await errorDialog.isVisible({ timeout: 2_000 }).catch(() => false)) {
    const message = (await errorDialog.innerText()).trim();
    await captureErrorScreenshot(page, `red-error-${sanitizeLabel(message)}`, testInfo);
    console.log('Red error dialog captured:', message);
    return true;
  }

  const dangerAlert = page
    .locator('.alert-danger, [role="alert"].alert-danger, .text-danger.fw-bold')
    .filter({ visible: true })
    .first();

  if (await dangerAlert.isVisible({ timeout: 1_000 }).catch(() => false)) {
    const message = (await dangerAlert.innerText()).trim();
    if (message.length > 0) {
      await captureErrorScreenshot(page, `red-alert-${sanitizeLabel(message)}`, testInfo);
      console.log('Red alert captured:', message);
      return true;
    }
  }

  return false;
}

export async function waitAndCaptureRedError(
  page: Page,
  testInfo?: TestInfo,
  waitMs = 1_500,
): Promise<boolean> {
  await page.waitForTimeout(waitMs);
  return captureRedErrorIfVisible(page, testInfo);
}
