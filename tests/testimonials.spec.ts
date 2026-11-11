import { expect, test } from "./support/expanded-home";

test.beforeEach(async ({ page }) => {
  await page.route("https://calendar.google.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Calendar</p>" }),
  );
  await page.goto("/#opinie");
  await expect(page.locator("#opinie")).toHaveClass(/motion-ready/);
});

test("testimonial cards respond to the pointer, retain entrance effects, and return to rest", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const cards = page.locator(".testimonial-card");
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveClass(/is-revealed/);
    const restingTransform = await card.evaluate((el) => getComputedStyle(el).transform);
    await card.hover({ position: { x: 30, y: 30 } });
    await expect(card).toHaveClass(/pointer-active/);
    await expect.poll(() => card.evaluate((el) => getComputedStyle(el).transform)).not.toBe(restingTransform);
    await expect.poll(() => card.evaluate((el) =>
      getComputedStyle(el, "::before").opacity,
    )).toBe("1");
    const rotation = await card.evaluate((el) =>
      Number.parseFloat(el.style.getPropertyValue("--card-ry")) * 0.5,
    );
    expect(Math.abs(rotation)).toBeGreaterThan(0);
    expect(Math.abs(rotation)).toBeLessThanOrEqual(1.5);
    await expect(card).not.toHaveAttribute("tabindex");
    expect(await card.evaluate((el) => getComputedStyle(el).cursor)).not.toBe("pointer");
    await expect.poll(() => card.evaluate((el) =>
      el.getBoundingClientRect().left >= 0 && el.getBoundingClientRect().right <= innerWidth,
    )).toBe(true);
    await page.mouse.move(0, 0);
    await expect(card).not.toHaveClass(/pointer-active/);
    await expect.poll(() => card.evaluate((el) =>
      getComputedStyle(el, "::before").opacity,
    )).toBe("0");
    expect(await card.evaluate((el) => el.style.getPropertyValue("--card-ry"))).toBe("");
  }
  await expect(page.locator(".testimonial-featured")).toHaveCSS("background-color", "rgb(232, 237, 227)");
  const card = cards.first();
  await card.hover({ position: { x: 30, y: 30 } });
  await expect(card).toHaveClass(/pointer-active/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).not.toHaveClass(/pointer-active/);
  await expect(card).toHaveCSS("transform", "none");
  await expect(card).toHaveCSS("animation-name", "none");
  await card.hover({ position: { x: 60, y: 60 } });
  await expect(card).not.toHaveClass(/pointer-active/);
});

for (const width of [360, 768]) {
  test.describe(`touch input at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 }, hasTouch: true, isMobile: true });

    test("the touch glow fades and cards fit the viewport", async ({ page }) => {
      const cards = page.locator(".testimonial-card");
      for (const card of await cards.all()) {
        await card.scrollIntoViewIfNeeded();
        const box = (await card.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        await card.tap({ position: { x: 30, y: 30 } });
        await expect(card).toHaveClass(/is-tapped/);
        await expect(card).not.toHaveClass(/pointer-active/);
        expect(await card.evaluate((el) => el.style.getPropertyValue("--card-rx"))).toBe("");
        await expect(card).not.toHaveClass(/is-tapped/);
        await expect.poll(() => card.evaluate((el) => getComputedStyle(el, "::before").opacity)).toBe("0");
        expect(await card.locator("blockquote").evaluate((el) => getComputedStyle(el).userSelect)).not.toBe("none");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await cards.first().tap({ position: { x: 30, y: 30 } });
      await expect(cards.first()).not.toHaveClass(/is-tapped/);
      await expect(cards.first()).toHaveCSS("transform", "none");
      await expect(cards.first().locator("blockquote")).toBeVisible();
    });
  });
}
