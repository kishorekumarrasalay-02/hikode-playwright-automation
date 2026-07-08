import { type Page, type Locator, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';
import { waitAndCaptureRedError } from '../src/utils/red-error-capture';
import { MODULE_FORM_LOCATIONS } from '../src/utils/filter-presets';
import { fillFormLocation } from '../src/utils/form-location';
import type { JobFormData } from './job-data';

export class AddJobPage {
  readonly page: Page;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async fillJobForm(data: JobFormData): Promise<void> {
    await this.page.locator('[formcontrolname="active"]').check();
    await this.page.locator('#remoteNo').check();
    await this.page.locator('[formcontrolname="title"]').fill(data.title);
    await this.page.locator('[formcontrolname="companyName"]').fill(data.companyName);
    await this.page.locator('[formcontrolname="jobType"]').selectOption('Full-Time');
    await fillFormLocation(
      this.page,
      MODULE_FORM_LOCATIONS.jobs,
      MODULE_FORM_LOCATIONS.jobs.state,
      MODULE_FORM_LOCATIONS.jobs.city,
    );
    await this.page.locator('[formcontrolname="experienceMin"]').fill(data.experienceMin);
    await this.page.locator('[formcontrolname="experienceMax"]').fill(data.experienceMax);
    await this.page.locator('[formcontrolname="salaryMin"]').fill(data.salaryMin);
    await this.page.locator('[formcontrolname="salaryMax"]').fill(data.salaryMax);

    await this.page.locator('#currency').click();
    await this.page.getByText('INR ₹ - Indian Rupee', { exact: true }).click();

    await this.page.locator('[formcontrolname="salaryFrequency"]').selectOption('Yearly');
    await this.addSkill(data.skill);
    await this.page.locator('[formcontrolname="openings"]').fill(data.openings);
    await this.page.locator('[formcontrolname="count"]').fill(data.count);
    await this.page.locator('[formcontrolname="expiryDate"]').fill(data.expiryDate);
    await this.page.locator('[formcontrolname="access"]').selectOption({ label: '🌍 All Fellows' });

    await this.page.locator('[formcontrolname="description"]').fill(data.description);
    await this.page.locator('[formcontrolname="fullAddress"]').fill(data.fullAddress);

    console.log('Filled job form for:', data.title);
  }

  async addSkill(skill: string): Promise<void> {
    const existing = this.page.getByText(skill, { exact: true });
    if (await existing.isVisible().catch(() => false)) {
      return;
    }

    await this.page.getByPlaceholder('Type a skill').fill(skill);
    await this.page.getByRole('button', { name: 'Add', exact: true }).click();
  }

  async submitJob(): Promise<void> {
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
    await waitAndCaptureRedError(this.page);
    await dismissPopup(this.page);
    await this.page.waitForURL(/\/jobs\/(list-job|add-job)/, { timeout: 20_000 });
    console.log('Submitted job. URL:', this.page.url());
  }

  async updateJobFields(updates: Partial<JobFormData>): Promise<void> {
    if (updates.title) {
      await this.page.locator('[formcontrolname="title"]').fill(updates.title);
    }
    if (updates.description) {
      await this.page.locator('[formcontrolname="description"]').fill(updates.description);
    }
    if (updates.salaryMin) {
      await this.page.locator('[formcontrolname="salaryMin"]').fill(updates.salaryMin);
    }
    if (updates.salaryMax) {
      await this.page.locator('[formcontrolname="salaryMax"]').fill(updates.salaryMax);
    }
    if (updates.openings) {
      await this.page.locator('[formcontrolname="openings"]').fill(updates.openings);
    }
    if (updates.count) {
      await this.page.locator('[formcontrolname="count"]').fill(updates.count);
    }
    if (updates.skill) {
      await this.addSkill(updates.skill);
    }

    console.log('Updated job fields.');
  }
}
