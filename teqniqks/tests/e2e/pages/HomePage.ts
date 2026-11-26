import { expect, type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly screenLoader: Locator;
  readonly mainContent: Locator;
  readonly skipLink: Locator;
  readonly mobileToggle: Locator;
  readonly mobileDrawer: Locator;
  readonly afkSection: Locator;
  readonly afkStamp: Locator;
  readonly calendarMonthHeading: Locator;
  readonly calendarPrevBtn: Locator;
  readonly calendarNextBtn: Locator;
  readonly calendarGrid: Locator;
  readonly copyEmailBtn: Locator;
  readonly copyFeedback: Locator;

  constructor(page: Page) {
    this.page = page;
    this.screenLoader = page.locator('#teqniqksScreenLoader');
    this.mainContent = page.locator('#main-content');
    this.skipLink = page.getByRole('link', { name: 'Skip to main content' });
    this.mobileToggle = page.getByRole('button', { name: 'Toggle navigation menu' });
    this.mobileDrawer = page.locator('#mobileDrawer');
    this.afkSection = page.locator('#afk');
    this.afkStamp = this.afkSection.locator('.afk-stamp');
    this.calendarMonthHeading = page.locator('#calendar-heading');
    this.calendarPrevBtn = page.getByRole('button', { name: 'Previous month' });
    this.calendarNextBtn = page.getByRole('button', { name: 'Next month' });
    this.calendarGrid = page.getByRole('grid', { name: 'Monthly project contributions' });
    this.copyEmailBtn = page.locator('#copyEmailTrigger');
    this.copyFeedback = page.locator('#copyFeedback');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.screenLoader).toBeHidden();
    await expect(this.mainContent).toBeVisible();
  }

  async openMobileMenu(): Promise<void> {
    await expect(this.mobileToggle).toBeVisible();
    await this.mobileToggle.click();
    await expect(this.mobileToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(this.mobileDrawer).toBeVisible();
  }

  async closeMobileMenu(): Promise<void> {
    await this.mobileToggle.click();
    await expect(this.mobileToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(this.mobileDrawer).toBeHidden();
  }

  async navigateCalendarPreviousMonth(): Promise<string> {
    const before = (await this.calendarMonthHeading.textContent())?.trim() ?? '';
    await this.calendarPrevBtn.scrollIntoViewIfNeeded();
    await this.calendarPrevBtn.click();
    await expect(this.calendarMonthHeading).not.toHaveText(before);
    return (await this.calendarMonthHeading.textContent())?.trim() ?? '';
  }

  async navigateCalendarNextMonth(): Promise<string> {
    const before = (await this.calendarMonthHeading.textContent())?.trim() ?? '';
    await this.calendarNextBtn.scrollIntoViewIfNeeded();
    await this.calendarNextBtn.click();
    await expect(this.calendarMonthHeading).not.toHaveText(before);
    return (await this.calendarMonthHeading.textContent())?.trim() ?? '';
  }

  async filterCalendarByMember(memberHandle: string): Promise<void> {
    const filterBtn = this.page.locator(`.member-filter-btn[data-member="${memberHandle}"]`);
    await filterBtn.scrollIntoViewIfNeeded();
    await filterBtn.click();
    await expect(filterBtn).toHaveClass(/is-active/);
  }
}
