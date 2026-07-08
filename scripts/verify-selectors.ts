import { chromium } from '@playwright/test';

async function verifySelectors(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/');
    await page.getByRole('button', { name: 'Join now', exact: true }).first().click();
    await page.waitForURL(/\/login/);

    await page.getByRole('link', { name: 'SignUp' }).click();
    await page.waitForURL(/\/register/);

    await page.getByLabel('Registering As').selectOption({ label: 'Individual' });
    await page.getByLabel('First Name').waitFor({ state: 'visible' });

    await page.getByLabel('First Name').fill('Test');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email', { exact: true }).fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Test@Password123');
    await page.getByLabel('Confirm Password').fill('Test@Password123');

    console.log('All selectors verified. Sign Up button visible:', await page.getByRole('button', { name: 'Sign Up' }).isVisible());
  } finally {
    await browser.close();
  }
}

verifySelectors().catch((error) => {
  console.error(error);
  process.exit(1);
});
