import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://calendar.google.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Kalendarz</p>" }),
  );
  await page.goto("/");
});

test("punkty na ilustracjach i zakładki współdzielą wybór, także z klawiatury", async ({
  page,
}) => {
  await page.locator("#zakres").scrollIntoViewIfNeeded();
  const cards = page.locator("[data-subject-group]");
  const first = cards.first();
  const algorithm = first.getByRole("button", {
    name: "Poznaj temat: Algorytmika",
    exact: true,
  });
  await algorithm.click();
  await expect(algorithm).toHaveAttribute("aria-pressed", "true");
  await expect(first.getByRole("tabpanel")).toBeFocused();
  await expect(
    first.getByRole("tabpanel").locator(".subject-example-task"),
  ).toBeInViewport({ ratio: 1 });
  await expect(first.locator(".subject-art")).not.toHaveAttribute(
    "data-revealing",
  );
  await expect(
    first.getByRole("tab", { name: "Algorytmika", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(first.getByRole("tabpanel")).toContainText("liczbę porównań");
  await expect(
    cards.last().getByRole("tab", { name: "Excel", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await first.getByRole("tab", { name: "Python lub C++", exact: true }).click();
  await expect(algorithm).toHaveAttribute("aria-pressed", "false");
  await algorithm.focus();
  await page.keyboard.press("Enter");
  await expect(first.getByRole("tabpanel")).toContainText("liczbę porównań");
  await expect(first.getByRole("tabpanel")).toBeFocused();
  await expect(
    first.getByRole("tabpanel").locator(".subject-example-task"),
  ).toBeInViewport({ ratio: 1 });
  for (const spot of await page.locator(".subject-art-spot").all()) {
    const box = (await spot.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

for (const width of [360, 768, 1440]) {
  test(`kliknięcie plusa łagodnie odsłania opis i zachowuje obrazek przy ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 640 });
    // The description must be revealed with either motion preference.
    await page.emulateMedia({
      reducedMotion: width === 768 ? "reduce" : "no-preference",
    });
    const card = page.locator("[data-subject-group]").first();
    await card.locator(".subject-art").scrollIntoViewIfNeeded();
    for (const name of ["Python lub C++", "Algorytmika", "Algorytmika"]) {
      const spot = card.getByRole("button", {
        name: `Poznaj temat: ${name}`,
        exact: true,
      });
      await expect(spot).toBeVisible();
      await card.locator(".subject-art").evaluate((element) =>
        scrollTo({
          top: scrollY + element.getBoundingClientRect().top - innerHeight / 2,
          behavior: "instant",
        }),
      );
      await expect(card.getByRole("tabpanel")).not.toBeInViewport({ ratio: 1 });
      await spot.click();
      const panel = card.getByRole("tabpanel");
      await expect(panel).toHaveAccessibleName(name);
      await expect(panel).toBeFocused();
      // The task remains fully visible with part of the illustration. The new
      // diagram below it can extend beyond a short viewport.
      await expect(panel.locator(".subject-skill")).toBeInViewport({
        ratio: 1,
      });
      await expect(panel.locator(".subject-example-task")).toBeInViewport({
        ratio: 1,
      });
      await expect(card.locator(".subject-art")).not.toHaveAttribute(
        "data-revealing",
      );
      await expect
        .poll(() =>
          card.locator(".subject-art").evaluate((element) => {
            const image = element.getBoundingClientRect();
            const top = document
              .querySelector(".site-header")!
              .getBoundingClientRect().bottom;
            return (
              Math.min(image.bottom, innerHeight) - Math.max(image.top, top)
            );
          }),
        )
        .toBeGreaterThanOrEqual(90);
      await expect(panel).toHaveCSS("outline-style", "none");
      await expect
        .poll(() =>
          card
            .getByRole("tablist")
            .evaluate(
              (element) =>
                element.getBoundingClientRect().top >=
                document.querySelector(".site-header")!.getBoundingClientRect()
                  .bottom,
            ),
        )
        .toBe(true);
    }
  });
}

test("ilustracja reaguje na kursor i wraca do spoczynku; ograniczenie ruchu wyłącza przechylenie", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const art = page.locator(".subject-art").first();
  await art.scrollIntoViewIfNeeded();
  // The picture exists in static HTML before the lazy React island attaches effects.
  await expect(page.locator("#zakres")).toHaveClass(/motion-active/);
  await art.hover({ position: { x: 70, y: 90 } });
  await expect(art).toHaveClass(/pointer-active/);
  expect(
    await art.evaluate((el) => el.style.getPropertyValue("--card-ry")),
  ).not.toBe("");
  await page.mouse.move(0, 0);
  await expect(art).not.toHaveClass(/pointer-active/);
  expect(
    await art.evaluate((el) => el.style.getPropertyValue("--card-ry")),
  ).toBe("");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await art.hover({ position: { x: 70, y: 90 } });
  await expect(art).not.toHaveClass(/pointer-active/);
  await expect(art).toHaveCSS("transform", "none");
  await expect(art.locator("img")).toHaveCSS("transform", "none");
});

test("wstęgi uruchamiają się na końcu strony, zostają po animacji i nie przechwytują kliknięć", async ({
  page,
}) => {
  const contact = page.locator("#kontakt");
  await contact.scrollIntoViewIfNeeded();
  await expect(
    contact.locator("xpath=ancestor::astro-island[1]"),
  ).not.toHaveAttribute("ssr");
  await expect(contact).not.toHaveClass(/contact-arrived/);
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect(contact).toHaveClass(/contact-arrived/);
  await expect(contact.locator(".celebration-ribbon")).toHaveCount(3);
  await expect(contact.locator(".celebration-ribbon").first()).toHaveCSS(
    "animation-name",
    "ribbon-unfurl",
  );
  await expect(contact.locator(".contact-celebration")).toHaveCSS(
    "pointer-events",
    "none",
  );
  await contact
    .locator(".celebration-ribbon")
    .evaluateAll((paths) =>
      Promise.all(
        paths.flatMap((path) =>
          path.getAnimations().map((animation) => animation.finished),
        ),
      ),
    );
  await expect(contact.locator(".celebration-ribbon").first()).toHaveCSS(
    "stroke-dashoffset",
    "0px",
  );
  await expect(contact.locator(".celebration-ribbons")).toHaveCSS(
    "opacity",
    "0.8",
  );
  await contact.getByRole("link", { name: "Umów bezpłatne spotkanie" }).click();
  await expect(page).toHaveURL(/#rezerwacja$/);
});

test("na telefonie punkty działają dotykiem, a dekoracje mieszczą się w ekranie", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.route("https://calendar.google.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Kalendarz</p>" }),
  );
  await page.goto("/#zakres");
  const spot = page.getByRole("button", { name: "Poznaj temat: SQL i Access" });
  await spot.tap();
  await expect(spot).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#subject-panel-access")).toBeVisible();
  await expect(page.locator("#subject-panel-access")).toBeFocused();
  await expect(
    page.locator("#subject-panel-access .subject-example-task"),
  ).toBeInViewport({
    ratio: 1,
  });
  await expect(page.locator("[data-revealing]")).toHaveCount(0);
  for (const button of await page.locator(".subject-art-spot").all()) {
    const box = (await button.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect(page.locator("#kontakt")).toHaveClass(/contact-arrived/);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".contact-celebration")).toBeHidden();
  await context.close();
});
