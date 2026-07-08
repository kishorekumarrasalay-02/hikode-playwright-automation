import { test, expect } from '../src/fixtures/test-base';
import { ContributionsFlow } from './contributions.flow';

test.describe('HiKode contributions management', () => {
  test('user can create, edit, filter, search, and join contributions', async ({ page }) => {
    test.setTimeout(300_000);

    const contributionsFlow = new ContributionsFlow(page);
    const { createdContribution, updatedTitle } = await contributionsFlow.signInAndManageContributions();

    await expect(page).toHaveURL(/\/contributions\/all-contributions/);
    console.log('Contributions flow completed:', {
      createdContribution: createdContribution.title,
      updatedTitle,
    });
  });
});
