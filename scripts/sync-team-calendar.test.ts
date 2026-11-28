import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'bun:test';
import {
  fetchMemberContributions,
  getFourMonthWindowsUtc,
  syncTeamCalendar,
} from './sync-team-calendar';

const originalFetch = globalThis.fetch;
const tempDirs: string[] = [];

afterEach(() => {
  globalThis.fetch = originalFetch;
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

function makeGraphQLCollection({
  commits = [] as Array<{
    repo: string;
    isPrivate?: boolean;
    occurredAt: string;
    commitCount: number;
  }>,
  prs = [] as Array<{ repo: string; isPrivate?: boolean; occurredAt: string }>,
  issues = [] as Array<{ repo: string; isPrivate?: boolean; occurredAt: string }>,
  reviews = [] as Array<{ repo: string; isPrivate?: boolean; occurredAt: string }>,
} = {}) {
  const groupByRepo = (
    items: Array<{ repo: string; isPrivate?: boolean; occurredAt: string; commitCount?: number }>,
  ) => {
    const grouped = new Map<
      string,
      { isPrivate: boolean; nodes: Array<{ occurredAt: string; commitCount?: number }> }
    >();
    for (const item of items) {
      const current = grouped.get(item.repo) ?? { isPrivate: Boolean(item.isPrivate), nodes: [] };
      current.nodes.push(
        item.commitCount !== undefined
          ? { occurredAt: item.occurredAt, commitCount: item.commitCount }
          : { occurredAt: item.occurredAt },
      );
      grouped.set(item.repo, current);
    }
    return [...grouped.entries()].map(([nameWithOwner, val]) => ({
      repository: { nameWithOwner, isPrivate: val.isPrivate },
      contributions: { nodes: val.nodes },
    }));
  };

  return {
    data: {
      user: {
        contributionsCollection: {
          commitContributionsByRepository: groupByRepo(commits),
          pullRequestContributionsByRepository: groupByRepo(prs),
          issueContributionsByRepository: groupByRepo(issues),
          pullRequestReviewContributionsByRepository: groupByRepo(reviews),
        },
      },
    },
  };
}

describe('getFourMonthWindowsUtc', () => {
  test('builds two contiguous 2-month windows spanning 4 calendar months', () => {
    const now = new Date('2026-11-28T05:30:00.000Z');
    const result = getFourMonthWindowsUtc(now);
    expect(result.windowStart).toBe('2026-08-01');
    expect(result.windowEnd).toBe('2026-11-28');
    expect(result.windows).toEqual([
      { fromIso: '2026-08-01T00:00:00.000Z', toIso: '2026-09-30T23:59:59.999Z' },
      { fromIso: '2026-10-01T00:00:00.000Z', toIso: '2026-11-28T05:30:00.000Z' },
    ]);
  });

  test('handles year boundaries correctly', () => {
    const now = new Date('2027-02-15T12:00:00.000Z');
    const result = getFourMonthWindowsUtc(now);
    expect(result.windowStart).toBe('2026-11-01');
    expect(result.windowEnd).toBe('2027-02-15');
    expect(result.windows[0].fromIso).toBe('2026-11-01T00:00:00.000Z');
    expect(result.windows[0].toIso).toBe('2026-12-31T23:59:59.999Z');
    expect(result.windows[1].fromIso).toBe('2027-01-01T00:00:00.000Z');
  });
});

describe('fetchMemberContributions', () => {
  const { windows } = getFourMonthWindowsUtc(new Date('2026-11-28T05:30:00.000Z'));
  const headers = { Authorization: 'Bearer test-token' };

  test('returns ok: false when window 2 fails with non-2xx HTTP status', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify(makeGraphQLCollection()), { status: 200 });
      }
      return new Response('Forbidden', { status: 403 });
    }) as unknown as typeof fetch;

    const result = await fetchMemberContributions('peenaka', windows, headers);
    expect(result.ok).toBe(false);
    expect(result.events).toEqual([]);
  });

  test('returns ok: false when GraphQL returns an errors array', async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({ errors: [{ message: 'Resource not accessible by integration' }] }),
        { status: 200 },
      )) as unknown as typeof fetch;

    const result = await fetchMemberContributions('peenaka', windows, headers);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('Resource not accessible');
    expect(result.events).toEqual([]);
  });

  test('returns ok: false when user is null or network throws', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify({ data: { user: null } }), { status: 200 });
      }
      throw new Error('socket closed');
    }) as unknown as typeof fetch;

    const r1 = await fetchMemberContributions('peenaka', windows, headers);
    expect(r1.ok).toBe(false);
    const r2 = await fetchMemberContributions('peenaka', windows, headers);
    expect(r2.ok).toBe(false);
  });

  test('excludes private repos and aggregates public commits, PRs, issues, and reviews', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(
          JSON.stringify(
            makeGraphQLCollection({
              commits: [
                {
                  repo: 'Peenaka/ContexaForge',
                  isPrivate: false,
                  occurredAt: '2026-08-14T07:00:00Z',
                  commitCount: 3,
                },
                {
                  repo: 'Peenaka/secret-internal',
                  isPrivate: true,
                  occurredAt: '2026-08-15T07:00:00Z',
                  commitCount: 9,
                },
              ],
            }),
          ),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify(
          makeGraphQLCollection({
            commits: [
              {
                repo: 'Teqniqks/teqniqks',
                isPrivate: false,
                occurredAt: '2026-11-26T08:00:00Z',
                commitCount: 4,
              },
            ],
            prs: [
              { repo: 'Teqniqks/teqniqks', isPrivate: false, occurredAt: '2026-11-26T18:00:00Z' },
            ],
            issues: [
              { repo: 'Teqniqks/secret-ops', isPrivate: true, occurredAt: '2026-11-26T19:00:00Z' },
            ],
            reviews: [
              { repo: 'Teqniqks/teqniqks', isPrivate: false, occurredAt: '2026-11-27T10:00:00Z' },
            ],
          }),
        ),
        { status: 200 },
      );
    }) as unknown as typeof fetch;

    const result = await fetchMemberContributions('peenaka', windows, headers);
    expect(result.ok).toBe(true);
    expect(result.events).toEqual([
      { dateStr: '2026-08-14', repoName: 'Peenaka/ContexaForge', count: 3 },
      { dateStr: '2026-11-26', repoName: 'Teqniqks/teqniqks', count: 4 },
      { dateStr: '2026-11-26', repoName: 'Teqniqks/teqniqks', count: 1 },
      { dateStr: '2026-11-27', repoName: 'Teqniqks/teqniqks', count: 1 },
    ]);
  });
});

describe('syncTeamCalendar strict vs offline behavior', () => {
  test('throws in strict mode when token is missing', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'tq-cal-'));
    tempDirs.push(dir);
    await expect(
      syncTeamCalendar({
        strict: true,
        token: '',
        outputPath: path.join(dir, 'cal.json'),
        now: new Date('2026-11-28T05:30:00.000Z'),
      }),
    ).rejects.toThrow('CALENDAR_READ_TOKEN');
  });

  test('writes empty snapshot in non-strict mode when token is missing', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'tq-cal-'));
    tempDirs.push(dir);
    const outPath = path.join(dir, 'cal.json');

    await syncTeamCalendar({
      strict: false,
      token: '',
      outputPath: outPath,
      now: new Date('2026-11-28T05:30:00.000Z'),
    });

    const written = JSON.parse(readFileSync(outPath, 'utf8'));
    expect(written).toEqual({
      windowStart: '2026-08-01',
      windowEnd: '2026-11-28',
      months: 4,
      days: {},
    });
  });

  test('throws in strict mode when any of the 6 members fail', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'tq-cal-'));
    tempDirs.push(dir);
    const outPath = path.join(dir, 'cal.json');

    globalThis.fetch = (async (_url, init) => {
      const body = JSON.parse(String(init?.body ?? '{}'));
      if (body.variables?.login === 'gihanpandula') {
        return new Response('Rate limited', { status: 403 });
      }
      return new Response(JSON.stringify(makeGraphQLCollection()), { status: 200 });
    }) as unknown as typeof fetch;

    await expect(
      syncTeamCalendar({
        strict: true,
        token: 'test-token',
        outputPath: outPath,
        now: new Date('2026-11-28T05:30:00.000Z'),
      }),
    ).rejects.toThrow('@gihanpandula');
  });

  test('writes bounded 4-month snapshot when all 6 members succeed', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'tq-cal-'));
    tempDirs.push(dir);
    const outPath = path.join(dir, 'cal.json');

    globalThis.fetch = (async (_url, init) => {
      const body = JSON.parse(String(init?.body ?? '{}'));
      const login = body.variables?.login;
      const from = body.variables?.from;
      if (login === 'peenaka' && from.startsWith('2026-08')) {
        return new Response(
          JSON.stringify(
            makeGraphQLCollection({
              commits: [
                {
                  repo: 'Peenaka/ContexaForge',
                  isPrivate: false,
                  occurredAt: '2026-08-20T07:00:00Z',
                  commitCount: 5,
                },
              ],
            }),
          ),
          { status: 200 },
        );
      }
      return new Response(JSON.stringify(makeGraphQLCollection()), { status: 200 });
    }) as unknown as typeof fetch;

    await syncTeamCalendar({
      strict: true,
      token: 'test-token',
      outputPath: outPath,
      now: new Date('2026-11-28T05:30:00.000Z'),
    });

    const written = JSON.parse(readFileSync(outPath, 'utf8'));
    expect(written.windowStart).toBe('2026-08-01');
    expect(written.windowEnd).toBe('2026-11-28');
    expect(written.months).toBe(4);
    expect(written.days['2026-08-20'].contributions).toEqual([
      {
        memberName: 'Peenaka',
        githubHandle: 'peenaka',
        repos: ['ContexaForge'],
        eventsCount: 5,
      },
    ]);
  });
});
