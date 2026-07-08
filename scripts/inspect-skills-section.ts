import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

async function inspectSkillsSection(): Promise<void> {
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

    const skillsSection = page.locator('text=My Skills').locator('..');
    console.log('Section HTML snippet:', (await skillsSection.innerHTML()).slice(0, 1500));

    const icons = skillsSection.locator('button, a, i, svg, [role="button"]');
    console.log('Interactive in section:', await icons.count());
    for (const el of await icons.all()) {
      const tag = await el.evaluate((n) => n.tagName);
      const t = (await el.innerText().catch(() => '')).trim();
      const cls = await el.getAttribute('class');
      console.log({ tag, t, cls });
    }
  } finally {
    await browser.close();
  }
}

inspectSkillsSection().catch(console.error);
