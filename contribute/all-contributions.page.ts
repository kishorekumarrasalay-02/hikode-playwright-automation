import { type Page, expect } from '@playwright/test';
import { ALL_CONTRIBUTIONS_WAIT_MS } from './contribution-data';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_LIST_FILTERS } from '../src/utils/filter-presets';
import { applyModuleListFilters } from '../src/utils/list-filters';

export class AllContributionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async joinContributions(count = 3): Promise<void> {
    await this.page.waitForTimeout(2_000);
    const joinButtons = this.page.getByRole('button', { name: 'Join' });
    const total = await joinButtons.count();
    let joined = 0;

    for (let i = 0; i < total && joined < count; i++) {
      await dismissPopup(this.page);

      const button = joinButtons.nth(i);
      if (!(await button.isEnabled().catch(() => false))) {
        continue;
      }

      await button.scrollIntoViewIfNeeded();
      await button.click();
      await this.page.waitForTimeout(1_000);
      await dismissPopup(this.page);
      joined++;
      console.log(`Joined contribution ${joined}/${count}`);
    }

    if (joined === 0) {
      console.log('No contribution joins completed — items may already be joined.');
    }
  }

  async applyFilters(): Promise<void> {
    await applyModuleListFilters(this.page, MODULE_LIST_FILTERS.contributions);
  }

  async searchByTitle(query: string): Promise<void> {
    const searchInput = this.page.getByPlaceholder('Search by title');
    await searchInput.fill(query);
    await this.page.waitForTimeout(1_500);
    console.log('Searched contributions by title:', query);
  }

  async goBackToContributionsHome(): Promise<void> {
    await this.page.goto('/contributions');
    await expect(this.page).toHaveURL(/\/contributions$/);
    console.log('Returned to Contributions home:', this.page.url());
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));

      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      window.scrollTo(0, document.body.scrollHeight);
    });

    console.log('Scrolled to bottom on All Contributions page.');
  }

  async stayOnPage(): Promise<void> {
    await this.page.waitForTimeout(ALL_CONTRIBUTIONS_WAIT_MS);
    await expect(this.page).toHaveURL(/\/contributions\/all-contributions/);
    console.log(`Stayed on All Contributions page for ${ALL_CONTRIBUTIONS_WAIT_MS / 1000} seconds.`);
  }
}
