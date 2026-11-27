import { spawnSync } from 'node:child_process';

function getCurrentBranch(): string {
  const res = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' });
  return res.status === 0 ? res.stdout.trim() : '';
}

const branch = getCurrentBranch();
if (branch === 'main' || branch === 'master') {
  console.error(`\n[branch-rules] Direct commits to "${branch}" are blocked.\n`);
  console.error('Create a feat, fix, or housekeep branch and open a Pull Request instead:');
  console.error('  git checkout -b feat/your-change\n');
  process.exit(1);
}

const fmt = spawnSync('bun', ['fmt', '--no-script', '--staged'], { stdio: 'inherit' });
if (fmt.error) {
  console.error('[pre-commit] Failed to run `bun fmt --staged`:', fmt.error.message);
  process.exit(1);
}

if (fmt.status !== 0) {
  if (fmt.status === 2) {
    console.error(
      '\n[pre-commit] Staged formatting stopped (partially staged file needs formatting or syntax error).',
    );
    console.error('Run `bun fmt` (or stage the full file) and retry your commit.\n');
  }
  process.exit(fmt.status ?? 1);
}
