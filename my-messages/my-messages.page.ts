import { type Page, type Locator, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';

export class MyMessagesPage {
  readonly page: Page;
  readonly composeNewButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.composeNewButton = page.getByRole('button', { name: /compose new/i });
  }

  private composeModal() {
    return this.page.locator('.modal-content, .modal-dialog').filter({ hasText: 'New Message' }).last();
  }

  async openMyMessagesTab(): Promise<void> {
    await this.page.getByRole('listitem').filter({ hasText: /(My|Our) Messages/ }).first().click();
    await expect(this.page).toHaveURL(/\/profile\/my-messages/, { timeout: 15_000 });
    console.log('Opened My Messages:', this.page.url());
  }

  async deleteFirstConversation(): Promise<boolean> {
    const deleteButton = this.page.locator('button[title="Delete"]').first();
    if (!(await deleteButton.isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log('No conversation to delete — skipping delete step.');
      return false;
    }

    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.click();

    const confirmButton = this.page
      .getByRole('button', { name: /yes,?\s*delete permanently/i })
      .or(this.page.getByRole('button', { name: /^delete$/i }))
      .or(this.page.getByRole('button', { name: /confirm/i }));

    if (!(await confirmButton.first().isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log('Delete confirmation not shown — skipping delete step.');
      await this.page.keyboard.press('Escape').catch(() => {});
      return false;
    }

    await confirmButton.first().click();
    await dismissPopup(this.page);
    await this.page.waitForTimeout(1_000);
    console.log('Deleted first conversation.');
    return true;
  }

  async clickComposeNew(): Promise<void> {
    await dismissPopup(this.page);
    await this.composeNewButton.scrollIntoViewIfNeeded();
    await this.composeNewButton.click();
    await expect(this.composeModal().getByText('New Message')).toBeVisible({ timeout: 10_000 });
    console.log('Opened Compose New message modal.');
  }

  async searchRecipient(query: string): Promise<void> {
    const toInput = this.composeModal().getByPlaceholder('Enter recipient name or email');
    await toInput.fill('');
    await toInput.fill(query);
    await this.page.waitForTimeout(1_500);
    console.log('Searched recipient:', query);
  }

  async pickRecipient(searchName: string): Promise<string | null> {
    const modal = this.composeModal();
    const token = searchName.split(' ')[0];

    const emailLine = modal.getByText(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i).first();
    if (await emailLine.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const blockText = await emailLine.evaluate((el) => {
        let node: HTMLElement | null = el as HTMLElement;
        for (let i = 0; i < 6 && node; i++) {
          const text = node.innerText?.trim() ?? '';
          if (text.includes('@') && text.split('\n').length >= 2) {
            return text;
          }
          node = node.parentElement;
        }
        return el.textContent ?? '';
      });
      const label =
        blockText
          .split('\n')
          .map((line) => line.trim())
          .find((line) => line && !line.includes('@') && !/^to$/i.test(line)) ?? searchName;
      await emailLine.click();
      console.log('Selected recipient:', label);
      return label;
    }

    const nameSuggestion = modal
      .getByText(new RegExp(token, 'i'))
      .filter({ hasNotText: /^(to|message|cancel)$/i })
      .first();

    if (!(await nameSuggestion.isVisible({ timeout: 3_000 }).catch(() => false))) {
      console.log('No recipient suggestion found for:', searchName);
      return null;
    }

    const label = (await nameSuggestion.innerText()).split('\n')[0].trim();
    await nameSuggestion.click();
    console.log('Selected recipient:', label);
    return label;
  }

  async fillMessage(body: string): Promise<void> {
    await this.composeModal().getByPlaceholder('Type your message here...').fill(body);
    console.log('Filled message body.');
  }

  async sendMessage(): Promise<void> {
    await this.composeModal().getByRole('button', { name: 'Send Message' }).click();
    await dismissPopup(this.page);
    await this.page.getByRole('dialog', { name: 'error message' }).getByRole('button', { name: 'Close' }).click().catch(() => {});
    await this.page.getByRole('dialog', { name: 'success message' }).getByRole('button', { name: 'Close' }).click().catch(() => {});
    await this.closeComposeModal();
    console.log('Clicked Send Message.');
  }

  async closeComposeModal(): Promise<void> {
    const cancelButton = this.composeModal().getByRole('button', { name: 'Cancel' });
    if (await cancelButton.isVisible().catch(() => false)) {
      await cancelButton.click();
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(500);
  }
}
