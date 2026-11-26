# Teqniqks Tech Dwelling

> **An independent craft & engineering dwelling.**  
> Built with static-first architecture, CSS scroll-driven animations, zero tracking cookies, and WCAG AA flat design tokens.

---

## 1. Architectural Overview & Philosophy

Teqniqks Tech Dwelling is designed as an architectural progression rather than an off-the-shelf agency template:
- **Blueprint:** How we plan, audit, and de-risk software.
- **Foundation:** Non-negotiables (zero cookies, self-hosted fonts, verifiable code).
- **The Four Rooms:** Specialized workshops for Web Engineering, Graphic Systems, Motion Craft, and Open Source.
- **The Peak (Illumination):** The house illuminates in warm amber (`#FF9D00`, `#FFCF71`), framing live product viewports.
- **The Front Porch (The Four Doors):** Four distinct entrances with zero friction (Clients, Contributors, Partners, Community).

---

## 2. Technical Stack & Standards

* **Framework:** [Astro](https://astro.build/) (Static Site Generation / Content Layer)
* **Language:** Strict TypeScript
* **Styling:** Hand-crafted CSS custom properties (Tokens in `src/styles/tokens.css`)
* **Motion:** CSS Scroll-Driven Animations (`animation-timeline: view()`) with progressive enhancement fallback
* **Typography:** Self-hosted WOFF/TTF:
  * **Modera:** Display & Brand Header
  * **Ithaca:** Technical Specs, Coordinates, and Tally Meter
  * **Sora:** Clean Body & Reading Copy
* **Cookies & Surveillance:** **Strictly ZERO cookies, zero tracking storage, zero third-party scripts.**

---

## 3. Project Structure

```text
dwelling/
├── public/
│   ├── favicon.svg
│   └── fonts/
│       ├── MODERA.woff (22KB)
│       ├── Ithaca.woff (26KB)
│       └── Sora-Regular.woff (60KB)
├── src/
│   ├── components/
│   │   ├── CapacityBadge.astro   # Option A honest urgency meter [ ■ ■ □ ]
│   │   ├── CreativeProcess.astro # Native 60fps non-linear process loop animation
│   │   ├── DwellingScene.astro   # Signature inline SVG scroll scene
│   │   ├── EditorialCanvasCallout.astro # Design-editor typography callout before CTA
│   │   ├── Footer.astro          # Compliance & zero-cookie notice
│   │   ├── NavHeader.astro       # Persistent minimal navigation
│   │   ├── ParallaxHero.astro    # Hardware-accelerated multi-depth spatial parallax hero
│   │   ├── PeakShowcase.astro    # The Peak illumination & demo viewports
│   │   ├── TeamSection.astro     # 5-column monochrome portrait collective showcase
│   │   ├── TheFourDoors.astro    # The 4 deliberate CTAs
│   │   ├── ThoughtsNoise.astro   # Native SVG & UI-pill profile sculpture
│   │   └── WhoWeAre.astro        # Theme-matched "Who We Are" manifesto section
│   ├── config/
│   │   └── site.ts               # Single source of truth (Capacity, Team, Demos)
│   ├── content/
│   │   ├── contributors/         # Open source projects & contribution guides
│   │   ├── journal/              # Unified blog essays and engineering docs
│   │   └── work/                 # Case studies and production systems
│   ├── content.config.ts         # Astro Content Layer schemas (Zod validated)
│   ├── layouts/
│   │   └── BaseLayout.astro      # Accessible base document with preload tags
│   ├── pages/
│   │   ├── contact.astro         # Direct channels & four doors
│   │   ├── contributors.astro    # Dedicated contributor forge
│   │   ├── index.astro           # The dwelling story scroll experience
│   │   ├── journey.astro         # Origin story & chronology
│   │   ├── privacy.astro         # Zero-cookie technical declaration (PDPA/GDPR)
│   │   ├── process.astro         # 4-stage architectural methodology
│   │   ├── journal/              # Journal list & detail routes
│   │   └── work/                 # Work portfolio & detail routes
│   └── styles/
│       └── tokens.css            # Complete design tokens (WCAG AA audited)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## 4. Honest Urgency & Capacity Management

To update the monthly intake slots, edit **exactly one file**:  
`src/config/site.ts`:

```typescript
export const siteConfig = {
  // ...
  capacity: {
    totalSlots: 3,
    openSlots: 2,          // Change to 1, 0, etc.
    month: 'December 2026' // Target month
  }
};
```
The Option A meter `[ ■ ■ □ ]` updates automatically across the entire site without code edits.

---

## 5. Development & Deployment

### Local Development
```bash
cd dwelling
npm install
npm run dev
```

### Production Build
```bash
npm run build
```
The static output will be generated in `dwelling/dist/` ready for edge deployment.

### Cloudflare Pages Deployment (Primary)
1. Link your repository in Cloudflare Pages dashboard.
2. Build command: `npm run build`
3. Build output directory: `dwelling/dist`
4. Root directory: `dwelling`

### Netlify Deployment (Backup)
1. Base directory: `dwelling`
2. Build command: `npm run build`
3. Publish directory: `dwelling/dist`

---

## 6. Performance & Compliance Verification

* **LCP:** $\le 1.0\text{s}$ on throttled 4G (Single static HTML payload).
* **CLS:** $0.00$ (All fonts preloaded with matched metric fallbacks).
* **Home Page JS:** $0\text{KB}$ external bundles ($< 0.5\text{KB}$ inlined accessible drawer script).
* **Total First Load:** $\approx 125\text{KB}$ (HTML + CSS + all 3 self-hosted WOFF fonts combined).
* **Compliance:** Strictly zero cookies. Zero tracking storage. Full alignment with Sri Lanka PDPA No. 9 of 2022 and EU GDPR.
