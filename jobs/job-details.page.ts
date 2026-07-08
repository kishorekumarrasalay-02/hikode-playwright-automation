import { type Page, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';

export class JobDetailsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async dismissCompleteProfilePrompt(): Promise<void> {
    const modal = this.page.locator(
      '#completeProfileModal, #completeProfileModalEvents, [role="dialog"]',
    ).filter({ hasText: /complete your profile/i });

    for (let attempt = 0; attempt < 3; attempt++) {
      if (!(await modal.first().isVisible({ timeout: 2_000 }).catch(() => false))) {
        return;
      }

      const maybeLater = modal.getByRole('button', { name: /maybe later/i });
      if (await maybeLater.isVisible().catch(() => false)) {
        await maybeLater.click();
      } else {
        const closeButton = modal.getByRole('button', { name: /^close$/i });
        if (await closeButton.isVisible().catch(() => false)) {
          await closeButton.click();
        } else {
          await modal.locator('.btn-close').first().click().catch(() => {});
        }
      }

      await modal.first().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
      await this.page.waitForTimeout(500);
    }

    console.log('Dismissed complete profile prompt.');
  }

  async openJobFromAllJobs(jobTitle: string): Promise<void> {
    await this.page.goto('/jobs/all-jobs');
    await this.page.waitForTimeout(2_000);
    await this.dismissCompleteProfilePrompt();
    await dismissPopup(this.page);

    await this.page.getByPlaceholder('Search by title').fill(jobTitle);
    await this.page.waitForTimeout(1_500);
    await this.dismissCompleteProfilePrompt();

    const jobCard = this.page.locator('.card').filter({ hasText: jobTitle }).first();
    await expect(jobCard).toBeVisible({ timeout: 15_000 });
    console.log('Found job card for:', jobTitle);
  }

  async clickReportFlag(jobTitle: string): Promise<void> {
    await this.dismissCompleteProfilePrompt();

    const jobCard = this.page.locator('.card').filter({ hasText: jobTitle }).first();
    const reportFlag = jobCard.locator('i.far.fa-flag[title="Report"], i[title="Report"]').first();
    await reportFlag.click();

    await expect(this.page.locator('#CommentModal')).toBeVisible({ timeout: 10_000 });
    await expect(this.page.getByText('Send Comment')).toBeVisible({ timeout: 10_000 });
    console.log('Opened Send Comment modal via report flag.');
  }

  async submitReportComment(comment: string): Promise<void> {
    const commentModal = this.page.locator('#CommentModal');

    await commentModal.getByPlaceholder('Enter your comment...').fill(comment);
    await commentModal.getByRole('button', { name: /send/i }).click();
    await this.page.waitForTimeout(1_500);
    await dismissPopup(this.page);

    if (await commentModal.isVisible().catch(() => false)) {
      const closeX = commentModal.locator('.btn-close').first();
      if (await closeX.isVisible().catch(() => false)) {
        await closeX.click();
      } else {
        await commentModal.getByRole('button', { name: /^close$/i }).click().catch(() => {});
      }
    }

    console.log('Submitted report comment.');
  }

  async reportJob(jobTitle: string, comment: string): Promise<void> {
    await this.openJobFromAllJobs(jobTitle);
    await this.clickReportFlag(jobTitle);
    await this.submitReportComment(comment);
  }
}
