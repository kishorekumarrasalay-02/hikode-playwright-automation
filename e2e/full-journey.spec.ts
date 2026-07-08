import { test, expect } from '../src/fixtures/test-base';
import { FullJourneyFlow } from './full-journey.flow';

test.describe('HiKode full journey', () => {
  test('single login — jobs → events → coach → contribute → profile → dashboard → circle → plans → messages', async ({ page }) => {
    test.setTimeout(1_800_000);

    const flow = new FullJourneyFlow(page);
    await flow.run();

    await expect(page).toHaveURL(/hikode\.me\/(dashboard|profile)/);
  });
});
