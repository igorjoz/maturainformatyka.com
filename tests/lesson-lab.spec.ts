import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://calendar.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Test calendar</title>' }));
  await page.goto('/');
  await page.locator('#przyklad').scrollIntoViewIfNeeded();
  await expect(page.locator('#przyklad').locator('xpath=ancestor::astro-island[1]')).not.toHaveAttribute('ssr');
});

const examples = [
  { id: 'przyklad-podstawowy', result: '3 liczby parzyste', highlights: ['8', '12', '4'] },
  { id: 'przyklad-trudniejszy', result: 'Największa suma: 6', highlights: ['3', '-1', '4'] },
  { id: 'przyklad-wyzwanie', result: 'Największa długość: 4', highlights: ['1', '2', '4', '9'] },
];

for (const example of examples) {
  test(`${example.id}: stepping, previous steps, reset, and the final result`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/#${example.id}`);
    const panel = page.locator(`#${example.id}`);
    await expect(panel).toBeVisible();
    await expect(panel.locator('.code-result strong')).toContainText(example.result);
    const source = await panel.locator('pre code').textContent();
    await panel.getByRole('button', { name: 'Prześledź rozwiązanie' }).click();
    await expect(panel.locator('[data-lab-next]')).toBeFocused();
    await expect(panel.locator('[data-lab-next]')).toBeInViewport();
    await expect(panel.locator('[data-lab-previous]')).toBeDisabled();
    await expect(panel.locator('.code-result strong')).toHaveText('W trakcie…');
    const initial = await panel.locator('[data-lab-variables]').textContent();
    await page.keyboard.press('Enter');
    await expect(panel).toHaveAttribute('data-lab-step', '1');
    await expect(panel.locator('.is-code-current')).not.toHaveCount(0);
    await panel.getByRole('button', { name: 'Poprzedni krok' }).click();
    await expect(panel.locator('[data-lab-next]')).toBeFocused();
    await expect(panel.locator('[data-lab-variables]')).toHaveText(initial!);
    await panel.getByRole('button', { name: 'Następny krok' }).click();
    await panel.getByRole('button', { name: 'Od początku' }).click();
    await expect(panel).toHaveAttribute('data-lab-step', '0');
    await expect(panel.locator('[data-lab-play]')).toBeHidden();
    const maximum = Number(await panel.locator('progress').getAttribute('max'));
    for (let i = 0; i < maximum; i++) await panel.getByRole('button', { name: 'Następny krok' }).click();
    await expect(panel.locator('[data-lab-next]')).toBeDisabled();
    await expect(panel.locator('[data-lab-reset]')).toBeFocused();
    await expect(panel.locator('.code-result strong')).toContainText(example.result);
    await expect(panel.locator('.number-sequence .is-highlighted')).toHaveText(example.highlights);
    expect(await panel.locator('pre code').textContent()).toBe(source);
    await panel.getByRole('button', { name: 'Pokaż pełne rozwiązanie' }).click();
    await expect(panel.locator('[data-lab-workspace]')).toBeHidden();
    await expect(panel.getByRole('button', { name: 'Prześledź rozwiązanie' })).toBeFocused();
    await expect(panel.getByRole('button', { name: 'Prześledź rozwiązanie' })).toBeInViewport();
  });
}

test('playback advances every 1200 ms, pauses, and stops at the result', async ({ page }) => {
  const panel = page.locator('#przyklad-podstawowy');
  await panel.getByRole('button', { name: 'Prześledź rozwiązanie' }).click();
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await panel.getByRole('button', { name: 'Odtwórz', exact: true }).click();
  await page.clock.runFor(1199);
  await expect(panel).toHaveAttribute('data-lab-step', '0');
  await page.clock.runFor(1);
  await expect(panel).toHaveAttribute('data-lab-step', '1');
  await panel.getByRole('button', { name: 'Pauza', exact: true }).click();
  await page.clock.runFor(2400);
  await expect(panel).toHaveAttribute('data-lab-step', '1');
  await panel.getByRole('button', { name: 'Odtwórz', exact: true }).click();
  await page.clock.runFor(20_000);
  const last = await panel.locator('progress').getAttribute('max');
  await expect(panel).toHaveAttribute('data-lab-step', last!);
  await expect(panel.locator('[data-lab-play]')).toHaveAttribute('aria-pressed', 'false');
  await expect(panel.locator('[data-lab-play]')).toBeDisabled();
  await expect(panel.locator('.code-result strong')).toContainText('3 liczby parzyste');
});

test('leaving the section or hiding the tab pauses playback without automatic resumption', async ({ page }) => {
  const panel = page.locator('#przyklad-podstawowy');
  await panel.getByRole('button', { name: 'Prześledź rozwiązanie' }).click();
  const play = panel.locator('[data-lab-play]');
  await play.click();
  await page.locator('#kontakt').scrollIntoViewIfNeeded();
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  const pausedAt = await panel.getAttribute('data-lab-step');
  await panel.scrollIntoViewIfNeeded();
  await page.clock.install();
  await page.clock.runFor(2400);
  await expect(panel).toHaveAttribute('data-lab-step', pausedAt!);
  await play.click();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(play).toHaveAttribute('aria-pressed', 'false');
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(2400);
  await expect(panel).toHaveAttribute('data-lab-step', pausedAt!);
});

test('changing levels restores the summary and resets the previous player', async ({ page }) => {
  const basic = page.locator('#przyklad-podstawowy');
  const advanced = page.locator('#przyklad-trudniejszy');
  await basic.getByRole('button', { name: 'Prześledź rozwiązanie' }).click();
  await basic.locator('[data-lab-play]').click();
  await basic.getByRole('button', { name: 'Proste? Spróbuj trudniejszego →' }).click();
  await expect(advanced).toBeVisible();
  await expect(basic.locator('[data-lab-play]')).toHaveAttribute('aria-pressed', 'false');
  await expect(advanced.locator('[data-lab-workspace]')).toBeHidden();
  await advanced.getByRole('button', { name: '← Wróć do podstaw' }).click();
  await expect(basic.locator('[data-lab-workspace]')).toBeHidden();
  await expect(basic.locator('.code-result strong')).toContainText('3 liczby parzyste');
  await expect(basic.locator('.number-sequence .is-highlighted')).toHaveText(['8', '12', '4']);
});

test('enabling reduced motion stops playback and retains manual stepping', async ({ page }) => {
  const panel = page.locator('#przyklad-podstawowy');
  await panel.getByRole('button', { name: 'Prześledź rozwiązanie' }).click();
  await panel.locator('[data-lab-play]').click();
  await expect(panel.locator('[data-lab-play]')).toHaveAttribute('aria-pressed', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(panel.locator('[data-lab-play]')).toBeHidden();
  await expect(panel.locator('[data-lab-play]')).toHaveAttribute('aria-pressed', 'false');
  const step = Number(await panel.getAttribute('data-lab-step'));
  await panel.locator('[data-lab-next]').click();
  await expect(panel).toHaveAttribute('data-lab-step', String(step + 1));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(panel.locator('[data-lab-play]')).toBeVisible();
  await expect(panel.locator('[data-lab-play]')).toHaveAttribute('aria-pressed', 'false');
});

for (const width of [360, 390, 768, 1024, 1366, 1440]) {
  test(`the laboratory fits its data and controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#przyklad-wyzwanie');
    const panel = page.locator('#przyklad-wyzwanie');
    await panel.getByRole('button', { name: 'Prześledź rozwiązanie' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const sizes = await panel.locator('.lab-controls button:visible, .lab-summary').evaluateAll(buttons => buttons.map(button => ({ width: button.getBoundingClientRect().width, height: button.getBoundingClientRect().height })));
    expect(sizes.every(size => size.width >= 44 && size.height >= 44)).toBe(true);
    expect(await panel.evaluate(element => element.getAnimations({ subtree: true }).some(animation => animation.playState === 'running'))).toBe(false);
  });
}

test('navigation marks the active section and updates progress with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const id of ['wspolpraca', 'zakres', 'o-mnie', 'opinie', 'oferta', 'faq']) {
    await page.evaluate(id => { location.hash = id; }, id);
    await expect(page.locator(`.desktop-nav a[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('.desktop-nav [aria-current]')).toHaveCount(1);
  }
  expect(await page.locator('[data-reading-progress]').evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--reading-progress')))).toBeGreaterThan(0.5);
});
