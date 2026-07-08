import { type Page } from '@playwright/test';
import { captureRedErrorIfVisible } from './red-error-capture';

async function clickPopupCloseButton(page: Page, root: ReturnType<Page['locator']>): Promise<boolean> {
  const xButton = root.locator('.btn-close').first();
  if (await xButton.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await xButton.click().catch(() => {});
    return true;
  }

  const closeButton = root.getByRole('button', { name: /^close$/i }).first();
  if (await closeButton.isVisible({ timeout: 500 }).catch(() => false)) {
    await closeButton.click().catch(() => {});
    return true;
  }

  return false;
}

export async function dismissPopup(page: Page): Promise<void> {
  await captureRedErrorIfVisible(page);

  const popupRoots = page.locator('.modal.show, .popup-overlay, [role="dialog"]');
  const modalCount = await popupRoots.count();

  for (let i = 0; i < modalCount; i++) {
    const modal = popupRoots.nth(i);
    if (!(await modal.isVisible().catch(() => false))) {
      continue;
    }

    const message = await modal.innerText().catch(() => '');
    if (message.trim()) {
      console.log('Popup message:', message.trim().slice(0, 200));
    }

    await clickPopupCloseButton(page, modal);
    await modal.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
    await page.waitForTimeout(300);
  }

  const dialog = page.getByRole('dialog');
  if (await dialog.isVisible({ timeout: 1_000 }).catch(() => false)) {
    const clicked = await clickPopupCloseButton(page, dialog);
    if (!clicked) {
      await page.keyboard.press('Escape').catch(() => {});
    }
    await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
  }
}

export async function selectSearchableDropdown(
  page: Page,
  buttonName: string,
  searchText: string,
  optionPattern: RegExp,
): Promise<void> {
  await page.getByRole('button', { name: buttonName, exact: true }).click();
  const menu = page.locator('.dropdown-menu').filter({ visible: true }).last();
  const search = menu.getByPlaceholder(/search/i);
  if (await search.isVisible().catch(() => false)) {
    await search.fill(searchText);
    await page.waitForTimeout(500);
  }

  await menu.locator('.dropdown-item').filter({ hasText: optionPattern }).first().click();
  await page.waitForTimeout(800);
  console.log(`Selected ${buttonName} -> ${searchText}`);
}
