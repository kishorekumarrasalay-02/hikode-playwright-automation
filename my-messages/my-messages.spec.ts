import { test, expect } from '../src/fixtures/test-base';
import { MyMessagesFlow } from './my-messages.flow';

test.describe('HiKode My Messages', () => {
  test('user can delete conversation, compose greetings, and send messages', async ({ page }) => {
    test.setTimeout(300_000);

    const myMessagesFlow = new MyMessagesFlow(page);
    const result = await myMessagesFlow.signInAndManageMyMessages();

    await expect(page).toHaveURL(/\/profile\/my-messages/);
    expect(result.sentTo.length).toBeGreaterThan(0);
    console.log('My Messages test completed:', result);
  });
});
