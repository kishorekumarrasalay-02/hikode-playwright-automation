import { type Page, type Locator } from '@playwright/test';
import type {
  IndividualSignupData,
  OrganizationSignupData,
} from '../utils/test-data';

export type AccountType = 'Individual' | 'Organization';

export class RegisterPage {
  readonly page: Page;
  readonly registeringAsSelect: Locator;
  readonly signupForm: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly organizationNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.registeringAsSelect = page.locator('#selectRole');
    this.signupForm = page.getByRole('heading', { name: 'Create Account' }).locator('..').locator('form');
    this.firstNameInput = this.signupForm.locator('[formcontrolname="firstName"]');
    this.lastNameInput = this.signupForm.locator('[formcontrolname="lastName"]');
    this.organizationNameInput = this.signupForm.locator('[formcontrolname="organisationName"]');
    this.emailInput = this.signupForm.locator('[formcontrolname="email"]');
    this.passwordInput = this.signupForm.locator('[formcontrolname="password"]');
    this.confirmPasswordInput = this.signupForm.locator('[formcontrolname="confirmPassword"]');
    this.signUpButton = this.signupForm.getByRole('button', { name: 'Sign Up' });
  }

  async selectAccountType(accountType: AccountType): Promise<void> {
    await this.registeringAsSelect.selectOption({ label: accountType });

    if (accountType === 'Organization') {
      await this.organizationNameInput.waitFor({ state: 'visible' });
      return;
    }

    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async fillIndividualDetails(details: IndividualSignupData): Promise<void> {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.confirmPassword);
  }

  async fillOrganizationDetails(details: OrganizationSignupData): Promise<void> {
    await this.organizationNameInput.fill(details.organizationName);
    await this.emailInput.fill(details.email);
    await this.passwordInput.fill(details.password);
    await this.confirmPasswordInput.fill(details.confirmPassword);
  }

  async submitSignup(): Promise<void> {
    await this.signUpButton.click();
  }
}
