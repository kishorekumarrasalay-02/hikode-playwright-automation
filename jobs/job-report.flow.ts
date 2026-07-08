import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { AuthPage } from '../signup/auth.page';
import {
  JOB_CREATOR_CREDENTIALS,
  JOB_REPORTER_CREDENTIALS,
} from '../signup/login-credentials';
import { DashboardPage } from '../signup/dashboard.page';
import { AddJobPage } from './add-job.page';
import { JobDetailsPage } from './job-details.page';
import { JobsPage } from './jobs-home.page';
import { generateJobData } from './job-data';

const DEFAULT_REPORT_COMMENT =
  'This job posting was reported during automated testing. Please review the listing for accuracy.';

export class JobReportFlow {
  private readonly page: Page;
  private readonly signInPage: SignInPage;
  private readonly authPage: AuthPage;
  private readonly dashboardPage: DashboardPage;
  private readonly jobsPage: JobsPage;
  private readonly addJobPage: AddJobPage;
  private readonly jobDetailsPage: JobDetailsPage;

  constructor(page: Page) {
    this.page = page;
    this.signInPage = new SignInPage(page);
    this.authPage = new AuthPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.jobsPage = new JobsPage(page);
    this.addJobPage = new AddJobPage(page);
    this.jobDetailsPage = new JobDetailsPage(page);
  }

  private async signInAs(email: string, password: string): Promise<void> {
    console.log('Signing in with:', email);
    await this.signInPage.goto();
    await this.signInPage.signIn(email, password);
    await this.dashboardPage.expectOnDashboard();
  }

  async createJobAsCreator(): Promise<string> {
    console.log('\n========== STEP 1: KISHORE — CREATE JOB ==========');
    await this.signInAs(JOB_CREATOR_CREDENTIALS.email, JOB_CREATOR_CREDENTIALS.password);

    const jobData = generateJobData();
    await this.jobsPage.openJobsSection();
    await this.jobsPage.openCreateJobPosting();
    await this.addJobPage.fillJobForm(jobData);
    await this.addJobPage.submitJob();

    console.log('Job created:', jobData.title);
    return jobData.title;
  }

  async logoutCreator(): Promise<void> {
    console.log('\n========== STEP 2: KISHORE — LOGOUT ==========');
    await this.authPage.logout();
  }

  async reportJobAsReporter(jobTitle: string, comment = DEFAULT_REPORT_COMMENT): Promise<void> {
    console.log('\n========== STEP 3: LOKESH — REPORT JOB ==========');
    await this.signInAs(JOB_REPORTER_CREDENTIALS.email, JOB_REPORTER_CREDENTIALS.password);
    await this.jobDetailsPage.dismissCompleteProfilePrompt();
    await this.jobDetailsPage.reportJob(jobTitle, comment);
    console.log('Reported job:', jobTitle);
  }

  async run(comment = DEFAULT_REPORT_COMMENT): Promise<{ createdJobTitle: string }> {
    const createdJobTitle = await this.createJobAsCreator();
    await this.logoutCreator();
    await this.reportJobAsReporter(createdJobTitle, comment);
    console.log('\n========== JOB CREATE & REPORT FLOW COMPLETED ==========');
    return { createdJobTitle };
  }
}
