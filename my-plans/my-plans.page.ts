import { type Page, type Locator, expect } from '@playwright/test';
import type { BillingPeriod, PlanTier } from './plans-data';
import { PLAN_TIER_INDEX } from './plans-data';

export class MyPlansPage {
  readonly page: Page;
  readonly viewAvailablePlansButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewAvailablePlansButton = page.getByRole('button', { name: /view available plans/i });
  }

  async openMyPlansTab(): Promise<void> {
    await this.page.getByRole('listitem').filter({ hasText: /(My|Our) Plans/ }).first().click();
    await expect(this.page).toHaveURL(/\/profile\/my-plans/, { timeout: 15_000 });
    console.log('Opened My Plans:', this.page.url());
  }

  async clickViewAvailablePlans(): Promise<void> {
    const viewButton = this.viewAvailablePlansButton.or(
      this.page.getByRole('button', { name: /manage current plan/i }),
    );

    if (!(await viewButton.first().isVisible({ timeout: 5_000 }).catch(() => false))) {
      if (!this.page.url().includes('/profile/my-plans')) {
        await this.page.goto('/profile/my-plans');
        await this.page.waitForLoadState('domcontentloaded');
      }
    }

    await viewButton.first().scrollIntoViewIfNeeded({ timeout: 30_000 });
    await viewButton.first().click();
    await this.page.waitForTimeout(1_500);
    console.log('Opened available plans catalog.');
  }

  async ensurePlansCatalogVisible(): Promise<void> {
    const hasSelectPlan = (await this.page.getByRole('button', { name: 'Select Plan' }).count()) > 0;
    if (hasSelectPlan) {
      return;
    }

    const hasPeriodTab = await this.page
      .getByRole('button', { name: 'Monthly', exact: true })
      .isVisible({ timeout: 3_000 })
      .catch(() => false);

    if (!hasPeriodTab) {
      await this.clickViewAvailablePlans();
    }
  }

  async selectBillingPeriod(period: BillingPeriod): Promise<void> {
    await this.ensurePlansCatalogVisible();
    const periodButton = this.page.getByRole('button', { name: period, exact: true }).or(
      this.page.getByText(period, { exact: true }),
    );
    await periodButton.first().scrollIntoViewIfNeeded();
    await periodButton.first().click();
    await this.page.waitForTimeout(1_000);
    console.log('Selected billing period:', period);
  }

  async selectPlan(tier: PlanTier): Promise<void> {
    const planCard = this.page.locator('.card, [class*="plan"]').filter({ hasText: tier }).first();
    const selectInCard = planCard.getByRole('button', { name: 'Select Plan' });

    if (await selectInCard.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await selectInCard.click();
    } else {
      await this.page.getByRole('button', { name: 'Select Plan' }).nth(PLAN_TIER_INDEX[tier]).click();
    }

    console.log('Clicked Select Plan for:', tier);
  }

  async expectCheckoutPage(): Promise<void> {
    await this.page.waitForURL(/checkout\.stripe\.com|buy\.stripe\.com|stripe/, { timeout: 30_000 }).catch(async () => {
      await expect(this.page.getByText(/HiKode Ltd/i)).toBeVisible({ timeout: 15_000 });
    });
    console.log('On checkout page:', this.page.url());
  }

  async goBackFromCheckout(): Promise<void> {
    const backArrow = this.page
      .locator('a, button')
      .filter({ has: this.page.locator('svg, img') })
      .first();

    if (this.page.url().includes('stripe')) {
      if (await backArrow.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await backArrow.click().catch(() => {});
      } else {
        await this.page.goBack();
      }
    } else {
      await this.page.goBack();
    }

    await this.page.waitForTimeout(1_500);

    if (!this.page.url().includes('/profile/my-plans')) {
      await this.page.goto('https://www.hikode.me/profile/my-plans');
    } else if (!this.page.url().includes('www.hikode.me')) {
      await this.page.goto('https://www.hikode.me/profile/my-plans');
    }

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1_000);
    await expect(this.page).toHaveURL(/hikode\.me\/profile\/my-plans/, { timeout: 20_000 });
    console.log('Returned from checkout:', this.page.url());
  }
}
