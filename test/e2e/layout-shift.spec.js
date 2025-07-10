const { test, expect } = require("@playwright/test");

const {
	locatePopover,
	testPlacement,
	clickAndTestPlacement,
} = require("./utils.js");

test("should reposition the popover when the trigger is moved", async ({
	page,
}) => {
	await page.goto("/test/e2e/server/default.html");

	const triggerSelector = "button[data-popover]";
	const popover = locatePopover(page, triggerSelector);

	await expect(popover).not.toBeVisible();
	await clickAndTestPlacement(page, triggerSelector, "bottom");
	await expect(popover).toBeVisible();

	await page.evaluate(() => {
		const trigger = document.querySelector("[data-popover]");
		trigger.style.marginTop = "100px";
	});

	await page.waitForTimeout(200);
	await testPlacement(page, triggerSelector, "bottom");
});
