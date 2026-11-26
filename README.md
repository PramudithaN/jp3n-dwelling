# Teqniqks

> **An independent software, design, motion, and open-source collective based in Colombo, Sri Lanka.**  
> Built with static-first Astro architecture, zero tracking cookies, self-hosted typography, and an 8-palette global theme engine.

- **Live Site (GitHub Pages):** https://teqniqks.github.io/teqniqks/
- **Repository:** https://github.com/Teqniqks/teqniqks
- **Contact:** teqniqks@gmail.com

---

## 1. Architecture & Page Flow

The homepage (`dwelling/src/pages/index.astro`) is structured as a single cohesive narrative scroll:

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
7. **The Collective (`TeamSection.astro`, `TeamCalendar.astro`, `TeamPreferences.astro`, `AfkSection.astro`)**: Six specialized engineers, live current-month GitHub Build Calendar, studio music rotation (manual playback, zero autoplay), and off-duty profiles.
8. **Direct Engagement (`#contact`, `RetroWorkstation.astro`)**: Direct project inquiry without tracking forms or sales funnels.
9. **Maintenance Mode (`MaintenanceScreen.astro`)**: Toggle `maintenance.enabled: true` in `dwelling/src/config/site.ts` (or build with `PUBLIC_MAINTENANCE_MODE=true`) to display a status screen across all routes.

---

## 2. Dynamic Global Theme Engine

A floating theme switcher (`ThemeSwitcher.astro` + `ThemeEngine.astro`) is available on every route, backed by 8 curated palettes in `dwelling/src/config/theme.ts`:

- **Forest Canopy** *(default)*
- **Golden Hour**
- **Tech Innovation**
- **Modern Minimalist**
- **Midnight Galaxy**
- **Crimson Noir**
- **Oceanic Teal**
- **Nordic Cobalt**

Selecting a palette updates CSS custom properties, canvas elements, and `<meta name="theme-color">` immediately, persisting the selection in `localStorage`.

---

## 3. Repository Structure

```text
teqniqks/
├── .githooks/
│   └── commit-msg                       # Conventional Commits local git hook
├── .github/
│   └── workflows/
│       └── commit-rules.yml             # CI commit message validation on main & PRs
├── docs/                                # Static production build served by GitHub Pages
│   ├── .nojekyll
│   └── ...
├── dwelling/                            # Astro application source
│   ├── astro.config.mjs                 # Configured with base: '/teqniqks' and outDir: '../docs'
│   ├── CONTRIBUTING.md                  # Contribution and commit guidelines
│   ├── package.json
│   ├── public/
│   │   ├── fonts/                       # Self-hosted Space Grotesk, Sora, JetBrains Mono, etc.
│   │   ├── images/                      # Hero layers, team silhouettes, music covers, workshops
│   │   └── videos/
│   ├── scripts/
│   │   └── prepare-gh-pages.mjs         # Post-build /teqniqks path prefixer & .nojekyll generator
│   └── src/
│       ├── components/                  # Modular Astro UI & interactive canvas components
│       ├── config/
│       │   ├── site.ts                  # Team profiles, capacity, contact info & demos
│       │   └── theme.ts                 # 8 global theme definitions
│       ├── content/                     # Zod-validated Markdown collections (work, journal, contributors)
│       ├── data/                        # Team build calendar dataset
│       ├── layouts/
│       │   └── BaseLayout.astro         # Shared document shell, NavHeader, Footer & ThemeSwitcher
│       ├── pages/                       # Static routes (/, /process, /themes, /motion, /contributors, /work, /journal, /journey, /contact, /privacy)
│       └── styles/
│           └── tokens.css               # Base CSS custom properties & typography scale
├── .gitignore
├── LICENSE
└── README.md
```

---

## 4. Development & Deployment

### Local Development
```bash
cd dwelling
npm install
npm run dev
```

### Build for GitHub Pages (`docs/` on `main`)
```bash
cd dwelling
npm run build
```
This runs `astro build` into `../docs` and executes `scripts/prepare-gh-pages.mjs` to prefix root-relative paths for `/teqniqks` and generate `docs/.nojekyll`.

### GitHub Pages Setup
1. Push changes (including `docs/`) to the `main` branch.
2. In GitHub **Settings -> Pages -> Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **`main`** and folder **`/docs`**, then click **Save**.

---

## 5. Commit Standards

This repository enforces [Conventional Commits](https://www.conventionalcommits.org/) via `.githooks/commit-msg` (configured automatically on `npm install` inside `dwelling/`) and `.github/workflows/commit-rules.yml`. See [CONTRIBUTING.md](dwelling/CONTRIBUTING.md) for details.
