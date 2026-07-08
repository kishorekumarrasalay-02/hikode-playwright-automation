import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { ProfilePage } from '../profile/profile.page';
import { MyPlansPage } from './my-plans.page';
import { BILLING_PERIODS, PLAN_TIERS, type BillingPeriod, type PlanTier } from './plans-data';

export type PlanCheckoutAttempt = {
  period: BillingPeriod;
  tier: PlanTier;
};

export class MyPlansFlow {
  private readonly signInPage: SignInPage;
  private readonly profilePage: ProfilePage;
  private readonly myPlansPage: MyPlansPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.profilePage = new ProfilePage(page);
    this.myPlansPage = new MyPlansPage(page);
  }

  async exploreAllPlanCheckouts(): Promise<PlanCheckoutAttempt[]> {
    const attempts: PlanCheckoutAttempt[] = [];

    await this.myPlansPage.clickViewAvailablePlans();

    for (const period of BILLING_PERIODS) {
      await this.myPlansPage.selectBillingPeriod(period);

      for (const tier of PLAN_TIERS) {
        await this.myPlansPage.selectPlan(tier);
        await this.myPlansPage.expectCheckoutPage();
        await this.myPlansPage.goBackFromCheckout();
        await this.myPlansPage.ensurePlansCatalogVisible();
        await this.myPlansPage.selectBillingPeriod(period);
        attempts.push({ period, tier });
        console.log('Explored checkout:', { period, tier });
      }
    }

    return attempts;
  }

  async manageMyPlans(): Promise<{ attempts: PlanCheckoutAttempt[] }> {
    await this.profilePage.openFromProfileLogo();
    await this.myPlansPage.openMyPlansTab();
    const attempts = await this.exploreAllPlanCheckouts();
    console.log('My Plans flow completed. Total checkouts explored:', attempts.length);
    return { attempts };
  }

  async signInAndManageMyPlans(): Promise<{ attempts: PlanCheckoutAttempt[] }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });
    return this.manageMyPlans();
  }
}
