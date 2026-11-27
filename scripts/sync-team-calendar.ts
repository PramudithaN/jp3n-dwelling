import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../src/config/site';
import type { CalendarDayData, DailyContribution } from '../src/data/teamCalendar';

interface GitHubPublicEvent {
  created_at?: string;
  repo?: {
    name?: string;
  };
}

const VALID_REPO_RE = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)?$/;
const MAX_PAGES_PER_MEMBER = 3;
const PER_PAGE = 100;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(__dirname, '../src/data/teamCalendar.generated.json');

/** Start of the previous UTC calendar month (last 2 full months window). */
function getTwoMonthCutoffUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0));
}

function formatRepoShort(fullRepo: string, handle: string): string {
  const prefix = `${handle.toLowerCase()}/`;
  return fullRepo.toLowerCase().startsWith(prefix) ? fullRepo.slice(prefix.length) : fullRepo;
}

export async function fetchMemberEvents(
  handle: string,
  cutoffIso: string,
  headers: Record<string, string>,
): Promise<{ ok: boolean; events: GitHubPublicEvent[] }> {
  const collected: GitHubPublicEvent[] = [];

  for (let page = 1; page <= MAX_PAGES_PER_MEMBER; page++) {
    const url = `https://api.github.com/users/${encodeURIComponent(handle)}/events/public?per_page=${PER_PAGE}&page=${page}`;
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        return { ok: false, events: [] };
      }
      const batch = (await res.json()) as unknown;
      if (!Array.isArray(batch)) {
        return { ok: false, events: [] };
      }
      for (const item of batch) {
        const ev = item as GitHubPublicEvent;
        if (ev?.created_at && ev.created_at >= cutoffIso) {
          collected.push(ev);
        }
      }
      const last = batch[batch.length - 1] as GitHubPublicEvent | undefined;
      if (batch.length < PER_PAGE || !last?.created_at || last.created_at < cutoffIso) {
        return { ok: true, events: collected };
      }
    } catch {
      return { ok: false, events: [] };
    }
  }

  return { ok: true, events: collected };
}

async function syncTeamCalendar(): Promise<void> {
  const cutoffDate = getTwoMonthCutoffUtc();
  const cutoffIso = cutoffDate.toISOString();
  const cutoffDateStr = cutoffIso.slice(0, 10);

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'teqniqks-calendar-sync',
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const byDate: Record<string, CalendarDayData> = {};
  let succeededMembers = 0;

  // Preserve older entries already outside the current 2-month window if desired?
  // No: keep strictly the last 2 full months of live GitHub activity when sync succeeds.
  const results = await Promise.all(
    siteConfig.team.map(async (member) => {
      const shortName = member.name.split(' ')[0];
      const handle = member.githubHandle;
      const result = await fetchMemberEvents(handle, cutoffIso, headers);
      return { shortName, handle, ...result };
    }),
  );

  for (const res of results) {
    if (!res.ok) continue;
    succeededMembers += 1;

    for (const ev of res.events) {
      if (!ev.created_at || !ev.repo?.name) continue;
      const dateStr = String(ev.created_at).slice(0, 10);
      if (dateStr < cutoffDateStr) continue;

      const repoName = String(ev.repo.name).trim();
      if (!VALID_REPO_RE.test(repoName)) continue;
      const repoShort = formatRepoShort(repoName, res.handle);

      if (!byDate[dateStr]) {
        byDate[dateStr] = { date: dateStr, contributions: [] };
      }

      let entry: DailyContribution | undefined = byDate[dateStr].contributions.find(
        (c) => c.githubHandle === res.handle,
      );
      if (!entry) {
        entry = {
          memberName: res.shortName,
          githubHandle: res.handle,
          repos: [repoShort],
          eventsCount: 1,
        };
        byDate[dateStr].contributions.push(entry);
      } else {
        entry.eventsCount += 1;
        if (!entry.repos.includes(repoShort)) {
          entry.repos.push(repoShort);
        }
      }
    }
  }

  if (succeededMembers === 0) {
    if (existsSync(OUTPUT_PATH)) {
      console.warn(
        '[sync-calendar] All GitHub API requests failed; keeping existing snapshot unchanged.',
      );
      return;
    }
    writeFileSync(OUTPUT_PATH, '{}\n', 'utf8');
    console.warn('[sync-calendar] Offline and no existing snapshot; wrote empty snapshot.');
    return;
  }

  // Merge in any still-in-window contributions for members whose live fetch failed
  if (succeededMembers < siteConfig.team.length && existsSync(OUTPUT_PATH)) {
    const failedHandles = new Set(results.filter((r) => !r.ok).map((r) => r.handle));
    try {
      const existing = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8')) as Record<
        string,
        CalendarDayData
      >;
      for (const [dateStr, day] of Object.entries(existing)) {
        if (dateStr < cutoffDateStr) continue;
        for (const c of day.contributions) {
          if (!failedHandles.has(c.githubHandle)) continue;
          if (!byDate[dateStr]) {
            byDate[dateStr] = { date: dateStr, contributions: [] };
          }
          byDate[dateStr].contributions.push(c);
        }
      }
    } catch {
      // Ignore malformed existing snapshot
    }
  }

  const sortedOutput: Record<string, CalendarDayData> = {};
  for (const dateKey of Object.keys(byDate).sort()) {
    const day = byDate[dateKey];
    day.contributions.sort(
      (a, b) => b.eventsCount - a.eventsCount || a.memberName.localeCompare(b.memberName),
    );
    sortedOutput[dateKey] = day;
  }

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(sortedOutput, null, 2)}\n`, 'utf8');
  console.log(
    `[sync-calendar] Synced ${Object.keys(sortedOutput).length} active days since ${cutoffDateStr} (${succeededMembers}/${siteConfig.team.length} members).`,
  );
}

if (import.meta.main) {
  await syncTeamCalendar();
}
