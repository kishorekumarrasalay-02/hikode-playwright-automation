import { type Page } from '@playwright/test';

export class MyEventsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goBack(): Promise<void> {
    const backButton = this.page.getByRole('button', { name: 'Back' });
    if (await backButton.isVisible().catch(() => false)) {
      await backButton.click();
      await this.page.waitForTimeout(1000);
    }

    if (this.page.url().includes('/list-event') || this.page.url().includes('/add-event')) {
      await this.page.goto('/events');
    }

    console.log('Went back. URL:', this.page.url());
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

    const rows = this.page.locator('table tbody tr');
    console.log(`Scrolled My Events list. Rows: ${await rows.count()}`);
  }
}
