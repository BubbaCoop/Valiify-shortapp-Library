# Component registry — how to maintain `components.json`

`components.json` is the lookup Val stage 2 ([.claude/agents/val-components.md](../../.claude/agents/val-components.md))
uses to turn a Figma instance on a page into a library component. One entry per
component, keyed by the component name used everywhere else in this repo.

## The granularity rule (load-bearing)

> **`figmaNodeIds` lists the component's container frame id AND every variant
> main-component node id. Not the container alone.**

Stage 2's `exact` tier is literal string matching: it compares the instance's
`componentKey` — which stage 1 records as the **main-component (variant) node
id**, because the Figma publish key is not exposed by the MCP tools — against
`figmaNodeIds`. A page instances a *variant*, never the container. So an entry
that lists only the container id can never match `exact`; it falls through to
`name-match`, which is a weaker claim about the same, correct mapping.

This was measured on the BSA frames (2026-10-20): with container-only entries
for Header, TextSelector, RadioField and Radio, 40 of 72 instance occurrences
resolved `exact` and 28 fell to `name-match`. After listing every variant id:
68 `exact`, 0 `name-match`, no mapping changed. The remaining 4 are `Layer
field`, which genuinely has no library component yet.

Because the tiers shift without any mapping changing, **confidence counts are
not comparable across runs taken on different registry states** — the
2026-09-16 and 2026-10-15 BSA runs produced different EXACT/NAME splits for
identical mappings. Cite the registry state when comparing runs.

## Deriving the ids

One `get_metadata` call on the Components page returns the whole tree:

```
mcp__claude_ai_Figma__get_metadata(fileKey: "PA5pr1Q8KLfbjTxdAbFm0V", nodeId: "0:1")
```

The output exceeds the tool's token budget and is written to a file; parse it
rather than reading it. Each component is a `<frame>` directly under section
`1:217` ("Components"), and its variants are the `<symbol>` children:

```xml
<frame id="550:7507" name="Header">
  <symbol id="1:458"   name="Platform=Web" />
  <symbol id="550:7506" name="Platform=Mobile" />
</frame>
```

→ `"figmaNodeIds": ["1:458", "550:7506", "550:7507"]`.

Three cases that are not that shape:

- **Single-symbol components** (Badge `28:507`, Tooltip `582:9178`, the
  standalone Radio field `123:6056`) sit directly under section `1:217` with no
  frame and no variants. The symbol id is the whole entry.
- **Button and UtilityButton share one frame** — `1:218`, since the 2026-10
  merge. Split its 59 symbols by the `Appearance=` axis: `Appearance=Standard`
  (22) belongs to Button, `Appearance=Utility` (37) to UtilityButton. Both
  entries list `1:218` as their container.
- **Skeleton has two containers** — the drawn set `525:4650` and the written
  spec frame `550:7998`.

## What the generator does and does not do

`node val/tools/generate-registry.mjs` sources `figmaNodeIds` from
`codeConnectMap`, which it builds by scraping `node-id=` out of `*.figma.ts`
Code Connect files. **This repo has none** (Code Connect requires a Figma
Organization or Enterprise plan; Valiify is on Professional), so the generator
emits `[]` for every component and then *unions* that with the existing file.

Two consequences:

1. Every node id here is hand-maintained. Regenerating will not add one.
2. The merge is a union, never a replace, so **a stale id cannot be removed by
   regenerating** — only by editing this file.

**Pruned 2026-10-20.** Five listed ids no longer existed in the Figma file and
were removed by hand: `28:505` (Badge), `1:463` (the old ListItem set, replaced
by `786:6869`), `24:4382` (the old Button/Utility set, absorbed by the `1:218`
merge), `383:8835` and `383:8970` (IconButton). They were inert — a dead id
matches nothing, and the BSA exact count was 68 both before and after — but
they were the visible edge of the no-prune behaviour.

**Prune by hand, and expect the next regeneration to undo it.** The union means
a dead id reappears if it is still present in any file the merge reads. Until
the generator replaces instead of unions, re-check for dead ids whenever you
touch this file: parse the page metadata as above and flag any listed id that
no longer resolves to a node.

## When you add a component

1. Extract it (`/extract`), build it, ship it.
2. Add its entry here with the container id **and every variant id**, derived
   as above.
3. Re-run the audit against a page before trusting a run's confidence counts:
   any instance landing on `name-match` whose mapping is obviously right means
   this file is missing that variant id.
