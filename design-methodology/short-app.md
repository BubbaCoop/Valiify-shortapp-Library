# Short App surface — page composition methodology (applicant)

**Status:** v1.0 · 2026-09-10 · extracted from Figma `PA5pr1Q8KLfbjTxdAbFm0V` (Updated-Short-App) and reconciled against `@valiify/shortapp-ui`. This file holds current rules only. Decision history, frame↔library deltas, and resolved items live in `short-app-decisions.md`.
**Scope:** how steps on the applicant-facing Short App are *assembled* from library components — consumer, business, and auto-loan flows. Companion to `dashboard.md`. Not a component spec; fields, buttons, cards, controls and the header are library components and are only referenced here. Component classes named here are the library's; their full specifications, states and markup live in the library's `CLAUDE.md`.

## 0. Conventions

**Sources.** 37 Figma frames across the `Consumer`, `Business` and `Auto Loan` pages, plus 40 PNG exports used only for whole-page composition judgments. `Portal V2` is a separate document; `Credit Card` is empty. Every value is expressed in the library's vocabulary — `src/themes/valiify.css` (59 colours, 6 radii, 24 consumed text styles, 3 effects — updated 2026-10-15 for @valiify/shortapp-ui 1.4.1), `src/utilities/index.css`, `src/components/*.css` (31 components) and `CLAUDE.md`. Where a frame and the library disagree, the library value is the rule and the frame is to be updated in Figma.

> **Coverage gap (recorded 2026-10-15, deliberate):** this methodology has no
> entries for the 1.4.x additions — Address, Upload, OtpField/OtpCell, the
> Utility Link button, ListItem Critical — because methodology entries are
> EVIDENCE-BASED and wait for the first real Figma screen that uses them.
> Until a frame audit adds them here, `/design` pages cannot compose these
> components (class-audit sanctions from this document); `/val` can — the
> component registry already knows them. When such a frame lands, audit it
> and add the entries; do not write them from the component specs alone.

**Value notation.** Utility first, with token and hex in parentheses on first mention in a section — `va:bg-surface-app-page` (`--color-surface-app-page`: #fafaf9) — then utility alone. Components are named by class: `.va-select-card`, `.va-box-action va-box-action-checkbox`. Spacing has no tokens by design; Tailwind's scale is the token (4px → `1`, 8px → `2`, 16px → `4`, 48px → `12`). Off-scale whole pixels take arbitrary values (`va:w-[343px]`); half-pixels always do (`va:h-[92.5px]`). A value with no token is written raw and marked `[raw]`. This document does not invent tokens.

Type utilities (`va:text-display`, `va:text-input`, …) carry size, line-height, weight and tracking but **not** font-family or text-transform. The three uppercase styles ship as bundled utilities — `va:type-eyebrow`, `va:type-micro-label`, `va:type-button-label` — and are used in place of the bare `text-*`. No monospace appears on this surface.

**Rule format.** `rule` → **Evidence:** node ids / frame names → **Confidence:** high / medium / low. Open items are collected in §13.

**Screen inventory.**

| Archetype | Node | Frame name | Flow · step | PNG |
|---|---|---|---|---|
| Choice | 9:544 | Are you a member | Consumer 1/7 | Are_you_a_member |
| Choice | 9:368 | Select a product | Consumer 2/7 | Select_a_product (consumer) |
| Choice | 137:6386 | Employment status | Consumer 2/7 | Employment_status |
| Choice | 137:6730 | Own or rent | Consumer 2/7 | Own_or_rent |
| Choice | 137:7013 | Membership (How do you qualify?) | Consumer 2/7 | Membership |
| Choice | 172:10613 | Are you a member | Business 1/10 | Are_you_a_member (business) |
| Choice | 172:10626 | Select a product | Business 2/10 | Select_a_product (business) |
| Checklist | 199:12833 | High Risk Industries | Business 6/10, nothing selected | High_Risk_Industries |
| Checklist | 199:13001 | High Risk Industries 2 | Business 6/10, *None of the below* selected | High_Risk_Industries_2 |
| Form | 7:219 | Short App (Tell us about yourself) | Consumer 4/7 | Short_App |
| Form | 118:5928 | Additional Details | Consumer 4/7 | Additonal_Details |
| Form | 137:6503 | Full time (Tell us about your employment) | Consumer 4/7 | Full_time (consumer) |
| Form | 137:6813 | Residential details | Consumer 4/7 | Residential_details |
| Form | 172:10673 | Primary Contact | Business 3/10 | Primary_Contact |
| Form | 172:10811 | Business Details (Tell us about your business) | Business 4/10 | Business_Details |
| Form | 199:12008 | BSA | Business 5/10, empty | BSA |
| Form | 199:12185 | BSA Filled | Business 5/10, conditional fields revealed (1920×1505) | BSA_Filled |
| Form | 348:8058 | Business Details (Additional business details) | Business 9/10 | Business_Details-1 |
| Form | 348:8076 | Business Details mailing address | Business 9/10, mailing toggle on | Business_Details_mailing_address |
| Roster | 290:5694 | Full time (Business ownership) | Business 7/10, list | Full_time (business) |
| Roster | 258:13116 | Full time (Business ownership) | Business 7/10, new-owner form open (1920×1662) | Full_time-1 |
| Roster | 298:6344 | Full time (Account Roles) | Business 8/10, matrix | Account_role_1 |
| Roster | 298:6425 | Full time (Account Roles) | Business 8/10, add-person form open | Account_role_2 |
| Informational confirm | 137:7136 | Donate | Consumer 4/7 | Donate |
| Review | 137:7266 | Review | Consumer 4/7 | Review (consumer) |
| Review | 364:8398 | Review | Business 10/10 (1920×1324) | Business_review |
| Agreement | 137:7541 | Signature | Consumer "Agreement" | Signature |
| Offer selection | 449:10429–10473 | Loan Web 1–5 | Auto Loan, five coverage/discount states | Loan_Web_1–5 |
| Offer selection | 449:10374–10418 | Loan Mobile 1–5 | Auto Loan, same five states at 375 | Loan_Mobile_1–5 |
| Form (mobile) | 675:4131 | Tell us about yourself | Consumer 4/7 at 375, stacked fields | — |
| Roster | 676:4620 / 676:4501 | Account Roles | Business 8/10, matrix — web / mobile | Web_Account_Roles / Mobile_Account_Roles |
| Roster | 676:4758 / 676:4982 | Business ownership | Business 7/10, new-owner form open — web / mobile | Web_add_owner / Mobile_add_owner |
| Review | 688:5554 / 688:5717 | Review your application | Business 10/10 — web / mobile | Web_review / Mobile_Review |

---

## 1. Layout skeleton

One shell, one column, no rails. Everything below the header is a single 560px column; the only variation is whether a footer button row exists and where it sits.

### 1.1 Web shell (all consumer/business frames, 5 loan web)

```
┌ canvas #fafaf9──────────────────────────────────────────────────────────────────┐
│ 60  va-header #fffdfb · bottom 1px hairline · logo centered · [globe] English ▾ │
│ 48  ↓                                                                           │
│      680 │◄───────────── 560 column ─────────────►│ 680                         │
│          │ STEP n OF m / SECTION   (11/16, tracked, uppercase)                  │
│          │ Title (28/34)                                                        │
│          │ Description (16/24)                                                  │
│      40  ↓                                                                      │
│          │ Content — cards, fields, roster, review groups (gap 12 or 20)        │
│      40  ↓                                                                      │
│          │ [ ← BACK 99 ] 24 [ CONTINUE ──────────────── → 437 ]  (48 tall)      │
│      48  ↓ (bottom padding)                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

- **Canvas is warm off-white `va:bg-surface-app-page` (`--color-surface-app-page`: #fafaf9); surfaces are `va:bg-surface-paper` (`--color-surface-paper`: #fffdfb).** The header, choice cards, inputs, review cards and roster cards are all `va:bg-surface-paper` on the `va:bg-surface-app-page` canvas — a two-tone warm palette, no pure white on the applicant surface. The library's own components already paint this way: `.va-header`, `.va-select-card`, `.va-box-action`, `.va-text-field-box` and `.va-owner-container` are all `va:bg-surface-paper`. **Evidence:** 9:544 frame fill, Header fill, Card fill, input fill. **Confidence:** high.
- **Header is the library's `.va-header` — 60 (`va:h-15 va:px-5`), bottom stroke `va:border-b va:border-stroke-divider` (`--color-stroke-divider`: #1a1a1a @11%, a real 1px border absorbed by the pinned height),** logo centered (`.va-header-logo`, 30 tall, absolutely centered — the crimson in the asset is the client's, untokenized), language selector right (`.va-text-selector`: 16px leading `#globe` `.va-text-selector-icon`, `va:text-help-caption va:text-content-tertiary` label — `--text-help-caption`: Inter Regular 12/14 · `--color-content-tertiary`: #6f7276 — and an 18px `.va-text-selector-chevron`). No back control in the header; no progress bar. `.va-header` is `position: sticky; top: 0` + `va:z-40` by library contract. **Evidence:** 9:544 Header; 449:10429 Header. **Confidence:** high.
- **Single 560 column, centered (x = 680 on 1920)** — `va:w-140 va:mx-auto`. Title block, content, and buttons are all exactly 560 wide; nothing spans wider and nothing sits beside the column. No component owns the column; it is page layout. **Evidence:** Title 560 @680, Content 560 @680, button row 560 @680 on every frame. **Confidence:** high.
- **Vertical rhythm is 48 / 40 / 40 / 48.** The page body is `va:py-12` (48 top and bottom) with `va:gap-10` (40) between its three children: title block → content → button row. **Evidence:** Frame 5 `V gap40 pad48/0/48/0` on all frames. **Confidence:** high.
- **Title block is 90 tall:** eyebrow row (16, `va:type-eyebrow` line box) → `va:gap-2` (8) → title (34, `va:text-display` line box) → `va:gap-2` → description (24, `va:text-input` line box). The 90 is emergent from the three type tokens, not pinned. Present on every step, including the loan offer. **Evidence:** Title frame `V gap8` h=90. **Confidence:** high.
- **The button row is in flow, not sticky, on web.** It follows the content by 40 and the page grows (1505, 1662, 1324 tall frames). Layout: `Back` = `.va-btn va-btn-secondary` (99×48, hug) + `va:gap-6` (24) + primary = `.va-btn va-btn-primary va:flex-1` (437×48); when there is no Back, the primary is `va:w-full` (560). `.va-btn` is `va:h-12 va:px-3.5`. **Evidence:** button frame `H gap24` 560×48 at y = content-bottom + 40; 137:7136 / 137:7266 / 137:7541 full-width primaries. **Confidence:** high (composition); scroll behavior §13.
- **Choice steps advance on card tap and carry a button row containing only `BACK`** (`.va-btn va-btn-secondary`, 99×48, left-aligned, same 40 gap). Step 1 of a flow omits the row entirely. **Evidence:** designer decision 2026-09-09. **Confidence:** high.

### 1.2 Mobile shell

- **375 wide; header 60 (`.va-header` — the same component; its `.va-header-mobile` wrapper swaps the selector label to `EN` below 768px); page container `va:p-4` (16 → 343 column, `va:w-[343px]`), `va:gap-4` (16); a separate 76px sticky footer** (`va:h-19 va:py-3.5 va:px-4`; `.va-btn va-btn-secondary` 99 + `va:gap-5` (20) + `.va-btn va-btn-primary va:flex-1`; `va:z-40`, the sticky-chrome tier) — a **planned library component** (§12; interim recipe §11). Title is `va:text-display` 28/34; the block collapses to 96 tall as the description wraps. **The breakpoint is Tailwind's native `md` (768)**, matching the header's `max-width: 767px` media query; the library defines no `--breakpoint-*` token. **Evidence:** 449:10374–10418 children `Header 375x60`, `Page Container`, `Footer 375x76`; Title Container `Mobile=yes`. **Confidence:** high. **Revised BSA mobile frames (720:8067 / 721:8438, designer change 2026-09-17) pad 20 left/right — `va:px-5`, a 335 column; vertical padding stays 20 in those frames.** Whether the 20 replaces 16 surface-wide is a §13 open item — the loan-flow frames cited here were authored at 16/343.
- **This mobile shell applies to every flow.** No consumer or business step has a mobile frame; by decision they use the same 343 column / 16 padding / 76 sticky footer. **Evidence:** designer decision; 675:4131, 676:4501, 676:4982, 688:5717. **Confidence:** high.
- **Multi-up fields stack on mobile.** Any row of two or three standalone fields (First name / Last name; Phone / ZIP / SSN last 4) becomes one field per row at the standard `va:gap-5` (20) field pitch, including inside the roster's inline form. **Exception:** the joined City / State / ZIP row inside the address composite stays three-up; the State dropdown abbreviates to `ST` and the ZIP placeholder to `ZIP`. Everything else keeps its web composition inside the 343 column. **Evidence:** 675:4131, 676:4982 vs the same steps at 1920. **Confidence:** high.
- **The roles matrix keeps its three columns at 343.** Same card, same `PERSON / CONTROLS / SIGNER` eyebrow header, same 47px rows and *Add another owner* footer; the person column simply absorbs the width. It does not collapse to a per-person list. **Evidence:** 676:4501 vs 676:4620. **Confidence:** high.
- **Roster owner rows hug their content at 343.** The contact line (`phone · email`) wraps to two lines, long names wrap, and the row grows; percentage, badge, `EDIT` and trash keep their positions. The inline form, radio cards, Save / Cancel row and footer affordance keep their web composition. **Evidence:** 676:4982 vs 676:4758; 688:5717 owner rows. **Confidence:** high.
- **Review keeps its two-column rows at 343.** Label column stays fixed (`va:w-[142px]`), values wrap onto a second line; group labels, `EDIT`, add-affordance (B) and the product card's `View Details` link keep their web positions. **Evidence:** 688:5717 vs 688:5554. **Confidence:** high.

### 1.3 Loan offer variant

Same shell, but the content is built from a **legacy** remote library with its own tokens. Use these ten frames for the *UX* of offer selection — total → collapsible breakdown → collapsible coverages with switches → radio offer cards → strikethrough discount — and take no color, radius, type, or spacing values from them. The current-library equivalent of every element is in §4–§5: offer cards are `.va-select-card` (the `<label>` + `.va-radio` variant), coverage opt-ins are `.va-switch`, the button row is §1.1's. The library's portal components — `.va-status-tracker`, `.va-action`, `.va-utility-button` (Text type), `.va-tab va-tab-portal` — appear on **no** in-scope frame and are not mapped by analogy here. **Evidence:** 449:10462 Form Container; designer decision. **Confidence:** high.

---

## 2. Archetypes

Eight step types compose every screen. A step = eyebrow + title + description + one content block + (optionally) a button row.

| # | Archetype | Content block | Commit |
|---|---|---|---|
| 1 | **Choice** | 2–7 single-select `.va-select-card`s (76 tall) with chevrons, `va:gap-3` (12) | `BACK` only (omitted on step 1); card tap advances |
| 2 | **Checklist** | 6 multi-select `.va-box-action va-box-action-checkbox` rows (48 tall), first is *None of the below*, hairline under it, `va:gap-3` | Back + Continue (enabled once anything is checked) |
| 3 | **Form** | labelled `.va-text-field` / `.va-dropdown-field` / `.va-radio-field`s (73 pitch) `va:gap-5` (20), optional uppercase sub-section label, optional conditional reveal, optional disclaimer checkbox row | Back + Continue |
| 4 | **Roster** | progress bar + bordered card of `.va-owner-container` rows with inline add/edit form + *Add another owner* footer; or column-headed matrix of `.va-radio`s / `.va-checkbox-control`s | Back + Continue, preceded by a left-rule instruction |
| 5 | **Informational confirm** | one explainer card | full-width Confirm |
| 6 | **Review** | gray uppercase group labels, each with a bordered card: eyebrow, name, label/value rows (12/16); three add-affordances by scope (§5) | Back + Confirm |
| 7 | **Agreement** | 3 disclaimer rows separated by hairlines | Back + Confirm |
| 8 | **Offer selection** | total card with collapsible breakdown → collapsible coverages with `.va-switch`es → radio `.va-select-card`s | Back + Continue (disabled until an offer is chosen) |

- **One question per screen for choices; one topic per screen for forms.** No form step carries more than ~7 fields before a sub-section label or a page break; no choice step mixes card choice with free-text. **Evidence:** every consumer/business frame. **Confidence:** high.
- **The business flow is the reference sequence** (1 Membership → 2 Products → 3 Primary Contact → 4 Business Details → 5 BSA → 6 BSA high-risk → 7 Ownership → 8 Account authority → 9 Additional business details → 10 Review). The consumer flow branches, so its step numbers in the frames are placeholders; the eyebrow increments by the step's actual position in the applicant's workflow. **Evidence:** eyebrow text on all frames; designer decision. **Confidence:** high.

---

## 3. Hierarchy rules

- **Three levels in the title block, always the same three.** Eyebrow: `va:type-eyebrow` (`--text-eyebrow`: Inter Semi Bold 11/16, +10%, bundled UPPERCASE) — the `STEP n OF m` run in `va:text-content-tertiary` (`--color-content-tertiary`: #6f7276), the section name in `va:text-primary-text` (`--color-primary-text`: #a6192e); title `va:text-display va:text-content-primary` (`--text-display`: Inter Medium 28/34 · `--color-content-primary`: #1a1a1a); description `va:text-input va:text-content-secondary` (`--text-input`: Inter Regular 16/24 · `--color-content-secondary`: #54565b). Nothing on the surface is larger than 28 except the consumer Review applicant name (22, `va:text-title`). **Evidence:** Title frames on 9:544, 118:5928, 137:7266; 449:10462 Value. **Confidence:** high.
- **The eyebrow carries position; the header carries none.** "STEP 4 OF 7 / IDENTITY" is the only progress indicator — there is no bar, no dots, no stepper. (The library's `.va-status-tracker` is a portal component and is not used here.) **Evidence:** all frames; Header contains no progress element. **Confidence:** high.
- **Description states the *why*, in one sentence.** "Our institution needs these to verify your account." / "Required to comply with federal banking regulations." / "Pick the account to open today. You can add more later." **Evidence:** description texts. **Confidence:** high.
- **Grouping inside content is by label, not by card, until Review.** Forms use an uppercase sub-section label (`ACCOUNT ACTIVITY`, `va:type-eyebrow va:text-content-secondary`) and a hairline (`va:border-b va:border-stroke-divider`); Review is the first place content is wrapped in bordered cards with their own eyebrow (`PRIMARY APPLICANT`, `BUSINESS` — `va:type-eyebrow va:text-content-secondary`). Review group labels are gray `va:text-content-secondary`, never crimson. The review card itself has no component (§11). **Evidence:** 199:12185 "Account Activity"; 137:7266 / 364:8398 "Selectable field" cards; designer decision. **Confidence:** high.
- **Above the fold, always:** header, eyebrow, title, description, and the first content element. **Never above the fold as a requirement:** the button row — on tall steps it is below the fold by design (1505/1662/1324 frames). **Evidence:** 1080 frames vs 199:12185, 258:13116, 364:8398. **Confidence:** high.
- **Section delimiting is hairline + whitespace; surfaces mean "a thing you can act on."** Hairlines (`va:border-stroke-divider`, #1a1a1a @11%) separate form groups, agreement rows and review rows. Bordered surfaces are reserved for tappable cards (`.va-select-card`, `.va-box-action`), inputs (`.va-text-field-box`, `.va-dropdown-field-trigger`), and the roster/review containers; all of them ring at 1px `stroke-divider` — the components natively (inset box-shadow), the composed containers by the sanctioned class `va:ring-1 va:ring-inset va:ring-stroke-divider` (the same inset 1px shadow; never a `va:border`, which adds to the box). Filled tints appear only on the selected state (`va:bg-primary-bg`, `--color-primary-bg`: #a6192e @6%) and on the inline new-owner form (which drops to canvas `va:bg-surface-app-page` to read as a nested surface). **Evidence:** 137:7541 rows; 199:12185 seams; 258:13116 "New Owner" fill. **Confidence:** high.

---

## 4. Density and spacing rhythm

The surface runs on a 4px grid — Tailwind's spacing scale expresses it directly; the few off-scale values (343, 518, 142) take arbitrary widths, and the one half-pixel height is the library's own (`.va-owner-container` `va:h-[92.5px]`).

| Relationship | Value | Evidence |
|---|---|---|
| Header | `.va-header` = `va:h-15 va:px-5 va:border-b va:border-stroke-divider` (60, pad 16/20, 1px bottom) | 9:544 Header |
| Body padding | `va:py-12` (48 top / bottom) | Frame 5 |
| Title block → content → buttons | `va:gap-10` (40 / 40) | Frame 5 gap |
| Eyebrow → title → description | `va:gap-2` (8 / 8) | Title frame gap |
| Choice cards | `.va-select-card` = `va:p-4 va:gap-3 va:rounded-md`, `.va-select-card-text` `va:gap-1`, title `va:text-label-strong` 14/20 (76 emergent: 16+20+4+20+16); list `va:gap-3` | 9:544 Card |
| Checklist boxes | `.va-box-action va-box-action-checkbox` = `va:h-12 va:px-4 va:py-3 va:rounded-sm` (48); list `va:gap-3`; hairline after *None of the below* is page-composed (`va:border-b va:border-stroke-divider`) | 199:13001 Box |
| Form field | `.va-text-field` = `.va-text-field-title-row` (`va:text-label-strong`, `va:pb-1.25`) + `.va-text-field-box` `va:h-12` — 73 pitch (20 + 5 + 48); stack `va:gap-5` (20) | 118:5928 Plain Text Field |
| Two-up fields | **Spell it mobile-first, because §1.2 stacks these on mobile and the base direction must be written down, not assumed from flex's default.** Column level: base `va:flex va:flex-col va:gap-5` (one field per row), then `va:md:flex-row va:md:gap-6` with `va:md:w-67` each (268 + 24 + 268). Inside the 518 inline form: `va:flex va:gap-4` (251 + 16 + 251). *A desktop-first spelling here silently ships a stacked row: the prebuilt bundle's utility set is closed and only contains what this file uses, so an unwritten `flex-row` resolves to no rule at all while the `md:` gap still applies — which looks deliberate.* | 258:13116 Row; Additional_Details PNG |
| Radio group | `.va-radio-field` = `.va-radio-field-title` `va:pb-1.25` + `.va-radio-field-options` `va:h-10 va:gap-6` + `.va-radio-field-option` `va:gap-2`; `.va-radio` is `va:size-5` (20) | 118:5928 Radio Fields |
| Disclaimer | `.va-checkbox-control` (`va:size-4.5`) + `va:gap-3` + `va:text-label va:text-content-secondary` — no component (§11) | Disclaimer container |
| Instruction callout | `va:text-help-caption va:text-content-secondary` (12/14) behind `va:border-l va:border-stroke-divider`; `va:mb-4` above the button row — no component (§11) | Footer "Layer field" |
| Button row | `.va-btn va-btn-secondary` + `va:gap-6` (24) + `.va-btn va-btn-primary va:flex-1`; `.va-btn` = `va:h-12 va:px-3.5 va:gap-2.5` (48), icons `va:size-4.5` (18) | Frame 1000001366 |
| Review card | `va:p-4.5 va:gap-3 va:rounded-sm va:bg-surface-paper` (pad 18, gap 12); rows `va:text-timestamp` (12/16) with `va:border-b va:border-stroke-divider`; label `va:w-[142px]` — no component (§11) | 137:7266 / 364:8398 Selectable field |
| Roster owner row | `.va-owner-container` = `va:h-[92.5px] va:px-5 va:py-4 va:gap-4`; the "avatar" is `.va-owner` (`va:size-8.5 va:rounded-sm`, 18px glyph) — not `.va-avatar` | 258:13116 Owner Container |
| Roster inline form | `va:p-5 va:gap-4 va:bg-surface-app-page` (pad 20, gap 16); fields `va:w-[518px]` — no component (§11) | New Owner |
| Roles matrix | header `va:h-6`; rows `va:h-[47px] va:py-1 va:px-4` (46 + 1 hairline) with `box-shadow: inset 0 -1px 0 var(--color-stroke-divider)`; columns `va:w-79` / `va:w-30` / `va:w-30` (316/120/120) — no component (§11) | 298:6425 |
| Progress bar | `va:h-1 va:rounded-full`; label row `va:h-9.5` (38) — no component; track colour `[raw]` (§13) | 258:13116 State |
| Loan cards | legacy geometry, not mapped; the current equivalents are `.va-select-card` (76) and `.va-switch` | 449:10462 |
| Mobile | `va:p-4 va:gap-4`, `va:w-[343px]`; footer `va:h-19 va:py-3.5 va:px-4 va:gap-5` (76, pad 14/16, buttons gap 20) — planned component (§12; interim recipe §11) | 449:10407 |

- **The column is the unit; the card is the second unit.** Every content element is 560 wide (`va:w-140`); nothing narrower than 560 sits alone except two-up fields, and nothing has horizontal margins inside the column except card padding. **Confidence:** high.
- **Vertical rhythm is 40 between blocks, 20 between fields, 12 between cards, 8 inside the title block** — `va:gap-10` / `va:gap-5` / `va:gap-3` / `va:gap-2`. Four steps, consistently. **Confidence:** high.
- **Touch targets are 48.** Inputs (`.va-text-field-box`, `.va-dropdown-field-trigger`), buttons (`.va-btn`), checklist boxes (`.va-box-action-checkbox`) and the *Add another owner* affordance row are all 48 (`va:h-12`); choice cards are 76; radios/checkboxes 18–20 (`.va-checkbox-control` `va:size-4.5`, `.va-radio` `va:size-5`) inside 40px rows (`.va-radio-field-options` `va:h-10`). **Confidence:** high.

---

## 5. Component selection rules

- **Card list for a single choice; box list for multiple; radios for yes/no.** Choice cards = `.va-select-card` as a `<button>` with `.va-select-card-chevron` (76, chevron, no commit button) when exactly one option advances the flow. Checklist boxes = `.va-box-action va-box-action-checkbox` (48, `.va-checkbox-control` inside, commit button) when several may apply. Inline `Yes / No` = `.va-radio-field` (`.va-radio-field-option`s composing `.va-radio`; never a `.va-dropdown-field`, never a `.va-switch`) for binary questions inside a form. **Evidence:** §2 archetypes 1–3; 118:5928 Radio Fields. **Confidence:** high.
- **Dropdown for enumerations, text for free entry, formatted placeholder for anything with a shape.** `Select…` = `.va-dropdown-field` (a `<button>` trigger, 48, `aria-haspopup="listbox"`, opening the shipped `.va-dropdown-list` › `.va-list-option va-list-option-sm` panel) for revenue bands, employee counts, industry; `.va-text-field` with `000-000-0000`, `MM/YYYY`, `00000`, `0.00`, `••••` placeholders (native `::placeholder` in `va:text-content-hint` — `--color-content-hint`: #8e9195). Currency inputs carry a leading `$` in the `.va-text-field-icon` slot (18), and that slot takes the `.va-text-field-icon-currency` modifier, which swaps the family's line-icon paint for a filled one and binds Neutral/Base: the glyph is `#custom-currency-dollar`, a filled path exported from the authored vector, not the line-art `#dollar-sign` (shipped 1.4.3 — the BSA accuracy run measured the stroke-drawn version 11×16.5 against the reference's 7.5×14). Currency and other figure columns also carry `va:tabular-nums`, so digits align down a column and a value does not reflow as it is typed. **Free entry splits by shape of answer:** a single-line answer is `.va-text-field` (48 box, 73 pitch); an answer that is a *list or a sentence* is `.va-text-area` (79 box, 104 pitch) — see §10. Choose by what the question asks for, not by expected length: "To or from which countries?" takes a multi-line field because the answer is a list, even when one country is a valid answer. **Evidence:** BSA.png, Full_time.png, Short_App.png, 118:5928 AttachMoneyRounded; BSA Filled 199:12185 → 636:2045, 636:2448 (two `Text Area Field` instances, 560×104). **Confidence:** high.
- **Toggle only for "reveal more fields."** The single switch on the applicant surface (`Mail should go to a different address`) is `.va-switch` (36×20; off track `va:bg-stroke-border`, on `va:bg-primary`) and reveals a second address block; it is not used for yes/no answers. Loan coverages use switches because they are opt-ins with a price. (The library also ships `.va-box-action va-box-action-switch`, a boxed 44px switch row; no frame uses it.) **Evidence:** 348:8076, 449:10462 Switch. **Confidence:** high.
- **Conditional fields reveal in place, indented, with a left rule.** BSA follow-ups ("Do you plan to send or receive international wires?" → "To or from which countries?") and the mailing address block indent ~22px under a vertical hairline (`va:border-l va:border-stroke-divider va:pl-5.5` `[raw]`). Nothing opens a modal or a new step. **Evidence:** BSA_Filled.png, Business_Details_mailing_address.png. **Confidence:** high (composition) / medium (exact indent — §13).
- **Two button tiers.** *Step tier:* the Standard button — `.va-btn` at 48 (`va:h-12`), `va:type-button-label` (`--text-button-label`: Inter Semi Bold 14/20, +10% tracking, bundled UPPERCASE), `va:rounded-sm` (`--radius-sm`: 4px), with an 18px arrow `svg` child — `BACK` = `.va-btn va-btn-secondary` (`va:border va:border-stroke-border`, `--color-stroke-border`: #1a1a1a @17%, ink `va:text-content-secondary`, leading `#arrow-left`), primary = `.va-btn va-btn-primary` (`va:bg-primary`, `--color-primary`: #a6192e; `:disabled` → `va:bg-primary-disabled`, `--color-primary-disabled`: #a6192e @30%; trailing `#arrow-right`); a disabled Back is `.va-btn-secondary:disabled` (`va:border-stroke-divider va:text-content-tertiary` — gray by design, reserved; no current frame disables Back). *Inline tier:* the Utility button — `.va-utility-button va-utility-button-filled` / `va-utility-button-empty` (34 tall, `va:text-field-label` 13/500, natural case — `Add Person`, `Save`, `Cancel`), the same crimson/outline pairing, used only inside a card's inline form. **Evidence:** button instances on all frames; Account_role_2.png, Full_time-1.png. **Confidence:** high.
- **Three add-affordances, chosen by what is being added.** (A) *Review-only entities* that have no step of their own — beneficiary, co-applicant — get a full-width 48px outline button below the cards: `.va-btn va-btn-secondary va:w-full` with a trailing `#plus` (`ADD A BENEFICIARY +`), the heaviest shape because it is the only place the applicant will ever see the option. (B) *Entities that are real steps* — product, owner — get the micro text button, `.va-btn va-btn-micro` + 12px `#plus` (`va:type-micro-label` 9/12, `va:text-content-secondary` → primary on hover — the same component as the OwnerContainer `EDIT`), right-aligned in the section header (`ADD PRODUCT +`), because the action re-enters a step the applicant has already seen. (C) *Rows in a list being edited* — another owner on a roster step — get the same `.va-btn va-btn-micro` + `#plus`, centered in a full-width 48px (`va:h-12`) footer row of the card (`ADD ANOTHER OWNER +`). Emphasis tracks user type and stakes; the three are not interchangeable. **Evidence:** 137:7266, 364:8398, 258:13116; designer decision. **Confidence:** high.
- **Primary is disabled until the step is valid.** Every form, checklist, roster and offer frame shows the primary at 30% (`.va-btn-primary:disabled` → `va:bg-primary-disabled`, white ink kept) until required input exists; only Donate (nothing to enter) and the selected-checklist state show it enabled. **Evidence:** 199:13001 vs 199:12833; 137:7136. **Confidence:** high.
- **Back is a button, not a link, and sits left of the primary — never in the header.** It is present on every step after the first, including choice steps (alone), Review and Agreement. **Evidence:** button rows; designer decisions. **Confidence:** high.
- **Editing happens where the data lives.** Review cards carry `EDIT` (`.va-btn va-btn-micro` + `#pencil`) in the card header; owner rows carry `EDIT` + trash inline (`.va-owner-container-actions`: `.va-btn va-btn-micro` + `.va-icon-button va-icon-button-sm va-icon-button-state` with `#trash-2` and an `aria-label`); owners are added by a form that opens *inside* the roster card, with the list above it still visible. **Evidence:** Business_review.png, Full_time-1.png, Account_role_2.png. **Confidence:** high.
- **Selection is border + tint, not a check color alone.** Selected checklist box: `.va-box-action:has(:checked)` → inset 1px `--color-primary` ring + `va:bg-primary-bg` (#a6192e @6%) + the crimson `.va-checkbox-input:checked` (the label also steps to `va:text-lead`, 16/500); selected segmented tab (Individual/Company): `.va-tab tab-application[aria-selected="true"]` → inset 1px primary ring + `va:bg-primary-bg va:text-primary-text`; selected radio card ("I'll enter their details now"): `.va-select-card:has(.va-radio:checked)` → inset 1px primary + `va:bg-primary-bg`; selected offer card: the same `.va-select-card` selected state (the legacy loan frame's value is not used). **Evidence:** 199:13001 Box; 258:13116 Tabs; Full_time-1.png; 449:10462 Offer Selected=yes. **Confidence:** high.
- **Tables are avoided; the one matrix is a card.** Account Roles is the only column-headed layout on the surface; it is a bordered card with 47px rows of `.va-radio` / `.va-checkbox-control` cells, not a data table with header chrome — no component (§11). **Evidence:** 298:6344. **Confidence:** high.

---

## 6. State handling

- **Empty is the default; there is no separate empty state.** Fields show format placeholders in `va:text-content-hint` (`--color-content-hint`: #8e9195 — the `.va-text-field-input::placeholder` and `.va-dropdown-field-value-placeholder` ink); the checklist shows nothing selected; the roster shows existing owners or the inline form. **Evidence:** 199:12008 vs 199:12185; 290:5694. **Confidence:** high.
- **Progress is quantitative and neutral.** Declared ownership shows `40%` and a 4px bar (`va:h-1 va:rounded-full`) filled `va:bg-content-primary` (#1a1a1a, not brand) on a `#1a1a1a @8%` track `[raw]` — no progress component and no neutral track token (§13). **Evidence:** 258:13116 State; designer decision. **Confidence:** high.
- **Disabled = 30% of the brand fill, white text** — `.va-btn-primary:disabled` = `va:bg-primary-disabled` (`--color-primary-disabled`: #a6192e @30%), ink `va:text-content-contrast` never fades. The disabled *primary* is never gray. A disabled Back is the library's `.va-btn-secondary:disabled` — `va:border-stroke-divider va:text-content-tertiary`, gray by design and reserved for future use; no current frame disables Back. **Evidence:** all disabled primaries #a6192e @30%; designer decision. **Confidence:** high.
- **Selected = crimson border + 6% crimson tint** (`.va-box-action:has(:checked)`: inset 1px `--color-primary` + `va:bg-primary-bg`); **unselected checklist boxes are the library's rest display — `va:bg-surface-paper` (#fffdfb) with the label in `va:text-content-primary` (#1a1a1a) inside a 1px `stroke-divider` ring.** BoxAction has exactly three displays — rest, active (`:has(:checked)`: primary ring + `va:bg-primary-bg`, label `va:text-lead`) and disabled (`:has(:disabled)`: `va:bg-surface-app-page`, `va:text-content-tertiary`, 0.5px ring) — and the checklist uses rest and active only. **Evidence:** 199:13001; designer decision. **Confidence:** high.
- **Roles are pills, ownership is a number.** Business Review shows `Manager` / `Signer` as `.va-badge` (16px full-round `va:bg-neutral-bg` pill, `va:type-eyebrow va:text-content-secondary` — the OwnerContainer's own `tag` slot) beside a `va:text-title-medium` (16/20/500) percentage (`.va-owner-container-percent`); roster rows show the percentage alone. **Evidence:** Business_review.png, Full_time.png. **Confidence:** high.
- **The offer discount is shown as a strikethrough delta, and coverage acceptance flips the card text to crimson.** `6̶%̶ 5.5% APR`, `0.5% APR discount applied` in `va:text-primary-text`, two-dot pager fills per accepted coverage. Pattern only. **Evidence:** Loan_Web_4/5, Loan_Mobile_4/5. **Confidence:** high.
- **Validation errors render below the field in the warning color, with the field itself in its error display.** Both are the library's: `.va-text-field-box:has([aria-invalid="true"])` → `va:border-warning` (`--color-warning`: #b4791c) and the `.va-text-field-hint` under an invalid input → `va:text-warning-text` (`--color-warning-text`: #8b5d16); `.va-dropdown-field-trigger[aria-invalid="true"]` behaves the same. **Amber is the correct error display** — the Warning ramp is the intended binding on this surface; the `--color-error*` ramp stays unused here, permanently (designer 2026-09-16, D4: the unused `Error/*` ramp is not a slip and must not be rebound). **`.va-text-area-input` HAS an error axis as of `@valiify/shortapp-ui@1.2.0`**, mirroring TextField exactly: `[aria-invalid="true"]` → `va:border-warning`, its `.va-text-area-hint` → `va:text-warning-text`, error+hover excluded by name, error+focus keeping the amber border while the crimson ring still fires. `.va-radio-field` also gained one in 1.2.0, and it is **text-only** — `[aria-invalid="true"]` on the `<fieldset>` (which needs an explicit `role="radiogroup"`) turns `.va-radio-field-hint` to `va:text-warning-text` and the radio controls do not change, because the component has no box to paint. Do not invent a control-level cue for it. **Evidence:** designer decision; library bindings. **Confidence:** high (rule) / low (no frame draws the state).
- **Loading and post-`CONFIRM` success states appear in no frame.** The library ships `.va-skeleton` (16 shapes × sm/md/lg, container `role="status" aria-busy="true"`) and `.va-toast va-toast-success` / `.va-toast-simple`; whether either is used here is open (§13). `.va-modal` is the sanctioned overlay for any future confirmation on this surface (reserved).

---

## 7. Navigation and progression

- **Forward is the primary button or a card tap; back is the outline button, on every step after the first.** Choice steps render the row with `BACK` alone (`.va-btn va-btn-secondary`). **Evidence:** §2 table; designer decision. **Confidence:** high.
- **Position is the eyebrow only.** `STEP n OF m / SECTION`. Section names repeat across steps (`BSA DETAILS` on 5 and 6; `BUSINESS DETAILS` on 4 and 9). **Evidence:** eyebrow texts. **Confidence:** high.
- **Review is the hub for edits.** Every review card has `EDIT`; every roster row has `EDIT`; `ADD PRODUCT +` / `ADD OWNER +` (business) or `ADD A BENEFICIARY +` / `ADD A CO-APPLICANT +` (consumer) let the applicant grow the application from Review (affordances B and A respectively, §5). **Evidence:** 364:8398, 137:7266. **Confidence:** high.
- **Two forward verbs only: `CONTINUE` for every intermediate step, `CONFIRM` for Donate, Review (consumer and business) and Agreement.** Both are `.va-btn va-btn-primary` — the verb is content, not a variant. **Evidence:** button texts; designer decisions. **Confidence:** high.
- **`CONFIRM` on the final Review step hands off to the Applicant Portal.** The Short App has no success or submitted screen of its own; the portal (see `applicant-portal.md`) is the landing page after submission. Do not compose a confirmation page on this surface. **Evidence:** designer decision 2026-09-10. **Confidence:** high.
- **Linked legal text is inline and underlined,** never a separate step: `terms of use`, `privacy policy`, `Electronic agreement disclosure`, `fee schedule`, `membership signature card`. Plain `<a>` with `va:underline` inside the disclaimer's `va:text-label` run; the library ships no link component (`va:text-link` is a 14/Auto token with no consumer here). **Evidence:** Disclaimer container texts. **Confidence:** high.
- **Language switch is a header dropdown available on every step** — `.va-text-selector` (`aria-haspopup="listbox"`, `aria-expanded` flips the chevron and darkens the ink) opening a `.va-dropdown-list` of `.va-list-option va-list-option-sm` rows. **Evidence:** Text Selector on every Header. **Confidence:** high.

---

## 8. Copy and tone

- **Titles are questions or plain imperatives in sentence case, no trailing period:** "Are you currently a member?", "Tell us about yourself", "Select a loan offer", "One last step". **Evidence:** title texts. **Confidence:** high.
- **Second person, first-person consent.** Descriptions address "you"; disclaimers are "I have read and understand…", "I consent to…". **Evidence:** Disclaimer container texts. **Confidence:** high.
- **Step buttons are single uppercase verbs:** `BACK`, `CONTINUE`, `CONFIRM` — typed in sentence case; the `va:type-button-label` utility on `.va-btn-primary` / `.va-btn-secondary` supplies the caps (the library's casing-is-a-transform rule). Inline buttons are sentence-case verb + object: `Add Person`, `Save`, `Cancel`, `Add Another Owner` (`.va-utility-button` never transforms). **Evidence:** Button Text nodes. **Confidence:** high.
- **Field labels are the question or a short noun in sentence case; placeholders show the format, not a repeat of the label.** "What is your monthly income?" / `0.00`; "Phone number" / `000-000-0000`; "SSN, last 4" / `••••`. Labels are `.va-text-field-title`, `va:text-label-strong va:text-content-secondary` (`--text-label-strong`: Inter Medium 14/20): `First name`, `Date of birth`, `Business address`. **Evidence:** Label and {text} nodes; designer decision. **Confidence:** high.
- **Help text says what happens next and what won't be needed:** "After you submit, invited owners receive an email and text to complete their own identity details. You won't need their SSN." Always `va:text-help-caption va:text-content-secondary` (`--text-help-caption`: Inter Regular 12/14 · #54565b) behind a left rule, above the button row. Review rows use `va:text-timestamp` (12/16). **Evidence:** Footer "Layer field"; designer decision. **Confidence:** high.
- **Optional is a word, not an asterisk.** `Optional` right-aligned in gray (`va:text-help-caption va:text-content-tertiary`) in the field's title row — `.va-dropdown-field-optional` / `.va-text-area-optional` today; `.va-text-field` gains the same slot (§12). Required fields are unmarked. **Evidence:** Business_Details-1.png; designer decision. **Confidence:** high.
- **Middot separates inline metadata** (`(123) 456-7890 · john.smith@valiify.com` in `.va-owner-container-contact-text`, `6% APR • 60 Months`). **Evidence:** Contact Container; Offer Metrics. **Confidence:** high.

---

## 9. Anti-patterns

### 9.1 Failure modes this surface avoids (page-level)

| Failure mode | What the frames do instead | Evidence |
|---|---|---|
| Decision fatigue | One question per choice step; one topic per form step | §2 |
| Hidden progress | Eyebrow on every step; disabled primary until valid | §3, §6 |
| Buried consent | Consent rows are full-width, hairline-separated, with inline links; never a modal | 137:7541 |
| Ambiguous selection | Border + tint + control state together, never color alone | §5 |
| Dead-end edits | Every review card and roster row has an edit path; adds happen from Review | §7 |
| Orphaned conditional fields | Reveals indent under a left rule beneath their trigger | §5 |
| Format guessing | Every shaped field has a format placeholder | §5 |

### 9.2 Things the designer never does here

- Never a sidebar, rail, tab strip, breadcrumb, or KPI band. One column. (`.va-tabs` exists in the library; the only tab on this surface is the Individual/Company `.va-tab va-tab-application` pair inside a form.)
- Never a table with header chrome; the one matrix is a card.
- Never pure white on the applicant surface — surfaces are `va:bg-surface-paper` (#fffdfb) on `va:bg-surface-app-page` (#fafaf9); `--color-content-contrast` (#ffffff) is ink on fills only.
- Never a gray disabled *primary*; the disabled primary is the brand at 30% (`va:bg-primary-disabled`). A disabled Back is the library's gray `.va-btn-secondary:disabled`, reserved for future use.
- No current frame uses an overlay — inline forms, inline reveals. When a confirmation needs one, it is the library's `.va-modal` (reserved); never a bespoke drawer.
- Never a progress bar or back control in the header.
- Never monospace, never colored value text, never severity dots. (`--font-mono` is defined in the theme and has no consumer on this surface.)
- Never a second typeface; Inter only.
- Never `NEXT` as a button label; the forward verbs are `CONTINUE` and `CONFIRM`.
- Never a frame's typo reproduced; copy defects in source frames are accidents.
- Never an asterisk for required.
- Never more than one primary per screen; never a primary in the header.
- Never a value from the legacy loan frames (their text ink, red, white surface, radius 8, light weight) — pattern only.

### 9.3 Dashboard tokens and patterns that must not leak in

The reviewer surface (`dashboard.md`) has its own language. None of it belongs here, and none of it is *in* here: the values below were checked against this library's `src/themes/valiify.css` and resolve to nothing.

- **Deep-blue accent `#1e4d8c` and cool canvas `#f0f3f7`.** Verified absent — this library's `--color-primary` is crimson #a6192e and its canvas is `--color-surface-app-page` #fafaf9 / paper #fffdfb. **Confidence:** high.
- **Blue-black hairlines at `#141428 @8%`.** Verified absent — every applicant hairline is warm-black `--color-stroke-*` on #1a1a1a: card rings 1px `stroke-divider`, header and separators `va:border-stroke-divider` (1px, @11%), control strokes `va:border-stroke-border` (1px, @17%; 1.5px on `.va-checkbox-control` / `.va-radio`). **Confidence:** high.
- **10.5px semi-bold tracked labels, 12.5px data type, 13px row titles.** The applicant floor is `va:type-eyebrow` (11/16) for eyebrows, `va:text-help-caption` (12/14) for help text and `va:text-timestamp` (12/16) for review rows; body is 14–16 (`va:text-label`, `va:text-input`); titles `va:text-display` (28). Nothing under 11 on a page (the library's `va:type-micro-label` 9/12 appears only inside `.va-btn-micro` and `.va-action-status`). **Confidence:** high.
- **JetBrains Mono for IDs, counts, timestamps.** No monospace anywhere on the applicant surface; IDs and phone numbers are Inter. **Confidence:** high.
- **The 140/960 margin-label module grid, summary rail, tab lenses, kebab menus, popover menus, KPI tiles, filter chips, severity dots, verification-column vocabulary (`Verified` / `Applicant stated` / `n/m checks`).** None appear. **Confidence:** high.
- **Reviewer voice** ("Requirement", "Finding", "Source", "Go to source · KYB · TIN check"). Applicant copy is second person and never names vendors or checks. **Confidence:** high.
- **Compact 24–28px controls.** Applicant controls are 48 (`va:h-12`) — `.va-btn`, `.va-text-field-box`, `.va-dropdown-field-trigger`, `.va-box-action-checkbox`. The library's 34px `.va-utility-button` and 24px `.va-icon-button-state` appear only inside cards. **Confidence:** high.

---

## 10. Component map

Every pattern in §1–§8 that the library ships, with the class to use. Slots and states follow the library's `CLAUDE.md`.

| Pattern | Library |
|---|---|
| Header: 60 bar, centered logo, bottom hairline, language selector; mobile `EN` swap | `.va-header` › `.va-header-logo`, `.va-header-desktop` / `.va-header-mobile` › `.va-text-selector` (`.va-text-selector-icon`, `-label`, `-chevron`); sticky z-40 |
| Language dropdown panel | `.va-dropdown-list` › `.va-list-option va-list-option-sm` (`aria-selected`) |
| Choice card (76, chevron, radius 6) | `.va-select-card` (`<button>`) › `.va-select-card-text` › `.va-select-card-title` (`va:text-label-strong` 14/20), `.va-select-card-description`, `.va-select-card-chevron` (18, `va:text-neutral`) |
| Selected radio card ("I'll enter their details now") | `.va-select-card` (`<label>`) + `.va-radio`; `:has(:checked)` → 1px primary ring + `va:bg-primary-bg` |
| Checklist box (48, checkbox, selected = crimson ring + 6% tint) | `.va-box-action va-box-action-checkbox` › `.va-checkbox-control` › `.va-checkbox-input` + `.va-checkbox-check`, `.va-box-action-label`; rest and active displays only |
| Checkbox (18, radius 3, 1.5px ring) | `.va-checkbox-control` › `.va-checkbox-input` + `.va-checkbox-check` (`#check`) |
| Radio (20) | `.va-radio` on `<input type="radio">` |
| Yes / No radio group | `.va-radio-field` (`<fieldset>`) › `.va-radio-field-title` (`<legend>`), `.va-radio-field-options`, `.va-radio-field-option`, optional `.va-radio-field-hint` |
| Text input with label (73 pitch, 48 box, radius 4, `$` icon) | `.va-text-field` › `.va-text-field-title-row` › `.va-text-field-title`; `.va-text-field-box` › `.va-text-field-icon` + `.va-text-field-input`; `.va-text-field-hint`; `Optional` title-row slot planned (§12) |
| Multi-line free text with label (104 pitch, 79 box, radius 4) — an answer that is a list or a sentence | `.va-text-area` › `.va-text-area-title-row` › `.va-text-area-title` (+ optional `-optional`, `-help`); `.va-text-area-input` (the native `<textarea>` IS the box); `.va-text-area-hint`. Error axis as of 1.2.0, same ramp as `.va-text-field` (§6). `resize: none` by default. **In-scope frames:** BSA Filled 199:12185 → `636:2045` (wire countries, C3) and `636:2448` (international-customer countries, C6), both 560×104 `Text Area Field` instances |
| `Select…` dropdown field | `.va-dropdown-field` › `.va-dropdown-field-title-row` › `.va-dropdown-field-title` (+ `.va-dropdown-field-optional`); `.va-dropdown-field-trigger` › `.va-dropdown-field-value` (`-value-placeholder`) + `.va-dropdown-field-chevron`; panel `.va-dropdown-list` › `.va-list-option` |
| Validation error (amber border, hint) | `[aria-invalid="true"]` on `.va-text-field-input` / `.va-dropdown-field-trigger`; `.va-text-field-hint` / `.va-dropdown-field-hint` → `va:border-warning`, `va:text-warning-text` |
| Mailing-address toggle; loan coverage switches | `.va-switch` (`role="switch"`, 36×20) |
| Step buttons `BACK` / `CONTINUE` / `CONFIRM`; disabled primary; add-affordance (A) | `.va-btn va-btn-secondary` / `.va-btn va-btn-primary` (+ `va:w-full`, `va:flex-1`); `:disabled` → `va:bg-primary-disabled` |
| Inline `Add Person` / `Save` / `Cancel` | `.va-utility-button va-utility-button-filled` / `va-utility-button-empty` (34, `va:text-field-label` 13/500, natural case) |
| Roster owner row (well 34, name, %, contact, Edit + trash) | `.va-owner-container` › `.va-owner` (`#user` / `#building`), `.va-owner-container-info` › `.va-owner-container-title` (`.va-owner-container-name`, `.va-badge`, `.va-owner-container-percent`) › `.va-owner-container-contact` (`.va-owner-container-contact-text`, `.va-owner-container-actions`) |
| "Avatar" well (34, 8% neutral, 18 glyph) | `.va-owner` — **not** `.va-avatar` (a 24/20 initials circle) |
| Role pills `Manager` / `Signer` | `.va-badge` (16, `va:bg-neutral-bg`, `va:type-eyebrow va:text-content-secondary`) |
| Individual / Company segmented tab | `.va-tabs` › `.va-tab va-tab-application` (`aria-selected`) |
| `EDIT` micro text button; trash | `.va-btn va-btn-micro` + `#pencil`; `.va-icon-button va-icon-button-sm va-icon-button-state` + `#trash-2` |
| Add-affordances (B) header text button, (C) roster footer | `.va-btn va-btn-micro` + `#plus` |
| Field help `?` icon | `.va-text-field-help` / `.va-dropdown-field-help` / `.va-radio-field-help` + `.va-tooltip` (18, `va:text-neutral-disabled`) |
| Title-block eyebrow (`STEP n OF m / SECTION`) | `va:type-eyebrow` in `va:text-content-tertiary` + `va:text-primary-text` |
| Confirmations (future) | `.va-modal` (`<dialog>` + `showModal()`, `.modal-notice-*` banners, backdrop z-50 / card z-60) — reserved, no current frame |
| Disabled Back (future) | `.va-btn btn-secondary:disabled` — reserved, no current frame |
| Keyboard focus | `va:focus-ring` utility on every interactive element (3px `--color-primary-ring`, #a6192e @22%) |
| Loading (proposed) | `.va-skeleton va-skeleton-input va-skeleton-sm`, `va-skeleton-button`, `va-skeleton-text`, `va-skeleton-heading` in a `role="status"` container — unconfirmed (§13) |

Shipped components that no in-scope frame uses: `.va-avatar`, `.va-btn-bubble`, `.va-tab-portal`, `.va-box-action-switch`, `.va-toast`, `.va-status-tracker`, `.va-action`, `.va-utility-button-rounded` / `-text`, `.va-icon-button-subtle`. Do not map by analogy — the loan pages in particular are legacy and have no portal components.

The multi-line free-text field was on that list until 2026-09-16 and is now mapped in the table above — see §13.1. **Keep this note on its own line, and do not write the class name in backticks here:** the class-audit harvests every backticked class from the shipped-but-unused sentence's line and treats it as forbidden, so a removal note sharing that line silently re-adds what it says was removed.

---

## 11. Patterns with no component

Compose these from tokens and the primitives above. Nothing in `_dashboard-archive/` may be cited or imported; `_template.css` is scaffolding, not a component.

> **Page layout is the app's, and custom layout CSS is sanctioned here**
> (decided 2026-10-20, §13.1). The library ships components, not a layout
> shell, and it never will: the package has no page-shell class and the
> prebuilt utility surface is a closed set, so a layout need that no shipped
> utility covers is **not** a `no-component` stop. Write the rule as ordinary
> CSS in the app, under the app's own class names, exactly as the Roles matrix
> row below already writes a literal inset shadow.
>
> Two limits keep this from becoming a loophole. It covers **layout only**:
> position, flow, visibility, track sizing and breakpoints. Anything with a
> *visual* value — colour, radius, type, spacing rhythm, borders — still comes
> from a token or a shipped utility, and a raw one is still marked `[raw]`.
> And it never restyles a component: a library class is not a selector the app
> may override. A block that needs a component that does not exist is still a
> `no-component` stop.
>
> When writing such a rule into this document, name the app's classes without
> a leading dot and do not spell out library utilities or CSS declarations in
> backticks: the utility surface is generated by scraping prefixed utility
> names out of this file, so naming one here ships it, and the vocabulary gate
> reads a dotted token in backticks as a component class.

| Pattern | Composition |
|---|---|
| Page shell | canvas `va:bg-surface-app-page`; body `va:w-140 va:mx-auto va:py-12 va:flex va:flex-col va:gap-10`; `.va-header` as a direct child of the scroll container (sticky contract) |
| Title block | `va:type-eyebrow` row (`va:text-content-tertiary` run + `va:text-primary-text` section) › `va:text-display va:text-content-primary` › `va:text-input va:text-content-secondary`, `va:gap-2` |
| Button row (web) | `va:flex va:gap-6`; `.va-btn va-btn-secondary` (+ `#arrow-left`) · `.va-btn va-btn-primary va:flex-1` (+ `#arrow-right`); `va:w-full` primary when no Back; in flow |
| Mobile footer (interim, until the §12 component lands) | `va:h-19 va:py-3.5 va:px-4 va:flex va:gap-5 va:bg-surface-paper va:mt-auto va:sticky va:bottom-0 va:z-40` with `box-shadow: inset 0 1px 0 var(--color-stroke-divider)`; **the top hairline is an INSET SHADOW written as CSS, not a border and not a utility** (the Roles matrix row below writes its hairline the same way — an arbitrary shadow utility does not survive the surface generator, so spelling it as one would ship nothing) — a border occupies layout and pushed the whole action row 1px down against the frame (BSA accuracy run 2026-10-15, corroborated by the build's own self-check: Back at y1479 against a record of 1478), while a Figma stroke displaces nothing. Same reason OwnerContainer, Tabs-Application and Modal all paint their rules as inset shadows; `.va-btn va-btn-secondary` 99 + `.va-btn va-btn-primary va:flex-1`; the bar's horizontal padding follows the shell's (`va:px-5` on the revised BSA frames — 720:8131 pads 14/20; 721:8460 still 14/16, a frame inconsistency on the designer list). **Pinning contract:** the footer is a DIRECT child of the scroll container (`<body>`), which is `va:min-h-screen va:flex va:flex-col`; `va:mt-auto` parks the bar at the viewport bottom when the step is shorter than the screen, `va:sticky va:bottom-0` keeps it there while a taller step scrolls. A wrapper around the bar becomes its containing block and makes the sticky inert (§13.1, 2026-09-17) |
| Responsive action row (web button row vs mobile footer) | The two are different elements in different DOM positions — the web row sits in flow inside the column (§1.1), the mobile footer is a direct child of the scroll container (§1.2, and the pinning contract below). Draw **both**, and switch them in the app's own stylesheet, because no shipped utility can: the closed surface carries no display or visibility utility, at any breakpoint. Give the two elements app-owned class names (step-actions-web and step-actions-mobile, or the app's equivalent) and let the app's CSS show one and hide the other, with the mobile one showing by default and the web one taking over at a 768px min-width media query — the library's single sanctioned breakpoint (Header's switch; Library Contracts). Each element still carries its own library classes from the two rows below; the app's rule sets nothing but which one displays. Do not merge them into one element with breakpoint resets, and do not render one and hide it from sight only, which leaves the actions duplicated for assistive tech. A script `matchMedia` branch is also acceptable but is not the default: it paints one variant on the server and shifts on hydrate |
| Sub-section label + hairline | `va:type-eyebrow va:text-content-secondary` over `va:border-b va:border-stroke-divider` |
| Checklist "None of the below" seam | `va:border-b va:border-stroke-divider` after the first `.va-box-action`, inside the `va:gap-3` stack |
| Conditional reveal | `va:border-l va:border-stroke-divider va:pl-5.5 va:flex va:flex-col va:gap-5` (indent ~22 `[raw]`) |
| Disclaimer row | `va:flex va:items-start va:gap-3`; `.va-checkbox-control` + `va:text-label va:text-content-secondary` with `va:underline` links; Agreement rows separated by `va:border-b va:border-stroke-divider` |
| Instruction callout | `va:border-l va:border-stroke-divider va:pl-4 va:text-help-caption va:text-content-secondary va:mb-4` |
| Review group | `va:type-eyebrow va:text-content-secondary` label (+ affordance B right) › card `va:bg-surface-paper va:rounded-sm va:p-4.5 va:flex va:flex-col va:gap-3` with `va:ring-1 va:ring-inset va:ring-stroke-divider` › `va:type-eyebrow` eyebrow, `va:text-title` name (consumer) / `va:text-title-medium`, `EDIT` `.va-btn va-btn-micro`; rows `va:flex va:text-timestamp` with `va:w-[142px]` label in `va:text-content-secondary`, value `va:text-content-primary`, `va:border-b va:border-stroke-divider` |
| Product review card | card as above, `va:p-4 va:flex va:items-center va:justify-between va:gap-4`; left `va:text-label-strong` product name over `va:text-label va:text-content-secondary` one-line description; right `View Details` as a plain `<a>` `va:text-label va:text-content-secondary va:underline` (no button component); group label carries affordance (B) `ADD PRODUCT +` |
| Affordance (A) | `.va-btn va-btn-secondary va:w-full` + `#plus` below the review cards |
| Affordance (B) | `.va-btn va-btn-micro` + `#plus`, `va:ml-auto` in the group label row |
| Affordance (C) | `va:h-12 va:w-full va:flex va:items-center va:justify-center` row holding `.va-btn va-btn-micro` + `#plus`, last row of the roster card |
| Roster card | `va:bg-surface-paper va:rounded-sm va:ring-1 va:ring-inset va:ring-stroke-divider`; `.va-owner-container` rows (own bottom hairline); inline form `va:bg-surface-app-page va:p-5 va:flex va:flex-col va:gap-4`, fields `va:w-[518px]`, two-up `va:flex va:gap-4`; footer affordance (C) |
| Ownership progress | label row `va:h-9.5 va:flex va:items-center va:justify-between va:text-label-strong`; track `va:h-1 va:rounded-full` in `#1a1a1a @8%` `[raw]` with fill `va:bg-content-primary` |
| Roles matrix | card as above; header `va:h-6 va:grid` `va:w-79 / va:w-30 / va:w-30` in `va:type-eyebrow va:text-content-secondary`; rows `va:h-[47px] va:py-1 va:px-4 va:grid` with `box-shadow: inset 0 -1px 0 var(--color-stroke-divider)`; cells `.va-radio` / `.va-checkbox-control`; `.va-tabs` › `.va-tab va-tab-application` for Individual/Company |
| Informational confirm card | `va:bg-surface-paper va:rounded-sm va:p-4 va:ring-1 va:ring-inset va:ring-stroke-divider`; `va:text-label-strong` title, `va:text-label va:text-content-secondary` body |
| Two-up fields | column level `va:flex va:flex-col va:gap-5` → `va:md:flex-row va:md:gap-6`, `va:md:w-67` each (mobile-first — see §11) / `va:flex va:gap-4` (inside the 518 inline form) |
| Three-up standalone fields (Phone / ZIP / SSN last 4) | `va:flex va:gap-4`; first field `va:flex-1`, the two short fields `va:w-32` (128) each (272 + 16 + 128 + 16 + 128 = 560); stacks on mobile per §1.2. Standalone titled fields only — the address composite below is a different pattern |
| Address composite (Address / Apt / City · State · ZIP) | one joined group, not three fields: outer `va:rounded-sm` container with `va:ring-1 va:ring-inset va:ring-stroke-divider`; rows Address, Apt, City·State·ZIP stacked with `va:border-b va:border-stroke-divider` seams, no gaps; inputs are `.va-text-field-box` without `.va-text-field-title-row` (the composite has no per-field titles — the group's title is `Address` above it); the last row is `va:grid va:grid-cols-[7fr_4fr_5fr]` with `va:border-l va:border-stroke-divider` seams between cells (City ≈ 44% / State ≈ 25% / ZIP ≈ 31%); State is a `.va-dropdown-field-trigger`; `Optional` on the Apt row sits inside the input, right-aligned, `va:text-help-caption va:text-content-tertiary` (the only place Optional is not in a title row). Same proportions at 343; State label → `ST`, ZIP placeholder → `ZIP`. Evidence 676:4758 / 676:4982, measured from PNG — confidence medium on the exact ratio |
| Open listbox panel (`.va-dropdown-field` trigger, header language selector) | trigger wrapped in `va:relative`; the `.va-dropdown-list` panel `va:absolute va:top-full va:mt-1 va:z-60` — plus `va:left-0 va:w-full` to span a field trigger, or `va:right-0 va:w-32` for the header language menu; mounted only while open. The 4px offset is a library decision: no frame draws an open panel (Dropdown Field set 1:358 has no open variant) — see §13.1, 2026-09-17 |
| Switch row (mailing-address toggle, coverage opt-ins) | `va:flex va:items-center va:justify-between va:gap-4 va:h-12`; label `va:text-label-strong va:text-content-secondary` left, `.va-switch` right; the revealed block follows as a conditional reveal |
| `Optional` on a text field (interim, until the §12 slot ships) | `.va-text-field-title-row va:flex va:justify-between` with a trailing `<span class="va:ml-auto va:text-help-caption va:text-content-tertiary">Optional</span>`, mirroring `.va-dropdown-field-optional` |
| Offer selection (loan, pattern only) | total card + collapsible breakdown as a review-style card; coverage rows as `va:flex` rows with `.va-switch`; offers as `.va-select-card` (`<label>` + `.va-radio`); strikethrough `va:line-through va:text-content-tertiary` + `va:text-primary-text` delta |

---

## 12. Planned library additions

Decided; repo work outside this document (Figma component first, then the library's `/extract` → `npm run new:component` → visual-spec process). Until they ship, pages use the interim recipes in §11; once they ship, the rows here become §10 entries.

A class named in this section does **not** exist yet, so it is written **without a leading
dot** — `va-text-field-optional`. The dotted form asserts a class the bundle ships, and
`npm run verify:vocabulary` reads it exactly that way; a planned name is a name, not a
reference. Add the dot in the same change that adds the class.

| Addition | Spec from the frames | Library home |
|---|---|---|
| Mobile sticky action bar | 76 tall (`va:h-19`), `va:py-3.5 va:px-4`, `va:bg-surface-paper`, top hairline `va:border-t va:border-stroke-divider`, `va:sticky va:bottom-0`, `va:z-40`; slots for `.va-btn va-btn-secondary` (99, hug) + `va:gap-5` + `.va-btn va-btn-primary va:flex-1`; applies to every flow below `md` (§1.2) | new component — name to be chosen at scaffold time |
| TextField optional slot | title-row marker `Optional`, `va:ml-auto va:text-help-caption va:text-content-tertiary`, mirroring `.va-dropdown-field-optional` / `.va-text-area-optional` | modifier on `.va-text-field-title-row` — will ship as `va-text-field-optional` (unshipped, so named without a leading dot), the spelling its shipped siblings `.va-dropdown-field-optional` / `.va-text-area-optional` already fix |

---

## 13. Open items

Anything a page needs from this list is unspecified; do not infer it.

- **Loading state** — none drawn. `.va-skeleton` shapes exist; composition unconfirmed.
- **Web button-row scroll behavior** — in flow by decision; the frames are static and neither confirm nor contradict it.
- **Conditional-reveal indent** — ~22px from PNG only; exact values are in the `Layer field` / `Address Super entry` components. The §11 recipe (`va:pl-5.5`) is the interim rule and is not a stop.
- **Progress-bar track colour** — `#1a1a1a @8%` has no token (`--color-action-active` / `-pressed` share the value but are interaction overlays; `--color-primary-track` is crimson). Raw composition stands until a token or component exists.
- **Roles-matrix label type** — the frame's 16/20 has no component; unmapped.
- **Mobile shell horizontal padding** — the revised BSA mobile frames (2026-09-17) pad 20 (`va:px-5`, 335 column) where every other mobile frame and §1.2's rule say 16 (`va:p-4`, 343). Within the BSA pair, mobile-filled's footer (721:8460) still pads 16. Designer to confirm whether 20 is the shell rule surface-wide; until then a page follows its own frames.
- **`.va-owner-container` pinned height on mobile** — the library pins `va:h-[92.5px]`, but at 343 the contact line wraps and the row must hug (§1.2). Needs a library check: drop the pin below `md` or let the row hug everywhere.
- **Library follow-ups (§12)** — decided but not yet built.

### 13.1 Amendment log

Changes to this file after its initial authoring, with what triggered them. A rule
here was wrong or absent; the entry says how that was established, so the same
question is not re-litigated from the frames each time.

**2026-10-20 — Page layout is the app's; custom layout CSS sanctioned; §11 gains a Responsive action row.**

*Triggered by:* `/design` run `2026-10-15-design-bsa-account-information`, Gate 3
critique finding F3. The concept drew the web button row (b29) and the mobile
footer (b30) as two elements in two DOM positions, correctly, and then had no way
to show one and hide the other: the closed prebuilt surface carries no display or
visibility utility at any breakpoint, and no §10 or §11 entry named a mechanism.
Under skill §3 that is a partial §11 recipe gap, so the architect was obliged to
stop — `CONCEPT: BLOCKED` with a `no-component` question.

*Established by:* the requester's decision, 2026-10-20: the library will not ship
a layout shell of any kind, page layout is the consuming app's responsibility, and custom
layout CSS is allowed. This is a scope decision about the package, not a reading
of the frames, so no frame evidence applies or was sought.

*Consequence:* a layout need with no shipped utility is no longer a stop — see the
note under §11. Two things deliberately did NOT change. The `no-component` trigger
itself is untouched (it lives in val-core's skill §3, and still fires for a missing
*component*). And the allowance is layout-only: visual values still come from
tokens, and library component classes are still not the app's to restyle. The
same critique's F1, a tabular-figures utility the closed surface does not carry,
is a different question — a missing *utility*, not a layout rule — and is
unaffected by this entry.

*Noted while writing this entry:* naming a prefixed utility anywhere in this file
ships it, because `build-utility-surface.mjs` scrapes this directory for them. A
first draft of this entry cited the three absent utilities by name and silently
added them to the surface. That is why the note under §11 says to describe such
utilities rather than spell them.

**2026-09-17 — BSA mobile frames revised to 20px horizontal padding; recorded per-frame, rule left open.**

*Triggered by:* Val run `2026-09-16-val-bsa-account-information`, requester note during review:
the designer increased the left/right padding on all elements of 720:8067 and 721:8438 to
20. Re-extraction confirmed: shell padding 16 → 20 on both, column 343 → 335, every field,
divider and label x 16 → 20; the empty frame's footer bar pads 14/20 (primary 224 → 216),
the filled frame's footer bar still 14/16 (not updated); heights unchanged; header unchanged
(already 20). §1.2 records the revised frames' values with `va:px-5`; because the rule "same
343 column / 16 padding" rests on other flows' frames, the surface-wide question is a §13
open item rather than a silent rewrite.

**2026-09-17 — the mobile footer's pinning is spelled out; "sticky" alone never engaged.**

*Triggered by:* Val run `2026-09-16-val-bsa-account-information`, requester review of the
375 render: the footer bar sat in flow under the last field with empty canvas beneath it.
§1.2 said "sticky footer" and the §11 recipe carried `va:sticky va:bottom-0`, but the
surface had no `va:min-h-screen` / `va:mt-auto`, and the page had wrapped the bar in a
mount div — a containing block exactly the bar's height, inside which `va:sticky` can do
nothing. On a step shorter than the viewport, `va:sticky va:bottom-0` alone never pins anyway:
it needs the scroll container to be at least viewport-tall and the bar pushed to its end.
The recipe now states the contract: `<body>` (the scroll container) is `va:min-h-screen
va:flex va:flex-col`; the bar is its direct child with `va:mt-auto va:sticky va:bottom-0
va:z-40`. Both mobile frames pin the bar to the artboard bottom (720:8067 → 991–1067,
721:8438 → 1464–1540), so this is frame evidence, not a library decision.

**2026-09-17 — the open listbox panel has a recipe; it was absent, not forbidden.**

*Triggered by:* Val run `2026-09-16-val-bsa-account-information` (BSA Details, step 5 of
10, built in the strict 1.3.0 vocabulary). The requester saw the `.va-dropdown-list`
panel push the fields below it down and sit flush against its trigger. Cause: §11 named
the panel's classes (`.va-dropdown-list` › `.va-list-option`) but no positioning, and the
generated utility surface therefore carried none of the positioning utilities the recipe
needs — `va:absolute`, `va:relative`, `va:top-full`, `va:left-0`, `va:right-0`, `va:mt-1` —
and a page that may write only sanctioned classes could only render the panel in flow.

> **Cite concrete class names in this file, never a family glob.** The surface generator
> harvests every `va:`-spelled token here as a build candidate, and its pattern stops at an
> asterisk — so a family glob is harvested as a prefix-only fragment that cannot compile.
> Eight such fragments (the four positioning families named above, each also in its `md:`
> form) were dropped by the generator's compile step on 2026-09-17: harmless, since dropping
> non-compiling candidates is exactly what that step is for, but they are noise in the build
> report and they came from prose, not from any page. Naming the real utilities keeps both
> gates satisfied — `verify:vocabulary` wants the `va:` prefix on every utility this file
> mentions, and the generator wants every token it finds to compile.

*Why the methodology was what was wrong:* the library's DropdownField and TextSelector
docs say "consumer JS positions and toggles" the panel — positioning is a surface
concern by contract, and the surface never said how. No frame in the file draws an open
panel (Dropdown Field set 1:358 has no open variant; the language menu is never shown
open), so the recipe is a library decision, recorded as such: panel `va:absolute
va:top-full va:mt-1 va:z-60` (the z-scale's modal/panel step) inside a `va:relative`
wrapper on the trigger; `va:left-0 va:w-full` spans a field, `va:right-0 va:w-32` sits
a header menu under its selector. The 4px `va:mt-1` offset has no frame evidence and is
open to the designer.

**2026-09-16 — `.va-text-area` is mapped; it was never unsanctioned, only unenumerated.**

*Triggered by:* design run `2026-09-16-design-bsa-account-information` (BSA Details,
step 5 of 10). The concept architect returned `CONCEPT: BLOCKED | no-component` on the
three "To or from which countries?" fields: §2, §5 and §10 named no multi-line control,
and §10's closing line listed `.va-text-area` among components "no in-scope frame uses",
followed by "Do not map by analogy" — a prohibition. The architect correctly refused to
compose it and refused to silently downgrade to a single-line field.

*Why the methodology was what was wrong:* the library had just shipped an error axis on
`.va-text-area` **for these exact fields** (`@valiify/shortapp-ui@1.2.0`, decisions
D1/D3), so the file asserted a component was unused on this surface in the same week the
library extended it to serve that surface.

*How it was established, before editing:* the BSA Filled frame (`199:12185`) was read
directly. It contains **two** `Text Area Field` instances — `636:2045` at y=606 (the wire
countries field, C3) and `636:2448` at y=1025 (the international-customer countries field,
C6) — each 560×104, which is the component's own 25 label row over its 79 box. Both are
multi-line controls, drawn, in an in-scope frame. Note their node ids (`636:*`) against
the frame's own (`199:*`): they were added to the frame **after** it was authored, which
is consistent with BSA not having been among the screens enumerated when §10's
shipped-but-unused line was written. The line was stale, not a decision.

*Evidence precision — one correction to the question as asked:* the request named
"BSA C3/C5/C6" as the frame evidence. Only **C3 and C6** are drawn. **C5** — the ACH
countries field — appears nowhere in the filled frame, because that frame's ACH
international-wires child is not answered `Yes`. C5's existence rests on the brief's
explicit statement that the wire and ACH chains behave identically, not on a drawn
control. Two drawn instances are sufficient evidence for this amendment; C5 is composed
by that stated symmetry.

*Edits made:* §5 (free entry split by single-line vs multi-line), §6 (the "no error axis"
claim corrected, and RadioField's text-only error axis recorded), §10 (new multi-line row
with frame evidence; `.va-text-area` removed from the shipped-but-unused line).
`.claude/skills/valiify-shortapp-ui/SKILL.md` was corrected in the same change for the
same reason.

*Unchanged by this amendment:* decisions D1–D4 stand exactly as taken. The error axis was
the right call; this is the methodology catching up to it.

---

## Appendix A — Value ledger

**Color**

| Role | Token / utility |
|---|---|
| Canvas | `--color-surface-app-page` (#fafaf9) · `va:bg-surface-app-page` |
| Surface (header, cards, inputs) | `--color-surface-paper` (#fffdfb) · `va:bg-surface-paper` |
| Text primary | `--color-content-primary` (#1a1a1a) · `va:text-content-primary` |
| Text secondary (labels, descriptions, disclaimers) | `--color-content-secondary` (#54565b) · `va:text-content-secondary` |
| Text muted (eyebrow run, language, optional) | `--color-content-tertiary` (#6f7276) · `va:text-content-tertiary` (same hex as `--color-neutral`, the glyph ink of `.va-select-card-chevron` / `.va-owner`) |
| Placeholder | `--color-content-hint` (#8e9195) · `va:text-content-hint` |
| Brand / primary / selection / section eyebrow | `--color-primary` (#a6192e) · `va:bg-primary` / `va:border-primary`; `--color-primary-text` · `va:text-primary-text`; `--color-primary-bg` (@6%) · `va:bg-primary-bg`; `--color-primary-disabled` (@30%) · `va:bg-primary-disabled` |
| Card ring | `--color-stroke-divider` · components carry it natively (`.va-select-card`, `.va-box-action`); composed cards use `va:ring-1 va:ring-inset va:ring-stroke-divider` — the class form of the same inset 1px shadow |
| Hairline (header, separators) | `--color-stroke-divider` (#1a1a1a @11%) · `va:border-b va:border-stroke-divider` (`.va-header`); row seams `inset 0 -1px 0 var(--color-stroke-divider)` (`.va-list-option`) |
| Control stroke (inputs, outline buttons) | `--color-stroke-border` (#1a1a1a @17%) · `va:border-stroke-border` (`.va-text-field-box`, `.va-btn-secondary`); `inset 0 0 0 1.5px` on `.va-checkbox-input` / `.va-radio` |
| Control hover stroke | `--color-stroke-hover` (#1a1a1a @56%) — library hover on fields, cards, boxes |
| Progress track / fill | `#1a1a1a @8%` `[raw]` / `va:bg-content-primary` |
| Avatar well | `--color-neutral-bg` (#6f7276 @8%) · `va:bg-neutral-bg` (`.va-owner`, `.va-badge`) |
| Validation | `--color-warning` (#b4791c) · `va:border-warning`; `--color-warning-text` (#8b5d16) · `va:text-warning-text` |
| White on fills | `--color-content-contrast` (#ffffff) · `va:text-content-contrast` (`.va-btn-primary`, `.va-checkbox-check`) |
| Focus ring | `--ring-focus-width` 3px · `--ring-focus-color` (`--color-primary-ring`, #a6192e @22%) · `va:focus-ring`; `--shadow-focus-ring` for real-shadow cases |

**Type**

| Role | Utility |
|---|---|
| Eyebrow — `STEP n OF m` run, section name, sub-section label, matrix header, review eyebrow | `va:type-eyebrow` (Inter Semi Bold 11/16, +10%, UPPERCASE) in `va:text-content-tertiary` / `va:text-primary-text` / `va:text-content-secondary` |
| Step title | `va:text-display` (Inter Medium 28/34) |
| Description | `va:text-input` (Inter Regular 16/24) |
| Input value / checklist label / radio option | `va:text-input` (`.va-text-field-input`, `.va-box-action-label`, `.va-radio-field-option`); checked box label `va:text-lead` (16/24/500) |
| Choice title | `.va-select-card-title` `va:text-label-strong` (14/20/500) |
| Owner name / percent | `va:text-title-medium` (Inter Medium 16/20) (`.va-owner-container-name`, `-percent`) |
| Field label / radio title | `va:text-label-strong` (Inter Medium 14/20) (`.va-text-field-title`, `.va-radio-field-title`) |
| Disclaimer / choice description | `va:text-label` (Inter Regular 14/20) (`.va-select-card-description`) |
| Review row (label and value) | `va:text-timestamp` (Inter Regular 12/16) |
| Help text (instruction callout), language selector, owner contact line | `va:text-help-caption` (Inter Regular 12/14) |
| Step button | `va:type-button-label` (Inter Semi Bold 14/20, +10%, UPPERCASE) (`.va-btn-primary`, `.va-btn-secondary`) |
| Inline button (`Add Person`, `Save`) | `va:text-field-label` (13/16/500) (`.va-utility-button`) |
| `EDIT` / add-affordance micro button | `va:type-micro-label` (9/12/600, +8%, UPPERCASE) (`.va-btn-micro`) |
| Review applicant name | `va:text-title` (Inter Medium 22/26) |

**Dimensions**

| Element | Utility / class |
|---|---|
| Viewport / column | 1920 / `va:w-140 va:mx-auto` (560 @ x 680) · mobile 375 / `va:w-[343px]` (`va:p-4` shell) |
| Header / mobile footer | `.va-header` `va:h-15` (60) · footer `va:h-19` (76, planned component) |
| Body padding / block gap | `va:py-12` (48) / `va:gap-10` (40) |
| Title block | 90 emergent from `va:type-eyebrow` / `va:text-display` / `va:text-input` + `va:gap-2` |
| Choice card / checklist box / input / button / add-another row | `.va-select-card` (76 emergent) / `.va-box-action-checkbox` `va:h-12` / `.va-text-field-box` `va:h-12` / `.va-btn` `va:h-12` / `va:h-12` row holding `.va-btn-micro` |
| Field pitch / field gap / card gap | `.va-text-field` (25 + 48 = 73) / `va:gap-5` (20) / `va:gap-3` (12) |
| Owner row / matrix row | `.va-owner-container` `va:h-[92.5px]` / `va:h-[47px]` (composed) |
| Inline button / segmented tab / badge | `.va-utility-button` `va:h-[34px]` / `.va-tab-application` (hug) / `.va-badge` `va:h-4` |
| Two-up fields | `va:gap-4` in `va:w-[518px]` · `va:gap-6`, `va:w-67` |
| Review card padding / label column / progress label row | `va:p-4.5` (18) / `va:w-[142px]` / `va:h-9.5` (38) |
| Roles matrix columns | `va:w-79` / `va:w-30` / `va:w-30` (316/120/120) |
| Icons | `va:size-4.5` (18: `.va-btn svg`, `.va-select-card-chevron`, `.va-text-field-icon`, `.va-owner svg`) · `.va-owner` `va:size-8.5` (34 well) · `.va-radio` `va:size-5` (20) · `.va-checkbox-control` `va:size-4.5` (18) |
| Radii | `va:rounded-md` (`--radius-md`, 6: choice card) · `va:rounded-sm` (`--radius-sm`, 4: input/button/box/review/roster) · `va:rounded-[3px]` (checkbox, library raw) · `va:rounded-full` (progress, badge) |
| Strokes | `va:border-b va:border-stroke-divider` (1px header/separators) · `va:border va:border-stroke-border` (1px controls) · `inset 0 0 0 1.5px` (checkbox, radio) · card rings `va:ring-1 va:ring-inset va:ring-stroke-divider` |
| Z-index | library scale: content `va:z-0` · sticky chrome `va:z-40` (`.va-header`, mobile footer) · backdrop `va:z-50` · modal `va:z-60` · toast `va:z-70` |
