# Examples

Working reference implementations for different build setups.

## Quick Start

**New project?** Copy the Vite starter:

```bash
npx degit BubbaCoop/Valiify-Application-Component-Library/examples/vite-starter my-app
cd my-app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - you should see styled components with working icons.

## Available Examples

### [vite-starter/](vite-starter/) - Recommended

**Best for:** New projects, React/Vue/Svelte apps, any modern frontend.

- ✅ Complete working setup
- ✅ Shows all critical setup steps
- ✅ Includes interactive dropdown with minimal JavaScript
- ✅ Demonstrates icon sprite loading
- ✅ Examples of common components

**Includes:**
- Vite configuration with `@tailwindcss/vite`
- Correct CSS import structure
- Icon sprite loading
- Component examples
- Minimal dropdown behavior implementation

### [postcss-starter/](postcss-starter/)

**Best for:** PostCSS CLI users, webpack projects, minimal setups.

- ✅ PostCSS configuration
- ✅ Works without a bundler
- ✅ Shows manual build process

**Includes:**
- PostCSS config with `@tailwindcss/postcss`
- Build scripts
- Static HTML output

### [basic/](basic/)

**Best for:** Standalone HTML pages, email previews, static prototypes.

Uses the **prebuilt** entry (`dist/index.css`), not `/source`.

- ✅ No build process required
- ❌ No token utilities (`bg-approved`, etc. don't work)
- ❌ Includes Tailwind Preflight (CSS reset)

**When to use:** Only when you have no build tool at all.

## How to Choose

| You have...                     | Use...                                             |
| ------------------------------- | -------------------------------------------------- |
| Vite project                    | [vite-starter/](vite-starter/)                     |
| React/Vue/Svelte/Next.js app    | [vite-starter/](vite-starter/)                     |
| webpack project                 | [postcss-starter/](postcss-starter/) (adapt config) |
| PostCSS CLI setup               | [postcss-starter/](postcss-starter/)               |
| Plain HTML, no build            | [basic/](basic/)                                   |
| Email template or static export | [basic/](basic/)                                   |

## Testing an Example Locally

All examples reference the library via `file:../..` (the parent repo), so you can test against local changes.

**Vite starter:**

```bash
cd examples/vite-starter
npm install
npm run dev
```

**PostCSS starter:**

```bash
cd examples/postcss-starter
npm install
npm run build
npm run serve  # or open index.html directly
```

**Basic:**

```bash
# From repo root
npm run build  # Build dist/index.css first

# Then open in browser
open examples/basic/index.html
```

## What Each Example Shows

### vite-starter

- **Vite config** - `@tailwindcss/vite` plugin
- **CSS imports** - Correct order, no import from JS
- **Icon sprite** - How to load and inline
- **Setup verification** - Self-checking page for stylesheet, tokens, and
  sprite (component examples will replace it as the Short App set lands)

### postcss-starter

- **PostCSS config** - `@tailwindcss/postcss` plugin
- **Build scripts** - Manual build vs watch
- **No bundler** - Shows PostCSS CLI approach
- **Static output** - index.html links to built CSS

### basic

- **Prebuilt entry** - `dist/index.css` directly
- **No build** - Plain HTML, open in browser
- **CSS custom properties** - Uses `var(--color-*)` instead of utilities
- **Inline styles** - Since no utilities, layout uses inline styles

## Common Issues

### "npm install" fails in an example

The examples reference `@valiify/shortapp-ui` via `file:../..`, which expects the parent repo to exist. Make sure you've cloned/downloaded the full repo, not just the examples folder.

### Styles don't apply in vite-starter

1. Check `vite.config.js` has `@tailwindcss/vite` registered
2. Check `src/styles.css` imports in correct order (Tailwind first, then library)
3. Check `src/main.js` imports `./styles.css`, not the library directly

### Icons don't show

The sprite needs to load. Check:
1. `src/main.js` has the sprite loading code
2. Browser DevTools Network tab shows `sprite.svg` loaded (not 404)
3. Inspect `<body>` - you should see a hidden `<div>` with `<svg>` inside

### postcss-starter build fails

Make sure you ran `npm install` in the example directory, not just the parent repo. The example needs its own `@tailwindcss/postcss` dependency.

## Need More Help?

- [GETTING_STARTED.md](../GETTING_STARTED.md) - Complete installation guide
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Debug common issues
- [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/) - Full component markup reference

### [daisyui-starter/](daisyui-starter/) - The host-collision test

**Best for:** proving the prebuilt bundle inside shortapp-web's stack — **Tailwind 3
+ daisyUI 4**, no Tailwind 4 anywhere.

Imports `@valiify/shortapp-ui/styles.css` as a plain stylesheet. `npm run check`
renders the page in headless Chromium and asserts **computed styles**, which no
manifest-based gate can see, in two directions and over two load paths:

- **A — class-name collisions** (daisyUI's `btn` vs our `.va-btn`), fixed by the `va-` namespace.
- **B — the host's element reset** defeating our component rules: Tailwind 3
  preflight's `* { border-width: 0 }`, `button { background-color: transparent }`,
  `input, textarea { … }`. Asserted per control — button, input, select, textarea.
- Load paths: `@import` inside the host's `@tailwind` file (the host's Tailwind 3
  consumes our `@layer` blocks and emits the rules unlayered) and a raw `<link>` to
  the bundle as shipped (layers intact — where 1.0.0 loses). A lone import through
  the host PostCSS is probed: Tailwind 3 refuses it.

The layer-defeat fingerprint the check names: the focus ring survives while the
border, fill and padding do not, on the same control.

### [sveltekit-starter/](sveltekit-starter/) - The scoped-style test

**Best for:** proving the prebuilt bundle against **SvelteKit + Svelte 5** component
styles, which compile to unlayered CSS that Vite injects after the app stylesheet.

No Tailwind. `npm run check` asserts three real components against the compiled
selectors read off the served CSS: a `:global(button)` reset (the bundle must win),
a scoped `button { }` (compiles to `button.svelte-hash`, 0,1,1 — the bundle
**cannot** win; asserted as a loss so the contract's second clause stays pinned to a
measurement), and the remedy `button:not([class*="va-"])`. It also asserts the
bundle survives the library's own `reset.css`.
