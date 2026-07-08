import type { CoachingRadioOptions } from '../src/utils/radio-combinations';

const COURSE_TITLES = ['Full Stack Coaching', 'QA Mentorship', 'Automation Coaching', 'SDET Program', 'Test Leadership'];
const SUBJECTS = ['Software Testing', 'Web Development', 'Quality Assurance', 'Automation', 'Programming'];
const SUBCATEGORIES = ['Manual Testing', 'Playwright', 'Selenium', 'API Testing', 'TypeScript'];
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

export interface CoachingFormData {
  sessionCharge: CoachingRadioOptions['sessionCharge'];
  sessionType: CoachingRadioOptions['sessionType'];
  intent: CoachingRadioOptions['intent'];
  courseTitle: string;
  subject: string;
  subCategory: string;
  skill: string;
  experience: string;
  hourlyRate: string;
  sessions: string;
  count: string;
  expiryDate: string;
  state: string;
  city: string;
  languages: string;
  description: string;
  bio: string;
  availabilityFrom: string;
  availabilityTo: string;
}

export function generateCoachingData(options: CoachingRadioOptions): CoachingFormData {
  const unique = `${Date.now().toString().slice(-5)}${randomSuffix(2)}`;
  const city = pickRandom(CITIES);
  const state = pickRandom(STATES);
  const optionTag = `${options.sessionCharge}-${options.sessionType}-${options.intent}`;

  return {
    sessionCharge: options.sessionCharge,
    sessionType: options.sessionType,
    intent: options.intent,
    courseTitle: `${pickRandom(COURSE_TITLES)} ${unique} ${optionTag}`,
    subject: pickRandom(SUBJECTS),
    subCategory: pickRandom(SUBCATEGORIES),
    skill: pickRandom(SKILLS),
    experience: randomNumber(2, 8),
    hourlyRate: randomNumber(500, 2000),
    sessions: randomNumber(5, 15),
    count: randomNumber(5, 20),
    expiryDate: futureDate(),
    state,
    city,
    languages: 'English, Hindi',
    description: `Automated coaching program created on ${new Date().toISOString()}. Hands-on mentoring sessions.`,
    bio: `Experienced mentor with expertise in software testing and automation. Coaching ID: ${unique}.`,
    availabilityFrom: '10:00',
    availabilityTo: '12:00',
  };
}

export function generateUpdatedCoachingData(current: CoachingFormData): Partial<CoachingFormData> {
  const unique = randomSuffix(3);

  return {
    courseTitle: `${current.courseTitle} Updated ${unique}`,
    description: `${current.description} Updated with new curriculum ${unique}.`,
    bio: `${current.bio} Updated bio ${unique}.`,
    hourlyRate: randomNumber(600, 2500),
    sessions: randomNumber(6, 18),
    count: randomNumber(8, 25),
    skill: pickRandom(SKILLS),
  };
}
