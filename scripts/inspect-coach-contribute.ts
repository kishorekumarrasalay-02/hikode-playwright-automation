import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectCoachContribute(): Promise<void> {
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

    await page.getByRole('navigation').getByRole('link', { name: 'Coach', exact: true }).click();
    await page.waitForTimeout(1500);
    console.log('Coach URL:', page.url());
    for (const btn of await page.getByRole('button').all()) {
      const t = (await btn.innerText().catch(() => '')).trim();
      if (t) console.log('Coach btn:', t);
    }

    await page.getByRole('button', { name: /create coaching/i }).click();
    await page.waitForTimeout(2000);
    console.log('Add coaching URL:', page.url());
    for (const input of await page.locator('input, textarea, select').all()) {
      const name = await input.getAttribute('formcontrolname');
      const type = await input.getAttribute('type');
      const ph = await input.getAttribute('placeholder');
      if (name || ph) console.log({ name, type, ph });
    }

    await page.goto('https://www.hikode.me/coaching');
    await page.getByRole('button', { name: /manage my programs/i }).click();
    await page.waitForTimeout(1500);
    console.log('My coaching URL:', page.url());

    await page.goto('https://www.hikode.me/coaching');
    await page.getByRole('button', { name: /browse coaching/i }).click();
    await page.waitForTimeout(2000);
    console.log('All coaching URL:', page.url());
    for (const btn of await page.getByRole('button').all()) {
      const t = (await btn.innerText().catch(() => '')).trim();
      if (/interested|apply|detail/i.test(t)) console.log('Browse btn:', t);
    }

    await page.getByRole('navigation').getByRole('link', { name: 'Contribute', exact: true }).click();
    await page.waitForTimeout(1500);
    console.log('Contribute URL:', page.url());
    for (const btn of await page.getByRole('button').all()) {
      const t = (await btn.innerText().catch(() => '')).trim();
      if (t) console.log('Contrib btn:', t);
    }

    await page.getByRole('button', { name: /create contribution/i }).click();
    await page.waitForTimeout(2000);
    console.log('Add contribution URL:', page.url());
    for (const input of await page.locator('input, textarea, select').all()) {
      const name = await input.getAttribute('formcontrolname');
      const ph = await input.getAttribute('placeholder');
      if (name || ph) console.log('Contrib field:', { name, ph });
    }
  } finally {
    await browser.close();
  }
}

inspectCoachContribute().catch(console.error);
