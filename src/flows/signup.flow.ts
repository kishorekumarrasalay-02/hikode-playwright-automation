import { type Page, type BrowserContext } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { RegisterPage, type AccountType } from '../pages/register.page';
import { RegisterSuccessPage } from '../pages/register-success.page';
import { EmailVerificationPage } from '../pages/email-verification.page';
import {
  generateSignupData,
  type IndividualSignupData,
  type OrganizationSignupData,
} from '../utils/test-data';

export interface SignupFlowOptions {
  accountType: AccountType;
}

export class SignupFlow {
  private readonly page: Page;
  private readonly context: BrowserContext;
  private readonly homePage: HomePage;
  private readonly loginPage: LoginPage;
  private readonly registerPage: RegisterPage;
  private readonly registerSuccessPage: RegisterSuccessPage;

  constructor(page: Page) {
    this.page = page;
    this.context = page.context();
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.registerPage = new RegisterPage(page);
    this.registerSuccessPage = new RegisterSuccessPage(page);
  }

  async completeIndividualSignup(user: IndividualSignupData): Promise<void> {
    await this.homePage.goto();
    await this.homePage.clickJoinNow();
    await this.loginPage.clickSignUp();
    await this.registerPage.selectAccountType('Individual');
    await this.registerPage.fillIndividualDetails(user);
    await this.registerPage.submitSignup();
  }

  async completeOrganizationSignup(user: OrganizationSignupData): Promise<void> {
    await this.homePage.goto();
    await this.homePage.clickJoinNow();
    await this.loginPage.clickSignUp();
    await this.registerPage.selectAccountType('Organization');
    await this.registerPage.fillOrganizationDetails(user);
    await this.registerPage.submitSignup();
  }

  async assertRegistrationSuccess(): Promise<void> {
    await this.registerSuccessPage.assertRegistrationSuccess();
  }

  async verifyEmailInbox(email: string): Promise<void> {
    const emailPage = await this.context.newPage();
    const emailVerification = new EmailVerificationPage(emailPage);

    try {
      await emailVerification.verifyHikodeAccount(email);
    } finally {
      await emailPage.close();
    }
  }

  async completeIndividualSignupWithEmailVerification(
    user: IndividualSignupData,
  ): Promise<void> {
    console.log('Individual signup with:', user);
    await this.completeIndividualSignup(user);
    await this.assertRegistrationSuccess();
    await this.verifyEmailInbox(user.email);
  }

  async completeOrganizationSignupWithEmailVerification(
    user: OrganizationSignupData,
  ): Promise<void> {
    console.log('Organization signup with:', user);
    await this.completeOrganizationSignup(user);
    await this.assertRegistrationSuccess();
    await this.verifyEmailInbox(user.email);
  }

  async completeSignup({ accountType }: SignupFlowOptions): Promise<void> {
    const user = generateSignupData(accountType);

    if (accountType === 'Organization') {
      await this.completeOrganizationSignupWithEmailVerification(user);
      return;
    }

    await this.completeIndividualSignupWithEmailVerification(user);
  }
}
