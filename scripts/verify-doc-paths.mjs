#!/usr/bin/env node
/**
 * Shipped-doc path gate — fails when a doc INSIDE the tarball points at a file
 * that is not in the tarball, or at a file that does not exist at all.
 *
 * This shipped for real. `GETTING_STARTED.md` told consumers to "see the Quick
 * Reference in CLAUDE.md" and linked `[CLAUDE.md](CLAUDE.md)` — but CLAUDE.md is
 * maintainer material excluded by package.json's `files`, so for anyone who
 * installed from npm the link was dead and the reference unreachable.
 * `TROUBLESHOOTING.md` was worse: it pointed twice at `COMPONENTS.md` and once at
 * `docs/accessibility-audit.md`, neither of which exists anywhere in the
 * repository, so no amount of shipping more files would have fixed them.
 *
 * Two distinct failures, deliberately separated:
 *
 *   DANGLING LINK   a markdown link whose relative target is not in the package.
 *                   A consumer clicks it and gets nothing. Always a bug.
 *   MISSING TARGET  a referenced path that does not exist in the repository —
 *                   as a link OR as a bare `inline-code` path. Always a bug,
 *                   wherever it is written.
 *
 * And one deliberate non-failure:
 *
 *   OFF-TARBALL     a bare prose/inline-code mention of a real repository path
 *                   that does not ship (`scripts/build-styles.mjs`, `CLAUDE.md`).
 *                   Allowed, and reported in yellow. Docs legitimately discuss
 *                   the repo, and CHANGELOG.md is a historical record: rewriting
 *                   old entries to hide paths that were accurate at the time
 *                   would corrupt it. CHANGELOG carries a note saying so.
 *
 * The shipped file list comes from `npm pack --dry-run --json --ignore-scripts`,
 * so it is npm's own answer and cannot drift from the `files` field. The
 * --ignore-scripts keeps the gate from triggering a full prepack rebuild.
 *
 *   node scripts/verify-doc-paths.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RED = "\x1b[31m", GRN = "\x1b[32m", DIM = "\x1b[2m", YEL = "\x1b[33m", OFF = "\x1b[0m";

/** Paths that are gitignored build/run artifacts: real when written, absent in a fresh clone. */
const UNTRACKED_OK = [/^val\/runs\//, /^dist\//, /^storybook-static\//, /^node_modules\//];

/**
 * Repository areas that never ship and are never a consumer's own path. A bare
 * code path rooted here must resolve to a real file; `src/` and `examples/` are
 * deliberately absent, because a consumer's project has those directories too.
 */
const MAINTAINER_AREAS = new Set([
  "docs", "scripts", "val", ".claude", ".github", ".storybook",
  "stories", "tests", "tokens", "design-methodology", "_dashboard-archive",
]);

/** A token has to look like a path, not like prose or a CSS property. */
const PATHISH = /^(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.[A-Za-z0-9]{1,6}$|^(?:[A-Za-z0-9._-]+\/)+$/;

function shippedFiles() {
  const out = execFileSync("npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], {
    cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 32 * 1024 * 1024,
  });
  const json = out.slice(out.indexOf("["));
  return new Set(JSON.parse(json)[0].files.map((f) => f.path));
}

/**
 * `./styles.css`, `./reset.css`, `./source` are package EXPORT SUBPATHS, not
 * files — `@valiify/shortapp-ui/styles.css` resolves through package.json's
 * `exports`, and no such file sits at the repo root. Read the real export map
 * so this list can never drift from it.
 */
const EXPORT_SUBPATHS = new Set(
  Object.keys(JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).exports ?? {}),
);

/** A tarball lists files, not directories: a dir ships if anything under it does. */
const shipsPath = (shipped, p) => {
  if (shipped.has(p)) return true;
  const prefix = p.endsWith("/") ? p : p + "/";
  for (const f of shipped) if (f.startsWith(prefix)) return true;
  return false;
};

/** Markdown links `[text](target)`, ignoring absolute URLs, anchors and mail. */
function links(src) {
  const found = [];
  const re = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(src))) {
    const target = m[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(target)) continue;
    found.push({ target: target.split("#")[0], index: m.index });
  }
  return found.filter((l) => l.target);
}

/** Bare `inline-code` spans that look like repository paths. */
function codePaths(src) {
  const found = [];
  const re = /`([^`\n]+)`/g;
  let m;
  while ((m = re.exec(src))) {
    const t = m[1].trim();
    if (t.includes(" ") || !PATHISH.test(t)) continue;
    found.push({ target: t, index: m.index });
  }
  return found;
}

const lineOf = (src, index) => src.slice(0, index).split("\n").length;

const shipped = shippedFiles();
const docs = [...shipped].filter((p) => p.toLowerCase().endsWith(".md")).sort();

const dangling = [], missing = [], offTarball = [];

for (const rel of docs) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) continue;
  const src = readFileSync(abs, "utf8");
  const dir = dirname(rel);

  for (const { target, index } of links(src)) {
    const resolved = posix.normalize(dir === "." ? target : posix.join(dir, target)).replace(/^\.\//, "");
    const line = lineOf(src, index);
    if (!existsSync(join(ROOT, resolved))) {
      missing.push({ rel, line, target, resolved, kind: "link" });
    } else if (!shipsPath(shipped, resolved)) {
      dangling.push({ rel, line, target, resolved });
    }
  }

  for (const { target, index } of codePaths(src)) {
    const line = lineOf(src, index);
    if (EXPORT_SUBPATHS.has(target)) continue;          // a package export, not a file
    if (UNTRACKED_OK.some((re) => re.test(target))) continue;

    // Resolve against the doc's own directory FIRST. An example's README saying
    // `src/main.js` means that example's src, not this repository's.
    const local = dir === "." ? target : posix.join(dir, target);
    if (existsSync(join(ROOT, local))) {
      if (!shipsPath(shipped, local)) offTarball.push({ rel, line, target });
      continue;
    }
    if (existsSync(join(ROOT, target))) {
      if (!shipsPath(shipped, target)) offTarball.push({ rel, line, target });
      continue;
    }
    // Neither resolution exists. Only a path rooted in a MAINTAINER area can be
    // called missing: `src/styles.css` in "create a CSS file (e.g. src/styles.css)"
    // is the consumer's own file, and nothing here can tell that apart from a path
    // into this repo. `docs/accessibility-audit.md` is unambiguous, and that is the
    // bug class this arm exists for.
    const top = target.split("/")[0];
    if (target.includes("/") && MAINTAINER_AREAS.has(top)) {
      missing.push({ rel, line, target, resolved: target, kind: "code" });
    }
  }
}

// Canary: the extractor must actually see links and code paths, or a clean run
// means only that it read nothing.
const probe = "see [x](docs/nope.md) and `scripts/also-nope.mjs`";
if (links(probe).length !== 1 || codePaths(probe).length !== 1) {
  console.log(`  ${RED}FAIL${OFF}  canary self-test: the extractor found ${links(probe).length} link(s) and ${codePaths(probe).length} code path(s) in a probe containing exactly one of each — it is blind.`);
  process.exit(1);
}

console.log(`\n  ${DIM}shipped files: ${shipped.size} · markdown docs scanned: ${docs.length}${OFF}`);
console.log(`  ${GRN}PASS${OFF}  canary self-test  ${DIM}extractor reads 1 link + 1 code path from the probe${OFF}`);

if (offTarball.length) {
  console.log(`\n  ${YEL}${offTarball.length} off-tarball mention(s)${OFF} ${DIM}— real repo paths that do not ship; allowed, never silent${OFF}`);
  for (const f of offTarball.slice(0, 15)) {
    console.log(`    ${DIM}${f.rel}:${String(f.line).padStart(4)}  ${f.target}${OFF}`);
  }
  if (offTarball.length > 15) console.log(`    ${DIM}… ${offTarball.length - 15} more${OFF}`);
}

const fatal = [...missing, ...dangling];
if (!fatal.length) {
  console.log(`\n  ${GRN}No dangling links${OFF} in shipped docs: every relative link resolves to a file inside the tarball.\n`);
  process.exit(0);
}

if (missing.length) {
  console.log(`\n  ${RED}${missing.length} reference(s) to a path that does not exist in the repository:${OFF}`);
  for (const f of missing) {
    console.log(`    ${YEL}${f.rel}:${f.line}${OFF}  ${f.target}  ${DIM}(${f.kind})${OFF}`);
  }
}
if (dangling.length) {
  console.log(`\n  ${RED}${dangling.length} dangling link(s) — target exists in the repo but is NOT in the package:${OFF}`);
  for (const f of dangling) {
    console.log(`    ${YEL}${f.rel}:${f.line}${OFF}  [...](${f.target}) → ${f.resolved}`);
  }
  console.log(`\n  ${DIM}Fix by linking the file's GitHub URL instead of a relative path, pointing at${OFF}`);
  console.log(`  ${DIM}something that ships (Storybook, class-manifest.json), or adding it to \`files\`.${OFF}`);
}
console.log();
process.exit(1);
