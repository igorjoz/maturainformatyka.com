import { expect, test } from "./support/expanded-home";

test.beforeEach(async ({ page }) => {
  await page.route("https://calendar.google.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Calendar</p>" }),
  );
  await page.goto("/#zakres");
  await expect(
    page.locator("#zakres").locator("xpath=ancestor::astro-island[1]"),
  ).not.toHaveAttribute("ssr");
});

test("sequences finish with the correct result and replay preserves selection and focus", async ({
  page,
}) => {
  for (const [kind, result] of [
    ["programowanie", "3 liczby parzyste: 8, 12 i 4."],
    [
      "algorytmika",
      "3 porównania. Największa liczba trafia na koniec: 2, 3, 1, 5.",
    ],
    ["excel", "Średnia: 6. Powyżej średniej: 8 i 10."],
    ["access", "Po połączeniu i filtrze zostają: Ala — 92 pkt i Ola — 85 pkt."],
  ]) {
    await page.locator(`[data-subject-target="${kind}"]`).click();
    const diagram = page.locator(`[data-diagram="${kind}"]`);
    await diagram.scrollIntoViewIfNeeded();
    await expect(diagram).toHaveAttribute("data-playback", "complete", {
      timeout: 6000,
    });
    await expect(diagram.locator(".diagram-result")).toHaveText(result);
    if (kind === "programowanie") {
      await expect(diagram.locator(".diagram-calculation strong")).toHaveText(
        "3",
      );
      await expect(diagram.locator(".diagram-number.is-marked")).toHaveText([
        "8",
        "12",
        "4",
      ]);
    }
    if (kind === "algorytmika")
      await expect(diagram.locator(".diagram-number")).toHaveText([
        "2",
        "3",
        "1",
        "5",
      ]);
    if (kind === "excel")
      await expect(diagram.locator(".diagram-bar.is-marked")).toHaveText([
        "8",
        "10",
      ]);
    if (kind === "access")
      await expect(diagram.locator(".is-filtered")).toHaveText("2 · 64 pkt");
    const replay = diagram.getByRole("button", { name: /Odtwórz ponownie/ });
    await replay.focus();
    const before = await page.evaluate(() => scrollY);
    await page.keyboard.press("Enter");
    await expect(diagram).toHaveAttribute("data-step", "0");
    await expect(diagram).toHaveAttribute("data-playback", "playing");
    await expect(replay).toBeFocused();
    await expect(
      page.locator(`[data-subject-target="${kind}"]`),
    ).toHaveAttribute("aria-selected", "true");
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
  }
});

test("leaving the viewport or hiding the document pauses sequences without restarting completed ones", async ({
  page,
}) => {
  const diagram = page.locator('[data-diagram="programowanie"]');
  await diagram.scrollIntoViewIfNeeded();
  await diagram.getByRole("button").click();
  await expect(diagram).toHaveAttribute("data-playback", "playing");
  await expect(diagram).toHaveAttribute("data-step", "1");
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect(diagram).toHaveAttribute("data-playback", "paused");
  const paused = await diagram.getAttribute("data-step");
  // Waiting beyond a full sequence proves elapsed time does not advance offscreen.
  await page.waitForTimeout(3800);
  await expect(diagram).toHaveAttribute("data-step", paused!);
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute("data-playback", "playing");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(diagram).toHaveAttribute("data-playback", "paused");
  const hiddenStep = await diagram.getAttribute("data-step");
  await page.waitForTimeout(700);
  await expect(diagram).toHaveAttribute("data-step", hiddenStep!);
  await page.evaluate(() => {
    delete (document as unknown as { hidden?: boolean }).hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(diagram).toHaveAttribute("data-playback", "complete", {
    timeout: 6000,
  });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute("data-playback", "complete");
});

test("theory and CKE sequences finish, and reduced motion shows results immediately", async ({
  page,
}) => {
  for (const kind of ["teoria", "matura"]) {
    const diagram = page.locator(`[data-diagram="${kind}"]`);
    await diagram.scrollIntoViewIfNeeded();
    await expect(diagram).toHaveAttribute("data-playback", "complete", {
      timeout: 6000,
    });
    if (kind === "teoria") {
      await expect(
        diagram.locator(".diagram-bits .is-marked .diagram-weight"),
      ).toHaveText(["8", "2"]);
      await expect(diagram.locator(".diagram-binary-sum")).toHaveText("8+2=10");
    } else await expect(diagram.locator("li.is-marked")).toHaveCount(3);
    await diagram.getByRole("button").click();
    await expect(diagram).toHaveAttribute("data-step", "0");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const diagram of await page.locator("[data-diagram]").all()) {
    await expect(diagram).toHaveAttribute("data-playback", "complete");
    await expect(diagram.getByRole("button")).toHaveCount(0);
  }
  await expect(
    page.locator('[data-diagram="teoria"] .diagram-binary-sum'),
  ).toHaveCSS("opacity", "1");
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`the grid and diagrams fit at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const groups = page.locator("[data-subject-group]");
    if (width > 900) {
      for (const selector of [
        ".subject-art",
        ".subject-tabs",
        ".subject-panels",
      ]) {
        const boxes = await groups.locator(selector).evaluateAll((elements) =>
          elements.map((el) => {
            const r = el.getBoundingClientRect();
            return { top: r.top, height: r.height };
          }),
        );
        expect(boxes[0].top).toBeCloseTo(boxes[1].top, 0);
        expect(boxes[0].height).toBeCloseTo(boxes[1].height, 0);
      }
      const foundation = await page
        .locator(".foundation-card")
        .evaluateAll((elements) =>
          elements.map((el) => el.getBoundingClientRect().height),
        );
      expect(foundation[0]).toBeCloseTo(foundation[1], 0);
    } else {
      const boxes = await groups.evaluateAll((elements) =>
        elements.map((el) => el.getBoundingClientRect().toJSON()),
      );
      expect(boxes[1].top).toBeGreaterThanOrEqual(boxes[0].bottom);
      const gridWidth = await page.locator(".subject-foundation").evaluate(el => parseFloat(getComputedStyle(el).gridTemplateColumns));
      expect(gridWidth).toBeCloseTo(await page.locator("#zakres").evaluate(el => el.getBoundingClientRect().width), 0);
    }
    for (const diagram of await page.locator("[data-diagram]:visible").all()) {
      const box = (await diagram.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

test("all diagrams and results remain readable without JavaScript or inactive controls", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.route("https://calendar.google.com/**", (route) => route.abort());
  await page.goto("/#zakres");
  await expect(page.locator("[data-diagram]:visible")).toHaveCount(6);
  await expect(page.locator(".diagram-replay:visible")).toHaveCount(0);
  await expect(
    page.locator('[data-diagram="programowanie"] .diagram-calculation strong'),
  ).toHaveText("3");
  await expect(
    page.locator('[data-diagram="teoria"] .diagram-result'),
  ).toContainText("10₁₀");
  await expect(page.locator(".diagram-exam-steps li")).toHaveCount(3);
  await context.close();
});
