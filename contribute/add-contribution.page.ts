import { type Page, type Locator } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';
import { MODULE_FORM_LOCATIONS } from '../src/utils/filter-presets';
import { fillFormLocation } from '../src/utils/form-location';
import type { ContributionFormData } from './contribution-data';

export class AddContributionPage {
  readonly page: Page;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillContributionForm(data: ContributionFormData): Promise<void> {
    await this.page.locator('[formcontrolname="active"]').check();
    await this.page.getByRole('radio', { name: data.contributionType, exact: true }).check();
    await this.page.getByRole('radio', { name: data.mode, exact: true }).check();
    await this.page.getByRole('radio', { name: data.intent, exact: true }).check();

    await this.page.locator('[formcontrolname="title"]').fill(data.title);
    await this.addSkill(data.skill);
    await this.page.locator('[formcontrolname="subject"]').fill(data.subject);
    await this.page.locator('[formcontrolname="subCategory"]').fill(data.subCategory);
    if (data.contributionType === 'Paid' && data.fee) {
      await this.page.locator('[formcontrolname="fee"]').fill(data.fee);
      await this.page
        .locator('label')
        .filter({ hasText: 'Currency' })
        .locator('..')
        .locator('.form-select')
        .click();
      await this.page.getByText('INR ₹ - Indian Rupee', { exact: true }).click();
    }
    await this.page.locator('[formcontrolname="count"]').fill(data.count);
    await this.page.locator('[formcontrolname="expiryDate"]').fill(data.expiryDate);
    await fillFormLocation(
      this.page,
      MODULE_FORM_LOCATIONS.contributions,
      MODULE_FORM_LOCATIONS.contributions.state,
      MODULE_FORM_LOCATIONS.contributions.city,
    );
    await this.page.locator('[formcontrolname="access"]').selectOption({ label: '🌍 All Fellows' });

    await this.page.locator('[formcontrolname="description"]').fill(data.description);

    console.log('Filled contribution form for:', data.title);
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

  async submitContribution(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
    await dismissPopup(this.page);
    await this.page.waitForURL(/\/contributions\/(list-contribution|add-contribution)/, {
      timeout: 20_000,
    });
    console.log('Submitted contribution. URL:', this.page.url());
  }

  async updateContributionFields(updates: Partial<ContributionFormData>): Promise<void> {
    await dismissPopup(this.page);

    if (updates.title) {
      await this.page.locator('[formcontrolname="title"]').fill(updates.title);
    }
    if (updates.description) {
      await this.page.locator('[formcontrolname="description"]').fill(updates.description);
    }
    if (updates.count) {
      await this.page.locator('[formcontrolname="count"]').fill(updates.count);
    }
    if (updates.skill) {
      await this.addSkill(updates.skill);
    }

    console.log('Updated contribution fields.');
  }
}
