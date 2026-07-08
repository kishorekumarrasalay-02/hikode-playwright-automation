import { chromium } from '@playwright/test';

async function inspectSuccessPage(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/register');
    await page.locator('#selectRole').selectOption({ label: 'Individual' });
    await page.locator('[formcontrolname="firstName"]').fill('Test');
    await page.locator('[formcontrolname="lastName"]').fill('User');
    await page.locator('[formcontrolname="email"]').fill(`test${Date.now()}@example.com`);
    await page.locator('[formcontrolname="password"]').fill('HiKode@Test123');
    await page.locator('[formcontrolname="confirmPassword"]').fill('HiKode@Test123');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await page.waitForTimeout(5000);

    console.log('URL:', page.url());
    const text = await page.locator('main, body').innerText();
    console.log('Page text:', text.slice(0, 1500));
  } finally {
    await browser.close();
  }
}

inspectSuccessPage().catch(console.error);
