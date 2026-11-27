import { readFileSync } from 'node:fs';

export const ALLOWED_COMMIT_TYPES = ['feat', 'fix', 'housekeep'] as const;

export const MAX_HEADER_LENGTH = 72;

const HEADER_RE = new RegExp(`^(${ALLOWED_COMMIT_TYPES.join('|')})\\([A-Za-z0-9._/-]+\\):\\s+\\S+`);

const BYPASS_PREFIXES = ['Merge ', 'Revert ', 'fixup! ', 'squash! '] as const;

export function validateCommitMessage(raw: string): {
  valid: boolean;
  header: string;
  reason?: string;
} {
  const nonCommentLines = raw.split(/\r?\n/).filter((line) => !line.startsWith('#'));

  let start = 0;
  while (start < nonCommentLines.length && nonCommentLines[start].trim() === '') {
    start++;
  }
  let end = nonCommentLines.length - 1;
  while (end >= start && nonCommentLines[end].trim() === '') {
    end--;
  }

  const contentLines = nonCommentLines.slice(start, end + 1);
  const header = contentLines[0]?.trim() ?? '';

  if (!header) {
    return { valid: false, header, reason: 'Commit message is empty.' };
  }

  if (BYPASS_PREFIXES.some((prefix) => header.startsWith(prefix))) {
    return { valid: true, header };
  }

  const errors: string[] = [];

  if (!HEADER_RE.test(header)) {
    errors.push(
      `Expected "<type>(<scope>): <description>" with mandatory scope and type in: ${ALLOWED_COMMIT_TYPES.join(', ')}.`,
    );
  }

  if (header.length > MAX_HEADER_LENGTH) {
    errors.push(`Header must be ${MAX_HEADER_LENGTH} characters or fewer (got ${header.length}).`);
  }

  if (header.endsWith('.')) {
    errors.push('Header must not end with a trailing period.');
  }

  if (contentLines.length > 1 && contentLines[1].trim() !== '') {
    errors.push('Separate subject header from body with a blank line.');
  }

  if (errors.length > 0) {
    return { valid: false, header, reason: errors.join(' ') };
  }

  return { valid: true, header };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  let raw = '';
  const msgIdx = args.indexOf('--msg');
  if (msgIdx >= 0 && args[msgIdx + 1] !== undefined) {
    raw = args[msgIdx + 1];
  } else if (args[0]) {
    raw = readFileSync(args[0], 'utf8');
  } else {
    console.error('Usage: bun scripts/commitlint.ts <msg-file> | --msg <text>');
    process.exit(1);
  }

  const res = validateCommitMessage(raw);
  if (!res.valid) {
    console.error(`Invalid commit message: "${res.header}"`);
    console.error(res.reason);
    console.error('Allowed types: feat, fix, housekeep (scope is mandatory)');
    console.error('Examples:');
    console.error('  feat(themes): add solarized dusk palette');
    console.error('  fix(loader): resize spinner ring for brand alignment');
    console.error('  housekeep(bun): migrate toolchain from npm to bun');
    process.exit(1);
  }
}
