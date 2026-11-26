# Teqniqks Tech Dwelling

> **An independent software, design, motion, and open-source collective based in Colombo, Sri Lanka.**  
> Built with static-first Astro architecture, zero tracking cookies, self-hosted fonts, and a live 8-palette global theme engine.

**Live Site (GitHub Pages):** https://pramudithan.github.io/jp3n-dwelling/

---

## 1. Architecture & One-Page Flow

The homepage (`dwelling/src/pages/index.astro`) is organized as a single cohesive narrative scroll:

1. **Spatial Parallax Hero (`ParallaxHero.astro`)** — Multi-depth hardware-accelerated arrival canvas.
2. **Who We Are (`WhoWeAre.astro`, `#about`)** — Brand and engineering manifesto.
3. **Four In-House Workshops (`WorkshopsFolders.astro`, `#workshops`)** — Clear entry points into Teqniqks's four disciplines:
   - **01 · Websites (`/process`)** — `WebsiteShowcase.astro` (Web Laboratory)
   - **02 · Graphic Design (`/themes`)** — `GraphicsStudioShowcase.astro` (Flyers, marketing posters, social media posters & brand identity)
   - **03 · Videos & Motion (`/motion`)** — `MotionBayShowcase.astro` (Motion Bay, 2-axis matrix & 4-stage pipeline)
   - **04 · Contribute (`/contributors`)** — `OpenForgeShowcase.astro` (Open Forge contribution guide & repositories)
4. **Selected Software & Tooling (`ProjectsFolderStack.astro`, `#work`)** — Production case studies & open repositories.
5. **The Process (`CreativeProcess.astro`, `#process`)** — Interactive non-linear creative & engineering loop.
6. **Mindset & Clarity (`ThoughtsNoise.astro`, `EditorialCanvasCallout.astro`)** — Filtering signal from noise and shipping with clarity.
7. **The Collective (`TeamSection.astro`, `TeamCalendar.astro`, `TeamPreferences.astro`, `AfkSection.astro`)** — Meet the 5 engineers, live current-month GitHub Build Calendar (auto-synced to `new Date()` + public GitHub events), playable studio music rotation (manual play, zero autoplay), and AFK life.
8. **Direct Engagement (`#contact`, `RetroWorkstation.astro`)** — Direct project inquiry without sales funnels.
9. **Maintenance / Repair Mode (`MaintenanceScreen.astro`)** — Toggle `maintenance.enabled: true` in `dwelling/src/config/site.ts` (or build with `PUBLIC_MAINTENANCE_MODE=true`) to display the suspended traffic-light repair screen across all routes.

---

## 2. Dynamic Global Theme Switcher

A floating theme switcher (`ThemeSwitcher.astro` + `ThemeEngine.astro`) is available on every page, backed by 8 curated palettes in `dwelling/src/config/theme.ts`:

- **Forest Canopy** *(default)*
- **Golden Hour**
- **Tech Innovation**
- **Modern Minimalist**
- **Midnight Galaxy**
- **Crimson Noir**
- **Oceanic Teal**
- **Nordic Cobalt**

Selecting any theme updates all CSS custom properties, canvas drawings, and `<meta name="theme-color">` immediately and persists the choice in `localStorage`.

---

## 3. Repository Structure

```text
jp3n-dwelling/
├── docs/                                # Static production build served by GitHub Pages (main -> /docs)
│   ├── .nojekyll
│   └── ...
├── dwelling/                            # Astro application source
│   ├── astro.config.mjs                 # Configured with base: '/jp3n-dwelling' and outDir: '../docs'
│   ├── package.json
│   ├── public/
│   │   ├── fonts/                       # Self-hosted Space Grotesk, Sora, JetBrains Mono, etc.
│   │   ├── images/                      # Hero, team portraits, music covers, workshop visuals
│   │   └── videos/
│   ├── scripts/
│   │   └── prepare-gh-pages.mjs         # Post-build path prefixer & .nojekyll generator
│   └── src/
│       ├── components/                  # Modular Astro UI & interactive canvas components
│       ├── config/
│       │   ├── site.ts                  # Team profiles, capacity, contact info & music preview URLs
│       │   └── theme.ts                 # 8 global theme definitions
│       ├── content/                     # Zod-validated Markdown collections (work, journal, contributors)
│       ├── data/                        # Team build calendar dataset
│       ├── layouts/
│       │   └── BaseLayout.astro         # Shared document shell, NavHeader, Footer & ThemeSwitcher
│       ├── pages/                       # Static routes (/, /process, /themes, /motion, /contributors, /work, /journal, /contact, /privacy)
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
This runs `astro build` into `../docs` and executes `scripts/prepare-gh-pages.mjs` to prefix root-relative paths for `/jp3n-dwelling` and generate `docs/.nojekyll`.

### GitHub Pages Setup (Deploy from Branch)
1. Push changes (including `docs/`) to the `main` branch.
2. In GitHub **Settings → Pages → Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **`main`** and folder **`/docs`**, then click **Save**.
