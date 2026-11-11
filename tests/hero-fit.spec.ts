import { expect,test } from '@playwright/test';
import {readdirSync} from 'node:fs';
import exams from '../src/data/exams.json' with {type:'json'};
test.beforeEach(async({page})=>{await page.route('https://calendar.google.com/**',r=>r.fulfill({body:''}));});
for(const [width,height] of [[1280,600],[1366,650],[1440,760],[1440,900],[1920,1080]])test(`whole hero fits ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const bounds=await page.locator('.hero').boundingBox();expect(bounds!.y+bounds!.height).toBeLessThanOrEqual(height);
 for(const selector of ['.hero-facts','.portrait-caption','.intro-hero-note']){const box=await page.locator(selector).boundingBox();expect(box!.y+box!.height,selector).toBeLessThanOrEqual(height);}
 const button=await page.locator('.hero-actions .button').boundingBox();const more=await page.locator('.hero-actions>.text-link').boundingBox();expect(more!.x).toBeGreaterThanOrEqual(button!.x+button!.width);expect(Math.abs(button!.y-more!.y)).toBeLessThan(16);expect(button!.height).toBeGreaterThanOrEqual(44);expect(more!.height).toBeGreaterThanOrEqual(44);
 expect(await page.locator('.hero-description').evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('footer retains its signature, motto, about link and personal link',async({page})=>{
 for(const path of ['/','/zadania/'+readdirSync('src/content/tasks')[0].replace('.md','')+'/',`/arkusze/${exams[0].slug}/`]){
  await page.goto(path);
  const footer=page.locator('footer');
  await expect(footer.locator('nav')).toHaveCount(0);
  await expect(footer.locator('a')).toHaveCount(2);
  await expect(footer.getByRole('link',{name:'O mnie',exact:true})).toHaveAttribute('href','/#o-mnie');
  const personal=footer.getByRole('link',{name:'Strona osobista'});
  await expect(personal).toBeVisible();
  await expect(personal).toHaveAttribute('href','https://igorjoz.com/pl');
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Igor Józefowicz`);
  await expect(footer).toContainText('Przygotowanie z planem.');
 }
});
for(const js of [true,false])test(`mobile layout and preserved section addresses, JS=${js}`,async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:js,viewport:{width:390,height:844}});const page=await context.newPage();await page.route('https://calendar.google.com/**',r=>r.fulfill({body:''}));await page.goto('/');
 const primary=await page.locator('.hero-actions .button').boundingBox();const secondary=await page.locator('.hero-actions>.text-link').boundingBox();expect(secondary!.y).toBeGreaterThan(primary!.y+primary!.height);expect(primary!.width).toBeCloseTo(await page.locator('.hero-copy').evaluate(el=>el.clientWidth),0);
 for(const id of ['zakres','opinie','oferta','faq']){await page.goto('/#'+id);await expect(page.locator('#'+id)).toHaveCount(1);if(id==='faq'){await page.locator('#faq summary').first().click();await expect(page.locator('#faq details').first()).toHaveAttribute('open','');}}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
