import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import catalog from '../src/data/exams.json' with { type: 'json' };
import { subtaskAnchor } from '../src/data/exam-reader';
import { safeTaskReturn } from '../src/scripts/task-return';

function records<T>(collection: string) {
  return readdirSync(`src/content/${collection}`).filter(name => name.endsWith('.md')).map(name => {
    const [, meta, body] = readFileSync(`src/content/${collection}/${name}`, 'utf8').split('---');
    return { id: name.slice(0, -3), body, ...JSON.parse(meta) as T };
  });
}
const contexts = records<{ examId: string; number: string; sheetFile: string; sheetPages: number[] }>('task-contexts');
const tasks = records<{ parentId: string; number: string; title: string; points: number; dataFiles: string[] }>('tasks');
const supported = catalog.filter(exam => contexts.some(context => context.examId === exam.id));
const modern = supported.find(exam => exam.year === 2026 && exam.kind === 'glowny')!;
const path = `/arkusze/${modern.slug}/`;
const normalizedUrl = (value: string) => {
  const url = new URL(value, 'https://maturainformatyka.com');
  url.searchParams.sort();
  return url.pathname + url.search + url.hash;
};
const activeGroup = '[data-exam-task-group]:visible';
const mode = '[data-reader-mode="zadania"]';
const pdfMode = '[data-reader-mode="pdf"]';
const locations = tasks.filter(task => task.id.startsWith(modern.id + '-')).map(task => ({ number: task.number, parentNumber: contexts.find(context => context.id === task.parentId)!.number }));

for (const viewport of [{ width:1366, height:768 }, { width:1440, height:900 }, { width:360, height:740 }, { width:390, height:844 }]) {
  for (const view of ['pdf', 'zadania']) {
    test(`paper content is visible without scrolling: ${view} at ${viewport.width}x${viewport.height}`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto(path + (view === 'zadania' ? '?widok=zadania&zadanie=1' : ''));
      await expect(page.locator(mode)).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => scrollY)).toBe(0);
      await expect(page.getByRole('heading', { level:1 })).toHaveText('Informatyka 2026 — Maj');
      await expect(page.locator('.exam-files a[download]')).toHaveCount(modern.files.length + 1);
      const content = view === 'pdf' ? page.locator('[data-exam-preview]') : page.locator(`${activeGroup} .task-content p`).first();
      const bounds = (await content.boundingBox())!;
      expect(bounds.y).toBeGreaterThan(0);
      // A useful piece of the PDF, or the beginning of the actual task text, fits.
      expect(bounds.y + (view === 'pdf' ? 200 : Math.min(bounds.height, 48))).toBeLessThanOrEqual(viewport.height);
      if (view === 'zadania') {
        await expect(page.locator('#zadanie-1')).toBeVisible();
        const controls = (await page.locator('.exam-reader-controls').first().boundingBox())!;
        expect(controls.height).toBeLessThanOrEqual(80);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const header = (await page.locator('.exam-header').boundingBox())!;
      const files = (await page.locator('.exam-files').boundingBox())!;
      const toolbar = (await page.locator('.exam-reader-toolbar').boundingBox())!;
      expect(files.y - header.y - header.height).toBeLessThanOrEqual(16);
      expect(toolbar.y - files.y - files.height).toBeLessThanOrEqual(16);
      const back = (await page.locator('[data-archive-back]').boundingBox())!;
      const heading = (await page.getByRole('heading', { level:1 }).boundingBox())!;
      expect(header.height).toBeLessThan(viewport.width < 600 ? 130 : 80);
      if (viewport.width < 600) expect(back.y + back.height).toBeLessThanOrEqual(heading.y);
      else expect(back.x + back.width).toBeLessThan(heading.x);
      const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent())!);
      expect(schema['@type']).toBe('BreadcrumbList');
      await page.screenshot({ path:testInfo.outputPath(`${view}.png`) });
    });
  }
}

test('long paper titles wrap without overflowing the compact header', async ({ page }) => {
  const longest = catalog.toSorted((a,b) => b.sessionLabel.length - a.sessionLabel.length)[0];
  for (const width of [360, 1366]) {
    await page.setViewportSize({ width, height:900 });
    await page.goto(`/arkusze/${longest.slug}/`);
    await expect(page.getByRole('heading', { level:1 })).toContainText(longest.sessionLabel);
    await expect(page.locator('.exam-files a[download]')).toHaveCount(longest.files.length + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

for (const exam of supported) {
  test(`reader preserves all commands, contexts and grading: ${exam.slug}`, async ({ page }) => {
    const parents = contexts.filter(context => context.examId === exam.id).sort((a,b) => a.number.localeCompare(b.number, 'pl', { numeric: true }));
    await page.goto(`/arkusze/${exam.slug}/?widok=zadania`);
    await expect(page.locator('[data-exam-task-group]')).toHaveCount(parents.length);
    for (const parent of parents) {
      await page.locator('[data-reader-select]').first().selectOption(parent.number);
      const group = page.locator(activeGroup);
      const children = tasks.filter(task => task.parentId === parent.id).sort((a,b) => a.number.localeCompare(b.number, 'pl', { numeric: true }));
      await expect(group).toHaveAttribute('data-number', parent.number);
      expect(await group.locator('[data-reader-subtask]').evaluateAll(nodes => nodes.map(node => (node as HTMLElement).dataset.readerSubtask))).toEqual(children.map(task => task.number));
      await expect(group.locator('.exam-reader-context')).toHaveCount(parent.body.trim() ? 1 : 0);
      await expect(group.locator('.task-grading')).toHaveCount(children.length);
      await expect(group.locator('.task-grading[open]')).toHaveCount(0);
      await expect(group.locator('.exam-downloads a[download]')).toHaveCount(children.reduce((sum, task) => sum + task.dataFiles.length, 0));
      for (const child of children) await expect(group.locator(`#${subtaskAnchor(child.number)}`)).toHaveText(`${child.number}. ${child.title}`);
    }
    expect(await page.locator('[id]').evaluateAll(nodes => {
      const ids = nodes.map(node => node.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    })).toEqual([]);
    await expect(page.locator('[data-practice-form], #task-practice-data')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://maturainformatyka.com/arkusze/${exam.slug}/`);
  });
}

test('PDF is the default; both sets of controls restore selection, boundaries and history', async ({ page }) => {
  await page.goto(path);
  await expect(page.locator(mode)).toBeVisible();
  const initialState = await page.evaluate(() => history.state);
  await expect(page.locator('[data-exam-preview]')).toBeVisible();
  await expect(page.locator('[data-exam-task-reader]')).toBeHidden();
  await expect(page.locator(pdfMode)).toHaveAttribute('aria-pressed', 'true');
  await page.locator(mode).click();
  for (const button of await page.locator('[data-reader-previous]').all()) await expect(button).toBeDisabled();
  await expect(page.locator('#zadanie-1')).toBeFocused();
  await page.locator('[data-reader-next]').first().click();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '2');
  await expect(page.locator('[data-reader-select]').last()).toHaveValue('2');
  await expect(page.locator('[data-reader-count]').first()).toHaveText('Zadanie 2 z 8');
  await page.locator('[data-reader-select]').last().selectOption('8');
  for (const button of await page.locator('[data-reader-next]').all()) await expect(button).toBeDisabled();
  await expect(page.locator('[data-reader-select]').first()).toHaveValue('8');
  const lastUrl = page.url();
  // The router's index/direction information must survive our in-page entries.
  expect((await page.evaluate(() => history.state)).index).toBe(initialState.index);
  await page.reload();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '8');
  await expect(page).toHaveURL(lastUrl);
  await page.goBack();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '2');
  await page.goBack();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '1');
  await page.goBack();
  await expect(page.locator('[data-exam-task-reader]')).toBeHidden();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
  await page.goForward();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '1');
});

test('switching to PDF points to the parent context page and retains the selected task', async ({ page }) => {
  const parent = contexts.find(context => context.examId === modern.id && context.number === '4')!;
  const sheet = modern.files.find(file => file.path.endsWith('/' + parent.sheetFile))!;
  await page.goto(path + '?widok=zadania&zadanie=4#podpunkt-4-2');
  await expect(page.locator('#podpunkt-4-2')).toBeFocused();
  await page.locator(pdfMode).click();
  expect(new URL(page.url()).searchParams.has('widok')).toBe(false);
  expect(new URL(page.url()).searchParams.get('zadanie')).toBe('4');
  await expect(page.locator('[data-exam-preview]')).toHaveAttribute('src', `${sheet.path}#page=${parent.sheetPages[0]}`);
  await page.reload();
  await expect(page.locator('[data-exam-preview]')).toHaveAttribute('src', `${sheet.path}#page=${parent.sheetPages[0]}`);
  await page.locator(mode).click();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '4');
  await page.locator(pdfMode).click();
  await expect(page.locator('[data-exam-task-reader]')).toBeHidden();
  await expect(page.locator('#exam-preview-title')).toBeFocused();
  await page.goBack();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '4');
});

test('archive filters and the precise subtask survive practice, sibling navigation and return', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/arkusze/?year=2026');
  await page.locator(`[data-exam-detail][href^="${path}"]`).first().click();
  await page.evaluate(() => Reflect.set(window, '__readerNavigation', true));
  const indexLink = page.locator('[data-exam-task][data-reader-anchor="podpunkt-4-2"]');
  await expect(indexLink).toHaveAttribute('href', /widok=zadania.*zadanie=4#podpunkt-4-2$/);
  await indexLink.click();
  await expect(page.locator('#podpunkt-4-2')).toBeFocused();
  const readerUrl = page.url();
  await page.locator('[data-reader-subtask="4.2"] [data-reader-practice]').click();
  await expect(page.locator('[data-task-back]')).toHaveText('← Arkusz');
  await page.locator('[data-related-task]').first().click();
  expect(normalizedUrl((await page.locator('[data-task-back]').getAttribute('href'))!)).toBe(normalizedUrl(readerUrl));
  await page.locator('[data-task-back]').click();
  await expect(page).toHaveURL(url => normalizedUrl(url.href) === normalizedUrl(readerUrl));
  await expect(page.locator('#podpunkt-4-2')).toBeFocused();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '4');
  await page.locator('[data-reader-next]').first().click();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '5');
  await page.goBack();
  await expect(page.locator('#podpunkt-4-2')).toBeFocused();
  await page.locator('[data-archive-back]').click();
  await expect(page).toHaveURL(/\/arkusze\/\?year=2026$/);
  expect(await page.evaluate(() => Reflect.get(window, '__readerNavigation'))).toBe(true);
  expect(errors).toEqual([]);
});

test('answers expand independently and original files remain downloadable', async ({ page, request }) => {
  await page.goto(path + '?widok=zadania&zadanie=4');
  const answers = page.locator(`${activeGroup} .task-grading`);
  await answers.first().locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(answers.first()).toHaveAttribute('open');
  await expect(answers.nth(1)).not.toHaveAttribute('open');
  await expect(answers.first().locator('[data-grading-source]')).toHaveAttribute('href', /ocenianie\.pdf#page=\d+$/);
  const link = page.locator(`${activeGroup} a[download]`).first();
  const href = (await link.getAttribute('href'))!;
  const response = await request.get(href);
  expect(response.status()).toBe(200);
  expect(await response.body()).toEqual(readFileSync(`public${decodeURIComponent(href)}`));
});

test('invalid reader parameters fall back to PDF and the first task', async ({ page }) => {
  await page.goto(path + '?widok=nieznany&zadanie=999');
  await expect(page.locator(pdfMode)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-exam-task-reader]')).toBeHidden();
  await expect(page).toHaveURL(/\?zadanie=1$/);
  await page.locator(mode).click();
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '1');
  await page.goto(path + '?widok=zadania&zadanie=4.2');
  await expect(page.locator(activeGroup)).toHaveAttribute('data-number', '1');
});

test('return validation restricts task numbers, anchors, nested returns and origins', () => {
  const origin = 'https://maturainformatyka.com';
  const clean = (value: string) => safeTaskReturn(value, origin, path, locations);
  const valid = `${path}?widok=zadania&zadanie=4&powrot=${encodeURIComponent('/arkusze/?year=2026')}#podpunkt-4-2`;
  expect(clean(valid)).toBe(valid);
  expect(clean(`${path}?widok=zadania&zadanie=999#podpunkt-999`)).toBe(path);
  expect(clean(`${path}?widok=zadania&zadanie=4#podpunkt-1-1`)).toBe(`${path}?widok=zadania&zadanie=4`);
  expect(clean(`${path}?widok=zadania&zadanie=4&powrot=${encodeURIComponent('https://example.com/')}#podpunkt-4-2`)).toBe(`${path}?widok=zadania&zadanie=4#podpunkt-4-2`);
  expect(clean(`${path}?widok=zadania&zadanie=4&unknown=x#odpowiedz-cke`)).toBe(`${path}?widok=zadania&zadanie=4`);
  expect(clean(`https://example.com${path}?widok=zadania&zadanie=4`)).toBeNull();
});

for (const width of [360, 390, 768, 1024, 1366, 1440]) {
  test(`reader, tables and expanded answers fit at ${width}px with reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const sample = supported.find(exam => exam.year === 2022 && exam.month === 3)!;
    await page.goto(`/arkusze/${sample.slug}/?widok=zadania&zadanie=5#podpunkt-5-2`);
    await expect(page.locator('#podpunkt-5-2')).toBeFocused();
    await page.locator('[data-reader-subtask="5.2"] .task-grading summary').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-reader-subtask="5.2"] .task-grading tbody tr')).toHaveCount(79);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('[data-reader-select]').last().selectOption('6');
    await expect(page.locator('#zadanie-6')).toBeFocused();
    const controls = (await page.locator('.exam-reader-controls').first().boundingBox())!;
    const header = (await page.locator('.site-header').boundingBox())!;
    expect(controls.y).toBeGreaterThanOrEqual(header.y + header.height);
    await expect(page.locator('[data-exam-task-group][data-number="5"]')).toBeHidden();
    await page.locator('[data-reader-previous]').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#zadanie-5')).toBeFocused();
  });
}

test('without JavaScript PDF, original task links and downloads remain available', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(path + '?widok=zadania&zadanie=4');
  await expect(page.locator('[data-reader-modes]')).toBeHidden();
  await expect(page.locator('[data-exam-task-reader]')).toBeHidden();
  await expect(page.locator('[data-exam-preview]')).toBeVisible();
  await expect(page.locator('.exam-downloads a').first()).toBeVisible();
  const link = page.locator('[data-exam-task]').first();
  await expect(link).toHaveAttribute('href', /^\/zadania\//);
  await link.click();
  await expect(page.locator('#task-command-content')).toBeVisible();
  await context.close();
});
