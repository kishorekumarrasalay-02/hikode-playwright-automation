import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectJobsMore(): Promise<void> {
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

    const selects = await page.locator('select[formcontrolname], select[name]').all();
    for (const sel of selects) {
      const name = await sel.getAttribute('formcontrolname') ?? await sel.getAttribute('name');
      const options = await sel.locator('option').allTextContents();
      console.log(name, options.slice(0, 8));
    }

    await page.goto('https://www.hikode.me/jobs');
    await page.getByRole('button', { name: /manage my postings/i }).click();
    await page.waitForTimeout(2000);
    console.log('My Jobs URL:', page.url());

    const tableText = await page.locator('table, .table').first().innerText().catch(() => 'no table');
    console.log('Table:', tableText.slice(0, 500));

    const editBtn = page.getByRole('button', { name: 'Edit' }).first();
    console.log('Edit count:', await page.getByRole('button', { name: 'Edit' }).count());
    console.log('Back button:', await page.getByRole('button', { name: 'Back' }).count());
    console.log('All Jobs button:', await page.getByRole('button', { name: 'All Jobs' }).count());
  } finally {
    await browser.close();
  }
}

inspectJobsMore().catch(console.error);
