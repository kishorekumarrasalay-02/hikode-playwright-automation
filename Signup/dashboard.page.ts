import { type Page, type Locator, expect } from '@playwright/test';

export type NavItem = 'Dashboard' | 'Jobs' | 'Events' | 'Coach' | 'Contribute';
export type DashboardSection = 'Jobs' | 'Events' | 'Coaching' | 'Contributions';

const NAV_URLS: Record<NavItem, RegExp> = {
  Dashboard: /\/dashboard/,
  Jobs: /\/jobs/,
  Events: /\/events/,
  Coach: /\/coaching/,
  Contribute: /\/contributions/,
};

const VIEW_ALL_URLS: Record<DashboardSection, RegExp> = {
  Jobs: /\/jobs/,
  Events: /\/events/,
  Coaching: /\/coaching/,
  Contributions: /\/contributions/,
};

export class DashboardPage {
  readonly page: Page;
  readonly completeProfileLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeProfileLink = page.getByRole('link', { name: 'Complete Profile' });
  }

  async expectOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
    console.log('On dashboard:', this.page.url());
  }

  async clickNavItem(item: NavItem): Promise<void> {
    await this.page.getByRole('navigation').getByRole('link', { name: item, exact: true }).click();
    await expect(this.page).toHaveURL(NAV_URLS[item], { timeout: 15_000 });
    console.log(`Clicked ${item}. URL:`, this.page.url());
  }

  async exploreTopNavigation(): Promise<void> {
    const navItems: NavItem[] = ['Dashboard', 'Jobs', 'Events', 'Coach', 'Contribute'];

    for (const item of navItems) {
      await this.clickNavItem(item);
    }
  }

  async clickCompleteProfile(): Promise<void> {
    await this.completeProfileLink.scrollIntoViewIfNeeded();
    await this.completeProfileLink.click();
    await expect(this.page).toHaveURL(/\/profile\/details/, { timeout: 15_000 });
    console.log('Opened Complete Profile:', this.page.url());
  }

  async returnToDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.expectOnDashboard();
  }

  async scrollDashboard(): Promise<void> {
    await this.page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    });
    console.log('Scrolled dashboard to bottom.');
  }

  async scrollDashboardSlowly(): Promise<void> {
    await this.page.evaluate(async () => {
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 300));

      for (let y = 0; y < document.body.scrollHeight; y += 250) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }

      window.scrollTo(0, document.body.scrollHeight);
    });
    console.log('Scrolled dashboard slowly to bottom.');
  }

  async clickViewAll(section: DashboardSection): Promise<void> {
    const viewAll = this.page
      .locator('h5')
      .filter({ hasText: section })
      .locator('..')
      .getByText('View All', { exact: true });

    await viewAll.scrollIntoViewIfNeeded();
    await viewAll.click();
    await expect(this.page).toHaveURL(VIEW_ALL_URLS[section], { timeout: 15_000 });
    console.log(`Clicked View All for ${section}. URL:`, this.page.url());
  }

  async exploreViewAllSections(): Promise<void> {
    const sections: DashboardSection[] = ['Jobs', 'Events', 'Coaching', 'Contributions'];

    await this.returnToDashboard();
    await this.scrollDashboard();

    for (const section of sections) {
      await this.returnToDashboard();
      await this.scrollDashboard();
      await this.clickViewAll(section);
    }
  }
}
