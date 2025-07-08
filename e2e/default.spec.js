const { test, expect } = require("@playwright/test");
const {
	clickAndTestPlacement,
	locateTriggerAndPopover,
} = require("./utils.js");

async function testTrigger(page, triggerSelector) {
	const [trigger, popover] = locateTriggerAndPopover(page, triggerSelector);
	await expect(popover).not.toBeVisible();
	await clickAndTestPlacement(page, triggerSelector, "bottom");

	await page.keyboard.press("Escape");
	await expect(popover, "should be closed by pressing Esc").not.toBeVisible();

	await trigger.click();
	await expect(popover, "should be opened a second time").toBeVisible();

	await trigger.click();
	await expect(
		popover,
		"should be closed by clicking the target a second time",
	).not.toBeVisible();

	await trigger.click();
	await expect(popover, "should be opened a third time").toBeVisible();

	await page.locator("body").click();
	await page.waitForTimeout(150); // Wait for the animation to finish
	await expect(
		popover,
		"should be closed by clicking the body",
	).not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
	await page.goto("/e2e/server/default.html");
});

test("for buttons browsers toggle visibility natively", async ({ page }) => {
	await testTrigger(page, "button[data-popover]");
});

test("for links we toggle visibility manually", async ({ page }) => {
	await testTrigger(page, "a[data-popover]");
});
