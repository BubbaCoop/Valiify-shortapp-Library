# Ticket — naming a utility in the methodology ships it

**Status:** scoped, not built (2026-10-20)
**Owner:** this repo (`scripts/build-utility-surface.mjs`)
**Severity:** low blast radius, high surprise. It silently *adds* to the public
bundle; it has never silently removed anything.

## The trap

[scripts/build-utility-surface.mjs](../scripts/build-utility-surface.mjs) builds
the shipped utility set by scraping every `va:`-prefixed token out of
`design-methodology/*.md`:

```js
for (const m of readFileSync(f, "utf8").matchAll(/(?<![\w:-])va:[A-Za-z0-9:[\]_.\/#%-]+/g))
```

It matches **wherever the token appears** — a table cell, a prose sentence, a
heading, a code span, an amendment-log entry. There is no notion of a citation
versus a mention. So writing a sentence *about* a utility ships that utility.

This is not hypothetical. Writing the 2026-10-20 amendment log, which exists to
record that three utilities are **absent** from the surface, added two of them:

| What was written | What it did |
| ---------------- | ----------- |
| "`va:hidden`, `va:md:hidden` and `va:md:flex` are not in the closed surface" | added `va:hidden` and `va:md:hidden` |
| "F1 (`va:tabular-nums`) is a different question" | added `va:tabular-nums` and `va:md:tabular-nums` |

Both were caught only because `git diff src/utility-surface.css` was checked by
hand. Nothing failed. The surface is committed precisely so the set is
reviewable in a diff — that review is currently the only control.

## Why it matters more than it looks

The direction of failure is the mild one: an extra utility ships, the bundle
grows slightly, nothing breaks. The sharp edge is the **second-order** effect on
the gate that exists to catch the opposite problem. `/design` run
`2026-10-15-design-bsa-account-information` was blocked at Gate 3 by F1 —
`va:tabular-nums` being absent. Had someone mentioned that class in passing in
the methodology while writing the finding up, the surface would have shipped it,
the finding would have evaporated, and the brief's tabular-figures requirement
would have been met by accident rather than by decision. A reviewer reading only
the critique would never know why.

There is a third-order version too: the methodology is the audit surface
`class-audit` sanctions pages against. A utility that enters by accidental
mention becomes sanctioned vocabulary for every future `/design` page.

## The mitigation in place today

`design-methodology/short-app.md` §11 now carries a note telling authors to
describe utilities rather than spell them, and the amendment log records the
incident. That is a convention, enforced by nothing.

## Proposed fix

**Make the generator read citations, not mentions**, with an explicit opt-out
for prose.

The cheapest version that actually works: scrape only from contexts that are
plausibly normative, and give authors a way to say "this is prose."

1. **Skip blockquotes and the amendment log.** Lines beginning `>` and
   everything under `### 13.1 Amendment log` are commentary by construction.
   Both of this ticket's real incidents were in exactly those two places, so
   this alone would have caught both.
2. **Honour an inline escape.** A token written as `va:tabular-nums{prose}`, or
   inside a `<!-- surface:ignore -->` … `<!-- /surface:ignore -->` fence, is not
   a citation. Needed because a normative row sometimes has to name a utility it
   forbids.
3. **Report, do not just write.** Print added and removed utilities on every
   run — `+2 va:tabular-nums, va:md:tabular-nums` — so a surprise is visible in
   the terminal and not only in a diff someone might not open.
4. **Fail closed in CI.** A `--check` mode that exits non-zero when the
   generated surface differs from the committed one, wired in beside
   `verify:vocabulary`. The build already regenerates; nothing currently asserts
   the result was intended.

(4) is the one that converts this from a convention into a gate, and it is
useful even without (1)–(3): it turns an accidental addition into a CI failure
on the PR that caused it.

## Explicitly not proposed

- **Don't restrict the scrape to code spans.** Both incidents were in code
  spans. It would have caught neither.
- **Don't add an allowlist of "real" utilities.** That is the thing the surface
  already is; a second list to keep in sync is the `class-audit` /
  `verify:vocabulary` divergence again, and CLAUDE.md already records how
  expensive that pair is to reason about.
- **Don't move the source of truth out of the methodology.** The surface being
  generated from the methodology is what keeps the shipped set honest — it ships
  what the design surface actually uses. The defect is in how a mention is
  distinguished from a use, not in where the truth lives.

## Acceptance

- Writing a sentence that names a utility in a blockquote or the amendment log
  does not change `src/utility-surface.css`.
- A normative §5/§10/§11 row that cites a utility still ships it, unchanged.
- `npm run build:utility-surface` prints what it added and removed.
- CI fails when the committed surface does not match a fresh generation.
- Re-running the generator against this repo at 1.4.3 reproduces exactly 299
  utilities, with no additions and no losses.
