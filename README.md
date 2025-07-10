# data-popover

A simple wrapper around the native Popover API.

Look at the [docs & demo](https://imbolc.github.io/data-popover/).

## Features

- No dependencies
- Declarative configuration via HTML attributes
- Any element (not only buttons) works
  [as a trigger](https://imbolc.github.io/data-popover/#trigge-element)
- [Placement preferences](https://imbolc.github.io/data-popover/#placement) with
  [auto flipping](https://imbolc.github.io/data-popover/#flipping)
- [Pairs well with HTMx](https://imbolc.github.io/data-popover/#htmx)
- [Supports hover event](https://imbolc.github.io/data-popover/#hover)
- [Appearance customization](https://imbolc.github.io/data-popover/#styling)
- [Nested Popovers](https://imbolc.github.io/data-popover/#nested)

## Installation

Download the minimized version from the [`./dist`](./dist) folder or use CDN:

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/data-popover/dist/data-popover.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/data-popover/dist/data-popover.min.js"></script>
```

## Usage

1. Add a `data-popover` attribute to a trigger element.
2. Place a popover element with the native `popover` attribute immediately after
   the trigger.

```html
<button data-popover>Click me</button>
<div popover>Popover content</div>
```
