import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { AddContributionPage } from './add-contribution.page';
import { AllContributionsPage } from './all-contributions.page';
import { ContributionsHomePage } from './contributions-home.page';
import { MyContributionsPage } from './my-contributions.page';
import {
  generateContributionData,
  generateUpdatedContributionData,
  type ContributionFormData,
} from './contribution-data';
import { contributionRadioCombinations } from '../src/utils/radio-combinations';

export class ContributionsFlow {
  private readonly signInPage: SignInPage;
  private readonly contributionsHomePage: ContributionsHomePage;
  private readonly addContributionPage: AddContributionPage;
  private readonly myContributionsPage: MyContributionsPage;
  private readonly allContributionsPage: AllContributionsPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.contributionsHomePage = new ContributionsHomePage(page);
    this.addContributionPage = new AddContributionPage(page);
    this.myContributionsPage = new MyContributionsPage(page);
    this.allContributionsPage = new AllContributionsPage(page);
  }

  async manageContributions(): Promise<{
    createdContribution: ContributionFormData;
    updatedTitle: string;
  }> {
    const combinations = contributionRadioCombinations();
    const createdContributions: ContributionFormData[] = [];

    await this.contributionsHomePage.openContributionsSection();
    await this.contributionsHomePage.openCreateContribution();

    for (const [index, options] of combinations.entries()) {
      if (index > 0) {
        await this.contributionsHomePage.openAddContributionForm();
      }

      const createdContribution = generateContributionData(options);
      await this.addContributionPage.fillContributionForm(createdContribution);
      await this.addContributionPage.submitContribution();
      createdContributions.push(createdContribution);
      console.log('Created contribution:', options);
    }

    const createdContribution = createdContributions[0];

    if (!this.myContributionsPage.page.url().includes('/list-contribution')) {
      await this.myContributionsPage.goBack();
      await this.contributionsHomePage.openManageMyContent();
    }

    await this.myContributionsPage.editContributionByTitle(createdContribution.title);

    const updates = generateUpdatedContributionData(createdContribution);
    await this.addContributionPage.updateContributionFields(updates);
    await this.addContributionPage.submitContribution();

    const updatedTitle = updates.title ?? createdContribution.title;

    await this.myContributionsPage.goBack();
    await this.contributionsHomePage.openManageMyContent();
    await this.myContributionsPage.scrollToLastContribution();
    await this.myContributionsPage.openAllContributionsFromList();
    await this.allContributionsPage.scrollToBottom();

    console.log('Contributions section completed:', {
      created: createdContribution.title,
      updated: updatedTitle,
    });
    return { createdContribution, updatedTitle };
  }

  async browseApplyAndFilter(): Promise<void> {
    await this.allContributionsPage.joinContributions(3);
    await this.allContributionsPage.applyFilters();
    await this.allContributionsPage.searchByTitle('Workshop');
    await this.allContributionsPage.scrollToBottom();
    await this.allContributionsPage.stayOnPage();
  }

  async signInAndManageContributions(): Promise<{
    createdContribution: ContributionFormData;
    updatedTitle: string;
  }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    const result = await this.manageContributions();
    await this.browseApplyAndFilter();
    return result;
  }
}
