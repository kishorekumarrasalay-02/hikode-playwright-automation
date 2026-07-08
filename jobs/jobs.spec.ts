import { test, expect } from '../src/fixtures/test-base';
import { JobsFlow } from './jobs.flow';

test.describe('HiKode jobs management', () => {
  test('user can create, edit, apply, filter, and browse jobs', async ({ page }) => {
    test.setTimeout(300_000);

    const jobsFlow = new JobsFlow(page);
    const { createdJob, updatedTitle } = await jobsFlow.signInAndManageJobs();

    await expect(page).toHaveURL(/\/jobs\/all-jobs/);
    console.log('Jobs flow completed:', { createdJob: createdJob.title, updatedTitle });
  });
});
