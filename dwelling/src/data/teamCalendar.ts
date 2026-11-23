export interface DailyContribution {
  memberName: string;
  githubHandle: string;
  repos: string[];
  eventsCount: number;
  highlight?: string;
}

export interface CalendarDayData {
  date: string; // YYYY-MM-DD
  contributions: DailyContribution[];
  note?: string;
}

/**
 * Verified public GitHub activity for the 5 JP3N collective members
 * (Oct 2026 – Nov 2026), aggregated from GitHub public events & repo pushes.
 */
export const teamContributions: Record<string, CalendarDayData> = {
  '2026-10-05': {
    date: '2026-10-05',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['booking-api'], eventsCount: 1 }
    ]
  },
  '2026-10-07': {
    date: '2026-10-07',
    note: 'K8s Operator & CLI',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['iconfigly-cli', 'iconfigly-operator'], eventsCount: 2 }
    ]
  },
  '2026-11-06': {
    date: '2026-11-06',
    contributions: [
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['pramuditha.dev'], eventsCount: 12 }
    ]
  },
  '2026-11-07': {
    date: '2026-11-07',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['iconfigly-api'], eventsCount: 1 },
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['git-tulkun', 'pramuditha.dev'], eventsCount: 5 }
    ]
  },
  '2026-11-08': {
    date: '2026-11-08',
    note: 'Heavy Sprint Day',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['iconfigly-api', 'iconfigly-web', 'iconfigly-infra'], eventsCount: 21 },
      { memberName: 'Peenaka', githubHandle: 'peenaka', repos: ['Peenaka', 'register', 'is-a-dev/register'], eventsCount: 8 },
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['pramuditha.dev', 'digital-wedding-invitation', 'jarvis'], eventsCount: 14 }
    ]
  },
  '2026-11-09': {
    date: '2026-11-09',
    note: 'ByteSift & Docs',
    contributions: [
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['bytesift', 'git-tulkun'], eventsCount: 23 },
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['iconfigly-api', 'iconfigly-docs', 'iconfigly-web'], eventsCount: 30 },
      { memberName: 'Peenaka', githubHandle: 'peenaka', repos: ['register', 'is-a-dev/register'], eventsCount: 4 }
    ]
  },
  '2026-11-10': {
    date: '2026-11-10',
    contributions: [
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['bytesift', 'git-tulkun', 'Battery-Notifier', 'angel-paradise'], eventsCount: 14 },
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['iconfigly-docs'], eventsCount: 6 },
      { memberName: 'Peenaka', githubHandle: 'peenaka', repos: ['register'], eventsCount: 2 }
    ]
  },
  '2026-11-11': {
    date: '2026-11-11',
    note: 'Theme Engine',
    contributions: [
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['theme.changer'], eventsCount: 23 }
    ]
  },
  '2026-11-12': {
    date: '2026-11-12',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['iconfigly-docs'], eventsCount: 7 }
    ]
  },
  '2026-11-13': {
    date: '2026-11-13',
    contributions: [
      { memberName: 'Peenaka', githubHandle: 'peenaka', repos: ['register', 'is-a-dev/register'], eventsCount: 13 }
    ]
  },
  '2026-11-19': {
    date: '2026-11-19',
    note: 'Filee & Battery',
    contributions: [
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['Filee'], eventsCount: 4 },
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['dynamic-readme-creature', 'PathumSandeepa'], eventsCount: 10 },
      { memberName: 'Nipun', githubHandle: 'sanszerif', repos: ['pregnantbattery', 'register'], eventsCount: 6 }
    ]
  },
  '2026-11-20': {
    date: '2026-11-20',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['dynamic-readme-creature'], eventsCount: 4 }
    ]
  },
  '2026-11-21': {
    date: '2026-11-21',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['dynamic-readme-creature', 'PathumSandeepa'], eventsCount: 7 },
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['pramuditha.dev'], eventsCount: 1 }
    ]
  },
  '2026-11-22': {
    date: '2026-11-22',
    contributions: [
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['dynamic-readme-creature'], eventsCount: 2 },
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['is-a-dev-register'], eventsCount: 1 },
      { memberName: 'Nipun', githubHandle: 'sanszerif', repos: ['register', 'is-a-dev/register'], eventsCount: 2 }
    ]
  },
  '2026-11-23': {
    date: '2026-11-23',
    note: 'Active Today',
    contributions: [
      { memberName: 'Jude', githubHandle: 'judebevan', repos: ['judebevan'], eventsCount: 1 },
      { memberName: 'Pathum', githubHandle: 'pathumsandeepa', repos: ['dynamic-readme-creature'], eventsCount: 2 },
      { memberName: 'Pramuditha', githubHandle: 'PramudithaN', repos: ['Filee', 'git-tulkun'], eventsCount: 3 },
      { memberName: 'Nipun', githubHandle: 'sanszerif', repos: ['pregnantbattery'], eventsCount: 2 }
    ]
  }
};

export const memberColors: Record<string, string> = {
  judebevan: '#e07a5f',
  peenaka: '#f2cc8f',
  pathumsandeepa: '#64dfdf',
  PramudithaN: '#52a468',
  sanszerif: '#c77dff'
};
