# Teqniqks

> **An independent software, design dwelling based in Colombo, Sri Lanka.**  
> Built with static-first Astro architecture, strict TypeScript, zero tracking cookies, self-hosted typography, and an 8-palette global theme engine.

- **Live Site:** https://teqniqks.com/
- **Repository:** https://github.com/Teqniqks/teqniqks
- **Contact:** teqniqks@gmail.com

---

## 1. Technical Stack & Standards

- **Runtime & Package Manager:** [Bun](https://bun.sh/) (`>=1.4.5`)
- **Framework:** [Astro](https://astro.build/) (Static Site Generation & Content Layer)
- **Language:** Strict TypeScript
- **Styling:** CSS custom properties in `src/styles/tokens.css` and `src/config/theme.ts`
- **Typography:** Self-hosted variable WOFF2 fonts (`Space Grotesk`, `Sora`, `JetBrains Mono`)
- **Formatting:** Built-in `bun fmt` (with `.prettierrc` + `prettier-plugin-astro` for `.astro` components)
- **Privacy:** Zero cookies, zero third-party analytics, and full alignment with Sri Lanka PDPA No. 9 of 2022 and EU GDPR

---

## 2. Architecture & Page Flow

The homepage (`src/pages/index.astro`) is structured as a single cohesive narrative scroll:

1. **Spatial Parallax Hero (`ParallaxHero.astro`)**: Multi-depth hardware-accelerated arrival canvas.
2. **Who We Are (`WhoWeAre.astro`, `#about`)**: Engineering and craft manifesto.
3. **Four In-House Workshops (`WorkshopsFolders.astro`, `#workshops`)**: Entry points into Teqniqks' four disciplines:
   - **01 · Websites (`/process`)**: `WebsiteShowcase.astro` (Web Laboratory)
   - **02 · Graphic Design (`/themes`)**: `GraphicsStudioShowcase.astro` (Marketing posters, flyers, social media posters, and brand identity)
   - **03 · Videos & Motion (`/motion`)**: `MotionBayShowcase.astro` (Motion Bay, 2-axis matrix, and 4-stage production pipeline)
   - **04 · Contribute (`/contributors`)**: `OpenForgeShowcase.astro` (Open Forge contribution guide and repositories)
4. **Selected Software & Tooling (`ProjectsFolderStack.astro`, `#work`)**: Production case studies and open-source repositories.
5. **The Process (`CreativeProcess.astro`, `#process`)**: Interactive non-linear engineering and design loop.
6. **Mindset & Clarity (`ThoughtsNoise.astro`, `EditorialCanvasCallout.astro`)**: Filtering signal from noise and shipping with clarity.
7. **The Collective (`TeamSection.astro`, `TeamCalendar.astro`, `TeamPreferences.astro`, `AfkSection.astro`)**: Six specialized engineers, build-time 2-month GitHub Build Calendar (refreshed daily at 00:00 SLST via GitHub Actions), studio music rotation (manual playback, zero autoplay), and off-duty profiles.
8. **Direct Engagement (`#contact`, `RetroWorkstation.astro`)**: Direct project inquiry without tracking forms or sales funnels.
9. **Maintenance Mode (`MaintenanceScreen.astro`)**: Toggle `maintenance.enabled: true` in `src/config/site.ts` (or build with `PUBLIC_MAINTENANCE_MODE=true`) to display a status screen across all routes.

To update team members, intake capacity, maintenance mode, or contact info, edit `src/config/site.ts`.

---

## 3. Dynamic Global Theme Engine

A floating theme switcher (`ThemeSwitcher.astro` + `ThemeEngine.astro`) is available on every route, backed by 8 curated palettes in `src/config/theme.ts`:

- **Forest Canopy** _(default)_
- **Golden Hour**
- **Tech Innovation**
- **Modern Minimalist**
- **Midnight Galaxy**
- **Crimson Noir**
- **Oceanic Teal**
- **Nordic Cobalt**

Selecting a palette updates CSS custom properties, canvas elements, and `<meta name="theme-color">` immediately, persisting the selection in `localStorage`.

---

## 4. Repository Structure

```text
.
├── .githooks/
│   ├── commit-msg                 # Invokes scripts/commitlint.ts
│   └── pre-commit                 # Invokes scripts/pre-commit.ts (branch guard + bun fmt --staged)
├── .github/
│   ├── rulesets/protect-main.json
│   └── workflows/
│       ├── ci-build.yml           # Format check, repo tests, Astro build & dist/ verification
│       ├── commit-rules.yml       # CI commit message validation on main & PRs
│       └── deploy-pages.yml       # Builds dist/ with fresh calendar & deploys to GitHub Pages
├── .vscode/
├── public/
│   ├── CNAME                      # Custom domain (teqniqks.com)
│   ├── fonts/                     # Self-hosted variable Space Grotesk, Sora & JetBrains Mono (.woff2)
│   └── images/                    # Hero layers, team silhouettes, music covers, workshops
├── scripts/
│   ├── commitlint.ts              # Commit message validator (feat, fix, housekeep + mandatory scope)
│   ├── commitlint.test.ts         # Unit tests for commitlint
│   ├── pre-commit.ts              # Blocks main/master commits and formats staged files
│   ├── sync-team-calendar.ts      # Fetches last 4 months of GitHub GraphQL contributions at build time
│   └── sync-team-calendar.test.ts # Unit tests for calendar event pagination fallback
├── src/
│   ├── components/                # Modular Astro UI & interactive canvas components
│   ├── config/
│   │   ├── site.ts                # Team profiles & contact info
│   │   └── theme.ts               # 8 global theme definitions
│   ├── content/                   # Zod-validated Markdown collections (work, journal)
│   ├── data/                      # Build-time GitHub activity consumer & generated JSON snapshot
│   ├── layouts/
│   │   └── BaseLayout.astro       # Shared document shell, NavHeader, Footer & ThemeSwitcher
│   ├── pages/                     # Static routes (/, /process, /themes, /motion, /contributors, /work, /journal, /journey, /contact, /privacy)
│   └── styles/
│       └── tokens.css             # Base CSS custom properties & typography scale
├── tests/
│   └── e2e/                       # Playwright end-to-end test suite
├── .gitignore
├── .prettierignore
├── .prettierrc
├── astro.config.mjs               # Configured with site: 'https://teqniqks.com', base: '/' (outputs ./dist)
├── bun.lock
├── bunfig.toml                    # Bun runtime & formatter configuration
├── CONTRIBUTING.md                # Contribution, formatting, and commit guidelines
├── LICENSE
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

---

## 5. Development & Deployment

### Local Development

```bash
bun install
bun run dev
```

`dev` automatically generates `src/data/teamCalendar.generated.json` if missing before starting the Astro dev server.

### Formatting & Tests

```bash
bun run format          # Format repository with bun fmt
bun run format:check    # Verify formatting without writing
bun test scripts/commitlint.test.ts scripts/sync-team-calendar.test.ts
bun run test:e2e
```

### Build & Deploy via GitHub Actions

```bash
CALENDAR_READ_TOKEN=$(gh auth token) bun run sync:calendar -- --strict # Optional: sync 4-month GraphQL snapshot locally
bun run build                                                        # Syncs calendar + builds static output into gitignored ./dist
```

Deployment runs via `.github/workflows/deploy-pages.yml` on every push to `main`, on a daily **00:00 Sri Lanka Standard Time** (`18:30 UTC`) schedule, and via manual `workflow_dispatch`. It builds `./dist` (including `CNAME` for `teqniqks.com`) with a fresh 4-month GitHub GraphQL contribution snapshot across all 6 members and deploys directly with `actions/deploy-pages`.

Configure repository secret `CALENDAR_READ_TOKEN` (a PAT with `read:user` scope) in **Settings -> Secrets and variables -> Actions** so CI and Pages builds can query GitHub GraphQL `contributionsCollection` cleanly and fail fast if any member fetch fails.

### GitHub Pages Setup

1. In GitHub **Settings -> Pages -> Build and deployment**, set **Source** to **GitHub Actions**.
2. Merge changes via Pull Request into `main`; `.github/workflows/deploy-pages.yml` handles all builds and deployments without committing generated artifacts.

---

## 6. Commit & Formatting Standards

- **Pre-commit formatting:** `.githooks/pre-commit` blocks direct commits to `main`/`master` and runs `bun fmt --no-script --staged` to format and re-stage committed files automatically.
- **Commit messages:** Enforced locally by `.githooks/commit-msg` (`scripts/commitlint.ts`) and in CI by `.github/workflows/commit-rules.yml`. Allowed types are `feat`, `fix`, and `housekeep` with a **mandatory scope**: `<type>(<scope>): <description>`. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
