import type { ContributionRadioOptions } from '../src/utils/radio-combinations';

const CONTRIBUTION_TITLES = [
  'Community Workshop',
  'Open Source Mentorship',
  'Knowledge Sharing Session',
  'Tech Tutorial Series',
  'Skills Development Program',
];
const SUBJECTS = ['Education', 'Technology', 'Community', 'Training', 'Development'];
const SUBCATEGORIES = ['Workshop', 'Tutorial', 'Mentorship', 'Collaboration', 'Learning'];
const CITIES = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Pune'];
const STATES = ['Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra'];
const SKILLS = ['Playwright', 'Selenium', 'API Testing', 'Manual Testing', 'TypeScript', 'Java'];

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSuffix(length = 4): string {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

function randomNumber(min: number, max: number): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function futureDate(daysAhead = 45): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

export const ALL_CONTRIBUTIONS_WAIT_MS = 7_500;

export interface ContributionFormData {
  contributionType: ContributionRadioOptions['contributionType'];
  mode: ContributionRadioOptions['mode'];
  intent: ContributionRadioOptions['intent'];
  title: string;
  subject: string;
  subCategory: string;
  skill: string;
  count: string;
  expiryDate: string;
  state: string;
  city: string;
  description: string;
  fee?: string;
}

export function generateContributionData(options: ContributionRadioOptions): ContributionFormData {
  const unique = `${Date.now().toString().slice(-5)}${randomSuffix(2)}`;
  const city = pickRandom(CITIES);
  const state = pickRandom(STATES);
  const optionTag = `${options.contributionType}-${options.mode}-${options.intent}`;

  return {
    contributionType: options.contributionType,
    mode: options.mode,
    intent: options.intent,
    title: `${pickRandom(CONTRIBUTION_TITLES)} ${unique} ${optionTag}`,
    subject: pickRandom(SUBJECTS),
    subCategory: pickRandom(SUBCATEGORIES),
    skill: pickRandom(SKILLS),
    count: randomNumber(5, 20),
    expiryDate: futureDate(),
    state,
    city,
    description: `Automated contribution created on ${new Date().toISOString()}. Sharing knowledge with the community.`,
    fee: options.contributionType === 'Paid' ? randomNumber(100, 500) : undefined,
  };
}

export function generateUpdatedContributionData(
  current: ContributionFormData,
): Partial<ContributionFormData> {
  const unique = randomSuffix(3);

  return {
    title: `${current.title} Updated ${unique}`,
    description: `${current.description} Updated content ${unique}.`,
    count: randomNumber(8, 25),
    skill: pickRandom(SKILLS),
  };
}
