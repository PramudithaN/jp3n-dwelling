import generatedContributions from './teamCalendar.generated.json';

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

const dayNotes: Record<string, string> = {
  '2026-10-07': 'K8s Operator & CLI',
  '2026-11-08': 'Heavy Sprint Day',
  '2026-11-09': 'ByteSift & Docs',
  '2026-11-11': 'Theme Engine',
  '2026-11-19': 'Filee & Battery',
  '2026-11-23': 'Active Sprint',
};

const rawContributions = generatedContributions as Record<string, CalendarDayData>;

/**
 * Verified public GitHub activity for the 6 Teqniqks collective members
 * (last 2 months, synced at build time via `bun run sync:calendar`).
 */
export const teamContributions: Record<string, CalendarDayData> = Object.fromEntries(
  Object.entries(rawContributions).map(([date, day]) => [
    date,
    dayNotes[date] ? { ...day, note: dayNotes[date] } : day,
  ]),
);

const sortedSnapshotDates = Object.keys(teamContributions).sort();
export const latestSnapshotDate =
  sortedSnapshotDates[sortedSnapshotDates.length - 1] ?? '2026-01-01';
export const snapshotYear = Number(latestSnapshotDate.slice(0, 4));

export const memberColors: Record<string, string> = {
  judebevan: '#e07a5f',
  peenaka: '#f2cc8f',
  pathumsandeepa: '#64dfdf',
  PramudithaN: '#52a468',
  sanszerif: '#c77dff',
  gihanpandula: '#ff9f1c',
};
