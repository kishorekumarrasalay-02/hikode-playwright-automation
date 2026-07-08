import { chromium } from '@playwright/test';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';

function futureDateTime(days = 10, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function futureDate(days = 45): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

async function testEventSubmit(): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const unique = Date.now().toString().slice(-5);
  const title = `QA Event ${unique}`;

  try {
    await page.goto('https://www.hikode.me/login');
    if (await page.getByRole('button', { name: 'Accept' }).isVisible().catch(() => false)) {
      await page.getByRole('button', { name: 'Accept' }).click();
    }
    await page.locator('[formcontrolname="email"]').fill(LOGIN_CREDENTIALS.email);
    await page.locator('[formcontrolname="password"]').fill(LOGIN_CREDENTIALS.password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(/\/dashboard/);

    await page.getByRole('navigation').getByRole('link', { name: 'Events', exact: true }).click();
    await page.getByRole('button', { name: /create new event/i }).click();

    await page.locator('[formcontrolname="eventTitle"]').fill(title);
    await page.locator('[formcontrolname="eventType"]').selectOption('Meetup');
    await page.locator('[formcontrolname="subject"]').fill('Software Testing');
    await page.locator('[formcontrolname="subCategory"]').fill('Automation');
    await page.locator('[formcontrolname="access"]').selectOption({ label: '🌍 All Fellows' });
    await page.locator('[formcontrolname="website"]').fill('https://www.example.com');
    await page.locator('[formcontrolname="startDate"]').fill(futureDateTime(10, 10));
    await page.locator('[formcontrolname="endDate"]').fill(futureDateTime(10, 17));
    await page.locator('label').filter({ hasText: 'Timezone' }).locator('..').locator('.form-select').click();
    await page.getByText(/Asia — Calcutta/).click();
    await page.locator('[formcontrolname="expiryDate"]').fill(futureDate());
    await page.locator('[formcontrolname="count"]').fill('50');
    await page.locator('[formcontrolname="country"]').selectOption({ label: ' India ' });
    await page.locator('[formcontrolname="state"]').fill('Telangana');
    await page.locator('[formcontrolname="city"]').fill('Hyderabad');
    await page.locator('[formcontrolname="fullAddress"]').fill('Hyderabad, India');
    await page.locator('[formcontrolname="description"]').fill(`Automated event ${unique}`);

    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(3000);
    console.log('After submit:', page.url());
  } finally {
    await browser.close();
  }
}

testEventSubmit().catch(console.error);
