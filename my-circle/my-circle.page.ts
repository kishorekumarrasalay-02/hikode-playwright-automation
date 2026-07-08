import { type Page, type Locator, expect } from '@playwright/test';
import { dismissPopup } from '../src/utils/popup';

export class MyCirclePage {
  readonly page: Page;
  readonly addFellowsButton: Locator;
  readonly sendMessageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addFellowsButton = page.getByRole('button', { name: /add fellows/i });
    this.sendMessageButton = page.getByRole('button', { name: 'Send Message' });
  }

  private composePanel() {
    return this.page.locator('.modal-content, .modal-dialog').filter({ hasText: 'Send To' }).last();
  }

  async openMyCircleTab(): Promise<void> {
    await this.page.getByRole('listitem').filter({ hasText: /(My|Our) Circle/ }).first().click();
    await expect(this.page).toHaveURL(/\/profile\/my-circle/, { timeout: 15_000 });
    console.log('Opened My Circle:', this.page.url());
  }

  async forceDismissBlockingUi(): Promise<void> {
    await dismissPopup(this.page);

    const popupDialog = this.page.getByRole('dialog', { name: /error message|success message/i });
    if (await popupDialog.isVisible({ timeout: 1_000 }).catch(() => false)) {
      const xBtn = popupDialog.locator('.btn-close').first();
      if (await xBtn.isVisible().catch(() => false)) {
        await xBtn.click();
      } else {
        await popupDialog.getByRole('button', { name: /^close$/i }).click().catch(() => {});
      }
    }

    if (await this.composePanel().isVisible().catch(() => false)) {
      const xButton = this.composePanel().locator('.btn-close').first();
      if (await xButton.isVisible().catch(() => false)) {
        await xButton.click();
      } else {
        await this.page.getByRole('button', { name: 'Cancel' }).click().catch(() => {});
      }
    }

    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.locator('.modal-overlay').waitFor({ state: 'hidden', timeout: 8_000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async clickAddFellows(): Promise<void> {
    await this.forceDismissBlockingUi();
    await this.addFellowsButton.scrollIntoViewIfNeeded();
    await this.addFellowsButton.click();
    await expect(this.composePanel()).toBeVisible({ timeout: 15_000 });
    console.log('Opened Add Fellows compose panel.');
  }

  async selectHiKodeFellows(): Promise<void> {
    await this.page.getByText('HiKode Fellows', { exact: true }).click();
    console.log('Selected HiKode Fellows.');
  }

  async selectExternalAssociates(): Promise<void> {
    await this.page.getByText('External Associates', { exact: true }).click();
    await expect(this.composePanel().getByPlaceholder('Enter email')).toBeVisible({ timeout: 10_000 });
    console.log('Selected External Associates.');
  }

  async searchHiKodeRecipient(query: string): Promise<void> {
    const searchInput = this.composePanel().getByPlaceholder(/search for recipient|search users/i);
    await searchInput.fill('');
    await searchInput.fill(query);
    await this.page.waitForTimeout(2_500);
    console.log('Searched HiKode recipient:', query);
  }

  private isExistingFellow(label: string, existingFellows: string[]): boolean {
    const token = label.split(' ')[0].toLowerCase();
    return existingFellows.some((existing) => {
      const existingToken = existing.split(' ')[0].toLowerCase();
      return (
        existing.includes(token) ||
        token.includes(existingToken) ||
        existingToken.includes(token)
      );
    });
  }

  async getExistingFellowNames(): Promise<string[]> {
    const bodyText = await this.page.locator('body').innerText();
    const names = [...bodyText.matchAll(/👤\s*([^\n]+)/g)]
      .map((match) => match[1].trim().toLowerCase())
      .filter((name) => name.length > 0);

    console.log('Existing fellows in My Circle:', names.length ? names : '(none)');
    return names;
  }

  async pickNewHiKodeRecipient(
    searchQuery: string,
    existingFellows: string[],
  ): Promise<string | null> {
    const panel = this.composePanel();
    const token = searchQuery.split(' ')[0];

    const emailLine = panel
      .getByText(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
      .filter({ hasText: new RegExp(token, 'i') })
      .first();

    if (await emailLine.isVisible({ timeout: 4_000 }).catch(() => false)) {
      const blockText = await emailLine.evaluate((el) => {
        let node: HTMLElement | null = el as HTMLElement;
        for (let depth = 0; depth < 6 && node; depth++) {
          const text = node.innerText?.trim() ?? '';
          if (text.includes('@')) {
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
          .find((line) => line && !line.includes('@') && !/^to$/i.test(line)) ?? searchQuery;

      if (!this.isExistingFellow(label, existingFellows)) {
        await emailLine.click();
        console.log('Selected new HiKode recipient:', label, `(search: ${searchQuery})`);
        return label;
      }

      console.log('Skipping suggestion already in circle:', label);
    }

    const nameSuggestion = panel
      .getByText(new RegExp(token, 'i'))
      .filter({ hasNotText: /^(to|message|cancel|send|hiKode fellows)$/i })
      .first();

    if (await nameSuggestion.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const label = (await nameSuggestion.innerText()).split('\n')[0].trim();
      if (label && !this.isExistingFellow(label, existingFellows)) {
        await nameSuggestion.click();
        console.log('Selected new HiKode recipient by name:', label);
        return label;
      }
    }

    console.log('No new HiKode recipient found for search:', searchQuery);
    return null;
  }

  async pickHiKodeRecipientByName(name: string): Promise<string | null> {
    const emailLine = this.composePanel()
      .getByText(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)
      .filter({ hasText: new RegExp(name.split(' ')[0], 'i') })
      .first();

    if (!(await emailLine.isVisible({ timeout: 5_000 }).catch(() => false))) {
      const nameResult = this.composePanel().getByText(name, { exact: false }).first();
      if (!(await nameResult.isVisible({ timeout: 2_000 }).catch(() => false))) {
        console.log('No HiKode recipient found for:', name);
        return null;
      }
      await nameResult.click();
      console.log('Selected HiKode recipient by name:', name);
      return name;
    }

    const blockText = await emailLine.evaluate((el) => {
      let node: HTMLElement | null = el as HTMLElement;
      for (let i = 0; i < 5 && node; i++) {
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
        .find((line) => line && !line.includes('@') && !/^to$/i.test(line)) ?? name;

    await emailLine.click();
    console.log('Selected HiKode recipient:', label);
    return label;
  }

  async fillExternalUserEmail(email: string): Promise<void> {
    const emailInput = this.composePanel().getByPlaceholder('Enter email');
    await emailInput.fill(email);
    await this.page.waitForTimeout(800);
    console.log('Filled external user email:', email);
  }

  async fillSubject(subject: string): Promise<void> {
    const subjectInput = this.composePanel().getByPlaceholder(/what is this regarding|enter subject/i);
    if (await subjectInput.isVisible().catch(() => false)) {
      await subjectInput.fill(subject);
      console.log('Filled subject:', subject);
    }
  }

  async fillMessage(body: string): Promise<void> {
    await this.scrollComposePanel();
    const editor = this.composePanel().locator('.ql-editor');
    await editor.scrollIntoViewIfNeeded();
    await editor.click();
    await editor.fill(body);
    console.log('Filled message body.');
  }

  async scrollComposePanel(): Promise<void> {
    const panel = this.page.locator('.modal-body').last();
    if (await panel.isVisible().catch(() => false)) {
      await panel.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }

  async closeComposePanel(): Promise<void> {
    const panel = this.composePanel();
    const xButton = panel.locator('.btn-close').first();
    if (await xButton.isVisible().catch(() => false)) {
      await xButton.click();
    } else {
      await this.page.getByRole('button', { name: 'Cancel' }).click().catch(() => {});
    }
    await dismissPopup(this.page);
    await this.page.locator('.modal-overlay').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => {});
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async sendMessage(): Promise<boolean> {
    await this.scrollComposePanel();
    await this.sendMessageButton.scrollIntoViewIfNeeded();
    await this.sendMessageButton.click();
    await this.page.waitForTimeout(800);
    await dismissPopup(this.page);

    const errorDialog = this.page.getByRole('dialog', { name: 'error message' });
    if (await errorDialog.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await dismissPopup(this.page);
      await this.forceDismissBlockingUi();
      console.log('Send failed — error popup dismissed.');
      return false;
    }

    await dismissPopup(this.page);
    await this.closeComposePanel();
    console.log('Clicked Send Message.');
    return true;
  }

  async cancelCompose(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(500);
    console.log('Closed compose panel.');
  }

  async viewFirstFellowDetails(): Promise<string | null> {
    const viewButton = this.page.getByRole('button', { name: /view details/i }).first();
    if (!(await viewButton.isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log('No fellows with View details — skipping view step.');
      return null;
    }

    await viewButton.scrollIntoViewIfNeeded();
    await viewButton.click();

    const detailsModal = this.page.locator('#jobProfileModal');
    await expect(detailsModal).toBeVisible({ timeout: 10_000 });
    const fellowName = (await detailsModal.locator('h5').first().innerText()).trim();
    console.log('Opened View details for:', fellowName);
    return fellowName;
  }

  async closeDetailsModal(): Promise<void> {
    const detailsModal = this.page.locator('#jobProfileModal');
    if (await detailsModal.isVisible().catch(() => false)) {
      const xButton = detailsModal.locator('.btn-close').first();
      if (await xButton.isVisible().catch(() => false)) {
        await xButton.click();
      } else {
        await detailsModal.locator('button').first().click();
      }
      await detailsModal.waitFor({ state: 'hidden', timeout: 10_000 });
    }
    await dismissPopup(this.page);
    console.log('Closed details modal.');
  }

  async deleteFirstFellow(): Promise<string> {
    const deleteButton = this.page.locator('button.btn-outline-danger').first();
    if (!(await deleteButton.isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log('No fellow delete button found — skipping delete step.');
      return 'Skipped';
    }

    const row = deleteButton.locator('xpath=ancestor::div[contains(@class,"d-flex")][1]');
    const fellowName = (await row.innerText().catch(() => '')).split('\n').find((line) => line.trim() && !/view details/i.test(line))?.trim() ?? 'Unknown';

    await deleteButton.scrollIntoViewIfNeeded();
    await deleteButton.click();

    const confirmDelete = this.page.getByRole('button', { name: 'Delete', exact: true });
    if (!(await confirmDelete.isVisible({ timeout: 5_000 }).catch(() => false))) {
      console.log('Delete confirmation not shown — skipping delete step.');
      await this.page.keyboard.press('Escape').catch(() => {});
      return 'Skipped';
    }

    await confirmDelete.click();
    await dismissPopup(this.page);
    await this.page.waitForTimeout(1_000);
    console.log('Deleted fellow:', fellowName);
    return fellowName;
  }
}
