import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { AddCoachingPage } from './add-coaching.page';
import { AllCoachingPage } from './all-coaching.page';
import { CoachingHomePage } from './coaching-home.page';
import { MyCoachingPage } from './my-coaching.page';
import {
  generateCoachingData,
  generateUpdatedCoachingData,
  type CoachingFormData,
} from './coach-data';
import { coachingRadioCombinations } from '../src/utils/radio-combinations';

export class CoachingFlow {
  private readonly signInPage: SignInPage;
  private readonly coachingHomePage: CoachingHomePage;
  private readonly addCoachingPage: AddCoachingPage;
  private readonly myCoachingPage: MyCoachingPage;
  private readonly allCoachingPage: AllCoachingPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.coachingHomePage = new CoachingHomePage(page);
    this.addCoachingPage = new AddCoachingPage(page);
    this.myCoachingPage = new MyCoachingPage(page);
    this.allCoachingPage = new AllCoachingPage(page);
  }

  async manageCoaching(): Promise<{ createdCoaching: CoachingFormData; updatedTitle: string }> {
    const combinations = coachingRadioCombinations();
    const createdCoachings: CoachingFormData[] = [];

    await this.coachingHomePage.openCoachingSection();
    await this.coachingHomePage.openCreateCoaching();

    for (const [index, options] of combinations.entries()) {
      if (index > 0) {
        await this.coachingHomePage.openAddCoachingForm();
      }

      const createdCoaching = generateCoachingData(options);
      await this.addCoachingPage.fillCoachingForm(createdCoaching);
      await this.addCoachingPage.submitCoaching();
      createdCoachings.push(createdCoaching);
      console.log('Created coaching:', options);
    }

    const createdCoaching = createdCoachings[0];

    if (!this.myCoachingPage.page.url().includes('/list-coaching')) {
      await this.myCoachingPage.goBack();
      await this.coachingHomePage.openManageMyPrograms();
    }

    await this.myCoachingPage.editCoachingByTitle(createdCoaching.courseTitle);

    const updates = generateUpdatedCoachingData(createdCoaching);
    await this.addCoachingPage.updateCoachingFields(updates);
    await this.addCoachingPage.submitCoaching();

    const updatedTitle = updates.courseTitle ?? createdCoaching.courseTitle;

    await this.myCoachingPage.goBack();
    await this.coachingHomePage.openManageMyPrograms();
    await this.myCoachingPage.scrollToLastCoaching();
    await this.myCoachingPage.openAllCoachingFromList();
    await this.allCoachingPage.scrollToBottomAndVerify();

    console.log('Coaching section completed:', { created: createdCoaching.courseTitle, updated: updatedTitle });
    return { createdCoaching, updatedTitle };
  }

  async browseApplyAndFilter(): Promise<void> {
    await this.allCoachingPage.applyFilters();
    await this.allCoachingPage.searchByTitle('Coaching');
    await this.allCoachingPage.applyToCoaches(3);
    await this.allCoachingPage.scrollToBottomAndVerify();
  }

  async signInAndManageCoaching(): Promise<{ createdCoaching: CoachingFormData; updatedTitle: string }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    const result = await this.manageCoaching();
    await this.browseApplyAndFilter();
    return result;
  }
}
