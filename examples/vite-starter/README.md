# Valiify Short App UI - Vite Starter

A minimal working example of `@valiify/shortapp-ui` with Vite.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to see the result.

> **Note:** If you copied this example from the GitHub repo, the `package.json` may reference `"file:../.."`. When installing from npm, this is automatically fixed to use the published version. If you see installation errors, check that the dependency is set to a version number like `"^0.1.0-alpha.2"`.

## What This Example Shows

1. **Correct installation** - How to install the required packages
2. **Vite configuration** - The `@tailwindcss/vite` plugin is required
3. **CSS imports** - Import the library from CSS, never from JavaScript
4. **Icon sprite loading** - How to load and inline the icon sprite
5. **Setup verification** - A self-checking page confirming the stylesheet,
   tokens, and icon sprite all load (component examples will replace this as
   the Short App set is extracted from Figma)

## Key Files

- `vite.config.js` - Vite configuration with Tailwind plugin
- `src/styles.css` - Stylesheet with correct import order
- `src/main.js` - JavaScript entry point (imports CSS, loads sprite)
- `package.json` - Required dependencies

## Important Notes

### Import from CSS, Not JavaScript

❌ **Don't do this:**
```js
// main.js
import "@valiify/shortapp-ui/source";
```

✅ **Do this:**
```css
/* styles.css */
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

```js
// main.js
import "./styles.css";
```

### Components That Need JavaScript

These components ship no JavaScript and require you to implement behavior:

- **DropdownField** - Needs click handler, aria-expanded toggle, outside-click detection
- **DropdownMenu** - Same as DropdownField
- **Tabs** - Needs tab switching and aria-selected management
- **Modal** - Needs open/close handlers (or use native `<dialog>`)
- **Tooltip** - Needs positioning and show/hide logic

See `src/main.js` for a minimal dropdown implementation.

## Adapting for Your Framework

### React
```jsx
// App.jsx
import "./styles.css";

function App() {
  return <button className="va-btn va-btn-primary">Click me</button>;
}
```

### Vue
```vue
<script setup>
import "./styles.css";
</script>

<template>
  <button class="va-btn va-btn-primary">Click me</button>
</template>
```

### Svelte
```svelte
<script>
  import "./styles.css";
</script>

<button class="va-btn va-btn-primary">Click me</button>
```

## Troubleshooting

### Styles don't apply
- Make sure `@tailwindcss/vite` is installed and registered in `vite.config.js`
- Verify you're importing from CSS, not JavaScript
- Check that `@import "tailwindcss"` comes before `@import "@valiify/shortapp-ui/source"`

### Icons don't show
- Make sure the sprite is loaded and inlined (see `src/main.js`)
- Check the browser console for fetch errors
- Verify sprite.svg path is correct for your bundler

### Components look broken
- Check that you're using the full markup structure (see Storybook, or CLAUDE.md in the repo)
- Many components need wrapper elements (e.g., `.va-text-field` > `.va-text-field-box` > `.va-text-field-input`)
- Verify you're using the correct variant/size classes

## Learn More

- [Package README](../../README.md) - Installation and configuration
- [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/) - Every component rendered, with markup
- [CLAUDE.md](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.3/CLAUDE.md) - Complete component reference with full markup
- [Component process](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.3/docs/component-process.md) - How components are built
