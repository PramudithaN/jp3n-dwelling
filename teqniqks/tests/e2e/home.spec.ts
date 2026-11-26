import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home page core flows', () => {
  test('renders key sections without runtime page errors @smoke', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    const home = new HomePage(page);
    await home.goto();

    await expect(page).toHaveTitle('Software & Design Atelier / Teqniqks');
    await expect(page.getByRole('heading', { name: 'Four In-House Workshops' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Selected Software & Tooling' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'afk.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Start a Project Inquiry' })).toBeVisible();

    expect(pageErrors).toEqual([]);
  });

  test('displays teqniqks brand stamp in AFK section instead of JP3N @smoke', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await home.afkStamp.scrollIntoViewIfNeeded();
    await expect(home.afkStamp).toBeVisible();
    await expect(home.afkStamp).toHaveText('teqniqks');
    await expect(home.afkSection).not.toContainText('JP3N');
  });

  test('navigates build calendar months and filters by team member @regression', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.calendarGrid).toBeVisible();
    const initialMonth = (await home.calendarMonthHeading.textContent())?.trim() ?? '';
    expect(initialMonth.length).toBeGreaterThan(0);

    const prevMonth = await home.navigateCalendarPreviousMonth();
    expect(prevMonth).not.toBe(initialMonth);

    const nextMonth = await home.navigateCalendarNextMonth();
    expect(nextMonth).toBe(initialMonth);

    await home.filterCalendarByMember('peenaka');
    await home.filterCalendarByMember('all');
  });

  test('updates selected work archive cover preview on folder focus @regression', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const contexaFolder = page.locator('#projectsFolderArchive .folder-layer[data-project-url$="/work/contexaforge"]');
    await contexaFolder.scrollIntoViewIfNeeded();
    await contexaFolder.focus();

    await expect(page.locator('#frontDisplayTitle')).toHaveText('ContexaForge');
    await expect(page.locator('#folderFrontCover')).toHaveAttribute('href', /\/work\/contexaforge$/);
  });
});
