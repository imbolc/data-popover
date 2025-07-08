const { test, expect } = require("@playwright/test");
const { locateTriggerAndPopover } = require("./utils.js");

async function testHoverTrigger(page, triggerSelector) {
	const [trigger, popover] = locateTriggerAndPopover(page, triggerSelector);

	// Priming sequence to ensure Popover JIT initialization
	await trigger.hover();
	await page.waitForTimeout(150); // Wait for hoverDelay
	await page.locator("h1").hover();
	await page.waitForTimeout(150); // Wait for hoverOutDelay
	await expect(popover).not.toBeVisible();

	// Actual hover test
	await trigger.hover();
	await page.waitForTimeout(150); // Wait for hoverDelay
	await expect(popover, "should be visible on hover").toBeVisible();

	await page.locator("h1").hover();
	await page.waitForTimeout(150); // Wait for hoverOutDelay
	await expect(popover, "should be closed on hover out").not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
	await page.goto("/e2e/server/default-hover.html");
});

test("button", async ({ page }) => {
	await testHoverTrigger(page, "button[data-popover]");
});

test("link", async ({ page }) => {
	await testHoverTrigger(page, "a[data-popover]");
});
