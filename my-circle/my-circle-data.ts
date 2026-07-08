/** Pool of names to search — flow skips anyone already in My Circle. */
export const HIKODE_RECIPIENT_CANDIDATES = [
  'Jagadeesh',
  'Lokesh',
  'Aditya',
  'Ann',
  'Kiran',
  'Julie',
  'Prasanth',
] as const;


/** How many new HiKode fellows to add per run (2–3 is enough). */
export const HIKODE_FELLOW_TARGET_COUNT = 3;

export const EXTERNAL_EMAILS = [
  () => `fellow.one.${Date.now()}@ratnamsolutions.com`,
  () => `fellow.two.${Date.now()}@ratnamsolutions.com`,
] as const;

export const CONNECTION_MESSAGE = {
  subject: "Let's Connect!",
  body: `Hi,

I'd like to connect with you to engage in sharing knowledge and skills as a HiKoder.

Regards`,
} as const;

export function nameMatchesExisting(candidate: string, existingNames: string[]): boolean {
  const token = candidate.split(' ')[0].toLowerCase();
  return existingNames.some((existing) => {
    const existingToken = existing.split(' ')[0].toLowerCase();
    return (
      existing.includes(token) ||
      token.includes(existingToken) ||
      existingToken.includes(token)
    );
  });
}
