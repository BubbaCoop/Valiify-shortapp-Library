# Getting Started with @valiify/shortapp-ui

Complete installation guide for all build setups.

> **Note**: 31 components are shipped. Figma sets still pending extraction
> include Layer field, Disclaimer container, User and Portal Specific.

### Where the component reference lives

This package ships CSS, not prose, so the full class reference is not inside
the tarball. Three places have it, in the order you will want them:

| Source | What it gives you |
| ------ | ----------------- |
| [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/) | Every component rendered, with controls and copy-pasteable markup. Start here. |
| `node_modules/@valiify/shortapp-ui/class-manifest.json` | The authoritative list of every class the bundle defines — 173 component classes and 297 utilities. Also exported as `@valiify/shortapp-ui/manifest`. |
| [CLAUDE.md in the repo](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.3/CLAUDE.md) | The written Quick Reference: class API, state tables and HTML per component. |

The 31 components: Action, Address, Avatar, Badge, BoxAction, Button,
Checkbox, DropdownField, DropdownList, Header, IconButton, ListItem, Modal,
OtpCell, OtpField, Owner, OwnerContainer, Radio, RadioField, SelectCard,
Skeleton, StatusTracker, Switch, Tabs, TextArea, TextField, TextSelector,
Toast, Tooltip, Upload, UtilityButton.

Class names in the snippets below (e.g. `.va-btn`, `.va-text-field`) are real
and current, but check one of the three sources above for the full markup
structure — several components need specific wrapper elements.

## Prerequisites

- Node.js 18+ and npm
- A project (or create one with `npm init`)
- **A bundler or build tool** - This package requires one of: Vite, webpack, PostCSS, or the Tailwind CLI

> **⚠️ IMPORTANT**: Tailwind CSS v4 requires an integration package to function. Installing only `tailwindcss` and `@valiify/shortapp-ui` will fail silently with no styles applied. You **must** install one of the integration packages listed below.

## Quick Start (Vite - Recommended)

The fastest way to get started. Use our verified starter:

```bash
# Copy the starter template
npx degit BubbaCoop/Valiify-Application-Component-Library/examples/vite-starter my-app
cd my-app

# Install dependencies
npm install

# Start dev server
npm run dev
```

That's it. Open [http://localhost:5173](http://localhost:5173) to see a working example.

## Manual Installation

### Step 1: Install Packages

**For Vite:**

```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/vite
```

**For webpack:**

```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/webpack
```

**For PostCSS (including Next.js):**

```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/postcss
```

**For Tailwind standalone CLI:**

```bash
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/cli
```

> **Why three packages?** `tailwindcss` alone doesn't process CSS in v4. You need **both** `tailwindcss` and one of the `@tailwindcss/*` integration packages for anything to work.

### Step 2: Configure Your Build Tool

Choose your build tool:

<details>
<summary><strong>Vite</strong></summary>

Create or update `vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

</details>

<details>
<summary><strong>webpack</strong></summary>

Add to your webpack config:

```js
import tailwindcss from "@tailwindcss/webpack";

export default {
  plugins: [tailwindcss()],
};
```

</details>

<details>
<summary><strong>PostCSS</strong></summary>

Create or update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

</details>

<details>
<summary><strong>Tailwind CLI</strong></summary>

No config file needed. Build with:

```bash
npx @tailwindcss/cli -i src/styles.css -o dist/styles.css --watch
```

</details>

### Step 3: Create Your Stylesheet

Create a CSS file (e.g., `src/styles.css`):

```css
/* Optional: Load fonts (or self-host for better performance) */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");

/* Required: Tailwind CSS */
@import "tailwindcss";

/* Required: Valiify Short App UI */
@import "@valiify/shortapp-ui/source";

/* Your custom styles */
```

> **⚠️ CRITICAL**: Import the library from CSS, never from JavaScript. See [Common Mistakes](#common-mistakes) below.

### Step 4: Import Your Stylesheet

In your JavaScript entry point:

```js
// main.js or index.js
import "./styles.css"; // ✅ Import YOUR stylesheet
```

**NOT like this:**

```js
import "@valiify/shortapp-ui/source"; // ❌ NEVER import the library directly
```

### Step 5: Load the Icon Sprite

Add this to your JavaScript entry:

```js
import spriteUrl from "@valiify/shortapp-ui/icons/sprite.svg?url";

fetch(spriteUrl)
  .then((r) => r.text())
  .then((svg) => {
    const host = document.createElement("div");
    host.style.display = "none";
    host.innerHTML = svg;
    document.body.prepend(host);
  });
```

> **Note**: The `?url` suffix is Vite-specific. For other bundlers, you may need to copy the file or use an equivalent loader.

### Step 6: Use Components

```html
<button class="va-btn va-btn-primary">Click me</button>

<div class="va-text-field">
  <div class="va-text-field-box">
    <input
      type="text"
      class="va-text-field-input"
      placeholder="Enter text..."
    />
  </div>
</div>

<span class="va-badge">Approved</span>
```

Badge ships with no colour variants, no sizes and no states — `src/components/badge.css`
records that as deliberate ("not modelled, not invented"), so there is no success or
dot variant to reach for.

See [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/) for complete markup examples of every component.

## Without Tailwind v4: the prebuilt bundle

If your host has no Tailwind v4 pipeline — shortapp-web is SvelteKit + Tailwind 3 +
daisyUI 4 — import the prebuilt bundle instead of `/source`, and **not**
`@valiify/shortapp-ui` (`dist/index.css`), which ships Tailwind 4's preflight and
fights your reset:

```css
/* app.css — inside the file that carries your @tailwind directives */
@import "@valiify/shortapp-ui/styles.css"; /* MUST be the first line */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

or, standalone with no host CSS at all:

```css
@import "@valiify/shortapp-ui/reset.css"; /* first — the measured floor, incl. the html default */
@import "@valiify/shortapp-ui/styles.css";
```

Import exactly one of `.`, `./index.css`, `./styles.css`. Never two.

The bundle does not render "identically" to `/source`. Its contract is narrower and
checkable, in two clauses:

1. **What it defends against.** The bundle is **unlayered** and must load **after**
   your reset. Its component rules then beat any host rule of _lower_ specificity,
   wherever that rule sits in source order: Tailwind 3 preflight (`* { border-width:
0 }`, `button { background-color: transparent }`), daisyUI's base, a
   `:global(button)` reset in a Svelte component. Version 1.0.0 did **not** hold
   this — its rules sat in `@layer components` and lost to every unlayered host rule.
   The fingerprint: a control whose focus ring survives while its border, fill and
   padding do not. Use 1.0.1 or later.
2. **What it cannot defend against.** A host rule of _higher_ specificity still wins,
   and a Svelte scoped element selector is exactly that — `button { border: 0 }` in a
   component's `<style>` compiles to `button.svelte-<hash>` (0,1,1), which outranks
   our single-class rules (0,1,0). A host that wraps its own CSS in a cascade layer
   changes the arithmetic too. **Instead:** scope element resets by class (`.plain {
}`) or exclude library controls — `button:not([class*="va-"]) { border: 0 }` —
   and never write a bare `button` / `input` / `textarea` selector inside a
   component that renders a `va-` control.

Both clauses are measured, not asserted: `examples/daisyui-starter` (Tailwind 3 +
daisyUI, three load paths) and `examples/sveltekit-starter` (scoped styles, including
clause 2 asserted as a loss) — `npm run check` in each.

## Common Mistakes

### ❌ Importing from JavaScript

**This breaks silently:**

```js
// main.js
import "@valiify/shortapp-ui/source";
```

Your dev server returns HTTP 200, the page loads, and all library styles are missing with no visible error.

**Why it fails:** Your bundler hands our stylesheet to PostCSS as its own file with no Tailwind context. Every `@apply` becomes unresolvable.

**Fix:** Import from CSS instead:

```css
/* styles.css */
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

```js
// main.js
import "./styles.css";
```

### ❌ Missing Integration Package

**This also breaks silently:**

```bash
npm install tailwindcss @valiify/shortapp-ui
```

Without `@tailwindcss/vite` (or postcss/webpack), `@import "tailwindcss"` does nothing. No error, no styles.

**Fix:** Install the integration package for your build tool (see Step 1).

### ❌ Wrong Import Order

**This fails:**

```css
@import "@valiify/shortapp-ui/source";
@import "tailwindcss";
```

Tailwind must come first. If you get "unknown at-rule" or "@apply not found" errors, check your import order.

### ❌ Using Incomplete Markup

Many components require wrapper elements:

**This looks broken:**

```html
<input class="va-text-field-input" />
```

**This works:**

```html
<div class="va-text-field">
  <div class="va-text-field-box">
    <input class="va-text-field-input" />
  </div>
</div>
```

See [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/) for the required structure of each component.

## Framework-Specific Setup

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

> **Scoped styles and library controls.** A scoped `button { }` in a component
> compiles to `button.svelte-<hash>` and outranks the library's single-class rules
> even with the prebuilt bundle. Scope resets by class or exclude library controls
> (`button:not([class*="va-"])`) — see "Without Tailwind v4" above.

### Next.js (App Router)

In `app/layout.js`:

```js
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

In `app/globals.css`:

```css
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

Create `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Components That Need JavaScript

These components ship **zero JavaScript** and require you to implement behavior:

### DropdownField / DropdownMenu

Needs:

- Click handler to toggle `aria-expanded`
- Hide/show the panel with the `hidden` attribute
- Outside-click detection to close
- Option selection handlers

**Minimal example:**

```js
const trigger = document.querySelector('[aria-haspopup="listbox"]');
const panel = document.querySelector(".dropdown-panel");

trigger.addEventListener("click", () => {
  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", !isOpen);
  panel.hidden = isOpen;
});

// Close on outside click
document.addEventListener("click", (e) => {
  if (!trigger.contains(e.target) && !panel.contains(e.target)) {
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }
});
```

See `examples/vite-starter/src/main.js` for a complete working implementation.

### Tabs

Needs:

- Click handlers on each tab
- Toggle `aria-selected` on clicked tab
- Show/hide corresponding `tabpanel`

### Modal

Either:

- Use native `<dialog>` element (recommended - browser handles everything)
- Or implement: open/close handlers, backdrop click detection, Escape key, focus trapping

**Recommended approach:**

```html
<dialog class="va-modal">
  <!-- va-modal-header, va-modal-title, va-modal-description, va-modal-actions -->
</dialog>

<script>
  const modal = document.querySelector("dialog");
  modal.showModal(); // Opens with backdrop, Escape, focus trap for free
</script>
```

### Tooltip

Needs:

- Show/hide on hover/focus
- Positioning logic (or use a library like Floating UI)

## Verification

To verify your installation is working:

1. **Styles apply** - Buttons should have colored backgrounds and rounded corners
2. **Icons render** - If you see `#icon-name` text, the sprite didn't load
3. **Token utilities work** - depends on which entry you installed:
   - `./styles.css` (the prebuilt bundle) - try `<div class="va:bg-success">`; it should have a
     green background. The `va:` prefix exists **only** in this entry.
   - `./source` - the prefix does **not** apply; your own Tailwind generates utilities
     unprefixed, so try `bg-success` on a div. A `va:`-prefixed class produces no rule here.
   - `.` / `./index.css` - these ship **no** utility layer at all; neither spelling will work.
     Component classes (`.va-btn`) still do.
4. **No console errors** - Check for 404s on sprite.svg or CSS files

## Next Steps

- Browse components in [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/), or read the written reference in [CLAUDE.md](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.3/CLAUDE.md)
- See working examples in `examples/vite-starter/` and `examples/postcss-starter/`
- Read the [README](README.md) for architecture and development info
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if you hit issues

## Still Having Issues?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed debugging steps.
