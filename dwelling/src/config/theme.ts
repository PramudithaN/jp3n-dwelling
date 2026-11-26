/**
 * ============================================================================
 * Teqniqks ATELIER / CENTRAL THEME CONFIGURATION
 * ============================================================================
 * Modifying the activeTheme below dynamically restyles the entire website
 * across every section, component, card, button, and subpage.
 */

export interface ThemeColors {
  accent: string;           // Primary accent highlight (buttons, active states, key readouts)
  accentSoft: string;       // Secondary accent (subheadings, metadata labels, tags)
  accentGlow: string;       // Box-shadow ambient glow
  accentMuted: string;      // Transparent pill backgrounds
  bgCanvas: string;         // Primary background canvas
  bgSurface: string;        // Component card background
  bgElevated: string;       // Floating panels, header, workbench
  bgScrim: string;          // Video overlays & dark filters
  textPrimary: string;      // Main heading & high-contrast text
  textSecondary: string;    // Body copy & descriptive prose
  textMuted: string;        // Footers & subdued labels
  borderHairline: string;   // Thin divider rules
  borderBright: string;     // Active hover & focus borders
  borderFocus: string;      // Keyboard focus ring
}

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const themes: Record<string, ThemeDefinition> = {
  // Forest Canopy Theme (Active Default)
  'forest-canopy': {
    id: 'forest-canopy',
    name: 'Forest Canopy',
    description: 'Natural, grounded earth and deep forest tones emphasizing sustainable, high-end engineering.',
    colors: {
      accent: '#52a468',              // Vibrant Forest Green highlight
      accentSoft: '#a4ac86',          // Natural Olive Sage
      accentGlow: 'rgba(82, 164, 104, 0.35)',
      accentMuted: 'rgba(82, 164, 104, 0.12)',
      bgCanvas: '#09100b',            // Deep Obsidian Forest
      bgSurface: '#101912',           // Dark Canopy Surface
      bgElevated: '#162219',          // Elevated Moss Panel
      bgScrim: 'rgba(9, 16, 11, 0.88)',
      textPrimary: '#faf9f6',         // Crisp Ivory White
      textSecondary: '#a3ad9d',       // Sage Stone Body Text
      textMuted: '#687463',           // Muted Forest Ash
      borderHairline: 'rgba(250, 249, 246, 0.12)',
      borderBright: 'rgba(164, 172, 134, 0.32)',
      borderFocus: '#52a468'
    }
  },

  // Golden Hour (Warm Atelier Amber)
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour',
    description: 'Rich autumnal amber tones and terracotta warmth evoking bespoke architectural craft.',
    colors: {
      accent: '#FF9D00',
      accentSoft: '#FFCF71',
      accentGlow: 'rgba(255, 157, 0, 0.35)',
      accentMuted: 'rgba(255, 157, 0, 0.12)',
      bgCanvas: '#080503',
      bgSurface: '#120C08',
      bgElevated: '#160F0A',
      bgScrim: 'rgba(8, 5, 3, 0.88)',
      textPrimary: '#FAF6EE',
      textSecondary: '#A39788',
      textMuted: '#6E6459',
      borderHairline: 'rgba(250, 246, 238, 0.12)',
      borderBright: 'rgba(250, 246, 238, 0.24)',
      borderFocus: '#FF9D00'
    }
  },

  // Tech Innovation (Electric Blue & Neon Cyan)
  'tech-innovation': {
    id: 'tech-innovation',
    name: 'Tech Innovation',
    description: 'High-contrast cyber palette designed for cutting-edge software and hardware diagnostics.',
    colors: {
      accent: '#0066ff',
      accentSoft: '#00ffff',
      accentGlow: 'rgba(0, 102, 255, 0.35)',
      accentMuted: 'rgba(0, 102, 255, 0.12)',
      bgCanvas: '#0c1017',
      bgSurface: '#131b26',
      bgElevated: '#1a2433',
      bgScrim: 'rgba(12, 16, 23, 0.88)',
      textPrimary: '#ffffff',
      textSecondary: '#8fa3bf',
      textMuted: '#52627a',
      borderHairline: 'rgba(255, 255, 255, 0.12)',
      borderBright: 'rgba(0, 255, 255, 0.25)',
      borderFocus: '#00ffff'
    }
  },

  // Modern Minimalist (Monochrome Grayscale)
  'modern-minimalist': {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'Disciplined grayscale palette emphasizing architectural precision and clean typography.',
    colors: {
      accent: '#ffffff',
      accentSoft: '#708090',
      accentGlow: 'rgba(255, 255, 255, 0.25)',
      accentMuted: 'rgba(255, 255, 255, 0.08)',
      bgCanvas: '#141618',
      bgSurface: '#1c1f22',
      bgElevated: '#24272b',
      bgScrim: 'rgba(20, 22, 24, 0.88)',
      textPrimary: '#ffffff',
      textSecondary: '#a0aab2',
      textMuted: '#606b74',
      borderHairline: 'rgba(255, 255, 255, 0.12)',
      borderBright: 'rgba(255, 255, 255, 0.28)',
      borderFocus: '#ffffff'
    }
  },

  // Midnight Galaxy (Cosmic Violet & Lavender)
  'midnight-galaxy': {
    id: 'midnight-galaxy',
    name: 'Midnight Galaxy',
    description: 'Deep cosmic purples and soft lavender accents for dramatic narrative and motion craft.',
    colors: {
      accent: '#a855f7',
      accentSoft: '#d8b4fe',
      accentGlow: 'rgba(168, 85, 247, 0.35)',
      accentMuted: 'rgba(168, 85, 247, 0.14)',
      bgCanvas: '#0c0814',
      bgSurface: '#140e21',
      bgElevated: '#1d152f',
      bgScrim: 'rgba(12, 8, 20, 0.88)',
      textPrimary: '#faf7ff',
      textSecondary: '#b4a5cc',
      textMuted: '#6f6187',
      borderHairline: 'rgba(216, 180, 254, 0.14)',
      borderBright: 'rgba(168, 85, 247, 0.36)',
      borderFocus: '#a855f7'
    }
  },

  // Crimson Noir (Editorial Red & Rose)
  'crimson-noir': {
    id: 'crimson-noir',
    name: 'Crimson Noir',
    description: 'Sharp editorial vermilion and warm rose highlights over deep obsidian.',
    colors: {
      accent: '#ef4444',
      accentSoft: '#fca5a5',
      accentGlow: 'rgba(239, 68, 68, 0.35)',
      accentMuted: 'rgba(239, 68, 68, 0.13)',
      bgCanvas: '#110809',
      bgSurface: '#1a0d0f',
      bgElevated: '#241316',
      bgScrim: 'rgba(17, 8, 9, 0.88)',
      textPrimary: '#fdf7f7',
      textSecondary: '#c2a3a6',
      textMuted: '#785d60',
      borderHairline: 'rgba(252, 165, 165, 0.14)',
      borderBright: 'rgba(239, 68, 68, 0.35)',
      borderFocus: '#ef4444'
    }
  },

  // Oceanic Teal (Deep Teal & Seafoam)
  'oceanic-teal': {
    id: 'oceanic-teal',
    name: 'Oceanic Teal',
    description: 'Crisp marine teal and seafoam accents balanced on deep abyssal slate.',
    colors: {
      accent: '#14b8a6',
      accentSoft: '#5eead4',
      accentGlow: 'rgba(20, 184, 166, 0.35)',
      accentMuted: 'rgba(20, 184, 166, 0.13)',
      bgCanvas: '#061111',
      bgSurface: '#0b1b1b',
      bgElevated: '#112727',
      bgScrim: 'rgba(6, 17, 17, 0.88)',
      textPrimary: '#f4fbfa',
      textSecondary: '#94b8b4',
      textMuted: '#537370',
      borderHairline: 'rgba(94, 234, 212, 0.13)',
      borderBright: 'rgba(20, 184, 166, 0.35)',
      borderFocus: '#14b8a6'
    }
  },

  // Nordic Cobalt (Royal Blue & Ice)
  'nordic-cobalt': {
    id: 'nordic-cobalt',
    name: 'Nordic Cobalt',
    description: 'Calm royal cobalt and glacial blue tones for focused, high-clarity interfaces.',
    colors: {
      accent: '#3b82f6',
      accentSoft: '#93c5fd',
      accentGlow: 'rgba(59, 130, 246, 0.35)',
      accentMuted: 'rgba(59, 130, 246, 0.14)',
      bgCanvas: '#080c16',
      bgSurface: '#0f1626',
      bgElevated: '#172136',
      bgScrim: 'rgba(8, 12, 22, 0.88)',
      textPrimary: '#f5f8ff',
      textSecondary: '#98a8c7',
      textMuted: '#586785',
      borderHairline: 'rgba(147, 197, 253, 0.14)',
      borderBright: 'rgba(59, 130, 246, 0.36)',
      borderFocus: '#3b82f6'
    }
  }
};

/**
 * ACTIVE SITE-WIDE THEME:
 * Changing this string to any key in `themes` updates the entire website instantly!
 */
export const activeTheme: ThemeDefinition = themes['forest-canopy'];
