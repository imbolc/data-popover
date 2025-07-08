const { test } = require("@playwright/test");
const { clickAndTestPlacement } = require("./utils");

test.describe("Flip placement using default fallback", () => {
	test("data-popover: right", async ({ page }) => {
		await page.goto("http://127.0.0.1:3000/e2e/server/flip-placement.html");
		await clickAndTestPlacement(page, "#flip-right", "right");
	});

	test("Flip placement using custom fallback", async ({ page }) => {
		await page.goto("http://127.0.0.1:3000/e2e/server/flip-placement.html");
		await clickAndTestPlacement(page, "#flip-bottom-start", "bottom-start");
	});
});
