import { type Page, expect } from '@playwright/test';

export const REGISTRATION_SUCCESS_MESSAGES = {
  heading: 'Registration Successful!',
  thankYou: 'Thank you for registering with HIKODE.',
  checkEmail: 'Please check your email for a verification link to activate your account.',
  spamFolder: 'If you do not see the email, please check your spam or junk folder.',
} as const;

export class RegisterSuccessPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async assertRegistrationSuccess(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: REGISTRATION_SUCCESS_MESSAGES.heading }),
    ).toBeVisible({ timeout: 20_000 });

    await expect(this.page.getByText(REGISTRATION_SUCCESS_MESSAGES.thankYou)).toBeVisible();
    await expect(this.page.getByText(REGISTRATION_SUCCESS_MESSAGES.checkEmail)).toBeVisible();
    await expect(this.page.getByText(REGISTRATION_SUCCESS_MESSAGES.spamFolder)).toBeVisible();

    console.log('Registration success messages verified.');
  }
}
