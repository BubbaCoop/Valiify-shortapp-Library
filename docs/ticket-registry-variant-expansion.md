# Ticket — registry variant expansion, replace-on-regenerate, and publish keys

**Status:** scoped, not built (2026-10-20)
**Owner:** val-core (`@valiify/val-core`), with a follow-on bump here
**Evidence:** `val/runs/2026-10-20-val-crossfile-registry-test/`, `val/registry/README.md`

## Why

`val/registry/components.json` is the lookup Val stage 2 uses to turn a Figma
instance into a library component. Three defects, in increasing severity:

1. **It was container-only for 21 of 31 entries.** Fixed by hand on 2026-10-20
   (193 variant ids backfilled, 5 dead ids pruned) — `exact` on the BSA frames
   went 40 → 68 of 72 occurrences, and the re-run of Gate 2 went 56 → 84 with
   **zero mappings changed**. The fix is data; nothing stops it rotting again.

2. **Regeneration cannot prune.** `generate-registry.mjs` sources
   `figmaNodeIds` from `codeConnectMap`, built by scraping `node-id=` out of
   `*.figma.ts`. This repo has no Code Connect files (it requires a Figma
   Organization or Enterprise plan; Valiify is on Professional), so the
   generator emits `[]` and then **unions** with the existing file. A stale id
   can only be removed by hand.

3. **Node ids do not survive crossing a file boundary — and can match the
   WRONG component.** Measured, not assumed. A new file
   (`TZHRSvaJV3Mk2w0fOMLjQl`) was given six instances imported from the
   published "Updated Short App" library. Figma renumbers remote main
   components in the consuming file:

   | component | library id | id in consuming file |
   | --------- | ---------- | -------------------- |
   | Header | `1:458` | `1:385` |
   | Text Selector | `1:490` | `1:336` |
   | Radio | `1:420` | `1:392` |
   | Radio Fields | `123:6060` | `1:584` |
   | Dropdown Field | `1:359` | `1:424` |
   | Button | `1:227` | `1:29` |

   Stage 2 on that frame: **exact 0, name-match 4, visual-guess 2, none 0.**
   Worse, 2 of the 12 observed consuming-file ids collide with registry ids
   belonging to *different* components — consuming Text Selector `1:336` is
   the registry's **TextField**, consuming Dropdown Field `1:424` is the
   registry's **Checkbox**. A node-id `exact` tier applied to cross-file input
   does not merely miss; it can return a confidently wrong mapping.

**Publish keys are the stable identifier, and they exist.** Every component
set and every variant carries a 40-hex key that is identical in both files
(e.g. Button set `59ca818e0e74d6a59847459225600b0e6357d774`). They are
reachable two ways — `search_design_system`, and `use_figma`
(`mainComponent.key`, and the parent set's `.key`). They are **not** reachable
through `get_metadata` / `get_design_context`, which is the entire tool set
`val-figma` carries. That is a tooling gap, not a Figma limitation.

## Scope

### A. Variant expansion in `generate-registry.mjs`

Expand each container id into its variant ids instead of relying on Code
Connect. Source the tree from one `get_metadata` call on the Components page
(`0:1`), cached to disk — it exceeds the tool's token budget, so it must be
parsed from the dump, not read.

Must handle the three structures `val/registry/README.md` documents:
single-symbol components with no variants; Button and UtilityButton sharing
frame `1:218`, split by the `Appearance=` axis; Skeleton's two containers.

A reference implementation exists — the throwaway script used for the
2026-10-20 backfill derived all 193 ids and re-derived the committed file
exactly. Port it rather than rewriting.

### B. Replace instead of union

In the merge block (~line 276), `figmaNodeIds` currently unions with the
previous file. Change to: replace from the newly derived set when expansion
produced one, else preserve. Keep `behaviors`, `tokens` and `figmaNames` on
the union path — those are hand-maintained prose and aliases, and losing them
is the thing the union exists to prevent.

Add a report line naming ids dropped as stale, so a prune is visible in the
diff rather than silent.

### C. Publish keys alongside node ids

Add `figmaKeys: { set: "<40-hex>", variants: { "<nodeId>": "<40-hex>" } }` per
entry, populated from `search_design_system` (set keys) plus `use_figma`
(variant keys). Keep `figmaNodeIds` — it is what matches same-file runs today
and is cheaper to read.

Then **stage 2's `exact` tier must match on either, and must become
file-aware**: a node-id match is only valid when the instance's `fileKey`
equals the library's. Without that guard, change C makes the false-positive
hazard above reachable rather than removing it. This is a change to
`val-components.md`'s confidence rules — out of scope for the data fix, and
the reason this ticket exists as one unit rather than three.

### D. Give `val-figma` a way to read keys

C is inert until extraction records keys. `val-figma`'s tools are
`get_design_context`, `get_screenshot`, `get_metadata` — none returns a
publish key. Either add `use_figma` to its tool list (it would then read
`mainComponent.key` directly) or have the orchestrator take one `use_figma`
pass per run and hand the keys to stage 2. The orchestrator route is narrower
and keeps a write-capable tool out of an extraction agent.

## Not in scope

Code Connect. It needs an Organization or Enterprise plan, its HTML parser is
being retired in favour of template files, and a `figma.connect()` call
carries the component **set** URL — so it would reproduce the container-only
problem this ticket fixes.

## Release steps

1. Implement A–C in `~/Desktop/val-core`; port the backfill script for A.
2. Extend `generate-registry.test.mjs` — the three structural exceptions, the
   replace-not-union behaviour, and a stale-id-drops case.
3. Update the `val-components` template for the either/or, file-aware `exact`
   tier (C), and the `val-figma` template if D takes the tool-list route.
4. Release `@valiify/val-core`.
5. Here: bump the devDependency, `npx val-init`, stage the regenerated
   `.claude/agents/*` and `.claude/commands/{val,extract}.md`, and confirm
   `npx val-init --check` is clean.
6. Run `node val/tools/generate-registry.mjs` and diff `components.json` — it
   should reproduce the 336 ids now committed, with no additions and no
   losses. A diff here is a bug in A, not a registry change.
7. Re-run Gate 2 of `val/runs/2026-10-15-val-bsa-account-information/` and
   confirm it still reports EXACT 84 / NAME 0 / GUESS 4 / NONE 32.
8. Re-run the cross-file fixture (`TZHRSvaJV3Mk2w0fOMLjQl`, frame `1:740`).
   Target: exact 6 of 6 via publish keys, and no false exact on the two
   colliding ids.
