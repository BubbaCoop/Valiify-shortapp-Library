# @valiify/shortapp-ui

A Tailwind CSS component library for the Valiify Short App — the online
application where applicants apply for accounts.

CSS-only, framework-agnostic, zero JavaScript dependencies. Components are
extracted from the Short App Figma component library and verified against it
with an automated visual harness.

> **Status: v1.4.2 on npm — 31 components**, extracted from the Short App
> Figma file and verified against it: 741 computed-style assertions,
> axe-core clean across every story, token-pinned control heights
> (`--height-*`), drawn disabled/focus/loading states, and WCAG 2.5.8
> tap-target overlays. The complete design-token set (59 colors, 24 text
> styles, the Height scale, effects) ships as Tailwind v4 `@theme` tokens.
> Browse every component in the deployed Storybook:
> https://bubbacoop.github.io/Valiify-Application-Component-Library/

## ⚠️ Important: Read This First

**This package requires a build tool.** Installing
`npm install @valiify/shortapp-ui tailwindcss` is not enough. You also need:

- **Vite:** `@tailwindcss/vite`
- **webpack:** `@tailwindcss/webpack`
- **PostCSS/Next.js:** `@tailwindcss/postcss`
- **No bundler:** `@tailwindcss/cli`

**Without one of these packages, nothing will work.** No errors, no styles.
See [Installation](#installation) below.

## Installation

### No build step? Use `./styles.css`

```html
<link rel="stylesheet" href="node_modules/@valiify/shortapp-ui/src/reset.css" />
<link rel="stylesheet" href="node_modules/@valiify/shortapp-ui/dist/shortapp-ui.css" />
```

```bash
npm install @valiify/shortapp-ui     # that is the whole install — no Tailwind
```

`./styles.css` is component classes + tokens + a `va:`-prefixed utility layer,
prebuilt and **unlayered**. Your app never compiles our classes, so **your Tailwind
version does not matter** — including no Tailwind at all, or Tailwind v3 alongside
daisyUI. It does not render "identically" to `./source`; its contract is narrower
and checkable, in two clauses:

1. **What it defends against.** Load it after your reset and its component rules
   beat any host rule of *lower* specificity wherever that rule sits in source
   order — Tailwind 3 preflight, daisyUI's base, a `:global(button)` reset in a
   Svelte component. (1.0.0 did not hold this: its rules sat in `@layer
   components` and lost to every unlayered host rule. The fingerprint was a
   control whose focus ring survived while its border, fill and padding did not.)
2. **What it cannot defend against.** A host rule of *higher* specificity still
   wins. A Svelte scoped `button { border: 0 }` compiles to `button.svelte-hash`
   (0,1,1) and beats our single-class rules (0,1,0). A host that wraps its own CSS
   in a cascade layer changes the arithmetic too. Scope element resets by class, or
   exclude library controls: `button:not([class*="va-"]) { border: 0 }`.

Both clauses are measured in `examples/daisyui-starter` and
`examples/sveltekit-starter` (`npm run check`).

Three more things to know before using it:

1. **The entries are alternatives, never companions.** Import exactly one of `.`,
   `./index.css`, `./styles.css`. Importing `.` *and* `./styles.css` brings
   preflight back and defines every component rule twice.
2. **Import `./reset.css` first when it is the only stylesheet on the page.**
   `./styles.css` ships no preflight on purpose, so it cannot fight a host's reset
   — but standalone that means no `box-sizing: border-box`, and every fixed
   dimension renders larger than designed (`.va-owner-container` measures 124.5px
   instead of 92.5px). `./reset.css` is five measured rules, not preflight — since
   1.0.1 it also carries the `html` ink/ground default. Skip it inside an app that
   already resets.
3. **The utility layer is a closed set — and so are its variants.** Only the 281
   utilities the design methodology uses are shipped: each base plus its **`md:`
   form only**. `va:mt-7` is not one. Neither is `va:lg:py-12`, `va:sm:gap-4` or
   `va:hover:bg-primary`. They produce **no rule at all** — no error, no warning,
   no style.

   - **Add a utility:** use it in the methodology, then
     `npm run build:utility-surface && npm run build`, and commit the regenerated
     `src/utility-surface.css`.
   - **Add a variant:** extend `RESPONSIVE` in [scripts/build-utility-surface.mjs](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.2/scripts/build-utility-surface.mjs)
     in the repository and rebuild. Each one multiplies the surface by the number of bases.
   - **Or skip the whole trade-off:** use `./source` with your own Tailwind v4 and
     get the full scale, compiled by your build.

   `npm run verify:markup` fails on any class in generated markup with no rule in
   the bundle — it is how `va:md:*` was found missing. It cannot see a page edited
   by hand outside the repo; there the symptom is an element that looks unstyled.

### Step 1: Install Packages

*(The rest of this section is the `./source` path — for consumers on Tailwind v4
who want our `@theme` processed by their own build.)*

Choose based on your build tool:

```bash
# Vite (recommended)
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/vite

# webpack
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/webpack

# PostCSS / Next.js
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/postcss

# Tailwind CLI (no bundler)
npm install @valiify/shortapp-ui tailwindcss @tailwindcss/cli
```

> ⚠️ **You need THREE packages, not two.** `tailwindcss` alone doesn't process
> CSS in v4. Missing the integration package (the third one above) causes
> silent failure.

### Step 2: Configure Your Build Tool

**Vite** - create/update `vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

**PostCSS** - create/update `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### Step 3: Create Your Stylesheet

```css
/* Optional fonts — must be the FIRST line if used */
@import "@valiify/shortapp-ui/fonts";

@import "tailwindcss";

/* prebuilt: component classes + tokens as custom properties */
@import "@valiify/shortapp-ui";

/* OR source: the above plus token-generated utilities */
/* @import "@valiify/shortapp-ui/source"; */
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for the complete setup guide and
[TROUBLESHOOTING.md](TROUBLESHOOTING.md) when something doesn't render.

## Components

31 components, each documented in [the repo's CLAUDE.md Quick Reference](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.2/CLAUDE.md)
with class API, state tables, and copy-pasteable HTML:

- **Controls** — Button (Standard: Primary/Secondary/Micro/Bubble),
  UtilityButton (Empty/Filled/Rounded/Text), IconButton, Radio, Checkbox,
  Switch, Tabs, TextSelector
- **Fields** — TextField, DropdownField, TextArea, RadioField
- **Selection & lists** — SelectCard, BoxAction, ListItem (`.va-list-option`),
  DropdownList, Action
- **Feedback & overlays** — Modal (native `<dialog>`-first), Toast, Tooltip,
  Skeleton, StatusTracker
- **Identity & structure** — Avatar, Badge, Owner, OwnerContainer, Header

Quick taste:

```html
<button class="va-btn va-btn-primary">Continue</button>

<div class="va-text-field">
  <div class="va-text-field-title-row">
    <label class="va-text-field-title" for="name">First name</label>
  </div>
  <div class="va-text-field-box">
    <input id="name" class="va-text-field-input" type="text" placeholder="Jane" />
  </div>
</div>
```

## Development

```bash
npm install
npm run storybook        # component workbench at localhost:6006
npm run build            # tokens -> theme -> dist/index.css
npm run new:component X  # scaffold a new component
npm run verify:visual    # assert computed styles against Figma values
npm run verify:a11y      # axe-core over every story
npm run audit            # coverage across the library
```

The component development process is documented in
[docs/component-process.md](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.2/docs/component-process.md) in the repository.

## Development Status

**Current Phase**: Released — maintenance and Figma-sync; 31 components on npm

Completed:

- ✅ Complete design-token extraction (58 colors, 8 radii, 13 spacing steps,
  24 text styles, 2 effects — full Figma Plugin-API enumeration)
- ✅ 31 components with visual specs (741 assertions), a11y scans, and
  static/bundle gates — all running in CI
- ✅ Published to npm as `@valiify/shortapp-ui`
- ✅ Chromatic visual regression in CI; tag-driven release workflow with
  npm provenance and a real-consumer packaging smoke test

Next steps:

- ⏳ Remaining Figma sets include Layer field, Disclaimer container, User
  and Portal Specific
- ⏳ Storybook deployment

## Architecture

- **CSS-only** — zero JavaScript dependencies, no Tailwind plugin, no `tailwind.config.js`
- **Tailwind v4 `@theme`** — tokens generate utilities automatically
- **Framework-agnostic** — works with React, Vue, Svelte, vanilla HTML
- **Verified** — every component carries a visual spec asserted against Figma

## Releasing

Releases are tag-driven. After merging to a green main:

1. Cut the CHANGELOG: retitle `[Unreleased]` to the new version + date; commit.
2. `npm version patch` (or `minor`) — bumps package.json and creates the tag.
3. `npm publish` — the browser 2FA prompt makes this a local step.
4. `git push origin main --follow-tags`, then `npm run restore-examples`.

Publishing is done **locally** (`npm publish`, with the browser 2FA prompt);
the tag push triggers the Release workflow as a verification gate — it
re-runs the fast gates plus the packaging smoke test (`npm run
verify:package` — the real tarball in a real Vite consumer build, both
entry points). CI publishing can be enabled later via npm Trusted
Publishing; see the notes in [.github/workflows/release.yml](https://github.com/BubbaCoop/Valiify-Application-Component-Library/blob/v1.4.2/.github/workflows/release.yml).

## Links

- **npm**: https://www.npmjs.com/package/@valiify/shortapp-ui
- **Repository**: https://github.com/BubbaCoop/Valiify-Application-Component-Library
- **Dashboard library (predecessor)**: https://github.com/BubbaCoop/Valiify-dashboard-ui

## License

MIT © Valiify
