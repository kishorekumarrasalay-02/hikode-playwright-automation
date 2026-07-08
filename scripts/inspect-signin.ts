import { chromium } from '@playwright/test';

async function inspectLogin(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/login');
    await page.waitForLoadState('networkidle');

    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('formcontrolname');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      console.log({ type, name, id, placeholder });
    }

    console.log('getByLabel Email:', await page.getByLabel('Email address').count());
    console.log('getByLabel Email (partial):', await page.getByLabel(/email/i).count());
    console.log('formcontrolname email:', await page.locator('[formcontrolname="email"]').count());
  } finally {
    await browser.close();
  }
}

inspectLogin().catch(console.error);
