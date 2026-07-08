import { type Page } from '@playwright/test';
import { NAVIGATION_WAIT_MS } from './profile-navigation.data';

export class BaseNavigationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitOnCurrentPage(): Promise<void> {
    await this.page.waitForTimeout(NAVIGATION_WAIT_MS);
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const step = 400;
      const maxScroll = document.body.scrollHeight;

      for (let y = 0; y < maxScroll; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      window.scrollTo(0, document.body.scrollHeight);
    });

    console.log('Scrolled to bottom on:', this.page.url());
  }
}
