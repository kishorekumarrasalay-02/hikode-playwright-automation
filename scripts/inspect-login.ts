import { chromium } from '@playwright/test';

async function inspectLogin(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/login');
    await page.waitForLoadState('networkidle');

    const elements = await page.locator('a, button, span').filter({ hasText: /sign\s*up/i }).all();
    for (const el of elements) {
      const tag = await el.evaluate((node) => node.tagName);
      const text = await el.innerText().catch(() => '');
      const href = await el.getAttribute('href').catch(() => null);
      const role = await el.getAttribute('role').catch(() => null);
      console.log({ tag, text: text.trim(), href, role });
    }

    const html = await page.locator('body').innerHTML();
    const signupIdx = html.toLowerCase().indexOf('signup');
    console.log('Signup context:', html.slice(Math.max(0, signupIdx - 200), signupIdx + 200));
  } finally {
    await browser.close();
  }
}

inspectLogin().catch(console.error);
