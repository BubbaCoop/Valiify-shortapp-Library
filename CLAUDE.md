# Valiify Short App UI Component Kit

A Tailwind CSS component library for building the Valiify Short App — the
online application where applicants apply for accounts. CSS-only, zero
JavaScript dependencies, framework-agnostic.

This library was bootstrapped from the Valiify Dashboard UI library's
infrastructure. The build pipeline, verification tooling, component process,
and documentation conventions carry over; the components and design tokens do
not — the Short App has its own Figma component library and its own visual
language. The dashboard library's components, stories, tokens, specs, and
component documentation are preserved for reference in
[_dashboard-archive/](_dashboard-archive/) — useful as pattern references when
building analogous Short App components, but **never** to be imported or
treated as a spec for this library.

## Git

**Never run `git commit` or `git push`.** Stage changes with `git add` if asked,
then stop — I write all commit messages and commit myself.
Never add Co-Authored-By trailers (or any Claude attribution) to commits or PRs.

## Val agents are generated — do not hand-edit them

`.claude/agents/*.md` and `.claude/commands/{val,extract}.md` are **generated**
by `@valiify/val-core` (`npx val-init`) from its templates plus this repo's
[val/config.json](val/config.json). Each file carries a header saying so. To
change agent behaviour, edit the template in the val-core repo
(`~/Desktop/val-core`, published to npm as `@valiify/val-core`), release it, then
bump the devDependency here and rerun `npx val-init`; to change a path, font rule
or audience sentence, edit `val/config.json`, then run `npx val-init` and stage
the output. `npx val-init --check` fails when the generated files
drift from their sources. `val/tools` is a symlink into the package; the
methodology skills live at `node_modules/@valiify/val-core/skills/`.

## Quick Reference

### Available Components

> 31 components. Figma merged the two button sets into one `Button` set
> (Appearance axis) in 2026-10; the shipped class families (`va-btn-*`,
> `va-utility-button-*`) are unchanged — the mapping table lives in the
> Button section.

#### Button

Extracted from Figma **Button / Standard** (1:218); since the **2026-10 merge**
node 1:218 is the unified **Button** set — `Appearance` {Standard, Utility} ×
`Style` × `Size` × `State` {Default, Hover, Pressed, Disabled}. This section is
the Standard appearance (16 variants); UtilityButton below is the Utility
appearance. **The Figma styles were renamed in the merge; the shipped classes
keep their names** (class names are public API) — the mapping:

| Figma (Appearance / Style / Size) | code                                                    |
| --------------------------------- | ------------------------------------------------------- |
| Standard / Primary / MD           | `.va-btn .va-btn-primary`                               |
| Standard / Secondary / MD         | `.va-btn .va-btn-secondary`                             |
| Standard / Text / XS              | `.va-btn .va-btn-micro`                                 |
| Standard / Rounded / SM           | `.va-btn .va-btn-bubble`                                |
| Utility / Secondary / MD, SM      | `.va-utility-button .va-utility-button-empty` (+ `-md`) |
| Utility / Primary / SM            | `.va-utility-button .va-utility-button-filled`          |
| Utility / Rounded / SM            | `.va-utility-button .va-utility-button-rounded`         |
| Utility / Text / MD, SM           | `.va-utility-button .va-utility-button-text`            |
| Utility / Link / MD               | `.va-utility-button .va-utility-button-link` (new)      |

Both Appearances use the style name "Primary" with different type/padding/
heights — be explicit about the `va-btn-` vs `va-utility-button-` prefix. The
merge changed **no Standard values** (re-verified 2026-10-13, three lanes): the
old hover+pressed compounds became plain Pressed variants binding the same
tokens, and Rounded's new Disabled matches the old inactive (ink-only →
Tertiary). A former `Mobile` axis was removed by the designer (caught by the
Gate-0 metadata sweep).

- **Base**: `.va-btn` — layout only, **a type class is required** (Figma names no
  default Type; the Alert/Tabs lesson)
- **Heights are token-bound** (2026-10): Primary/Secondary `var(--height-lg)`
  48, Bubble `var(--height-sm)` 32 (was 34), Micro a 16px hug row whose label
  binds **Eyebrow** (11/16/600/10% UPPER — bound 2026-10-15, `type-eyebrow`).
  Height comes from the token with zero y-padding — never padding +
  line-height math.
- **Loading**: `aria-busy="true"` (drawn for Primary/Secondary MD) — rest
  paints stay, the trailing icon yields to a 16px 270° spinner in the label's
  ink, the label stays, clicks are blocked, width never changes.
- **Focus**: `focus-ring-control` (2px solid Primary at offset 2 — the new
  "Focus Ring" effect; fields keep the old 3px translucent ring). Micro
  carries a ≥24px tap-target overlay (≥44px on touch).
- **Types**: `.va-btn-primary`, `.va-btn-secondary`, `.va-btn-micro`, `.va-btn-bubble`
- **States**: `:hover`, `:active`, `:disabled` (Figma's `Inactive`),
  `:focus-visible`
- **Icon slots**: plain `svg` children (18px; 12px in Micro), painted by the
  button. Since the merge Figma models icons **uniformly on every style**:
  swappable `Icon / Left` (default OFF) + `Icon / Right` (default ON) instance
  slots — the old per-Type layouts are obsolete. Documented, not enforced.
  Every default glyph is `arrow-right`; since the 2026-10-14 normalisation the
  exports author a **painted 1px stroke at every size** — shipped as
  stroke-width 1.333 on the 24-unit sprite at 18px (= 1px) and 2 at 12px
  (= 1px). Button-family only; other components keep their authored weights.
- **Width is the caller's** — Figma's 239px is the sample hug; add `w-full`
  in full-width forms. Heights pinned: 48 / 48 / 12 / 34.

| Type         | box                          | type style                                       | rest → hover → pressed → disabled                                                                                     |
| ------------ | ---------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `-primary`   | 48px, 4px radius, filled     | `type-button-label` (14/600, 10%, **uppercase**) | fill `Primary → Hover → Focus → Disabled`; white ink **never fades**                                                  |
| `-secondary` | 48px, 4px radius, 1px border | same                                             | border `Stroke/Border → Hover → (pressed adds Action/Hover wash) → Divider`; ink `Secondary → Primary → · → Tertiary` |
| `-micro`     | 12px bare row, no box        | `type-micro-label` (9/600, 8%, **uppercase**)    | ink `Secondary → Primary (hover **= pressed**) → Tertiary`                                                            |
| `-bubble`    | 34px pill                    | `text-label` (14/400, **mixed case**)            | ink ramp + fill `none → Action/Hover → Action/Pressed → none`                                                         |

> **Casing is a styled transform, not typed caps** — the Figma samples are
> "Button" mixed-case; Primary/Secondary/Micro carry an uppercase transform,
> Bubble doesn't. This resolved the token file's casing question for `Button
Label` and `Micro-Label` (both now carry `textTransform` and emit `type-*`
> utilities); Eyebrow/Data Key/Tag & Pill remain open.

> **Secondary's hover changes the border only** — the fill wash appears only
> at pressed, and binds the token literally named `Action/Hover` (where
> Bubble's pressed binds `Action/Pressed`). Verbatim; designer list.

> **`Primary/Focus` is Figma's literal name for the Primary PRESSED fill** —
> wired to `:active`, never `:focus-visible` (same pattern as Checkbox).

> **Micro's hover and pressed are pixel-identical in Figma** (0/696 diff —
> measured, not assumed) — reproduced as one rule. Designer list, same defect
> class as the dashboard's TextButton.

> **Primary's height math is 2px short** (13+13+20 = 46 vs the 48px frame;
> Secondary closes exactly via its border-box 1px border) — resolved by frame
> authority (`h-12` pinned), not by inventing padding. Designer list.

> **Secondary's border is a real 1px border** — pixel-aligned, not fractional,
> so the Radio/Checkbox inset-shadow trick is deliberately NOT used here.

> **Content is `justify-between`, not centred** (fixed after 1.3.0) — Figma's
> label is fill-container with left text on a fixed 239px frame, so a stretched
> button (`w-full` / `flex-1`) reads label-left, icon at the far edge; hug widths
> are unchanged. Limit: a STRETCHED button with a LEADING icon pushes its label
> right — no frame draws that case.

```html
<button class="va-btn va-btn-primary">
  Continue
  <svg aria-hidden="true"><use href="#arrow-right" /></svg>
</button>

<button class="va-btn va-btn-secondary">
  <svg aria-hidden="true"><use href="#arrow-left" /></svg>
  Back
</button>

<button class="va-btn va-btn-micro">
  View all
  <svg aria-hidden="true"><use href="#arrow-right" /></svg>
</button>

<button class="va-btn va-btn-bubble">Skip</button>

<!-- Full width is the caller's -->
<button class="va-btn va-btn-primary va:w-full">Submit application</button>
```

#### Radio

Radio button control for single selection from a group. Extracted from Figma
Radio (1:419) — 4 variants across `Active` × `Hover` × `Pressed`, all 20×20.

- **Base**: `.va-radio` — applied **directly to a native `<input type="radio">`**
- **States**: `:hover`, `:active`, `:checked`, `:focus-visible`, `:disabled`
- **Dimensions**: 20×20 circle, 1.5px inside ring, 10px inner dot when checked
- **No label, no sizes, no slots** — the Figma component is the bare control;
  compose your own label markup around it

| State      | ring (1.5px inside) | fill             | dot                    |
| ---------- | ------------------- | ---------------- | ---------------------- |
| rest       | `Stroke/Border`     | none             | —                      |
| `:hover`   | unchanged           | `Action/Hover`   | —                      |
| `:active`  | unchanged           | `Action/Pressed` | —                      |
| `:checked` | `Primary/Primary`   | **none**         | 10px `Primary/Primary` |

> **The ring is an inset `box-shadow`, not a border — load-bearing.** Chrome
> floors fractional `border-width`, so a 1.5px border renders 1px. An inset
> box-shadow paints the authored 1.5 exactly, and inset matches Figma's inside
> stroke alignment, so the 20px layout box is unaffected. Same family of trap
> as the dashboard LoadingIndicator's masked-gradient ring.

> **Hover and pressed exclude `:checked` by name.** Figma draws no
> checked+hover or checked+pressed variant, so a checked radio deliberately
> takes no tint — the spec pins this. If the designer adds those variants,
> remove the `:not(:checked)` guards rather than layering new rules.

> **Disabled and Focus are DRAWN since the 2026-10 go-live rework** (913:569/
> 571, 914:699/701 — reversing the 10-13 exclusion): disabled greys the ring
> to `Stroke/Divider` (still 1.5px — nothing thins, unlike Checkbox) and a
> checked radio's ring AND dot go `Primary/Disabled`; focus is the new
> "Focus Ring" effect via `focus-ring-control`. The control also carries a
> ≥24px tap-target overlay (≥44px on touch). No checked+hover/pressed in the component
> set (`:focus-visible` uses the library-wide `focus-ring` utility — Figma's
> "Primary Ring" effect, a 3px `Primary/Ring` halo, extracted with the token
> set).

> **Structure quirk in the design file, harmless here:** the three unchecked
> variants draw the ring as a child ellipse, while checked puts the stroke on
> the variant frame itself. Visually identical; flagged to the designer.

```html
<!-- Bare control -->
<input type="radio" name="plan" class="va-radio" />
<input type="radio" name="plan" class="va-radio" checked />

<!-- With a label, composed at the call site -->
<label style="display: inline-flex; align-items: center; gap: 10px;">
  <input type="radio" name="account-type" class="va-radio" checked />
  Business
</label>
```

#### Avatar

Circular initials marker. Extracted (inline fast-path) from Figma Avatar
(23:670) — 4 variants: `Property 1` {MD 24px, SM 20px} × `Feint`.

- **Base**: `.va-avatar` (MD, 24px) — `Neutral/Base` fill, white initials,
  Eyebrow type (11/600, 10% tracking, uppercase)
- **Size**: `.va-avatar-sm` (20px) — steps the type to Micro-Label (9/600, 8%)
- **Variant**: `.va-avatar-feint` — `Neutral/BG` 8% tint, `Text/Secondary` ink

> **The uppercase is the type style's own transform** — this component and
> Badge are the evidence that resolved Eyebrow's casing (typed mixed-case,
> styled caps). Pass initials in any case.
> **Initials only** — no image layer exists in any variant, same as the
> dashboard file's Avatar. No LG, no ring, no disabled modelled.

```html
<span class="va-avatar">NC</span>
<span class="va-avatar va-avatar-sm">NC</span>
<span class="va-avatar va-avatar-feint">NC</span>
```

#### Badge

Small uppercase qualifier pill. Extracted (inline fast-path) from Figma Badge
(28:507) — a single symbol, no variant axes.

- **Base**: `.va-badge` — 16px full-round pill, `Neutral/BG` fill, 8px x-padding,
  Eyebrow type in `Text/Secondary`; width hugs the label

> **No colour variants, sizes, or states exist in the design** — the symbol
> has no axes. Pass the label in natural case (the Eyebrow transform caps it).

```html
<span class="va-badge">Optional</span>
```

#### BoxAction

A boxed row composing a Checkbox or Switch with a label — the whole row is the
hit target. Extracted from Figma Box action (199:12990) — 8 variants:
`Type` {Checkbox 48px, Switch 44px} × {rest, Hover, Active, Disabled}.

- **Base**: `.va-box-action` (a `<label>`) + type class `.va-box-action-checkbox` /
  `.va-box-action-switch` (required — they carry the label styles; **both
  types are `var(--height-lg)` 48 since 2026-10** — the switch row's 44 is
  gone) + `.va-box-action-label`
- **Pure composition**: the nested control is the shipped `.va-checkbox-control`
  / `.va-switch` markup, unmodified — its checked styling comes free. Row state
  derives from the real input via `:has(:checked)` / `:has(:disabled)`.

| state    | ring (inset shadow)                                           | fill          | label                                                                            |
| -------- | ------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| rest     | 1px `Stroke/Divider`                                          | `BG/Paper`    | checkbox: `text-input`/Primary · switch: `text-body-content`/Secondary           |
| hover    | 1px `Stroke/Hover`                                            | **unchanged** | unchanged (row hover never touches the control)                                  |
| active   | 1px `Primary`                                                 | `Primary/BG`  | checkbox type steps to `text-lead` (500, ink unchanged); switch type never steps |
| disabled | **0.5px `Stroke/Divider` — UNIFIED for both types (2026-10)** | `BG/App Page` | `Text/Tertiary`                                                                  |

> **The ring is an inset box-shadow, both rows pinned at 48** — a border
> would overflow the pinned box, and the authored 0.5px disabled ring would
> be floored to 1px as a border. The old per-type disabled inconsistency was
> RESOLVED by the 2026-10 rework (0.5px Divider for both).
> No compound states are drawn; the CSS excludes them by name. No row-level
> focus — the nested control's own focus-ring serves.

```html
<label class="va-box-action va-box-action-checkbox">
  <span class="va-checkbox-control">
    <input type="checkbox" class="va-checkbox-input" />
    <svg class="va-checkbox-check" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  <span class="va-box-action-label">Paperless statements</span>
</label>
```

#### Checkbox

Binary selection control. Extracted from Figma Checkbox (1:424) — 8 variants
across `Active` × `Hover` × `Pressed` × `Disabled`, all 20×20 (**resized
18→20 on 2026-10-13** to match Radio; every variant updated consistently,
hover/pressed rebuilt as new nodes with the same token story).

- **Parts**: `.va-checkbox-control` (18px positioning wrapper), `.va-checkbox-input`
  (native `<input type="checkbox">`), `.va-checkbox-check` (sprite `#check` glyph)
- **States**: `:hover`, `:active`, `:checked`, `:disabled`, `:focus-visible` —
  and unlike Radio, **both branches have hover/pressed drawn in Figma**
- **Dimensions**: 20×20 box, raw **3px radius** (still on neither Radius token
  after the resize — designer list), 1.5px inside ring, 16×16 check glyph at
  2px inset (the glyph did NOT scale with the box)

| state    | unchecked                                           | checked                                   |
| -------- | --------------------------------------------------- | ----------------------------------------- |
| rest     | `Stroke/Border` ring 1.5px + Paper fill             | `Primary` fill, **no ring**               |
| hover    | + `Action/Hover` fill, ring unchanged               | `Primary/Hover`                           |
| pressed  | + `Action/Pressed`                                  | **`Primary/Focus`** (verbatim token name) |
| disabled | ring thins to **1px** AND swaps to `Stroke/Divider` | `Primary/Disabled` (translucent, as-is)   |

> **The ring is an inset box-shadow** (fractional-border trap, same as Radio).
> **The unchecked border only LOOKS like it darkens across states** — it is one
> constant translucent token compositing over the changing fill; do not split
> it into per-state ring colours.
> **Disabled changes two things at once** (width and token) — pixel-verified,
> both authored.
> **`Primary/Focus` is Figma's literal name for the checked PRESSED fill** —
> wired to `:active`, never `:focus-visible`.
> **The wrapper exists for the sprite glyph** — a pseudo-element cannot render
> `<use>`; the check's ink was **resolved in the 2026-10 rebuild: a filled
> vector bound to `BG/Paper`** (the old unbound-white question is closed) and
> ships as `text-surface-paper`. The sprite's symbols carry no paint
> attributes, so the component CSS supplies
> `fill:none; stroke:currentColor; stroke-width:2`.
> **Not modelled, not invented**: indeterminate (`:indeterminate` renders
> unchecked — see the IndeterminateGap story), disabled+hover/pressed, focus.

```html
<label style="display: inline-flex; align-items: center; gap: 10px;">
  <span class="va-checkbox-control">
    <input type="checkbox" class="va-checkbox-input" checked />
    <svg class="va-checkbox-check" aria-hidden="true">
      <use href="#check" />
    </svg>
  </span>
  Online banking
</label>
```

#### Header

The application shell header. Extracted from Figma Header (550:7507) — Web
(1410×60) / Mobile (375×60) variants, which differ **only** by frame width
and the TextSelector's label ("English" → "EN").

- **Base**: `.va-header` — 60px pinned, `BG/Paper`, 1px `Stroke/Divider` bottom
  border (a real border: pinned height + border-box absorbs it), 20px
  x-padding
- **Parts**: `.va-header-logo` (caller asset slot, 30px tall, absolutely
  centered — its crimson #CD1041 is the client brand asset's own colour,
  deliberately untokenized), plus the composed `.va-text-selector`
- **Breakpoint helpers**: `.va-header-desktop` / `.va-header-mobile` wrappers —
  render both selector labels; the 768px media query switches them

> **Three labeled library extensions** (the consumer contract; Figma models
> none): `position: sticky; top: 0; z-index: 40` (first z-index in the
> library — establish a scale when overlay components land), full width, and
> the 768px breakpoint. No scrolled shadow — Figma draws none.
> **The helpers are `display: contents` wrappers, not classes on
> `.va-text-selector`** — header.css sorts before text-selector.css, so
> equal-specificity display rules on the same element would lose by import
> order.
> **Sticky sticks to the nearest scrolling ancestor** — mount as a direct
> child of the scroll container or both contract behaviours silently break.

```html
<header class="va-header">
  <img class="va-header-logo" src="/logo.svg" alt="Alabama Credit Union" />
  <span class="va-header-desktop">
    <button
      class="va-text-selector"
      aria-haspopup="listbox"
      aria-expanded="false"
    >
      <svg class="va-text-selector-icon" aria-hidden="true">
        <use href="#globe" />
      </svg>
      <span class="va-text-selector-label">English</span>
      <svg class="va-text-selector-chevron" aria-hidden="true">
        <use href="#chevron-down" />
      </svg>
    </button>
  </span>
  <span class="va-header-mobile"><!-- same, label "EN" --></span>
</header>
```

#### IconButton

Compact icon-only button. Extracted from Figma "icon button" (1:429) — 16
variants across `Size` × `Type` × `Hover` × `Subtle`.

- **Base**: `.va-icon-button` — Figma's _Icon Only_ type: the glyph IS the box,
  hover recolours it and **nothing else** (no background, ever)
- **Type**: `.va-icon-button-state` — pads the same glyph into a larger hit target
  and hover adds a full-circle `Action/Hover` halo
- **Sizes**: md default (18px glyph; 24px box as State), `.va-icon-button-sm`
  (14px glyph; 18px box as State). Box = glyph for Icon Only.
- **Ramp**: default rest `Neutral/Base` → hover `Neutral/Hover`;
  `.va-icon-button-subtle` rest `Neutral/Disabled` (60% ink) → hover
  `Neutral/Base` — **hover cancels the muting and never reaches Neutral/Hover**
- **Glyph slot**: any sprite symbol, no icon class — the button sizes and
  paints its child `svg` directly (stroke-width 2 → 1.5px at md, 1.167px at sm)

> **Always give an icon-only button an `aria-label`.**
> **md as the bare default is a library choice** — Figma names no default Size.
> **Revised 2026-09-02 (Neutral-ramp rework)**: a Pressed axis was added —
> `:active` binds the new `Neutral/Pressed` for **both** ramps (pressing a
> Subtle button reaches full-strength ink), and the State type's pressed halo
> deepens to `Action/Focused`. `Neutral/Hover` also darkened (#484b4f). The
> old `23:723` rest-binding slip **was fixed by the designer**; still open:
> `23:725`'s hand-shrunk glyph (shipped 18px).
> **Legibility flag**: the Subtle rest glyph is very faint over white.
> **Not modelled, not invented**: Disabled (cursor only), Focus (library
> `focus-ring`).

```html
<button class="va-icon-button" aria-label="Close">
  <svg aria-hidden="true"><use href="#x" /></svg>
</button>

<!-- Padded hit target with hover halo -->
<button class="va-icon-button va-icon-button-state" aria-label="Settings">
  <svg aria-hidden="true"><use href="#settings" /></svg>
</button>

<!-- Small, muted -->
<button
  class="va-icon-button va-icon-button-sm va-icon-button-subtle"
  aria-label="Help"
>
  <svg aria-hidden="true"><use href="#circle-help" /></svg>
</button>
```

#### Skeleton

Loading placeholders mirroring real components. Extracted from Figma Skeleton
(525:4650, **16 shapes**) plus the authored written spec (550:7998) — the
authority for the SM/MD/LG matrix, per-shape radii, and the animation.

- **Base**: `.va-skeleton` — fill + pulse only; **both a shape and a size class
  are required** (dimensions are a 16×3 matrix, not one box at three scales)
- **Shapes**: `-text -heading -circle -rectangle -button -input -textarea
-card -switch -checkbox -badge -listitem -tab -avatar -dropdown -radio`
- **Sizes**: `-sm -md -lg` — written-spec defaults; widths stretch freely
  (`w-full` just works — consumer utilities win), heights stay near defaults

| radius | shapes                                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 4px    | text, heading, checkbox, **input, textarea, dropdown** (moved 2026-10-14 — "inputs are 4px everywhere"; Figma's bones followed on 10-15) |
| 6px    | button, tab                                                                                                                              |
| 8px    | rectangle, card                                                                                                                          |
| 10px   | badge, switch                                                                                                                            |
| full   | circle, avatar, radio                                                                                                                    |

> **The fill is TOKENIZED (2026-10-15)**: the bones bind the new
> `BG/Skeleton` variable (#e4e7eb) → `--color-surface-skeleton`, still
> wrapped in `--skeleton-fill` for per-instance overrides. The checkbox bone
> is 20×20 at the control's raw 3px radius and the avatar bones match the
> real 20/24 sizes — the lag items are closed. The redrawn set's Input/Dropdown shapes are 73px COMPOSITES
> (16px label bar + 9px gap + 48px field) — the library's `-input`/`-dropdown`
> bones are the 48px field; compose a `-text` label above for the full shape.
> Button md/lg bones are 48 (the real control height).
> **The pulse is the written spec's, not Tailwind's `animate-pulse`** — 2s
> ease-in-out, opacity 1→0.4→1 (Tailwind's floors at 0.5 on a different
> curve). Instances pulse in sync for free; do NOT stagger with
> animation-delay — the spec rules it out. Reduced-motion guard lives inside
> `@layer components` (the dashboard's one cascade leak, not repeated).
> **Accessibility**: each `.va-skeleton` is `aria-hidden` decoration; the
> CONTAINER carries `role="status"`, `aria-busy="true"` and a label.

> **Coverage contract (settled 2026-10-13): components do NOT get bespoke
> skeletons.** The 16 shapes are a primitive vocabulary composed at the call
> site to mirror the page's layout — Figma draws no per-component skeleton,
> so shipping one per component would be invented design and a maintenance
> tax that grows with every extraction. Stand-in map for the shipped
> components (width via `va:` utilities where the real one stretches):
> Button/UtilityButton → `-button` · TextField/DropdownField → `-input` /
> `-dropdown` · TextArea → `-textarea` · Radio/Checkbox/Switch/Badge/Avatar/
> Tab → their namesakes · ListItem/DropdownList rows, Action, OwnerContainer
> → `-listitem` (or `-circle` + `-text` composition for avatar-led rows) ·
> SelectCard/Toast/Modal body → `-card` / `-rectangle` · Owner → `-rectangle`
> (34×34) · OtpField → six `-checkbox` shapes resized (4px radius matches the
> cell) or `-rectangle` · headings/copy → `-heading` / `-text`. Overlays
> (Modal, Tooltip, Toast) and chrome (Header) don't get skeletons at all —
> you skeleton the content UNDER chrome, never the chrome. Known family
> question: the written spec's `-input` radius is 6px while the real fields
> ship 4px (designer list).

```html
<div role="status" aria-busy="true" aria-label="Loading profile">
  <span
    class="va-skeleton va-skeleton-circle va-skeleton-lg"
    aria-hidden="true"
  ></span>
  <span
    class="va-skeleton va-skeleton-heading va-skeleton-lg"
    aria-hidden="true"
  ></span>
  <span
    class="va-skeleton va-skeleton-text va-skeleton-md va:w-full"
    aria-hidden="true"
  ></span>
</div>
```

#### Switch

Binary on/off toggle. Extracted from Figma Switch (1:446) — 4 variants across
`Active` × `Hover`, all 36×20.

- **Base**: `.va-switch` on a native `<input type="checkbox" role="switch">` —
  the input is the track, the knob is `::before`
- **States**: `:hover`, `:checked`, `:checked:hover`, `:disabled`,
  `:focus-visible`
- **Dimensions**: 36×20 pill track (no border in any variant), 16px knob at
  2px inset, **16px travel** via the CSS `translate` property

| state     | track                                         | knob       |
| --------- | --------------------------------------------- | ---------- |
| off rest  | `Stroke/Border` (17% ink, **used as a fill**) | `BG/Paper` |
| off hover | `Stroke/Hover` (56% ink)                      | unchanged  |
| on rest   | `Primary`                                     | unchanged  |
| on hover  | `Primary/Hover`                               | unchanged  |

> **The off-track paints with STROKE-family tokens as fills** — `bg-stroke-border`,
> never `border-*`; a naive read of the token name would add a line that exists
> nowhere in the design. On the designer list as a naming oddity.
> **The knob ships shadowless**: Figma binds no effect variable and the
> export's faint spill (~1% in one variant) is not a spec. Designer list.
> **Knob diameter was the extraction's one cross-lane conflict** (authored
> 16×16 vs a 15px 1x-raster read) — authored metadata wins: 2+16+16+2 = 36
> exactly. The spec pins 16.
> **Disabled and Focus are DRAWN since 2026-10** (913:573/575, 914:703/705):
> disabled off-track `Stroke/Divider`, on-track `Primary/Disabled`, knob
> Paper; focus = `focus-ring-control`. A tap-target overlay extends the hit
> area to ≥24px (≥44px on touch). Not modelled, not invented: Pressed.

```html
<label style="display: inline-flex; align-items: center; gap: 16px;">
  Email notifications
  <input type="checkbox" role="switch" class="va-switch" checked />
</label>
```

#### ListItem

One row in a dropdown/selection list. Extracted from the REBUILT Figma List
Item set (786:6869; the old 1:463 is gone) — 36 variants: `Size` {sm 32, md
40, LG 48 — **Height-token pinned, no state changes height**} × `Selected` ×
`Hover` × `LastItem` × **`Critical`** (new).

- **Base**: `.va-list-option` — layout only, **a size class is required** (Figma's
  samples only show sm; no default is baked in). Named `-option`, NOT
  `-item`: `.list-item` IS Tailwind's own `display: list-item` utility and
  the collision stacked the rows (caught live; same trap later hit
  `.text-field-label` vs the `text-field-label` type token's utility)
- **Sizes**: `.va-list-option-sm` (Help & Caption 12px, 32px),
  `.va-list-option-md` (Labels Default 14px, 40px), `.va-list-option-lg`
  (Input 16px, 48px) — pinned via the Height tokens
- **Critical**: `.va-list-option-critical` — ink swaps to `Error/Base`
  (**the Error ramp's first consumer**); hover still washes; never combined
  with selection (undrawn)
- **Keyboard**: rows take **no focus ring** (the listbox contract — focus
  stays on the trigger; the consumer sets `data-active="true"` on the
  aria-activedescendant row and it paints the hover wash)
- **Parts**: `.va-list-option-text` (wraps, doesn't truncate), `.va-list-option-check`
  (18px sprite glyph, ALWAYS in markup, shown by selection)
- **States**: `:hover` (works on selected rows too — a real Figma variant),
  `[aria-selected="true"]` / `[aria-checked="true"]`, `:focus-visible`

> **Selection is an ink swap to `Primary`** — text and check inherit together
> via currentColor. No background.
> **The gap-collapse trick**: `gap` is unconditional 10px; the hidden check
> contributes none, so unselected rows read gap-0 with no conditional class.
> **The old sm 30→34 selected growth is GONE** — heights are pinned, and the
> 32px sm row absorbs the 18px check.
> **The divider is `:not(:last-child)`**, matching the LastItem boolean's
> intent structurally.
> Not modelled, not invented: disabled, pressed.

```html
<button
  class="va-list-option va-list-option-sm"
  role="option"
  aria-selected="true"
>
  <span class="va-list-option-text">English</span>
  <svg class="va-list-option-check" aria-hidden="true">
    <use href="#check" />
  </svg>
</button>
```

#### DropdownList

The panel holding ListItem rows. Extracted from Figma Dropdown List (1:480).

- **Base**: `.va-dropdown-list` — `BG/Paper`, 1px `Stroke/Divider` border, 4px
  radius, zero padding/gap, raw `0 2px 5px 10%` shadow

> The set's sm/md axis is a **real size axis since 2026-10** (32px vs 40px
> rows). Still no container size classes on purpose — size lives on the
> composed `.va-list-option-*` rows; a DropdownField panel uses **md** rows.
> **Two paired library choices — never "fix" one alone**: `overflow: clip` is
> a labeled extension (Figma has no clipping; hover fills would poke past the
> corners), and the shadow ships as `filter: drop-shadow()` because
> overflow-clip eats a box's own `box-shadow`.
> Width is the consumer's — the panel spans its trigger.

```html
<div class="va-dropdown-list" role="listbox">
  <button
    class="va-list-option va-list-option-sm"
    role="option"
    aria-selected="true"
  >
    …
  </button>
  <button
    class="va-list-option va-list-option-sm"
    role="option"
    aria-selected="false"
  >
    …
  </button>
</div>
```

#### RadioField

Labeled radio-group form field. Extracted from Figma Radio Fields (123:6059)
— 6 declared variants across `Filled` × `Hover` × `Focus`.

- **Parts**: `.va-radio-field` (a `<fieldset>`), `.va-radio-field-title` (a
  `<legend>`, Labels/Strong 14/500, `Text/Secondary`, optional
  `.va-radio-field-help` 18px icon slot), `.va-radio-field-options` (40px row,
  24px apart), `.va-radio-field-option` (a `<label>` composing the shipped
  `.va-radio`, 8px gap, Input 16/400), `.va-radio-field-hint` (optional, 12/400)
- **Error**: `aria-invalid="true"` on the fieldset (which needs an explicit
  `role="radiogroup"` — a native `<fieldset>` has none) turns
  `.va-radio-field-hint` to `Warning/Text`. **That is the entire treatment.**
- **Other states: none at field level, deliberately** — see below

> **Figma's state axes are UNWIRED — verified three independent ways**: all
> six variants bind identical variables, share identical structure, and
> render byte-identical pixels (`Filled` checks nothing; hover/focus draw
> nothing). All real interaction ships from the composed `.va-radio` (native
> tints, crimson `:checked`, focus-ring). Top designer-list item.

> **THE ERROR IS TEXT-ONLY, AND THAT IS THE DESIGN** (designer 2026-09-16,
> decision D2). Figma draws no error variant, and the sibling fields' treatment
> could not have been copied even if it did: TextField and TextArea react on
> their **border**, and a RadioField has no box and no border in any state. So
> the message alone carries it and the radio controls are untouched — a ring
> tint was considered and ruled out, because amber appears nowhere in Radio and
> adding it would have been invented style in a second component. Consequence,
> recorded so it is not re-opened as a bug: an unanswered required group's
> entire error signal is one line of amber text beneath it.
> **The helper icon is hidden in every Figma variant** — its recent redesign
> could not be verified from this set, and the current glyph is a
> chevron-left (reads as a placeholder). Designer list.
> **Option ink is raw `#000000` in Figma** (the file's only raw black) —
> shipped as `Text/Primary`; designer list. The `bottomContent` block's
> authored geometry is broken (absolute −59px/−313%) — `.va-radio-field-hint`
> ships in normal flow as a labeled correction.
> No disabled state exists on RadioField — and since 2026-10-13 that is a
> DECISION, not a gap: the designer closed the field family's disabled gap
> (TextField/TextArea/DropdownField shipped; Checkbox already had one) and
> deliberately excluded Radio, Switch and this composed field
> (docs/ticket-disabled-state-field-family.md, now resolved).
> **The legend zeroes its UA inline padding (`px-0`)** — Chromium gives `<legend>`
> 2px each side; preflight hides that, the standalone `./styles.css` path did not,
> and the title rendered 2px right of its options (caught by the BSA Val run's
> accuracy gate, fixed after 1.3.0).

```html
<fieldset class="va-radio-field">
  <legend class="va-radio-field-title">Do you have an existing account?</legend>
  <div class="va-radio-field-options">
    <label class="va-radio-field-option">
      <input type="radio" name="existing" class="va-radio" checked />
      Yes
    </label>
    <label class="va-radio-field-option">
      <input type="radio" name="existing" class="va-radio" />
      No
    </label>
  </div>
</fieldset>
```

#### SelectCard

Selectable / navigational option card. Extracted from Figma Card (9:367) —
6 variants: `Hover` × `Radio` × `Pressed`.

- **Base**: `.va-select-card` — 16px padding, 12px gap, 6px radius, a
  **0.5px ring in every state** (2026-10; an inset box-shadow — Chrome floors
  a 0.5px border to 1px), 76px content-driven height. **Focus is a drawn
  axis** → `focus-ring-control`.
- **Parts**: `.va-select-card-text`, `.va-select-card-title` (Labels Strong 14/500),
  `.va-select-card-description` (optional — Figma's subtitle boolean),
  `.va-select-card-chevron` (18px, `Neutral/Base`)
- **Two exclusive variants**: a `<label>` composing the shipped `.va-radio`
  (selection card), or a `<button>` with the trailing chevron (navigation)

| state                                    | border            | fill                                        |
| ---------------------------------------- | ----------------- | ------------------------------------------- |
| rest                                     | `Stroke/Divider`  | `BG/Paper`                                  |
| `:hover`                                 | `Stroke/Hover`    | **unchanged** (pixel-proven perimeter-only) |
| `:active` (chevron variant)              | unchanged token   | `Action/Pressed` wash                       |
| **selected** (`:has(.va-radio:checked)`) | `Primary/Primary` | `Primary/BG`                                |

> **Figma's "Pressed" on the radio variant means SELECTED** — persistent, with
> the nested radio checked; driven here by `:has(:checked)` from the real
> input state (CSS-only, no class to sync). The chevron variant's pressed is
> a transient wash. Two strategies for one axis — designer list.
> **The pressed border only LOOKS darker** — constant translucent
> `Stroke/Divider` over the tinted fill (Checkbox precedent).
> **The chevron layer is named ChevronLeft but renders right** — shipped as
> `#chevron-right`; designer list.
> Hover/active exclude the selected card by name (`:not(:has(:checked))`) —
> Figma draws no selected+hover. Not modelled, not invented: disabled, focus
> variants (library focus-ring).

```html
<label class="va-select-card">
  <input type="radio" name="join" class="va-radio" checked />
  <span class="va-select-card-text">
    <span class="va-select-card-title">Family Connection</span>
    <span class="va-select-card-description"
      >A relative is already a member</span
    >
  </span>
</label>

<button class="va-select-card">
  <span class="va-select-card-text">
    <span class="va-select-card-title">Family Connection</span>
    <span class="va-select-card-description"
      >A relative is already a member</span
    >
  </span>
  <svg class="va-select-card-chevron" aria-hidden="true">
    <use href="#chevron-right" />
  </svg>
</button>
```

#### Tabs

Chip-style tab item, two types. Extracted from Figma Tabs (23:825) — 7
variants: `Type` {Portal, Application} × `Hover` × `Active`.

- **Base**: `.va-tab` — layout + shared ink ramp; **a type class is required**
- **Types**: `.va-tab-portal` (ghost — bare until active, then a neutral
  `Action/Active` wash), `.va-tab-application` (always boxed — Paper +
  `Stroke/Divider` ring, crimson when active)
- **Row**: `.va-tabs` — **unsourced structural extension** (no tablist frame in
  Figma yet)
- **States**: `:hover` (ink preview, weight unchanged),
  `[aria-selected="true"]` (ink + weight 400→500), `:focus-visible`
- **Geometry**: 32px (`var(--height-sm)` token-bound since 2026-10; was a
  34px hug), 12px x-padding (zero y — height is the token), 8px gap, 4px
  radius, 16px caller icon slot. **Focus is a drawn axis** →
  `focus-ring-control`.

> **No underline exists** — every active cue is fill/ring/ink
> (pixel-verified; the dashboard's underline-tab instincts don't apply).
> **The Application ring is an inset box-shadow**: height is hug-driven, so a
> real border would render 36px, not the drawn 34.
> **Portal active+hover is a near-invisible token swap** (`Action/Active` →
> `Action/Focused`, Δ6/255) — reproduced faithfully; designer list.
> **Application active+hover is undrawn** — the hover rule excludes the
> selected tab by name.
> **The active weight step reflows the hug ~1px** (Figma's own; designer
> list). Not modelled, not invented: disabled, pressed.

```html
<div class="va-tabs" role="tablist" aria-label="Application steps">
  <button class="va-tab va-tab-application" role="tab" aria-selected="true">
    <svg aria-hidden="true"><use href="#user" /></svg>
    Your details
  </button>
  <button class="va-tab va-tab-application" role="tab" aria-selected="false">
    <svg aria-hidden="true"><use href="#banknote" /></svg>
    Funding
  </button>
</div>
```

#### TextSelector

Language-picker dropdown trigger. Extracted from Figma Text Selector (1:489) —
12 variants across `Hover` × `Active` × `Mobile`, all 18px tall.

- **Parts**: `.va-text-selector` (the button row), `.va-text-selector-icon` (16px
  globe), `.va-text-selector-label` (Help & Caption 12/400, natural case),
  `.va-text-selector-chevron` (18px, rotates)
- **States**: `:hover`, `[aria-expanded="true"]`, `:focus-visible`
- **Ink-only** — no box, fill, border, or padding at any state (the
  `.va-btn-micro` posture)

| state                    | label            | icons                                             |
| ------------------------ | ---------------- | ------------------------------------------------- |
| rest                     | `Text/Tertiary`  | `Neutral/Disabled` (60% — lighter than the label) |
| `:hover`                 | `Text/Secondary` | **unchanged**                                     |
| `[aria-expanded="true"]` | `Text/Primary`   | `Neutral/Base` full opacity + chevron 180°        |

> **The design file contains duplicate `Hover=yes` variants** — two node
> groups with different treatments under the same declared properties. Shipped
> reading (pattern-consistency + node-ID locality): the modest one-token step
> is `:hover`; the two-property near-black step is the OPEN state, wired to
> `aria-expanded` together with the chevron rotation (Figma models rotation on
> a separate Active axis; coupling them is a deliberate simplification). Both
> on the designer list.

> **Mobile is a label swap only** ("English" → "EN") — pass the short label;
> no modifier class exists or is needed.

```html
<button class="va-text-selector" aria-haspopup="listbox" aria-expanded="false">
  <svg class="va-text-selector-icon" aria-hidden="true">
    <use href="#globe" />
  </svg>
  <span class="va-text-selector-label">English</span>
  <svg class="va-text-selector-chevron" aria-hidden="true">
    <use href="#chevron-down" />
  </svg>
</button>
```

#### Owner

Icon-in-a-box owner marker. Extracted from Figma Owner (261:13225) — 3
variants on one `Type` axis {individual, Add, company}, all 34×34, **no state
axis**.

- **Base**: `.va-owner` — 34px rounded square (**4px radius — NOT a circle**;
  deliberately distinct from the circular, initials-only Avatar), `Neutral/BG`
  fill, glyph in `Neutral/Base`
- **One class, no type modifiers** — the three Figma variants are
  byte-identical at the token level and differ only by glyph; the glyph is a
  caller slot (IconButton precedent): `#user` / `#plus` / `#building`

> **No stroke on any variant** — the Add tile was pixel-scanned for a dashed
> ring and has none. **Icon-only forever** — no text layer exists in any
> variant. Static decoration: never a button, no states drawn or invented.
> Geometry closes exactly (8+18+8 = 34); shipped as a pinned flex box.

```html
<span class="va-owner"
  ><svg aria-hidden="true"><use href="#user" /></svg
></span>
<span class="va-owner"
  ><svg aria-hidden="true"><use href="#plus" /></svg
></span>
<span class="va-owner"
  ><svg aria-hidden="true"><use href="#building" /></svg
></span>
```

#### OwnerContainer

One row in the owners list. Extracted from Figma Owner Container (274:258) —
2 variants (`Property 1` = Person / Company), 509×92.5, **no state axis**.

- **Parts**: `.va-owner-container` (the row), `.va-owner-container-info` (column),
  `.va-owner-container-title` (34px pinned row: `.va-owner-container-name` flex-1
  truncating + optional `.va-badge` + `.va-owner-container-percent`),
  `.va-owner-container-contact` (18px pinned row: `.va-owner-container-contact-text`
  flex-1 + `.va-owner-container-actions`)
- **Pure composition, no variant classes** — Person vs Company differ ONLY by
  the Owner glyph and copy (zero variable/structural deltas, lane-verified).
  Composes the shipped Owner, Badge, `.va-btn-micro` (Edit) and
  `.va-icon-button-sm.va-icon-button-state` (delete) unmodified.

> **The divider is a 0.5px inset box-shadow, height pinned `h-[92.5px]`** —
> Figma draws a bottom-only 0.5px `Stroke/Divider` hairline (pixel-confirmed
> at half coverage); a border would be floored to 1px AND add height. Math:
> 16+34+8+18+16 = 92, + 0.5. A Gate-0 metadata read said 94.5 — three
> independent reads + arithmetic + pixels say 92.5 (the 94.5 matches the
> hairline-adds-2px trap applied to a rendered read); designer list.
> **No background, side borders, or radius** — a bare list row (ListItem
> posture), not a card. Width is the caller's (509 is the sample hug).
> **Actions live IN the contact row** (342+8+69 = 419 exactly), trailing the
> text. The delete button is icon-only — always give it an `aria-label`.
> **The badge is Figma's `tag` boolean, hidden by default** — toggle the
> `hidden` attribute, no modifier class.
> **Title/contact row heights (34/18) are frame authority** — both exceed
> their line boxes with no authored padding; Button's h-12 precedent.
> **Figma's glyph layers are misnamed** ("arrow-right" renders a pencil,
> "ChevronLeft" a trash can — SelectCard defect class); ships `#pencil` /
> `#trash-2`. Percent's type style is inferred (single title-level binding,
> matching ink — medium confidence). Both on the designer list.
> **Semantics**: a list row with actions, never a button — mount as `<li>` in
> a list (or `role="listitem"`); only the two nested actions are interactive.

```html
<div class="va-owner-container">
  <span class="va-owner"
    ><svg aria-hidden="true"><use href="#user" /></svg
  ></span>
  <div class="va-owner-container-info">
    <div class="va-owner-container-title">
      <span class="va-owner-container-name">John Smith</span>
      <span class="va-badge" hidden>Optional</span>
      <span class="va-owner-container-percent">20%</span>
    </div>
    <div class="va-owner-container-contact">
      <span class="va-owner-container-contact-text"
        >(123) 456-7890 · john.smith@valiify.com</span
      >
      <div class="va-owner-container-actions">
        <button class="va-btn va-btn-micro">
          Edit <svg aria-hidden="true"><use href="#pencil" /></svg>
        </button>
        <button
          class="va-icon-button va-icon-button-sm va-icon-button-state"
          aria-label="Remove John Smith"
        >
          <svg aria-hidden="true"><use href="#trash-2" /></svg>
        </button>
      </div>
    </div>
  </div>
</div>
```

#### TextField

Labeled single-line text input. Extracted from Figma Plain Text Field (1:291)
— 9 variants on a **partial** `Filled` × `Hover` × `Focus` × `Error` matrix
(no empty+error, no hover+focus, no disabled), all 413×73.

- **Parts**: `.va-text-field` › `.va-text-field-title-row` (25px: `.va-text-field-title`
  - optional `.va-text-field-help` 18px icon-button) › `.va-text-field-box` (48px
    pinned wrapper div — a native input can't host the icon slots; state styling
    hangs off it via `:has()`) › `.va-text-field-input` (the native input) +
    optional `.va-text-field-icon` (18px, leading/trailing) › `.va-text-field-hint`
- **Currency fields take `.va-text-field-icon-currency`** alongside the slot
  class, with the sprite symbol `#custom-currency-dollar` (1.4.3). Figma's
  currency mark is a FILLED path, the only one in the family that is, so the
  slot's Lucide line-icon paint is wrong for it: drawn as a stroke it measured
  11×16.5 css against the reference's 7.5×14, in a darker ink, and pushed the
  value run 1px right. The modifier swaps to `fill: currentColor` and binds
  **`Neutral/Base`** — established by a Plugin API read of the rendered
  vector's `boundVariables`, not by matching the hex, since `#6F7276` is also
  `Text/Tertiary`'s value. Slot size is unchanged (10×18 in a 24 viewBox →
  7.5×13.5 at 18px). `.va-text-field-icon` itself is untouched.
- **States**: `:hover`, `:has(:focus)` (any focus — Figma's Focus axis is the
  caret), `aria-invalid="true"` (error), `:focus` ring on error too

| state       | border (1px, border-box)                           | extra                             |
| ----------- | -------------------------------------------------- | --------------------------------- |
| rest        | `Stroke/Border`                                    | —                                 |
| `:hover`    | `Stroke/Hover`                                     | —                                 |
| focus       | `Primary`                                          | + 3px Primary Ring (`focus-ring`) |
| error       | **`Warning/Base`** (amber — verbatim)              | —                                 |
| error+hover | **unchanged** (unwired in Figma; excluded by name) | —                                 |
| error+focus | border stays amber                                 | **crimson ring still fires**      |

> **THE PART CLASS IS `-title`, NOT `-label`** — a `.text-field-label` class
> collides with the `text-field-label` type token's generated utility
> (utilities out-cascade components; the `.list-item` lesson). RadioField's
> `-title` naming adopted family-wide.
> **The label binds `text-label-strong` (14/20/500), NOT the
> `text-field-label` token (13/16)** — verbatim in all nine variants; that
> token is used by no shipped component yet. Designer list.
> **Error binds the WARNING ramp** — settled with variables AND pixels across
> both field sets; no Error/* token appears anywhere. The Error-ramp question
> is closed as an authoring slip until the designer rebinds.
> **Fill, label ink and value ink never change in any state** (pixel-verified)
> — border-only reactions. The placeholder/value ink swap is native
> `::placeholder` (`Text/Hint` → `Text/Primary`), no Filled class.
> **The hint ships in normal flow** — Figma's bottomContent geometry is broken
> (absolute −19px/−313%, the RadioField defect verbatim, all three fields).
> Error hint ink `Warning/Text` is INFERRED (row hidden in every variant).
> **Placeholder contrast fails WCAG as authored** (Text/Hint 3.11:1) — axe
> can't see `::placeholder` here but flags the same ink on DropdownField;
> waived in KNOWN_ISSUES with rationale. Designer list.
> **Disabled shipped 2026-10-13** (865:5431 — the long-flagged family gap is
> closed): box `BG/App Page` + `Stroke/Divider`, value/placeholder ink
> `Text/Tertiary`, title and hint unchanged. Drawn empty+rest only —
> disabled+error/filled/hover are undrawn (hover excluded by name; the
> disabled rule sorts last so it wins the undrawn error compound).

```html
<div class="va-text-field">
  <div class="va-text-field-title-row">
    <label class="va-text-field-title" for="fname">First name</label>
  </div>
  <div class="va-text-field-box">
    <input
      id="fname"
      class="va-text-field-input"
      type="text"
      placeholder="Jane"
    />
  </div>
</div>

<!-- error: aria-invalid drives it; describedby wires the hint -->
<div class="va-text-field">
  <div class="va-text-field-title-row">
    <label class="va-text-field-title" for="email">Email</label>
  </div>
  <div class="va-text-field-box">
    <input
      id="email"
      class="va-text-field-input"
      type="email"
      aria-invalid="true"
      aria-describedby="email-hint"
    />
  </div>
  <p id="email-hint" class="va-text-field-hint">Enter a valid email address.</p>
</div>
```

#### DropdownField

Labeled listbox-trigger field. Extracted from Figma Dropdown Field (1:358) —
9 variants, same partial matrix and 413×73 anatomy as TextField.

- **Parts**: `.va-dropdown-field` › `.va-dropdown-field-title-row` /
  `.va-dropdown-field-title` (+ optional `.va-dropdown-field-optional` right slot,
  `.va-dropdown-field-help`) › `.va-dropdown-field-trigger` (a `<button>`, 48px
  pinned, `aria-haspopup="listbox"`) › `.va-dropdown-field-value`
  (+ `-value-placeholder` for the unselected ink) + `.va-dropdown-field-chevron`
  › `.va-dropdown-field-hint`
- **NOT a native `<select>`** — composes the shipped `.va-dropdown-list` +
  `.va-list-option` panel (consumer JS positions and toggles it; TextSelector
  precedent)
- **States**: `:hover`, `:focus-visible` OR `[aria-expanded="true"]` (Primary
  border + ring), `[aria-invalid="true"]` — same ramp as TextField, all the
  same exclusions/compounds; **disabled** (865:4512, added 2026-10-13):
  trigger `BG/App Page` + `Stroke/Divider`, value ink `Text/Tertiary`,
  chevron constant `Neutral/Base` — drawn empty+rest only

> **The chevron flips 180° on `[aria-expanded="true"]` ONLY** — never on bare
> keyboard focus (arrow direction tracks the PANEL). Structurally verified in
> Figma (the icon's bbox shifts by exactly its own w/h — the corner-rotation
> signature). Uses the CSS `rotate` property (Tailwind v4).
> **Chevron ink is `Neutral/Base`, constant in EVERY state** including error
> (no amber tint) — pixel + variable verified. Glyph is `#chevron-down`
> (Code Connect-resolved; the Figma layer name lies).
> **The error rule is written AFTER the open rule on purpose** — equal
> specificity, so source order gives error+open its amber border while the
> ring and rotation (separate properties) persist. Do not reorder.
> **Unselected accessible name = the label alone** — the placeholder span is
> `aria-hidden` decoration and `aria-labelledby` lists only the title id;
> with a selection, drop `aria-hidden` and append the value id ("label,
> value"). A `<label for>` on a button would clobber the name — use
> `aria-labelledby`.
> **The placeholder ink fails WCAG contrast as authored** (3.11:1) — the one
> waived KNOWN_ISSUES entry in the a11y scanner; designer list.
> **Open-panel positioning is the methodology's §11 recipe** (added 2026-09-17):
> wrap the trigger in `va:relative`; panel `va:absolute va:left-0 va:top-full
va:mt-1 va:w-full va:z-60`. The 4px offset is a library decision — Figma draws
> no open panel.

```html
<div class="va-dropdown-field">
  <div class="va-dropdown-field-title-row">
    <span id="at-label" class="va-dropdown-field-title">Account type</span>
  </div>
  <button
    class="va-dropdown-field-trigger"
    type="button"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-labelledby="at-label"
  >
    <span
      id="at-value"
      class="va-dropdown-field-value va-dropdown-field-value-placeholder"
      aria-hidden="true"
      >Select an account type</span
    >
    <svg class="va-dropdown-field-chevron" aria-hidden="true">
      <use href="#chevron-down" />
    </svg>
  </button>
</div>
```

#### TextArea

Labeled multi-line text input. Extracted from Figma Text Area Field
(199:12523) — 6 variants (`Filled` × `Hover` × `Focus`), all 413×104.
**Figma draws no Error variant; the error state is a labeled extension**
added 2026-09-16 on the designer's decision (D1/D3), reproducing the sibling
TextField's shipped treatment rather than inventing one.

- **Parts**: `.va-text-area` › `.va-text-area-title-row` / `.va-text-area-title`
  (+ optional `-optional`, `-help`) › `.va-text-area-input` (the native
  `<textarea>` IS the box — no icon slots to host) › `.va-text-area-hint`
- **Box**: `h-[79px]` pinned (off Tailwind's scale on purpose), `px-3`
  **`py-2.5`** — the 10px y-padding is authored and differs from the
  siblings (designer list) — top-anchored text, same border/ring ramp as
  the family (token-verified zero deviations)
- **Error**: `aria-invalid="true"` on the `<textarea>` → border `Warning/Base`,
  hint `Warning/Text`. Error+hover is excluded by name (stays amber);
  error+focus keeps the amber border while the crimson ring still fires — the
  error rule **sorts after the focus rule** and that order is load-bearing
- **Disabled** (865:5526, added 2026-10-13): fill `BG/App Page` + border
  `Stroke/Divider`, ink `Text/Tertiary`; drawn empty+rest only

> **Two labeled corrections of Figma defects**: the value node carries the
> Input style's single-line nowrap/ellipsis (copy-paste artifact — wrapping
> ships, the defect doesn't; a spec check guards the regression), and no
> overflow-clip (it would suppress the scrollbar a fixed-height textarea
> needs).
> **`resize: none` is a library decision, flagged as such** — Figma draws no
> grabber and no overflow state; callers opt in with a resize utility.

> **Amber is the error colour permanently** (designer 2026-09-16, decision
> D4) — across the whole field family. The token set defines a full `Error/*`
> ramp that nothing binds; for a long time that read as an authoring slip. It
> is not. Do not rebind field errors to `Error/*`. (The Toast type literally
> named `error` is a separate, still-open question about naming.)

```html
<div class="va-text-area">
  <div class="va-text-area-title-row">
    <label class="va-text-area-title" for="notes">Notes</label>
  </div>
  <textarea
    id="notes"
    class="va-text-area-input"
    placeholder="Anything else?"
  ></textarea>
</div>
```

#### Modal

Confirmation dialog card — the library's first overlay. Extracted from Figma
Modal (557:5127) — 3 variants on a `Type` axis {Destructive, Neutral,
Success}, 480 wide, 308/196/308 (heights emergent, not pinned).

- **Parts**: `.va-modal` (the card — works as a `<dialog>` or a div) ›
  `.va-modal-header` (`.va-modal-title` + a composed bare `.va-icon-button` close with
  `#x`) › `.va-modal-description` › optional `.va-modal-notice` +
  `.va-modal-notice-destructive` / `-success` (`.va-modal-notice-label`,
  `.va-modal-notice-body`) › `.va-modal-actions` (shipped `.va-btn-secondary` +
  `.va-btn-primary`, hug, right-aligned) — plus `.va-modal-backdrop` and
  `dialog.va-modal::backdrop`
- **No Type classes on the card** — Figma's Type axis IS the notice banner
  (Neutral omits it structurally; no boolean exists). The height math proves
  it: 196 + 88 banner + 24 gap = 308 exact.
- **Geometry**: `rounded-2xl` (12px), `p-7`/`gap-6`, notice `rounded-md p-4`

> **Both rings are inset box-shadows** — the card's 1px `Stroke/Divider` and
> the banner's 1px accent are inside strokes on CONTENT-DRIVEN heights (a
> real border renders the drawn 308 as 310 — Tabs-Application precedent).
> The card ring shares one declaration with **`--shadow-basic`** (the new
> tokenized "Basic Drop Shadow", 0 8px 24px −4px — also on DropdownList).
> **Destructive binds the PRIMARY (crimson) tints, not the Error ramp** —
> verbatim; the Error ramp remains unused everywhere in the file.
> **The Success banner is raw, unbound hex in Figma** (#f0fdf4/#16a34a/
> #15803d/#166534 — Tailwind-palette greens ≠ the tokenized Success ramp) —
> reproduced verbatim under static-ok waivers; top designer-list item.
> **Untokenized type**: title 18/24/600, notice label 12/16/600 uppercase,
> notice body 13/18 — raw in Figma, no `--text-*` matches (designer list).
> Figma's title `whitespace-nowrap` is an overflow defect, corrected: titles
> wrap. A stray `cursor-pointer` on the actions ROW is excluded.
> **The backdrop is a labeled library extension** — no scrim exists anywhere
> in Figma; the wash (Content/Primary at 45% via color-mix) is unsourced.
> Z-scale per Library Contracts: backdrop z-50, modal z-60.
> **Primary path is the native `<dialog>` + `showModal()`** (free focus trap,
> Escape, restore-on-close, `::backdrop`); the `.va-modal-backdrop` div fallback
> requires the consumer's own focus trap and Escape — the library ships no
> JS. Backdrop-click dismissal is consumer JS in both paths.

```html
<dialog class="va-modal" aria-labelledby="m-t" aria-describedby="m-d">
  <div class="va-modal-header">
    <h2 id="m-t" class="va-modal-title">Delete this application?</h2>
    <button class="va-icon-button" aria-label="Close">
      <svg aria-hidden="true"><use href="#x" /></svg>
    </button>
  </div>
  <p id="m-d" class="va-modal-description">Are you sure you want to proceed?</p>
  <div class="va-modal-notice va-modal-notice-destructive">
    <span class="va-modal-notice-label">Critical warning</span>
    <span class="va-modal-notice-body">This action cannot be undone.</span>
  </div>
  <div class="va-modal-actions">
    <button class="va-btn va-btn-secondary">Cancel</button>
    <button class="va-btn va-btn-primary">Confirm</button>
  </div>
</dialog>
<!-- open with dialog.showModal(); ::backdrop is pre-styled -->
```

#### Tooltip

Dark contrast tooltip with an optional muted title. Extracted (inline
fast-path) from Figma tooltip (582:9178) — a single symbol, no variant axes.

- **Parts**: `.va-tooltip` (`BG/Contrast` ground, `rounded-lg`, `px-4 py-3`,
  `gap-2`, `shadow-basic`, authored `word-break`), `.va-tooltip-title`
  (optional — `text-field-label` in `Text/Hint`), `.va-tooltip-body`
  (`text-body-content` in `Text/Contrast`)

> **Two token firsts**: `BG/Contrast` (#1a1a1a) is a NEW variable added with
> this component (token 58, `--color-surface-contrast`), and the tooltip
> title is the previously-orphaned **`text-field-label` token's first
> consumer** (field labels themselves bind Labels/Strong — the token's name
> lies; designer list updated).
> **`max-w-[280px]` with content hug is a labeled library reading** —
> Figma's frame is a fixed 280 sample, but the authored word-break implies
> wrap-at-limit semantics; short tooltips hug.
> **Not modelled, not invented**: arrow/caret, placement, states. Anchoring
> and show/hide are the consumer's (Popover API pairs well); no z-index is
> baked. Wire `role="tooltip"` + the trigger's `aria-describedby`.

```html
<button
  class="va-icon-button"
  aria-label="What is a routing number?"
  aria-describedby="tip-1"
>
  <svg aria-hidden="true"><use href="#circle-help" /></svg>
</button>
<div class="va-tooltip" role="tooltip" id="tip-1">
  <span class="va-tooltip-title">Routing number</span>
  <span class="va-tooltip-body"
    >The nine-digit code on the bottom left of your checks.</span
  >
</div>
```

#### Toast

Transient floating notification. Extracted (inline fast-path) from Figma
Toast (582:9325) — a PARTIAL `Type` {success, error, info} × `Style` {Full,
Simple} matrix (Simple exists only as info).

- **Full**: `.va-toast` (Paper card, `rounded-lg`, `p-4`, inset Stroke/Divider
  ring + `shadow-basic` in one declaration — content-driven 66px, Modal
  precedent) + type class + `.va-toast-icon` (18px caller slot) +
  `.va-toast-content` (`.va-toast-title` Field Label / `.va-toast-body` help-caption)
  - a composed bare `.va-icon-button` dismiss
- **Simple**: `.va-toast-simple` — a STATUS-LESS dark `BG/Contrast` full-radius
  pill (15px glyph — off the icon grid, designer list; Content 13/16 in
  Text/Contrast). The Type axis is meaningless for it: no ramp token binds.
- Both carry `z-70` (Library Contracts). Positioning/timers/dismissal are
  the consumer's; `role="status"` for confirmations, `role="alert"` for
  failures.

> **THE STATUS RAMPS FINALLY BIND** — success → `Success/Base`, info →
> `Info/Base` — **but the Type literally named "error" binds `Warning/Base`
> (amber), verbatim**. The sharpest instance of the file-wide slip: the
> sibling variants prove ramps are wired deliberately. `.va-toast-error` paints
> `text-warning` faithfully; rebind when the designer does.
> The Type class paints ONLY the icon (title/body inks constant). Pass the
> matching glyph: `#circle-check` / `#circle-alert` / `#info`.

```html
<div class="va-toast va-toast-success" role="status">
  <svg class="va-toast-icon" aria-hidden="true">
    <use href="#circle-check" />
  </svg>
  <div class="va-toast-content">
    <span class="va-toast-title">Document request sent</span>
    <span class="va-toast-body"
      >Client has been notified to upload their W-9.</span
    >
  </div>
  <button class="va-icon-button" aria-label="Dismiss">
    <svg aria-hidden="true"><use href="#x" /></svg>
  </button>
</div>

<div class="va-toast-simple" role="status">
  <svg aria-hidden="true"><use href="#check" /></svg>
  Template Saved
</div>
```

#### StatusTracker

One step marker in the portal's application-status track. Extracted (inline
fast-path) from Figma Application Status (64:4623) — `Active` {no, yes},
93×16.

- **Base**: `.va-status-tracker` (Field Label type, `Text/Tertiary`, 14px glyph
  slot painted by currentColor, `gap-2`) + `.va-status-tracker-active`
  (`Text/Primary`) — **the Active axis is an ink swap only**

> Not modelled, not invented: hover/focus (not interactive in Figma),
> connectors between steps, error/warning step states. Compose the track at
> the call site.

```html
<span class="va-status-tracker va-status-tracker-active">
  <svg aria-hidden="true"><use href="#check" /></svg>
  Application
</span>
```

#### Action

One row in the portal's action list. Extracted (inline fast-path) from Figma
Action (71:848) — 3 states: Pending / actionable rest / Done, 720×84 samples
(width the caller's, height emergent 20+44+20).

- **Parts**: `.va-action` (Paper row, `p-5`/`gap-4`, the OwnerContainer 0.5px
  inset-shadow hairline) + `.va-action-icon` (18px slot, constant
  Text/Secondary) + `.va-action-content` (`.va-action-title` title-medium /
  `.va-action-description` body-content Tertiary) + optional composed `.va-badge`
  - a trailing affordance per state
- **States**: rest (no class) — title `Text/Primary` + `.va-action-cta` (a real
  34px mini button: Paper, 1px Stroke/Divider border, Field Label + 18px
  `#arrow-right` — NOT any shipped `.va-btn` type); `.va-action-pending` — title
  demoted to Secondary + `.va-action-status` chip (12px `#lock` + micro-label
  in `Text/Hint`); `.va-action-done` — demoted title + chip (12px `#check` +
  micro-label in **`Success/Text`** — more status-ramp adoption)

> **The PENDING chip's Text/Hint-on-Paper fails WCAG (3.11:1)** — the same
> authored-ink defect as the field placeholders, waived in KNOWN_ISSUES;
> designer list. **Figma's arrow layer is named "AttachMoneyRounded"** and
> renders a forward arrow (the naming-lies family); ships `#arrow-right`.
> Not modelled, not invented: hover/pressed (only the CTA is interactive —
> library focus-ring covers it), disabled, compound states.

```html
<div class="va-action">
  <svg class="va-action-icon" aria-hidden="true">
    <use href="#shield-check" />
  </svg>
  <div class="va-action-content">
    <span class="va-action-title">Identity</span>
    <span class="va-action-description">Verify who you are</span>
  </div>
  <button class="va-action-cta">
    Verify <svg aria-hidden="true"><use href="#arrow-right" /></svg>
  </button>
</div>

<div class="va-action va-action-done">
  …
  <span class="va-action-status"
    ><svg aria-hidden="true"><use href="#check" /></svg>Done</span
  >
</div>
```

#### UtilityButton

The non-inline / special-use button family — a SIBLING of the Standard
appearance, not a skin on it. Originally Figma Button / Utility (24:4382);
since the 2026-10 merge it is the `Appearance=Utility` half of the unified
Button set (1:218) — 22 variants on a partial `Style` {Secondary, Primary,
Rounded, Text, Link} × `Size` {MD, SM} × `State` matrix (Disabled drawn for
Link only). See the Button section's Figma↔code mapping table.

- **Base**: `.va-utility-button` — layout only, **a type class is required**
  (the Standard button's rule); SM (34px) is the bare default,
  `.va-utility-button-md` (54px, drawn for Empty) modifies
- **Types**: `.va-utility-button-empty` / `-filled` / `-rounded` / `-text` /
  `-link` (class names predate the Figma renames; mapping in Button above)
- **Label convention**: Field Label 13/500 **natural case** (Text: Content
  13/400; Link: 16/400/24) — never the Standard set's uppercase Button Label
- **Icon slots**: plain `svg` children (18px; 16px in Text; **none on
  Link**), painted by currentColor so they ride the ink ramps; uniform
  swappable left/right slots since the merge (trailing on by default)

| type       | box                                  | rest → hover → pressed                                                                      |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `-empty`   | **GHOST** + 1px Stroke/Divider, 4px  | ink `Text/Primary` constant; fill none → `Action/Hover` → `Action/Pressed`; border constant |
| `-filled`  | solid, 4px, 1px Stroke/Divider ring  | `Primary → Primary/Hover → Primary/Focus`; white ink never fades                            |
| `-rounded` | ghost pill, no border ever           | none → `Action/Hover` → `Action/Pressed`; ink Secondary → Primary                           |
| `-text`    | bare 16px row, **no underline**      | ink Secondary → Primary (**hover = pressed**, byte-identical)                               |
| `-link`    | bare 24px inline row, **underlined** | ink `Primary → Primary/Hover → Primary/Focus`; disabled `Text/Tertiary` (underline stays)   |

**Heights are token-bound** (2026-10): SM rows `var(--height-sm)` 32 (was
34), `-md` `var(--height-lg)` 48 (was the hand-resized 54). **Disabled is a
drawn axis for every style, unified 2026-10-15 to the Standard treatment**:
no fill, `Stroke/Divider` border, label and icon `Text/Tertiary` — only
`-filled` differs (`Primary/Disabled`, white ink never fades). **Loading**
(`aria-busy`, drawn for Primary/Secondary SM) works as on `.va-btn`.
**Focus** = `focus-ring-control`; `-text`/`-link` carry tap-target
overlays.

> **The Empty border PERSISTS in every state** (changed in the 2026-10 merge —
> the old "rest-only border" reading is obsolete): one constant translucent
> `Stroke/Divider` compositing over the changing fill (Checkbox precedent).
> Paper still drops at hover/pressed — the wash sits over the page.
> **Filled gained the same constant Stroke/Divider ring** in the merge —
> near-invisible over crimson; designer list.
> **The Text type lost its underline** (Link is now the underlined style) and
> its old raw-#6f7276 ink stacking was **fixed by the designer** — rest ink is
> a clean Text/Secondary. Hover = pressed stays byte-identical. Its Size axis
> is still unwired (MD ≡ SM).
> **Link's state ramp is drawn per-variant since 2026-10-14**: Default binds
> `Primary/Primary`, Hover `Primary/Hover`, Pressed `Primary/Focus`, Disabled
> `Text/Tertiary` — and the underline never drops (the underline-off
> "disabled" style was deleted). Its type is **`Body & Supporting/Input`**
> (the duplicate "Buttons / Inline link" style was deleted too) — shipped as
> `text-input`, now the real binding, not a coincidence.
> **`Primary/Focus` is the pressed fill name again** — wired to `:active`.
> MD's authored w-214 is the sample-hug trap; width is the caller's.
> Not modelled, not invented: disabled for Empty/Filled/Rounded/Text (cursor
> only — **Link is the one Utility style with a designed disabled**), MD
> Filled/Rounded, focus variants (library ring).

```html
<button class="va-utility-button va-utility-button-empty">
  <svg aria-hidden="true"><use href="#dollar-sign" /></svg>
  Add Funds
</button>

<button class="va-utility-button va-utility-button-filled va-utility-button-md">
  Add Funds
</button>
<button class="va-utility-button va-utility-button-rounded">Add Funds</button>

<button class="va-utility-button va-utility-button-text">
  View statements
  <svg aria-hidden="true"><use href="#chevron-right" /></svg>
</button>

<!-- Inline link button — no icons, no box; crimson + underline -->
<button class="va-utility-button va-utility-button-link">Resend code</button>
```

#### OtpCell

One digit box of the OTP (one-time code) entry. Extracted from Figma
**OTP / Digit cell** (824:4856) — 4 variants on a single `State` axis
{Empty, Filled, Focused, Error}, all 56×56. Figma derives it "from the
established Plain Text Field input surfaces" (description, verbatim).

- **Base**: `.va-otp-cell` — applied **directly to a native `<input>`**, one
  input per digit; works standalone or composed by OtpField
- **States**: `:focus` (the caret state — TextField precedent, not
  `:focus-visible`), `aria-invalid="true"` (error), `:disabled` (**drawn
  since 2026-10**, 913:886: App Page fill + Divider border + Tertiary digit)
- **Dimensions**: 56×56 pinned (height AND width — never min-height), 4px
  radius, **a real 1px border** (measured exactly 1.00px; no fractional trap,
  so the Radio/Checkbox inset-shadow trick is deliberately NOT used)
- **Type**: `Metric/Small` (`text-metric-small`, 20/26/500) — the first form
  control on the Metric family; digit ink `Text/Primary`, centred

| state       | border (1px)                | extra                                                     |
| ----------- | --------------------------- | --------------------------------------------------------- |
| rest        | `Stroke/Border`             | —                                                         |
| `:focus`    | `Primary/Primary`           | 3px `Primary Ring` (library `focus-ring`) + crimson caret |
| error       | `Warning/Base` (amber — D4) | — (no ring)                                               |
| error+focus | border stays amber          | crimson ring still fires (rule order load-bearing)        |

> **Figma's Focused "digit" is a FAKE caret** — a literal `|` text glyph in
> `Primary/Primary`; no caret layer exists. Shipped as
> `caret-color: var(--color-primary)` with the digit ink constant (labeled
> reading; designer list). **Empty ≡ Filled in the masters** (0/3136 px — the
> digit prop defaults to a space); Empty's `Text/Hint` ink only ever paints a
> consumer-supplied `::placeholder`. **Radius is 4px authored** (two
> independent reads; a pixel fit read ≈5.4 within antialias error — authored
> wins, Switch-knob precedent). Not modelled, not invented: hover, disabled
> visual, pressed.

```html
<input
  class="va-otp-cell"
  type="text"
  inputmode="numeric"
  pattern="[0-9]"
  maxlength="1"
  autocomplete="one-time-code"
  aria-label="Digit 1 of 6"
/>
```

#### OtpField

The labeled six-digit OTP entry, composing OtpCell. Extracted from Figma
**OTP field** (815:9211) — 4 variants on a single `State` axis {Empty,
Focused, Filled, Error}, all 376×100 (title 25 + cells 56 + hint 19 — the
math closes exactly).

- **Parts**: `.va-otp-field` (a `<fieldset>`, `min-w-[376px]` — authored and
  load-bearing: the error message needs it), `.va-otp-field-title` (a
  `<legend>`, Labels/Strong 14/500 `Text/Secondary`, **`px-0`** — the
  RadioField UA-padding fix), `.va-otp-field-cells` (hug row, 8px gap —
  6×56+5×8 = 376, deliberately NOT `w-full`: "the digit row remains compact
  and left-aligned inside wider wrappers"), `.va-otp-field-hint`
  (Help & Caption 12/400, present in every state)
- **Error**: consumer sets `aria-invalid="true"` on **every** cell (Figma
  draws all six amber — no per-cell error) and swaps the hint copy; the hint
  ink turns `Warning/Text` via `:has()` off the real input state
- **Focus lives on the CELL**, never the field — Figma's Focused variant
  rings the next-empty cell

> **The library ships no JS**: auto-advance, backspace-to-previous,
> paste-distribution, select-on-focus and setting `aria-invalid` are consumer
> JS. Figma's `showLabel`/`showSupportingText` booleans have no CSS — omit
> the element. Cell count is fixed at six by the design. Title and hint inks
> never change except the hint's error swap. Not modelled, not invented:
> hover, disabled (the family gap), per-cell error, error+focus at field
> level.

```html
<fieldset class="va-otp-field" aria-describedby="otp-hint">
  <legend class="va-otp-field-title">Verification code</legend>
  <div class="va-otp-field-cells">
    <input
      class="va-otp-cell"
      type="text"
      inputmode="numeric"
      pattern="[0-9]"
      maxlength="1"
      autocomplete="one-time-code"
      aria-label="Digit 1 of 6"
    />
    <!-- ×6 -->
  </div>
  <p id="otp-hint" class="va-otp-field-hint">
    Enter the 6-digit code sent to you.
  </p>
</fieldset>
```

#### Address

The grouped address entry. Extracted from Figma **Address Super entry**
(281:4634) — 13 variants on a partial `Filled` × `Hover` × `Focus` ×
`Error` × `Disabled` matrix, ~518-wide samples. **Not a composition of
TextField**: one group box holds five bespoke cells in three rows, and every
state lives on the group.

- **Parts**: `.va-address` › `.va-address-title-row` / `.va-address-title`
  (Labels/Strong, `Text/Secondary`) › `.va-address-group` (Paper, 1px
  `Stroke/Divider`, 4px radius) › three `.va-address-row`s
  (`var(--height-lg)` each; **inner dividers are the darker
  `Stroke/Border`** — verbatim) › `.va-address-input` (bare native inputs,
  Input 16/400; `-city` 227px and `-state` 133px are authored fixed, ZIP
  flexes) + `.va-address-optional` › `.va-address-hint` (labeled family
  extension — **Figma draws no hint row**)
- **States**: hover → group border `Stroke/Hover`; `:focus-within` → Primary
  group border + the **3px FIELD ring** (not the control ring), and the
  focused ROW gains an inset 2px `Primary/Track` marker and drops its divider
  (281:4683 verbatim); error (`aria-invalid` on any input) → amber group
  border + hint ink `Warning/Text` (D4); disabled → App Page + Tertiary.
  Error+focus: amber border wins, ring still fires (rule order).

> **Figma flips the title style on the Focus variants** (Strong 14/20 →
> Field Label 13/16 — the 171-vs-167 frame-height split is exactly that);
> shipped consistent at Strong, designer list. Hover's bindings were
> rate-limit-unreadable — shipped from the set-level `Stroke/Hover` binding,
> labeled. Not modelled, not invented: hover+focus, disabled compounds,
> per-cell error. Autofill wiring and `aria-invalid` are consumer JS.

```html
<div class="va-address">
  <div class="va-address-title-row">
    <span class="va-address-title">Address</span>
  </div>
  <div class="va-address-group">
    <div class="va-address-row">
      <input
        class="va-address-input"
        placeholder="Address..."
        aria-label="Street address"
      />
    </div>
    <div class="va-address-row">
      <input
        class="va-address-input"
        placeholder="Apt, suite, unit"
        aria-label="Apartment, suite, or unit"
      />
      <span class="va-address-optional">Optional</span>
    </div>
    <div class="va-address-row">
      <input
        class="va-address-input va-address-input-city"
        placeholder="City"
        aria-label="City"
      />
      <input
        class="va-address-input va-address-input-state"
        placeholder="State"
        aria-label="State"
      />
      <input
        class="va-address-input"
        placeholder="00000"
        inputmode="numeric"
        aria-label="ZIP code"
      />
    </div>
  </div>
</div>
```

#### Upload

The file drop zone / picker row. Extracted from Figma **Upload** (778:6949)
— 3 variants, all 499×48: `Expanded` {no, yes} × `Completed` {No, yes}
(Expanded reads as the drag-over state; no set description exists).

- **Base**: `.va-upload` — a `<label>` wrapping a visually-hidden
  `.va-upload-input` (`<input type="file">`), `var(--height-lg)`, **8px
  radius** (the one 8px control), **DASHED** 1px `Stroke/Divider` border
  (stays 1px per the handoff; only a real border draws dashes)
- **Parts**: `.va-upload-left` › `.va-upload-icon` (18px — ship `#upload`,
  or `#file` when complete; Figma's layers are named "ChevronLeft", the
  naming-lies family) + `.va-upload-prompt` with the `.va-upload-browse` run
  (**`Info/Base`** — raw #1b4e8b in Figma, the token's exact hex) ›
  `.va-upload-meta`
- **States**: `.va-upload-active` (drag-over — consumer JS on dragover):
  `Action/Hover` fill + dashed `Stroke/Hover`; `.va-upload-complete`: solid
  border + App Page fill + `.va-upload-filename` (`Text/Primary`) + a
  composed `.va-utility-button-text` Remove. Focus on the hidden input rings
  the row (`focus-ring-control`).

> Not modelled, not invented: Expanded=no+Completed=yes, disabled, error,
> progress. Drag events, file handling and the state classes are consumer
> JS — the library ships none. Figma's drawn Remove is a STALE underlined
> instance of the old Utility Text style — compose the current one
> (designer list).

```html
<label class="va-upload">
  <input class="va-upload-input" type="file" />
  <span class="va-upload-left">
    <svg class="va-upload-icon" aria-hidden="true"><use href="#upload" /></svg>
    <span class="va-upload-prompt"
      >Drop a file here or
      <span class="va-upload-browse">choose a file</span></span
    >
  </span>
  <span class="va-upload-meta">PDF, JPG, PNG · 20 MB</span>
</label>
```

---

Further components will be documented here as they are extracted from the
Short App Figma file, one section per component, following the format used in
[_dashboard-archive/DASHBOARD-CLAUDE.md](_dashboard-archive/DASHBOARD-CLAUDE.md).

### Design Tokens (complete enumeration 2026-09-02)

**59 colors, 8 radii, 13 spacing values, 24 text styles (+5 unconsumed), 3 effects (the focus
ring and Basic Drop Shadow).** Colors/spacing/radii come from a **complete Plugin API enumeration of
the file's local variable collection** (`use_figma` →
`figma.variables.getLocalVariableCollectionsAsync` — all 77 variables, applied
or not); typography from the type-preview section (1:2) plus component sweeps.
Browse them rendered in Storybook under **Foundations → Design Tokens**.

> **Re-enumerated 2026-10-13 (the Button-merge sweep, twice).** Collection 1
> is byte-identical — all 58 colors (Primary ramp verified), 13 spacing, 8
> radius values unchanged, and it is again the **only** collection: two
> single-variable `button/*` collections that briefly appeared with the merge
> were **removed the same day** ("no new color tokens" — the button variants
> now bind `Text/*` / `Primary/*` directly, and the library never emitted
> them). Also new: **5 text styles** (29 total) —
> `Buttons / Inline link` (16/24/400, underlined; numerically = `text-input`),
> `Buttons / Inline link disabled` (same, underline off),
> `Display & Title/Next` (19/26/600, unused), and `Metric/Mono 24` + `Metric/
Mono 20` which are **Inter, not mono** (the names-that-lie family; values =
> metric-medium-ish 24/30/500 and metric-small 20/26/500). None is tokenized
> until a component consumes it (Inline link ships as `text-input`, labeled
> coincidence — later made the REAL binding when the duplicate styles were
> deleted on 2026-10-14).
>
> **2026-10-14 (the go-live handoff sweep):** the collection gained the
> **`Height/*` variables** (SM 32 / MD 40 / LG 48 / XL 56; an XS=24 appeared
> briefly and was deleted on 10-15 — never consumed), emitted as
> `--height-*`; component frames BIND them, and
> the library sets control heights as `height: var(--height-*)` with zero
> y-padding — never padding + line-height math. Two LIBRARY constants ride
> along: `--target-min: 24px` and `--target-touch: 44px` (the tap-area
> contract written into the Figma component descriptions; not Figma
> variables). A new **"Focus Ring" effect style** landed (2px BG/Paper gap +
> 2px solid Primary/Primary) → the `focus-ring-control` utility; fields keep
> the original 3px `Primary Ring`. Casing: **fully resolved** — Tag &
> Pill, both Lockups AND Data Key (added 10-15) carry UPPER transforms, all
> baked into `type-*` utilities; the Micro button's label binds Eyebrow. The
> Metric/Mono styles are real JetBrains Mono now.

> **The applied-only sweep missed 26 of the 56 colors** — the entire Error and
> Info ramps, the Success/Warning/Neutral tint sets, `BG/Page`, `BG/Card` —
> plus ALL spacing and radius variables. The Plugin API enumeration is the
> authoritative completeness source; re-run it when the designer adds tokens.

**Colors** — `Main`-equivalents are unsuffixed (`Primary/Primary` and
`Neutral/Base` both count as the ramp's main shade):

- Primary (crimson): `--color-primary` (#a6192e) / `-hover` / `-focus` /
  `-disabled`, plus tints `-text` / `-bg` / `-ring` / `-track`
- Neutral: `--color-neutral` / `-hover` / `-text` / `-disabled` / `-bg` /
  `-ring` / `-stroke` / `-stroke-hover`
- Content (Figma group **Text**): `--color-content-primary` / `-secondary` /
  `-tertiary` / `-hint` / `-contrast`
- Surface (Figma group **BG**): `--color-surface-paper` (#fffdfb) /
  `-app-page` (#fafaf9) / `-page` (#fdf8f5) / `-card` (#f1f0ee) /
  `-contrast` (#1a1a1a, added with Tooltip) / `-skeleton` (#e4e7eb, added 2026-10-15 for the Skeleton fill)
- Stroke: `--color-stroke-border` / `-divider` / `-hover` (all translucent ink)
- Action: `--color-action-hover` / `-pressed` / `-active` / `-focused`
- Status — **four full ramps**, each Base + Text + BG/Ring/Stroke/Stroke-Hover
  tints: `--color-success*` (#2e6e4e), `--color-warning*` (#b4791c, Text
  #8b5d16), `--color-error*` (#c0362c), `--color-info*` (#1b4e8b)

> **The Figma groups `Text` and `BG` map to the public prefixes `content` and
> `surface`** — avoiding `text-text-secondary` / `bg-bg-paper` utilities and
> matching the dashboard library's API shape. The mapping lives in
> `COLOR_GROUPS` in [scripts/build-theme.mjs](scripts/build-theme.mjs).

> **The Error ramp has its FIRST consumer (2026-10): ListItem's Critical
> axis binds `Error/Base`** for destructive rows. Everything error-shaped on
> FIELDS stays amber (`Warning/*`) per decision D4 — the two ramps now
> coexist deliberately: amber = consumer-facing field errors, red =
> destructive actions.

**Radii** — Figma's scale IS Tailwind's t-shirt naming; emitted verbatim.
xs/sm/md/lg (2/4/6/8px) are byte-identical to Tailwind v4's defaults;
`--radius-xl` (10px) and `--radius-2xl` (12px) **deliberately override**
Tailwind's 12/16 so `rounded-xl` / `rounded-2xl` mean this design system's
corners. `Radius/none` and `Radius/full` are not re-emitted (native
`rounded-none` / `rounded-full` already match). This is the opposite call from
the dashboard library's role names — that file's scale diverged from Tailwind
everywhere; this one builds on it.

**Spacing** — 13 whole-px variables (2–64), every one an exact native Tailwind
step (divide by 4: `Spacing/8` → `p-2`, `Spacing/64` → `p-16`). No
`--spacing-*` tokens on purpose — defining `--spacing-8: 8px` would make `p-8`
mean 8px instead of 32px.

**Typography** — 24 composite `--text-*` tokens, all Inter, line heights
authored in px (only `Link` is Auto):

| Role            | tokens                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display & Title | `text-display` 28/34 · `text-display-large` 30/38 · `text-title` 22/26 · `text-title-medium` 16/20 (all 500)                                                                                                                                                                                                                                                      |
| Metric          | `text-metric-large` 30/34 · `text-metric-medium` 26/30 · `text-metric-small` 20/26 (all 500)                                                                                                                                                                                                                                                                      |
| Body            | `text-lead` 16/24/500 · `text-body` 15/20 · `text-input` 16/24 · `text-body-content` 13/16 · `text-help-caption` 12/14                                                                                                                                                                                                                                            |
| Labels & UI     | `text-label` 14/20 · `text-label-strong` 14/20/500 · `text-field-label` 13/16/500 · `text-button-label` 14/20/600+10% · `text-link` 14/Auto · `text-eyebrow` 11/16/600+10% · `text-tag-pill` 11/16/600+5% · `text-timestamp` 12/16 · `text-data-key` & `text-micro-label` 9/12/600+8% · `text-lockup-wordmark` 15/17/600+10% · `text-lockup-tagline` 9/11/500+16% |

> **Casing is not baked into any token.** The preview renders Eyebrow,
> Micro-Label, Button Label, Tag & Pill, Data Key and the Lockup styles
> uppercase, but the API exposes no transform binding — casing stays the
> caller's (Chip/Divider precedent) until confirmed per component.

**Focus ring** — Figma's `Primary Ring` effect: spread-only drop shadow,
0/0/0/**3px** in `Primary/Ring` (#a6192e38). Ships as the `focus-ring` utility
(outline at offset 0 — the ring sits **outside** the element, unlike the
dashboard's inset ring) and as `--shadow-focus-ring` for real-shadow cases.

**Radii / spacing / border widths** — **this file defines no such variables**;
geometry is raw per component (verified across 16 subtree sweeps). No
`--radius-*` or `--border-*` tokens are emitted yet; introduce role tokens only
if recurring raw values emerge. Spacing stays on Tailwind's native scale.

The pipeline is generated — do not edit the theme CSS by hand:

```
tokens/figma-tokens.json  ──scripts/build-theme.mjs──>  src/themes/valiify.css
```

Regenerate with `npm run build:theme` (also runs as part of `npm run build`).
To pick up Figma changes, re-extract into the JSON, then regenerate.

Tokens live in a Tailwind `@theme` block, so **each one generates utilities** —
that is the intended way to consume them (`--color-primary` → `bg-primary`,
`text-primary`; `--radius-control` → `rounded-control`; `--text-body-1` →
`text-body-1`). Prefer those over hand-written `var(--color-…)`.

#### Token extraction lessons (paid for once already — do not relearn them)

These were all learned the hard way on the dashboard library and apply verbatim
to the Short App extraction:

- **`get_variable_defs` only returns variables applied to a layer.** A token
  defined in Figma but not yet used anywhere will be silently absent. This bit
  twice on the dashboard (`Surface/Card`, `Critical/Content`). Audit token-group
  completeness with `search_design_system`, which lists variables whether or not
  anything uses them.
- **Duplicate Figma style names silently drop tokens.** The API returns a keyed
  object, so two styles sharing a name collapse into one — and the survivor's
  values get attributed to the wrong style. If a token looks wrong, check for a
  name collision first.
- **`lineHeight: 100` from the API is Figma's "Auto", not 100%.** Emit
  `line-height: normal` (the font's intrinsic metrics, ~1.21x for Inter).
  Emitting `1` makes those styles visibly too tight.
- **Every Figma letter-spacing value is a percentage of font size, never px.**
  Emit `em`: `10%` → `0.1em`, `0.4%` → `0.004em`.
- **`--text-*` tokens carry neither `font-family` nor `text-transform`.** Mono
  styles need an explicit `font-mono`; uppercase label styles need paired
  `type-*` utilities that bundle the casing (the generator handles this).
- **Do not redefine Tailwind's own token names.** Tailwind v4 ships
  `--radius-xs`/`-sm`/`-md` — redefining those silently changes
  `rounded-xs`/`-sm`/`-md` for consumers. Name radii by role instead
  (the dashboard used `--radius-micro`/`-tight`/`-control`/`-surface`/`-pill`).
- **Never define spacing tokens like `--spacing-8: 8px`.** Tailwind v4's scale
  is a multiplier of `--spacing` (0.25rem); `--spacing-8: 8px` would make `p-8`
  mean 8px instead of 32px. Whole-pixel Figma spacing maps to native utilities
  (8px → `p-2`); half-pixel values need arbitrary syntax (`p-[7.5px]` — the
  multiplier form does not compile for half-pixels).

#### CSS traps that transfer to every component

- **Chrome renders a 0.5px hairline border as a full 1px** — measured at 1x and
  2x DPI, and the extra pixel is really in the layout box. A hairline adds
  **2px** to an element's height. Consequence: **never size a bordered
  component with `min-height`** — use an explicit `height` measured from the
  Figma variant frame.
- **Side-specific hairlines need the side-specific length utility.**
  `border-[length:…]` sets all four sides, so `border-t border-[length:var(--border-thin)]`
  silently produces a 0.5px box plus a 1px top. Write
  `border-t border-t-[length:var(--border-thin)]`.
- **Tailwind v4, not v3.** `rounded-[--token]` and `border-[length:--token]`
  (implicit-var shorthand) were dropped — they compile to invalid CSS browsers
  discard without warning. Always write `var()` explicitly, and check
  `dist/index.css` when a style mysteriously doesn't apply.
- **Chrome floors fractional `border-width`** (`1.5px` computes to `1px`), and
  renders `text-decoration-thickness: 0.5px` as a full 1px. Fractional rings
  need a masked conic-gradient; fractional underlines need a background
  gradient band.
- **Only `@utility` registers a real Tailwind utility** that can be `@apply`-ed;
  a plain class in `@layer utilities` cannot. See
  [src/utilities/index.css](src/utilities/index.css).
- **Figma's "Auto" line height makes the line box font-dependent** — component
  heights must not be derived from it. Pin explicit heights measured from the
  Figma variant frames.
- **Figma styles named "- Bold" often resolve to Medium/500.** Read the weight
  the style reports, never map the name.

## Library Contracts (decided 2026-09-02)

Decisions a consumer or contributor would otherwise discover by surprise:

- **Light-only, by design.** The token set is light-mode only and no
  dark-mode variant is planned until the Figma file defines one — a
  deliberate non-goal, not an oversight. Do not add `prefers-color-scheme`
  blocks to components.
- **Breakpoints**: the library defines no `--breakpoint-*` tokens; Tailwind's
  native scale is the contract. The single library-authored media query is
  Header's 768px mobile switch (`md`), documented there. New responsive
  behaviour should use Tailwind's breakpoints, never new raw values.
- **Two focus rings, by design (2026-10)**: FIELDS (TextField, DropdownField,
  TextArea, Address, OTP) keep the original `focus-ring` (3px translucent
  `Primary/Ring` + Primary border); CONTROLS (buttons, checkbox, radio,
  switch, cards, tabs, icon buttons) use `focus-ring-control` (2px solid
  Primary at offset 2 — Figma's "Focus Ring" effect). List options take
  NEITHER (focus stays on the listbox trigger; `data-active` carries the
  highlight).
- **Tap targets**: hug-content controls (icon button, text selector, micro/
  text/link buttons, radio, checkbox, switch) extend their hit area with a
  centred `::after` overlay to ≥24px (WCAG 2.5.8), ≥44px under
  `@media (pointer: coarse)` — `--target-min`/`--target-touch`. Never with
  layout height or padding. Paired with a label, the label row is the target.
- **Control heights are the `--height-*` tokens** (SM 32 / MD 40 / LG 48 /
  XL 56 — XS was deleted from Figma 2026-10-15): set
  `height: var(--height-*)`, zero y-padding, centred content. Never derive a
  control's height from padding + line-height.
- **Z-index scale** (established ahead of the Confirmation Modal):
  content `z-0` · sticky chrome (Header) `z-40` · overlay backdrop `z-50` ·
  modal/panel `z-60` · toast `z-70`. Header already ships z-40; overlay
  components must use this scale, not invent values.
- **Class identity: `va-` for components, `va:` for utilities** (reversed
  2026-09-14; the library previously shipped unprefixed classes). Component
  classes are namespaced — `.va-btn`, `.va-text-field-input` — and the
  prebuilt bundle's utility layer carries Tailwind v4's `va:` prefix
  (`va:flex`, `va:gap-4`, and the prefix leads any variant: `va:md:w-full`).

  **Why, measured against `daisyui@4.12.24`:** 13 of our 146 component classes
  collided with daisyUI — `btn`, `btn-primary`, `btn-secondary`, `badge`,
  `avatar`, `radio`, `skeleton`, `tab`, `tabs`, `modal`, `modal-backdrop`,
  `toast`, `tooltip`. Our rules live in `@layer components`; daisyUI injects
  via `addComponents`, which Tailwind v3 hoists **unlayered**, and unlayered
  normal declarations beat layered ones _before_ specificity or source order is
  consulted. No import ordering fixes it. Unlayering ours would not either:
  daisyUI supplies every property we don't set — its button class leaks 26 of
  them, and its modal class is `pointer-events: none; opacity: 0` until its own
  open modifier is applied, so a dialog carrying that name rendered
  **invisible**. The collision surface also
  grows: 15 of the 40 components still to be built (`alert`, `card`,
  `checkbox`, `input`, `link`, `divider`, `step`, `textarea`, …) already exist
  in daisyUI. Namespacing is the only fix that works.

  The utility prefix is separate and load-bearing: several utilities genuinely
  differ between Tailwind majors (default border colour, ring width, `space-x`
  strategy), so a host on v3 must not be able to collide with ours.

  **Scope:** the prefix applies to the PREBUILT bundle only. A consumer on
  `./source` compiles our `@theme` with their own Tailwind and writes
  `rounded-sm` unprefixed — component `@apply` payloads in `src/components`
  stay unprefixed for the same reason.

  Three gates hold it: `verify:bundle` still fails on any component class that
  resolves to a utility (the `.list-item`/`.text-field-label` bug class),
  `verify:vocabulary` fails on any class named in docs that the bundle does not
  define, and `verify:markup` fails on any class in generated markup with no
  rule in `dist/shortapp-ui.css`. `class-manifest.json` is the generated list
  all three compare against.

  **`class-audit` is a fourth gate and is NOT one of these three — do not reason
  from one to the other.** They read different inputs at different times, and
  neither can mask the other:

  |         | `class-audit` (val-core)                                                   | `verify:vocabulary` (this repo)                                |
  | ------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
  | governs | **generated pages**, at pipeline runtime                                   | **committed prose**, in CI                                     |
  | reads   | the page being built, `src/components`, the theme, the surface methodology | every `.md`/`.html`/`.json` doc, against `class-manifest.json` |
  | runs    | inside `/design`, per run, before handoff                                  | `npm run verify:vocabulary`, per commit                        |
  | answers | "may this page write this class?"                                          | "does this class we wrote about still exist?"                  |

  So a `class-audit` PASS predicts nothing about `verify:vocabulary`, and fixing
  one does not move the other: a page can be fully sanctioned while the doc
  describing it names a class the bundle dropped, and the docs can be spotless
  while a page composes something the methodology never sanctioned. Changing the
  class vocabulary means running **both**, and reading both results.

- **The prebuilt bundle is UNLAYERED; source, `./source` and `dist/index.css`
  keep their layers** (decided 2026-09-16, shipped 1.0.1). Inside `@layer
components`, every component rule loses to any unlayered host rule before
  specificity or source order is consulted — Tailwind 3 preflight (`* {
border-width: 0 }`, `button { background-color: transparent }`), daisyUI, a
  Svelte `:global()` reset, and **our own `reset.css`**, whose `button { color:
inherit }` beat `.va-btn-primary`'s white ink in 1.0.0 (50 property/element
  defeats measured by `verify:reset`). The `va-` rename could never have fixed
  this; it is not a name collision. `build-styles.mjs` unwraps pass A at build
  time so `src/components` stays layered for the Tailwind-v4 entries, where the
  layer IS the contract (`verify:layers`' original assertion). The `html`
  ink/ground default moved out of the bundle into `reset.css`: a Tailwind 3
  host's PostCSS refuses any file carrying `@layer base {` without a matching
  `@tailwind base`.

  **It was invisible on the common path.** A host that `@import`s the bundle
  into its `@tailwind` file has Tailwind 3 consume the layer blocks and re-emit
  the rules unlayered — the bug vanishes, the library looks correct. It broke on
  a raw `<link>`, the path we told the consumer to use. A harness testing only
  the import path would have stayed green forever; `examples/daisyui-starter`
  now tests both, plus the lone-import path.

  **The two-clause host contract** (consumers: README, GETTING_STARTED):
  1. _Defends against_ any host rule of lower specificity, wherever it sits in
     source order, provided the bundle loads after the host's reset.
  2. _Cannot defend against_ a host rule of higher specificity — a Svelte
     scoped `button { }` compiles to `button.svelte-hash` (0,1,1) and beats our
     0,1,0 — or a host that wraps its own CSS in a layer. Remedy: scope element
     resets by class or exclude library controls (`button:not([class*="va-"])`).
     `examples/sveltekit-starter` asserts the limit as a loss on purpose.

  **Behaviour change for consumers**: a single-class override still wins by
  source order when it loads after us; overriding a compound state rule now
  needs matching specificity. Our own `va:` utilities are consumers too — they
  beat the 154 single-class rules by source order and lose to the 164 compound
  ones; `verify:utility-precedence` fails when generated markup relies on the
  latter (today: none).

- **Undefined tokens are a build failure.** `verify:bundle` also fails on any
  fallback-less `var(--…)` in dist that the bundle never defines (the
  `--color-surface-frame` bug class).
- **Candidate refactor, deliberately deferred**: the sprite-glyph paint block
  (`fill:none; stroke:currentColor; stroke-width:2; …`) is repeated in 8+
  component files and could become one `@utility icon-glyph` — do it as a
  dedicated pass with full visual re-verification, not opportunistically.

## Installation

```bash
npm install @valiify/shortapp-ui tailwindcss
```

CSS-only — there is no Tailwind plugin to register, and no `tailwind.config.js`.
**Two supported entry points**, and the difference is load-bearing:

| Entry                             | You get                                                            | You do NOT get                         |
| --------------------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| `@valiify/shortapp-ui/styles.css` | component classes + tokens + the `va:` utility layer, **no reset** | nothing — this entry is self-contained |
| `@valiify/shortapp-ui` (prebuilt) | component classes + tokens as CSS custom properties                | token-derived utilities                |
| `@valiify/shortapp-ui/source`     | the above **plus** token-generated utility classes                 | —                                      |

> ### ⚠️ The three entries are ALTERNATIVES, never companions
>
> Import exactly one of `.`, `./index.css` or `./styles.css`. Nothing stops a
> consumer importing `.` **and** `./styles.css`, and the result is quietly wrong:
> preflight comes back (the thing `./styles.css` exists to avoid, so it fights
> the host's reset again) **and** every component rule is defined twice. The
> package cannot enforce this — exports have no mutual exclusion — so it is
> stated here and in the README.
>
> `./reset.css` is the one entry that pairs with another; see below.

**`./styles.css` is the entry for a host that should never compile our classes.**
It ships `dist/shortapp-ui.css`: component classes, tokens under both spellings,
and a closed set of `va:`-prefixed utilities — **unlayered** (Library Contracts:
the two-clause host contract; load it AFTER the host's reset) and with
**preflight deliberately excluded**, so it cannot fight the host's own reset. It needs no Tailwind at all,
which makes the host's Tailwind version irrelevant. That is what makes it safe to
drop into an app on Tailwind v3 + daisyUI 4.

> ### ⚠️ The utility layer is a CLOSED SET — an unlisted utility silently does nothing
>
> `src/utility-surface.css` is generated from `design-methodology/*.md`, so the
> bundle ships only the ~140 utilities that surface actually uses. A developer
> hand-editing a page who writes `va:mt-7` gets **no rule at all** — no error, no
> warning, no style. This is the one sharp edge of prebuilding, and it is the
> direct cost of the host never compiling our classes.
>
> **Variants are closed too, and this is the sharper half.** The surface ships each
> base utility **and its `md:` form only** — `va:md:py-12` works, `va:lg:py-12`,
> `va:sm:py-12`, `va:xl:py-12`, `va:hover:bg-primary` and `va:focus:*` **do not**.
> They no-op exactly as an unlisted base does. `md` is the single breakpoint this
> design system sanctions (Library Contracts, pinned to Header's 768px switch), and
> component interaction states are handled inside the component classes rather than
> by utilities.
>
> This is not theoretical: the first `/design` run after the rename emitted
> `va:md:py-12`, `va:md:w-140` and `va:md:gap-10`, class-audit sanctioned all three
> (it strips variants before classifying), and the bundle shipped none of them.
> `verify:markup` caught it; `RESPONSIVE` in the generator is the fix.
>
> **To add a utility:** use it in the methodology (the honest route — the surface is
> the source of truth), then
> `npm run build:utility-surface && npm run build`, and commit the regenerated
> `src/utility-surface.css`. It is committed precisely so the shipped set is
> reviewable in a diff.
>
> **To add a variant:** extend `RESPONSIVE` in
> [scripts/build-utility-surface.mjs](scripts/build-utility-surface.mjs) and
> rebuild. Each variant added multiplies the surface by the number of bases (281
> today), so add one because generated output needs it — which `verify:markup` will
> tell you — not pre-emptively.
>
> **To find out you hit this:** `npm run verify:markup` fails on any class in
> generated markup with no rule in the bundle. It cannot see a page you edited by
> hand outside the repo — there, the symptom is an element that simply looks
> unstyled.
>
> Consumers who need the full utility scale should use `./source` with their own
> Tailwind v4 instead.

> ### ⚠️ No preflight means no `box-sizing: border-box` — import `./reset.css` when standalone
>
> Measured on a bare HTML page loading only `dist/shortapp-ui.css`:
>
> |                              | bundle alone | + `./reset.css` | designed  |
> | ---------------------------- | ------------ | --------------- | --------- |
> | `.va-owner-container` height | **124.5px**  | 92.5px          | 92.5px    |
> | `va:w-[343px] va:p-4`        | **375px**    | 343px           | 343px     |
> | `body` margin / font         | 8px / Times  | 0 / Inter       | 0 / Inter |
>
> Every fixed dimension here is authored border-box — `.va-btn-secondary`'s 48px
> closes as `13+13+20+1+1 border-box` — so under the browser default each renders
> larger than designed by its own padding and border. Form controls escape it
> because the UA stylesheet already gives them border-box, which is why buttons
> look right and nothing else does.
>
> `@valiify/shortapp-ui/reset.css` is the measured floor and **not** preflight:
> `box-sizing`, the body margin, the font family, form-control font inheritance,
> and (since 1.0.1) the `html` ink/ground default that used to ship in the bundle
> as `@layer base`. Five rules, each one there because a value was measurably
> wrong without it. Import it FIRST, and skip it inside an app that already
> resets (daisyUI, Bootstrap, a house reset) — harmless there, just redundant.
> **It is subject to the cascade like any host reset**: in 1.0.0 its `button {
color: inherit }` beat the layered `.va-btn-primary`. `verify:reset` asserts it
> overrides nothing the bundle declares on any documented element.

`.` and `./index.css` are unchanged — still the preflight-bearing `dist/index.css`.
`./source` still requires the consumer to be on Tailwind v4; the package no longer
declares a peer dependency, so nothing enforces that but this sentence.

```css
/* prebuilt */
@import "tailwindcss";
@import "@valiify/shortapp-ui";

/* self-contained — no Tailwind in the host, no reset shipped.
   Import ONE of the three entries, never two. */
@import "@valiify/shortapp-ui/reset.css"; /* only when standalone; must be first */
@import "@valiify/shortapp-ui/styles.css";

/* source — consumer's Tailwind processes our @theme */
@import "tailwindcss";
@import "@valiify/shortapp-ui/source";
```

`./source` maps to [src/library.css](src/library.css), which deliberately omits
`@import "tailwindcss"` so the consumer's config stays in charge.

**Fonts are not bundled.** CSS requires every `@import` to precede all other
rules, so a font import inside `dist/index.css` is discarded when a consumer
imports that bundle. Opt in with `@import "@valiify/shortapp-ui/fonts";` as the
**first** line, or self-host.

> **Token names are public API.** Renaming or removing a token is a breaking
> change — consumers write token utilities and `var(--…)` in their own code.
> Changing a token's _value_ is fine; changing its _name_ is not.

## Development Status

**Current Phase**: Released — maintenance and Figma-sync. `@valiify/shortapp-ui`
**1.4.0 is published on npm** (2026-10-15, the go-live pass): 31 components,
each with a visual spec (741 computed-style assertions), the complete token
set (59 colors, Height scale, 24 consumed text styles), token-pinned control
heights, drawn disabled/focus/loading states, and tap-target overlays.

- ✅ Token extraction + theme generation (full Plugin API enumeration;
  re-run on every designer sync)
- ✅ 31 components built, verified (visual / a11y / static / bundle / host
  gates, all in CI) and documented in the Quick Reference above
- ✅ Published to npm; releases follow Keep-a-Changelog + semver
  (token and class names are public API)
- ✅ Storybook deployed to GitHub Pages on every push to main
- ✅ Visual regression: DECIDED 2026-10-15 — the visual-spec harness
  (741 checks against Figma-extracted values) IS the regression gate;
  Chromatic is closed unless designer review ever needs screenshot diffs

Ongoing: designer-list items as the file evolves
([docs/designer-list.md](docs/designer-list.md)), new components as the
Figma library grows (the extraction pipeline in
[docs/component-process.md](docs/component-process.md) is the process of
record).

## Building a Component

**The full process is [docs/component-process.md](docs/component-process.md).
Read it before starting.** It covers locating the component in Figma, the
subagent extraction brief, the CSS traps, and what Figma routinely gets wrong.

The short version:

```bash
# 1. sweep the component's metadata first — one cheap call, gives the variant
#    matrix and catches changes the designer did not mention
# 2. extract the spec with a subagent (cheapest tool per question — see the doc)
npm run new:component Badge     # scaffold — one name only
# populate badge.css by hand
# add an entry to scripts/visual-specs.mjs        <- not optional
# document the classes in the Quick Reference above
npm run build && npm run typecheck
npm run verify:component Badge
npm run verify:visual -- Badge  # scoped while iterating; full suite before commit
npm run audit                   # coverage across the library
```

Three rules that are load-bearing:

1. **Scaffold first** — `npm run new:component` writes the CSS from the
   template, registers the `@import` alphabetically, creates the story, and
   adds the class type. Creating those by hand gets one of them wrong.
2. **Every component needs a visual spec.** A component with no entry in
   [scripts/visual-specs.mjs](scripts/visual-specs.mjs) is unverified however
   good its CSS looks. On the dashboard library the harness caught four defects
   in components that already looked finished.
3. **Size bordered components with `height`, not `min-height`** — Chrome rounds
   the 0.5px hairline up to a full 1px, so a hairline adds 2px of height and
   the component lands past its Figma frame.

Pattern references: the dashboard library's
[button.css](_dashboard-archive/components/button.css) (variants, sizes,
states) and [input.css](_dashboard-archive/components/input.css) (nested state
selectors) remain the best worked examples of the CSS structure — the styling
is dashboard's, the structure is the library's.

### Visual verification — the check that actually catches things

```bash
npm run storybook              # in one terminal
npm run verify:visual          # every component with a spec
npm run verify:visual -- Input Button
npm run verify:visual -- --url http://localhost:6007
```

Renders each story in headless Chromium and asserts **computed** styles against
values extracted from Figma. This is the only check that catches a component
which compiles cleanly, uses every right token, and still renders at the wrong
size.

- Expected values live in [scripts/visual-specs.mjs](scripts/visual-specs.mjs);
  the runner is [scripts/visual-verify.mjs](scripts/visual-verify.mjs).
- Compare colours with `{ token: '--color-x' }`, never a literal — the theme
  emits `oklch()`, so a hardcoded `rgb()` fails even when the colour is right.
- Default tolerance is exact. Widen it only where the delta is understood and
  written down next to the check; a loose tolerance hides regressions.

### Accessibility verification

```bash
npm run verify:a11y                    # every story
npm run verify:a11y -- ComponentName   # one component
```

axe-core over each story in headless Chromium. Exits non-zero when anything
fires. This is the third lens and it sees what the other two cannot — names,
roles, ARIA wiring and contrast.

> **Do not check accessible names with `textContent`.** It reads through
> `display:none`, so a hidden label still looks present. Use this script or
> Playwright's `ariaSnapshot()`.

> **Let transitions settle before measuring computed colour.**
> `transition-colors` covers `outline-color`, so a focus ring read immediately
> after `Tab` returns an in-flight blend. Wait ~400ms.

### Static verification

```bash
npm run verify:component Avatar
```

Reads the source rather than rendering it: hardcoded colours / radii / type,
`@layer components` wrapper, `:hover` guarded against disabled, import
registered and alphabetical, and whether the component is typed, storied and
present in `dist`.

The two checks are complementary and neither replaces the other — this one
cannot see a 1px height error, and the visual harness cannot see a hardcoded
hex that happens to match its token.

> **Deliberate raw values need a waiver pragma, never a workaround.** When a
> value is raw because FIGMA binds no variable (DropdownList's shadow,
> Skeleton's fill), put this on the flagged line or the line above:
> `/* static-ok(hardcoded-color): <reason, citing the designer list> */`
> Waived findings print in yellow (never silent), and a pragma that waives
> nothing fails as `stale-waiver` — so waivers can't outlive the defect.

### Bundle verification

```bash
npm run verify:bundle   # after npm run build — reads dist
```

Two gates over the build output that no other harness can see (both bug
classes shipped for real before this existed):

1. **Undefined `var()` references** — a fallback-less `var(--x)` defined
   nowhere in the bundle resolves to nothing with no error anywhere (the
   `--color-surface-frame` dashboard-leftover bug).
2. **Class/utility collisions** — every component class name is compiled
   through the real Tailwind + theme as a candidate; any name that produces
   a utility rule collides (the `.list-item` / `.text-field-label` bugs).
   A built-in canary (`flex`) must be flagged every run or the gate fails
   itself rather than passing vacuously.

Both run in CI, together with `verify:a11y` (which waives documented design
defects via `KNOWN_ISSUES` in [scripts/a11y-scan.mjs](scripts/a11y-scan.mjs)
— printed, never silent). The consolidated designer list lives at
[docs/designer-list.md](docs/designer-list.md).

### Host verification — computed styles inside a foreign app

Every gate above checks class NAMES or the bundle's own text. None of them can
see a host stylesheet win over a component rule, which is how 1.0.0 shipped.
These render the bundle and read computed styles:

```bash
npm run verify:layer-defeat        # the 1.0.0 repro; tests/fixtures/layer-defeat.html
npm run verify:reset               # reset.css overrides nothing the bundle declares
npm run verify:utility-precedence  # no va: utility in generated markup loses to a compound selector
cd examples/daisyui-starter && npm run check     # Tailwind 3 + daisyUI 4, three load paths
cd examples/sveltekit-starter && npm run check   # Svelte scoped styles, incl. the documented limit
```

All carry canaries and run in CI. `verify:layer-defeat` and `verify:reset` take
`--file <bundle>` so a released artifact can be re-measured.

## Storybook

```bash
npm run storybook
```

View all components with interactive controls and documentation at
http://localhost:6006. Storybook is the audit surface — the visual and a11y
harnesses both drive it, so keep it running while building components.

## Build

```bash
npm run build       # Regenerate theme + icons, then compile src/index.css -> dist/index.css
npm run build:theme # Regenerate src/themes/valiify.css from tokens/figma-tokens.json
npm run build:icons # Rebuild the icon sprite
npm run dev         # Compile in watch mode
npm run typecheck   # tsc --noEmit over types/, stories/, .storybook/
npm run format      # Format code with Prettier
```

Output:

- `dist/index.css` - the entire published artifact (tokens + component styles)

`dist/index.css` deliberately contains **no Tailwind utility classes** — a
component library shouldn't ship an app's utilities. Consumers generate their
own. Storybook gets utilities via `@source` globs in its preview CSS.

Type definitions are hand-maintained in [types/](types/) and shipped as-is;
they are not generated.

`src/themes/valiify.css` IS generated — from `tokens/figma-tokens.json` via
`scripts/build-theme.mjs`. Edit the JSON, not the CSS.

## Icon System

The Lucide-based icon sprite system is **shared with the dashboard library**
and carries over unchanged:

- Sprite system: `src/icons/README.md` (build process)
- Integration guide: `src/components/ICON-SYSTEM.md` (usage patterns)
- Icon list: `src/icons/icon-list.txt` (searchable names)

Icon stroke weights and per-size classes will be re-verified against the Short
App Figma once its icon usage is extracted.

## Architecture

- **CSS-only** - Zero JavaScript dependencies, no Tailwind plugin, no `tailwind.config.js`
- **Tailwind v4 `@theme`** - Tokens generate utilities automatically
- **Framework-agnostic** - Works with React, Vue, Svelte, vanilla HTML, etc.
- **Modular** - Import only what you need

## Design System

Based on the Valiify Short App design system from Figma
(file key: `PA5pr1Q8KLfbjTxdAbFm0V`, file: Updated-Short-App).

## Links

- **Repository**: https://github.com/BubbaCoop/Valiify-Application-Component-Library
- **NPM Package**: https://www.npmjs.com/package/@valiify/shortapp-ui
- **Figma**: Updated-Short-App (PA5pr1Q8KLfbjTxdAbFm0V)
- **Storybook**: https://bubbacoop.github.io/Valiify-Application-Component-Library/ (GitHub Pages, deployed from main)
- **Dashboard library (predecessor)**: https://github.com/BubbaCoop/Valiify-dashboard-ui

## License

MIT © Valiify
