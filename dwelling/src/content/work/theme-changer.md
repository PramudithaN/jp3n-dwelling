---
title: "Theme Changer Engine"
tagline: "Instant zero-flash CSS custom property token orchestration engine."
category: "web"
liveUrl: "https://pramudithan.github.io/theme.changer/"
repoUrl: "https://github.com/PramudithaN/theme.changer"
status: "production"
techStack: ["CSS Custom Properties", "Vanilla TypeScript", "Zero FOUC Engine"]
metrics:
  layoutShift: "0.00 CLS"
  runtimeSize: "840 bytes"
featuredOrder: 2
---

## Structural Overview
A lightweight theme switcher engineered to eliminate Flash of Unstyled Content (FOUC) and layout shifting across dynamic theme swaps.

### Engineering Intent
- Evaluates and updates root tokens synchronously during initial render to prevent flashing.
- Decouples color tokens into raw palettes and semantic surface assignments.
- Operates without bloated state management libraries.
