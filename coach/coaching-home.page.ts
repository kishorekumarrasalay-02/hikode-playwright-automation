import { type Page, expect } from '@playwright/test';

export class CoachingHomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openCoachingSection(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('link', { name: 'Coach', exact: true }).click();
    await expect(this.page).toHaveURL(/\/coaching/, { timeout: 15_000 });
    console.log('Opened Coaching section:', this.page.url());
  }

  async openCreateCoaching(): Promise<void> {
    await this.page.getByRole('button', { name: /create coaching/i }).click();
    await expect(this.page).toHaveURL(/\/coaching\/add-coaching/, { timeout: 15_000 });
    console.log('Opened Add Coaching form:', this.page.url());
  }

  async openAddCoachingForm(): Promise<void> {
    await this.page.goto('/coaching/add-coaching');
    await expect(this.page).toHaveURL(/\/coaching\/add-coaching/, { timeout: 15_000 });
    console.log('Opened Add Coaching form:', this.page.url());
  }

  async openManageMyPrograms(): Promise<void> {
    await this.page.getByRole('button', { name: /manage (my|our) programs/i }).click();
    await expect(this.page).toHaveURL(/\/coaching\/list-coaching/, { timeout: 15_000 });
    console.log('Opened Manage My Programs:', this.page.url());
  }

  async openBrowseCoaching(): Promise<void> {
    await this.page.getByRole('button', { name: /browse coaching/i }).click();
    await expect(this.page).toHaveURL(/\/coaching\/all-coachings/, { timeout: 15_000 });
    console.log('Opened Browse Coaching:', this.page.url());
  }
}
