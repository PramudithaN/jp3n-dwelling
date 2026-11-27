# AGENTS.md

Guardrails, invariants, and engineering standards for AI coding agents working in **Teqniqks**.

---

## 1. Toolchain & Dependencies

- Use `bun` and `bunx` exclusively (`>=1.4.5`). Never use `npm`, `npx`, or `node`, and never generate `package-lock.json` (`bun.lock` is the sole lockfile).
- Never add a script named `"fmt"` to `package.json` — it shadows Bun's built-in `bun fmt` command.
- Do not add any `dependencies` or `devDependencies` without explicit written justification in the PR description.
- `bun run contexaforge` (`bunx github:Peenaka/ContexaForge`) can overwrite `AGENTS.md`; never accept blind overwrites of this file.

---

## 2. Formatting & Build Output Guardrails

- **Never hand-edit generated files.** `./dist` and `src/data/teamCalendar.generated.json` are gitignored build/sync artifacts generated via `bun run build` / `bun run sync:calendar`.
- Keep `dist/` and `src/data/teamCalendar.generated.json` excluded from `bunfig.toml` (`[fmt] ignorePatterns`), `.prettierignore`, and `dist` excluded in `tsconfig.json` (`exclude`).
- Keep formatting options identical between `bunfig.toml` (`[fmt]`) and `.prettierrc` (`bun fmt` formats native languages directly and delegates `.astro` files to Prettier via `prettier-plugin-astro`).
- Pre-commit runs `bun fmt --no-script --staged`. Exit code `2` means a partially staged file needs formatting — stage the full file (`git add`) or run `bun fmt` and retry.

---

## 3. Code, Design & Privacy Rules

- **Routing:** Always wrap internal links and asset paths with `withBase()` from `src/utils/url.ts`; never hardcode base or site prefixes.
- **Flat Aesthetics:** Use only CSS custom properties from `src/styles/tokens.css` and palettes from `src/config/theme.ts`. Never introduce arbitrary hex codes or gradients.
- **Zero-Cookie Privacy:** Maintain strict compliance with Sri Lanka PDPA No. 9 of 2022 and EU GDPR — zero cookies, zero third-party analytics or external scripts, and self-hosted fonts only (no external font CDNs).
- **Verifiable Truth:** Never invent fictional testimonials, synthetic stats, or AI placeholder markers (`//` or `●`).
- **Scope Discipline:** Keep each PR focused on a single responsibility.

---

## 4. Git Workflow, Hooks & Commit Rules

- **No direct commits to `main` or `master`.** Always work on a branch (`feat/...`, `fix/...`, `housekeep/...`) and open a Pull Request.
- Keep `.githooks/pre-commit` and `.githooks/commit-msg` as LF-only (`\n`, never CRLF) executable (`+x`) POSIX `#!/usr/bin/env sh` wrappers (`core.hooksPath = .githooks`).
- All commit messages must satisfy `scripts/commitlint.ts`:
  - Format: `<type>(<scope>): <description>` (**scope is mandatory**, matching `[A-Za-z0-9._/-]+`).
  - Allowed types **only**: `feat`, `fix`, `housekeep` (do not use `chore`, `docs`, `refactor`, `ci`, `test`, `style`, etc.).
  - Header must be `<= 72` characters and must not end with a trailing period (`.`).
  - Separate subject header from body with a blank line.
  - Git-generated `Merge `, `Revert `, `fixup! `, and `squash! ` headers are permitted.

---

## 5. CI & Ruleset Invariants

- **Never rename** the GitHub Actions job `name:` fields **`Build & Verify Site`** (`.github/workflows/ci-build.yml`) or **`Validate Conventional Commits`** (`.github/workflows/commit-rules.yml`) — both are pinned as required status checks in `.github/rulesets/protect-main.json`.
- Ensure `dist/index.html` and `dist/CNAME` exist after every production build (GitHub Pages is deployed directly from `./dist` via `.github/workflows/deploy-pages.yml`).

---

## 6. Verification Before Finishing

1. Always run before concluding work:
   ```sh
   bun fmt --no-script --check
   bun test scripts/commitlint.test.ts scripts/sync-team-calendar.test.ts
   bun run build
   ```
2. For UI, theme, or routing changes, verify via `bun run preview --host 127.0.0.1 --port 4321` (or `bun run test:e2e` once Chromium is installed via `bunx playwright install`): confirm HTTP `200` across routes, `#teqniqksScreenLoader` hides cleanly, zero console/page errors or 404 assets, Theme Switcher persistence, and mobile drawer behavior without horizontal overflow.
