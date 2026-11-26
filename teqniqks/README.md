# Teqniqks Astro Application

> Static-first web application for **Teqniqks**, built with Astro, strict TypeScript, self-hosted fonts, and zero tracking cookies.

---

## 1. Technical Stack & Standards

- **Framework:** [Astro](https://astro.build/) (Static Site Generation & Content Layer)
- **Language:** Strict TypeScript
- **Styling:** CSS custom properties in `src/styles/tokens.css` and `src/config/theme.ts`
- **Typography:** Self-hosted WOFF/TTF fonts (`Space Grotesk`, `Sora`, `JetBrains Mono`, `Syne`, `Modera`, `Ithaca`)
- **Privacy:** Zero cookies, zero third-party analytics, and full alignment with Sri Lanka PDPA No. 9 of 2022 and EU GDPR

---

## 2. Project Structure

```text
teqniqks/
├── public/
│   ├── CNAME
│   ├── favicon.svg
│   ├── fonts/                    # Self-hosted WOFF/TTF font files
│   ├── images/                   # Hero layers, team portraits, music covers, workshops
│   └── videos/
├── scripts/
│   └── prepare-gh-pages.mjs      # Writes docs/.nojekyll for GitHub Pages custom domain
├── src/
│   ├── components/
│   │   ├── AfkSection.astro      # Off-duty collective credits
│   │   ├── CreativeProcess.astro # Non-linear engineering & design loop
│   │   ├── EditorialCanvasCallout.astro
│   │   ├── Footer.astro          # Monochrome portrait strip, navigation & legal notice
│   │   ├── GraphicsStudioShowcase.astro
│   │   ├── MaintenanceScreen.astro
│   │   ├── MotionBayShowcase.astro
│   │   ├── NavHeader.astro
│   │   ├── OpenForgeShowcase.astro
│   │   ├── ParallaxHero.astro    # Multi-depth spatial parallax hero
│   │   ├── ProjectDossierBoard.astro
│   │   ├── ProjectEvidenceBoard.astro
│   │   ├── ProjectsFolderStack.astro
│   │   ├── RetroWorkstation.astro
│   │   ├── TeamCalendar.astro    # Interactive GitHub contribution calendar
│   │   ├── TeamPreferences.astro # Studio music rotation player
│   │   ├── TeamSection.astro     # 6-column silhouette portrait collective
│   │   ├── TheFourDoors.astro
│   │   ├── ThemeEngine.astro
│   │   ├── ThemeSwitcher.astro
│   │   ├── ThoughtsNoise.astro
│   │   ├── WebsiteShowcase.astro
│   │   ├── WhoWeAre.astro
│   │   ├── WorkshopBackBar.astro
│   │   └── WorkshopsFolders.astro
│   ├── config/
│   │   ├── site.ts               # Single source of truth (Team, Capacity, Contact, Demos)
│   │   └── theme.ts              # 8 curated color palettes
│   ├── content/
│   │   ├── contributors/         # Open-source projects & contribution guides
│   │   ├── journal/              # Engineering essays & technical docs
│   │   └── work/                 # Production case studies
│   ├── data/
│   │   └── teamCalendar.ts       # Team GitHub activity dataset & member colors
│   ├── layouts/
│   │   └── BaseLayout.astro      # Document shell, preloads, loader & global scripts
│   ├── pages/
│   │   ├── index.astro           # Homepage narrative scroll
│   │   ├── process.astro         # Web Laboratory (/process)
│   │   ├── themes.astro          # Graphics Studio (/themes)
│   │   ├── motion.astro          # Motion Bay (/motion)
│   │   ├── contributors.astro    # Open Forge (/contributors)
│   │   ├── journey.astro         # Collective origin & chronology (/journey)
│   │   ├── contact.astro         # Direct engagement channels (/contact)
│   │   ├── privacy.astro         # Zero-cookie privacy policy (/privacy)
│   │   ├── journal/              # Journal index & detail routes
│   │   └── work/                 # Work index & case study detail routes
│   └── styles/
│       └── tokens.css            # Base CSS custom properties & typography scale
├── astro.config.mjs              # Configured with site: 'https://teqniqks.com', base: '/', outDir: '../docs'
├── CONTRIBUTING.md
├── package.json
└── tsconfig.json
```

---

## 3. Configuration

To update team members, intake capacity, maintenance mode, or contact info, edit `src/config/site.ts`.

---

## 4. Development & Build

### Local Development
```bash
cd teqniqks
npm install
npm run dev
```

### Production Build (GitHub Pages)
```bash
cd teqniqks
npm run build
```
Outputs the static build to `../docs` with `CNAME` (`teqniqks.com`) and `.nojekyll`.
