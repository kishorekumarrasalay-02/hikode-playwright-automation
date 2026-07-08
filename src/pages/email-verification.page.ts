import { type Page, expect } from '@playwright/test';
import { getEmailCredentials } from '../utils/email-config';

export class EmailVerificationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginToWebmail(email: string): Promise<void> {
    const { webmailUrl, password } = getEmailCredentials();

    await this.page.goto(webmailUrl);
    await this.page.waitForLoadState('domcontentloaded');

    const emailInput = this.page.locator('input[type="email"], input[name="loginfmt"]').first();
    if (await emailInput.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await emailInput.fill(email);
      await this.page.getByRole('button', { name: /next|sign in/i }).first().click();
    }

    const passwordInput = this.page.locator('input[type="password"], input[name="passwd"]').first();
    await passwordInput.waitFor({ state: 'visible', timeout: 15_000 });
    await passwordInput.fill(password);
    await this.page.getByRole('button', { name: /sign in|next/i }).first().click();

    const staySignedInNo = this.page.getByRole('button', { name: /no/i });
    if (await staySignedInNo.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await staySignedInNo.click();
    }

    await this.page.waitForLoadState('networkidle');
    console.log('Logged in to webmail.');
  }

  async openLatestHikodeEmail(): Promise<void> {
    const searchInput = this.page.locator(
      'input[aria-label*="Search"], input[placeholder*="Search"]',
    ).first();

    if (await searchInput.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await searchInput.fill('HiKode');
      await this.page.keyboard.press('Enter');
      await this.page.waitForTimeout(3_000);
    }

    const hikodeEmail = this.page
      .locator('[role="option"], [role="listitem"], .customScrollBar div[tabindex="0"]')
      .filter({ hasText: /hikode|verify|registration/i })
      .first();

    await hikodeEmail.waitFor({ state: 'visible', timeout: 60_000 });
    await hikodeEmail.click();
    console.log('Opened latest HiKode verification email.');
  }

  async clickVerifyEmailLink(): Promise<void> {
    const iframeLink = this.page.frameLocator('iframe').getByRole('link', { name: /verify/i });
    const pageLink = this.page.getByRole('link', { name: /verify/i });
    const pageButton = this.page.getByRole('button', { name: /verify/i });
    const verifyLink = iframeLink.or(pageLink).or(pageButton).first();

    const [verificationPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      verifyLink.click(),
    ]);

    await verificationPage.waitForLoadState('domcontentloaded');
    console.log('Clicked verify email link. URL:', verificationPage.url());

    await expect(verificationPage).toHaveURL(/hikode\.me/i, { timeout: 20_000 });
    console.log('Email verification link opened successfully.');
  }

  async verifyHikodeAccount(email: string): Promise<void> {
    await this.loginToWebmail(email);
    await this.openLatestHikodeEmail();
    await this.clickVerifyEmailLink();
  }
}
