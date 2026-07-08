import { chromium } from '@playwright/test';

async function inspectRegister(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/register');
    await page.locator('#selectRole').selectOption({ label: 'Individual' });

    const signupCard = page.getByRole('heading', { name: 'Create Account' }).locator('..');
    const textboxes = signupCard.getByRole('textbox');
    console.log('textbox count:', await textboxes.count());
    for (let i = 0; i < await textboxes.count(); i++) {
      const placeholder = await textboxes.nth(i).getAttribute('placeholder');
      const type = await textboxes.nth(i).getAttribute('type');
      console.log(i, { type, placeholder });
    }
  } finally {
    await browser.close();
  }
}

inspectRegister().catch(console.error);
