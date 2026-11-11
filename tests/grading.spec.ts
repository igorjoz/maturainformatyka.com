import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TaskGrading from '../src/components/TaskGrading';

const records = readdirSync('src/content/task-grading').filter(name => name.endsWith('.md')).map(name => {
  const text = readFileSync(`src/content/task-grading/${name}`, 'utf8');
  return { id: name.slice(0,-3), status: JSON.parse(text.split('---')[1]).answerStatus as string, body: text.split('---').slice(2).join('---') };
});
const path = (id: string) => `/zadania/${id}/`;
const examples = {
  table: 'informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona-5-2',
  algorithm: 'informatyka-2023-maj-formula-2023-rozszerzona-2-1',
  variants: 'informatyka-2024-grudzien-probna-formula-2023-rozszerzona-8-4',
  discrepancy: 'informatyka-2022-marzec-pokazowa-formula-2023-rozszerzona-4-4',
};

test('every task includes its official answer, full criteria and original PDF reference', async ({ request }) => {
  expect(records).toHaveLength(154);
  const pages = await Promise.all(records.map(async record => {
    const response = await request.get(path(record.id));
    return { record, status: response.status(), html: await response.text() };
  }));
  for (const { record, status, html } of pages) {
    expect(status, record.id).toBe(200);
    expect(html, record.id).toContain('Pokaż odpowiedź i ocenianie CKE');
    expect(html, record.id).toContain('Zasady oceniania CKE');
    expect(html, record.id).toContain('data-grading-source');
    expect(html, record.id).toContain(record.status === 'provided' ? 'Odpowiedź CKE' : 'data-answer-unavailable');
  }
});

test('answers start hidden, expand with the keyboard and can be hidden again', async ({ page }) => {
  await page.goto(path(examples.algorithm));
  const panel = page.locator('.task-grading');
  await expect(panel).not.toHaveAttribute('open');
  await expect(panel.getByRole('heading', { name: 'Odpowiedź CKE', exact:true })).toBeHidden();
  await panel.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('heading', { name: 'Odpowiedź CKE', exact:true })).toBeVisible();
  await expect(panel.locator('pre')).toContainText('poprzednia ← n mod 2');
  await expect(panel).toContainText('poprawne zliczenie liczby bloków');
  await page.keyboard.press('Enter');
  await expect(panel.getByRole('heading', { name: 'Odpowiedź CKE', exact:true })).toBeHidden();
  expect(await page.locator('.task-grading').locator('xpath=ancestor::astro-island').count()).toBe(0);
});

test('complete long tables, official alternatives and source discrepancies are preserved', async ({ page }) => {
  await page.goto(path(examples.table));
  await page.locator('.task-grading summary').click();
  // The original CKE answer lists 79 ships plus a header, across three PDF pages.
  await expect(page.locator('.task-grading table tbody tr')).toHaveCount(79);
  await page.goto(path(examples.variants));
  await page.locator('.task-grading summary').click();
  for (const amount of ['150530', '105860', '150935', '106130']) await expect(page.locator('[data-task-grading]')).toContainText(amount);
  await page.goto(path(examples.discrepancy));
  await expect(page.locator('.task-metadata')).toContainText('3 pkt');
  await expect(page.locator('.archive-notice')).toContainText('2 pkt');
  await page.locator('.task-grading summary').click();
  await expect(page.locator('[data-task-grading]')).toContainText('2 pkt');
});

test('answers and answer-only words are excluded from the catalog and search index', async ({ page }) => {
  await page.goto('/zadania/');
  await expect(page.locator('[data-task-grading]')).toHaveCount(0);
  await expect(page.locator('h2').filter({ hasText:'Odpowiedź CKE' })).toHaveCount(0);
  await expect(page.locator('[data-task-row][data-search]')).toHaveCount(0);
  const facets = JSON.parse((await page.locator('[data-task-facets]').textContent())!);
  const search = facets.find((item: { id: string }) => item.id === examples.algorithm).search;
  expect(search.length).toBeGreaterThan(0);
  expect(search).not.toContain('poprzednia');
  await page.getByLabel('Szukaj zadania').fill('poprzednia');
  await expect(page.locator(`[data-id="${examples.algorithm}"]`)).toBeHidden();
});

for (const width of [360,390,768,1024,1366,1440]) {
  test(`expanded official tables and code fit the ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    for (const id of [examples.table, examples.algorithm]) {
      await page.goto(path(id));
      await page.locator('.task-grading summary').click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('[data-task-grading]')).toBeVisible();
    }
  });
}

test.describe('official grading without JavaScript', () => {
  test.use({ javaScriptEnabled:false });
  test('real source content remains accessible and collapsible', async ({ page }) => {
    await page.goto(path(examples.algorithm));
    const panel=page.locator('.task-grading');
    await expect(panel.locator('pre')).toBeHidden();
    await panel.locator('summary').click();
    await expect(panel.locator('pre')).toContainText('poprzednia');
    await expect(panel.locator('pre')).toBeVisible();
    await expect(panel.locator('[data-grading-source]')).toHaveAttribute('href', /ocenianie\.pdf#page=4$/);
    await panel.locator('summary').click();
    await expect(panel.locator('pre')).toBeHidden();
  });

  test('a source without a ready answer shows its explicit notice and criteria', async ({ page }) => {
    // All current sources contain answers. Render the actual production component with
    // a valid criteria-only fixture instead of inventing missing answers in CKE content.
    const panel=renderToStaticMarkup(createElement(TaskGrading, {
      answerStatus:'not-provided',sourceHref:'/example.pdf#page=2',sourcePage:2,
    }, createElement('h2',null,'Zasady oceniania CKE'),createElement('p',null,'Testowe kryterium punktowania.')));
    await page.setContent(`<!doctype html><html lang="pl"><body>${panel}</body></html>`);
    await expect(page.locator('[data-answer-unavailable]')).toBeHidden();
    await page.locator('summary').click();
    await expect(page.locator('[data-answer-unavailable]')).toHaveText('CKE nie podaje w tym materiale gotowej odpowiedzi. Poniżej znajdziesz oficjalne kryteria oceniania.');
    await expect(page.getByText('Testowe kryterium punktowania.')).toBeVisible();
    await expect(page.getByRole('heading',{name:'Odpowiedź CKE',exact:true})).toHaveCount(0);
    await expect(page.locator('[data-grading-source]')).toHaveAttribute('href','/example.pdf#page=2');
  });
});
