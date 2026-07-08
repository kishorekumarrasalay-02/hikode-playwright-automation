import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectDashboard(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/login');
    const accept = page.getByRole('button', { name: 'Accept' });
    if (await accept.isVisible().catch(() => false)) await accept.click();

    await page.locator('[formcontrolname="email"]').fill(LOGIN_CREDENTIALS.email);
    await page.locator('[formcontrolname="password"]').fill(LOGIN_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    console.log('URL:', page.url());

    const navLinks = await page.locator('nav a, header a, [role="navigation"] a, .nav a').all();
    for (const link of navLinks) {
      const text = (await link.innerText().catch(() => '')).trim();
      const href = await link.getAttribute('href');
      if (text) console.log('Nav:', { text, href });
    }

    const allLinks = await page.locator('a, button').filter({ hasText: /dashboard|jobs|events|coach|contribute|complete profile|view all/i }).all();
    for (const el of allLinks) {
      const tag = await el.evaluate((n) => n.tagName);
      const text = (await el.innerText().catch(() => '')).trim().replace(/\s+/g, ' ');
      const href = await el.getAttribute('href').catch(() => null);
      console.log({ tag, text, href });
    }
  } finally {
    await browser.close();
  }
}

inspectDashboard().catch(console.error);
