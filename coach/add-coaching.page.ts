import { type Page, type Locator } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_FORM_LOCATIONS } from '../src/utils/filter-presets';
import { fillFormLocation } from '../src/utils/form-location';
import type { CoachingFormData } from './coach-data';

export class AddCoachingPage {
  readonly page: Page;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillCoachingForm(data: CoachingFormData): Promise<void> {
    await this.page.locator('[formcontrolname="active"]').check();
    await this.page.getByRole('radio', { name: data.sessionCharge, exact: true }).check();
    await this.page.getByRole('radio', { name: data.sessionType, exact: true }).check();
    await this.page.getByRole('radio', { name: data.intent, exact: true }).check();

    await this.page.locator('[formcontrolname="courseTitle"]').fill(data.courseTitle);
    await this.page.locator('[formcontrolname="subject"]').fill(data.subject);
    await this.page.locator('[formcontrolname="subCategory"]').fill(data.subCategory);
    await this.addSkill(data.skill);
    await this.page.locator('[formcontrolname="experience"]').fill(data.experience);
    if (data.sessionCharge === 'Charged') {
      await this.page.locator('[formcontrolname="hourlyRate"]').fill(data.hourlyRate);
      await this.page.locator('#currency').click();
      await this.page.getByText('INR ₹ - Indian Rupee', { exact: true }).click();
    }
    await this.page.locator('[formcontrolname="sessions"]').fill(data.sessions);
    await this.page.locator('[formcontrolname="count"]').fill(data.count);
    await this.page.locator('[formcontrolname="expiryDate"]').fill(data.expiryDate);

    await fillFormLocation(
      this.page,
      MODULE_FORM_LOCATIONS.coaching,
      MODULE_FORM_LOCATIONS.coaching.state,
      MODULE_FORM_LOCATIONS.coaching.city,
    );
    await this.page.locator('[formcontrolname="access"]').selectOption({ label: '🌍 All Fellows' });

    await this.page.locator('[formcontrolname="description"]').fill(data.description);
    await this.page.locator('[formcontrolname="bio"]').fill(data.bio);
    await this.page.locator('[formcontrolname="languages"]').fill(data.languages);

    await this.fillAvailability(data.availabilityFrom, data.availabilityTo);

    console.log('Filled coaching form for:', data.courseTitle);
  }

  async addSkill(skill: string): Promise<void> {
    await dismissPopup(this.page);

    const existing = this.page.getByText(skill, { exact: true });
    if (await existing.isVisible().catch(() => false)) {
      return;
    }

    await this.page.getByPlaceholder('Type a skill').fill(skill);
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
  }

  async fillAvailability(from: string, to: string): Promise<void> {
    const fromInput = this.page.locator('[formcontrolname="from"]').first();
    const toInput = this.page.locator('[formcontrolname="to"]').first();

    if (await fromInput.isVisible().catch(() => false)) {
      await fromInput.fill(from);
    }
    if (await toInput.isVisible().catch(() => false)) {
      await toInput.fill(to);
    }
  }

  async submitCoaching(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
    await dismissPopup(this.page);
    await this.page.waitForURL(/\/coaching\/(list-coaching|add-coaching)/, { timeout: 20_000 });
    console.log('Submitted coaching. URL:', this.page.url());
  }

  async updateCoachingFields(updates: Partial<CoachingFormData>): Promise<void> {
    await dismissPopup(this.page);

    if (updates.courseTitle) {
      await this.page.locator('[formcontrolname="courseTitle"]').fill(updates.courseTitle);
    }
    if (updates.description) {
      await this.page.locator('[formcontrolname="description"]').fill(updates.description);
    }
    if (updates.bio) {
      await this.page.locator('[formcontrolname="bio"]').fill(updates.bio);
    }
    if (updates.hourlyRate) {
      const hourlyRate = this.page.locator('[formcontrolname="hourlyRate"]');
      if (await hourlyRate.isVisible().catch(() => false)) {
        await hourlyRate.fill(updates.hourlyRate);
      }
    }
    if (updates.sessions) {
      await this.page.locator('[formcontrolname="sessions"]').fill(updates.sessions);
    }
    if (updates.count) {
      await this.page.locator('[formcontrolname="count"]').fill(updates.count);
    }
    if (updates.skill) {
      await this.addSkill(updates.skill);
    }

    console.log('Updated coaching fields.');
  }
}
