---
name: live-drift-resolution
description: Resolve a "Live service drift detected" issue — the daily CI that diffs the committed catalog against the live upstream surfaces (Lumenloop, Stellar Light/Scout, Stellar Docs). Regenerate the artifacts, classify the drift, decide whether it needs a policy or routing-baseline change or is a clean mechanical bump, dual-verify, then commit and close. Use when a drift issue is filed, when refreshing inventory, or when deciding if an upstream version bump is routing-neutral.
---

# Live service drift resolution — stellar-raven-codemode

This skill is agent-agnostic: a plain-markdown runbook. Claude Code invokes it as a skill;
Codex or any other CLI agent can be pointed at this file directly.

## North star

The committed catalog (`catalog/manifest.json`, `inventory/*.json`, `specs/super-spec.json`,
`eval/plan/op-classes.json`) is a **frozen snapshot** of upstream surfaces that drift on their
own schedule. A daily CI job re-fetches the live surfaces and files a **"Live service drift
detected"** issue when the snapshot no longer matches. Resolving it is mechanical regeneration
plus **one real judgment**:

> Is this a clean mechanical bump (absorb and commit), or does it change the exposed surface
> or the routing behavior (which needs a policy or baseline decision in the SAME change)?

Getting that judgment wrong in either direction is the failure mode: rubber-stamping a bump
that added a callable operation ships an unvetted surface; re-baselining a gate for a bump that
didn't touch routing hides a real regression behind a moved goalpost. The whole skill exists to
make that one call correctly and prove it.

Bindings that change (which CI repo, which Solo project, which secret store) live in `CLAUDE.md`,
not here — read it for the concrete pointers. This runbook is the procedure.

## Step 0 — read the issue, don't trust its summary

The drift issue is auto-filed by a bot and includes a diffstat and the exact regen commands. Read
it for the *shape* (which files, roughly how big), but treat its framing as a starting point, not
a verdict — the whole point of the steps below is to derive the truth from the actual diff.

## Step 1 — regenerate from live services

Run the full pipeline (same order the issue prints). Each step feeds the next:

```
node scripts/refresh-inventory.mjs      # re-fetch live upstream → inventory/*.json
node scripts/build-catalog.mjs          # inventory → catalog/manifest.json (+ exposure guards)
npm run spec:build                       # catalog → specs/super-spec.json (ships into sandbox)
node eval/plan/build-op-classes.mjs     # catalog → eval/plan/op-classes.json (broad/detail/meta)
```

`refresh-inventory.mjs` only rewrites a service file when its live surface actually moved (it
prints `unchanged (kept fetchedAt …)` otherwise), so the working tree isolates the real drift.

Confirm the working tree touched **only generated artifacts** (`git status --short`). Anything
else — a hand-editable source file, a doc, a script — means something is wrong; stop and
investigate. Generated artifacts are never hand-edited (`CLAUDE.md` rule).

## Step 2 — classify the drift (this picks the rest of the path)

Diff the source-of-truth inventory first (`git diff inventory/<service>.json`). Sort the change
into one of three classes **per service**:

| Class | What changed | What it needs |
|---|---|---|
| **Provenance/data** | `fetchedAt`, version strings, changelog entries, data-source counts, snapshot dates | Absorb as-is. No policy, no routing decision. |
| **Operation surface** | An operation was **added, removed, or renamed** in `openapi.paths` (check the path/method set, NOT just `operationCount` — a rename holds the count constant) | **Policy decision** (Step 3) before commit. |
| **Routing-relevant text** | An operation `summary`/`description`/`operationId` changed | **Routing-baseline decision** (Step 4) before commit. |
| **Runner-affecting** | ANY of the above touches an operation that a runnable-skill runner declares in its `ops` (schema/response-shape drift on such an op counts too — runners project those payloads) | **Runner re-verification** (Step 4b) before closing. This class stacks on top of the others, it never replaces them. |

Runner-affecting is machine-checkable, never eyeballed — the runner registry
(`src/skills/runners/index.ts`, `RUNNERS`) is the allowlist-as-data:

```
# declared op ids per runnable skill (node-clean by construction):
node -e 'import("./src/skills/runners/index.ts").then(m => {
  for (const [id, r] of Object.entries(m.RUNNERS)) console.log(id, JSON.stringify(r.ops));
})'
# intersect those op ids with the ops the inventory diff touched (added/removed/renamed,
# schema or description changed) — a non-empty intersection = runner-affecting.
```

A **removed/renamed** declared op will already fail `scripts/build-catalog.mjs` loudly (the
declared-ops drift guard) — that failure is the signal, not a nuisance; reconcile the runner's
declared `ops` as part of the policy decision, never by loosening the guard.

A single bump can be pure-provenance (the common daily case) or mix classes. Never infer the
class from the upstream changelog's self-description ("routing-neutral", "additive") — the
changelog is a *claim to verify*, not evidence. Derive the class from the actual diff:

```
# added/removed/renamed operations — compare the path·method set old vs new:
git show HEAD:inventory/<svc>.json | node -e '…print sorted METHOD path keys…' > /tmp/old
node -e '…same over working tree…' inventory/<svc>.json > /tmp/new
diff /tmp/old /tmp/new          # empty = no surface change

# routing-relevant text — compare per-op operationId+summary+description old vs new:
# (extract "METHOD path :: operationId :: summary :: description" for every op, sort, diff)
# empty diff = the "no operation-description changes" claim is TRUE at our ingest, not just upstream's word
```

## Step 3 — operation surface changed → policy decision

A newly-exposed operation is a **new callable surface**. Do not ship it unexamined:

- **The manifest IS the exposed surface (ADR-0003).** Exposure is filtered at BUILD time; the
  decision to expose/deny/meter an op is exact-match data in `scripts/exposure.mjs`, enforced by
  guards in `scripts/build-catalog.mjs` (`assertNoNonExposedRefs` breaks the build if emitted text
  references a non-exposed op or retired skill). Decide, for each new op: expose it, or add it to
  the exclusion data. A new op that should stay dark is added to `scripts/exposure.mjs` in the
  same change that absorbs the drift.
- A **removed** op that was referenced anywhere must not leave a dangling reference — the build
  guard will fail loud if it does; that failure is the signal, not a nuisance.
- Special case — the paid Lumenloop research lane (`request_research` + its read half
  `research_result`/`list_my_research`) stays excluded as a unit; see the `CLAUDE.md` rule before
  touching any of the three.

Record the exposure call and its rationale (Solo scratchpad / commit body). This is the class the
issue means by "new/removed operations … may need policy (deny/metered) decisions."

## Step 4 — routing-relevant text changed → baseline decision

An operation description is lexical routing fuel. If a `summary`/`description`/`operationId`
changed, the routing gate may legitimately move:

```
npm run eval:compile && npm run eval:routing
```

- The gate prints `GATE PASS — legacy <N> within band and skills lane at/above floor (baseline …)`
  or fails with the deltas. The baseline it compares against lives in `eval/gates.json`.
- **Re-baseline ONLY when a routing-relevant text change is the cause and the movement is an
  intended improvement** — e.g. a bump that genuinely reworded an operation `summary`/`description`.
  Re-baselining is asserting "the new numbers are the new correct floor."
- **Never re-baseline to make a red gate green for a pure-provenance/data bump.** If descriptions
  are byte-identical (Step 2 diff empty) the gate must pass against the *existing* baseline with
  no change — that is the proof the bump is routing-neutral. A gate that moves when descriptions
  didn't is a real regression, not a baseline to bump.

If you do re-baseline, it is a deliberate, separately-justified part of the change, not a
side effect — capture why (Solo/commit body), same as an exposure decision.

## Step 4b — runner-affecting drift → live runner re-verification

When the Step 2 machine check found a non-empty intersection between the drift diff and any
runner's declared `ops`, the resolution is not closable on regeneration + guards alone. The
runners' output projections are self-authored schemas — they can only prove the projection
matches itself, so upstream shape drift on a declared op must be re-verified against the live
service, not against the runner's own contract:

- **Re-run the affected runners' live smoke**: against a live-serving instance (e.g. wrangler
  dev with the local-auth gotcha from `CLAUDE.md`), `execute` a `codemode.skill.run(...)` call
  for each affected runnable id with a representative input, and confirm the envelope: `ok`
  as expected, `data.calls[].ok` all true, no section unexpectedly `null` or `softEmpty`.
- **Re-verify projections against the observed shapes**: compare the fields each runner
  projects with what the live payloads actually carry now. A defensive projection that
  half-handles a shape change surfaces as a `null` section, a spurious `softEmpty`, or an
  `outputSchemaOk: false` warn-belt event — treat any of those as drift to reconcile in the
  runner, not noise.
- **Refresh the live-captured fixtures** the offline test lanes share
  (`test/fixtures/skill-runners/`) if observed shapes moved, in the same change.

Only after both the live smoke and the projection re-check pass does the drift close.

## Step 5 — verify before committing

Run the guards that would catch a bad absorb, and confirm the scope:

- `node scripts/build-catalog.mjs` exits 0 and prints the expected exclusions (ADR-0003 leak
  guard green).
- Routing gate result matches the Step 2/4 expectation (PASS unchanged for provenance/data;
  intended movement for a re-baselined text change).
- `npm run secrets:scan -- --tree` is clean — a regenerated artifact must never carry an upstream
  key/token. Also eyeball the diff for high-entropy strings and secret-shaped assignments.
- `git status --short` shows only the generated artifacts; `git diff --check` is clean.

## Step 6 — independent adversarial review (default for anything past pure-provenance)

For any drift that touched the operation surface or routing text — and as good hygiene even on a
clean bump — spawn an **independent reviewer** to verify or refute the "safe to commit" call
before committing. This mirrors the repo's dual-verify norm (`CLAUDE.md`: let independent
adversarial reviews finish).

- Use Solo to spawn a *different* agent (e.g. Codex) with an explicit adversarial brief: do NOT
  trust the maintainer's summary; re-derive the drift class from the actual `git diff`, re-run the
  guards and gate, check ADR-0003 exposure and secrets, and return a verdict with file:line
  evidence. Put the brief in a Solo scratchpad and have the reviewer append findings to it.
- Reviewer ≠ author is the invariant. Let it run to completion; reconcile every finding before
  committing. Watch for the reviewer with an idle-wake timer rather than polling.

## Step 7 — close out

- Commit only the regenerated artifacts. Match the house prefix and name the upstream version and
  the class of change, e.g. `catalog: absorb <service> <version> drift — <one-line class>`. State
  in the body what was verified (op count, description-identity, gate result, guards, secrets) and
  that an independent review agreed. Push.
- Close the drift issue with a comment that records the same evidence and the resolving commit
  sha (`gh issue close <n> --comment …`).
- If the change involved a policy or baseline decision, record it where the project tracks work
  (Solo), so the *why* survives — the artifacts only carry the *what*.

## Step 8 — deploy to production (the drift isn't resolved until prod serves it)

Committing and pushing does NOT update the live service. The catalog and spec are compiled *into*
the Worker bundle (`catalog/manifest.json` → `src/catalog/load.ts`, `specs/super-spec.json` →
`src/executor/run.ts`), and CI does **not** deploy — so production keeps serving the OLD upstream
version until a manual deploy. Closing the drift loop requires shipping:

- `npm run build` (`wrangler deploy --dry-run`) first — confirm the bundle builds and bindings are
  intact; it's the same check the review step ran.
- `npm run deploy` (`wrangler deploy`) — pushes the new catalog live to the production routes.
  Deploying to production is outward-facing: get the owner's go-ahead unless durably authorized.
- Verify live: the deploy prints a new Version ID and the updated routes; a quick liveness check
  (the public landing/`/mcp` endpoints return 200) confirms the roll-out. Note the Version ID in
  the close-out record.

A drift bump that is committed but never deployed is a *silent* stale prod — the catalog carries
the new upstream version while the gateway still answers as the old one. Treat deploy as part of
resolving the issue, not a separate optional chore.

## Hard rules

- Derive the drift class from the actual diff, never from the upstream changelog's self-labels.
- Check the operation path·method **set** for add/remove/rename — `operationCount` alone hides a
  rename.
- The manifest IS the exposed surface (ADR-0003): a newly-exposed op is a policy decision; expose
  or exclude it in `scripts/exposure.mjs` in the same change. Never let emitted text reference a
  non-exposed op or retired skill — the build guard enforces this; a guard failure is the signal.
- Re-baseline the routing gate only for an intended routing-relevant text change, and justify it
  separately. Never re-baseline to hide a provenance/data-bump regression.
- Drift touching any op in a runner's declared `ops` (machine-check against `RUNNERS`,
  `src/skills/runners/index.ts`) is runner-affecting: re-run the runner live smoke and
  re-verify projections against observed shapes before closing (Step 4b). Never close on the
  runner's own output schema as evidence — it is self-authored.
- Generated artifacts (`catalog/manifest.json`, `inventory/*.json`, `specs/super-spec.json`,
  `eval/plan/op-classes.json`) are rebuilt by scripts, never hand-edited.
- Never print or commit a secret; `secrets:scan --tree` before every drift commit.
- Independent, adversarial review before committing anything past a pure-provenance bump;
  reviewer ≠ author; let it finish.
