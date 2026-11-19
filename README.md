# merci (merci.clothing_) — Earthy Elegance & Timeless Silhouettes

> A self-contained, luxury editorial clothing brand website and atelier management application engineered for **merci** (`@merci.clothing_`, Sri Lanka).
> Faithfully inspired by the authentic visual identity, typography, and collections of the brand: high-contrast **Bodoni Moda** Didone wordmark, delicate **Pinyon Script** cursive signatures, warm limestone architecture, and natural fiber essentials.

---

## 1. Brand Identity & Architectural Highlights

**merci** is a single self-contained application (`index.html`) featuring:

- **Exact Instagram Brand Typography:**
  - **Logo Wordmark:** Upright, high-contrast Didone serif (`Bodoni Moda`) as printed on tags and watermarks (`merci`), with title case (`Merci`) on mailer bags.
  - **Cursive Script Accents:** Flowing calligraphy (`Pinyon Script`) for signature drop accents (e.g., *"effortlessly"*, *"Sleeveless Top"*).
  - **Editorial Display & Body:** Refined pairing of `Playfair Display` and `Satoshi` / `Plus Jakarta Sans`.
- **Terra Muse Collection Spotlight:**
  - Stacked large display typography (`AU` / `BER` / `GINE`) with rotated cursive script overlay (`Sleeveless Top`).
  - Verbatim brand manifesto: *"Inspired by the beauty of nature’s palette, Terra Muse celebrates understated sophistication through timeless silhouettes and effortless craftsmanship..."*
- **Authentic Collections & Wardrobe Archive:**
  - *Aubergine Sleeveless Top* (Terra Muse Collection)
  - *The Olive Green Balloon Sleeve Top* (*"The colour of calm. The feeling of effortless beauty."*)
  - *Signature Linen Wide-Leg Pant — Soft Sage*
  - *Signature Linen Wide-Leg Pant — Charcoal Blue*
  - *Terra Muse Halter Neck Top — Pure Chalk*
  - *High-Waisted Flared Linen Skirt — Earth Clay*
  - *Textured Strapless Bandeau Top — Raw Sand*
  - *Vintage Floral Slip Maxi Skirt*
  - *Pure Linen Relaxed Trouser — Warm Oat*
- **"Let's Pack Orders" Packaging Story:**
  - Modeled after the official Instagram stories with matte white mailer bags stamped with `Merci` and *"Embrace your style journey with us"*.
  - Documents Islandwide Sri Lanka delivery (2–4 business days) and Worldwide Express via DHL.
- **Dual Currency Engine (LKR & USD):**
  - Seamless toggle between Sri Lankan Rupees (`Rs. 8,500`) and US Dollars (`$28`) across hero cards, catalog items, and shopping bag totals.
- **WhatsApp Concierge Ordering:**
  - Direct *"Order via WhatsApp"* integration on all preview modals and the shopping bag drawer with pre-filled item, size, and pricing details.
- **Shop Owner / Atelier Studio (PIN Protected):**
  - Discreet management portal accessible via the footer trigger, secured by a 4-digit PIN (`1234`).
  - Full capability to add, edit, or delete items, update pricing in LKR/USD, and modify descriptions.
- **Zero-Overflow Mobile-First Architecture:**
  - Tested and verified on 390px mobile viewports with zero horizontal overflow, thumb-friendly navigation, and touch-optimized touch targets.
- **Smooth Motion & Fabric Simulation:**
  - Buttery Lenis smooth scrolling with scroll-scrub parallax on editorial plates and generative sinusoidal silk waves on an HTML5 canvas.

---

## 2. Directory Structure

```text
lively-babbage/
├── index.html                    # Complete self-contained single-page application
├── scripts/
│   └── build_site.py             # Generator script for compiling index.html
├── AGENTS.md                     # Engineering & security guidelines
├── GEMINI.md                     # Development rules & guidelines
├── LICENSE                       # Project license
└── README.md                     # Architectural documentation
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
