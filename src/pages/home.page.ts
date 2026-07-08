import { type Page, type Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly joinNowButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.joinNowButton = page.getByRole('button', { name: 'Join now', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissCookieBanner();
  }

  async dismissCookieBanner(): Promise<void> {
    const acceptButton = this.page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click();
    }
  }

  async clickJoinNow(): Promise<void> {
    await this.joinNowButton.first().click();
    await this.page.waitForURL(/\/login/);
  }
}
