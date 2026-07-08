import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { ProfilePage } from '../profile/profile.page';
import { MyCirclePage } from './my-circle.page';
import {
  CONNECTION_MESSAGE,
  EXTERNAL_EMAILS,
  HIKODE_FELLOW_TARGET_COUNT,
  HIKODE_RECIPIENT_CANDIDATES,
  nameMatchesExisting,
} from './my-circle-data';

export class MyCircleFlow {
  private readonly signInPage: SignInPage;
  private readonly profilePage: ProfilePage;
  private readonly myCirclePage: MyCirclePage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.profilePage = new ProfilePage(page);
    this.myCirclePage = new MyCirclePage(page);
  }

  async sendHiKodeFellowRequests(): Promise<string[]> {
    const sentTo: string[] = [];
    const existingFellows = await this.myCirclePage.getExistingFellowNames();

    for (const searchName of HIKODE_RECIPIENT_CANDIDATES) {
      if (sentTo.length >= HIKODE_FELLOW_TARGET_COUNT) {
        break;
      }

      if (nameMatchesExisting(searchName, existingFellows)) {
        console.log('Skipping search — user already in My Circle:', searchName);
        continue;
      }

      await this.myCirclePage.clickAddFellows();
      await this.myCirclePage.selectHiKodeFellows();
      await this.myCirclePage.searchHiKodeRecipient(searchName);

      const recipient = await this.myCirclePage.pickNewHiKodeRecipient(searchName, [
        ...existingFellows,
        ...sentTo.map((n) => n.toLowerCase()),
      ]);

      if (!recipient) {
        await this.myCirclePage.closeComposePanel();
        continue;
      }

      await this.myCirclePage.fillSubject(CONNECTION_MESSAGE.subject);
      await this.myCirclePage.fillMessage(CONNECTION_MESSAGE.body);
      const sent = await this.myCirclePage.sendMessage();
      if (!sent) {
        continue;
      }
      sentTo.push(recipient);
      existingFellows.push(recipient.toLowerCase());
      console.log('Submitted HiKode fellow request for:', recipient);
    }

    console.log(`HiKode fellow requests sent: ${sentTo.length}/${HIKODE_FELLOW_TARGET_COUNT}`);
    return sentTo;
  }

  async sendExternalAssociateMails(): Promise<string[]> {
    const sentTo: string[] = [];

    for (const emailFactory of EXTERNAL_EMAILS) {
      const email = emailFactory();
      await this.myCirclePage.clickAddFellows();
      await this.myCirclePage.selectExternalAssociates();
      await this.myCirclePage.fillExternalUserEmail(email);
      await this.myCirclePage.fillSubject(CONNECTION_MESSAGE.subject);
      await this.myCirclePage.fillMessage(CONNECTION_MESSAGE.body);
      const sent = await this.myCirclePage.sendMessage();
      if (!sent) {
        continue;
      }
      sentTo.push(email);
      console.log('Submitted external associate mail to:', email);
    }

    return sentTo;
  }

  async viewAndDeleteFellow(): Promise<{ viewed: string; deleted: string }> {
    const viewed = (await this.myCirclePage.viewFirstFellowDetails()) ?? 'Skipped';
    if (viewed !== 'Skipped') {
      await this.myCirclePage.closeDetailsModal();
    }
    const deleted = await this.myCirclePage.deleteFirstFellow();
    return { viewed, deleted };
  }

  async manageMyCircle(): Promise<{
    hikodeRecipients: string[];
    externalEmails: string[];
    viewedFellow: string;
    deletedFellow: string;
  }> {
    await this.profilePage.openFromProfileLogo();
    await this.myCirclePage.openMyCircleTab();

    const hikodeRecipients = await this.sendHiKodeFellowRequests();
    const externalEmails = await this.sendExternalAssociateMails();
    const { viewed: viewedFellow, deleted: deletedFellow } = await this.viewAndDeleteFellow();

    console.log('My Circle flow completed:', {
      hikodeRecipients,
      externalEmails,
      viewedFellow,
      deletedFellow,
    });

    return { hikodeRecipients, externalEmails, viewedFellow, deletedFellow };
  }

  async signInAndManageMyCircle(): Promise<{
    hikodeRecipients: string[];
    externalEmails: string[];
    viewedFellow: string;
    deletedFellow: string;
  }> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    return this.manageMyCircle();
  }
}
