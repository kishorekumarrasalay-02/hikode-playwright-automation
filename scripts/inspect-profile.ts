import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function testProfileForm(): Promise<void> {
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

    await page.locator('img.profile-avatar.shadow-sm').first().click();
    await page.getByRole('link', { name: 'Profile', exact: true }).click();
    await page.waitForURL(/\/profile/);

    const firstName = `Kishore${Date.now().toString().slice(-4)}`;
    const lastName = `Kumar${Date.now().toString().slice(-4)}`;

    await page.locator('[formcontrolname="firstName"]').fill(firstName);
    await page.locator('[formcontrolname="lastName"]').fill(lastName);

    const skills = ['Playwright', 'TypeScript'];
    for (const skill of skills) {
      const existing = page.getByText(skill, { exact: true });
      if (await existing.isVisible().catch(() => false)) continue;
      await page.getByPlaceholder('Type a skill').fill(skill);
      await page.getByRole('button', { name: 'Add', exact: true }).click();
    }

    await page.getByRole('button', { name: 'Save Changes' }).scrollIntoViewIfNeeded();
    console.log('Ready to save with:', firstName, lastName);
    console.log('Save button visible:', await page.getByRole('button', { name: 'Save Changes' }).isVisible());
  } finally {
    await browser.close();
  }
}

testProfileForm().catch(console.error);
