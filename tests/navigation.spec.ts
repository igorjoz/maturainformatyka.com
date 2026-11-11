import { expect, test } from '@playwright/test';
test.beforeEach(async ({page})=>{await page.route('https://calendar.google.com/**',route=>route.fulfill({body:''}));});
for (const width of [360,390,768,900,1023,1024,1280,1440,1920]) test(`compact navigation and homepage at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('.desktop-nav')).toBeVisible({visible:width>=1024});
 await expect(page.locator('.mobile-menu')).toBeVisible({visible:width<1024});
 await expect(page.locator('.projects.home-disclosure')).toHaveAttribute('open','');
 await expect(page.locator('.home-overview .home-disclosure[open]')).toHaveCount(0);
 if(width>=1024) await expect(page.locator('.desktop-nav a')).toHaveText(['Korepetycje','Matura 2027','Wiedza','Zadania','Arkusze']);
 else {await page.locator('.mobile-menu summary').click();await expect(page.locator('.mobile-booking')).toHaveText('Umów bezpłatną rozmowę');await page.keyboard.press('Escape');await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');}
 if(width===1440){const facts=await page.locator('.hero-facts').boundingBox();expect(facts!.y+facts!.height).toBeLessThan(900);}
});
test('details reveal presentations, fragments open their ancestors and keyboard can collapse',async({page})=>{
 await page.goto('/');const summary=page.getByText('Zobacz szczegółowy zakres',{exact:true});await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('#zakres')).toBeVisible();await summary.focus();await page.keyboard.press('Enter');await expect(page.locator('#zakres')).toBeHidden();
 await page.goto('/#przyklad-trudniejszy');await expect(page.locator('#przyklad-trudniejszy')).toBeVisible();await expect(page.locator('#przyklad').locator('xpath=ancestor::details')).toHaveAttribute('open','');
});
test('mobile and disclosure navigation works without JS',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto('/');await page.locator('.mobile-menu summary').click();await expect(page.locator('.mobile-booking')).toBeVisible();await page.locator('.mobile-menu summary').click();await page.getByText('Zobacz szczegółowy zakres',{exact:true}).click();await expect(page.locator('#zakres')).toBeVisible();await context.close();
});

test('200 percent equivalent reflow keeps navigation and booking usable',async({page})=>{await page.setViewportSize({width:720,height:450});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.locator('.mobile-menu summary').click();await expect(page.locator('.mobile-booking')).toBeVisible();});
