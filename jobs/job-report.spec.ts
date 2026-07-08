import { test, expect } from '../src/fixtures/test-base';
import { JobReportFlow } from './job-report.flow';

test.describe('HiKode job cross-user report', () => {
  test('creator posts job, logs out, reporter flags job with comment', async ({ page }) => {
    test.setTimeout(300_000);

    const flow = new JobReportFlow(page);
    const { createdJobTitle } = await flow.run();

    expect(createdJobTitle.length).toBeGreaterThan(0);
    console.log('Cross-user job report completed for:', createdJobTitle);
  });
});
