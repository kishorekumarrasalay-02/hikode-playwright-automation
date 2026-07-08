import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectProfileSkillsUi(): Promise<void> {
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

    const skillTexts = await page.locator('text=/skill/i').all();
    for (const el of skillTexts) {
      const t = (await el.innerText().catch(() => '')).trim();
      if (t) console.log('skill text:', JSON.stringify(t));
    }

    for (const el of await page.locator('a, button, span, div').filter({ hasText: /add skill/i }).all()) {
      const tag = await el.evaluate((n) => n.tagName);
      const t = (await el.innerText().catch(() => '')).trim();
      console.log('add skill element:', tag, JSON.stringify(t));
    }

    console.log('skill input visible:', await page.getByPlaceholder('Type a skill').isVisible());
  } finally {
    await browser.close();
  }
}

inspectProfileSkillsUi().catch(console.error);
