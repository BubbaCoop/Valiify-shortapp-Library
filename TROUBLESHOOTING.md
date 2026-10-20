# Troubleshooting

Common issues and how to fix them.

## Styles Don't Apply At All

### Symptom
Page loads, no errors in console, but components have no styling. Buttons look like plain text, no colors, no spacing.

### Causes and Fixes

**1. Missing integration package**

You have `tailwindcss` but not `@tailwindcss/vite` (or postcss/webpack/cli).

```bash
# Check what's installed
npm list | grep tailwindcss

# Should see both:
# ├── tailwindcss@4.x.x
# └── @tailwindcss/vite@4.x.x  (or postcss/webpack)
```

**Fix:**
```bash
# For Vite
npm install @tailwindcss/vite

# For webpack
npm install @tailwindcss/webpack

# For PostCSS/Next.js
npm install @tailwindcss/postcss
```

**2. Integration not registered**

The package is installed but not added to your config.

**Fix for Vite** - check `vite.config.js`:
```js
import tailwindcss from "@tailwindcss/vite"; // ← this import
export default defineConfig({
  plugins: [tailwindcss()], // ← this plugin
});
```

**Fix for PostCSS** - check `postcss.config.js`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {}, // ← must be present
  },
};
```

**3. Importing from JavaScript**

You did `import "@valiify/shortapp-ui/source"` in a `.js` file.

**Check:** Search your codebase:
```bash
grep -r "@valiify/shortapp-ui" src/**/*.{js,ts,jsx,tsx}
```

If you find hits, **those are wrong**. The library must be imported from CSS only.

**Fix:**
```diff
- // main.js
- import "@valiify/shortapp-ui/source";

+ // styles.css
+ @import "tailwindcss";
+ @import "@valiify/shortapp-ui/source";

  // main.js
  import "./styles.css";
```

**4. Wrong import order**

Tailwind must come before the library.

**Check your CSS:**
```css
/* ❌ Wrong */
@import "@valiify/shortapp-ui/source";
@import "tailwindcss";

/* ✅ Correct */
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

**5. Stylesheet not imported**

Your CSS file exists but your JavaScript never imports it.

**Fix:**
```js
// main.js or index.js
import "./styles.css"; // ← must be present
```

## Icons Don't Show

### Symptom
You see `#icon-name` text instead of icons, or empty boxes where icons should be.

### Cause
The sprite SVG didn't load.

### Fix

**1. Verify the sprite loads**

Open DevTools Network tab and search for `sprite.svg`. If it's missing or 404:

```js
// Check the import path
import spriteUrl from "@valiify/shortapp-ui/icons/sprite.svg?url";

// Log it to see what path it resolved to
console.log("Sprite URL:", spriteUrl);
```

**2. Inline the sprite**

The sprite must be in the document:

```js
fetch(spriteUrl)
  .then((r) => r.text())
  .then((svg) => {
    const host = document.createElement("div");
    host.style.display = "none";
    host.innerHTML = svg;
    document.body.prepend(host);
  });
```

**3. Bundler-specific fixes**

**Vite:** The `?url` suffix should work. If not, try `?raw`:

```js
import spriteSvg from "@valiify/shortapp-ui/icons/sprite.svg?raw";
const host = document.createElement("div");
host.style.display = "none";
host.innerHTML = spriteSvg;
document.body.prepend(host);
```

**webpack:** Configure SVG loading:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset/source",
      },
    ],
  },
};
```

**4. Verify the sprite is in the DOM**

Open DevTools Elements and search for `<svg`. You should see a hidden div containing the sprite with all icon definitions.

## Token Utilities Don't Work

### Symptom
Classes like `bg-approved`, `text-content-secondary`, `rounded-pill` have no effect. Only works with `var(--color-approved)`.

### Cause
You're using the prebuilt `/` entry instead of `/source`.

### How to Check
```css
/* If your CSS looks like this: */
@import "@valiify/shortapp-ui"; /* ← no /source */
```

### Fix
```css
/* Change to: */
@import "@valiify/shortapp-ui/source";
```

The prebuilt entry is already compiled, so Tailwind can't generate utilities from it. Only `/source` exposes the `@theme` tokens that generate utilities.

## Components Look Broken or Partially Styled

### Symptom
Button has a background but wrong size. Input has no border. Alert has no left rail.

### Cause
Missing wrapper elements or incorrect markup structure.

### Fix

**Many components require specific nesting:**

❌ **Wrong:**
```html
<input class="va-text-field-input" />
```

✅ **Correct:**
```html
<div class="va-text-field">
  <div class="va-text-field-box">
    <input class="va-text-field-input" />
  </div>
</div>
```

**Check the component reference:**

Browse every component rendered, with copy-pasteable markup, in [Storybook](https://bubbacoop.github.io/Valiify-Application-Component-Library/). The written reference — class API, state tables and required markup structure — is [CLAUDE.md in the repo](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.3/CLAUDE.md). Every class the bundle defines is listed in `class-manifest.json`, which ships with the package.

**Quick verification:**

1. Find your component in Storybook
2. Copy the example markup exactly
3. If that works, compare it to your code to find what's missing

## Dropdown / Tabs / Modal Don't Work

### Symptom
Clicking a dropdown trigger does nothing. Tabs don't switch. Modal doesn't open.

### Cause
These components ship **zero JavaScript**. They're styled shells that require you to implement behavior.

### Fix

**Dropdowns need:**
- Click handler to toggle `aria-expanded`
- Logic to show/hide the panel
- Outside-click detection

**Minimal example:**
```js
const trigger = document.querySelector('[aria-haspopup="listbox"]');
const panel = document.querySelector(".dropdown-panel");

trigger.addEventListener("click", () => {
  const isOpen = trigger.getAttribute("aria-expanded") === "true";
  trigger.setAttribute("aria-expanded", !isOpen);
  panel.hidden = isOpen;
});
```

See `examples/vite-starter/src/main.js` for a complete working dropdown implementation.

**For modals:** Use native `<dialog>` instead:

```html
<dialog class="va-modal">
  <!-- content -->
</dialog>

<script>
  const modal = document.querySelector("dialog");
  modal.showModal(); // Browser handles backdrop, Escape, focus trap
</script>
```

## Build Errors

### "Unknown at-rule @apply"

**Cause:** PostCSS is processing the library's CSS without Tailwind context.

**Common scenario:** You imported from JavaScript instead of CSS.

**Fix:**
```diff
- // main.js
- import "@valiify/shortapp-ui/source";

+ // styles.css
+ @import "tailwindcss";
+ @import "@valiify/shortapp-ui/source";
```

### "Cannot find module '@valiify/shortapp-ui'"

**Cause:** Package not installed, or bad import path.

**Fix:**
```bash
npm install @valiify/shortapp-ui
```

**Check your import:**
```css
/* ✅ Correct */
@import "@valiify/shortapp-ui/source";
@import "@valiify/shortapp-ui"; /* also valid for prebuilt */

/* ❌ Wrong */
@import "@valiify/shortapp-ui/src/library.css";
@import "valiify-shortapp-ui/source";
```

### "postcss-cli: Error: Cannot find module @tailwindcss/postcss"

**Cause:** You're using PostCSS but didn't install the integration.

**Fix:**
```bash
npm install @tailwindcss/postcss
```

And create `postcss.config.js`:
```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Production Build Issues

### Styles work in dev but not in production

**Cause 1:** Forgot to rebuild before deploying.

**Fix:**
```bash
npm run build
```

**Cause 2:** Build output not included in deployment.

**Fix:** Verify your `dist/` folder (or equivalent) is in the deployment and your HTML links to the built CSS, not the source.

### Bundle size is huge

**Cause:** You're importing the prebuilt entry (`@valiify/shortapp-ui`) which includes all of Tailwind's base styles.

**Fix:** Use `/source` instead and let your own Tailwind build handle it:

```css
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

Also verify your production build is minifying CSS.

## Type Errors

### "Module has no exported member 'ButtonProps'"

**Cause:** This package is CSS-only with minimal TypeScript definitions.

**Fix:** Component props are not typed. Use basic HTML element types:

```tsx
// Instead of ButtonProps (doesn't exist)
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "empty";
};
```

## Contrast / Accessibility Warnings

### Symptom
axe or Lighthouse flags color contrast issues on labels, placeholders, or tertiary text.

### Cause
Known issue: `Content/Tertiary` (#727280) fails WCAG AA (4.5:1) on `Surface/Neutral` and `Surface/Frame` backgrounds. Ratios are 4.20 and 4.26 (need 4.5:1).

### Status
Designer-blocked. This is a token-level issue, not a CSS bug. Waived entries are listed in `KNOWN_ISSUES` in the repo's a11y scanner, and the consolidated list is [docs/designer-list.md](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.3/docs/designer-list.md).

### Workaround
For critical labels that must pass AA, override with a darker color:

```html
<span class="va-text-field-title" style="color: var(--color-content-secondary);">
  Required Field
</span>
```

`Content/Secondary` (#5b5b68) passes at 4.54:1 on all four surfaces.

## Still Stuck?

1. **Check the examples** - `examples/vite-starter/` and `examples/postcss-starter/` are verified working setups. If those work and yours doesn't, compare the differences.

2. **Search issues** - https://github.com/BubbaCoop/Valiify-Application-Component-Library/issues

3. **Open an issue** - Include:
   - Your build tool and versions (`npm list`)
   - Your config files (`vite.config.js`, `postcss.config.js`, etc.)
   - Your CSS import
   - What component you're trying to use
   - Whether examples work for you

4. **Check the Tailwind v4 docs** - Many issues are Tailwind v4 setup problems, not library-specific: https://tailwindcss.com/docs/v4-beta
