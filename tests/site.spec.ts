import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Testujemy integrację po naszej stronie, bez połączeń z Google i rezerwacji terminów.
  await page.route('https://calendar.google.com/**', route => route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><html lang="pl"><title>Kalendarz testowy</title></html>',
  }));
  await page.goto('/');
});

test('strona ładuje treść, metadane i lokalne obrazy', async ({ page }) => {
  await expect(page).toHaveTitle(/Matura z informatyki/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S+/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://maturainformatyka.com/');

  // Uwzględniamy także obrazy ładowane leniwie, bez zależności od przewijania.
  const brokenImages = await page.locator('img').evaluateAll(async (images: HTMLImageElement[]) => {
    const results = await Promise.all(images.map(async image => {
      try {
        image.loading = 'eager';
        await image.decode();
        return null;
      } catch {
        return image.getAttribute('src');
      }
    }));
    return results.filter(src => src !== null);
  });
  expect(brokenImages).toEqual([]);
});

test('nawigacja prowadzi do istniejących sekcji', async ({ page }) => {
  const links = page.getByRole('navigation', { name: 'Nawigacja główna', exact: true }).getByRole('link');
  expect(await links.count()).toBeGreaterThan(0);
  for (const link of await links.all()) {
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^#.+/);
    await expect(page.locator(href!)).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator(href!)).toBeInViewport();
  }
});

test('przycisk spotkania prowadzi do kalendarza z linkiem alternatywnym', async ({ page }) => {
  await page.locator('.hero-actions').getByRole('link', { name: 'Umów bezpłatne spotkanie' }).click();
  await expect(page).toHaveURL(/#rezerwacja$/);
  const booking = page.locator('#rezerwacja');
  await expect(booking).toBeInViewport();
  const frame = booking.locator('iframe');
  await expect(frame).toHaveAttribute('title', /Rezerwacja bezpłatnego/);
  const embed = new URL((await frame.getAttribute('src'))!);
  expect(embed.origin).toBe('https://calendar.google.com');
  expect(embed.pathname).toMatch(/\/appointments\/schedules\/.+/);
  expect(embed.searchParams.get('hl')).toBe('pl');
  expect(embed.searchParams.get('gv')).toBe('true');
  const alternative = booking.getByRole('link', { name: 'Otwórz rezerwację w Google' });
  const target = new URL((await alternative.getAttribute('href'))!);
  expect(target.origin + target.pathname).toBe(embed.origin + embed.pathname);
  await expect(alternative).toHaveAttribute('target', '_blank');
});

test('oferta poprzedza rezerwację, a główne przyciski mają wspólny cel', async ({ page }) => {
  const sections = await page.locator('main section[id]').evaluateAll(elements => elements.map(element => element.id));
  expect(sections.indexOf('oferta')).toBeLessThan(sections.indexOf('rezerwacja'));
  expect(sections.indexOf('rezerwacja')).toBeLessThan(sections.indexOf('faq'));
  const actions = page.locator('.hero-actions .button, .price-card .button, .contact-booking .button, .header-contact');
  await expect(actions).toHaveCount(4);
  for (const action of await actions.all()) {
    await expect(action).toHaveAttribute('href', '#rezerwacja');
  }
});

test('przykład lekcji pokazuje spójne dane, rozwiązanie i wynik', async ({ page }) => {
  const example = page.locator('#przyklad-podstawowy');
  await expect(example).toBeVisible();
  await expect(page.locator('#przyklad-trudniejszy')).toBeHidden();
  await expect(page.locator('#przyklad-wyzwanie')).toBeHidden();
  await expect(example.locator('.lesson-level')).toHaveText('Podstawy');
  await expect(example).toContainText('przykład autorski, demonstracyjny');
  const values = (await example.locator('.number-sequence > span').allTextContents()).map(Number);
  const expected = values.filter(value => value % 2 === 0);
  await expect(example.locator('.number-sequence .is-highlighted')).toHaveText(expected.map(String));
  await expect(example.locator('.code-result strong')).toContainText(`${expected.length} liczby parzyste`);
  await expect(example.locator('pre code')).toContainText('if number % 2 == 0:');
  await expect(example.locator('.mentor-hint')).toContainText('reszta z dzielenia przez 2');
});

test('przykład przełącza poziom i pozwala wielokrotnie wrócić do podstaw', async ({ page }) => {
  const basic = page.locator('#przyklad-podstawowy');
  const advanced = page.locator('#przyklad-trudniejszy');
  for (let turn = 0; turn < 2; turn++) {
    await basic.getByRole('button', { name: 'Proste? Spróbuj trudniejszego →' }).click();
    await expect(basic).toBeHidden();
    await expect(advanced).toBeVisible();
    await expect(advanced.locator('.lesson-level')).toHaveText('Krok dalej');
    await expect(advanced.getByRole('heading')).toBeFocused();
    await expect(advanced.locator('.number-sequence .is-highlighted')).toHaveText(['3', '-1', '4']);
    await expect(advanced.locator('.code-result strong')).toContainText('Największa suma: 6');
    await expect(advanced.locator('.sequence-caption')).toContainText('kolejne elementy');
    await expect(advanced.locator('.lesson-takeaway')).toContainText('O(n)');
    // Ukryty panel nie występuje w drzewie dostępności ani w kolejności Tab.
    await expect(page.getByRole('heading', { name: 'Policz, ile liczb w podanym ciągu jest parzystych.' })).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(advanced.getByRole('button', { name: 'Prześledź rozwiązanie' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(advanced.locator('pre')).toBeFocused();
    await page.keyboard.press('Tab');
    const back = advanced.getByRole('button', { name: '← Wróć do podstaw' });
    await expect(back).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(basic).toBeVisible();
    await expect(advanced).toBeHidden();
    await expect(basic.getByRole('heading')).toBeFocused();
  }
});

test('wyzwanie pokazuje rosnący podciąg i pozwala wracać przez wszystkie poziomy', async ({ page }) => {
  const basic = page.locator('#przyklad-podstawowy');
  const advanced = page.locator('#przyklad-trudniejszy');
  const challenge = page.locator('#przyklad-wyzwanie');
  for (let turn = 0; turn < 2; turn++) {
    await basic.getByRole('button', { name: 'Proste? Spróbuj trudniejszego →' }).click();
    await advanced.getByRole('button', { name: 'Jeszcze za prosto? Sprawdź wyzwanie →' }).click();
    await expect(challenge).toBeVisible();
    await expect(basic).toBeHidden();
    await expect(advanced).toBeHidden();
    await expect(challenge.getByRole('heading')).toBeFocused();
    await expect(challenge.locator('.lesson-level')).toHaveText('Wyzwanie');
    await expect(challenge.locator('.number-sequence > span')).toHaveText(['3', '1', '5', '2', '6', '4', '9']);
    await expect(challenge.locator('.number-sequence .is-highlighted')).toHaveText(['1', '2', '4', '9']);
    await expect(challenge.locator('.code-result strong')).toContainText('Największa długość: 4');
    await expect(challenge.locator('.sequence-caption')).toContainText('zachować ich kolejność');
    await expect(challenge.locator('.lesson-takeaway')).toContainText('O(n²)');
    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: 'Znajdź największą sumę' })).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(challenge.getByRole('button', { name: 'Prześledź rozwiązanie' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(challenge.locator('pre')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(challenge.getByRole('button', { name: '← Wróć do poprzedniego' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(challenge).toBeHidden();
    await expect(advanced.getByRole('heading')).toBeFocused();
    await advanced.getByRole('button', { name: '← Wróć do podstaw' }).click();
    await expect(basic.getByRole('heading')).toBeFocused();
  }
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(`kolorowanie Python — JavaScript ${javaScriptEnabled ? 'włączony' : 'wyłączony'}`, () => {
    test.use({ javaScriptEnabled });

    test('trzy poziomy mają czytelne tokeny i zachowują tekst do kopiowania', async ({ page }) => {
      await page.setViewportSize({ width: javaScriptEnabled ? 1440 : 360, height: 1000 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const examples = [
        { id: '#przyklad-podstawowy', action: 'Proste? Spróbuj trudniejszego →' },
        { id: '#przyklad-trudniejszy', action: 'Jeszcze za prosto? Sprawdź wyzwanie →' },
        { id: '#przyklad-wyzwanie', action: '' },
      ];
      for (const [index, example] of examples.entries()) {
        if (index > 0) {
          const previous = page.locator(examples[index - 1].id);
          await previous.getByRole(javaScriptEnabled ? 'button' : 'link', { name: examples[index - 1].action }).click();
        }
        const panel = page.locator(example.id);
        const pre = panel.locator('pre');
        await expect(pre).toHaveAttribute('data-language', 'python');
        await expect(pre).toHaveAttribute('tabindex', '0');
        await expect(pre).toHaveCSS('font-size', javaScriptEnabled ? '14px' : '13px');
        await expect(pre).toHaveCSS('overflow-x', 'auto');
        await expect(panel.locator('.code-caption')).toContainText('solution.py');

        const highlighted = await pre.evaluate(element => {
          const tokens = [...element.querySelectorAll<HTMLElement>('code span[style]')].map(token => ({
            text: token.textContent!.trim(), color: getComputedStyle(token).color,
          }));
          const luminance = (color: string) => {
            const [r, g, b] = color.match(/[\d.]+/g)!.slice(0, 3).map(value => {
              const channel = Number(value) / 255;
              return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
            });
            return .2126 * r + .7152 * g + .0722 * b;
          };
          const background = luminance(getComputedStyle(element).backgroundColor);
          return {
            keyword: tokens.find(token => token.text === 'for'),
            number: tokens.find(token => /^\d+$/.test(token.text)),
            function: tokens.find(token => token.text === 'print'),
            comment: tokens.find(token => token.text.startsWith('#')),
            contrast: [...new Set(tokens.map(token => token.color))].map(color => {
              const foreground = luminance(color);
              return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
            }),
          };
        });
        expect(highlighted.keyword?.color).toBe('rgb(228, 180, 252)');
        expect(highlighted.number?.color).toBe('rgb(240, 193, 138)');
        expect(highlighted.function?.color).toBe('rgb(159, 218, 234)');
        expect(highlighted.comment?.color).toBe('rgb(168, 190, 200)');
        for (const contrast of highlighted.contrast) expect(contrast).toBeGreaterThanOrEqual(4.5);

        const copied = await pre.locator('code').evaluate(element => {
          const selection = getSelection()!;
          const range = document.createRange();
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
          const result = { source: element.textContent!, selected: selection.toString() };
          selection.removeAllRanges();
          return result;
        });
        expect(copied.selected).toBe(copied.source);
        expect(copied.source).toMatch(/\n\nfor /);
        expect(copied.source).toMatch(/\n    (if|current_sum|for) /);
        expect(copied.source).not.toMatch(/\b(liczby|liczba|wynik|suma|najlepsza|dlugosci)\b/);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
    });
  });
}

for (const width of [360, 390, 768, 1440]) {
  test(`przełączanie poziomu z klawiatury przy ${width} px i ograniczeniu ruchu`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const basic = page.locator('#przyklad-podstawowy');
    const advanced = page.locator('#przyklad-trudniejszy');
    const challenge = page.locator('#przyklad-wyzwanie');
    const next = basic.getByRole('button', { name: 'Proste? Spróbuj trudniejszego →' });
    await next.focus();
    await page.keyboard.press('Space');
    await expect(advanced.getByRole('heading')).toBeFocused();
    await expect.poll(() => advanced.evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.site-header')!.getBoundingClientRect().bottom)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await advanced.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
    await advanced.getByRole('button', { name: 'Jeszcze za prosto? Sprawdź wyzwanie →' }).focus();
    await page.keyboard.press('Enter');
    await expect(challenge.getByRole('heading')).toBeFocused();
    await expect(advanced).toBeHidden();
    await expect.poll(() => challenge.evaluate(element => element.getBoundingClientRect().top >= document.querySelector('.site-header')!.getBoundingClientRect().bottom)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await challenge.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
    await challenge.getByRole('button', { name: '← Wróć do poprzedniego' }).focus();
    await page.keyboard.press('Space');
    await expect(advanced.getByRole('heading')).toBeFocused();
    await expect(challenge).toBeHidden();
    await advanced.getByRole('button', { name: '← Wróć do podstaw' }).focus();
    await page.keyboard.press('Enter');
    await expect(basic.getByRole('heading')).toBeFocused();
    await expect(advanced).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('oznaczenie teorii ma postać liczby binarnej z indeksem podstawy', async ({ page }) => {
  const badge = page.locator('.subject-foundation > div').filter({ has: page.getByRole('heading', { name: 'Teoria informatyki' }) }).locator('.foundation-code');
  await expect(badge).toHaveAttribute('aria-hidden', 'true');
  await expect(badge).toHaveText('10102');
  await expect(badge.locator('sub')).toHaveText('2');
});

for (const viewport of [
  { width: 360, height: 800 }, { width: 390, height: 844 },
  { width: 768, height: 1024 }, { width: 1024, height: 768 },
  { width: 1440, height: 1000 }, { width: 1366, height: 650 },
]) {
  test(`układ ${viewport.width}×${viewport.height} mieści treść i odsłania cel pod nagłówkiem`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Kontrolujemy wszystkie sekcje, aby dekoracje i obrazy nie wypychały układu.
    for (const id of ['#wspolpraca', '#przyklad', '#zakres', '#o-mnie', '#opinie', '#oferta', '#rezerwacja', '#faq', '#kontakt']) {
      await page.evaluate(target => { location.hash = target; }, id);
      await expect(page.locator(id)).toBeInViewport();
      await expect.poll(async () => page.locator(id).evaluate(element => {
        const header = document.querySelector('.site-header')!.getBoundingClientRect();
        const target = element.getBoundingClientRect();
        return target.top >= header.bottom - 1 && target.top < innerHeight;
      })).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test('ograniczenie ruchu wyłącza animacje i zachowuje czytelność', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.hero-copy')).toBeVisible();
  expect(await page.locator('.orbit-track').first().evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.locator('.contact-celebration')).toBeHidden();
  await page.locator('.hero-actions .button').click();
  await expect(page.locator('#rezerwacja')).toBeInViewport();
  expect(await page.locator('.geometry-parallax').first().evaluate(element => getComputedStyle(element).transform)).toBe('none');
});

test('klawiatura pozwala ominąć nawigację i otworzyć FAQ', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Przejdź do treści' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#tresc$/);
  const summary = page.locator('#faq summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
  expect(await summary.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none');
});

test('kontakt udostępnia poprawne odnośniki e-mail i telefon', async ({ page }) => {
  const email = page.locator('#kontakt').getByRole('link', { name: /NAPISZ DO MNIE/ });
  const address = (await email.locator('strong').innerText()).trim();
  expect(address).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  await expect(email).toHaveAttribute('href', `mailto:${address}`);
  const phone = page.locator('#kontakt').getByRole('link', { name: /LUB ZADZWOŃ/ });
  const number = (await phone.locator('strong').innerText()).replace(/\s/g, '');
  expect(number).toMatch(/^\+\d{9,15}$/);
  await expect(phone).toHaveAttribute('href', `tel:${number}`);
});

test('menu mobilne zamyka się po wyborze sekcji oraz po Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.locator('.mobile-menu');
  const toggle = menu.locator('summary');
  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Kontakt', exact: true }).click();
  await expect(page).toHaveURL(/#kontakt$/);
  await expect(menu).not.toHaveAttribute('open');
  await toggle.click();
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(toggle).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });

  test('menu mobilne, rezerwacja i rozwijanie FAQ nadal działają', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.mobile-menu summary').click();
    await page.getByRole('navigation', { name: 'Nawigacja mobilna' }).getByRole('link', { name: 'FAQ', exact: true }).click();
    await expect(page).toHaveURL(/#faq$/);
    const question = page.locator('#faq details').filter({ hasText: 'Czy muszę już dobrze programować?' });
    const answer = question.locator('p');
    await expect(answer).not.toBeVisible();
    await question.locator('summary').click();
    await expect(answer).toBeVisible();
    await question.locator('summary').click();
    await expect(answer).not.toBeVisible();
    await page.locator('.hero-actions').getByRole('link', { name: 'Umów bezpłatne spotkanie' }).click();
    await expect(page).toHaveURL(/#rezerwacja$/);
    await expect(page.locator('#rezerwacja')).toBeInViewport();
    await expect(page.locator('#przyklad-podstawowy pre code')).toContainText('if number % 2 == 0:');
  });

  test('trzy poziomy zadania są dostępne przez linki bez JavaScriptu', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const basic = page.locator('#przyklad-podstawowy');
    const advanced = page.locator('#przyklad-trudniejszy');
    const challenge = page.locator('#przyklad-wyzwanie');
    await expect(basic).toBeVisible();
    await expect(advanced).toBeVisible();
    await expect(challenge).toBeVisible();
    await expect(page.locator('#przyklad button:visible')).toHaveCount(0);
    await basic.getByRole('link', { name: 'Proste? Spróbuj trudniejszego →' }).click();
    await expect(page).toHaveURL(/#przyklad-trudniejszy$/);
    await expect(advanced).toBeInViewport();
    await expect(advanced.locator('pre code')).toContainText('current_sum = best_sum = numbers[0]');
    await advanced.getByRole('link', { name: 'Jeszcze za prosto? Sprawdź wyzwanie →' }).click();
    await expect(page).toHaveURL(/#przyklad-wyzwanie$/);
    await expect(challenge).toBeInViewport();
    await expect(challenge.locator('.code-result strong')).toContainText('Największa długość: 4');
    await challenge.getByRole('link', { name: '← Wróć do poprzedniego' }).click();
    await expect(page).toHaveURL(/#przyklad-trudniejszy$/);
    await expect(advanced).toBeInViewport();
    await advanced.getByRole('link', { name: '← Wróć do podstaw' }).click();
    await expect(page).toHaveURL(/#przyklad-podstawowy$/);
    await expect(basic).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
