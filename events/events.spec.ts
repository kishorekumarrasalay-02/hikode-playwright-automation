import { test, expect } from '../src/fixtures/test-base';
import { EventsFlow } from './events.flow';

test.describe('HiKode events management', () => {
  test('user can create event, register, filter, and browse all events', async ({ page }) => {
    test.setTimeout(300_000);

    const eventsFlow = new EventsFlow(page);
    const eventData = await eventsFlow.signInAndManageEvents();

    await expect(page).toHaveURL(/\/events\/all-events/);
    console.log('Events flow completed for:', eventData.eventTitle);
  });
});
