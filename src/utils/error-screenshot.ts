import fs from 'node:fs';
import path from 'node:path';
import { type Page, type TestInfo } from '@playwright/test';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-results', 'error-screenshots');

function sanitizeLabel(label: string): string {
  return label.replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').slice(0, 80);
}

export async function captureErrorScreenshot(
  page: Page,
  label: string,
  testInfo?: TestInfo,
): Promise<string> {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const testSlug = testInfo ? sanitizeLabel(testInfo.title) : 'runtime';
  const fileName = `${timestamp}-${testSlug}-${sanitizeLabel(label)}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);

  try {
    await page.screenshot({ path: filePath, fullPage: true });
    console.log('Error screenshot captured:', filePath);

    if (testInfo) {
      await testInfo.attach(`error-${sanitizeLabel(label)}`, {
        path: filePath,
        contentType: 'image/png',
      });
    }
  } catch (error) {
    console.log('Failed to capture error screenshot:', error);
  }

  return filePath;
}
