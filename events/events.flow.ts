import { type Page } from '@playwright/test';
import { SignInPage } from '../signup/login.page';
import { LOGIN_CREDENTIALS } from '../signup/login-credentials';
import { AddEventPage } from './add-event.page';
import { AllEventsPage } from './all-events.page';
import { EventsHomePage } from './events-home.page';
import { MyEventsPage } from './my-events.page';
import { generateEventData, type EventFormData } from './event-data';

export class EventsFlow {
  private readonly signInPage: SignInPage;
  private readonly eventsHomePage: EventsHomePage;
  private readonly addEventPage: AddEventPage;
  private readonly myEventsPage: MyEventsPage;
  private readonly allEventsPage: AllEventsPage;

  constructor(page: Page) {
    this.signInPage = new SignInPage(page);
    this.eventsHomePage = new EventsHomePage(page);
    this.addEventPage = new AddEventPage(page);
    this.myEventsPage = new MyEventsPage(page);
    this.allEventsPage = new AllEventsPage(page);
  }

  async manageEvents(): Promise<EventFormData> {
    const eventData = generateEventData();

    await this.eventsHomePage.openEventsSection();
    await this.eventsHomePage.openCreateNewEvent();
    await this.addEventPage.fillEventForm(eventData);
    await this.addEventPage.submitEvent();

    await this.myEventsPage.goBack();
    await this.eventsHomePage.openManageMyEvents();
    await this.myEventsPage.scrollToBottom();
    await this.myEventsPage.goBack();
    await this.eventsHomePage.openBrowseEvents();
    await this.allEventsPage.scrollToBottom();

    console.log('Events section completed:', eventData.eventTitle);
    return eventData;
  }

  async browseApplyAndFilter(): Promise<void> {
    await this.allEventsPage.registerForEvents(3);
    await this.allEventsPage.goBackToEventsHome();
    await this.eventsHomePage.openBrowseEvents();
    await this.allEventsPage.applyFilters();
    await this.allEventsPage.scrollToBottom();
    await this.allEventsPage.stayOnPage();
  }

  async signInAndManageEvents(): Promise<EventFormData> {
    console.log('Signing in with:', LOGIN_CREDENTIALS.email);
    await this.signInPage.goto();
    await this.signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);
    await this.signInPage.page.waitForURL(/\/dashboard/, { timeout: 20_000 });

    const eventData = await this.manageEvents();
    await this.browseApplyAndFilter();
    return eventData;
  }
}
