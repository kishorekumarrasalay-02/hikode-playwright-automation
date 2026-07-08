const FIRST_NAMES = ['Kishore', 'Arjun', 'Ravi', 'Suresh', 'Vikram', 'Naveen'];
const LAST_NAMES = ['Kumar', 'Rao', 'Reddy', 'Sharma', 'Patel', 'Singh'];

export const PROFILE_SKILLS = [
  'Manual Testing',
  'Automation Testing',
  'API Testing',
  'Playwright',
  'TypeScript',
  'GitHub',
] as const;

export const EXTRA_PROFILE_SKILLS = [
  'Selenium',
  'Cypress',
  'Jira',
  'Postman',
  'CI/CD',
  'Agile',
] as const;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSuffix(length = 4): string {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

export function generateUniqueProfileName() {
  const uniqueId = `${Date.now().toString().slice(-4)}${randomSuffix(2)}`;

  return {
    firstName: `${pickRandom(FIRST_NAMES)}${uniqueId}`,
    lastName: `${pickRandom(LAST_NAMES)}${uniqueId}`,
  };
}
