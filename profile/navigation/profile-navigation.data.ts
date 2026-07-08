export interface ProfileNavigationTab {
  label: string;
  name: RegExp;
  urlPattern: RegExp;
  file: string;
}

export const PROFILE_NAVIGATION_TABS: ProfileNavigationTab[] = [
  { label: 'Profile', name: /(My|Our) Profile/, urlPattern: /\/profile\/details/, file: 'my-profile.page.ts' },
  { label: 'Circle', name: /(My|Our) Circle/, urlPattern: /\/profile\/my-circle/, file: 'my-circle.page.ts' },
  { label: 'Plans', name: /(My|Our) Plans/, urlPattern: /\/profile\/my-plans/, file: 'my-plans.page.ts' },
  { label: 'Choices', name: /(My|Our) Choices/, urlPattern: /\/profile\/my-choices/, file: 'my-choices.page.ts' },
  { label: 'Activities', name: /(My|Our) Activities/, urlPattern: /\/profile\/my-activities/, file: 'my-activities.page.ts' },
  { label: 'Messages', name: /(My|Our) Messages/, urlPattern: /\/profile\/my-messages/, file: 'my-messages.page.ts' },
  { label: 'Notifications', name: /(My|Our) Notifications/, urlPattern: /\/profile\/my-notifications/, file: 'my-notifications.page.ts' },
];

export const NAVIGATION_WAIT_MS = 5_000;
