import { type Page, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_LIST_FILTERS } from '../src/utils/filter-presets';
import { applyModuleListFilters } from '../src/utils/list-filters';

export class AllJobsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async applyToJobs(count = 3): Promise<void> {
    await this.page.waitForTimeout(2_000);
    const applyButtons = this.page.getByRole('button', { name: 'Apply Now' });
    const total = await applyButtons.count();
    let applied = 0;

    for (let i = 0; i < total && applied < count; i++) {
      await dismissPopup(this.page);

      const button = applyButtons.nth(i);
      if (!(await button.isEnabled().catch(() => false))) {
        continue;
      }

      await button.scrollIntoViewIfNeeded();
      await button.click();
      await this.page.waitForTimeout(1_000);
      await dismissPopup(this.page);
      applied++;
      console.log(`Applied to job ${applied}/${count}`);
    }

    if (applied === 0) {
      console.log('No job applications completed — posts may already be applied or unavailable.');
    }
  }

  async applyFilters(): Promise<void> {
    await applyModuleListFilters(this.page, MODULE_LIST_FILTERS.jobs);
  }

  async resetFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'All countries', exact: true }).click();
    const countryMenu = this.page.locator('.dropdown-menu').filter({ visible: true }).last();
    await countryMenu.locator('.dropdown-item').filter({ hasText: 'All countries' }).first().click();
    await this.page.waitForTimeout(500);
  }

  async goBackToJobsHome(): Promise<void> {
    await this.page.goto('/jobs');
    await expect(this.page).toHaveURL(/\/jobs$/);
    console.log('Returned to Jobs home:', this.page.url());
  }

  async scrollToBottomAndVerify(): Promise<void> {
    await this.page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));

      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      window.scrollTo(0, document.body.scrollHeight);
    });

    console.log('Scrolled to bottom on All Jobs page:', this.page.url());
  }
}
