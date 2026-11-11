import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync } from 'node:fs';
import { checkPractice, normalizeAnswer } from '../src/data/practice-check';
import type { TaskPractice, PracticeField } from '../src/data/task-practice';
const records = readdirSync('src/data/task-practice').map(name => JSON.parse(readFileSync(`src/data/task-practice/${name}`, 'utf8')) as TaskPractice);
const interactive = records.filter(record => record.mode === 'interactive');
const keylogger = 'informatyka-2025-maj-formula-2023-rozszerzona-4';
const path = (id:string) => `/zadania/${id}/`;

test('normalization preserves exact numbers, bases, sets and coherent answer variants', () => {
  const numeric = { kind:'number' } as PracticeField;
  expect(normalizeAnswer('9 007 199 254 740 993,000', numeric)).toBe('9007199254740993');
  expect(normalizeAnswer('12 34', numeric)).toBeNull();
  expect(normalizeAnswer('2+2', numeric)).toBeNull();
  expect(normalizeAnswer('102', { ...numeric, base:2 })).toBeNull();
  expect(normalizeAnswer('00101', { ...numeric, base:2 })).toBe('5');
  const variants = records.find(r => r.id.endsWith('2024-grudzien-probna-formula-2023-rozszerzona-8-4'))!;
  const one = Object.fromEntries(Object.entries(variants.variants![0]).map(([k,v]) => [k,v[0]]));
  expect(checkPractice(variants, one).correct).toBe(true);
  const keys = Object.keys(one);
  one[keys.at(-1)!] = variants.variants![1][keys.at(-1)!][0];
  expect(checkPractice(variants, one).correct).toBe(false);
  expect(checkPractice(variants, one).inconsistent).toBe(true);
  for (const record of interactive) for (const variant of record.variants!) {
    const answers = Object.fromEntries(Object.entries(variant).map(([key,values]) => [key,values[0]]));
    expect(checkPractice(record, answers).correct, record.id).toBe(true);
  }
});

test('all qualified exercises mount their controls and accept the reviewed answer', async ({ page }) => {
  test.setTimeout(360_000);
  for (const record of interactive) {
    await page.goto(path(record.id));
    await expect(page.locator('[data-practice-form]'),record.id).toHaveAttribute('data-practice-ready','true');
    await page.evaluate(record => {
      for (const field of record.fields!) {
        const inputs = [...document.querySelectorAll<HTMLInputElement>(`input[name="${field.id}"]`)];
        const answer = record.variants![0][field.id][0];
        if (field.kind === 'single' || field.kind === 'multiple') inputs.forEach(input => input.checked = answer.split('|').includes(input.value));
        else inputs[0].value = answer;
      }
    }, record);
    await page.getByRole('button',{name:'Sprawdź',exact:true}).click();
    await expect(page.locator('[data-practice-status]'),record.id).toHaveAttribute('data-state','correct');
  }
});

test('empty, wrong, retry, reveal, reset and reduced motion work without leaking an answer', async ({page}) => {
  await page.goto(path(keylogger));
  const check = page.getByRole('button',{name:'Sprawdź',exact:true});
  await check.click();
  await expect(page.locator('[data-practice-status]')).toHaveAttribute('data-state','format');
  await page.locator('input[value="A"]').check();
  await check.click();
  await expect(page.locator('[data-practice-status]')).toHaveAttribute('data-state','incorrect');
  await expect(page.locator('.task-grading')).not.toHaveAttribute('open');
  await page.locator('input[value="D"]').check();
  await expect(page.locator('[data-practice="wybor"]')).not.toHaveAttribute('data-state');
  await check.click();
  await expect(page.locator('[data-practice-status]')).toHaveAttribute('data-state','correct');
  await check.click();
  await expect(page.locator('[data-practice-confetti] i')).toHaveCount(0);
  await page.getByRole('button',{name:'Pokaż odpowiedź',exact:true}).click();
  await expect(page.locator('.task-grading')).toHaveAttribute('open');
  await expect(page.locator('input[value="D"]')).toBeChecked();
  await page.getByRole('button',{name:'Od nowa'}).click();
  await expect(page.locator('input:checked')).toHaveCount(0);
  await expect(page.locator('.task-grading')).not.toHaveAttribute('open');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('input[value="D"]').check();
  await check.click();
  await expect(page.locator('[data-practice-status]')).toHaveAttribute('data-state','correct');
  await expect(page.locator('[data-practice-confetti] i')).toHaveCount(0);
});

for (const width of [360,390,768,1024,1440]) test(`workspace, options and summary fit at ${width}px`, async ({page}) => {
  await page.setViewportSize({width,height:width===390?844:900});
  await page.goto(path(keylogger));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.task-main').evaluate(el => Boolean(el.compareDocumentPosition(document.querySelector('.task-tutoring')!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  const command = await page.locator('#task-command').boundingBox();
  expect(command!.y).toBeLessThan(width===1440?500:844);
  if(width===1440) {
    const option = await page.locator('input[value="D"]').boundingBox();
    expect(option!.y+option!.height).toBeLessThan(900);
  }
  const alignment = await page.locator('.task-grading summary').evaluate(el => ({display:getComputedStyle(el).display,align:getComputedStyle(el).alignItems,justify:getComputedStyle(el).justifyContent}));
  expect(alignment).toEqual({display:'flex',align:'center',justify:'center'});
});

test('without JS original choices and native answer panel remain usable', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled:false});
  const page = await context.newPage();
  await page.goto(path(keylogger));
  await expect(page.locator('[data-practice-actions]')).toBeHidden();
  await expect(page.locator('#task-command-content ol li')).toHaveCount(4);
  await page.locator('.task-grading summary').click();
  await expect(page.locator('[data-task-grading]')).toBeVisible();
  await context.close();
});

test('numeric format, correlated variants, table examples and sibling context are preserved', async ({page}) => {
  const record = records.find(r => r.id.endsWith('2024-grudzien-probna-formula-2023-rozszerzona-8-4'))!;
  await page.goto(path(record.id)+'?powrot='+encodeURIComponent('/zadania/?rok=2024&sprawdzanie=1'));
  await page.locator('[name="listopad"]').fill('nie liczba');
  await page.getByRole('button',{name:'Sprawdź',exact:true}).click();
  await expect(page.locator('[data-practice="listopad"]')).toHaveAttribute('data-state','format');
  await page.locator('[name="listopad"]').fill('150 530,00');
  await page.locator('[name="grudzien"]').fill('106130');
  await page.getByRole('button',{name:'Sprawdź',exact:true}).click();
  await expect(page.locator('[data-practice-status]')).toContainText('różnych wariantów');
  await page.locator('[name="grudzien"]').fill('105860');
  await page.getByRole('button',{name:'Sprawdź',exact:true}).click();
  await expect(page.locator('[data-practice-status]')).toHaveAttribute('data-state','correct');
  await page.locator('.task-related a').first().click();
  await expect(page.locator('[data-task-back]')).toHaveAttribute('href','/zadania/?rok=2024&sprawdzanie=1');
  await page.goto(path('informatyka-2026-maj-formula-2023-rozszerzona-4-1'));
  await expect(page.locator('#task-command-content input')).toHaveCount(12);
  const rows = page.locator('#task-command-content tbody tr');
  await expect(rows.nth(1).locator('input')).toHaveCount(0);
  await expect(rows.nth(7).locator('input')).toHaveCount(0);
});
