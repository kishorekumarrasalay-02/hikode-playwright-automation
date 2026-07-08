import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function testCountryFilter(): Promise<void> {
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

    await page.goto('https://www.hikode.me/jobs/all-jobs');
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'All countries' }).click();
    const search = page.getByPlaceholder('Search country...');
    await search.fill('Norway');
    await page.waitForTimeout(500);
    const items = page.locator('.dropdown-menu:visible .dropdown-item');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      console.log('Item:', (await items.nth(i).innerText()).trim());
    }
    if (count > 1) await items.nth(1).click();

    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'All types' }).click().catch(() => {});
    const jobTypeSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Full-Time' }) });
    if (await jobTypeSelect.count()) await jobTypeSelect.selectOption('Full-Time');

    console.log('Apply count:', await page.getByRole('button', { name: 'Apply Now' }).count());
  } finally {
    await browser.close();
  }
}

testCountryFilter().catch(console.error);
