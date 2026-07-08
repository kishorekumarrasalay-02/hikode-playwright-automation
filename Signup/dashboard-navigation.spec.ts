import { test } from '../src/fixtures/test-base';
import { LoginDashboardFlow } from './login-dashboard.flow';

test.describe('HiKode dashboard navigation after sign in', () => {
  test('user can sign in and explore dashboard, profile, and view all sections', async ({ page }) => {
    test.setTimeout(180_000);

    const flow = new LoginDashboardFlow(page);
    await flow.signInAndExploreDashboard();
  });
});
