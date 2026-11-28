import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/config/site';
import type {
  CalendarDayData,
  DailyContribution,
  TeamCalendarSnapshot,
} from '../src/data/teamCalendar';

export interface ContributionWindow {
  fromIso: string;
  toIso: string;
}

export interface NormalizedContributionEvent {
  dateStr: string;
  repoName: string;
  count: number;
}

export interface SyncTeamCalendarOptions {
  strict?: boolean;
  token?: string;
  outputPath?: string;
  now?: Date;
  ifMissing?: boolean;
}

interface RepoContributionGroup {
  repository?: {
    nameWithOwner?: string;
    isPrivate?: boolean;
  };
  contributions?: {
    nodes?: Array<{
      occurredAt?: string;
      commitCount?: number;
    }>;
  };
}

interface ContributionsGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        commitContributionsByRepository?: RepoContributionGroup[];
        pullRequestContributionsByRepository?: RepoContributionGroup[];
        issueContributionsByRepository?: RepoContributionGroup[];
        pullRequestReviewContributionsByRepository?: RepoContributionGroup[];
      } | null;
    } | null;
  };
  errors?: Array<{ message?: string }>;
}

const VALID_REPO_RE = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;
const MONTHS_WINDOW = 4;
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_OUTPUT_PATH = path.resolve(
  __dirname,
  '../src/data/teamCalendar.generated.json',
);

const CONTRIBUTIONS_QUERY = `
  query TeamMemberContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        commitContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            isPrivate
          }
          contributions(first: 100) {
            nodes {
              occurredAt
              commitCount
            }
          }
        }
        pullRequestContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            isPrivate
          }
          contributions(first: 100) {
            nodes {
              occurredAt
            }
          }
        }
        issueContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            isPrivate
          }
          contributions(first: 100) {
            nodes {
              occurredAt
            }
          }
        }
        pullRequestReviewContributionsByRepository(maxRepositories: 100) {
          repository {
            nameWithOwner
            isPrivate
          }
          contributions(first: 100) {
            nodes {
              occurredAt
            }
          }
        }
      }
    }
  }
`;

/** Split the 4-month UTC window into two contiguous 2-month GraphQL queries. */
export function getFourMonthWindowsUtc(now: Date = new Date()): {
  windowStart: string;
  windowEnd: string;
  windows: ContributionWindow[];
} {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  const w1Start = new Date(Date.UTC(y, m - 3, 1, 0, 0, 0, 0));
  const w2Start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0));
  const w1End = new Date(w2Start.getTime() - 1);
  const w2End = new Date(now.getTime());

  return {
    windowStart: w1Start.toISOString().slice(0, 10),
    windowEnd: w2End.toISOString().slice(0, 10),
    windows: [
      { fromIso: w1Start.toISOString(), toIso: w1End.toISOString() },
      { fromIso: w2Start.toISOString(), toIso: w2End.toISOString() },
    ],
  };
}

function formatRepoShort(fullRepo: string, handle: string): string {
  const prefix = `${handle.toLowerCase()}/`;
  return fullRepo.toLowerCase().startsWith(prefix) ? fullRepo.slice(prefix.length) : fullRepo;
}

function collectGroupEvents(
  groups: RepoContributionGroup[] | undefined,
  useCommitCount: boolean,
  out: NormalizedContributionEvent[],
): void {
  if (!Array.isArray(groups)) return;
  for (const group of groups) {
    const repo = group?.repository;
    if (!repo || repo.isPrivate === true || !repo.nameWithOwner) continue;
    const repoName = repo.nameWithOwner.trim();
    if (!VALID_REPO_RE.test(repoName)) continue;

    const nodes = group.contributions?.nodes;
    if (!Array.isArray(nodes)) continue;
    for (const node of nodes) {
      if (!node?.occurredAt) continue;
      const dateStr = String(node.occurredAt).slice(0, 10);
      const rawCount = useCommitCount ? Number(node.commitCount ?? 0) : 1;
      const count = Number.isFinite(rawCount) && rawCount > 0 ? Math.trunc(rawCount) : 0;
      if (count > 0) {
        out.push({ dateStr, repoName, count });
      }
    }
  }
}

export async function fetchMemberContributions(
  handle: string,
  windows: ContributionWindow[],
  headers: Record<string, string>,
): Promise<{ ok: boolean; error?: string; events: NormalizedContributionEvent[] }> {
  const collected: NormalizedContributionEvent[] = [];

  for (const win of windows) {
    try {
      const res = await fetch(GITHUB_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CONTRIBUTIONS_QUERY,
          variables: {
            login: handle,
            from: win.fromIso,
            to: win.toIso,
          },
        }),
      });

      if (!res.ok) {
        return {
          ok: false,
          error: `HTTP ${res.status} (${win.fromIso.slice(0, 10)}..${win.toIso.slice(0, 10)})`,
          events: [],
        };
      }

      const payload = (await res.json()) as ContributionsGraphQLResponse;
      if (Array.isArray(payload.errors) && payload.errors.length > 0) {
        const firstMsg = payload.errors[0]?.message || 'GraphQL error';
        return { ok: false, error: firstMsg, events: [] };
      }

      const collection = payload.data?.user?.contributionsCollection;
      if (!collection) {
        return {
          ok: false,
          error: `Missing user/contributionsCollection for @${handle}`,
          events: [],
        };
      }

      collectGroupEvents(collection.commitContributionsByRepository, true, collected);
      collectGroupEvents(collection.pullRequestContributionsByRepository, false, collected);
      collectGroupEvents(collection.issueContributionsByRepository, false, collected);
      collectGroupEvents(collection.pullRequestReviewContributionsByRepository, false, collected);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg, events: [] };
    }
  }

  return { ok: true, events: collected };
}

function readExistingDays(outputPath: string): Record<string, CalendarDayData> {
  if (!existsSync(outputPath)) return {};
  try {
    const parsed = JSON.parse(readFileSync(outputPath, 'utf8')) as
      Partial<TeamCalendarSnapshot> | Record<string, CalendarDayData>;
    if (
      parsed &&
      typeof parsed === 'object' &&
      'days' in parsed &&
      parsed.days &&
      typeof parsed.days === 'object'
    ) {
      return parsed.days as Record<string, CalendarDayData>;
    }
    return parsed as Record<string, CalendarDayData>;
  } catch {
    return {};
  }
}

function writeSnapshotFile(
  outputPath: string,
  windowStart: string,
  windowEnd: string,
  days: Record<string, CalendarDayData>,
): void {
  mkdirSync(path.dirname(outputPath), { recursive: true });
  const snapshot: TeamCalendarSnapshot = {
    windowStart,
    windowEnd,
    months: MONTHS_WINDOW,
    days,
  };
  writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
}

export async function syncTeamCalendar(options: SyncTeamCalendarOptions = {}): Promise<void> {
  const outputPath = options.outputPath ?? DEFAULT_OUTPUT_PATH;
  const ifMissing = options.ifMissing ?? process.argv.includes('--if-missing');
  if (ifMissing && existsSync(outputPath)) {
    return;
  }

  const strict =
    options.strict ??
    (process.argv.includes('--strict') ||
      (process.env.CI === 'true' && process.env.ALLOW_OFFLINE_CALENDAR !== 'true'));

  const now = options.now ?? new Date();
  const { windowStart, windowEnd, windows } = getFourMonthWindowsUtc(now);
  const token =
    options.token !== undefined
      ? options.token.trim()
      : process.env.CALENDAR_READ_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || '';

  if (!token) {
    if (strict) {
      throw new Error(
        '[sync-calendar] Missing CALENDAR_READ_TOKEN (PAT with read:user scope) in strict/CI mode.',
      );
    }
    if (existsSync(outputPath)) {
      console.warn(
        '[sync-calendar] No GraphQL token found; keeping existing calendar snapshot unchanged.',
      );
      return;
    }
    writeSnapshotFile(outputPath, windowStart, windowEnd, {});
    console.warn(
      '[sync-calendar] No GraphQL token found and no existing snapshot; wrote empty 4-month snapshot for local dev.',
    );
    return;
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'teqniqks-calendar-sync',
  };

  const results = await Promise.all(
    siteConfig.team.map(async (member) => {
      const shortName = member.name.split(' ')[0];
      const handle = member.githubHandle;
      const result = await fetchMemberContributions(handle, windows, headers);
      return { shortName, handle, ...result };
    }),
  );

  const failedResults = results.filter((r) => !r.ok);
  const succeededMembers = results.length - failedResults.length;

  if (failedResults.length > 0 && strict) {
    const details = failedResults.map((f) => `@${f.handle} (${f.error || 'unknown'})`).join(', ');
    throw new Error(
      `[sync-calendar] Failed to fetch GitHub GraphQL contributions for ${failedResults.length}/${results.length} members in strict mode: ${details}`,
    );
  }

  if (succeededMembers === 0) {
    if (existsSync(outputPath)) {
      console.warn(
        '[sync-calendar] All GitHub GraphQL requests failed; keeping existing snapshot unchanged.',
      );
      return;
    }
    writeSnapshotFile(outputPath, windowStart, windowEnd, {});
    console.warn('[sync-calendar] Offline and no existing snapshot; wrote empty 4-month snapshot.');
    return;
  }

  const byDate: Record<string, CalendarDayData> = {};

  for (const res of results) {
    if (!res.ok) continue;

    for (const ev of res.events) {
      if (ev.dateStr < windowStart || ev.dateStr > windowEnd) continue;
      const repoShort = formatRepoShort(ev.repoName, res.handle);

      if (!byDate[ev.dateStr]) {
        byDate[ev.dateStr] = { date: ev.dateStr, contributions: [] };
      }

      let entry: DailyContribution | undefined = byDate[ev.dateStr].contributions.find(
        (c) => c.githubHandle === res.handle,
      );
      if (!entry) {
        entry = {
          memberName: res.shortName,
          githubHandle: res.handle,
          repos: [repoShort],
          eventsCount: ev.count,
        };
        byDate[ev.dateStr].contributions.push(entry);
      } else {
        entry.eventsCount += ev.count;
        if (!entry.repos.includes(repoShort)) {
          entry.repos.push(repoShort);
        }
      }
    }
  }

  // In non-strict local mode, retain still-in-window entries for any failed members.
  if (failedResults.length > 0) {
    const failedHandles = new Set(failedResults.map((f) => f.handle));
    const existingDays = readExistingDays(outputPath);
    for (const [dateStr, day] of Object.entries(existingDays)) {
      if (dateStr < windowStart || dateStr > windowEnd) continue;
      for (const c of day.contributions) {
        if (!failedHandles.has(c.githubHandle)) continue;
        if (!byDate[dateStr]) {
          byDate[dateStr] = { date: dateStr, contributions: [] };
        }
        byDate[dateStr].contributions.push(c);
      }
    }
    console.warn(
      `[sync-calendar] Partial local sync (${succeededMembers}/${results.length}); retained cached entries for failed members.`,
    );
  }

  const sortedDays: Record<string, CalendarDayData> = {};
  for (const dateKey of Object.keys(byDate).sort()) {
    const day = byDate[dateKey];
    day.contributions.sort(
      (a, b) => b.eventsCount - a.eventsCount || a.memberName.localeCompare(b.memberName),
    );
    sortedDays[dateKey] = day;
  }

  writeSnapshotFile(outputPath, windowStart, windowEnd, sortedDays);
  console.log(
    `[sync-calendar] Synced ${Object.keys(sortedDays).length} active days (${windowStart}..${windowEnd}, ${succeededMembers}/${siteConfig.team.length} members).`,
  );
}

if (import.meta.main) {
  try {
    await syncTeamCalendar();
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}
