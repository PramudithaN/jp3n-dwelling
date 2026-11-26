import { expect, type Locator, type Page } from '@playwright/test';

export class ThemeSwitcherComponent {
  readonly page: Page;
  readonly triggerBtn: Locator;
  readonly popover: Locator;

  constructor(page: Page) {
    this.page = page;
    this.triggerBtn = page.getByRole('button', { name: 'Change website theme' });
    this.popover = page.getByRole('dialog', { name: 'Select website theme' });
  }

  async open(): Promise<void> {
    await expect(this.triggerBtn).toBeVisible();
    await this.triggerBtn.click();
    await expect(this.popover).toBeVisible();
  }

  async selectTheme(themeId: string): Promise<void> {
    const option = this.popover.locator(`.theme-option[data-theme-id="${themeId}"]`);
    await expect(option).toBeVisible();
    await option.click();
    await expect(option).toHaveAttribute('aria-checked', 'true');
  }

  async closeWithEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(this.popover).toBeHidden();
  }

  async getActiveThemeId(): Promise<string | null> {
    return this.page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  }

  async getStoredThemeId(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('teqniqks-theme'));
  }
}
