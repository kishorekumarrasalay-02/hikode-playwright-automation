import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function checkNav(): Promise<void> {
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

    console.log('navigation role:', await page.getByRole('navigation').count());
    console.log('nav Dashboard in navigation:', await page.getByRole('navigation').getByRole('link', { name: 'Dashboard' }).count());
    console.log('nav Dashboard anywhere:', await page.getByRole('link', { name: 'Dashboard', exact: true }).count());
  } finally {
    await browser.close();
  }
}

checkNav().catch(console.error);
