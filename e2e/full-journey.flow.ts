import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { DashboardPage } from '../signup/dashboard.page';
import { JobsFlow } from '../jobs/jobs.flow';
import { EventsFlow } from '../events/events.flow';
import { CoachingFlow } from '../coach/coaching.flow';
import { ContributionsFlow } from '../contribute/contributions.flow';
import { ProfileFlow } from '../profile/profile.flow';
import { MyCircleFlow } from '../my-circle/my-circle.flow';
import { MyPlansFlow } from '../my-plans/my-plans.flow';
import { MyMessagesFlow } from '../my-messages/my-messages.flow';
import { AllJobsPage } from '../jobs/all-jobs.page';
import { AllEventsPage } from '../events/all-events.page';
import { AllCoachingPage } from '../coach/all-coaching.page';
import { AllContributionsPage } from '../contribute/all-contributions.page';

const APPLY_COUNT = 4;

export class FullJourneyFlow {
  private readonly page: Page;
  private readonly signInPage: SignInPage;
  private readonly dashboardPage: DashboardPage;
  private readonly jobsFlow: JobsFlow;
  private readonly eventsFlow: EventsFlow;
  private readonly coachingFlow: CoachingFlow;
  private readonly contributionsFlow: ContributionsFlow;
  private readonly profileFlow: ProfileFlow;
  private readonly myCircleFlow: MyCircleFlow;
  private readonly myPlansFlow: MyPlansFlow;
  private readonly myMessagesFlow: MyMessagesFlow;
  private readonly allJobsPage: AllJobsPage;
  private readonly allEventsPage: AllEventsPage;
  private readonly allCoachingPage: AllCoachingPage;
  private readonly allContributionsPage: AllContributionsPage;

  constructor(page: Page) {
    this.page = page;
    this.signInPage = new SignInPage(page);
    this.dashboardPage = new DashboardPage(page);
    this.jobsFlow = new JobsFlow(page);
    this.eventsFlow = new EventsFlow(page);
    this.coachingFlow = new CoachingFlow(page);
    this.contributionsFlow = new ContributionsFlow(page);
    this.profileFlow = new ProfileFlow(page);
    this.myCircleFlow = new MyCircleFlow(page);
    this.myPlansFlow = new MyPlansFlow(page);
    this.myMessagesFlow = new MyMessagesFlow(page);
    this.allJobsPage = new AllJobsPage(page);
    this.allEventsPage = new AllEventsPage(page);
    this.allCoachingPage = new AllCoachingPage(page);
    this.allContributionsPage = new AllContributionsPage(page);
  }

  async run(): Promise<void> {
    await this.stepSignIn();
    await this.stepJobs();
    await this.stepEvents();
    await this.stepCoach();
    await this.stepContribute();
    await this.stepCompleteProfile();
    await this.stepDashboardBrowseAndApply();
    await this.stepMyCircle();
    await this.stepMyPlans();
    await this.stepMyMessages();
  }

  private async stepSignIn(): Promise<void> {
    console.log('\n========== STEP 1: SIGN IN ==========');
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);

    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.dashboardPage.expectOnDashboard();
  }

  private async stepJobs(): Promise<void> {
    console.log('\n========== STEP 2: JOBS (create → manage → edit → browse → filter) ==========');
    await this.jobsFlow.manageJobs();
    await this.jobsFlow.browseApplyAndFilter();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepEvents(): Promise<void> {
    console.log('\n========== STEP 3: EVENTS (create → manage → browse → filter) ==========');
    await this.eventsFlow.manageEvents();
    await this.eventsFlow.browseApplyAndFilter();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepCoach(): Promise<void> {
    console.log('\n========== STEP 4: COACH (create → manage → edit → browse → filter) ==========');
    await this.coachingFlow.manageCoaching();
    await this.coachingFlow.browseApplyAndFilter();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepContribute(): Promise<void> {
    console.log('\n========== STEP 5: CONTRIBUTE (create → manage → edit → browse → filter) ==========');
    await this.contributionsFlow.manageContributions();
    await this.contributionsFlow.browseApplyAndFilter();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepCompleteProfile(): Promise<void> {
    console.log('\n========== STEP 6: COMPLETE PROFILE (fill details & skills) ==========');
    await this.dashboardPage.clickCompleteProfile();
    await this.profileFlow.updateProfileDetails();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepDashboardBrowseAndApply(): Promise<void> {
    console.log('\n========== STEP 7: DASHBOARD (scroll → view all → apply/register/join) ==========');
    await this.dashboardPage.returnToDashboard();
    await this.dashboardPage.scrollDashboardSlowly();

    await this.applyFromDashboardSection('Jobs', '/jobs/all-jobs', () =>
      this.allJobsPage.applyToJobs(APPLY_COUNT),
    );

    await this.applyFromDashboardSection('Events', '/events/all-events', () =>
      this.allEventsPage.registerForEvents(APPLY_COUNT),
    );

    await this.applyFromDashboardSection('Coaching', '/coaching/all-coachings', () =>
      this.allCoachingPage.applyToCoaches(APPLY_COUNT),
    );

    await this.applyFromDashboardSection('Contributions', '/contributions/all-contributions', () =>
      this.allContributionsPage.joinContributions(APPLY_COUNT),
    );

    await this.dashboardPage.returnToDashboard();
  }

  private async stepMyCircle(): Promise<void> {
    console.log('\n========== STEP 8: MY CIRCLE (add fellows → external → view → delete) ==========');
    await this.myCircleFlow.manageMyCircle();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepMyPlans(): Promise<void> {
    console.log('\n========== STEP 9: MY PLANS (view plans → billing periods → Stripe checkout) ==========');
    await this.myPlansFlow.manageMyPlans();
    await this.dashboardPage.returnToDashboard();
  }

  private async stepMyMessages(): Promise<void> {
    console.log('\n========== STEP 10: MY MESSAGES (delete → compose → send greetings) ==========');
    await this.myMessagesFlow.manageMyMessages();
    await this.dashboardPage.returnToDashboard();
    console.log('\n========== FULL JOURNEY COMPLETED ==========');
  }

  private async applyFromDashboardSection(
    section: 'Jobs' | 'Events' | 'Coaching' | 'Contributions',
    allPagePath: string,
    applyAction: () => Promise<void>,
  ): Promise<void> {
    console.log(`\n--- Dashboard: View All ${section} and apply ---`);
    await this.dashboardPage.returnToDashboard();
    await this.dashboardPage.scrollDashboardSlowly();
    await this.dashboardPage.clickViewAll(section);

    if (!this.page.url().includes(allPagePath.replace(/^\//, ''))) {
      await this.page.goto(allPagePath);
    }

    await applyAction();
    console.log(`Finished applying to ${section}.`);
  }
}
