import { chromium } from '@playwright/test';

async function inspectAll(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.hikode.me/');
    await page.getByRole('button', { name: 'Join now', exact: true }).first().click();
    await page.waitForURL(/\/login/);
    console.log('Login URL:', page.url());

    const signUpElements = await page.locator('a, button').filter({ hasText: /signup/i }).all();
    for (const el of signUpElements) {
      const tag = await el.evaluate((node) => node.tagName);
      const text = await el.innerText().catch(() => '');
      const href = await el.getAttribute('href').catch(() => null);
      console.log('SignUp element:', { tag, text: text.trim(), href });
    }

    await page.getByRole('link', { name: 'SignUp' }).click().catch(async () => {
      await page.getByText('SignUp', { exact: true }).click();
    });
    await page.waitForURL(/\/register/);
    console.log('Register URL:', page.url());

    const selects = await page.locator('select, [role="combobox"], mat-select, ng-select').all();
    console.log('Select-like elements:', selects.length);
    for (const sel of selects) {
      const tag = await sel.evaluate((n) => n.tagName);
      const html = await sel.evaluate((n) => n.outerHTML.slice(0, 300));
      console.log({ tag, html });
    }

    const labels = await page.locator('label').all();
    for (const label of labels) {
      console.log('Label:', (await label.innerText()).trim());
    }

    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      const name = await input.getAttribute('name');
      const id = await input.getAttribute('id');
      const placeholder = await input.getAttribute('placeholder');
      console.log('Input:', { type, name, id, placeholder });
    }

    const selectEl = page.locator('select').first();
    if (await selectEl.count()) {
      await selectEl.selectOption('Individual');
      await page.waitForTimeout(1000);
      const inputsAfter = await page.locator('input').all();
      for (const input of inputsAfter) {
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        console.log('Input after select:', { type, name, id, placeholder });
      }
    }
  } finally {
    await browser.close();
  }
}

inspectAll().catch(console.error);
