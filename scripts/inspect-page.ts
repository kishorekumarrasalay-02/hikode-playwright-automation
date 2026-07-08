import { chromium } from '@playwright/test';

async function inspectPage(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/');
    await page.waitForLoadState('networkidle');

    const joinElements = await page.locator('a, button').filter({ hasText: /join/i }).all();
    for (const el of joinElements) {
      const tag = await el.evaluate((node) => node.tagName);
      const text = await el.innerText().catch(() => '');
      const href = await el.getAttribute('href').catch(() => null);
      console.log({ tag, text: text.trim(), href });
    }

    const headerHtml = await page.locator('header, nav, .navbar').first().innerHTML().catch(() => 'no header');
    console.log('Header snippet:', headerHtml.slice(0, 2000));
  } finally {
    await browser.close();
  }
}

inspectPage().catch(console.error);
