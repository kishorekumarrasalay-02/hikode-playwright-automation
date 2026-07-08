const JOB_TITLES = ['QA Engineer', 'Automation Tester', 'Software Tester', 'SDET', 'Test Analyst'];
const COMPANIES = ['Ratnam Solutions', 'HiKode Labs', 'TechVerse', 'Quality Hub', 'TestCraft'];
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

export interface JobFormData {
  title: string;
  companyName: string;
  state: string;
  city: string;
  experienceMin: string;
  experienceMax: string;
  salaryMin: string;
  salaryMax: string;
  openings: string;
  count: string;
  expiryDate: string;
  description: string;
  fullAddress: string;
  skill: string;
}

export function generateJobData(): JobFormData {
  const unique = `${Date.now().toString().slice(-5)}${randomSuffix(2)}`;
  const city = pickRandom(CITIES);
  const state = pickRandom(STATES);

  return {
    title: `${pickRandom(JOB_TITLES)} ${unique}`,
    companyName: `${pickRandom(COMPANIES)} ${unique}`,
    state,
    city,
    experienceMin: randomNumber(1, 2),
    experienceMax: randomNumber(3, 6),
    salaryMin: randomNumber(4, 8) + '00000',
    salaryMax: randomNumber(9, 15) + '00000',
    openings: randomNumber(1, 5),
    count: randomNumber(5, 20),
    expiryDate: futureDate(),
    description: `Automated job posting created on ${new Date().toISOString()}. Looking for skilled testers.`,
    fullAddress: `${city}, ${state}, India`,
    skill: pickRandom(SKILLS),
  };
}

export function generateUpdatedJobData(current: JobFormData): Partial<JobFormData> {
  const unique = randomSuffix(3);

  return {
    title: `${current.title} Updated ${unique}`,
    description: `${current.description} Updated with new requirements ${unique}.`,
    salaryMin: randomNumber(5, 9) + '00000',
    salaryMax: randomNumber(10, 18) + '00000',
    openings: randomNumber(2, 6),
    count: randomNumber(8, 25),
    skill: pickRandom(SKILLS),
  };
}
