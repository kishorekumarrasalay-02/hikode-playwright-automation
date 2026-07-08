import { type Page, expect } from '@playwright/test';

export class EventsHomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openEventsSection(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('link', { name: 'Events', exact: true }).click();
    await expect(this.page).toHaveURL(/\/events/, { timeout: 15_000 });
    console.log('Opened Events section:', this.page.url());
  }

  async openCreateNewEvent(): Promise<void> {
    await this.page.getByRole('button', { name: /create new event/i }).click();
    await expect(this.page).toHaveURL(/\/events\/add-event/, { timeout: 15_000 });
    console.log('Opened Add Event form:', this.page.url());
  }

  async openManageMyEvents(): Promise<void> {
    await this.page.getByRole('button', { name: /manage (my|our) events/i }).click();
    await expect(this.page).toHaveURL(/\/events\/list-event/, { timeout: 15_000 });
    console.log('Opened Manage My Events:', this.page.url());
  }

  async openBrowseEvents(): Promise<void> {
    await this.page.getByRole('button', { name: /browse events/i }).click();
    await expect(this.page).toHaveURL(/\/events\/all-events/, { timeout: 15_000 });
    console.log('Opened Browse Events:', this.page.url());
  }
}
