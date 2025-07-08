## Project goal

It's a simple JS popover library called DataPopover

- The library doesn't depend on any CSS or JS frameworks
- It plays well with HTMx

## Project rules

### Structure

- All the library JS code is in `./data-popover.js`
- All the library CSS code is in `./data-popover.css`
- Tests are in `./e2e/`, test's config is in `./e2e/playwright.config.js`
- Minimized code is in `./dist`, don't look into it nor change it's content
- Don't edit `./package-lock.json` as it's generated automatically

### JS rules

- Prefer `for...of` instead of `forEach` in JS code
- `Popover` class must use JIT initialization in event handlers
- Before writing tests, look at how other tests in `./e2e` folders are written
  and stick to the style. Especially look at `./e2e/utils.js` and use helpers if
  they fit.

### CSS rules

- Use nesting as much as possible

### Configuration

- When configuring tools, try to create as little separate configs as possible,
  use `package.json` for configuration if a tool allows it

### Coding tasks

- Run `npm run format` and `npm run lint` after you done with a task
- If you finished a task involving changing JS, CSS, content of `./e2e` folder
  or anything else related to tests, run `npm run test`

## Common rules

- Perform a top 0.1% programmer
- Ask me clarifying questions until you're 95% confident you can complete the
  task successfully
- If at any step you think you're going in circles - stop and let me know
- Comment every change you make
- In comments and any other texts strive for clarity and conciseness
- Don't add comments to the existing code if not explicitly asked
- Don't ask about committing the changes you've made
- Always ask if you want to read / change anything outside of the project folder
  (the folder you're run in)
