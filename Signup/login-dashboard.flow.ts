import { type Page } from '@playwright/test';
import { SignInPage } from './login.page';
import { DashboardPage } from './dashboard.page';
import { LOGIN_CREDENTIALS } from './login-credentials';

export class LoginDashboardFlow {
  private readonly signInPage: SignInPage;
  private readonly dashboardPage: DashboardPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.dashboardPage = new DashboardPage(page);
  }

  async signInAndExploreDashboard(): Promise<void> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);

    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);

    await this.dashboardPage.expectOnDashboard();
    await this.dashboardPage.exploreTopNavigation();
    await this.dashboardPage.returnToDashboard();
    await this.dashboardPage.clickCompleteProfile();
    await this.dashboardPage.exploreViewAllSections();
  }
}
