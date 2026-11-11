import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import exams from '../src/data/exams.json' with { type:'json' };
import topics from '../src/data/task-topics.json' with { type:'json' };
const keys = readdirSync('src/data/task-practice').map(name=>JSON.parse(readFileSync(`src/data/task-practice/${name}`,'utf8')));
const taskPath = `/zadania/${keys[0].id}/`;
const examPath = `/arkusze/${exams[0].slug}/`;

test('every material page has exactly one server-rendered invitation before the footer',async({request})=>{
 const paths=['/zadania/','/arkusze/',...topics.map(t=>`/zadania/tematy/${t.id}/`),...keys.map(t=>`/zadania/${t.id}/`),...exams.map(e=>`/arkusze/${e.slug}/`)];
 for(const path of paths){const response=await request.get(path);expect(response.status(),path).toBe(200);const html=await response.text();expect(html.match(/data-materials-invitation/g),path).toHaveLength(1);expect(html.indexOf('data-materials-invitation'),path).toBeGreaterThan(html.indexOf('</main>'));expect(html.indexOf('data-materials-invitation'),path).toBeLessThan(html.indexOf('<footer'));}
});

test('projects start open and can be collapsed with keyboard',async({page})=>{
 await page.route('https://calendar.google.com/**',r=>r.fulfill({body:''}));await page.goto('/');const projects=page.locator('.projects.home-disclosure');await expect(projects).toHaveAttribute('open','');await expect(projects.locator('.project').first()).toBeVisible();await projects.locator('summary').focus();await page.keyboard.press('Enter');await expect(projects).not.toHaveAttribute('open');await page.keyboard.press('Enter');await expect(projects.locator('.project').first()).toBeVisible();
});

for(const width of [360,390,768,1024,1440]) test(`lesson surface, counts and final invitation fit at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.route('https://calendar.google.com/**',r=>r.fulfill({body:''}));await page.goto('/');
 const tasks=page.locator('[data-material-choice="tasks"]');await expect(tasks).toContainText(`${keys.length} zadania`);await expect(tasks).toContainText(`${keys.filter(k=>k.mode==='interactive').length} ze sprawdzaniem`);await expect(tasks.locator('a')).toHaveAttribute('href','/zadania/');
 const sheets=page.locator('[data-material-choice="exams"]');await expect(sheets).toContainText(`${exams.length} zestawów · od ${Math.min(...exams.map(e=>e.year))} roku`);await expect(sheets.locator('a')).toHaveAttribute('href','/arkusze/');
 await page.locator('.lesson-disclosure>summary').click();
 const body=page.locator('.lesson-disclosure>.disclosure-body');const surface=await body.evaluate(el=>({background:getComputedStyle(el).backgroundColor,soft:getComputedStyle(document.documentElement).getPropertyValue('--soft').trim(),border:getComputedStyle(el.parentElement!).overflow}));expect(surface.background).not.toBe('rgb(255, 255, 255)');expect(surface.border).toBe('hidden');await expect(page.locator('#przyklad')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');await expect(page.locator('#przyklad>.container')).toHaveCSS('padding-top','0px');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const path of ['/zadania/','/arkusze/','/zadania/tematy/napisy/',taskPath,examPath]){
 await page.goto(path);const invitation=page.locator('[data-materials-invitation]');await expect(invitation).toHaveCount(1);await expect(invitation.getByRole('heading')).toHaveText('Przygotuj się do matury z informatyki ze mną.');await expect(invitation.getByRole('link',{name:'Umów bezpłatną rozmowę'})).toHaveAttribute('href','/#rezerwacja');await expect(invitation.getByRole('link',{name:'Zobacz ofertę korepetycji i cenę'})).toHaveAttribute('href','/#oferta');await expect(invitation.locator('a[href^="mailto:"]')).toHaveAttribute('href','mailto:igor@jozefowicz.pl');await expect(invitation.locator('a[href^="tel:"]')).toHaveAttribute('href','tel:+48535743042');await expect(invitation.locator('canvas')).toHaveCount(0);await expect(invitation.locator('.contact-celebration')).toHaveCount(1);expect(await invitation.locator('xpath=ancestor::astro-island').count()).toBe(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
});

test.describe('presentation without JavaScript',()=>{
 test.use({javaScriptEnabled:false});
 test('projects, counters and invitation links remain available',async({page})=>{
 await page.route('https://calendar.google.com/**',r=>r.fulfill({body:''}));await page.goto('/');await expect(page.locator('.projects .project').first()).toBeVisible();await page.locator('.projects>summary').click();await expect(page.locator('.projects .project').first()).toBeHidden();await expect(page.locator('[data-material-choice="tasks"]')).toContainText('154 zadania');await page.goto(taskPath);await expect(page.locator('[data-materials-invitation] a[href="/#rezerwacja"]')).toBeVisible();
 });
});
