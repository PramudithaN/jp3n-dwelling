const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefix a root-relative path with Astro's configured base path (e.g. /teqniqks)
 * so links and assets resolve identically in dev mode and GitHub Pages builds.
 */
export function withBase(path: string): string {
  if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  if (path === '/') return `${BASE}/`;
  return `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
