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
2. Install dependencies:
   ```bash
   cd teqniqks
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Verify your build passes cleanly:
   ```bash
   npm run build
   ```
5. Enable the repository commit hook (automatically configured on `npm install`):
   ```bash
   git config core.hooksPath .githooks
   ```
6. Submit your PR with a clear description of the problem solved.

---

## Commit & Branch Ruleset
Direct commits to `main` are blocked locally by `.githooks/pre-commit` and on GitHub via Pull Request rules:

- **Branching:** Always create a branch (`git checkout -b feat/short-name`) and open a Pull Request into `main`.
- **PR Approvals:** Requires at least **1 approving review** from a reviewer other than the PR author/last pusher, with all review threads resolved.
- **Required CI Checks:** `Build & Verify Site` and `Validate Conventional Commits` must pass before merging.

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, enforced locally by `.githooks/commit-msg` and in CI by `.github/workflows/commit-rules.yml`:

- **Format:** `<type>(<optional-scope>): <lowercase summary>`
- **Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Rules:**
  - Subject line must be 72 characters or fewer and must not end with a period.
  - Separate subject from body with a blank line.
- **Examples:**
  - `feat(team): add Gihan Pandula to collective`
  - `fix(loader): resize spinner ring for Teqniqks brand`
  - `docs(readme): update repository links`
