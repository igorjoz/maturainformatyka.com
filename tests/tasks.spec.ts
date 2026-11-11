import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import catalog from '../src/data/exams.json' with { type: 'json' };

const entries = readdirSync('src/content/tasks').filter(name => name.endsWith('.md')).map(name => {
  const raw = readFileSync(join('src/content/tasks', name), 'utf8');
  const meta = JSON.parse(raw.split('---')[1]);
  return { id: name.slice(0, -3), ...meta };
});
const path = (id: string) => `/zadania/${id}/`;
const rows = '[data-task-row]:visible';
const withData = entries.find(entry => entry.dataFiles.length > 0)!;
const withDependency = entries.find(entry => entry.dependencies.length > 0)!;
const withTable = entries.find(entry => readFileSync(`src/content/tasks/${entry.id}.md`, 'utf8').includes('<table'))!;

for (const viewport of [{ width: 1366, height: 768 }, { width: 1440, height: 900 }]) {
  test(`first row of cards fits without scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/zadania/');
    await expect(page.locator('[data-task-filters]')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.locator(rows).evaluateAll(nodes => nodes.slice(0, 2).map(node => {
      const { top, bottom, left } = node.getBoundingClientRect();
      return { top, bottom, left };
    }));
    expect(bounds[0].top).toBe(bounds[1].top);
    expect(bounds[1].left).toBeGreaterThan(bounds[0].left);
    for (const card of bounds) expect(card.bottom).toBeLessThanOrEqual(viewport.height);
    const filters = (await page.locator('[data-task-filters]').boundingBox())!;
    expect(filters.width).toBe(260);
    expect(filters.x + filters.width).toBeLessThan(bounds[0].left);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });
}

for (const viewport of [{ width: 390, height: 844 }, { width: 360, height: 740 }]) {
  test(`first task title and description fit without scrolling at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/zadania/');
    await expect(page.getByLabel('Dział', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Trudność', { exact: true })).toBeVisible();
    await expect(page.locator('.task-extra-filters')).not.toHaveAttribute('open');
    await page.evaluate(() => document.fonts.ready);
    const card = page.locator(rows).first();
    for (const element of [card.locator('h2'), card.locator(':scope > p').nth(1)]) {
      const bounds = (await element.boundingBox())!;
      expect(bounds.y).toBeGreaterThan(0);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height);
    }
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });
}

test('mobile section, topics and advanced settings survive resizing, reloads and history', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/zadania/');
  await page.getByLabel('Dział', { exact: true }).selectOption('programowanie');
  await expect(page).toHaveURL(/dzial=programowanie/);
  await expect(page.locator('.task-extra-filters')).not.toHaveAttribute('open');
  await page.locator('.task-extra-filters summary').focus();
  await page.keyboard.press('Enter');
  await page.locator('[data-topic-choice="napisy"]').click();
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Ze sprawdzaniem odpowiedzi', { exact: true }).check();
  await page.getByLabel('Kolejność', { exact: true }).selectOption('punkty');
  await expect(page.locator('[data-extra-count]')).toHaveText('(4)');
  const selected = page.url();
  const ids = await page.locator(rows).evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.id));
  expect(ids.length).toBeGreaterThan(0);
  await page.setViewportSize({ width: 1366, height: 768 });
  await expect(page.locator('[data-desktop-topics] [data-topic-choice="napisy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-task-section="programowanie"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-extra-count]')).toHaveText('(3)');
  await expect(page).toHaveURL(selected);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('.task-extra-filters')).not.toHaveAttribute('open');
  await expect(page.locator('[data-extra-count]')).toHaveText('(4)');
  expect(await page.locator(rows).evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.id))).toEqual(ids);
  await expect(page.locator('[data-task-active]')).toContainText('Napisy');
  await page.getByLabel('Dział', { exact: true }).selectOption('arkusze-kalkulacyjne');
  expect(new URL(page.url()).searchParams.has('temat')).toBe(false);
  await page.goBack();
  await expect(page.getByLabel('Dział', { exact: true })).toHaveValue('programowanie');
  await expect(page).toHaveURL(selected);
  await page.locator(`${rows} [data-task-link]`).first().click();
  await page.locator('[data-task-back]').click();
  await expect(page).toHaveURL(selected);
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page).toHaveURL(/\/zadania\/$/);
  await expect(page.locator(rows)).toHaveCount(entries.length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('mobile topic pages retain the fixed topic on reset and navigate when changing section', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/zadania/tematy/napisy/?rok=2026&sort=punkty');
  await expect(page.getByLabel('Dział', { exact: true })).toHaveValue('programowanie');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page).toHaveURL(/\/zadania\/tematy\/napisy\/$/);
  await expect(page.locator(rows)).toHaveCount(entries.filter(entry => entry.topics.includes('napisy')).length);
  await page.getByLabel('Dział', { exact: true }).selectOption('teoria');
  await expect(page).toHaveURL(/\/zadania\/\?dzial=teoria$/);
  expect(await page.locator(rows).evaluateAll(nodes => nodes.every(node => (node as HTMLElement).dataset.sections!.split(' ').includes('teoria')))).toBe(true);
});

test('expanded mobile filters fit long names and recover from empty results', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/zadania/');
  await page.getByLabel('Dział', { exact: true }).selectOption('arkusze-kalkulacyjne');
  await page.locator('.task-extra-filters summary').click();
  await page.locator('[data-topic-choice="analiza-danych"]').click();
  await expect(page.locator('[data-task-active]')).toContainText('Agregacja i analiza danych');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel('Szukaj zadania').fill('nieistniejace-haslo-987654321');
  await expect(page.getByRole('heading', { name: 'Brak pasujących zadań' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Liczba zadań: 0');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page.locator(rows)).toHaveCount(entries.length);
  await expect(page.locator('[data-extra-count]')).toBeEmpty();
});

test('all seven exams are represented by individually addressable subtasks', async ({ page, request }) => {
  expect(entries.length).toBe(154);
  await page.goto('/zadania/');
  await expect(page.locator(rows)).toHaveCount(entries.length);
  await expect(page.getByRole('status')).toHaveText(`Liczba zadań: ${entries.length}`);
  await expect(page.getByLabel('Kolejność', { exact: true })).toHaveValue('latwiejsze');
  const difficulties = await page.locator(rows).evaluateAll(nodes => nodes.map(node => Number((node as HTMLElement).dataset.difficulty)));
  expect(difficulties).toEqual([...difficulties].sort((a,b) => a-b));
  const responses = await Promise.all(entries.map(async entry => {
    const response = await request.get(path(entry.id));
    return { id: entry.id, status: response.status(), html: await response.text() };
  }));
  for (const response of responses) {
    expect(response.status, response.id).toBe(200);
    expect(response.html, response.id).toContain('ORYGINALNE POLECENIE CKE');
  }
});

test('filters intersect and survive reloads, detail returns and browser history', async ({ page }) => {
  await page.goto('/zadania/');
  await page.locator('[data-task-section="programowanie"]').click();
  await page.locator('.task-extra-filters summary').click();
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Trudność', { exact: true }).selectOption('2');
  const matches = await page.locator(rows).evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset));
  expect(matches.length).toBeGreaterThan(0);
  expect(matches.every(meta => meta.sections!.split(' ').includes('programowanie') && meta.year === '2026' && meta.difficulty === '2')).toBe(true);
  const filtered = page.url();
  await page.reload();
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('2026');
  await expect(page.locator(rows)).toHaveCount(matches.length);
  await page.locator(`${rows} [data-task-link]`).first().click();
  await page.getByRole('link', { name: '← Zadania' }).click();
  await expect(page).toHaveURL(filtered);
  await page.getByLabel('Trudność', { exact: true }).selectOption('3');
  await page.goBack();
  await expect(page.getByLabel('Trudność', { exact: true })).toHaveValue('2');
  await page.goForward();
  await expect(page.getByLabel('Trudność', { exact: true })).toHaveValue('3');
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page.locator(rows)).toHaveCount(entries.length);
  await expect(page).toHaveURL(/\/zadania\/$/);
});

test('search ignores Polish diacritics and case and searches task content', async ({ page }) => {
  await page.goto('/zadania/?q=ŁĄCZENIE');
  const accented = await page.locator(rows).evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.id));
  expect(accented.length).toBeGreaterThan(0);
  await page.getByLabel('Szukaj zadania').fill('laczenie');
  await expect(page).toHaveURL(/q=laczenie/);
  expect(await page.locator(rows).evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.id))).toEqual(accented);
  // This original filename is in a command/context rather than a catalog title.
  await page.getByLabel('Szukaj zadania').fill('mecz_przyklad.txt');
  await expect(page).toHaveURL(/q=mecz_przyklad/);
  expect(await page.locator(rows).count()).toBeGreaterThan(0);
  await page.getByLabel('Szukaj zadania').fill('uzupelniamy zerami');
  await expect(page.locator('[data-task-row][data-id="informatyka-2023-maj-formula-2023-rozszerzona-2-5"]')).toBeVisible();
  await page.getByLabel('Szukaj zadania').fill('nieistniejace-haslo-987654321');
  await expect(page.getByRole('heading', { name: 'Brak pasujących zadań' })).toBeVisible();
  await expect(page.getByRole('status')).toHaveText('Liczba zadań: 0');
});

test('sorting follows difficulty, dates and points', async ({ page }) => {
  await page.goto('/zadania/');
  await page.locator('.task-extra-filters summary').click();
  for (const [sort, key, ascending] of [['trudniejsze', 'difficulty', false], ['najnowsze', 'year', false], ['najstarsze', 'year', true], ['punkty', 'points', true]] as const) {
    await page.getByLabel('Kolejność', { exact: true }).selectOption(sort);
    const values = await page.locator(rows).evaluateAll((nodes, attr) => nodes.map(node => Number((node as HTMLElement).dataset[attr])), key);
    expect(values).toEqual([...values].sort((a,b) => ascending ? a-b : b-a));
  }
});

test('topic routes fix their topic, expose counts, and support other filters', async ({ page }) => {
  await page.goto('/zadania/tematy/napisy/?rok=2026');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Napisy');
  await expect(page.getByLabel('Temat', { exact: true })).toHaveCount(0);
  expect(await page.locator(rows).count()).toBeGreaterThan(0);
  expect(await page.locator(rows).evaluateAll(nodes => nodes.every(node => (node as HTMLElement).dataset.topics!.split(' ').includes('napisy') && (node as HTMLElement).dataset.year === '2026'))).toBe(true);
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page).toHaveURL(/\/zadania\/tematy\/napisy\/$/);
  await expect(page.locator(rows)).toHaveCount(entries.filter(entry => entry.topics.includes('napisy')).length);
});

test('invalid filters and unsafe return URLs fall back to useful defaults', async ({ page }) => {
  await page.goto('/zadania/?rok=xxx&trudnosc=999&temat=nieznany&sort=wrong');
  await expect(page.locator(rows)).toHaveCount(entries.length);
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('all');
  await expect(page.getByLabel('Kolejność', { exact: true })).toHaveValue('latwiejsze');
  for (const returnTo of ['https://example.com/', '//example.com/', '/arkusze/', 'javascript:alert(1)']) {
    await page.goto(path(entries[0].id) + '?powrot=' + encodeURIComponent(returnTo));
    await expect(page.locator('[data-task-back]')).toHaveAttribute('href', '/zadania/');
  }
});

test('original data download preserves bytes and official grading starts collapsed', async ({ page, request }) => {
  await page.goto(path(withData.id));
  const grading = page.locator('.task-grading');
  await expect(grading).not.toHaveAttribute('open');
  await expect(grading.locator('[data-grading-source]')).toBeHidden();
  await grading.locator('summary').click();
  await expect(grading.locator('[data-grading-source]')).toHaveAttribute('href', new RegExp(`#page=${withData.gradingPages[0]}$`));
  const name = withData.dataFiles[0] as string;
  const link = page.locator('.task-materials a[download]').filter({ hasText: name.split('/').at(-1)! }).first();
  const response = await request.get((await link.getAttribute('href'))!);
  expect(response.status()).toBe(200);
  const examId = withData.parentId.replace(/-\d+$/, '');
  const original = readFileSync(join('public/pliki/zadania', examId, name));
  expect(await response.body()).toEqual(original);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://maturainformatyka.com${path(withData.id)}`);
});

test('prerequisite commands and sibling subtasks are available without answers', async ({ page }) => {
  expect(withDependency).toBeTruthy();
  await page.goto(path(withDependency.id));
  await expect(page.getByRole('heading', { name: 'Kontekst wcześniejszych podpunktów' })).toBeVisible();
  for (const dependency of withDependency.dependencies) await expect(page.locator(`.task-prerequisites a[href^="${path(dependency)}"]`)).toBeVisible();
  await expect(page.locator('.task-related a')).not.toHaveCount(0);
});

test('navigation and existing exam pages expose tasks and mark the right section', async ({ page }) => {
  await page.route('https://calendar.google.com/**', route => route.fulfill({ body: '' }));
  await page.goto('/');
  await page.getByRole('link', { name: 'Ćwicz zadania według tematów' }).click();
  const nav = page.getByRole('navigation', { name: 'Nawigacja główna', exact: true });
  await expect(nav.getByRole('link', { name: 'Zadania', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(nav.getByRole('link', { name: /^Arkusze(?: maturalne)?$/, exact: true })).not.toHaveAttribute('aria-current');
  const exam = catalog.find(exam => exam.year === 2026 && exam.formula === '2023' && exam.kind === 'glowny')!;
  await page.goto(`/arkusze/${exam.slug}/`);
  await expect(page.locator('.exam-task-index a')).toHaveCount(entries.filter(entry => entry.id.startsWith(exam.id + '-')).length);
});

for (const width of [360, 390, 768, 1024, 1366, 1440]) {
  test(`catalog and a table task fit at ${width}px and support the keyboard`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/zadania/');
    await page.getByLabel('Szukaj zadania').focus();
    await page.keyboard.press('Tab');
    if (width < 1024) {
      await expect(page.getByLabel('Dział', { exact: true })).toBeFocused();
      await page.keyboard.press('Tab');
    }
    await expect(page.getByLabel('Trudność', { exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.goto(path(withTable.id));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.task-grading summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.task-grading')).toHaveAttribute('open', '');
  });
}

test.describe('tasks without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('topic navigation, original commands, tables and files remain available', async ({ page }) => {
    await page.goto('/zadania/');
    await expect(page.locator(rows)).toHaveCount(entries.length);
    await expect(page.locator('[data-task-filters]')).toBeHidden();
    await expect(page.locator('.task-topic-directory')).not.toHaveAttribute('open');
    const firstCard = (await page.locator(rows).first().boundingBox())!;
    expect(firstCard.y + firstCard.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    await page.locator('.task-topic-directory > summary').click();
    await page.locator('.topic-directory a[href="/zadania/tematy/napisy/"]').click();
    await expect(page.locator(rows)).toHaveCount(entries.filter(entry => entry.topics.includes('napisy')).length);
    await page.goto(path(withTable.id));
    await expect(page.locator('.task-content table').first()).toBeVisible();
    await page.locator('.task-grading summary').click();
    await expect(page.locator('.task-grading [data-grading-source]')).toBeVisible();
    await page.goto(path(withData.id));
    const materials = page.locator('.task-materials');
    if (await materials.evaluate(node => node instanceof HTMLDetailsElement && !node.open)) await materials.locator('summary').click();
    await expect(materials.locator('a[download]').first()).toBeVisible();
  });
});

test('section and topic buttons expose matching counts, keep filters, and restore history', async ({ page }) => {
  await page.goto('/zadania/?rok=2026');
  const programming = page.locator('[data-task-section="programowanie"]');
  await programming.click();
  await expect(programming).toHaveAttribute('aria-pressed', 'true');
  const programmingCount = await page.locator(rows).count();
  await expect(programming.locator('[data-section-count]')).toHaveText(String(programmingCount));
  await page.locator('[data-topic-choice="napisy"]').click();
  await expect(page).toHaveURL(/temat=napisy/);
  await expect(page.locator('[data-topic-choice="napisy"]')).toHaveAttribute('aria-current', 'true');
  const topicCount = await page.locator(rows).count();
  await expect(page.locator('[data-topic-choice="napisy"] [data-topic-count]')).toHaveText(String(topicCount));
  await page.locator('[data-task-section="algorytmika"]').click();
  expect(new URL(page.url()).searchParams.get('temat')).toBeNull();
  await expect(page.getByLabel('Rok', { exact:true })).toHaveValue('2026');
  await page.goBack();
  await expect(page.locator('[data-topic-choice="napisy"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator(rows)).toHaveCount(topicCount);
  await page.locator('[data-task-section="all"]').click();
  await expect(page.locator('[data-topic-buttons]')).toBeHidden();
  expect(new URL(page.url()).searchParams.get('dzial')).toBeNull();
  expect(new URL(page.url()).searchParams.get('temat')).toBeNull();
});

test('practice filtering uses availability only and survives links and resets', async ({ page }) => {
  await page.goto('/zadania/');
  await page.locator('.task-extra-filters summary').click();
  await page.getByLabel('Ze sprawdzaniem odpowiedzi', { exact: true }).check();
  await expect(page).toHaveURL(/sprawdzanie=1/);
  const matches = page.locator(rows);
  expect(await matches.count()).toBeGreaterThan(0);
  expect(await matches.evaluateAll(nodes => nodes.every(node => (node as HTMLElement).dataset.practiceAvailable === 'true'))).toBe(true);
  await expect(page.locator(`${rows} .practice-badge`).first()).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Ze sprawdzaniem odpowiedzi', { exact: true })).toBeChecked();
  await page.locator(`${rows} [data-task-link]`).first().click();
  await page.locator('[data-task-back]').click();
  await expect(page.getByLabel('Ze sprawdzaniem odpowiedzi', { exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Wyczyść filtry' }).click();
  await expect(page.getByLabel('Ze sprawdzaniem odpowiedzi', { exact: true })).not.toBeChecked();
  await expect(page.locator(rows)).toHaveCount(154);
});

test('dedicated topic navigation preserves other filters and canonical routes', async ({ page }) => {
  await page.goto('/zadania/tematy/napisy/?rok=2026&sort=punkty');
  await page.locator('[data-topic-choice="pliki"]').click();
  await expect(page).toHaveURL(/\/zadania\/tematy\/pliki\/\?/);
  await expect(page.getByLabel('Rok', { exact:true })).toHaveValue('2026');
  await expect(page.getByLabel('Kolejność', { exact:true })).toHaveValue('punkty');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maturainformatyka.com/zadania/tematy/pliki/');
  await page.locator('[data-task-section="all"]').click();
  await expect(page).toHaveURL(/\/zadania\/\?/);
  await expect(page.getByLabel('Rok', { exact:true })).toHaveValue('2026');
});
