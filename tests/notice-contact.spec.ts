import { expect, test } from '@playwright/test';
import { readdirSync } from 'node:fs';
import exams from '../src/data/exams.json' with { type: 'json' };

const task = `/zadania/${readdirSync('src/data/task-practice')[0].replace(/\.json$/, '')}/`;
const exam = `/arkusze/${exams[0].slug}/`;
const key = 'matura:2027:guide-notice:dismissed';

for (const width of [390, 1366]) test(`guide notice sits below content and dismissal persists at ${width}px`, async ({ page, context }) => {
 await page.setViewportSize({ width, height: 900 });
 await page.goto('/zadania/');
 const notice = page.locator('[data-guide-notice]');
 await expect(notice).toBeVisible();
 expect(await notice.evaluate(el => el === [...document.querySelector('main')!.children].filter(child => child.tagName !== 'SCRIPT').at(-1))).toBe(true);
 const button = notice.getByRole('button', { name: 'Zamknij informację o maturze 2027' });
 const box = await button.boundingBox();
 expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await button.focus(); await page.keyboard.press('Enter');
 await expect(notice).toBeHidden();
 expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe('1');
 await page.reload(); await expect(notice).toBeHidden();
 if (width <= 900) await page.locator('.mobile-menu summary').click();
 await page.locator(width <= 900 ? '#mobile-navigation' : '.desktop-nav').getByRole('link', { name: 'Arkusze', exact: true }).click();
 await expect(page).toHaveURL(/\/arkusze\/$/); await expect(notice).toBeHidden();
 for (const path of [task, exam]) { await page.goto(path); await expect(notice).toBeHidden(); }
 const tab = await context.newPage(); await tab.goto('/zadania/');
 await expect(tab.locator('[data-guide-notice]')).toBeHidden(); await tab.close();
});

test('blocked storage does not prevent dismissal', async ({ page }) => {
 await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }));
 const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
 await page.goto('/arkusze/');
 await page.locator('[data-guide-notice-close]').click();
 await expect(page.locator('[data-guide-notice]')).toBeHidden();
 expect(errors).toEqual([]);
});

test('notice and contact work without JavaScript', async ({ browser }) => {
 const context = await browser.newContext({ javaScriptEnabled: false });
 const page = await context.newPage(); await page.goto('/arkusze/');
 await expect(page.locator('[data-guide-notice]')).toBeVisible();
 await expect(page.locator('[data-guide-notice-close]')).toBeHidden();
 await expect(page.locator('[data-guide-notice] a')).toHaveAttribute('href', '/matura-2027/');
 await expect(page.locator('.contact-booking-button')).toHaveAttribute('href', '/#rezerwacja');
 await context.close();
});

for (const width of [390, 1366]) test(`celebration works at the page end on every layout at ${width}px`, async ({ page }) => {
 await page.setViewportSize({ width, height: 900 });
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 await page.route('https://calendar.google.com/**', route => route.fulfill({ body: '' }));
 for (const path of ['/', '/matura-2027/', '/wiedza/', '/zadania/', '/arkusze/', '/zadania/tematy/napisy/', task, exam]) {
  await page.goto(path);
  const contact = page.locator('.contact-section');
  await expect(contact.locator('.contact-celebration')).toHaveCount(1);
  await expect(contact).not.toHaveClass(/contact-arrived/);
  await page.locator('[data-page-end]').scrollIntoViewIfNeeded();
  await expect(contact).toHaveClass(/contact-arrived/);
  await expect(contact).toHaveClass(/celebration-active/);
  await expect(contact.locator('.celebration-ribbon').first()).toHaveCSS('animation-name', 'ribbon-unfurl');
  await expect(contact.locator('.contact-celebration')).toHaveCSS('pointer-events', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(async () => {
   const ribbon = document.querySelector('.celebration-ribbon')!;
   await Promise.all(ribbon.getAnimations().map(animation => animation.finished));
   Reflect.set(window, '__finishedRibbon', ribbon.getAnimations()[0]);
   scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.locator('[data-page-end]').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.querySelector('.celebration-ribbon')!.getAnimations()[0] === Reflect.get(window, '__finishedRibbon'))).toBe(true);
  await expect(contact.locator('.celebration-ribbon').first()).toHaveCSS('stroke-dashoffset', '0px');
 }
});

test('celebration initializes on Astro navigation and restored scroll positions', async ({ page }) => {
 await page.goto('/zadania/');
 await page.evaluate(() => Reflect.set(window, '__sameDocument', true));
 await page.locator('.desktop-nav').getByRole('link', { name: 'Wiedza', exact: true }).click();
 await expect(page).toHaveURL(/\/wiedza\/$/);
 await page.locator('[data-page-end]').scrollIntoViewIfNeeded();
 await expect(page.locator('.contact-section')).toHaveClass(/contact-arrived/);
 await expect.poll(() => page.evaluate(() => history.state.scrollY === scrollY)).toBe(true);
 // Preserve the bottom position: Playwright's automatic scroll-to-click can move the document.
 await page.locator('.desktop-nav').getByRole('link', { name: 'Arkusze', exact: true }).evaluate(link => (link as HTMLAnchorElement).click());
 await expect(page).toHaveURL(/\/arkusze\/$/);
 await page.locator('[data-page-end]').scrollIntoViewIfNeeded();
 await expect(page.locator('.contact-section')).toHaveClass(/contact-arrived/);
 expect(await page.evaluate(() => Reflect.get(window, '__sameDocument'))).toBe(true);
 await page.goBack(); await expect(page).toHaveURL(/\/wiedza\/$/);
 await expect(page.locator('.contact-section')).toHaveClass(/contact-arrived/);
 await page.reload();
 await expect(page.locator('.contact-section')).toHaveClass(/contact-arrived/);
});

test('celebration waits for active tab and motion preference, and stays hidden in print', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/wiedza/');
 const contact = page.locator('.contact-section');
 await page.locator('[data-page-end]').scrollIntoViewIfNeeded();
 await expect(contact).not.toHaveClass(/contact-arrived/);
 await expect(contact.locator('.contact-celebration')).toBeHidden();
 await page.evaluate(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new Event('visibilitychange'));
 });
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 await expect(contact).not.toHaveClass(/contact-arrived/);
 await page.evaluate(() => {
  Reflect.deleteProperty(document, 'hidden');
  document.dispatchEvent(new Event('visibilitychange'));
 });
 await expect(contact).toHaveClass(/contact-arrived/);
 await page.emulateMedia({ media: 'print' });
 await expect(contact.locator('.contact-celebration')).toBeHidden();
});

test('celebration falls back to scroll when IntersectionObserver is unavailable', async ({ page }) => {
 await page.addInitScript(() => Reflect.deleteProperty(window, 'IntersectionObserver'));
 await page.goto('/wiedza/');
 await page.locator('[data-page-end]').scrollIntoViewIfNeeded();
 await expect(page.locator('.contact-section')).toHaveClass(/contact-arrived/);
});
