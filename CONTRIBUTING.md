# Contributing to Teqniqks

Thank you for your interest in contributing to Teqniqks! We welcome open-source contributions from developers, technical writers, and designers.

---

## Code of Craft

1. **Zero Fluff:** Keep pull requests targeted and focused on single responsibilities.
2. **Performance First:** No dependencies added without written justification in the PR description.
3. **Flat Aesthetics:** Adhere strictly to the design tokens in `src/styles/tokens.css`. Never introduce arbitrary hex codes or gradients.
4. **Verifiable Truth:** Never submit fictional testimonials, synthetic stats, or AI placeholder tropes (no `//` or `●` markers).

---

## Active Projects

Check `src/content/contributors/` for our curated active repositories and good first issues:

- **Theme Changer Engine:** Color science, OKLCH space, zero-FOUC presets.
- **ByteSift Binary Inspector:** WebAssembly stream parsing and high-throughput filters.
- **Battery Telemetry:** Web API enhancements and cross-platform tests.

---

## Getting Started

1. Fork and clone the repository.
2. Ensure [Bun](https://bun.sh/) `>=1.4.5` is installed, then install dependencies:
   ```bash
   bun install
   ```
3. Run the development server:
   ```bash
   bun run dev
   ```
4. Check formatting and verify your build passes cleanly:
   ```bash
   bun run format:check
   bun run build
   ```
5. Enable the repository commit hooks (configured automatically on `bun install` via `prepare`):
   ```bash
   git config core.hooksPath .githooks
   ```
6. Submit your PR with a clear description of the problem solved.

---

## Formatting & Pre-Commit Hook

All staged files are automatically formatted and re-staged on commit by `.githooks/pre-commit` (`scripts/pre-commit.ts`) using `bun fmt --no-script --staged`:

- JavaScript, TypeScript, CSS, JSON, YAML, and Markdown are formatted natively by `bun fmt` per `bunfig.toml`.
- `.astro` components are formatted via `.prettierrc` + `prettier-plugin-astro`.
- Built GitHub Pages assets in `docs/` are ignored by formatting.
- If a file has both staged and unstaged changes and needs formatting, `bun fmt --staged` stops with exit code `2` — run `bun fmt` or stage the whole file and retry.

---

## Commit & Branch Ruleset

Direct commits to `main` are blocked locally by `.githooks/pre-commit` and on GitHub via Pull Request rules:

- **Branching:** Always create a branch (`git checkout -b feat/short-name`) and open a Pull Request into `main`.
- **PR Approvals:** Requires at least **1 approving review** from a reviewer other than the PR author/last pusher, with all review threads resolved.
- **Required CI Checks:** `Build & Verify Site` and `Validate Conventional Commits` must pass before merging.

All commits are validated locally by `.githooks/commit-msg` (`scripts/commitlint.ts`) and in CI by `.github/workflows/commit-rules.yml`:

- **Format:** `<type>(<scope>): <description>` (**scope is mandatory**)
- **Allowed types:** `feat`, `fix`, `housekeep`
- **Scope format:** `[A-Za-z0-9._/-]+`
- **Rules:**
  - Subject header must be 72 characters or fewer and must not end with a trailing period.
  - Separate subject header from body with a blank line.
  - Git-generated `Merge `, `Revert `, `fixup! `, and `squash! ` headers are permitted.
- **Examples:**
  - `feat(themes): add solarized dusk palette`
  - `fix(loader): resize spinner ring for brand alignment`
  - `housekeep(bun): migrate toolchain from npm to bun`
