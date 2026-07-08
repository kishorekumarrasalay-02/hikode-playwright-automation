import { type Page, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Profile' }).click();
    await this.page.waitForTimeout(800);

    const logoutLink = this.page
      .getByRole('link', { name: /logout|sign out|log out/i })
      .or(this.page.getByRole('button', { name: /logout|sign out|log out/i }))
      .or(this.page.getByText(/logout|sign out|log out/i));

    if (await logoutLink.first().isVisible({ timeout: 3_000 }).catch(() => false)) {
      await logoutLink.first().click();
    } else {
      await this.page.goto('/logout');
    }

    await expect(this.page).toHaveURL(/\/login/, { timeout: 20_000 });
    console.log('Logged out. URL:', this.page.url());
  }
}
