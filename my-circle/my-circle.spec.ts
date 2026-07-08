import { test, expect } from '../src/fixtures/test-base';
import { MyCircleFlow } from './my-circle.flow';

test.describe('HiKode My Circle', () => {
  test('user can add fellows, compose mail, view details, and delete fellow', async ({ page }) => {
    test.setTimeout(300_000);

    const myCircleFlow = new MyCircleFlow(page);
    const result = await myCircleFlow.signInAndManageMyCircle();

    await expect(page).toHaveURL(/\/profile\/my-circle/);
    expect(result.hikodeRecipients.length + result.externalEmails.length).toBeGreaterThan(0);
    expect(result.viewedFellow.length).toBeGreaterThan(0);
    console.log('My Circle test completed:', result);
  });
});
