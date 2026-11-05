import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://calendar.google.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<p>Kalendarz testowy</p>",
    }),
  );
});

test("wyspy zachowują statyczną treść i uruchamiają się dopiero przy przewinięciu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const subjects = page.locator("#zakres");
  const island = subjects.locator("xpath=ancestor::astro-island[1]");
  await expect(island).toHaveAttribute("ssr");
  await expect(subjects.locator("[data-subject-panel]")).toHaveCount(4);
  await expect(subjects.locator("[data-subject-tabs]:visible")).toHaveCount(0);
  await subjects.scrollIntoViewIfNeeded();
  await expect(island).not.toHaveAttribute("ssr");
  await expect(subjects.getByRole("tablist")).toHaveCount(2);
  await expect(subjects.getByRole("tabpanel")).toHaveCount(2);
  // Native disclosures are rendered in React at build time, without a client island.
  await expect(
    page.locator("#faq").locator("xpath=ancestor::astro-island"),
  ).toHaveCount(0);
  await expect(
    page.locator("#rezerwacja").locator("xpath=ancestor::astro-island"),
  ).toHaveCount(0);
});

test("hydratacja wszystkich sekcji i zmiana poziomów nie zgłaszają błędów React", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const id of [
    "#start",
    "#wspolpraca",
    "#przyklad",
    "#zakres",
    "#o-mnie",
    "#opinie",
    "#oferta",
    "#kontakt",
  ]) {
    await page.locator(id).scrollIntoViewIfNeeded();
    await expect(
      page.locator(id).locator("xpath=ancestor::astro-island[1]"),
    ).not.toHaveAttribute("ssr");
  }
  await page.locator("#przyklad").scrollIntoViewIfNeeded();
  const levels = page.getByRole("group", {
    name: "Poziom przykładu",
    exact: true,
  });
  for (const [level, id] of [
    ["Wyzwanie", "przyklad-wyzwanie"],
    ["Krok dalej", "przyklad-trudniejszy"],
    ["Podstawy", "przyklad-podstawowy"],
  ]) {
    await levels.getByRole("button", { name: new RegExp(level) }).click();
    await expect(
      levels.getByRole("button", { name: new RegExp(level) }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator(`#${id}-task`)).toBeFocused();
    await expect(
      page.locator("#przyklad [data-lesson-panel]:visible"),
    ).toHaveCount(1);
  }
  await page.evaluate(() => {
    location.hash = "przyklad-wyzwanie";
  });
  await expect(page.locator("#przyklad-wyzwanie-task")).toBeFocused();
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("opóźnione skrypty nie blokują menu, FAQ ani treści", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Simulate a failed script download, independently of the no-JavaScript context tests.
  await page.route("**/_astro/*.js", (route) =>
    route.fulfill({ contentType: "application/javascript", body: "" }),
  );
  await page.goto("/");
  const menu = page.locator(".mobile-menu");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");
  await menu.getByRole("link", { name: "FAQ", exact: true }).click();
  const question = page.locator("#faq details").first();
  await question.locator("summary").click();
  await expect(question.locator("p")).toBeVisible();
  await expect(
    page.locator("#przyklad [data-lesson-panel]:visible"),
  ).toHaveCount(3);
  await expect(page.locator("[data-subject-panel]:visible")).toHaveCount(4);
  await expect(page.locator("#przyklad button:visible")).toHaveCount(0);
});
