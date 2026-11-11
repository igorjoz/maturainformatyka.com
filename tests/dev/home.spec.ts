import { expect, test } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const exec = promisify(execFile);

test('the live dev homepage survives production checks and builds', async ({ browser, baseURL }) => {
  test.setTimeout(180_000);
  for (const phase of ['start', 'check', 'build']) {
    if (phase !== 'start') {
      await exec('npm', ['run', phase], {
        env: { ...process.env, NODE_ENV: 'production' },
        maxBuffer: 16 * 1024 * 1024,
        timeout: 120_000,
      });
    }
    for (const width of [1440, 390]) {
      // A fresh context avoids hiding a corrupted server cache behind cached browser modules.
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.route('https://calendar.google.com/**', route => route.fulfill({ body: '' }));
      await page.goto(baseURL!);
      await expect(page.locator('#start h1'), `${phase}, ${width}px`).toContainText('Matura z informatyki.');
      await expect(page.locator('.site-header')).toBeVisible();
      await expect(page.locator('#start').locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute('ssr');
      await expect(page.locator('.site-header').locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute('ssr');
      await expect(page.locator('#start h1')).toBeVisible();
      if (width === 390) {
        await page.locator('.mobile-menu summary').click();
        await expect(page.getByRole('navigation', { name: 'Nawigacja mobilna' })).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
      }
      expect(errors, `${phase}, ${width}px`).toEqual([]);
      await context.close();
    }
  }
});
