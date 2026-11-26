import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { ThemeSwitcherComponent } from './pages/ThemeSwitcherComponent';

test.describe('Global theme switcher', () => {
  test('switches themes, persists across reload, and closes on Escape @regression', async ({ page }) => {
    const home = new HomePage(page);
    const themeSwitcher = new ThemeSwitcherComponent(page);

    await home.goto();
    const initialTheme = await themeSwitcher.getActiveThemeId();
    expect(initialTheme).toBe('forest-canopy');

    await themeSwitcher.open();
    await themeSwitcher.selectTheme('golden-hour');

    expect(await themeSwitcher.getActiveThemeId()).toBe('golden-hour');
    expect(await themeSwitcher.getStoredThemeId()).toBe('golden-hour');

    await themeSwitcher.closeWithEscape();

    await page.reload();
    await expect(home.screenLoader).toBeHidden();
    expect(await themeSwitcher.getActiveThemeId()).toBe('golden-hour');
  });
});
