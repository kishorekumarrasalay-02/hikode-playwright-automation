import type { AccountType } from '../pages/register.page';

const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'];
const ORG_PREFIXES = ['Acme', 'Bright', 'Nova', 'Summit', 'Vertex', 'Pioneer', 'Atlas', 'Horizon'];
const ORG_SUFFIXES = ['Solutions', 'Labs', 'Group', 'Systems', 'Partners', 'Works', 'Collective', 'Hub'];

/** Fixed test emails — change here if needed */
export const INDIVIDUAL_EMAIL = 'ponnamandajagadeesh@ratnamsolutions.com';
export const ORGANIZATION_EMAIL = 'ponnamandajagadeesh@ratnamsolutions.com';

export interface IndividualSignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OrganizationSignupData {
  organizationName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type SignupData = IndividualSignupData | OrganizationSignupData;

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSuffix(length = 4): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

function generateRandomPassword(): string {
  return `HiKode@${randomSuffix(6)}${Math.floor(Math.random() * 90 + 10)}`;
}

export function generateIndividualSignupData(): IndividualSignupData {
  const password = generateRandomPassword();

  return {
    firstName: pickRandom(FIRST_NAMES),
    lastName: pickRandom(LAST_NAMES),
    email: INDIVIDUAL_EMAIL,
    password,
    confirmPassword: password,
  };
}

export function generateOrganizationSignupData(): OrganizationSignupData {
  const password = generateRandomPassword();
  const organizationName = `${pickRandom(ORG_PREFIXES)} ${pickRandom(ORG_SUFFIXES)}`;

  return {
    organizationName,
    email: ORGANIZATION_EMAIL,
    password,
    confirmPassword: password,
  };
}

export function generateSignupData(accountType: AccountType): SignupData {
  return accountType === 'Organization'
    ? generateOrganizationSignupData()
    : generateIndividualSignupData();
}
