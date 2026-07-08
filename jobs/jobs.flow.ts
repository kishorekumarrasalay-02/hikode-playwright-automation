import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { AddJobPage } from './add-job.page';
import { AllJobsPage } from './all-jobs.page';
import { JobsPage } from './jobs-home.page';
import { MyJobsPage } from './my-jobs.page';
import {
  generateJobData,
  generateUpdatedJobData,
  type JobFormData,
} from './job-data';

export class JobsFlow {
  private readonly signInPage: SignInPage;
  private readonly jobsPage: JobsPage;
  private readonly addJobPage: AddJobPage;
  private readonly myJobsPage: MyJobsPage;
  private readonly allJobsPage: AllJobsPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.jobsPage = new JobsPage(page);
    this.addJobPage = new AddJobPage(page);
    this.myJobsPage = new MyJobsPage(page);
    this.allJobsPage = new AllJobsPage(page);
  }

  async manageJobs(): Promise<{ createdJob: JobFormData; updatedTitle: string }> {
    const createdJob = generateJobData();

    await this.jobsPage.openJobsSection();
    await this.jobsPage.openCreateJobPosting();
    await this.addJobPage.fillJobForm(createdJob);
    await this.addJobPage.submitJob();

    if (!this.myJobsPage.page.url().includes('/list-job')) {
      await this.myJobsPage.goBack();
      await this.jobsPage.openManageMyPostings();
    }

    await this.myJobsPage.editJobByTitle(createdJob.title);

    const updates = generateUpdatedJobData(createdJob);
    await this.addJobPage.updateJobFields(updates);
    await this.addJobPage.submitJob();

    const updatedTitle = updates.title ?? createdJob.title;

    await this.myJobsPage.goBack();
    await this.jobsPage.openManageMyPostings();
    await this.myJobsPage.scrollToLastJob();
    await this.myJobsPage.openAllJobsFromList();
    await this.allJobsPage.scrollToBottomAndVerify();

    console.log('Jobs section completed:', { created: createdJob.title, updated: updatedTitle });
    return { createdJob, updatedTitle };
  }

  async browseApplyAndFilter(): Promise<void> {
    await this.allJobsPage.applyToJobs(3);
    await this.allJobsPage.goBackToJobsHome();
    await this.jobsPage.openBrowseOpportunities();
    await this.allJobsPage.applyFilters();
    await this.allJobsPage.scrollToBottomAndVerify();
  }

  async signInAndManageJobs(): Promise<{ createdJob: JobFormData; updatedTitle: string }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    const result = await this.manageJobs();
    await this.browseApplyAndFilter();
    return result;
  }
}
