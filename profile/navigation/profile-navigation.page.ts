import { expect } from '@playwright/test';
import { BaseNavigationPage } from './base-navigation.page';
import { PROFILE_NAVIGATION_TABS, type ProfileNavigationTab } from './profile-navigation.data';

export class ProfileNavigationPage extends BaseNavigationPage {
  private tabLink(tab: ProfileNavigationTab) {
    return this.page.getByRole('listitem').filter({ hasText: tab.name }).first();
  }

  async dismissSuccessPopup(): Promise<void> {
    const successDialog = this.page.getByRole('dialog', { name: 'success message' });
    if (await successDialog.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await successDialog.getByRole('button', { name: 'Close' }).click();
      await successDialog.waitFor({ state: 'hidden', timeout: 10_000 });
      console.log('Dismissed success popup using X button before navigation.');
    }
  }

  async openTab(tab: ProfileNavigationTab): Promise<void> {
    await this.dismissSuccessPopup();
    const link = this.tabLink(tab);
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(this.page).toHaveURL(tab.urlPattern, { timeout: 15_000 });
    console.log(`Opened ${tab.label}:`, this.page.url());
  }

  async exploreTab(tab: ProfileNavigationTab): Promise<void> {
    await this.openTab(tab);
    await this.scrollToBottom();
    await this.waitOnCurrentPage();
    console.log(`Finished exploring ${tab.label}.`);
  }

  async exploreAllTabs(): Promise<void> {
    await this.dismissSuccessPopup();

    for (const tab of PROFILE_NAVIGATION_TABS) {
      await this.exploreTab(tab);
    }
  }
}
