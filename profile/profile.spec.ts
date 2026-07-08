import { test, expect } from '../src/fixtures/test-base';
import { ProfileFlow } from './profile.flow';

test.describe('HiKode profile update', () => {
  test('user can sign in, update profile, explore all profile tabs, and return to dashboard', async ({ page }) => {
    test.setTimeout(300_000);

    const profileFlow = new ProfileFlow(page);
    const { firstName, lastName } = await profileFlow.signInAndUpdateProfile();

    await expect(page).toHaveURL(/\/dashboard/);
    console.log('Profile update completed for:', { firstName, lastName });
  });
});
