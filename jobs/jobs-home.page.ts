import { type Page, expect } from '@playwright/test';

export class JobsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openJobsSection(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('link', { name: 'Jobs', exact: true }).click();
    await expect(this.page).toHaveURL(/\/jobs/, { timeout: 15_000 });
    console.log('Opened Jobs section:', this.page.url());
  }

  async openCreateJobPosting(): Promise<void> {
    await this.page.getByRole('button', { name: /create job posting/i }).click();
    await expect(this.page).toHaveURL(/\/jobs\/add-job/, { timeout: 15_000 });
    console.log('Opened Add Job form:', this.page.url());
  }

  async openManageMyPostings(): Promise<void> {
    await this.page.getByRole('button', { name: /manage (my|our) postings/i }).click();
    await expect(this.page).toHaveURL(/\/jobs\/list-job/, { timeout: 15_000 });
    console.log('Opened Manage My Postings:', this.page.url());
  }

  async openBrowseOpportunities(): Promise<void> {
    await this.page.getByRole('button', { name: /browse opportunities/i }).click();
    await expect(this.page).toHaveURL(/\/jobs\/all-jobs/, { timeout: 15_000 });
    console.log('Opened Browse Opportunities:', this.page.url());
  }
}
