const EVENT_TITLES = ['QA Meetup', 'Testing Workshop', 'Automation Seminar', 'Tech Conference', 'Dev Meetup'];
const SUBJECTS = ['Software Testing', 'Quality Assurance', 'Automation', 'Playwright', 'API Testing'];
const SUBCATEGORIES = ['Manual Testing', 'Automation', 'Performance', 'Security', 'Mobile Testing'];
const CITIES = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Pune'];
const STATES = ['Telangana', 'Karnataka', 'Tamil Nadu', 'Maharashtra'];

const EVENT_TYPES = ['Webinar', 'Workshop', 'Seminar', 'Meetup', 'Conference'] as const;

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSuffix(length = 4): string {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

function randomNumber(min: number, max: number): string {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function futureDateTime(daysAhead = 10, hour = 10): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(hour, 0, 0, 0);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function futureDate(daysAhead = 45): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

export interface EventFormData {
  eventTitle: string;
  eventType: string;
  subject: string;
  subCategory: string;
  website: string;
  startDate: string;
  endDate: string;
  expiryDate: string;
  count: string;
  state: string;
  city: string;
  fullAddress: string;
  description: string;
}

export function generateEventData(): EventFormData {
  const unique = `${Date.now().toString().slice(-5)}${randomSuffix(2)}`;
  const city = pickRandom(CITIES);
  const state = pickRandom(STATES);

  return {
    eventTitle: `${pickRandom(EVENT_TITLES)} ${unique}`,
    eventType: pickRandom(EVENT_TYPES),
    subject: pickRandom(SUBJECTS),
    subCategory: pickRandom(SUBCATEGORIES),
    website: `https://www.example-${unique.toLowerCase()}.com`,
    startDate: futureDateTime(12, 10),
    endDate: futureDateTime(12, 17),
    expiryDate: futureDate(),
    count: randomNumber(20, 100),
    state,
    city,
    fullAddress: `${city}, ${state}, India`,
    description: `Automated event created on ${new Date().toISOString()}. Join us for learning and networking.`,
  };
}

export const ALL_EVENTS_WAIT_MS = 7_500;
