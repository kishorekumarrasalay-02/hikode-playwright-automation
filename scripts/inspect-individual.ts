import { chromium } from '@playwright/test';

async function inspectIndividual(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/register');
    await page.locator('#selectRole').selectOption({ label: 'Individual' });
    await page.waitForTimeout(1000);

    const html = await page.getByRole('heading', { name: 'Create Account' }).locator('..').innerHTML();
    console.log(html.slice(0, 3000));
  } finally {
    await browser.close();
  }
}

inspectIndividual().catch(console.error);
