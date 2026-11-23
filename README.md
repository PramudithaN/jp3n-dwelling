# JP3N Dwelling — GitHub Pages Showcase & Engineering Collective

> **A modern, modular software application and codebase.**  
> Featuring **JP3N Dwelling**'s official GitHub Pages interface (`index.html`) faithfully styled after GitHub organization profiles (such as `crafter-station`), complete with GitHub Dark Mode, pinned repository cards, interactive tab views, team directories, and zero-tracking privacy architecture.

---

## 1. Architectural Highlights & Features

- **GitHub Dark Mode UI Design System:**
  - Styled with authentic GitHub Primer tokens (`#0d1117` default canvas, `#161b22` subtle canvas, `#30363d` borders, `#2f81f7` accent links).
  - Exact layout parity with GitHub Organization pages (Crafter Station reference): Octocat navigation bar, subnav tabs (`Overview`, `Repositories [18]`, `Projects [3]`, `Packages [2]`, `People [5]`), and dual-column grid.
- **Interactive State & Actions:**
  - **Live Follower Toggle:** Interactive "Follow" / "Following" button with reactive counter updates and toast notifications.
  - **Interactive Stars:** Toggleable repo star buttons with live count updates.
  - **Subnav Tab Views:** Seamless client-side tab switching across Overview, Full Repositories with multi-filter search, Project Sprint Kanban boards, Packages, and People directories.
  - **Global & In-Page Search:** Filter repositories in real-time by keyword, language, or topic tag with keyboard shortcut `/`.
- **JP3N Core Repositories & Systems:**
  - `battery-telemetry`: Hardware battery monitoring utility using Web APIs.
  - `theme-changer`: Zero-layout-shift CSS token switcher (CLS 0.00).
  - `bytesift`: Client-side binary chunk parser using Web Workers.
  - `dwelling`: Architectural progression website built with Astro SSG.
  - `motion.eng`: Advanced After Effects scripting bridge & UI physics engine.
- **Strict Zero-Cookie Compliance:**
  - Compliant with EU GDPR and Sri Lanka PDPA No. 9 of 2022: zero cookies, zero third-party tracking scripts, zero surveillance.

---

## 2. Directory Structure

```text
lively-babbage/
├── .github/
│   ├── profile/
│   │   └── README.md             # Official GitHub Organization profile README
│   └── workflows/
│       └── deploy.yml            # GitHub Pages static deployment action
├── dwelling/                     # JP3N Tech Dwelling (Astro SSG, TypeScript, Content Layer)
│   ├── public/fonts/             # Self-hosted WOFF/TTF typefaces (Modera, Ithaca, Sora)
│   ├── src/components/           # Structural components (DwellingScene, Peak, FourDoors, etc.)
│   ├── src/content/              # Case studies, journal essays, and contributor spaces
│   ├── src/pages/                # Static routes (Home, Work, Journey, Process, Contributors, Contact)
│   ├── src/styles/tokens.css     # Verified flat chromatic tokens & fluid clamp() scale
│   └── README.md                 # Dedicated documentation for JP3N dwelling
├── index.html                    # JP3N Dwelling GitHub Pages application
├── AGENTS.md                     # Engineering & security guidelines
├── GEMINI.md                     # Development rules & guidelines
└── README.md
├── LICENSE                       # Project license
└── README.md                     # Workspace architectural documentation
```

---

## 3. Quick Start & Usage

Because `index.html` is completely self-contained with no build tools or bundling required:

1. **Direct Browser Launch:**
   - Open `index.html` in any modern web browser.
2. **Local Static Server:**
   ```bash
   # Python 3
   python -m http.server 8080
   ```
   Open `http://localhost:8080` in your browser.

3. **Shop Owner Login:**
   - Click **"🔒 Owner Atelier Studio"** in the footer.
   - Enter default PIN: `1234`.
