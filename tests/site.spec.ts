import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Testujemy integrację po naszej stronie, bez połączeń z Google i rezerwacji terminów.
  await page.route('https://calendar.google.com/**', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html lang="pl"><title>Kalendarz testowy</title></html>',
  }));
  await page.goto('/');
});

test('strona ładuje treść, metadane i lokalne obrazy', async ({ page }) => {
  await expect(page).toHaveTitle(/Matura z informatyki/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maturainformatyka.com/');

  // Uwzględniamy także obrazy ładowane leniwie, bez zależności od przewijania.
  const brokenImages = await page.locator('img').evaluateAll(async (images: HTMLImageElement[]) => {
    const results = await Promise.all(images.map(async image => {
      try {
        image.loading = 'eager';
        await image.decode();
        return null;
      } catch {
        return image.getAttribute('src');
      }
    }));
    return results.filter(src => src !== null);
  });
  expect(brokenImages).toEqual([]);
});

test('nawigacja prowadzi do istniejących sekcji', async ({ page }) => {
  const links = page.getByRole('navigation', { name: 'Nawigacja główna', exact: true }).getByRole('link');
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^#.+/);
    await expect(page.locator(href!)).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(href!)).toBeInViewport();
  }
});

test('przycisk spotkania prowadzi do kalendarza z linkiem alternatywnym', async ({ page }) => {
  await page.locator('.hero-actions').getByRole('link', { name: 'Umów bezpłatne spotkanie' }).click();
  await expect(page).toHaveURL(/#rezerwacja$/);
  const booking = page.locator('#rezerwacja');
  await expect(booking).toBeInViewport();
  const frame = booking.locator('iframe');
  await expect(frame).toHaveAttribute('title', /Rezerwacja bezpłatnego/);
  const embed = new URL((await frame.getAttribute('src'))!);
  expect(embed.origin).toBe('https://calendar.google.com');
  expect(embed.pathname).toMatch(/\/appointments\/schedules\/.+/);
  expect(embed.searchParams.get('hl')).toBe('pl');
  expect(embed.searchParams.get('gv')).toBe('true');
  const alternative = booking.getByRole('link', { name: 'Otwórz rezerwację w Google' });
  const target = new URL((await alternative.getAttribute('href'))!);
  expect(target.origin + target.pathname).toBe(embed.origin + embed.pathname);
  await expect(alternative).toHaveAttribute('target', '_blank');
});

test('kontakt udostępnia poprawne odnośniki e-mail i telefon', async ({ page }) => {
  const email = page.locator('#kontakt').getByRole('link', { name: /NAPISZ DO MNIE/ });
  const address = (await email.locator('strong').innerText()).trim();
  expect(address).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  await expect(email).toHaveAttribute('href', `mailto:${address}`);
  const phone = page.locator('#kontakt').getByRole('link', { name: /LUB ZADZWOŃ/ });
  const number = (await phone.locator('strong').innerText()).replace(/\s/g, '');
  expect(number).toMatch(/^\+\d{9,15}$/);
  await expect(phone).toHaveAttribute('href', `tel:${number}`);
});

test('menu mobilne zamyka się po wyborze sekcji oraz po Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.locator('.mobile-menu');
  const toggle = menu.locator('summary');
  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Kontakt', exact: true }).click();
  await expect(page).toHaveURL(/#kontakt$/);
  await expect(menu).not.toHaveAttribute('open');
  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });

  test('menu mobilne, rezerwacja i rozwijanie FAQ nadal działają', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.mobile-menu summary').click();
    await page.getByRole('navigation', { name: 'Nawigacja mobilna' }).getByRole('link', { name: 'FAQ', exact: true }).click();
    await expect(page).toHaveURL(/#faq$/);
    const question = page.locator('#faq details').filter({ hasText: 'Czy muszę już dobrze programować?' });
    const answer = question.locator('p');
    await expect(answer).not.toBeVisible();
    await question.locator('summary').click();
    await expect(answer).toBeVisible();
    await question.locator('summary').click();
    await expect(answer).not.toBeVisible();
    await page.locator('.hero-actions').getByRole('link', { name: 'Umów bezpłatne spotkanie' }).click();
    await expect(page).toHaveURL(/#rezerwacja$/);
    await expect(page.locator('#rezerwacja')).toBeInViewport();
  });
});
