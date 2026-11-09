import { expect, test } from '@playwright/test';
import rawCatalog from '../src/data/exams.json' with { type: 'json' };
import type { Exam } from '../src/data/exams';
const catalog = rawCatalog as Exam[];

const modern = catalog.find(exam => exam.year === 2026 && exam.formula === '2023' && exam.kind === 'glowny')!;
const multipart = catalog.find(exam => exam.formula === '2015' && exam.files.filter(file => file.kind === 'sheet').length === 2)!;
const incomplete = catalog.find(exam => exam.missing.length > 0)!;

test('strona główna udostępnia archiwum w menu i sekcji materiałów', async ({ page }) => {
  await page.route('https://calendar.google.com/**', route => route.fulfill({ body: '' }));
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Nawigacja główna', exact: true }).getByRole('link', { name: 'Arkusze maturalne' })).toHaveAttribute('href', '/arkusze/');
  await page.getByRole('link', { name: 'Przeglądaj arkusze maturalne' }).click();
  await expect(page).toHaveURL(/\/arkusze\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Arkusze maturalnez informatyki.');
  await expect(page.getByLabel('Formuła', { exact: true })).toHaveValue('2023');
  expect(await page.locator('[data-exam-row]:visible').evaluateAll(rows => rows.every(row => (row as HTMLElement).dataset.formula === '2023'))).toBe(true);
});

test('filtry zachowują stan po odświeżeniu, powrocie ze szczegółów i zmianie historii', async ({ page }) => {
  await page.goto('/arkusze/');
  const formula = page.getByLabel('Formuła', { exact: true });
  await formula.selectOption('2015');
  await page.getByLabel('Rok', { exact: true }).selectOption('2023');
  await expect(page.locator('[data-exam-row]:visible')).toHaveCount(catalog.filter(exam => exam.formula === '2015' && exam.year === 2023).length);
  const filteredUrl = page.url();
  await page.reload();
  await expect(formula).toHaveValue('2015');
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('2023');
  await page.locator('[data-exam-row]:visible [data-exam-detail]').first().click();
  await expect(page.getByRole('link', { name: '← Wróć do spisu arkuszy' })).toHaveAttribute('href', '/arkusze/?formula=2015&year=2023');
  await page.getByRole('link', { name: '← Wróć do spisu arkuszy' }).click();
  await expect(page).toHaveURL(filteredUrl);
  await formula.selectOption('starsza');
  await page.goBack();
  await expect(formula).toHaveValue('2015');
  await page.goForward();
  await expect(formula).toHaveValue('starsza');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page.locator('[data-exam-row]:visible')).toHaveCount(catalog.length);
  await expect(formula).toHaveValue('all');
});

test('brak dopasowań i niepoprawne parametry nie psują spisu', async ({ page }) => {
  await page.goto('/arkusze/?formula=2023&level=podstawowy');
  await expect(page.getByRole('heading', { name: 'Brak pasujących zestawów' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Liczba zestawów: 0');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page.locator('[data-archive-empty]')).toBeHidden();
  await page.goto('/arkusze/?formula=nieznana&year=xxx');
  await expect(page.getByLabel('Formuła', { exact: true })).toHaveValue('2023');
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('all');
});

test('podstrona matury wyświetla lokalny PDF i pobiera rzeczywiste pliki', async ({ page, request }) => {
  await page.goto(`/arkusze/${modern.slug}/`, { waitUntil: 'domcontentloaded' });
  const sheet = modern.files.find(file => file.kind === 'sheet')!;
  await expect(page.locator('[data-exam-preview]')).toHaveAttribute('src', sheet.path);
  const response = await request.get(sheet.path);
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-');
  expect(response.headers()['content-type']).toContain('application/pdf');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: /Cały zestaw ZIP/ }).click()]);
  expect(new URL(download.url()).origin).toBe(new URL(page.url()).origin);
  expect(await download.failure()).toBeNull();
  const zip = await request.get(modern.bundle.path);
  expect((await zip.body()).subarray(0, 2).toString()).toBe('PK');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://maturainformatyka.com/arkusze/${modern.slug}/`);
  await expect(page.locator('.brand')).toHaveAttribute('href', '/');
  await expect(page.locator('.header-contact')).toHaveAttribute('href', '/#rezerwacja');
});

test('starszy egzamin zachowuje części arkusza i przełącza podgląd', async ({ page }) => {
  await page.goto(`/arkusze/${multipart.slug}/`, { waitUntil: 'domcontentloaded' });
  const second = multipart.files.find(file => file.kind === 'sheet' && file.part === 2)!;
  await page.getByRole('button', { name: second.label, exact: true }).click();
  await expect(page.locator('[data-exam-preview]')).toHaveAttribute('src', second.path);
  await expect(page.getByRole('button', { name: second.label, exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('niepełny zestaw jasno opisuje brakujące materiały i paczkę ZIP', async ({ page }) => {
  expect(incomplete).toBeTruthy();
  await page.goto(`/arkusze/${incomplete.slug}/`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Ten zestaw jest niepełny' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dostępne pliki ZIP — niepełny zestaw/ })).toBeVisible();
  for (const missing of incomplete.missing) await expect(page.locator('.archive-notice')).toContainText(missing);
});

for (const width of [360, 390, 768, 1024, 1366, 1440]) {
  test(`archiwum mieści się w widoku ${width}px i działa z klawiaturą`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/arkusze/');
    await page.getByLabel('Formuła', { exact: true }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Rok', { exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto(`/arkusze/${multipart.slug}/`, { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('sitemap i roboty wskazują kanoniczne adresy bez filtrów', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const sitemap = await response.text();
  expect(sitemap).toContain(`<loc>https://maturainformatyka.com/arkusze/${modern.slug}/</loc>`);
  expect(sitemap.match(/<url>/g)?.length).toBe(catalog.length + 2);
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) expect(new URL(match[1]).search).toBe('');
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://maturainformatyka.com/sitemap.xml');
});

test.describe('archiwum bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('wszystkie zestawy, linki, nawigacja mobilna i pliki pozostają dostępne', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/arkusze/');
    await expect(page.locator('[data-exam-row]:visible')).toHaveCount(catalog.length);
    await expect(page.locator('[data-archive-filters]')).toBeHidden();
    await page.locator(`[data-exam-detail][href="/arkusze/${multipart.slug}/"]`).click();
    await expect(page.getByRole('heading', { name: 'Materiały do pobrania' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Otwórz PDF:/ })).toHaveCount(2);
    await page.locator('.mobile-menu summary').click();
    await page.getByRole('navigation', { name: 'Nawigacja mobilna' }).getByRole('link', { name: 'Zakres', exact: true }).click();
    await expect(page).toHaveURL(/\/#zakres$/);
  });
});
