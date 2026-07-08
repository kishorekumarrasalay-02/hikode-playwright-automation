import { chromium } from '@playwright/test';

async function inspectOrganization(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/register');
    await page.locator('#selectRole').selectOption({ label: 'Organization' });
    await page.waitForTimeout(1000);

    const html = await page.getByRole('heading', { name: 'Create Account' }).locator('..').innerHTML();
    console.log(html.slice(0, 3000));
  } finally {
    await browser.close();
  }
}

inspectOrganization().catch(console.error);
