import { describe, expect, test } from 'bun:test';
import { ALLOWED_COMMIT_TYPES, MAX_HEADER_LENGTH, validateCommitMessage } from './commitlint';

describe('validateCommitMessage', () => {
  test('accepts all allowed commit types with mandatory scope', () => {
    for (const type of ALLOWED_COMMIT_TYPES) {
      const res = validateCommitMessage(`${type}(ui): update layout`);
      expect(res.valid).toBe(true);
    }
  });

  test('accepts scopes with allowed punctuation (dots, slashes, underscores, hyphens)', () => {
    expect(validateCommitMessage('feat(ci/build): configure workflow').valid).toBe(true);
    expect(validateCommitMessage('fix(ui.nav): prevent overlap on mobile').valid).toBe(true);
    expect(validateCommitMessage('housekeep(e2e_tests): pin browser config').valid).toBe(true);
    expect(validateCommitMessage('feat(Hero-2x): support high-DPI assets').valid).toBe(true);
  });

  test('accepts multi-line body separated by a blank line and ignores git comments', () => {
    const raw = [
      'housekeep(bun): migrate toolchain from npm to bun',
      '',
      'Replace package-lock.json with bun.lock and configure bun fmt.',
      '# Please enter the commit message for your changes.',
    ].join('\n');
    const res = validateCommitMessage(raw);
    expect(res.valid).toBe(true);
    expect(res.header).toBe('housekeep(bun): migrate toolchain from npm to bun');
  });

  test('accepts single-line message with trailing newline and git comments', () => {
    const raw = 'fix(loader): center spinner ring\n# comment\n\n';
    expect(validateCommitMessage(raw).valid).toBe(true);
  });

  test('allows Git-generated Merge, Revert, fixup!, and squash! headers', () => {
    expect(validateCommitMessage('Merge pull request #42 from Teqniqks/feat').valid).toBe(true);
    expect(validateCommitMessage('Revert "feat(themes): add palette"').valid).toBe(true);
    expect(validateCommitMessage('fixup! feat(themes): add palette').valid).toBe(true);
    expect(validateCommitMessage('squash! fix(loader): resize ring').valid).toBe(true);
  });

  test('rejects empty or comment-only messages', () => {
    expect(validateCommitMessage('').valid).toBe(false);
    expect(validateCommitMessage('   \n# only a comment\n  ').valid).toBe(false);
  });

  test('rejects missing or empty scope', () => {
    expect(validateCommitMessage('feat: add new palette').valid).toBe(false);
    expect(validateCommitMessage('fix(): resolve crash').valid).toBe(false);
    expect(validateCommitMessage('housekeep( ): clean files').valid).toBe(false);
  });

  test('rejects disallowed commit types', () => {
    const disallowed = [
      'chore',
      'docs',
      'refactor',
      'test',
      'ci',
      'upgrade',
      'huge',
      'style',
      'perf',
      'build',
      'revert',
    ];
    for (const type of disallowed) {
      const res = validateCommitMessage(`${type}(core): something`);
      expect(res.valid).toBe(false);
    }
  });

  test('rejects missing description after colon', () => {
    expect(validateCommitMessage('feat(ui):   ').valid).toBe(false);
    expect(validateCommitMessage('fix(ui):').valid).toBe(false);
  });

  test('enforces max header length of 72 characters', () => {
    const prefix = 'feat(scope): ';
    const exact72 = prefix + 'a'.repeat(MAX_HEADER_LENGTH - prefix.length);
    const over72 = prefix + 'a'.repeat(MAX_HEADER_LENGTH - prefix.length + 1);
    expect(exact72.length).toBe(72);
    expect(over72.length).toBe(73);
    expect(validateCommitMessage(exact72).valid).toBe(true);
    expect(validateCommitMessage(over72).valid).toBe(false);
  });

  test('rejects trailing period on header', () => {
    const res = validateCommitMessage('fix(nav): align menu links.');
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('trailing period');
  });

  test('rejects body without a separating blank line', () => {
    const raw = 'feat(ui): add button\nThis body has no blank line above it.';
    const res = validateCommitMessage(raw);
    expect(res.valid).toBe(false);
    expect(res.reason).toContain('blank line');
  });
});
