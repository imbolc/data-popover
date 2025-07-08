# data-popover

A simple wrapper around the native Popover API.

Look at the [docs & demo](https://imbolc.github.io/data-popover/).

## Features

- No dependencies
- Configures via HTML attributes
- Pairs well with HTMx

## Installation

Download minimized version from the [`./dist`](./dist) folder or use CDN:

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/data-popover/dist/data-popover.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/data-popover/dist/data-popover.min.js"></script>
```

## Usage

To create a popover, add a `data-popover` attribute to a trigger element, and a
`popover` attribute to the element that will be the popover. The popover element
must be the immediate next sibling of the trigger element.

```html
<button data-popover="bottom">Click me</button>
<div popover>Popover content</div>
```

## Styling

Appearance customization is supported via CSS variables you can find at the top
of [`./data-popover.css`](./data-popover.css). Look at the
[theming](https://imbolc.github.io/data-popover/#theming) example.
