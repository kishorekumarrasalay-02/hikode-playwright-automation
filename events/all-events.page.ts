import { type Page, expect } from '@playwright/test';
import { ALL_EVENTS_WAIT_MS } from './event-data';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_LIST_FILTERS } from '../src/utils/filter-presets';
import { applyModuleListFilters } from '../src/utils/list-filters';

export class AllEventsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async registerForEvents(count = 3): Promise<void> {
    await this.page.waitForTimeout(2_000);
    const registerButtons = this.page.getByRole('button', { name: 'Register' });
    const total = await registerButtons.count();
    let registered = 0;

    for (let i = 0; i < total && registered < count; i++) {
      await dismissPopup(this.page);

      const button = registerButtons.nth(i);
      if (!(await button.isEnabled().catch(() => false))) {
        continue;
      }

      await button.scrollIntoViewIfNeeded();
      await button.click();
      await this.page.waitForTimeout(1_000);
      await dismissPopup(this.page);
      registered++;
      console.log(`Registered for event ${registered}/${count}`);
    }

    if (registered === 0) {
      console.log('No event registrations completed — events may already be registered.');
    }
  }

  async applyFilters(): Promise<void> {
    await applyModuleListFilters(this.page, MODULE_LIST_FILTERS.events);
  }

  async goBackToEventsHome(): Promise<void> {
    await this.page.goto('/events');
    await expect(this.page).toHaveURL(/\/events$/);
    console.log('Returned to Events home:', this.page.url());
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

    console.log('Scrolled to bottom on All Events page.');
  }

  async stayOnPage(): Promise<void> {
    await this.page.waitForTimeout(ALL_EVENTS_WAIT_MS);
    await expect(this.page).toHaveURL(/\/events\/all-events/);
    console.log(`Stayed on All Events page for ${ALL_EVENTS_WAIT_MS / 1000} seconds.`);
  }
}
