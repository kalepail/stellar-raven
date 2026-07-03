# Search-routing eval

> **Start at [`eval/EVALS.md`](./EVALS.md)** — the one-page map of all eval instruments,
> which numbers are gates vs diagnostics, and the rules that keep them targeted.

Measures **search ROUTING accuracy, not answer quality**: given a real user question from
the golden QA corpus, does `searchCatalog()` (src/catalog/search.ts, frozen contract in
Solo scratchpad 514) surface an entry from the *correct service* near the top of its results?

- **top-1 / top-3 / top-5**: any hit whose `service` equals the case's `expected_service`
  at rank 1 / within the first 3 / within the first 5 (query = the raw question, `limit: 5`).
- **card@5** (secondary, only for cases with `expected_cards`): any top-5 hit whose id
  matches one of the expected capability-card labels under the tolerant normalizer below.

Nothing here executes tools or grades prose answers — that is the separate `execute` Q→A
battery in [`eval/qa/`](./qa/) (LLM-judged answers over the whole two-tool surface; see
[`eval/EVALS.md`](./EVALS.md) for how the instruments fit together).

## Corpus and label mapping

Source: `eval/corpus/raven-golden-qa/big.json` — 395 labeled questions (vendored snapshot of
the retired `raven-golden-qa` sibling checkout; provenance + checksums in
`eval/corpus/PROVENANCE.md`).
Unlike the raven-next compile step, `compile-routing.mjs` **preserves** the
`expected_service` / `expected_cards` labels. Label → catalog namespace:

| corpus `expected_service` | catalog namespace | cases |
|---|---|---|
| `stellar_light` | `scout` | 95 |
| `stellar_docs` | `stellarDocs` | 183 |
| `lumenloop` | `lumenloop` | 60 |
| `perplexity` | — skipped (general-web service, not in catalog) | 43 |
| `parallel` | — skipped (general-web service, not in catalog) | 4 |
| `none` | — skipped (governance / should-not-fire cases) | 10 |

Usable: **338**; skipped: **57** (listed with reasons in `routing-cases.json` → `skipped`).

### Corpus tolerance + extended lane (2026-07-02, todo 817)

Two data-driven additions, both **strict-grading-neutral** (the legacy 338 strict numbers are
unaffected — verified exactly 183/236/256 after the change):

- **`expected_any` from `acceptable_cards`.** The corpus authors encoded "also-correct
  alternates that wouldn't be a routing miss" per case (`acceptable_cards`; non-empty on
  383/395, crossing services on 361). The compile step now derives a service-level
  accept-either set from them (281 of the 338 legacy cases carry one), unioned at run time
  with the hand-reviewed build-question overlay. Reported as a separate
  "legacy accept-either" line, never as the headline.
- **Extended lane.** The vendored 538-case corpus (`eval/corpus/raven-next/`) contains 144
  net-new ids that `big.json` predates — mostly the 2026-06-29 jitsu-mined real-user
  questions. Their routing labels are parsed from each question file's YAML frontmatter
  (`eval/lib/labels.mjs`) and compiled into `extendedCases`: **122 usable**
  (94 stellarDocs / 25 scout / 3 lumenloop), 22 skipped (4 perplexity, 18 none). Graded as
  its own lane, never merged into the legacy aggregate.

### Card-name normalizer (documented tolerance)

Corpus cards use raven-next naming (`lumenloop_search_directory`, `scout_projects`,
`stellar_docs_mcp`); catalog ids are `service.op_name`. A card matches a hit when, after
canonicalization (lowercase, `-`/`.`/space → `_`):

1. the full tokens are equal, **or**
2. the card's service prefix (`lumenloop_` → lumenloop, `scout_`/`stellar_light_` → scout,
   `stellar_docs_` → stellarDocs, `skills_` → skills) equals the hit's service **and** the
   remaining op names are equal, **or**
3. same service and one op name contains the other, with the shorter op ≥ 4 chars
   (tolerates `projects` vs `list_projects`; blocks trivial substrings).

Implementation + unit fixtures: `eval/lib/grade.mjs`, `eval/self-test.mjs`.

## How to run

```sh
# 0. sanity-check the grader math (no src/ or catalog/ needed)
node eval/self-test.mjs

# 1. compile corpus -> eval/routing-cases.json (labels preserved)
node eval/compile-routing.mjs            # optional arg: alternate corpus path

# 2. grade routing -> eval/results/routing-<timestamp>.json + console tables
node eval/run-routing.mjs
```

`run-routing.mjs` also loads two **hand-authored** files at run time (deliberately not part
of the compile step, so `node eval/compile-routing.mjs` can never wipe them):
`eval/skills-cases.json` (the skills lane) and `eval/build-question-overlay.json` (the
accept-either overlay) — see "Skills lane" below. Both are optional: if absent, the run
degrades to the legacy 338-case eval.

Zero new dependencies: `run-routing.mjs` imports `src/catalog/search.ts` directly (Node
≥ 23.6 native type stripping); if the direct import fails it transpiles the file (and its
relative imports) to `eval/.build/` with the repo's own `typescript` package.

npm scripts: `npm run eval:selftest` / `eval:compile` / `eval:routing` (QA lane:
`eval:qa:compile` / `eval:qa:selftest` / `eval:qa`; plan: `eval:plan`).

**Gate enforcement:** baselines are committed in `eval/gates.json` (legacy 338 top-1/3/5
±1%, skills-lane top-1 floor). Every run prints a `GATE PASS`/`GATE FAIL` verdict and
records it in the results JSON; `npm run eval:routing -- --gate` turns a breach (or a
changed denominator) into exit 1. CI runs `eval:selftest` + `eval:routing -- --gate` on
every push/PR. Re-baselining = updating `gates.json` in the same commit that moves the
numbers, decision recorded in Solo (EVALS.md rule 1).

## Baseline

First full run: 2026-07-02, catalog/manifest.json @ 359 entries (lumenloop 35, scout 20,
stellarDocs 1, skills 303), Lane C initial lexical search. Results file:
`eval/results/routing-2026-07-02T02-59-48-071Z.json`. 338 cases graded, 57 skipped at
compile (43 perplexity, 4 parallel, 10 none).

| scope | cases | top-1 | top-3 | top-5 | card@5 |
|---|---|---|---|---|---|
| lumenloop | 60 | 38.3% | 61.7% | 76.7% | 16.7% |
| scout | 95 | 33.7% | 50.5% | 64.2% | 28.4% |
| stellarDocs | 183 | 0.0% | 0.0% | 1.1% | 3.3% |
| **OVERALL** | **338** | **16.3%** | **25.1%** | **32.2%** | **12.7%** |

Reading notes (numbers reported as-is, nothing tuned):

- Search is purely lexical over catalog text, so entries only rank when the question
  shares tokens with their description (known quirk from Lane C: e.g.
  `lumenloop.search_directory` ranks 13th for "soroban defi projects").
- stellarDocs is near-zero by construction, not by mystery: that namespace is a single
  authored docs-search op competing against 358 richly-described entries, while its 183
  questions are topical ("how do I deploy a Soroban contract…") and share almost no
  tokens with a generic docs-search description. On those questions the top-5 slots go
  to skills (206 slot appearances), scout (292), and lumenloop (137) instead.
- This baseline is the motivation for routing-aware scoring (service priors, docs-keyword
  expansion, or intent classification) — not evidence the eval or search is broken.

## Round 2 (2026-07-02, todo 793): docs-spec integration + structural scoring

Two changes, measured separately. Catalog moved 363 → **374 entries**: the 1 thin
stellarDocs op was replaced by the 12 authored, live-verified ops from
`specs/stellar-docs.json` (Lane D, todo 796); deny-list grew by `scout.submitPartnerListing`
(creates draft partner accounts) and `scout.partnerAssistant` (logs leads).

**Step 1 — integration only** (scoring untouched, results file
`routing-2026-07-02T14-12-33-697Z.json`): the 12 topical docs descriptions alone fixed the
starvation, at a small cost to scout/lumenloop (docs entries flooding their top-5s):

| scope | top-1 | top-3 | top-5 | card@5 |
|---|---|---|---|---|
| lumenloop | 38.3% | 56.7% | 71.7% | 16.7% |
| scout | 28.4% | 47.4% | 58.9% | 27.4% |
| stellarDocs | 65.6% | 71.6% | 72.7% | 2.7% |
| **OVERALL** | **50.3%** | **62.1%** | **68.6%** | **12.1%** |

**Step 2 — structural scoring** (`src/catalog/scoring.ts`, wrapped around the untouched
vendored scorer; frozen search contract unchanged). Three query-independent levers — no
per-question cases, no query→service maps:

1. **Stopword gate-rescue** — entries failing the vendor token-coverage gate are rescored
   with general English stopwords removed from the query (40/338 questions previously
   returned zero hits). Entries that pass keep their exact vendor score. (Filtering
   stopwords for *all* scoring was iteration 1 and regressed everything — recorded below.)
2. **Kind weight** — `skill-section` × 0.75 (fragments whose whole-skill entry also ranks;
   they held 303 of 1284 top-5 slots and are never a routable service).
3. **Service diversity** — per-service quota in the returned set (⌈40%⌉ of the page,
   floor 2); a service's first in-page hit always survives, only 3rd+ appearances get
   trimmed in favor of runner-up services.

Iteration trajectory (runs land in `eval/results/`, git-ignored/local-only; overall top-1/3/5):

| iteration | levers | overall | verdict |
|---|---|---|---|
| baseline-r2 | integration only | 50.3 / 62.1 / 68.6 | reference |
| 1 (`14-16-01`) | stopwords-everywhere + kind 0.8/0.65 + diversity | 43.2 / 52.1 / 56.2 | regression — discarded |
| 2 (`14-17-23`) | gate-rescue + diversity | 50.6 / 67.5 / 75.4 | keep |
| 3 (`14-17-47`) | + skill-section × 0.85 | 53.0 / 68.9 / 75.7 | keep |
| 4 (`14-18-00`, **shipped**) | skill-section × 0.75 | 54.1 / 69.8 / 75.7 | best |

**Shipped result** (`routing-2026-07-02T14-20-45-119Z.json`, vs round-1 baseline):

| scope | cases | top-1 | top-3 | top-5 | card@5 | round-1 top-5 |
|---|---|---|---|---|---|---|
| lumenloop | 60 | 41.7% | 76.7% | 86.7% | 20.0% | 76.7% |
| scout | 95 | 31.6% | 54.7% | 67.4% | 29.5% | 64.2% |
| stellarDocs | 183 | 69.9% | 75.4% | 76.5% | 3.3% | 1.1% |
| **OVERALL** | **338** | **54.1%** | **69.8%** | **75.7%** | **13.6%** | **32.2%** |

Targets (todo 793): stellarDocs top-3 ≥ 50% ✓ (75.4), overall top-5 ≥ 60% ✓ (75.7),
lumenloop top-5 ≥ 70% ✓ (86.7), scout top-5 ≥ 60% ✓ (67.4).

Honest caveats:

- card@5 for stellarDocs stays ~3%: the corpus expects the raven-next card name
  `stellar_docs_mcp`, whose op token ("mcp") never matches our intent-named op ids under
  the normalizer. Service-level routing is the metric that matters here.
- stellarDocs top-5 caps at ~76%: of its 43 remaining fails, most are questions whose
  vocabulary genuinely lives in scout/lumenloop descriptions (slot fillers on those fails:
  scout 50, lumenloop 26, skills 21), and 16 are still zero-hit. The stopword rescue only
  recovered 4 of the original 40 zero-hit cases overall (36 remain): the rest fail on rare
  proper-noun/topic tokens ("YieldBlox", "Travel Rule", …) absent from every catalog
  description — unreachable lexically without corpus-side vocabulary, which would violate
  the no-case-tuning rule if hand-added.
- scout top-1 (31.6%) is the weakest headline: docs ops out-score scout ops on shared
  topical vocabulary; diversity recovers it at top-3/5 but rank 1 goes to the wordier
  description. A field-level length normalizer is the obvious next lever if Wave 3's
  agentic eval shows it matters in practice.

## Skills lane (2026-07-02, todo 809)

**Why.** The compiled corpus labels only scout / stellarDocs / lumenloop — there was **no
case whose expected answer is the `skills` service** (25 mirrored skills + 203 sections,
299 catalog entries). Under that structure every skills hit graded as a miss, so any
scoring change tuned against this eval was structurally rewarded for burying skills (the
shipped skill-section × 0.75 kind-weight is exactly such a lever). This lane fixes the
*measurement*; it does not touch `src/` or the scorer.

Two hand-authored files, both loaded by `run-routing.mjs` at run time (NOT by
`compile-routing.mjs`, so recompiles never wipe them — verified: recompile + rerun
reproduces all numbers):

**1. `eval/skills-cases.json` — the lane itself.** 31 hand-written questions where a
mirrored skill is the uniquely right route, phrased as playbook/walkthrough requests
(the thing a skill is and a single catalog op isn't). Coverage spans both skill flavors:
code-operational (stellar-dev smart-contracts ×4 incl. its testing/security companions,
openzeppelin setup/upgrade/secure ×3, dapp ×2, data ×2, assets, agentic-payments,
standards, zk-proofs) and non-coding operational (lumenloop-api billing/402-recovery,
x402 top-up, keys, integrate, query, connect, research ×7; lumenloop ecosystem playbooks
scout/digest/dossier/integration-finder/scf-radar/content-auditor/builder-quickstart/
mcp-connect ×8; stellar-light stellar-scout ×1). Cases carry `expected_cards` in the
`skills_<terminal-name>` form the normalizer maps to the skills service (rule 2 + rule-3
containment bridges the `<source>` segment in `skills.<source>.<name>` ids). Graded
strictly as its own scope — **never merged into the legacy 338-case aggregate**.

**2. `eval/build-question-overlay.json` — accept-either for genuinely ambiguous legacy
cases.** 32 hand-reviewed ids of existing stellarDocs-labeled questions that are
build/how-do-I-shaped (deploy a contract, establish a trustline, write unit tests, wire
Wallets Kit…) where the mirrored skills cover the same procedure — reviewed
question-by-question against actual skill content, precision over recall (what-is /
which-SEP / lookup / comparison questions excluded). These get
`expected_any: ["stellarDocs", "skills"]` applied at load time and are reported **both
ways**: strict (expected_service only) and accept-either (any accepted service counts).
The headline `overall` / `perService` numbers stay strict-only, so legacy comparability
is never lost — grader-side, `gradeCase`'s strict fields are computed identically whether
or not an accept set is passed (fixture-proved in `self-test.mjs`).

**How to run:** nothing new — `node eval/run-routing.mjs` prints three tables (legacy
strict, skills lane, overlay dual) and writes `skillsLane` + `overlay` sections into the
results JSON alongside the unchanged legacy keys.

**BEFORE numbers** (`routing-2026-07-02T20-41-03-868Z.json`, same catalog + shipped
scoring as Round 2; legacy strict verified byte-identical to the
`14-23-33-014Z` baseline — 183/236/256 of 338):

| scope | cases | top-1 | top-3 | top-5 | card@5 |
|---|---|---|---|---|---|
| skills lane (strict) | 31 | 48.4% | 90.3% | 90.3% | 90.3% |
| overlay subset, strict | 32 | 90.6% | 93.8% | 93.8% | — |
| overlay subset, accept-either | 32 | 93.8% | 96.9% | 100.0% | — |

Legacy overall recomputed with the overlay's accept-either grading (context only):
54.4 / 70.1 / 76.3 vs strict 54.1 / 69.8 / 75.7.

Reading notes (nothing tuned, numbers as-is):

- Skills route well at top-3/5 (90.3%) but only 48.4% at rank 1. The dominant rank-1
  competitor is not scout/docs ops but **`lumenloop.skill.*`** — the lumenloop service's
  own skill-fetch operations share the mirrored skills' vocabulary and grade as service
  `lumenloop`. On 11 of the 16 top-1 misses the rank-1 hit is the *same-named*
  `lumenloop.skill.*` entry with the `skills.*` entry at rank 2 (remainder: 2 zero-hit,
  2 outranked by stellarDocs ops, 1 by a scout op). Whether that should
  count as correct routing is a policy question for the next scoring round, not a grader
  bug — recorded here so the AFTER comparison can address it deliberately.
- 3/31 cases are full misses (2 of them zero-hit): `q-skill-soroban-first-contract`,
  `q-skill-soroban-testing-strategy`, `q-skill-eco-scout-rwa-landscape` — same lexical
  starvation family as the legacy zero-hit cases (question vocabulary absent from every
  catalog description).
- card@5 equals top-5 in this lane (90.3%): when the skills service surfaces at all, it
  is the *right* skill — the `skills_<terminal>` card form + rule-3 containment works.

## Corpus tolerance + extended lane results (2026-07-02, todo 817)

Run: `routing-2026-07-03T01-06-36-453Z.json` (same catalog + shipped scoring as the skills
round; **legacy strict gate verified — exactly 183/236/256 of 338**).

| scope | cases | top-1 | top-3 | top-5 |
|---|---|---|---|---|
| legacy strict (unchanged headline) | 338 | 54.1% | 69.8% | 75.7% |
| legacy accept-either (acceptable_cards ∪ overlay) | 338 | 67.2% | 83.4% | 86.1% |
| extended lane, strict | 122 | 24.6% | 27.0% | 28.7% |
| extended lane, accept-either | 122 | 37.7% | 41.8% | 42.6% |

Reading notes (nothing tuned, numbers as-is):

- **Corpus-sanctioned tolerance closes a big chunk of the "misses."** +13.1 points top-1,
  +13.6 top-3 under the corpus's own `acceptable_cards`. This is the data-driven
  confirmation of the agentic eval's "label ambiguity, not search failure" reading — and
  the corpus-side context for the twin-shadowing policy question (todo 816): many
  lumenloop/scout "wrong-service" hits are alternates the corpus authors explicitly
  sanctioned.
- **The extended lane is the real news: search struggles on real-user phrasing.** The 144
  net-new questions are jitsu-mined from actual user traffic (long, multi-clause,
  operational). 65/122 return **zero hits** (vs 26/338 legacy); stellarDocs strict top-1 is
  18.1% (94 cases) with top-3 ≈ top-5 ≈ top-1 — when the lexical scorer misses, nothing
  ranks at all. This lane is the target metric for any future retrieval work (query
  decomposition, synonym/vocab expansion, semantic scoring); the legacy 338 stays the
  non-regression gate.
- card@5 is near-zero in the extended lane (1.6%) for the same structural reason as legacy
  stellarDocs card@5 (~3%): frontmatter expects the `stellar_docs_mcp` card whose "mcp" op
  token never matches intent-named ops. Known artifact, not new signal.

## Twin-aware grading (rule v2) + metadata-twin suppression (2026-07-03, todo 816)

**Policy decision.** `lumenloop.skill.<name>` (metadata-only, transport null) and
`skills.<source>.<name>` (readable) are ONE resource — `src/skills/store.ts` aliases reads
across them by terminal-name equality. Grading them as different services created the
zero-sum recorded in todo 810/816: every twin dedupe variant traded legacy lumenloop hits
for skills-lane gains. Two changes, in order:

1. **Grading rule v2 (twin-aware):** the grader mirrors the store alias — a hit on either
   twin form satisfies both the `lumenloop` and `skills` labels (and twin card identities).
   The twin terminal-name set is derived from the manifest at run time, never hardcoded
   (`eval/lib/grade.mjs` `hitServices`, fixtures in `self-test.mjs`). Rule v1 (twin-blind)
   was reported for one transition round as `overallV1TwinBlind`; that transitional
   reporting was retired 2026-07-03 (todo 820) — the runner now emits v2 only.
2. **Search-side suppression:** with grading fixed, the previously-rejected dedupe was
   re-measured and SHIPPED — `searchCatalog` drops the metadata twin when its readable
   twin exists (except under an explicit `service: "lumenloop"` filter, where the readable
   form is ineligible). Catalog/execute/`skill.read` unaffected.

Measured (routing-2026-07-03T01-38-05-370Z, same catalog/scorer):

| scope | rule | top-1 | top-3 | top-5 | card@5 |
|---|---|---|---|---|---|
| legacy 338, pre-suppression | v1 (old gate) | 183 (54.1%) | 236 (69.8%) | 256 (75.7%) | 13.3% |
| legacy 338, pre-suppression | v2 | 195 (57.7%) | 244 (72.2%) | 261 (77.2%) | 13.3% |
| legacy 338, **suppression shipped** | **v2 (NEW GATE)** | **195 (57.7%)** | **250 (74.0%)** | **266 (78.7%)** | **15.4%** |
| skills lane 31, suppression shipped | v2 | 28 (90.3%) | 30 (96.8%) | 30 (96.8%) | 96.8% |

Reading notes:

- The v1→v2 jump (+12 top-1) is lumenloop cases whose rank-1 hit was the readable
  `skills.lumenloop.*` twin — correct routes that v1 mis-graded. The suppression then
  IMPROVED top-3/top-5/card@5 outright: freed result slots surface real ops (scout
  top-3 53.7→60.0, lumenloop card@5 18.3→26.7).
- Skills lane 54.8%→90.3% top-1 under v2: the twin-shadowing "misses" were grading
  artifacts, exactly as todo 809's key finding suspected. 3/31 remain missed (the
  lexical-starvation family).
- **Gate baselines from this point: legacy 338 v2 = 195/250/266; skills lane = 28/31
  top-1.** The v1 line (171/227/253 post-suppression) is retired after this round —
  v1 penalizes the readable twin the product now correctly prefers. *(Superseded
  2026-07-03 by todo 820 — re-baselined to 208/267/283, skills 26/31, on stellar-light
  description-enrichment drift; the v1 transitional reporting was removed entirely that
  round. See "Re-baseline (2026-07-03, todo 820)" below.)*

## Re-baseline (2026-07-03, todo 820): stellar-light description-enrichment drift

Upstream Stellar Light (scout) enriched its operation descriptions with routing-guidance
text; the daily live-drift refresh rebuilt the inventory/catalog with it. That drift
legitimately improves legacy routing and shifts the skills lane, so the gates are
re-baselined (`eval/gates.json`) in the same change — and the rule-v1 (twin-blind)
transitional reporting is retired here per EVALS.md rule 1 (`overallV1TwinBlind`, the
per-case `v1` field, the `aggV1` aggregate, and the "legacy strict under retired rule v1"
console line are all removed; the runner emits v2 only).

Run: `routing-2026-07-03T02-32-37-858Z.json` (same scorer; catalog is the drifted refresh).

| scope | rule | top-1 | top-3 | top-5 | card@5 |
|---|---|---|---|---|---|
| legacy 338 (prior gate) | v2 | 195 | 250 | 266 | 15.4% |
| legacy 338 (**new gate**) | **v2** | **208 (61.5%)** | **267 (79.0%)** | **283 (83.7%)** | **24.0%** |
| skills lane 31 (prior floor) | v2 | 28 | 30 | 30 | 96.8% |
| skills lane 31 (**new floor**) | **v2** | **26 (83.9%)** | **30 (96.8%)** | **30 (96.8%)** | **96.8%** |

Reading notes:

- **Legacy +13 top-1 / +17 top-3 / +17 top-5** come from scout ops that now carry
  routing-guidance vocabulary, so they rank on questions where they previously lost slots
  to docs/lumenloop entries. No scoring change, no per-question tuning — pure catalog drift.
- **Skills lane 28→26 top-1** (two regressions, investigated and accepted):
  `q-skill-soroban-testing-strategy` and `q-skill-builder-quickstart-remittance` now rank a
  scout op at rank 1 (`scout.searchRepos` / `scout.searchProjects` — defensibly relevant to
  a testing-strategy / remittance-builder ask). Both keep the skills hit in top-3 and their
  `cardHit5`, so the right skill still surfaces; accepted per the build-questions-pull-both
  rubric (a build/how-do-I question legitimately pulls both a procedure skill and a
  discovery op). The three long-standing lexical-starvation misses
  (`q-skill-soroban-first-contract`, `q-skill-data-indexer-workflow`,
  `q-skill-assets-stablecoin-issuance`) are unchanged.
- Gate verdict: `--gate` PASSES against the new baseline (legacy within ±3 of 208/267/283,
  skills lane top-1 26 at floor).

## Re-baseline (2026-07-03, todo 825): onboarding-skills retirement + tiered gate-rescue backfill

Two round-4 changes landed in this baseline. (1) The **tiered gate-rescue backfill** (round 4 M1,
`src/catalog/scoring.ts` lever 5): long multi-clause questions that gate to zero now get an
ungated tier-2 page appended strictly below the gated tier-1 hits — no gated ranking changed, so
the legacy lane moved on backfill alone (208→219 top-1). (2) The **onboarding-skills retirement +
twin de-dup** (ADR-0002): the 7 Lumenloop API-onboarding skills were retired and all 14
`lumenloop.skill.*` twins deny-listed, and the skills lane was **re-scoped 31→23 cases** — the 8
cases that targeted the retired onboarding skills moved to `eval/skills-cases.json` `retiredCases`
(documented-inert, not deleted). The skills floor is re-expressed on the new denominator; the 5
long-standing lexical-starvation misses are unchanged, so 26/31 → 18/23 is the same real miss set.

Run: `routing-2026-07-03T13-59-06-937Z.json` (grading rule v2, twin-aware).

| scope | rule | top-1 | top-3 | top-5 |
|---|---|---|---|---|
| legacy 338 (prior gate, todo 820) | v2 | 208 | 267 | 283 |
| legacy 338 (**new gate**) | **v2** | **219** | **287** | **313** |
| skills lane (prior floor, /31) | v2 | 26 | 30 | 30 |
| skills lane (**new floor, /23**) | **v2** | **18** | — | — |

Reading notes:

- **Legacy +11/+20/+30** is pure tier-2 backfill of previously-zero-hit long questions; the
  extended (real-user-phrasing) lane is where it shows most — extended zero-hit 65/122 → 0,
  pass@5 → 120/122, strict top-1 74/122 at this baseline.
- **Skills 26/31 → 18/23**: the 8 retired cases were all top-1 hits, so both numerator and
  denominator drop by 8 (26−8=18, 31−8=23); the miss set is unchanged.
- Gate verdict: `--gate` PASSES against the new baseline.

## Re-baseline (2026-07-03, todo 824): operation keywords (M3/M4)

Operations gained the low-weight `keywords` field, distilled from schema property names / enum
values plus (for stellarDocs) the page-title snapshot in `inventory/stellar-docs-titles.json`,
document-frequency-filtered so only op-distinguishing vocabulary survives. This is a catalog +
scoring change, so the gates are re-baselined in the same commit (`eval/gates.json`, current).

Run: `routing-2026-07-03T15-14-31-853Z.json` (grading rule v2, twin-aware; current baseline).

| scope | rule | top-1 | top-3 | top-5 |
|---|---|---|---|---|
| legacy 338 (prior gate, todo 825) | v2 | 219 | 287 | 313 |
| legacy 338 (**new gate**) | **v2** | **222** | **288** | **318** |
| extended 122 (prior) | strict | 74 | — | 106 |
| extended 122 (**new**) | **strict** | **77** | — | **109** |
| skills lane 23 | v2 | 18 | — | — |

Reading notes:

- **Legacy +3/+1/+5, extended +3 top-1 / +3 top-5**: scout/lumenloop/docs ops now carry
  op-distinguishing keyword vocabulary, so they rank on questions where they previously lost slots.
  **Zero per-case hit→miss regressions** in any lane vs `routing-2026-07-03T14-37-46-628Z`
  (13 case-improvements). **Skills lane unchanged 18/23.**
- A naive variant **without** the DF filter measured NEGATIVE (extended top-1 74→71, skills top-5
  23→22) and was rejected — the DF filter (keep only op-distinguishing vocabulary) is what makes
  the field pay.
- Gate verdict: this is the current gate — `--gate` enforces legacy within ±1% of 222/288/318 and
  the skills lane floor 18/23.
