import { type Page } from '@playwright/test';
import { selectSearchableDropdown } from './popup';
import type { ListFilterPreset } from './filter-presets';

async function pickDropdownItem(
  page: Page,
  buttonLabel: string,
  optionPattern: RegExp,
  searchText?: string,
): Promise<void> {
  await page.getByRole('button', { name: buttonLabel, exact: true }).click().catch(() => {});
  const menu = page.locator('.dropdown-menu').filter({ visible: true }).last();
  const search = menu.getByPlaceholder(/search/i);

  if (searchText && (await search.isVisible().catch(() => false))) {
    await search.fill(searchText);
    await page.waitForTimeout(500);
  }

  const item = menu.locator('.dropdown-item').filter({ hasText: optionPattern }).first();
  if (await item.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await item.click();
  } else {
    await menu.locator('.dropdown-item').filter({ hasNotText: /^All / }).first().click().catch(() => {});
  }

  await page.waitForTimeout(600);
}

async function applySelectFilters(page: Page, preset: ListFilterPreset): Promise<void> {
  if (!preset.selectFilters?.length) {
    return;
  }

  for (const filter of preset.selectFilters) {
    const select = page.locator('select').filter({
      has: page.locator('option', { hasText: filter.optionPattern }),
    });

    if (await select.count()) {
      await select.first().selectOption(filter.value);
      console.log(`Filter select (${filter.label}):`, filter.value);
      await page.waitForTimeout(600);
    }
  }
}

export async function applyModuleListFilters(page: Page, preset: ListFilterPreset): Promise<void> {
  await selectSearchableDropdown(
    page,
    'All countries',
    preset.countrySearch,
    preset.countryPattern,
  );

  if (preset.stateButton && preset.statePattern) {
    await pickDropdownItem(
      page,
      preset.stateButton,
      preset.statePattern,
      preset.stateSearch,
    );
    console.log('Filter state:', preset.stateSearch ?? preset.statePattern.source);
  }

  if (preset.cityButton && preset.cityPattern) {
    await pickDropdownItem(
      page,
      preset.cityButton,
      preset.cityPattern,
      preset.citySearch,
    );
    console.log('Filter city:', preset.citySearch ?? preset.cityPattern.source);
  }

  await applySelectFilters(page, preset);
  await page.waitForTimeout(1_000);
  console.log('Applied list filters:', {
    country: preset.countrySearch,
    state: preset.stateSearch,
    city: preset.citySearch,
    selects: preset.selectFilters?.map((f) => f.value),
  });
}
