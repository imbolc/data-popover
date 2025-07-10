const { expect } = require("@playwright/test");

// Locates the popover as the immediate sibling of the trigger
function locatePopover(page, triggerSelector) {
	return page.locator(`${triggerSelector} + div[popover]`);
}

function locateTriggerAndPopover(page, triggerSelector) {
	const trigger = page.locator(triggerSelector);
	const popover = page.locator(`${triggerSelector} + div[popover]`);
	return [trigger, popover];
}

async function clickAndTestPlacement(page, triggerSelector, expectedPosition) {
	const trigger = page.locator(triggerSelector);

	await expect(
		locatePopover(page, triggerSelector),
		"Popover should not be visible initially",
	).not.toBeVisible();

	await trigger.click();
	await testPlacement(page, triggerSelector, expectedPosition);
}

// Helper function to test popover placement
async function testPlacement(page, triggerSelector, expectedPosition) {
	const [trigger, popover] = locateTriggerAndPopover(page, triggerSelector);

	await expect(
		popover,
		"Popover should be visible after clicking trigger",
	).toBeVisible();

	await page.waitForTimeout(150); // Wait for the animation to finish

	const buttonBox = await trigger.boundingBox();
	const popoverBox = await popover.boundingBox();

	expect(
		buttonBox,
		"Trigger button should be found and have a bounding box",
	).not.toBeNull();
	expect(popoverBox, "Popover should have a bounding box").not.toBeNull();

	if (buttonBox && popoverBox) {
		// Add a small tolerance for floating-point comparisons
		const tolerance = 1;

		switch (expectedPosition) {
			case "top-start":
				expect(
					popoverBox.y + popoverBox.height,
					"Popover should be above trigger",
				).toBeLessThan(buttonBox.y);
				expect(
					popoverBox.x,
					"Popover's left edge should align with trigger's left edge",
				).toBeCloseTo(buttonBox.x, tolerance);
				break;
			case "top":
				expect(
					popoverBox.y + popoverBox.height,
					"Popover should be above trigger",
				).toBeLessThan(buttonBox.y);
				expect(
					popoverBox.x + popoverBox.width / 2,
					"Popover should be centered horizontally",
				).toBeCloseTo(buttonBox.x + buttonBox.width / 2, tolerance);
				break;
			case "top-end":
				expect(
					popoverBox.y + popoverBox.height,
					"Popover should be above trigger",
				).toBeLessThan(buttonBox.y);
				expect(
					popoverBox.x + popoverBox.width,
					"Popover's right edge should align with trigger's right edge",
				).toBeCloseTo(buttonBox.x + buttonBox.width, tolerance);
				break;
			case "bottom-start":
				expect(popoverBox.y, "Popover should be below trigger").toBeGreaterThan(
					buttonBox.y + buttonBox.height,
				);
				expect(
					popoverBox.x,
					"Popover's left edge should align with trigger's left edge",
				).toBeCloseTo(buttonBox.x, tolerance);
				break;
			case "bottom":
				expect(popoverBox.y, "Popover should be below trigger").toBeGreaterThan(
					buttonBox.y + buttonBox.height,
				);
				expect(
					popoverBox.x + popoverBox.width / 2,
					"Popover should be centered horizontally",
				).toBeCloseTo(buttonBox.x + buttonBox.width / 2, tolerance);
				break;
			case "bottom-end":
				expect(popoverBox.y, "Popover should be below trigger").toBeGreaterThan(
					buttonBox.y + buttonBox.height,
				);
				expect(
					popoverBox.x + popoverBox.width,
					"Popover's right edge should align with trigger's right edge",
				).toBeCloseTo(buttonBox.x + buttonBox.width, tolerance);
				break;
			case "left-start":
				expect(
					popoverBox.x + popoverBox.width,
					"Popover should be to the left of trigger",
				).toBeLessThan(buttonBox.x);
				expect(
					popoverBox.y,
					"Popover's top edge should align with trigger's top edge",
				).toBeCloseTo(buttonBox.y, tolerance);
				break;
			case "left":
				expect(
					popoverBox.x + popoverBox.width,
					"Popover should be to the left of trigger",
				).toBeLessThan(buttonBox.x);
				expect(
					popoverBox.y + popoverBox.height / 2,
					"Popover should be centered vertically",
				).toBeCloseTo(buttonBox.y + buttonBox.height / 2, tolerance);
				break;
			case "left-end":
				expect(
					popoverBox.x + popoverBox.width,
					"Popover should be to the left of trigger",
				).toBeLessThan(buttonBox.x);
				expect(
					popoverBox.y + popoverBox.height,
					"Popover's bottom edge should align with trigger's bottom edge",
				).toBeCloseTo(buttonBox.y + buttonBox.height, tolerance);
				break;
			case "right-start":
				expect(
					popoverBox.x,
					"Popover should be to the right of trigger",
				).toBeGreaterThan(buttonBox.x + buttonBox.width);
				expect(
					popoverBox.y,
					"Popover's top edge should align with trigger's top edge",
				).toBeCloseTo(buttonBox.y, tolerance);
				break;
			case "right":
				expect(
					popoverBox.x,
					"Popover should be to the right of trigger",
				).toBeGreaterThan(buttonBox.x + buttonBox.width);
				expect(
					popoverBox.y + popoverBox.height / 2,
					"Popover should be centered vertically",
				).toBeCloseTo(buttonBox.y + buttonBox.height / 2, tolerance);
				break;
			case "right-end":
				expect(
					popoverBox.x,
					"Popover should be to the right of trigger",
				).toBeGreaterThan(buttonBox.x + buttonBox.width);
				expect(
					popoverBox.y + popoverBox.height,
					"Popover's bottom edge should align with trigger's bottom edge",
				).toBeCloseTo(buttonBox.y + buttonBox.height, tolerance);
				break;
			default:
				throw new Error(`Invalid placement: ${expectedPosition}`);
		}
	}
}

module.exports = {
	locatePopover,
	locateTriggerAndPopover,
	testPlacement,
	clickAndTestPlacement,
};
