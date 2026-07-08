import { type Page, type Locator, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_FORM_LOCATIONS } from '../src/utils/filter-presets';
import { fillFormLocation } from '../src/utils/form-location';
import type { EventFormData } from './event-data';

export class AddEventPage {
  readonly page: Page;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillEventForm(data: EventFormData): Promise<void> {
    await this.page.locator('[formcontrolname="eventTitle"]').fill(data.eventTitle);
    await this.page.locator('[formcontrolname="eventType"]').selectOption(data.eventType);
    await this.page.locator('[formcontrolname="subject"]').fill(data.subject);
    await this.page.locator('[formcontrolname="subCategory"]').fill(data.subCategory);
    await this.page.locator('[formcontrolname="access"]').selectOption({ label: '🌍 All Fellows' });
    await this.page.locator('[formcontrolname="website"]').fill(data.website);
    await this.page.locator('[formcontrolname="startDate"]').fill(data.startDate);
    await this.page.locator('[formcontrolname="endDate"]').fill(data.endDate);

    await this.page.locator('[formcontrolname="expiryDate"]').fill(data.expiryDate);
    await this.page.locator('[formcontrolname="count"]').fill(data.count);
    await fillFormLocation(
      this.page,
      MODULE_FORM_LOCATIONS.events,
      MODULE_FORM_LOCATIONS.events.state,
      MODULE_FORM_LOCATIONS.events.city,
    );
    await this.page.locator('[formcontrolname="fullAddress"]').fill(data.fullAddress);
    await this.page.locator('[formcontrolname="description"]').fill(data.description);

    console.log('Filled event form for:', data.eventTitle);
  }

  async submitEvent(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
    await dismissPopup(this.page);
    await expect(this.page).toHaveURL(/\/events\/(list-event|add-event)/, { timeout: 20_000 });
    console.log('Submitted event. URL:', this.page.url());
  }
}
