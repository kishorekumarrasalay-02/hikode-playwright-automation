export type SessionCharge = 'Free' | 'Charged';
export type SessionType = 'Online' | 'Face-to-Face';
export type Intent = 'Offering' | 'Seeking';

export type CoachingRadioOptions = {
  sessionCharge: SessionCharge;
  sessionType: SessionType;
  intent: Intent;
};

export type ContributionType = 'Free' | 'Paid';
export type ContributionMode = 'Online' | 'Face-to-Face';

export type ContributionRadioOptions = {
  contributionType: ContributionType;
  mode: ContributionMode;
  intent: Intent;
};

function cartesianProduct<T extends Record<string, readonly string[]>>(
  dimensions: T,
): Array<{ [K in keyof T]: T[K][number] }> {
  const keys = Object.keys(dimensions) as (keyof T)[];
  let results: Array<Record<string, string>> = [{}];

  for (const key of keys) {
    const values = dimensions[key];
    const next: Array<Record<string, string>> = [];
    for (const partial of results) {
      for (const value of values) {
        next.push({ ...partial, [key as string]: value });
      }
    }
    results = next;
  }

  return results as Array<{ [K in keyof T]: T[K][number] }>;
}

export function coachingRadioCombinations(): CoachingRadioOptions[] {
  return [
    { sessionCharge: 'Free', sessionType: 'Online', intent: 'Offering' },
    { sessionCharge: 'Charged', sessionType: 'Face-to-Face', intent: 'Seeking' },
  ];
}

export function contributionRadioCombinations(): ContributionRadioOptions[] {
  return [
    { contributionType: 'Free', mode: 'Online', intent: 'Offering' },
    { contributionType: 'Paid', mode: 'Face-to-Face', intent: 'Seeking' },
  ];
}

export function allCoachingRadioCombinations(): CoachingRadioOptions[] {
  return cartesianProduct({
    sessionCharge: ['Free', 'Charged'] as const,
    sessionType: ['Online', 'Face-to-Face'] as const,
    intent: ['Offering', 'Seeking'] as const,
  });
}

export function allContributionRadioCombinations(): ContributionRadioOptions[] {
  return cartesianProduct({
    contributionType: ['Free', 'Paid'] as const,
    mode: ['Online', 'Face-to-Face'] as const,
    intent: ['Offering', 'Seeking'] as const,
  });
}
