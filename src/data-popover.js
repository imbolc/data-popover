((window) => {
	// Detects touch-first devices by checking for a coarse primary input mechanism (pointer: coarse).
	// This is more reliable than user agent sniffing or `ontouchstart`.
	function isTouchDevice() {
		return window.matchMedia?.("(pointer: coarse)").matches;
	}

	function throttle(func, delay) {
		let lastCall = 0;
		let timeout = null;
		return function (...args) {
			const now = Date.now();
			const remaining = delay - (now - lastCall);

			if (remaining <= 0) {
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				lastCall = now;
				func.apply(this, args);
			} else if (!timeout) {
				timeout = setTimeout(() => {
					lastCall = Date.now();
					timeout = null;
					func.apply(this, args);
				}, remaining);
			}
		};
	}

	function debounce(func, delay) {
		let timeout;
		return function (...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), delay);
		};
	}

	const instances = new WeakMap();
	let popoverIdCounter = 0;

	class Popover {
		constructor(triggerEl) {
			this.popoverShown = false;
			this.triggerEl = triggerEl;
			this.popoverEl = triggerEl.nextElementSibling;

			if (!this.popoverEl || !this.popoverEl.hasAttribute("popover")) {
				console.error(
					"Popover trigger has no adjacent popover element.",
					triggerEl,
				);
				return;
			}

			this.placement = this.triggerEl.dataset.popover || "bottom";

			this.placementFallback = this.triggerEl.dataset.popoverPlacementFallback
				? decodePlacementFallback(
						this.triggerEl.dataset.popoverPlacementFallback,
					)
				: defaultPlacementFallback(this.placement);

			this.trigger = this.triggerEl.dataset.popoverTrigger || "click";

			if (this.trigger === "hover" && isTouchDevice()) {
				// Fall back to click behavior on touch devices
				this.trigger = "click";
			}

			this.hoverDelay = Number.parseInt(
				this.triggerEl.dataset.popoverHoverDelay || "150",
			);

			this.hoverOutDelay = Number.parseInt(
				this.triggerEl.dataset.popoverHoverOutDelay || "150",
			);

			this.offset = this.getDefaultOffset();
			this.hoverTimeout = null;
			this.triggerHovered = false;
			this.popoverHovered = false;

			if (!this.popoverEl.id) {
				this.popoverEl.id = `data-popover-${++popoverIdCounter}`;
			}

			if (this.trigger !== "hover") {
				this.triggerEl.setAttribute("popovertarget", this.popoverEl.id);
			}

			this.popoverEl.addEventListener("toggle", (e) => {
				this.popoverShown = e.newState === "open";
				if (this.popoverShown) {
					this.positionPopover();
					this.popoverEl.dispatchEvent(new CustomEvent("data-popover:show"));
					this.popoverEl.addEventListener(
						"animationend",
						() => {
							this.popoverEl.dataset.popoverAnimated = "true";
						},
						{ once: true },
					);
				} else {
					delete this.popoverEl.dataset.popoverAnimated;
				}
			});

			if (this.trigger === "hover") {
				this.setupHoverHandlers();
			}

			const observer = new ResizeObserver(() => {
				if (this.popoverEl.matches(":popover-open")) {
					this.positionPopover();
				}
			});
			observer.observe(this.popoverEl);

			instances.set(triggerEl, this);
		}

		setupHoverHandlers() {
			this.triggerEl.addEventListener("mouseenter", () => {
				this.triggerHovered = true;
				clearTimeout(this.hoverTimeout);

				if (!this.popoverEl.matches(":popover-open")) {
					this.hoverTimeout = setTimeout(() => {
						if (this.triggerHovered || this.popoverHovered) {
							this.popoverEl.showPopover();
						}
					}, this.hoverDelay);
				}
			});

			this.triggerEl.addEventListener("mouseleave", () => {
				this.triggerHovered = false;
				this.scheduleHide();
			});

			this.popoverEl.addEventListener("mouseenter", () => {
				this.popoverHovered = true;
				clearTimeout(this.hoverTimeout);
			});

			this.popoverEl.addEventListener("mouseleave", () => {
				this.popoverHovered = false;
				this.scheduleHide();
			});
		}

		scheduleHide() {
			clearTimeout(this.hoverTimeout);

			this.hoverTimeout = setTimeout(() => {
				if (!this.triggerHovered && !this.popoverHovered) {
					this.popoverEl.hidePopover();
				}
			}, this.hoverOutDelay);
		}

		getDefaultOffset() {
			const style = getComputedStyle(this.popoverEl);
			return (
				Number.parseFloat(
					style.getPropertyValue("--data-popover-arrow-width"),
				) || 8
			);
		}

		// Calculates popover coordinates for a given placement
		calculateCoords(placement, btnRect, popRect) {
			let left;
			let top;

			switch (placement) {
				case "right":
					left = btnRect.right + this.offset;
					top = btnRect.top + btnRect.height / 2 - popRect.height / 2;
					break;
				case "right-start":
					left = btnRect.right + this.offset;
					top = btnRect.top;
					break;
				case "right-end":
					left = btnRect.right + this.offset;
					top = btnRect.bottom - popRect.height;
					break;
				case "left":
					left = btnRect.left - popRect.width - this.offset;
					top = btnRect.top + btnRect.height / 2 - popRect.height / 2;
					break;
				case "left-start":
					left = btnRect.left - popRect.width - this.offset;
					top = btnRect.top;
					break;
				case "left-end":
					left = btnRect.left - popRect.width - this.offset;
					top = btnRect.bottom - popRect.height;
					break;
				case "top":
					left = btnRect.left + btnRect.width / 2 - popRect.width / 2;
					top = btnRect.top - popRect.height - this.offset;
					break;
				case "top-start":
					left = btnRect.left;
					top = btnRect.top - popRect.height - this.offset;
					break;
				case "top-end":
					left = btnRect.right - popRect.width;
					top = btnRect.top - popRect.height - this.offset;
					break;
				case "bottom-start":
					left = btnRect.left;
					top = btnRect.bottom + this.offset;
					break;
				case "bottom-end":
					left = btnRect.right - popRect.width;
					top = btnRect.bottom + this.offset;
					break;
				default:
					if (placement !== "bottom") {
						console.error(`Invalid popover placement: "${placement}"`);
					}
					left = btnRect.left + btnRect.width / 2 - popRect.width / 2;
					top = btnRect.bottom + this.offset;
					break;
			}

			return { left, top };
		}

		// Checks if the popover is out of the viewport
		isOutOfBounds(popRect) {
			return (
				popRect.top < 0 ||
				popRect.left < 0 ||
				popRect.bottom > window.innerHeight ||
				popRect.right > window.innerWidth
			);
		}

		positionPopover() {
			requestAnimationFrame(() => {
				const btnRect = this.triggerEl.getBoundingClientRect();
				const popRect = this.popoverEl.getBoundingClientRect();

				// Find the best placement for the popover
				const placements = [this.placement, ...this.placementFallback];
				let bestPlacement = this.placement;

				for (const placement of placements) {
					const coords = this.calculateCoords(placement, btnRect, popRect);
					const hypotheticalPopRect = {
						top: coords.top,
						left: coords.left,
						bottom: coords.top + popRect.height,
						right: coords.left + popRect.width,
					};

					if (!this.isOutOfBounds(hypotheticalPopRect)) {
						bestPlacement = placement;
						break;
					}
				}

				let { left, top } = this.calculateCoords(
					bestPlacement,
					btnRect,
					popRect,
				);

				// Add scroll offsets to convert from viewport to page coordinates
				left += window.scrollX;
				top += window.scrollY;

				const leftChanged =
					Math.round(Number.parseFloat(this.popoverEl.style.left)) !==
					Math.round(left);
				const topChanged =
					Math.round(Number.parseFloat(this.popoverEl.style.top)) !==
					Math.round(top);

				if (leftChanged) {
					this.popoverEl.style.left = `${left}px`;
				}
				if (topChanged) {
					this.popoverEl.style.top = `${top}px`;
				}

				if (leftChanged || topChanged) {
					const newPlacement = shortPlacementName(bestPlacement);
					if (this.popoverEl.dataset.popoverLoc !== newPlacement) {
						this.popoverEl.dataset.popoverLoc = newPlacement;
					}
				}
			});
		}
	}

	document.addEventListener("click", (e) => {
		const trigger = e.target.closest?.("[data-popover]");
		if (!trigger) return;

		if (trigger.dataset.popoverTrigger === "hover" && !isTouchDevice()) {
			// The popover on this device is triggered on hover
			return;
		}

		instances.has(trigger) || new Popover(trigger);

		const tag = trigger.tagName.toUpperCase();
		const isNativeTrigger =
			tag === "BUTTON" ||
			(tag === "INPUT" &&
				trigger.type &&
				trigger.type.toLowerCase() === "button");

		// Natively popovers can only be triggered by buttons, for everything else we have to toggle them manually
		if (!isNativeTrigger) {
			trigger.hasAttribute("href") && e.preventDefault();

			const instance = instances.get(trigger);

			// For some reason `togglePopover` doesn't work here, so we have to manage the popover state manually
			if (instance.popoverShown) {
				instance.popoverEl.hidePopover();
			} else {
				instance.popoverEl.showPopover();
			}
		}
	});

	document.addEventListener("mouseover", (e) => {
		const trigger = e.target.closest?.("[data-popover]");
		if (trigger && !instances.has(trigger)) {
			// Only initialize hover triggers on non-touch devices
			if (trigger.dataset.popoverTrigger === "hover" && !isTouchDevice()) {
				new Popover(trigger);
			}
		}
	});

	/// Ensures all opened popovers are correctly positioned
	function ensureAllPositions() {
		for (const popoverEl of document.querySelectorAll(
			"[popover]:popover-open",
		)) {
			const triggerEl = popoverEl.previousElementSibling;
			if (triggerEl) {
				const instance = instances.get(triggerEl);
				if (instance) {
					instance.positionPopover();
				}
			}
		}
	}

	window.addEventListener("scroll", throttle(ensureAllPositions, 15));
	window.addEventListener("resize", debounce(ensureAllPositions, 15));

	document.addEventListener("DOMContentLoaded", () => {
		// We have to observe layout shifts to reposition opened popovers
		new MutationObserver(debounce(ensureAllPositions, 15)).observe(
			document.body,
			{
				childList: true,
				subtree: true,
				attributes: true,
			},
		);
	});

	const DEFAULT_PLACEMENT_FALLBACK = {
		t: "b r l",
		b: "t r l",
		l: "r t b",
		r: "l t b",
		ts: "te bs be rs ls",
		te: "ts be bs re le",
		bs: "be ts te rs ls",
		be: "bs te ts re le",
		ls: "le rs re ts bs",
		le: "ls re rs te be",
		rs: "re ls le ts bs",
		re: "rs le ls te be",
	};

	function defaultPlacementFallback(longName) {
		return decodePlacementFallback(
			DEFAULT_PLACEMENT_FALLBACK[shortPlacementName(longName)],
		);
	}

	window.d = defaultPlacementFallback;

	function shortPlacementName(longName) {
		const parts = longName.split("-");
		let shortName = parts[0].charAt(0);

		if (parts.length === 2) {
			shortName += parts[1].charAt(0);
		}
		if (!(shortName in DEFAULT_PLACEMENT_FALLBACK)) {
			throw new Error(`Invalid placement name: "${longName}"`);
		}
		return shortName;
	}

	function decodePlacementFallback(fallback) {
		try {
			return fallback
				.split(" ")
				.map((shortName) => longPlacementName(shortName));
		} catch (e) {
			throw new Error(`Failed to decode placement fallback: "${fallback}"`, {
				cause: e,
			});
		}
	}

	function longPlacementName(shortName) {
		if (!(shortName in DEFAULT_PLACEMENT_FALLBACK)) {
			throw new Error(`Invalid short placement name: "${shortName}"`);
		}

		const side = { t: "top", b: "bottom", l: "left", r: "right" }[
			shortName.charAt(0)
		];
		if (shortName.length === 1) {
			return side;
		}

		const align = { s: "start", e: "end" }[shortName.charAt(1)];
		return `${side}-${align}`;
	}
})(window);
