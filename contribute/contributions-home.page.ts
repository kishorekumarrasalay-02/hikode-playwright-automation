import { type Page, expect } from '@playwright/test';

export class ContributionsHomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openContributionsSection(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('link', { name: 'Contribute', exact: true }).click();
    await expect(this.page).toHaveURL(/\/contributions/, { timeout: 15_000 });
    console.log('Opened Contributions section:', this.page.url());
  }

  async openCreateContribution(): Promise<void> {
    await this.page.getByRole('button', { name: /create contribution/i }).click();
    await expect(this.page).toHaveURL(/\/contributions\/add-contribution/, { timeout: 15_000 });
    console.log('Opened Add Contribution form:', this.page.url());
  }

  async openAddContributionForm(): Promise<void> {
    await this.page.goto('/contributions/add-contribution');
    await expect(this.page).toHaveURL(/\/contributions\/add-contribution/, { timeout: 15_000 });
    console.log('Opened Add Contribution form:', this.page.url());
  }

  async openManageMyContent(): Promise<void> {
    await this.page.getByRole('button', { name: /manage (my|our) content/i }).click();
    await expect(this.page).toHaveURL(/\/contributions\/list-contribution/, { timeout: 15_000 });
    console.log('Opened Manage My Content:', this.page.url());
  }

  async openBrowseContent(): Promise<void> {
    await this.page.getByRole('button', { name: /browse content/i }).click();
    await expect(this.page).toHaveURL(/\/contributions\/all-contributions/, { timeout: 15_000 });
    console.log('Opened Browse Content:', this.page.url());
  }
}
