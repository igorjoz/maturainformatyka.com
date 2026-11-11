import { expect, test } from '@playwright/test';

for (const width of [390, 1366]) test(`skill disclosures animate and can reverse at ${width}px`, async ({ page }) => {
 await page.setViewportSize({ width, height: 900 });
 await page.emulateMedia({ reducedMotion: 'no-preference' });
 await page.goto('/matura-2027/');
 const skill = page.locator('.guide-skill').first();
 await skill.locator('summary').scrollIntoViewIfNeeded();
 const heights = await page.evaluate(() => new Promise<{closed: number; opening: number; natural: number}>(resolve => {
  const details = document.querySelector<HTMLDetailsElement>('.guide-skill')!;
  const summary = details.querySelector('summary')!;
  const closedHeight = details.getBoundingClientRect().height;
  summary.click();
  requestAnimationFrame(() => {
   const opening = details.getBoundingClientRect().height;
   const naturalHeight = details.scrollHeight;
   summary.click();
   resolve({ closed: closedHeight, opening, natural: naturalHeight });
  });
 }));
 expect(heights.natural).toBeGreaterThan(heights.closed);
 expect(heights.opening).toBeLessThan(heights.natural);
 await expect(skill).not.toHaveAttribute('open');
 await expect(skill).not.toHaveAttribute('data-animating');
 // Keyboard activation follows the same opening and closing behavior.
 await skill.locator('summary').focus();
 await page.keyboard.press('Enter');
 await expect(skill).toHaveAttribute('open', '');
 await expect(skill).not.toHaveAttribute('data-animating');
 await expect(skill.locator('.guide-can-do')).toBeVisible();
 await page.keyboard.press('Space');
 await expect(skill).not.toHaveAttribute('open');
});

test('reduced motion keeps skill disclosures immediate', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/matura-2027/');
 const skill = page.locator('.guide-skill').first();
 await skill.locator('summary').click();
 await expect(skill).toHaveAttribute('open', '');
 await expect(skill).not.toHaveAttribute('data-animating');
 await skill.locator('summary').click();
 await expect(skill).not.toHaveAttribute('open');
});

test('guide facts, skill links and knowledge catalog are rendered',async({page,request})=>{
 await page.goto('/matura-2027/');
 await expect(page.locator('h1')).toContainText('Matura z informatyki');
 await expect(page.locator('.guide-facts')).toContainText('50 punktów');
 await expect(page.locator('.guide-facts')).toContainText('210 minut');
 const links=await page.locator('.guide-task-links a,.guide-topic-link,.guide-path-links a').evaluateAll(els=>[...new Set(els.map(el=>el.getAttribute('href')!))]);
 for(const href of links){if(href.startsWith('#')){await expect(page.locator(href)).toHaveCount(1);}else{expect((await request.get(href)).status(),href).toBe(200);}}
 await page.goto('/wiedza/');await expect(page.locator('main a[href="/matura-2027/"]').first()).toBeVisible();
 const sitemap=await (await request.get('/sitemap.xml')).text();expect(sitemap).toContain('/matura-2027/');expect(sitemap).toContain('/wiedza/');
});

test('self-assessment, checklist and path survive reload and reset has confirmation',async({page})=>{
 await page.goto('/matura-2027/');
 const skill=page.locator('.guide-skill-row').first();
 await skill.locator('select').selectOption('done');await expect(skill.locator('details')).not.toHaveAttribute('open');
 await skill.locator('summary').click();await skill.locator('select').selectOption('review');await expect(skill.locator('details')).toHaveAttribute('open','');await skill.locator('select').selectOption('done');await expect(page.locator('[data-study-total]')).toContainText('1 z');
 await page.locator('[data-study-check]').first().check();await page.locator('[data-path-choice]').first().click();
 await page.reload();await expect(page.locator('[data-study-total]')).toContainText('1 z');await expect(page.locator('[data-study-check]').first()).toBeChecked();await expect(page.locator('[data-path-choice]').first()).toHaveAttribute('aria-pressed','true');
 page.once('dialog',dialog=>dialog.dismiss());await page.locator('[data-study-reset]').click();await expect(page.locator('[data-study-total]')).toContainText('1 z');
 page.once('dialog',dialog=>dialog.accept());await page.locator('[data-study-reset]').click();await expect(page.locator('[data-study-total]')).toContainText('0 z');await expect(page.locator('[data-study-check]').first()).not.toBeChecked();
});

test('corrupted or blocked storage does not block tools',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('matura:2027:study:v1','broken json'));await page.goto('/matura-2027/');await expect(page.locator('[data-study-total]')).toContainText('0 z');
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));await page.reload();await expect(page.locator('[data-study-storage]')).toContainText('Zapis jest niedostępny');
 const skill=page.locator('.guide-skill-row').first();await skill.locator('select').selectOption('review');await expect(skill.locator('select')).toHaveValue('review');await expect(skill.locator('details')).not.toHaveAttribute('open');
});
for(const width of [360,390,768,1024,1366,1440]) test(`guide layout and anchors fit ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:width>=1024?768:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/matura-2027/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const rows=page.locator('.guide-skill-row');
 const positions=await rows.evaluateAll(els=>els.map(el=>{const summary=el.querySelector('summary')!.getBoundingClientRect();const title=el.querySelector('summary>span')!.getBoundingClientRect();const select=el.querySelector('select')!.getBoundingClientRect();return {x:select.x,titleBottom:title.bottom,titleRight:title.right,selectY:select.y,selectHeight:select.height,summaryBottom:summary.bottom};}));
 expect(new Set(positions.map(p=>Math.round(p.x))).size).toBe(1);
 for(const p of positions){expect(p.selectHeight).toBeGreaterThanOrEqual(44);if(width<=600){expect(p.selectY).toBeGreaterThanOrEqual(p.titleBottom);expect(p.summaryBottom).toBeGreaterThanOrEqual(p.selectY+p.selectHeight);}else expect(p.x).toBeGreaterThanOrEqual(p.titleRight);}
 if(width>=1024){const gap=await page.locator('.guide-hero-copy').evaluate(el=>el.getBoundingClientRect().top-document.querySelector('.publication-breadcrumbs')!.getBoundingClientRect().bottom);expect(gap).toBeLessThanOrEqual(40);}
 const flow=await page.locator('.guide-flow').evaluate(el=>[...el.children].map(child=>child.getBoundingClientRect().x));expect(flow[4]-flow[0]).toBeLessThan(400);
 await page.locator('[data-skill] summary').first().click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('.guide-actions a[href="#umiejetnosci"]').click();await expect(page.locator('#umiejetnosci')).toBeInViewport();
 const top=await page.locator('#umiejetnosci').evaluate(el=>el.getBoundingClientRect().top);expect(top).toBeGreaterThanOrEqual(80);
 await page.goto('/wiedza/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('content and native disclosures work without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('/matura-2027/');
 await expect(page.locator('#zrodla')).toContainText('Podstawa programowa');const skill=page.locator('[data-skill]').first();await skill.locator('summary').click();await expect(skill.locator('.guide-can-do')).toBeVisible();await expect(page.locator('[data-study-reset]')).toBeHidden();await context.close();
});

test('printing opens skill explanations and restores the reading state',async({page})=>{
 await page.goto('/matura-2027/');
 await expect(page.locator('.guide-skill[open]')).toHaveCount(0);
 await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
 await expect(page.locator('.guide-skill:not([open])')).toHaveCount(0);
 await page.emulateMedia({media:'print'});await expect(page.locator('.guide-sidebar')).toBeHidden();await expect(page.locator('.guide-skill-content').first()).toBeVisible();
 await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
 await page.emulateMedia({media:'screen'});await expect(page.locator('.guide-skill[open]')).toHaveCount(0);
});

test('guide text provides concrete exam supplies and describes the guide storage',async({page})=>{
 await page.goto('/matura-2027/');
 await expect(page.locator('#egzamin')).not.toContainText('Nasze formularze');
 await expect(page.locator('#zasady')).not.toContainText('jeśli nie masz PESEL');
 await expect(page.locator('.guide-aids-list')).toContainText('Przybory ścieralne są niedozwolone');
 await expect(page.locator('.guide-aids-list')).toContainText('nie przewidziano osobnego kalkulatora');
 const faq=page.locator('.guide-faq details').last();await faq.locator('summary').click();await expect(faq).toContainText('wybrana ścieżka');await expect(faq).toContainText('nie obejmuje wyników');
});

test('all skill descriptions have exactly one Potrafię label', async ({ page }) => {
 await page.goto('/matura-2027/');
 const descriptions = await page.locator('.guide-can-do').allTextContents();
 expect(descriptions.length).toBeGreaterThan(0);
 for (const description of descriptions) {
  expect(description).toMatch(/^Potrafię: [a-ząćęłńóśźż]/);
  expect(description.match(/Potrafię/gi)).toHaveLength(1);
 }
});
