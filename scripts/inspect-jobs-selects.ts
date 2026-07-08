import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function testCustomDropdown(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  try {
    await page.goto('https://www.hikode.me/login');
    if (await page.getByRole('button', { name: 'Accept' }).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'Accept' }).click();
    }
    await page.locator('[formcontrolname="email"]').fill(LOGIN_CREDENTIALS.email);
    await page.locator('[formcontrolname="password"]').fill(LOGIN_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/dashboard/);
    await page.goto('https://www.hikode.me/jobs/add-job');
    await page.waitForTimeout(2000);

    await page.locator('#currency').click();
    await page.waitForTimeout(500);
    const currencyOptions = await page.locator('.dropdown-menu .dropdown-item, [role="option"], .form-select + * li, .position-relative div').allTextContents();
    console.log('after currency click options sample:', currencyOptions.filter((t) => t.trim()).slice(0, 15));

    const allVisible = await page.locator('div, li, span').filter({ hasText: /USD|INR|EUR|GBP/ }).all();
    for (const el of allVisible.slice(0, 10)) {
      const text = (await el.innerText().catch(() => '')).trim();
      const visible = await el.isVisible();
      if (text) console.log({ text, visible });
    }
  } finally {
    await browser.close();
  }
}

testCustomDropdown().catch(console.error);
