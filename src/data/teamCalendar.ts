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

export interface TeamCalendarSnapshot {
  windowStart: string; // YYYY-MM-DD (inclusive)
  windowEnd: string; // YYYY-MM-DD (inclusive)
  months: number;
  days: Record<string, CalendarDayData>;
}

const dayNotes: Record<string, string> = {
  '2026-10-07': 'K8s Operator & CLI',
  '2026-11-08': 'Heavy Sprint Day',
  '2026-11-09': 'ByteSift & Docs',
  '2026-11-11': 'Theme Engine',
  '2026-11-19': 'Filee & Battery',
  '2026-11-23': 'Active Sprint',
};

const MONTHS_COUNT = 4;

function fallbackWindowBounds(): { start: string; end: string; months: number } {
  const now = new Date();
  const startDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (MONTHS_COUNT - 1), 1),
  );
  return {
    start: startDate.toISOString().slice(0, 10),
    end: now.toISOString().slice(0, 10),
    months: MONTHS_COUNT,
  };
}

function parseGeneratedSnapshot(raw: unknown): {
  window: { start: string; end: string; months: number };
  days: Record<string, CalendarDayData>;
} {
  const fallback = fallbackWindowBounds();
  if (!raw || typeof raw !== 'object') {
    return { window: fallback, days: {} };
  }

  const candidate = raw as Partial<TeamCalendarSnapshot>;
  if (candidate.days && typeof candidate.days === 'object') {
    return {
      window: {
        start: typeof candidate.windowStart === 'string' ? candidate.windowStart : fallback.start,
        end: typeof candidate.windowEnd === 'string' ? candidate.windowEnd : fallback.end,
        months:
          typeof candidate.months === 'number' && candidate.months > 0
            ? candidate.months
            : MONTHS_COUNT,
      },
      days: candidate.days,
    };
  }

  return {
    window: fallback,
    days: raw as Record<string, CalendarDayData>,
  };
}

const parsedSnapshot = parseGeneratedSnapshot(generatedContributions);

export const calendarWindow = parsedSnapshot.window;

/**
 * Verified public GitHub activity for the 6 Teqniqks collective members
 * (last 4 months via GitHub GraphQL, synced at build time via `bun run sync:calendar`).
 */
export const teamContributions: Record<string, CalendarDayData> = Object.fromEntries(
  Object.entries(parsedSnapshot.days).map(([date, day]) => [
    date,
    dayNotes[date] ? { ...day, note: dayNotes[date] } : day,
  ]),
);

export const memberColors: Record<string, string> = {
  judebevan: '#e07a5f',
  peenaka: '#f2cc8f',
  pathumsandeepa: '#64dfdf',
  PramudithaN: '#52a468',
  sanszerif: '#c77dff',
  gihanpandula: '#ff9f1c',
};
