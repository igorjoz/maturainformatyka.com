import { expect, test } from '@playwright/test';
import rawCatalog from '../src/data/exams.json' with { type: 'json' };
import type { Exam } from '../src/data/exams';
const catalog = rawCatalog as Exam[];

const modern = catalog.find(exam => exam.year === 2026 && exam.formula === '2023' && exam.kind === 'glowny')!;
const multipart = catalog.find(exam => exam.formula === '2015' && exam.files.filter(file => file.kind === 'sheet').length === 2)!;
const incomplete = catalog.find(exam => exam.missing.length > 0)!;

test('the homepage links to the archive from navigation and the materials section', async ({ page }) => {
  await page.route('https://calendar.google.com/**', route => route.fulfill({ body: '' }));
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Nawigacja główna', exact: true }).getByRole('link', { name: /^Arkusze(?: maturalne)?$/ })).toHaveAttribute('href', '/arkusze/');
  await page.getByRole('link', { name: 'Przeglądaj arkusze maturalne' }).click();
  await expect(page).toHaveURL(/\/arkusze\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Arkusze maturalnez informatyki.');
  await expect(page.getByLabel('Formuła', { exact: true })).toHaveValue('2023');
  expect(await page.locator('[data-exam-row]:visible').evaluateAll(rows => rows.every(row => (row as HTMLElement).dataset.formula === '2023'))).toBe(true);
});

test('filters preserve state across reloads, detail-page returns, and history navigation', async ({ page }) => {
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
  await expect(page.getByRole('link', { name: '← Arkusze', exact:true })).toHaveAttribute('href', '/arkusze/?formula=2015&year=2023');
  await page.getByRole('link', { name: '← Arkusze', exact:true }).click();
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

test('empty results and invalid parameters leave the archive usable', async ({ page }) => {
  await page.goto('/arkusze/?formula=2023&level=podstawowy');
  await expect(page.getByRole('heading', { name: 'Brak pasujących zestawów' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Liczba zestawów: 0');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page.locator('[data-archive-empty]')).toBeHidden();
  await page.goto('/arkusze/?formula=nieznana&year=xxx');
  await expect(page.getByLabel('Formuła', { exact: true })).toHaveValue('2023');
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('all');
});

test('exam details display a local PDF and download actual files', async ({ page, request }) => {
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

test('older exams retain separate paper parts and switch previews', async ({ page }) => {
  await page.goto(`/arkusze/${multipart.slug}/`, { waitUntil: 'domcontentloaded' });
  const second = multipart.files.find(file => file.kind === 'sheet' && file.part === 2)!;
  await page.getByRole('button', { name: second.label, exact: true }).click();
  await expect(page.locator('[data-exam-preview]')).toHaveAttribute('src', second.path);
  await expect(page.getByRole('button', { name: second.label, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-reader-modes]')).toHaveCount(0);
});

test('incomplete sets identify missing materials and label their ZIP bundle', async ({ page }) => {
  expect(incomplete).toBeTruthy();
  await page.goto(`/arkusze/${incomplete.slug}/`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Ten zestaw jest niepełny' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Dostępne pliki ZIP — niepełny zestaw/ })).toBeVisible();
  for (const missing of incomplete.missing) await expect(page.locator('.archive-notice')).toContainText(missing);
});

for (const width of [360, 390, 768, 1024, 1366, 1440]) {
  test(`the archive fits a ${width}px viewport and supports keyboard navigation`, async ({ page }) => {
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

test('the sitemap and robots file reference canonical URLs without filters', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const sitemap = await response.text();
  expect(sitemap).toContain(`<loc>https://maturainformatyka.com/arkusze/${modern.slug}/</loc>`);
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  expect(paths.filter(path => path.startsWith('/arkusze/'))).toHaveLength(catalog.length + 1);
  for (const exam of catalog) expect(paths).toContain(`/arkusze/${exam.slug}/`);
  expect(paths).toContain('/');
  expect(paths).toContain('/zadania/');
  expect(new Set(paths).size).toBe(paths.length);
  for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) expect(new URL(match[1]).search).toBe('');
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap: https://maturainformatyka.com/sitemap.xml');
});

test.describe('archive without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('all exam sets, links, mobile navigation, and files remain available', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/arkusze/');
    await expect(page.locator('[data-exam-row]:visible')).toHaveCount(catalog.length);
    await expect(page.locator('[data-archive-filters]')).toBeHidden();
    await page.locator(`[data-exam-detail][href="/arkusze/${multipart.slug}/"]`).first().click();
    await expect(page.getByRole('heading', { name: 'Materiały do pobrania' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Otwórz PDF:/ })).toHaveCount(2);
    await page.locator('.mobile-menu summary').click();
    await page.getByRole('navigation', { name: 'Nawigacja mobilna' }).getByRole('link', { name: 'Korepetycje', exact: true }).click();
    await expect(page).toHaveURL(/\/#wspolpraca$/);
  });
});

test('compact exam navigation retains downloads and returns through tasks to the filtered archive', async ({ page }) => {
  await page.goto(`/arkusze/${modern.slug}/?powrot=${encodeURIComponent('/arkusze/?year=2026')}`);
  await expect(page.getByRole('heading', { level:1 })).toHaveText('Informatyka 2026 — Maj');
  await expect(page.locator('.exam-quick-links, .breadcrumbs, [data-preview-src]')).toHaveCount(0);
  await expect(page.locator('.exam-files a[download]')).toHaveCount(modern.files.length + 1);
  const downloadsTop = await page.locator('.exam-files').evaluate(node => node.getBoundingClientRect().top);
  const previewTop = await page.locator('.exam-preview').evaluate(node => node.getBoundingClientRect().top);
  const indexTop = await page.locator('.exam-task-index').evaluate(node => node.getBoundingClientRect().top);
  expect(previewTop).toBeLessThan(indexTop);
  expect(downloadsTop).toBeLessThan(previewTop);
  await page.locator('[data-exam-task]').first().click();
  await expect(page.locator('[data-exam-task-reader]')).toBeVisible();
  await page.locator('[data-exam-task-group]:visible [data-reader-practice]').first().click();
  await expect(page.locator('[data-task-back]')).toHaveText('← Arkusz');
  await page.locator('[data-task-back]').click();
  await expect(page).toHaveURL(new RegExp(`/arkusze/${modern.slug}/`));
  await page.locator('[data-archive-back]').click();
  await expect(page).toHaveURL(/\/arkusze\/\?year=2026$/);
});

test('navigation shortens the archive label without reducing its readable size', async ({ page }) => {
  await page.setViewportSize({ width:1280, height:900 });
  await page.goto('/arkusze/');
  const link = page.getByRole('navigation', { name:'Nawigacja główna', exact:true }).getByRole('link', { name:'Arkusze', exact:true });
  await expect(link).toBeVisible();
  expect(await link.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(14);
  await page.setViewportSize({ width:1440, height:900 });
  await expect(page.getByRole('navigation', { name:'Nawigacja główna', exact:true }).getByRole('link', { name:'Arkusze', exact:true })).toBeVisible();
});
