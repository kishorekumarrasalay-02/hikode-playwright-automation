import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectNav(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/login');
    if (await page.getByRole('button', { name: 'Accept' }).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'Accept' }).click();
    }
    await page.locator('[formcontrolname="email"]').fill(LOGIN_CREDENTIALS.email);
    await page.locator('[formcontrolname="password"]').fill(LOGIN_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/dashboard/);

    await page.goto('https://www.hikode.me/jobs/list-job');
    await page.getByRole('button', { name: 'Back' }).click();
    console.log('Back URL:', page.url());

    await page.getByRole('button', { name: /manage my postings/i }).click();
    console.log('Manage URL:', page.url());

    await page.goto('https://www.hikode.me/jobs');
    await page.getByRole('button', { name: /browse opportunities/i }).click();
    console.log('Browse URL:', page.url());
  } finally {
    await browser.close();
  }
}

inspectNav().catch(console.error);
