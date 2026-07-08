import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpLink = page.getByText('SignUp', { exact: true });
  }

  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
    await this.page.waitForURL(/\/register/);
  }
}
