import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function mapTabs(): Promise<void> {
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

    await page.locator('img.profile-avatar.shadow-sm').first().click();
    await page.getByRole('link', { name: 'Profile', exact: true }).click();
    await page.waitForURL(/\/profile/);

    const tabs = ['My Profile', 'My Circle', 'My Plans', 'My Choices', 'My Activities', 'My Messages', 'My Notifications'];
    for (const tab of tabs) {
      await page.locator('a').filter({ hasText: new RegExp(`^${tab}$`) }).click();
      await page.waitForTimeout(1000);
      console.log(tab, '->', page.url());
    }
  } finally {
    await browser.close();
  }
}

mapTabs().catch(console.error);
