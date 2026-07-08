import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectProfileSkills(): Promise<void> {
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

    for (const btn of await page.getByRole('button').all()) {
      const t = (await btn.innerText().catch(() => '')).trim();
      if (/skill|add|save/i.test(t)) console.log('btn:', JSON.stringify(t));
    }

    const addSkillsBtn = page.getByRole('button', { name: /add skills/i });
    console.log('Add Skills visible:', await addSkillsBtn.isVisible().catch(() => false));

    if (await addSkillsBtn.isVisible().catch(() => false)) {
      await addSkillsBtn.click();
      await page.waitForTimeout(500);
    }

    await page.getByPlaceholder('Type a skill').fill('Cypress');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await page.waitForTimeout(2000);

    const dialog = page.getByRole('dialog');
    console.log('Dialog visible:', await dialog.isVisible().catch(() => false));
    if (await dialog.isVisible().catch(() => false)) {
      console.log('Dialog text:', await dialog.innerText());
      for (const btn of await dialog.getByRole('button').all()) {
        const t = (await btn.innerText().catch(() => '')).trim();
        const aria = await btn.getAttribute('aria-label');
        console.log('Dialog btn:', { t, aria });
      }
      const closeX = dialog.locator('button.btn-close, button[aria-label="Close"], .close');
      console.log('X buttons:', await closeX.count());
    }
  } finally {
    await browser.close();
  }
}

inspectProfileSkills().catch(console.error);
