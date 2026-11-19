# meri.clothing — Architectural Luxury Atelier

> A self-contained, editorial clothing brand website and shop management application engineered for **meri.clothing** (Kyoto · Milan · Paris).
> Combining the minimalist monochrome layout, hairline grids, and line-by-line spring reveals of *Kai Nomura* with the adaptive rem scaling, curtain intro loader, and interactive component architecture of *Baseline*.

---

## 1. Project Overview & Architectural Highlights

**meri.clothing** is a modern, single self-contained application (`index.html`) featuring:

- **Haute Minimalist Aesthetic:** Editorial typography with Google Fonts **Playfair Display** (display serif and italic accents), **Satoshi** (Fontshare sans), and **Onest**.
- **Adaptive Rem Scale Grid:** Media queries at 1920px, 1440px, 1024px, and 640px scaling down proportionally via `vw`, with dynamic JS scale-up above 1920px.
- **Intro Curtain Loader:** Obsidian curtain with progress bar and animated monogram that lifts with `easeInOutCubic` when the page is ready.
- **Smooth Scroll & Parallax:** Integrated [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll (ESM CDN) with automatic scroll locking during modal dialogs, and viewport progress mapping on gallery plates.
- **Hero Ambient Motion Video & Controls:** Ambient runway and fabric drapery video loop with play/pause toggle, status indicator, and fallback gradient overlay.
- **Interactive Mineral Palette Switcher:** Live dynamic CSS variable switching between *Obsidian & Chalk*, *Raw Linen & Clay*, *Slate & Charcoal*, and *Kyoto Sage Dust*.
- **Asymmetric Zig-Zag Gallery:** 12-column editorial staggered layout (7-of-12 column span, odd items pushed down) with hover lift and plate parallax.
- **Interactive Garment Preview / Lightbox:** Click any garment to inspect high-resolution imagery, edition tags, size selection (XS–XL), fabric specifications, and instant "Add to Bag".
- **Shop Owner / Admin Manager ("Atelier Manager"):** Full administrative dashboard modal allowing the shop owner to:
  - Add new clothing pieces (title, category, price, edition tag, fabric, image URL, stock state, description)
  - Edit existing pieces inline with instant reflection across the store
  - Delete pieces or toggle stock availability
  - Reset to original FW26 capsule
  - Persistent state via browser `localStorage` (`meri_clothing_catalog_v2`)
- **Interactive Shopping Bag Drawer:** Slide-over bag drawer with quantity counters, price calculation, and realistic concierge checkout stub.
- **Pinned Dark Sections & Accordion FAQ:** Full-viewport dark editorial statement sections and accessible accordion FAQ with 45-degree rotating `+` icon and measured height springs.
- **Fullscreen Overlay Menu:** Top-sliding dark panel with staggered links, brand links, and contact channels.

---

## 2. Directory Structure

```text
lively-babbage/
├── index.html                    # Complete self-contained single-page application
├── AGENTS.md                     # Engineering & security guidelines
├── GEMINI.md                     # Development rules & guidelines
├── LICENSE                       # Project license
└── README.md                     # Architectural documentation
```

---

## 3. Quick Start & Usage

Because `index.html` is completely self-contained with no build tools or bundling required:

1. **Direct Browser Launch:**
   - Double-click `index.html` or open it in any modern browser (Chrome, Edge, Safari, Firefox).
2. **Local Static Server (Optional):**
   ```bash
   # Python 3
   python -m http.server 8080

   # Or npx serve
   npx serve .
   ```
   Open `http://localhost:8080` in your browser.

### Key Interactive Features:
- **Shop Owner Manager:** Click the **"Manager"** pill button in the top right header (or select it in the footer) to add, edit, or delete clothing items. All modifications persist across reloads in `localStorage`.
- **Garment Preview Lightbox:** Click any clothing card in the Zig-Zag gallery or Wardrobe Archive to launch the detail preview modal.
- **Curated Palette Switcher:** Use the color swatches in the Hero section to restyle the entire site's palette in real-time.
- **Shopping Bag:** Click **"Bag"** in the header to view selected silhouettes, adjust quantities, or trigger the atelier checkout concierge.

---

## 4. Technical Specifications & Dependencies

- **Pure HTML5 / Modern CSS / Vanilla JS (ES Modules)**
- **Smooth Scroll:** Lenis `v1.1.18` via ESM importmap
- **Fonts:**
  - Serif: [Google Fonts Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
  - Sans: [Fontshare Satoshi](https://www.fontshare.com/fonts/satoshi) & [Google Fonts Onest](https://fonts.google.com/specimen/Onest)
- **Local Persistence:** HTML5 Web Storage API (`localStorage`)
- **Accessibility:** ARIA attributes (`role="dialog"`, `aria-modal`, `aria-expanded`, keyboard `Escape` closing handlers)

---

## 5. License

Licensed under the MIT License.
