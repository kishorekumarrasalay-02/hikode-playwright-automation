export type FormLocationPreset = {
  countryLabel: string;
  state: string;
  city: string;
  timezonePattern: RegExp;
};

export type SelectFilter = {
  label: string;
  optionPattern: RegExp;
  value: string;
};

export type ListFilterPreset = {
  countrySearch: string;
  countryPattern: RegExp;
  stateButton?: 'All states' | 'All cities';
  stateSearch?: string;
  statePattern?: RegExp;
  cityButton?: 'All cities' | 'All states';
  citySearch?: string;
  cityPattern?: RegExp;
  selectFilters?: SelectFilter[];
};

/** Different country / state / city / timezone per module when creating posts. */
export const MODULE_FORM_LOCATIONS: Record<'jobs' | 'events' | 'coaching' | 'contributions', FormLocationPreset> = {
  jobs: {
    countryLabel: ' India ',
    state: 'Telangana',
    city: 'Hyderabad',
    timezonePattern: /Asia — Calcutta/,
  },
  events: {
    countryLabel: 'United States of America',
    state: 'California',
    city: 'San Francisco',
    timezonePattern: /Los Angeles/,
  },
  coaching: {
    countryLabel: ' United Kingdom ',
    state: 'England',
    city: 'London',
    timezonePattern: /Europe — London/,
  },
  contributions: {
    countryLabel: ' Canada ',
    state: 'Ontario',
    city: 'Toronto',
    timezonePattern: /America — Toronto/,
  },
};

/** Different list-page filter combinations per module (not reused across modules). */
export const MODULE_LIST_FILTERS: Record<'jobs' | 'events' | 'coaching' | 'contributions', ListFilterPreset> = {
  jobs: {
    countrySearch: 'Norway',
    countryPattern: /Norway/i,
    stateButton: 'All states',
    stateSearch: 'Oslo',
    statePattern: /Oslo/i,
    selectFilters: [{ label: 'job type', optionPattern: /Full-Time/, value: 'Full-Time' }],
  },
  events: {
    countrySearch: 'Belgium',
    countryPattern: /Belgium/i,
    cityButton: 'All cities',
    citySearch: 'Brussels',
    cityPattern: /Brussels/i,
    selectFilters: [{ label: 'event type', optionPattern: /Conference/, value: 'Conference' }],
  },
  coaching: {
    countrySearch: 'Germany',
    countryPattern: /Germany/i,
    stateButton: 'All states',
    stateSearch: 'Bavaria',
    statePattern: /Bavaria/i,
    selectFilters: [{ label: 'session type', optionPattern: /Online/, value: 'Online' }],
  },
  contributions: {
    countrySearch: 'Australia',
    countryPattern: /Australia/i,
    cityButton: 'All cities',
    citySearch: 'Sydney',
    cityPattern: /Sydney/i,
    selectFilters: [{ label: 'mode', optionPattern: /Online/, value: 'Online' }],
  },
};
