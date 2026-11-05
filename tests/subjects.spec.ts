import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://calendar.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Kalendarz</p>' }));
  await page.goto('/');
});

test('pierwsze tematy są otwarte, zakładki działają niezależnie i nie zamykają panelu', async ({ page }) => {
  const groups = page.locator('[data-subject-group]');
  const first = groups.nth(0);
  const second = groups.nth(1);
  await expect(first.getByRole('tab', { name: 'Python lub C++' })).toHaveAttribute('aria-selected', 'true');
  await expect(second.getByRole('tab', { name: 'Excel' })).toHaveAttribute('aria-selected', 'true');
  await expect(first.getByRole('tabpanel')).toHaveCount(1);
  await expect(first.getByRole('tabpanel')).toContainText('Policz liczby');
  await first.getByRole('tab', { name: 'Algorytmika' }).click();
  await expect(first.getByRole('tabpanel')).toContainText('liczbę porównań');
  await first.getByRole('tab', { name: 'Algorytmika' }).click();
  await expect(first.getByRole('tabpanel')).toHaveCount(1);
  await expect(second.getByRole('tabpanel')).toContainText('średnią');
  await second.getByRole('tab', { name: 'SQL i Access' }).click();
  await expect(second.getByRole('tabpanel')).toContainText('zapytania SQL i tworzenie kwerend w Accessie');
  await expect(first.getByRole('tab', { name: 'Algorytmika' })).toHaveAttribute('aria-selected', 'true');
  await first.getByRole('tab', { name: 'Python lub C++' }).click();
  await first.getByRole('link', { name: 'Zobacz przykład lekcji' }).click();
  await expect(page).toHaveURL(/#przyklad-podstawowy$/);
  await expect(page.locator('#przyklad-podstawowy')).toBeVisible();
});

test('semantyka i klawiatura ukrywają nieaktywny panel także przed fokusem', async ({ page }) => {
  const first = page.locator('[data-subject-group]').first();
  const tabs = first.getByRole('tab');
  await expect(first.getByRole('tablist')).toHaveAccessibleName('Programowanie i algorytmy');
  await tabs.first().focus();
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.last()).toBeFocused();
  await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
  const inactive = first.locator('#subject-panel-programowanie');
  await expect(inactive).toHaveAttribute('inert', '');
  await expect(inactive).toHaveAttribute('aria-hidden', 'true');
  await expect(inactive).toBeHidden();
  await page.keyboard.press('Tab');
  await expect(first.getByRole('tabpanel')).toBeFocused();
  await tabs.last().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.first()).toBeFocused();
  await page.keyboard.press('End');
  await expect(tabs.last()).toBeFocused();
  await page.keyboard.press('Home');
  await expect(tabs.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(first.getByRole('tabpanel')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(first.getByRole('link')).toBeFocused();
  for (const tab of await tabs.all()) {
    const id = await tab.getAttribute('aria-controls');
    await expect(page.locator(`#${id}`)).toHaveAttribute('aria-labelledby', (await tab.getAttribute('id'))!);
  }
});

test('przykłady fundamentów są zawsze widoczne, ograniczenie ruchu wyłącza przenikanie', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('tab', { name: 'Algorytmika' }).click();
  await expect(page.locator('#subject-panel-algorytmika')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.foundation-equation')).toHaveText('10102 = 1010');
  await expect(page.locator('.foundation-example').first()).toContainText('8 + 2 = 10');
  await expect(page.locator('.foundation-example').last().getByRole('listitem')).toHaveCount(3);
  const exam = page.locator('.foundation-exam');
  await expect(exam).toContainText('CKE · maj 2026 · zadanie 7.1 · 3 pkt');
  await expect(exam).toContainText('staw.txt (Formuła 2023)');
  await expect(exam.getByRole('blockquote')).toHaveText('Utwórz zestawienie średnich miesięcznych temperatur w zaokrągleniu do jednego miejsca po przecinku.');
  await expect(exam).toContainText('Fragment polecenia');
  await expect(exam).toContainText('Jak pracujemy nad zadaniem');
  await expect(exam).not.toContainText('przykład autorski');
  await expect(exam).not.toContainText('Wyznacz największą liczbę');
  await expect(exam.getByRole('link', { name: 'Pełne polecenie — PDF' })).toHaveAttribute('href', 'https://cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/2026/Informatyka/MINP-R0-100-A-2605-arkusz.pdf#page=16');
  await expect(exam.getByRole('link', { name: 'Zasady oceniania — PDF' })).toHaveAttribute('href', 'https://cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/2026/Informatyka/MINP-R0-100-2605-zasady.pdf#page=14');
});

test('bez JavaScriptu tematy są zwykłą treścią z nagłówkami', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route('https://calendar.google.com/**', route => route.abort());
  await page.goto('/');
  await expect(page.locator('[data-subject-panel]:visible')).toHaveCount(4);
  await expect(page.locator('[data-subject-tabs]:visible')).toHaveCount(0);
  for (const panel of await page.locator('[data-subject-panel]').all()) {
    await expect(panel.getByRole('heading', { level: 4 })).toBeVisible();
    await expect(panel).not.toHaveAttribute('inert');
    await expect(panel).not.toHaveAttribute('aria-hidden');
  }
  await expect(page.locator('.foundation-example:visible')).toHaveCount(2);
  await expect(page.locator('.foundation-exam').getByRole('blockquote')).toBeVisible();
  await expect(page.locator('.foundation-exam').getByRole('link')).toHaveCount(2);
  await context.close();
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`przełączanie nie zmienia wysokości ani przewinięcia przy ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    for (const group of await page.locator('[data-subject-group]').all()) {
      const tabs = group.getByRole('tab');
      await tabs.first().scrollIntoViewIfNeeded();
      await tabs.first().focus();
      const before = await group.evaluate(el => ({ height: el.getBoundingClientRect().height, scroll: scrollY }));
      const tabBoxes = await tabs.evaluateAll(elements => elements.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
      expect(tabBoxes[0].y).toBeCloseTo(tabBoxes[1].y, 0);
      for (const box of tabBoxes) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      await page.keyboard.press('ArrowRight');
      await expect(tabs.last()).toBeFocused();
      const after = await group.evaluate(el => ({ height: el.getBoundingClientRect().height, scroll: scrollY }));
      expect(after.height).toBeCloseTo(before.height, 1);
      expect(after.scroll).toBeCloseTo(before.scroll, 0);
      await expect(group.getByRole('tabpanel')).toHaveCount(1);
      const panel = (await group.getByRole('tabpanel').boundingBox())!;
      expect(panel.x).toBeGreaterThanOrEqual(0);
      expect(panel.x + panel.width).toBeLessThanOrEqual(width);
    }
    for (const link of await page.locator('.exam-sources a').all()) {
      const box = (await link.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
