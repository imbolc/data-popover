# data-popover

A lightweight wrapper around the native Popover API.

- No dependencies
- Declarative configuration via HTML attributes
- Pairs well with HTMx

Check out the [docs & demo](https://imbolc.github.io/data-popover/).

## Installation

Download the minified version from the [`./dist`](./dist) folder or use a CDN:

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
