import { test as base, expect } from '@playwright/test';
/** Existing demonstration tests exercise the full presentation after its disclosure is opened. */
export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = async (...args: Parameters<typeof page.goto>) => {
      const response = await goto(...args);
      if (new URL(page.url()).pathname === '/') {
        await page.locator('details.home-disclosure').evaluateAll(nodes => nodes.forEach(node => (node as HTMLDetailsElement).open = true));
        const hash = new URL(page.url()).hash;
        if (hash) await page.evaluate(hash => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({block:'start',behavior:'instant'}), hash);
      }
      return response;
    };
    await use(page);
  },
});
export { expect };
