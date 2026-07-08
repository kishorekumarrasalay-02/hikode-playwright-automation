import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { ProfilePage } from '../profile/profile.page';
import { MyMessagesPage } from './my-messages.page';
import { generateGreeting, MESSAGE_RECIPIENTS } from './messages-data';

export class MyMessagesFlow {
  private readonly signInPage: SignInPage;
  private readonly profilePage: ProfilePage;
  private readonly myMessagesPage: MyMessagesPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.profilePage = new ProfilePage(page);
    this.myMessagesPage = new MyMessagesPage(page);
  }

  async sendGreetingMessages(): Promise<string[]> {
    const sentTo: string[] = [];

    for (const recipient of MESSAGE_RECIPIENTS) {
      await this.myMessagesPage.clickComposeNew();
      await this.myMessagesPage.searchRecipient(recipient.search);

      const selected = await this.myMessagesPage.pickRecipient(recipient.search);
      if (!selected) {
        await this.myMessagesPage.closeComposeModal();
        continue;
      }

      await this.myMessagesPage.fillMessage(generateGreeting(recipient.displayName));
      await this.myMessagesPage.sendMessage();
      sentTo.push(selected);
      console.log('Sent greeting to:', selected);
    }

    return sentTo;
  }

  async manageMyMessages(): Promise<{ deleted: boolean; sentTo: string[] }> {
    await this.profilePage.openFromProfileLogo();
    await this.myMessagesPage.openMyMessagesTab();
    const deleted = await this.myMessagesPage.deleteFirstConversation();

    const sentTo = await this.sendGreetingMessages();

    console.log('My Messages flow completed:', { deleted, sentTo });
    return { deleted, sentTo };
  }

  async signInAndManageMyMessages(): Promise<{ deleted: boolean; sentTo: string[] }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    return this.manageMyMessages();
  }
}
