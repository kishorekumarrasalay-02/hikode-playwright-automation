import { test, expect } from '../src/fixtures/test-base';
import { MyPlansFlow } from './my-plans.flow';
import { BILLING_PERIODS, PLAN_TIERS } from './plans-data';

test.describe('HiKode My Plans', () => {
  test('user can browse all billing periods and plan tiers via checkout', async ({ page }) => {
    test.setTimeout(600_000);

    const myPlansFlow = new MyPlansFlow(page);
    const { attempts } = await myPlansFlow.signInAndManageMyPlans();

    await expect(page).toHaveURL(/\/profile\/my-plans/);
    expect(attempts.length).toBe(BILLING_PERIODS.length * PLAN_TIERS.length);
    console.log('My Plans test completed. Attempts:', attempts.length);
  });
});
