import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { ProfilePage } from './profile.page';
import { ProfileNavigationPage } from './navigation/profile-navigation.page';
import { generateUniqueProfileName, EXTRA_PROFILE_SKILLS, PROFILE_SKILLS } from './profile-data';

export class ProfileFlow {
  private readonly signInPage: SignInPage;
  private readonly profilePage: ProfilePage;
  private readonly profileNavigationPage: ProfileNavigationPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.profilePage = new ProfilePage(page);
    this.profileNavigationPage = new ProfileNavigationPage(page);
  }

  async updateProfileDetails(): Promise<{ firstName: string; lastName: string }> {
    const { firstName, lastName } = generateUniqueProfileName();

    await this.profilePage.updateName(firstName, lastName);
    await this.profilePage.openAddSkillsSection();
    await this.profilePage.addSkills([...PROFILE_SKILLS, ...EXTRA_PROFILE_SKILLS]);
    await this.profilePage.saveChanges();

    console.log('Profile details updated:', { firstName, lastName });
    return { firstName, lastName };
  }

  async signInAndUpdateProfile(): Promise<{ firstName: string; lastName: string }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);

    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.profilePage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    await this.profilePage.openFromProfileLogo();
    const result = await this.updateProfileDetails();
    await this.profileNavigationPage.exploreAllTabs();
    await this.profilePage.goToDashboard();

    return result;
  }
}
