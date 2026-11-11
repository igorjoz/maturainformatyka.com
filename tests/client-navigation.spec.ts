import { expect, test, type Page } from '@playwright/test';

async function followNavigation(page: Page, label: string, path: string) {
  await page.locator('.desktop-nav').getByRole('link', { name: label, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await expect(page.locator('.site-header').locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute('ssr');
  await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
  expect(await page.evaluate(() => Reflect.get(window, '__navigationTest'))).toBe('same document');
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.route('https://calendar.google.com/**', route => route.fulfill({ body: '' }));
  await page.goto('/');
  await page.evaluate(() => Reflect.set(window, '__navigationTest', 'same document'));
});

test('all layouts navigate without reloading and reinitialize their interactive controls', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (let visit = 0; visit < 2; visit++) {
    await followNavigation(page, 'Matura 2027', '/matura-2027/');
    const check = page.locator('[data-study-check]').first();
    await check.setChecked(visit === 0);
    await followNavigation(page, 'Wiedza', '/wiedza/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maturainformatyka.com/wiedza/');
    await followNavigation(page, 'Zadania', '/zadania/');
    await expect(page.locator('[data-task-filters]')).toBeVisible();
    await page.locator('.task-extra-filters summary').click();
    await page.locator('[data-task-filters] [name="rok"]').selectOption('2025');
    await expect(page).toHaveURL(/rok=2025/);
    await followNavigation(page, 'Arkusze', '/arkusze/');
    await expect(page.locator('[data-archive-filters]')).toBeVisible();
    await page.locator('[data-archive-filters] [name="year"]').selectOption('2025');
    await page.locator('[data-exam-row]:visible [data-exam-detail]').first().click();
    await expect(page.locator('[data-archive-back]')).toHaveAttribute('href', '/arkusze/?year=2025');
    await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
    await page.locator('[data-archive-back]').click();
    await expect(page.locator('[name="year"]')).toHaveValue('2025');
    await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
    await page.goBack();
    await expect(page.locator('[data-archive-back]')).toBeVisible();
    await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
    await page.goForward();
    await expect(page.locator('[name="year"]')).toHaveValue('2025');
    await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
    expect(await page.evaluate(() => Reflect.get(window, '__navigationTest'))).toBe('same document');
    await followNavigation(page, 'Korepetycje', '/#wspolpraca');
    await expect(page.locator('#wspolpraca')).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('task practice initializes when arriving from the catalog and after returning', async ({ page }) => {
  await followNavigation(page, 'Zadania', '/zadania/');
  await page.locator('.task-extra-filters summary').click();
  await page.locator('[name="sprawdzanie"]').check();
  const link = page.locator('[data-task-row]:visible [data-task-link]').first();
  for (let visit = 0; visit < 2; visit++) {
    await link.click();
    const form = page.locator('[data-practice-form]');
    await expect(form.locator('[data-practice-actions]')).toBeVisible();
    await form.getByRole('button', { name: /Sprawdź/ }).click();
    await expect(page.locator('[data-practice-status]')).not.toBeEmpty();
    await page.locator('[data-task-back]').click();
    await expect(page.locator('[name="sprawdzanie"]')).toBeChecked();
    expect(await page.evaluate(() => Reflect.get(window, '__navigationTest'))).toBe('same document');
  }
});

test('knowledge fades in over an opaque page and other routes retain their transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await followNavigation(page, 'Zadania', '/zadania/');
  const samples = page.evaluate(() => new Promise<{ opacity: string; blend: string; name: string }>(resolve => {
    document.addEventListener('astro:after-swap', () => {
      const sample = () => {
        if (!document.getAnimations().some(animation => animation instanceof CSSAnimation && animation.animationName === 'knowledge-page-reveal')) {
          requestAnimationFrame(sample);
          return;
        }
        const old = getComputedStyle(document.documentElement, '::view-transition-old(root)');
        const incoming = getComputedStyle(document.documentElement, '::view-transition-new(root)');
        resolve({ opacity: old.opacity, blend: incoming.mixBlendMode, name: old.animationName });
      };
      requestAnimationFrame(sample);
    }, { once: true });
  }));
  await page.locator('.desktop-nav').getByRole('link', { name: 'Wiedza', exact: true }).click();
  expect(await samples).toEqual({ opacity: '1', blend: 'normal', name: 'none' });
  await expect(page.locator('html')).not.toHaveAttribute('data-astro-transition');
  await followNavigation(page, 'Arkusze', '/arkusze/');
  await expect(page.locator('html')).not.toHaveAttribute('data-knowledge-index');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await followNavigation(page, 'Wiedza', '/wiedza/');
  expect(await page.evaluate(() => document.getAnimations().some(animation =>
    animation instanceof CSSAnimation && animation.animationName === 'knowledge-page-reveal'))).toBe(false);
});
