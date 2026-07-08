import { type Page } from '@playwright/test';
import type { FormLocationPreset } from './filter-presets';

function timezoneSearchTerm(pattern: RegExp): string {
  const source = pattern.source.replace(/\\/g, '');
  const segments = source.split(/\s*—\s*|\s*-\s*/);
  return (segments[segments.length - 1] || source).replace(/[^a-zA-Z ]/g, ' ').trim();
}

export async function fillFormLocation(
  page: Page,
  location: FormLocationPreset,
  state: string,
  city: string,
): Promise<void> {
  const countrySelect = page.locator('[formcontrolname="country"]');
  const countryLabel = location.countryLabel.trim();
  try {
    await countrySelect.selectOption({ label: countryLabel });
  } catch {
    await countrySelect.selectOption({ label: new RegExp(countryLabel, 'i') });
  }
  await page.locator('[formcontrolname="state"]').fill(state);
  await page.locator('[formcontrolname="city"]').fill(city);

  const timezoneField = page.locator('label').filter({ hasText: 'Timezone' }).locator('..');
  const timezoneControl = timezoneField.locator('.form-select').first();

  if (await timezoneControl.isVisible().catch(() => false)) {
    await timezoneControl.click();

    const search = page.getByPlaceholder(/search timezone/i);
    if (await search.isVisible({ timeout: 1_500 }).catch(() => false)) {
      await search.fill(timezoneSearchTerm(location.timezonePattern));
      await page.waitForTimeout(600);
    }

    const buttonOption = page.getByRole('button', { name: location.timezonePattern }).first();
    if (await buttonOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await buttonOption.click();
    } else {
      await page.getByText(location.timezonePattern).first().click();
    }
  }

  console.log('Form location:', {
    country: location.countryLabel.trim(),
    state,
    city,
    timezone: location.timezonePattern.source,
  });
}
