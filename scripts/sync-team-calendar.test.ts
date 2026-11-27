import { afterEach, describe, expect, test } from 'bun:test';
import { fetchMemberEvents } from './sync-team-calendar';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function makeEventBatch(count: number, createdAt: string) {
  return Array.from({ length: count }, (_, idx) => ({
    created_at: createdAt,
    repo: { name: `teqniqks/repo-${idx}` },
  }));
}

describe('fetchMemberEvents', () => {
  const cutoffIso = '2026-10-01T00:00:00.000Z';
  const headers = { Accept: 'application/vnd.github+json' };

  test('returns ok: false and discards partial events when page 2 fails HTTP status', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify(makeEventBatch(100, '2026-11-20T12:00:00Z')), {
          status: 200,
        });
      }
      return new Response('Server error', { status: 500 });
    }) as unknown as typeof fetch;

    const result = await fetchMemberEvents('peenaka', cutoffIso, headers);
    expect(result).toEqual({ ok: false, events: [] });
  });

  test('returns ok: false and discards partial events when page 2 returns non-array JSON', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify(makeEventBatch(100, '2026-11-20T12:00:00Z')), {
          status: 200,
        });
      }
      return new Response(JSON.stringify({ message: 'unexpected object' }), { status: 200 });
    }) as unknown as typeof fetch;

    const result = await fetchMemberEvents('peenaka', cutoffIso, headers);
    expect(result).toEqual({ ok: false, events: [] });
  });

  test('returns ok: false and discards partial events when page 2 rejects', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) {
        return new Response(JSON.stringify(makeEventBatch(100, '2026-11-20T12:00:00Z')), {
          status: 200,
        });
      }
      throw new Error('network timeout');
    }) as unknown as typeof fetch;

    const result = await fetchMemberEvents('peenaka', cutoffIso, headers);
    expect(result).toEqual({ ok: false, events: [] });
  });

  test('returns ok: true with only in-window events when pagination completes', async () => {
    const batch = [
      ...makeEventBatch(2, '2026-11-20T12:00:00Z'),
      ...makeEventBatch(1, '2026-09-25T12:00:00Z'),
    ];
    globalThis.fetch = (async () =>
      new Response(JSON.stringify(batch), { status: 200 })) as unknown as typeof fetch;

    const result = await fetchMemberEvents('peenaka', cutoffIso, headers);
    expect(result.ok).toBe(true);
    expect(result.events).toHaveLength(2);
  });
});
