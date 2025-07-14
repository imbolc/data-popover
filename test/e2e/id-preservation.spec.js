import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/test/e2e/server/id-preservation.html");
});

test("should generate a new ID for a popover without one", async ({ page }) => {
	await page.click("#no-id-btn");
	const popover = await page.locator("div[popover]").first();
	await expect(popover).toHaveAttribute("id", "data-popover-1");
});

test("should preserve the existing ID of a popover", async ({ page }) => {
	await page.click("#predefined-id-btn");
	const popover = await page.locator("#my-id");
	await expect(popover).toBeVisible();
});
