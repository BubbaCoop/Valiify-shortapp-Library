# Changelog

All notable changes to `@valiify/shortapp-ui` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Token names are public API — renaming or removing one is a breaking change.

> Entries below name paths inside the
> [repository](https://github.com/BubbaCoop/Valiify-Application-Component-Library)
> — `scripts/`, `docs/`, `val/`, `CLAUDE.md` and so on. Those are maintainer
> material and deliberately do not ship in the npm package; the history is
> kept verbatim rather than rewritten. Nothing in the package depends on them.

## [1.4.2] - 2026-10-20

Documentation only — no CSS, token, class or export changes.

### Fixed

- **Shipped docs no longer point at files that are not in the package.**
  `GETTING_STARTED.md` told consumers to "see the Quick Reference in
  CLAUDE.md" and linked it relatively, but CLAUDE.md is maintainer material
  excluded by `files` — so for anyone installing from npm the link was dead
  and the component reference unreachable. It now names three places that
  actually exist for a consumer: the deployed Storybook, the shipped
  `class-manifest.json`, and CLAUDE.md's GitHub URL. The same treatment is
  applied in `README.md`, `TROUBLESHOOTING.md`, `examples/README.md`,
  `examples/vite-starter/README.md` and `src/components/ICON-SYSTEM.md`.
- **Four links to a COMPONENTS.md and one to an accessibility-audit doc
  removed** — neither file has ever existed in this repository, so these were
  broken for maintainers too, not just for consumers. They now point at
  Storybook and the designer list respectively.
- **Stale counts corrected.** `GETTING_STARTED.md` said 21 components and
  `README.md` said 27 in two places; the library has shipped 31 since 1.4.0.
  The visual-spec assertion count moves 603 → 741, the "remaining Figma sets"
  list drops Address Super entry and Confirmation Modal (both shipped), and
  README's status line no longer reads "Component build-out".

### Added

- **`npm run verify:doc-paths`** — a gate that fails when a doc inside the
  tarball links to a file that is not in the tarball, or references one that
  does not exist in the repository at all. It takes the shipped file list from
  `npm pack --dry-run --json`, so it cannot drift from the `files` field, and
  it carries a canary self-test. Bare prose mentions of real repository paths
  stay legal and are reported in yellow: docs legitimately discuss the repo,
  and this changelog is a historical record rather than something to rewrite.
  Runs in CI alongside `verify:vocabulary`.
- **A note at the top of this changelog** stating that entries name repository
  paths which deliberately do not ship.

## [1.4.1] - 2026-10-15

### Changed

- **Tarball slimmed**: `CLAUDE.md` and `design-methodology/` no longer ship
  in the npm package (they are maintainer/pipeline material; README,
  GETTING_STARTED, TROUBLESHOOTING, CHANGELOG and LICENSE stay). Build inputs
  are unaffected — both remain in the repo and keep driving the utility
  surface and the gates.
- `postpack` now restores the examples' `file:../..` dependency after every
  pack (via the existing `restore-examples` script), so publishing never
  leaves the working tree dirty.
- The packaging smoke test (`verify:package`) now feeds the scratch consumer
  an explicit bare-utility content probe. It had been passing by accident:
  the consumer's Tailwind was scanning the tarball's own markdown docs in
  node_modules for class candidates — slimming the tarball exposed it. The
  probe also proves, from the consumer's side, that the prebuilt entry
  generates no token utilities.

### Added

- Storybook deploys to GitHub Pages on every push to main
  (`.github/workflows/pages.yml`); the URL is in the README.

### Docs

- Development Status rewritten for the released/maintenance phase (1.4.0 on
  npm, 31 components); the stale "NPM Package: TBD" and pending
  extraction/build-out items are gone. Chromatic recorded as DECIDED-closed:
  the 741-check visual-spec harness is the regression gate.

## [1.4.0] - 2026-10-15

### Docs

- GETTING_STARTED's `./source` smoke-test example no longer spells an
  unprefixed utility inside a class attribute (the vocabulary gate's one
  real finding this cycle).


### Changed — follow-up sync (2026-10-15)

- Skeleton crumbs closed (same day): new `BG/Skeleton` variable (#e4e7eb) →
  `--color-surface-skeleton`, now the `--skeleton-fill` default (59 colors);
  checkbox bone 20×20 at the control's 3px radius; avatar bones 20/24
  (matching the real Avatar sizes).

- `--height-xs` removed (Height/XS was deleted in Figma; nothing consumed it).
- Utility button disabled states unified to the Standard treatment: no fill,
  `Stroke/Divider` border, `Text/Tertiary` label+icon (Empty drops its
  interim Paper fill; Rounded steps Hint→Tertiary; Text now dims). Filled
  unchanged (`Primary/Disabled`).
- The Micro button's label binds **Eyebrow** (11/16/600/10% UPPER) — the raw
  interim values are gone; `type-eyebrow` ships it. Data Key gained its UPPER
  transform (`type-data-key`) — **the casing question is closed for the whole
  type set**. Skeleton field bones are 4px in Figma, matching what shipped.
  ListItem Critical (red `Error/Base`) approved as the destructive-action
  display; amber stays field-errors only.

### Added — the go-live handoff rework (2026-10-14)

The engineering handoff (heights, tap areas, focus, disabled, loading) plus
the matching Figma rework, extracted and shipped in one pass:

- **Height tokens**: `--height-xs/sm/md/lg/xl` (24/32/40/48/56) from the new
  `Height/*` variables; controls now pin `height: var(--height-*)` with zero
  y-padding (never padding + line-height math). Resized by the file: Rounded
  button + all Utility SM 34→32, Utility MD 54→48, Tabs 34→32, BoxAction
  switch rows 44→48, ListItem rows 30/36/40→32/40/48 (pinned — the sm
  selected-growth quirk is gone), Standard Text (micro) row 12→16 with a raw
  11/16/600/8% label.
- **Tap targets**: `--target-min` 24 / `--target-touch` 44 (library
  constants); hug-content controls (icon button, text selector, micro/text/
  link buttons, radio, checkbox, switch) extend their hit area with a centred
  `::after` overlay — never layout.
- **`focus-ring-control`**: the new Figma "Focus Ring" effect (2px paper gap
  - 2px solid Primary) on `:focus-visible` for every control; fields keep the
    original 3px translucent ring. List options take neither (listbox
    contract: focus stays on the trigger; `data-active` paints the highlight).
- **Disabled everywhere it is now drawn**: Radio (Divider ring;
  Primary/Disabled when checked — reverses the 10-13 exclusion), Switch
  (Divider / Primary/Disabled tracks), OTP cell (App Page + Divider +
  Tertiary), every Utility button style (per-style recipes, verbatim),
  BoxAction unified at 0.5px Divider for both types.
- **Button loading**: `aria-busy="true"` on `.va-btn`/`.va-utility-button` —
  rest paints stay, the trailing icon yields to a 16px 270° spinner in the
  label's ink (18px slot: width never changes), clicks blocked,
  reduced-motion stops the spin.
- **ListItem rebuilt** (new set 786:6869): hover/`data-active` wash, and
  `.va-list-option-critical` — ink `Error/Base`, the Error ramp's first
  consumer.
- **SelectCard**: the ring is an authored **0.5px** inset shadow in every
  state; a drawn Focus axis.
- **New components: Address** (`.va-address*` — one group box, five bespoke
  cells; group-level hover/focus/error/disabled, focused-row Primary/Track
  marker) **and Upload** (`.va-upload*` — dashed drop zone, drag-over and
  completed states, hidden-file-input recipe).
- **Icons**: Button-family exports normalized to a painted 1px stroke at
  every size — shipped as per-size sprite stroke-widths (other components
  keep their authored weights).
- **Skeleton**: bone fill `#e4e7eb` (the set repaint), field-shape radii 4px
  (user decision), button/field md bones at the real 48.
- Casing baked for Tag & Pill + both Lockup styles (UPPER transforms →
  `type-*` utilities); Data Key still pending. Error-vs-amber doctrine
  recorded: amber = consumer-facing field errors (D4), red `Error/*` =
  destructive actions.

### Added — disabled states for the field family (2026-10-13)

The long-flagged gap is closed. Figma drew disabled variants for TextField
(865:5431), TextArea (865:5526) and DropdownField (865:4512): box fill
`BG/App Page`, border `Stroke/Divider`, value/placeholder ink
`Text/Tertiary`; title, hint and (DropdownField) chevron unchanged. Drawn
empty+rest only — disabled+error/filled/hover are undrawn; the disabled
rules sort last so the disabled look wins, and hover guards exclude
`:disabled` by name. Shipped on the native `:disabled` of each control
(`cursor-not-allowed` included). **Decision recorded with it:** Radio,
Switch and RadioField get NO disabled visual on purpose — cursor-only is
the design, no longer an open question
(docs/ticket-disabled-state-field-family.md resolved).

### Changed — Checkbox resized 18→20 (2026-10-13)

Figma resized every Checkbox variant to 20×20 (now consistent with Radio) and
rebuilt the hover/pressed variants: `.va-checkbox-control` is now `size-5`;
the 16×16 check glyph did not scale (inset 1→2px, absorbed by centring); the
raw 3px radius, 1.5px Stroke/Border ring, both state ramps and the disabled
treatment (1px + Stroke/Divider) are unchanged — token-diffed per variant.
The rebuild also **bound the check glyph's previously-unbound white to
`BG/Paper`**, closing the old "ships as Text/Contrast, designer to confirm"
question — the glyph ink is now `text-surface-paper`.

### Added — OtpCell + OtpField (2026-10-13)

New components from the OTP Figma sets (cell 824:4856, field 815:9211):
`.va-otp-cell` (a native per-digit `<input>`, 56×56, real 1px border,
Metric/Small digits, `:focus` ring + crimson caret, amber `aria-invalid`
border per decision D4) and `.va-otp-field` / `-title` / `-cells` / `-hint`
(fieldset + legend composing six cells, 25/56/19 rows, hint ink swaps to
Warning/Text via `:has()`). Auto-advance/paste handling is consumer JS; the
library ships none. Figma's Focused "caret" is a literal `|` glyph — shipped
as `caret-color`, digit ink constant.

### Changed — UtilityButton tracks the 2026-10 Button merge

Figma merged Button / Standard + Button / Utility into one set (1:218,
Appearance axis) and revised the Utility styles. Class names are unchanged
(mapping table in CLAUDE.md). Value changes, all Figma's:

- `.va-utility-button-empty`: the Stroke/Divider border now **persists at
  hover/pressed** (previously dropped to transparent) — one constant
  translucent ring over the changing fill.
- `.va-utility-button-filled`: gains a constant 1px Stroke/Divider ring
  (near-invisible over crimson; authored).
- `.va-utility-button-text`: the **underline is gone** (Link is the
  underlined style now) and rest ink steps up to Text/Secondary — the old
  raw-#6f7276 stacking was fixed by the designer.
- **New `.va-utility-button-link`**: inline underlined text button, 24px,
  "Buttons / Inline link" 16/400/24 (ships as `text-input`, numeric match),
  ink a **constant `Text/Primary`** — the four drawn variants are
  byte-identical, so no hover/pressed/disabled treatment is invented
  (`:disabled` is cursor-only). A short-lived `button/link-foreground`
  variable briefly carried a crimson state ramp; it was removed from the
  file on 2026-10-13 ("no new color tokens") and the Link ships the direct
  Text/Primary binding.

Standard (`.va-btn-*`) values re-verified unchanged; icons are now uniform
swappable left/right slots in Figma (docs updated — CSS never enforced
sides). Token enumeration re-run 2026-10-13 (twice): the 58-color collection
is unchanged and is again the only collection — the two `button/*` variable
collections that appeared with the merge were removed the same day; the
button variants bind `Text/*` / `Primary/*` directly and the library never
emitted the short-lived variables.

### Fixed — a stretched `Button` centred its label and icon

Figma's Button / Standard main components (1:259 Primary, 1:227 Secondary) are fixed
239px frames whose label is fill-container with left-aligned text, so the trailing
icon always sits at the right padding edge. `.va-btn` shipped `justify-center`, which
is indistinguishable at hug width — the 239 sample hid it — but a `w-full` / `flex-1`
button centred "CONTINUE →" as a pair. Found on the BSA "Account information" Val
run's Continue button (2026-09-17; `06-accuracy/continue-label-figma-check.md`).
`.va-btn` is now `justify-between`: identical for hug widths; a stretched button
reads label-left, icon-right. Known limit: a stretched button with a LEADING icon
pushes its label right (no frame draws that case; the label is a bare text node).

### Added — positioning utilities in the prebuilt `va:` surface, for the open listbox panel

The surface had no `absolute` / `relative` / `top-*` / `left-*` / `right-*` / `mt-*`,
so a page spelled in the closed vocabulary could only render `.va-dropdown-list` IN
FLOW — pushing the content below it down and sitting flush against the trigger. The
methodology's §11 gains an "Open listbox panel" recipe (trigger wrapped in
`va:relative`; panel `va:absolute va:top-full va:mt-1 va:z-60` + `va:left-0 va:w-full`
for a field, `va:right-0 va:w-32` for the header language menu). The 4px offset is a
library decision: no frame draws an open panel (Dropdown Field set 1:358 has no open
variant). Generated into `src/utility-surface.css` and the bundle, base + `md:` forms.

Same release, same route: the §11 mobile-footer recipe now states its pinning contract —
`<body>` is `va:min-h-screen va:flex va:flex-col` and the bar is its direct child with
`va:mt-auto va:sticky va:bottom-0 va:z-40` — so the surface also gains `min-h-screen`
and `mt-auto`. "Sticky" alone never engaged: a wrapper around the bar was its containing
block, and on a step shorter than the viewport nothing pushed the bar to the bottom. Both
mobile frames pin the bar to the artboard bottom, so this one is frame evidence.

### Fixed — `RadioField` title sat 2px right of its options

`.va-radio-field-title` is a `<legend>`, and Chromium's UA stylesheet gives legends
2px of inline padding. Tailwind preflight zeroes it, so hosts on `.`/`./source` never
saw it; the prebuilt `./styles.css` path (no preflight, `./reset.css` only) rendered
every radio-group title 2px to the right of its option row — on both viewports.
Found by the BSA "Account information" Val run's accuracy gate (2026-09-17), which
measured the title's ink edge at +2px while the option row beneath aligned exactly.
The title now carries `px-0`; the RadioField visual spec asserts it.

## [1.2.0] — 2026-09-16

> **Version note.** This release is `1.2.0`, and there is no `1.1.0`. The feature
> commit bumped `package.json` to 1.1.0, then `npm version minor` bumped it again
> before publish. 1.1.0 was never published to npm and never will be — if you find
> it referenced in a commit message or an older doc, it means this release.

### Added — an error axis on `TextArea` and `RadioField`

Six of the fourteen fields on the Short App's BSA "Account information" step need a
required inline error, and neither component modelled one — their own documentation
said "No Error axis exists". Figma draws no error variant for either, so rather than
invent a treatment, the design run was held and the question went to the designer.
Four decisions came back; they are recorded with their provenance in
`val/runs/2026-09-16-design-bsa-account-information/library-ask-error-axis.md`.

**`TextArea` mirrors `TextField` exactly.** `aria-invalid="true"` on the `<textarea>`
gives it a `Warning/Base` border and a `Warning/Text` hint. Error+hover is excluded by
name, so a hovered invalid field keeps its amber border. Error+focus is a real
compound — amber border, crimson ring — and it works only because the error rule sorts
**after** the focus rule: equal specificity, so source order decides the border while
the `outline` ring, a separate property, persists. The rule carries a comment saying
so. Reordering those two rules alphabetically silently drops the amber border the
moment the field takes focus. This transfers with nothing invented because the two
state models were already a token-verified match with zero deviations.

**`RadioField` gets error text and nothing else**, and that is the design, not a
partial implementation. A `RadioField` has no box and no border in any state, so the
siblings' border treatment had no target. A ring tint was considered and ruled out:
amber appears nowhere in the `Radio` control, and adding it would have been invented
style in a second component. The consequence is recorded in the CSS so it is not
re-opened as a bug — an unanswered required group's entire error signal is one line of
amber text beneath it.

`aria-invalid` goes on the **group**, with an explicit `role="radiogroup"`:

```html
<fieldset
  class="va-radio-field"
  role="radiogroup"
  aria-invalid="true"
  aria-describedby="q-hint"
></fieldset>
```

A native `<fieldset>` carries no implicit `radiogroup` role, so without it the
attribute announces against nothing.

### Changed — amber is the error colour permanently, across the field family

The theme defines a full `Error/*` ramp (#c0362c) that nothing binds, while every
field error variant binds `Warning/Base` (#b4791c). For a long time that read as an
authoring slip and the CSS carried comments promising to "rebind to the Error ramp
only when the designer does". **It was never a slip.** Those comments are removed from
`text-field.css` and `dropdown-field.css`, and the corresponding systemic item comes
off `docs/designer-list.md` for the field family. The `Error/*` tokens stay in the
theme, unused — removing them would be breaking.

Not covered: the `Toast` type literally named `error` also binds amber. That is a
question about naming rather than colour, and `toast.css` is deliberately untouched.

### Changed — the hint row is confirmed as the error row

`TextField` has carried an `inferred — designer to confirm` comment on its hint-ink
rule since extraction, because the hint row is hidden in every drawn Figma variant.
Two decisions close different halves of it: one establishes that a warning-ink message
below a field **is** an error treatment in this system, the other fixes which ramp it
comes from. The comments come out of `text-field.css` and `dropdown-field.css`, and
the new rules ship without an equivalent caveat.

### Fixed — `RadioFieldClass` declared one of its six classes

`types/components.d.ts` had `RadioFieldClass = "va-radio-field"` while the component
has always shipped `-title`, `-help`, `-options`, `-option` and `-hint`. Unrelated to
the error axis; closed while in the file.

### Verification

614 visual assertions, up from 603 — `TextArea` +6, `RadioField` +5, with no existing
assertion changed. 116 stories clean under axe with the same three pre-existing
waivers. Full static, bundle, layer and host gate suite green, including both example
starters.

Every new assertion was proven to fail when what it tests is removed. The five
positive ones redden when their rule is reverted; the six **guard** assertions assert
absence, so no removal can redden them — each was proven by adding the exact stray cue
it exists to catch (amber on the radio rings, titles, option labels and group border;
a recoloured `TextArea` label; a dropped focus ring).

`class-manifest.json` regenerates byte-identical: the error reuses the existing hint
element, so no class name is added. The bundle delta is exactly four rules — three
added, one hover guard narrowed.

### Not in this release

The missing **disabled** state across all four field components
(`docs/ticket-disabled-state-field-family.md`). The designer list calls it
launch-blocking for an application form; it needs its own decision, because a radio
group hits the same no-box problem resolved here for errors.

### Upgrading

Minor, not patch. If you already set `aria-invalid="true"` on a `.va-text-area-input`
for accessibility, it renders no differently today and renders an amber border after
this — a visible change in existing markup. Nothing is renamed or removed.

## [1.0.1] — 2026-09-16

### Fixed — `reset.css` defeated the components it was shipped to support

`./reset.css` was added in 1.0.0 as the answer to "what if a consumer loads only
`styles.css`". It is unlayered element rules — `button, input, select, textarea {
font-size: 100%; line-height: inherit; letter-spacing: inherit; color: inherit }` — and
the 1.0.0 bundle's component rules sat inside `@layer components`. Unlayered beats
layered before specificity is consulted, so the reset won over our own classes.
Measured with the new `verify:reset` against the 1.0.0 artifact, over every ```html
example in CLAUDE.md: **50 property/element defeats** — every `<button>`-based
component (`.va-btn-*`, `.va-utility-button-*`, `.va-icon-button*`, `.va-list-option`,
`.va-tab`, `.va-action-cta`) lost `font-size`, `line-height`, `letter-spacing` and
`color`; `.va-text-field-input` and `.va-text-area-input` lost `line-height`. The
Primary button's white label inherited the page ink onto the crimson fill. The fix for
one problem was a live instance of the problem, and nothing we had could see it.
`verify:reset` now asserts that no rule in `reset.css` overrides a property the bundle
declares on any documented element (0 on 1.0.1), with a canary.

### Fixed — the prebuilt bundle is now unlayered (the cascade-layer defeat)

`dist/shortapp-ui.css` (`./styles.css`) wrapped every component rule in `@layer
components`. Any UNLAYERED host rule beat them regardless of specificity or source
order: Tailwind 3 preflight (`* { border-width: 0 }`, `button { background-color:
transparent }`, `input, textarea { padding: 0 }`, `textarea { resize: vertical }`),
daisyUI 4, a Svelte `:global(button)` reset — and `reset.css` above. The `va-` rename
in 1.0.0 could not fix this and did not; it is not a name collision. The fingerprint a
consumer reported: a control whose **focus ring survived while its border did not**
(preflight never touches `outline`; it zeroes `border-width` on `*`).

**Why it reached a consumer.** A host that `@import`s the bundle into the file carrying
its `@tailwind` directives has Tailwind 3 consume our `@layer` blocks and re-emit the
rules unlayered, after preflight — the bug vanishes and the library looks correct on
the path most people test. It broke on a raw `<link>` to the file, the path we told the
consumer to use, where the layers reach the browser intact. `examples/daisyui-starter`
now measures both paths (1.0.0: 22/22 on import, 12/22 on link) and a third: a lone
`@import` through Tailwind 3's PostCSS, which 1.0.0 could not even take (below).

**The fix** is a build-time unwrap of pass A in `scripts/build-styles.mjs`: the two
`@layer components` blocks are replaced by their children. `src/components`,
`./source` and `dist/index.css` keep their layers — for a Tailwind v4 host the layer
IS the contract (`verify:layers`' original assertion, unchanged). `verify:layers`
gains the inverse assertion on the prebuilt bundle, with the layered `dist/index.css`
as its canary. `scripts/verify-layer-defeat.mjs` is the committed repro: one page, one
rule, toggled only by the wrapper; red on 1.0.0, green on 1.0.1.

**Behaviour change for consumers of `./styles.css`.** Previously any unlayered
consumer rule beat any component rule. Now a single-class override (`.my-btn {
height: 40px }`) still wins when it loads after the bundle — source order — but
overriding a compound state rule (`.va-btn-primary:hover`) needs matching specificity.
Correct for a library you deliberately import; a change nonetheless. The library's
own `va:` utilities follow the same arithmetic: they beat the 154 single-class
component rules and lose to the 164 compound ones. `verify:utility-precedence`
(new, in CI) fails when generated markup relies on a utility that a compound
component selector outranks — none does today.

**What the bundle still cannot defend against**, now stated as contract in README,
GETTING_STARTED and CLAUDE.md: a host rule of HIGHER specificity. A Svelte scoped
`button { border: 0 }` compiles to `button.svelte-<hash>` (0,1,1) and outranks our
0,1,0. `examples/sveltekit-starter` asserts that loss on purpose and asserts the
remedy (`button:not([class*="va-"])`, or class-scoped resets).

### Changed — the `html` ink/ground default moved from the bundle to `reset.css`

Pass A used to ship `@layer base { html { color; background-color } }`. A Tailwind 3
host's PostCSS refuses any file carrying `@layer base {` without a matching `@tailwind
base` (measured: the bundle could not be its own CSS entry). A document default is the
host's to set, and the methodology paints the canvas explicitly; the one place the rule
belongs is the opt-in file for standalone pages. `reset.css` is now five rules, and the
prebuilt bundle carries no `@layer base`. `dist/index.css` and `./source` are unchanged.

### Added

- `scripts/verify-layer-defeat.mjs` + `tests/fixtures/layer-defeat.html` — the repro,
  as a gate.
- `scripts/verify-reset.mjs` — reset.css may override nothing the bundle declares.
- `scripts/verify-utility-precedence.mjs` — utilities in generated markup keep
  precedence over component selectors; canaries for both false negatives and the
  type-selector false positive.
- `examples/daisyui-starter` — Tailwind 3 + daisyUI 4 host, computed-style
  assertions per control (button, input, select-by-manifest, textarea) over three load
  paths, naming the layer-defeat fingerprint when it sees it.
- `examples/sveltekit-starter` — Svelte 5 scoped styles: `:global` reset (must win),
  scoped element selector (documented loss), remedy, and the bundle vs its own
  `reset.css`.
- All of the above run in `ci.yml` and `release.yml`.

## [1.0.0] — 2026-09-15

**Breaking.** Component classes are namespaced `va-` and shipped utilities carry the
Tailwind v4 prefix `va:`. 1.0.0 rather than 0.2.0 because the class names are the
package's public API and every consumer's markup changes.

### Migration — mechanical

```
.btn                -> .va-btn                 every component class gains va-
.text-field-input   -> .va-text-field-input
flex gap-4          -> va:flex va:gap-4        every SHIPPED utility gains va:
md:w-full           -> va:md:w-full            the prefix LEADS the variant
```

`class-manifest.json` (new, exported as `./manifest`) lists both sets — 146 component
classes and 280 utilities — and is generated from the built bundle, so it cannot drift
from what actually ships.

**Unchanged, deliberately:** token names (`--color-primary` is still `--color-primary`),
component `@apply` payloads, and the `./source` entry. The prefix belongs to the prebuilt
bundle's utility layer only — a `./source` consumer still writes `rounded-sm`.

### Known — released with `verify:vocabulary` RED (accepted debt)

87 findings across five docs, accepted deliberately. **All are pre-existing dashboard-era
names** (`.chip`, `.input`, `.modal-positive`, and the `.icon` / `.icon-size-*` family
this library defines nowhere in `src/`); **zero are `va:` prefix misses**, verified before
the red was accepted. They were wrong before the rename and are not caused by it.

`ci.yml` still gates on the check and is red on every PR. `release.yml` marks it
`continue-on-error` so it reports without blocking, and writes the count and full output
to the job summary so the debt cannot collapse into an unopened log. Reconciling those
docs means documenting how icons actually work here — a writing task, tracked separately.
Remove `continue-on-error` when it lands.

### BREAKING — component classes are namespaced `va-`, shipped utilities carry `va:`

- **2026-09-14** — Every component class gains the `va-` namespace: `.btn` →
  `.va-btn`, `.text-field-input` → `.va-text-field-input`, all 146 of them. The
  prebuilt bundle's utility layer carries Tailwind v4's `va:` prefix
  (`va:flex`, `va:gap-4`; the prefix leads any variant, `va:md:w-full`).

  **Why.** Measured against `daisyui@4.12.24`, 13 of our 146 classes collided:
  `btn`, `btn-primary`, `btn-secondary`, `badge`, `avatar`, `radio`, `skeleton`,
  `tab`, `tabs`, `modal`, `modal-backdrop`, `toast`, `tooltip`. Our rules are in
  `@layer components`; daisyUI's are unlayered (Tailwind v3 hoists
  `addComponents` output out of its layers), and unlayered normal declarations
  beat layered ones before specificity or source order is consulted — so daisyUI
  won all 13 and no import ordering could change it. Unlayering ours would not
  have helped either: daisyUI supplies every property we leave unset, and its
  modal class is `pointer-events: none; opacity: 0` by default, so a dialog
  carrying that name rendered invisible. Renaming is the only fix that works,
  and the surface was growing — 15 of the 40 components still to be built
  already exist in daisyUI.

  **Migration.** Prefix every component class with `va-` and every utility with
  `va:`. `class-manifest.json` (new, exported as `./manifest`) lists both sets.
  Token names are **unchanged**: `--color-primary` is still `--color-primary`.
  Component `@apply` payloads and the `./source` entry are unchanged too — the
  prefix belongs to the prebuilt bundle's utility layer only.

### Added

- **2026-09-14** — `./styles.css` → `dist/shortapp-ui.css`: a self-contained
  bundle of component classes, tokens and the `va:` utility layer, built by two
  Tailwind passes and concatenated. **Preflight is excluded**, so it cannot
  fight the host's reset, and it needs no Tailwind in the consumer — which makes
  the host's Tailwind version irrelevant. Its utility layer is deliberately
  unlayered, so it cannot lose to an unlayered host rule.
- **2026-09-14** — `./manifest` → `class-manifest.json`, generated from the
  built bundle: 146 component classes, 140 utilities.
- **2026-09-14** — Two gates: `verify:vocabulary` fails when a doc names a class
  the bundle does not define, `verify:markup` fails when generated markup uses a
  class with no rule in the bundle. Both carry canaries so they cannot pass
  vacuously. Both run in CI.

### Known — released with `verify:vocabulary` RED (accepted debt)

- **2026-09-14** — This release ships with `verify:vocabulary` failing on 87
  findings across five docs. **All are pre-existing dashboard-era names**
  (`.chip`, `.input`, `.modal-positive`, and the `.icon` / `.icon-size-*` family
  that this library defines nowhere in `src/`) — **zero are `va:` prefix misses**,
  verified before the red was accepted. They were wrong before the rename and are
  not caused by it.

  `ci.yml` still gates on the check and is red on every PR. `release.yml` marks it
  `continue-on-error` so it reports without blocking, and prints the count and full
  output to the job summary so the debt cannot collapse into an unopened log.
  Reconciling those docs means documenting how icons actually work here — a writing
  task, tracked separately. Remove `continue-on-error` when it lands.

### Removed

- **2026-09-14** — `peerDependencies` on `tailwindcss`. The prebuilt entries
  need no Tailwind at all. `./source` still requires v4; nothing enforces that
  now except the documentation.

### Changed

- **2026-09-03** — Val pipeline retargeted from the dashboard library to
  this one: registry regenerated for all 27 components and hand-enriched
  with Figma set/variant node ids, `figmaNames` aliases (a new merged
  registry field) and behavior notes; val-build/val-context updated for
  the Inter-only Short App type system and the shortapp skill;
  val-components taught the alias matching; the skill rewritten as the
  full design-language cheat sheet.

## [0.1.2] — 2026-09-02

### Added

- **2026-09-02** — Deployment hardening: `verify:package` packaging smoke
  test (packs the real tarball, installs it into a scratch Vite app, builds
  both entry points, and asserts the two-entry contract — token utilities
  present via `/source`, absent via prebuilt), wired into CI; tag-driven
  Release workflow (`npm version` + push tag → gated publish with npm
  provenance, requires the `NPM_TOKEN` secret); Chromatic in CI
  (`CHROMATIC_PROJECT_TOKEN` secret, reuses the CI Storybook build).

### Fixed

- **2026-09-02** — Example starters carried the dashboard-era
  `--color-surface-frame` dead token (the base-layer bug's surviving
  sibling) and a JetBrains Mono font import; the vite-starter's setup check
  is now a component sampler built from the shipped library classes, and
  all "component set not yet extracted" copy is gone.

## [0.1.1] — 2026-09-02

### Fixed

- README currency: the published 0.1.0 README still described the
  bootstrap-era empty library ("component set is currently empty") — now
  reflects the 27 shipped components, the complete token set, and the
  verification gates. Docs-only patch; no CSS changes.

## [0.1.0] — 2026-09-02

### Added

- **2026-09-02** — `UtilityButton` (Button / Utility 24:4382): the
  non-inline button family — Empty / Filled / Rounded / Text types, SM/MD,
  Field Label natural-case convention. Button (1:218) is now "Button /
  Standard" (inline uses); its rework formalized Pressed into an axis with
  values identical to the shipped :active treatments (no CSS change).

- **2026-09-02** — `Toast` (582:9325), `StatusTracker` (Application Status
  64:4623) and `Action` (71:848), all inline fast-path. Toast marks the
  status ramps' first bindings (Success/Base, Info/Base — while Type
  "error" binds Warning/Base verbatim, the file-wide slip's sharpest
  instance); Action's Done chip adds Success/Text. New a11y waiver for the
  Action pending chip (Text/Hint-on-Paper contrast family).

- **2026-09-02** — `Tooltip` (582:9178, inline fast-path): dark contrast
  tooltip with optional muted title. First use of the NEW `BG/Contrast`
  variable (token 58, `--color-surface-contrast`) and of the
  `text-field-label` style (whose real consumer is tooltip titles, not
  field labels — designer list). Third consumer of `--shadow-basic`.

- **2026-09-02** — `Modal` (557:5127): the library's first overlay — card +
  Type-bound notice banners (Destructive/Success; Neutral = no banner),
  composed close (IconButton) and actions (Buttons), `<dialog>`-first overlay
  plumbing with a styled `::backdrop` plus a `.modal-backdrop` div fallback
  (unsourced scrim, designer list), on the Library Contracts z-scale. New
  **`--shadow-basic`** token from Figma's new "Basic Drop Shadow" effect
  style (0 8px 24px −4px).

### Changed

- **2026-09-02** — `DropdownList` shadow rebound from its raw
  `0 2px 5px 10%` to the tokenized `--shadow-basic` (designer direction —
  a value change), now a real `box-shadow`: the −4px spread is
  inexpressible as a `filter: drop-shadow()`, and the dashboard-era
  "overflow-clip eats box-shadow" claim was re-tested and is false.

### Added

- **2026-09-02** — Field family: `TextField` (Plain Text Field 1:291),
  `DropdownField` (1:358, listbox-trigger composing DropdownList), `TextArea`
  (199:12523). Settled the Error-ramp question: field errors bind
  `Warning/Base` verbatim (designer list). New `verify:bundle` gate
  (undefined `var()` refs + class/utility collision probe) after the
  `--color-surface-frame` base-layer bug; `verify:a11y` and `verify:bundle`
  added to CI. A11y scanner gained a documented KNOWN_ISSUES waiver
  (DropdownField placeholder contrast — a Figma design defect).
- **2026-09-02** — `Owner` (261:13225, glyph-slot tile) and `OwnerContainer`
  (274:258, owners-list row composing Owner/Badge/Button/IconButton).
  IconButton revised for the designer's Neutral-ramp rework (new
  `Neutral/Pressed` token, Pressed axis, darker `Neutral/Hover`).
- **2026-09-01/02** — Core set extracted from the Short App Figma file:
  `Radio`, `Checkbox`, `Switch`, `Button`, `IconButton`, `ListItem`
  (`.list-option*`), `DropdownList`, `TextSelector`, `SelectCard`, `Avatar`,
  `Badge`, `BoxAction`, `Tabs`, `Header`, `RadioField`, `Skeleton` — each
  with a visual spec, stories, and Quick Reference docs.
- **2026-09-01/02** — Design tokens: complete Plugin-API enumeration (57
  colors incl. the Neutral rework, 8 radii, 13 spacing values, 24 text
  styles, the Primary Ring focus effect), emitted as OKLCh via
  `build-theme.mjs`.
- **2026-09-01** — Project bootstrapped from the Valiify Dashboard UI library's
  infrastructure: build pipeline (tokens → theme → dist), component generator,
  visual / a11y / static verification harnesses, Storybook 10, TypeScript
  definitions structure, icon sprite system (Lucide), and example starters.
  Dashboard components, tokens, stories, specs, and documentation are preserved
  for reference in `_dashboard-archive/` and are not part of this package.

### Fixed

- **2026-09-02** — First full-CI static sweep: Tabs' active-hover rules
  gained the house `:not(:disabled)` guards; the two deliberately-raw values
  (DropdownList's unbound Figma shadow, Skeleton's nonexistent
  "Surface/Neutral" fill) are now covered by documented
  `static-ok(<rule>)` waiver pragmas in `verify-component.mjs` — printed,
  never silent, with a stale-waiver guard.
- **2026-09-02** — `src/base/index.css` referenced the dashboard-era
  `--color-surface-frame` (undefined in this theme): every consumer page's
  `html` background silently resolved to nothing. Now `surface-app-page`
  (#fafaf9), gated by `verify:bundle`.
- **2026-09-02** — Renamed `.text-field-label` → `.text-field-title`
  (family-wide `-title`): the class collided with the `text-field-label`
  type token's generated utility. Same class of bug as the earlier
  `.list-item` → `.list-option` rename (Tailwind display utility).
