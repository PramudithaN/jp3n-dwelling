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

  test('navigates build calendar months and filters by team member @regression', async ({
    page,
  }) => {
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

  test('updates selected work archive cover preview on folder focus @regression', async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();

    const contexaFolder = page.locator(
      '#projectsFolderArchive .folder-layer[data-project-url$="/work/contexaforge"]',
    );
    await contexaFolder.scrollIntoViewIfNeeded();
    await contexaFolder.focus();

    await expect(page.locator('#frontDisplayTitle')).toHaveText('ContexaForge');
    await expect(page.locator('#folderFrontCover')).toHaveAttribute(
      'href',
      /\/work\/contexaforge$/,
    );
  });

  test('rotates 6-member coverflow and handles keyboard slider scrubbing without scrolling @regression', async ({
    page,
  }) => {
    const home = new HomePage(page);
    await home.goto();

    const preferencesSection = page.locator('#preferences');
    await preferencesSection.scrollIntoViewIfNeeded();

    await expect(page.locator('.dev-pill')).toHaveCount(6);
    await expect(page.locator('.cf-card')).toHaveCount(6);

    const nextBtn = page.locator('#cfNextBtn');
    for (let step = 0; step < 3; step++) {
      await expect(page.locator('.cf-card.is-center')).toHaveCount(1);
      const hiddenCard = page.locator('.cf-card.is-hidden-back');
      await expect(hiddenCard).toHaveCount(1);
      await expect(hiddenCard).toHaveAttribute('aria-hidden', 'true');
      await expect(hiddenCard).toHaveAttribute('tabindex', '-1');
      await nextBtn.click();
    }

    const slider = page.locator('#npProgressTrack');
    await slider.scrollIntoViewIfNeeded();
    await slider.focus();
    await expect(slider).toBeFocused();
    await expect(slider).toHaveAttribute('aria-valuenow', '0');

    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(200);

    for (const key of ['Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft']) {
      await slider.press(key);
    }

    const scrollAfterIdleKeys = await page.evaluate(() => window.scrollY);
    expect(Math.abs(scrollAfterIdleKeys - scrollBefore)).toBeLessThan(5);
    await expect(slider).toHaveAttribute('aria-valuenow', '0');

    const audioSetup = await page.evaluate(async () => {
      const audio = document.getElementById('rotationAudio');
      if (!(audio instanceof HTMLAudioElement)) {
        throw new Error('Missing #rotationAudio element');
      }

      const sampleRate = 8000;
      const durationSec = 10;
      const numSamples = sampleRate * durationSec;
      const buffer = new ArrayBuffer(44 + numSamples);
      const view = new DataView(buffer);
      const writeAscii = (offset: number, text: string) => {
        for (let i = 0; i < text.length; i++) {
          view.setUint8(offset + i, text.charCodeAt(i));
        }
      };

      writeAscii(0, 'RIFF');
      view.setUint32(4, 36 + numSamples, true);
      writeAscii(8, 'WAVE');
      writeAscii(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate, true);
      view.setUint16(32, 1, true);
      view.setUint16(34, 8, true);
      writeAscii(36, 'data');
      view.setUint32(40, numSamples, true);
      new Uint8Array(buffer, 44).fill(128);

      const blobUrl = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => {
          audio.removeEventListener('loadedmetadata', onLoaded);
          audio.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          audio.removeEventListener('loadedmetadata', onLoaded);
          audio.removeEventListener('error', onError);
          reject(new Error('Failed to load silent WAV metadata'));
        };
        audio.addEventListener('loadedmetadata', onLoaded);
        audio.addEventListener('error', onError);
        audio.src = blobUrl;
        audio.load();
      });

      return { blobUrl, duration: audio.duration };
    });

    try {
      expect(audioSetup.duration).toBeGreaterThanOrEqual(9.9);
      await slider.focus();

      await slider.press('ArrowRight');
      await expect(slider).toHaveAttribute('aria-valuenow', '20');

      await slider.press('End');
      await expect(slider).toHaveAttribute('aria-valuenow', '100');

      await slider.press('ArrowLeft');
      await expect(slider).toHaveAttribute('aria-valuenow', '80');

      await slider.press('Home');
      await expect(slider).toHaveAttribute('aria-valuenow', '0');

      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(Math.abs(finalScrollY - scrollBefore)).toBeLessThan(5);
    } finally {
      await page.evaluate((url) => URL.revokeObjectURL(url), audioSetup.blobUrl);
    }
  });
});
