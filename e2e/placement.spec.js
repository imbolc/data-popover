const { test } = require("@playwright/test");
const { clickAndTestPlacement } = require("./utils.js");

test.beforeEach(async ({ page }) => {
	await page.goto("/e2e/server/placement.html");
});

test("data-popover: top-start", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-top-start-btn", "top-start");
});

test("data-popover: top", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-top-btn", "top");
});

test("data-popover: top-end", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-top-end-btn", "top-end");
});

test("data-popover: right-start", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-right-start-btn", "right-start");
});

test("data-popover: right", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-right-btn", "right");
});

test("data-popover: right-end", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-right-end-btn", "right-end");
});

test("data-popover: bottom-start", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-bottom-start-btn", "bottom-start");
});

test("data-popover: bottom", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-bottom-btn", "bottom");
});

test("data-popover: bottom-end", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-bottom-end-btn", "bottom-end");
});

test("data-popover: left-start", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-left-start-btn", "left-start");
});

test("data-popover: left", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-left-btn", "left");
});

test("data-popover: left-end", async ({ page }) => {
	await clickAndTestPlacement(page, "#data-left-end-btn", "left-end");
});
