import { test, expect } from '../src/fixtures/test-base';
import { CoachingFlow } from './coaching.flow';

test.describe('HiKode coaching management', () => {
  test('user can create, edit, filter, search, and apply to coaching', async ({ page }) => {
    test.setTimeout(300_000);

    const coachingFlow = new CoachingFlow(page);
    const { createdCoaching, updatedTitle } = await coachingFlow.signInAndManageCoaching();

    await expect(page).toHaveURL(/\/coaching\/all-coachings/);
    console.log('Coaching flow completed:', {
      createdCoaching: createdCoaching.courseTitle,
      updatedTitle,
    });
  });
});
