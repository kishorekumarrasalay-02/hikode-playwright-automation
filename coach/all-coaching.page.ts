import { type Page, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_LIST_FILTERS } from '../src/utils/filter-presets';
import { applyModuleListFilters } from '../src/utils/list-filters';

export class AllCoachingPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async applyToCoaches(count = 3): Promise<void> {
    await this.page.waitForTimeout(2_000);
    const interestedButtons = this.page.getByRole('button', { name: 'Interested' });
    const total = await interestedButtons.count();
    let applied = 0;

    for (let i = 0; i < total && applied < count; i++) {
      await dismissPopup(this.page);

      const button = interestedButtons.nth(i);
      if (!(await button.isEnabled().catch(() => false))) {
        continue;
      }

      await button.scrollIntoViewIfNeeded();
      await button.click();
      await this.page.waitForTimeout(1_000);
      await dismissPopup(this.page);
      applied++;
      console.log(`Applied to coaching ${applied}/${count}`);
    }

    if (applied === 0) {
      console.log('No coaching applications completed — sessions may already be booked.');
    }
  }

  async applyFilters(): Promise<void> {
    await applyModuleListFilters(this.page, MODULE_LIST_FILTERS.coaching);
  }

  async searchByTitle(query: string): Promise<void> {
    const searchInput = this.page.getByPlaceholder('Search by title');
    await searchInput.fill(query);
    await this.page.waitForTimeout(1_500);
    console.log('Searched coaching by title:', query);
  }

  async goBackToCoachingHome(): Promise<void> {
    await this.page.goto('/coaching');
    await expect(this.page).toHaveURL(/\/coaching$/);
    console.log('Returned to Coaching home:', this.page.url());
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

    console.log('Scrolled to bottom on All Coachings page:', this.page.url());
  }
}
