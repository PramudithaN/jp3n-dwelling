import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';

const ROUTES: Array<{ path: string; expectedTitle: string }> = [
  { path: '/', expectedTitle: 'Software & Design Atelier / Teqniqks' },
  { path: '/work', expectedTitle: 'Work & Production Systems / Teqniqks' },
  { path: '/work/contexaforge', expectedTitle: 'ContexaForge / Teqniqks' },
  { path: '/process', expectedTitle: 'Web Laboratory / Teqniqks' },
  { path: '/themes', expectedTitle: 'Graphics Studio / Teqniqks' },
  { path: '/motion', expectedTitle: 'Motion Bay / Teqniqks' },
  { path: '/contributors', expectedTitle: 'Open Source Forge / Teqniqks' },
  { path: '/journal', expectedTitle: 'Journal & Technical Docs / Teqniqks' },
  { path: '/journey', expectedTitle: 'The Journey / Teqniqks' },
  { path: '/contact', expectedTitle: 'Contact & Direct Engagement / Teqniqks' },
  { path: '/privacy', expectedTitle: 'Privacy & Data Architecture / Teqniqks' },
];

test.describe('Site navigation and route integrity', () => {
  test('serves all primary routes cleanly with expected titles @smoke', async ({ page }) => {
    for (const route of ROUTES) {
      const response = await page.goto(route.path);
      expect(response?.status(), `Unexpected status for ${route.path}`).toBeLessThan(400);
      await expect(page.locator('#teqniqksScreenLoader')).toBeHidden();
      await expect(page).toHaveTitle(route.expectedTitle);
      await expect(page.locator('#main-content')).toBeVisible();
    }
  });

  test('opens ContexaForge project dossier from Selected Work @regression', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const contexaLink = page.locator('a[href$="/work/contexaforge"]').first();
    await contexaLink.scrollIntoViewIfNeeded();
    await contexaLink.click();

    await expect(page).toHaveURL(/\/work\/contexaforge\/?$/);
    await expect(page.locator('#teqniqksScreenLoader')).toBeHidden();
    await expect(page).toHaveTitle('ContexaForge / Teqniqks');
    await expect(
      page.getByRole('heading', { level: 1, name: 'ContexaForge', exact: true }),
    ).toBeVisible();
  });

  test('toggles mobile navigation drawer on mobile viewports @regression', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Mobile drawer toggle is only visible on mobile viewports');

    const home = new HomePage(page);
    await home.goto();

    await home.openMobileMenu();
    await expect(home.mobileDrawer.getByRole('link', { name: 'WORK', exact: true })).toBeVisible();
    await home.closeMobileMenu();
  });
});
