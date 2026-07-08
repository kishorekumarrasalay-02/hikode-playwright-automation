import { type Page, expect } from '@playwright/test';

export class MyJobsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goBack(): Promise<void> {
    const backButton = this.page.getByRole('button', { name: 'Back' });
    if (await backButton.isVisible().catch(() => false)) {
      await backButton.click();
      await this.page.waitForTimeout(1000);
    }

    if (this.page.url().includes('/list-job') || this.page.url().includes('/add-job')) {
      await this.page.goto('/jobs');
    }

    console.log('Went back. URL:', this.page.url());
  }

  async openAllJobsFromList(): Promise<void> {
    await this.page.getByRole('button', { name: 'All Jobs' }).click();
    await expect(this.page).toHaveURL(/\/jobs\/all-jobs/, { timeout: 15_000 });
    console.log('Opened All Jobs:', this.page.url());
  }

  async editJobByTitle(jobTitle: string): Promise<void> {
    const row = this.page.locator('table tbody tr').filter({ hasText: jobTitle }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    await row.getByRole('button', { name: 'Edit' }).click();
    await expect(this.page).toHaveURL(/\/jobs\/add-job/, { timeout: 15_000 });
    console.log('Editing job:', jobTitle);
  }

  async scrollToLastJob(): Promise<void> {
    await this.page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));

      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      window.scrollTo(0, document.body.scrollHeight);
    });

    const rows = this.page.locator('table tbody tr');
    const count = await rows.count();
    console.log(`Scrolled to bottom. Total jobs in list: ${count}`);
    await expect(rows.first()).toBeVisible();
  }
}
