# Agentic routing eval — Sonnet 5 sub-agents against live `search`

Measures what the lexical routing eval (`eval/run-routing.mjs`) can't: whether a **real agent
caller** — free to reformulate queries (≤3 searches) and read hit descriptions — commits to the
right tool for a golden question.

> The `search` evaluated here (host-side ranked query) is the shipped top-level shape — see
> [ADR-0001](../../research/decisions/0001-search-tool-shape.md) for the decision of record.

## Method

- 30 stratified cases from `eval/routing-cases.json` (12 stellarDocs / 10 scout / 8 lumenloop;
  selection = every-Nth per service, id-sorted → `sample.json`).
- Each case posed to a `claude-sonnet-5` sub-agent at **low** and **medium** reasoning effort
  (60 runs), via the Workflow harness `workflow-agentic-routing.js`.
- Agent gets only the question + a curl recipe for `tools/call search` against a local
  `wrangler dev` server; must return structured `{queriesUsed, primaryToolId, primaryService,
  alternateToolIds, reasoning}`.
- Grades: **primary** = primary tool's service matches the label; **any** = primary or an
  alternate hits the labeled service.

## Results — 2026-07-04 (upstream stellar-light OpenAPI 1.4.4 drift verification, GitHub issue #2; runs `wf_0d429a7c-285` baseline / `wf_7ed97384-f2a` drift, local-only)

Change under test: the daily live-drift refresh brought stellar-light 1.3.2 → 1.4.4 — additive
response-schema fields on existing scout ops (`repoMeta`, `lastActivityAt`, `lastCommitAt`, date
formats) plus upstream description rewords (`searchResearch` trimmed to "security incidents —
reentrancy, soroban-sdk advisories/CVEs, DoS"). No operation added/removed. Because the rewords
feed the lexical scorer AND move the exact lumenloop/scout boundary the 835 round tuned, verified
agentic-first before committing the drift + gate re-baseline. Same 30 `sample.json` cases,
grading rule v3 (ADR-0003), Sonnet 5 low+medium. Baseline = committed post-836 catalog; drift =
1.4.4 catalog served from the same `wrangler dev`.

| scope | base low pri/any | drift low pri/any | base med pri/any | drift med pri/any |
|---|---|---|---|---|
| stellarDocs (12) | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| scout (10) | 60 / 80 | **80 / 90** | 80 / 80 | **90 / 90** |
| lumenloop (8) | 37.5 / 50 | 37.5 / 50 | 25 / 75 | **37.5** / 62.5 |
| **overall (30)** | 70 / 80 | **76.7 / 83.3** | 73.3 / 86.7 | **80 / 86.7** |

Reading (per-case, both runs' primary picks): **net +4 primary hits, no regression at medium
effort.** Six primary GAINS — 3 lumenloop (`q-asset-rwa-tokenized-freshness:low`,
`q-defi-aquarius-what-is:medium`, `q-defi-comet-content:low` all left docs/scout for lumenloop)
and 3 scout (`q-hist-unhcr-stellar-aid-assist:low`, `q-scf-ambassador-program:low`,
`q-scf-liquidity-award-amount:medium` left docs for scout). Two LOSSES, **both low-effort only**
and both lumenloop→scout: `q-defi-rwa-overview:low` ("what RWA products are live") and
`q-edge-fresh-latest-blend-tvl:low` ("Blend's TVL today") — the latter an 835 win that erodes at
low but **holds lumenloop at medium**. Both are the directory/freshness label-ambiguity the
2026-07-02 interpretation notes describe, now amplified by 1.4.4's freshness fields making scout a
defensible structured answer; not a routing failure. lumenloop primary did not collapse (flat at
low, +1 at medium); docs unchanged at 100%. Lexical instrument agrees: routing gate re-baselined
203/265/303 → 213/267/303 (`routing-2026-07-04T15-58-31-434Z.json`), 14 improvements / 8 strict
regressions (7 hold under accept-either). Nothing tuned per-question; the 2 low-effort flips are
monitor-only (re-tuning would fight a legitimate upstream scout improvement).

## Results — 2026-07-04 (post lumenloop/scout boundary notes, Solo todo 835; `results/agentic-2026-07-04.json`, git-ignored/local-only)

Catalog change under test: the paired catalog notes in `scripts/description-notes.mjs` —
`lumenloop.search_directory` claims "what is X / who builds X" narrative-editorial questions,
`scout.searchProjects` declares itself structured-facts-only and points editorial asks at
lumenloop. Twin-aware (rule v2) throughout; workflow run `wf_35311ccf-657`, same 30
`sample.json` cases:

| scope | low primary | low any | medium primary | medium any |
|---|---|---|---|---|
| stellarDocs (12) | **100%** | 100% | **100%** | 100% |
| scout (10) | **50%** | 70% | **50%** | 80% |
| lumenloop (8) | **37.5%** | 62.5% | **37.5%** | 87.5% |
| **overall (30)** | **66.7%** | 80% | **66.7%** | 90% |

Reading (per-row diff vs `agentic-2026-07-03.json`, primary picks): the flips **at the tuned
boundary all moved the intended way** — `q-defi-soroswap-what-is:low` (the follow-up idea #4
flagship case) went scout.searchProjects → lumenloop.search_directory, and
`q-edge-fresh-latest-blend-tvl` (both efforts) went scout.searchProjects →
lumenloop.get_project; no case flipped toward scout.searchProjects. The six primary
regressions vs 2026-07-03 (`q-edge-deep-no-budget-limit` ×2, `q-scf-ambassador-program:medium`,
`q-scf-liquidity-award-amount:low`, `q-asset-rwa-tokenized-freshness:medium`,
`q-defi-comet-content:low`) are all between op-pairs the notes never touched
(research pipeline vs getPartners, search_doc_titles vs searchResearch, contract docs vs
find_av_passages) and none of their recorded reasoning mentions either tuned description —
single-run agent variance, not attributable to the change. Residual lumenloop misses
(e.g. `q-eco-lobstr-wallet` → scout.searchProjects on "who builds LOBSTR and what is its
scale") ask for exactly the structured fields the scout note claims, i.e. the known label
ambiguity of interpretation #3, not a routing failure. Lexical instrument for the same
change: routing gate PASS with 0 per-case regressions / 3 improvements
(`routing-2026-07-04T02-50-10-035Z`). Nothing tuned per-question, numbers as-is.

## Results — 2026-07-03 (post src-hardening 62fa42d + stellar-light description enrichment 18e7357; `results/agentic-2026-07-03.json`, git-ignored/local-only)

Twin-aware (routing rule v2) numbers; original v1-graded values in parentheses where they
differ:

| scope | low primary | low any | medium primary | medium any |
|---|---|---|---|---|
| stellarDocs (12) | 91.7% | 91.7% | **100%** | 100% |
| scout (10) | **70%** | 100% | **70%** | 90% |
| lumenloop (8) | **25%** | 87.5% (v1 62.5%) | **37.5%** (v1 25%) | 75% (v1 50%) |
| **overall (30)** | **66.7%** | 93.3% (v1 86.7%) | **73.3%** (v1 70%) | 90% (v1 83.3%) |

Interpretation vs 2026-07-02 (v1-vs-v1, since the 2026-07-02 table below is v1-graded): scout
primary +40/+30pts (the description enrichment paying off agentically); lumenloop primary
−12.5/−37.5pts and v1 any-hit −25/−37.5pts — 8 of 12 lumenloop misses routed to
`scout.searchProjects` on "what is X / who builds X" project-lookup phrasings, i.e. the
enrichment moved the lumenloop/scout boundary. Twin-aware regrade (2026-07-03): `grade()` in
`workflow-agentic-routing.js` mirrored rule v2 at the time (`skills.lumenloop.*` /
`skills.lumenloop-api.*` twin-skill picks satisfied the lumenloop label). *(Superseded 2026-07-04,
ADR-0003: the script now grades rule v3 — no twin identity; service labels are exact.)* Offline regrade of the saved 60 rows flips 5 run verdicts
(1 medium primary — `skills.lumenloop-api.lumenloop-api-research` — plus 4 any-hit alternates),
lifting lumenloop any-hit to 87.5%/75% and medium primary to 37.5%; the boundary drift vs
2026-07-02 is real but roughly half the size v1 grading suggested on any-hit.

## Results — 2026-07-02 (manifest 374 entries, post Wave-2 scoring; `results/agentic-2026-07-02.json`, git-ignored/local-only)

| scope | low primary | low any | medium primary | medium any |
|---|---|---|---|---|
| stellarDocs (12) | **100%** | 100% | **100%** | 100% |
| scout (10) | 30% | 60% | 40% | 60% |
| lumenloop (8) | 37.5% | 87.5% | 62.5% | 87.5% |
| **overall (30)** | **60%** | 83.3% | **70%** | 83.3% |

## Interpretation

1. **The docs-spec fix fully holds up agentically**: 24/24 docs runs picked the right
   intent-named stellarDocs operation, at both efforts, usually in one search.
2. **Medium effort beats low by +10pts primary overall** (biggest gain on lumenloop,
   37.5→62.5%) — depth mostly helps agents distinguish overlapping catalog services, not find
   hits.
3. **Most remaining misses are label ambiguity, not search failure.** Examples: SCF questions
   labeled `scout` routed to `lumenloop.search_content_semantic` / `find_similar_scf_submissions`
   — Lumenloop legitimately covers SCF funding data; "what is Soroswap" (labeled lumenloop) →
   `scout.searchProjects` — a defensible project lookup; the OpenZeppelin Soroban question →
   the openzeppelin skills. The 83.3% any-hit rate at both efforts is the better signal of
   usable routing; the primary-hit gap between services reflects real corpus overlap that
   single-service labels can't express.
4. Follow-up ideas: multi-label grading for overlap questions (not yet acted on); description
   boundary-tuning between lumenloop content search and scout structured lookups — **acted on
   2026-07-04** (Solo todo 835, results section above).

## Re-run

1. `npx wrangler dev --port 8788 --host localhost` (any port; `--host localhost` is required —
   without it wrangler presents request.url as the custom-domain host and the
   `DEV_ALLOW_UNAUTHENTICATED` loopback gate 401s everything)
2. Invoke the Workflow tool with `eval/agentic/workflow-agentic-routing.js` and args
   `{"port": 8788, "cases": [...]}` where cases come from `sample.json`
   (`node -e` slim mapping: id/question/expected_service).
3. Save the returned `{summary, rows}` under `results/` (git-ignored) and update the
   summary tables in this README — the README is the committed record, not the JSON.

## Results — 2026-07-06 (post-round-5 checkpoint; run `wf_b5be4d53-41f`, local-only)

Change under test: round-5 search-surface changes (hit tier/total/truncated fields, filter
validation, describe-as-detail-step + oversized-signature stubs, alias lever 6) on the
post-1.5.0 catalog. Same 30 `sample.json` cases, Sonnet 5 low+medium:

| scope | low pri/any | medium pri/any | prior (07-04 drift run) low / med pri |
|---|---|---|---|
| stellarDocs (12) | 100 / 100 | 100 / 100 | 100 / 100 |
| scout (10) | 90 / 100 | 90 / 100 | 80 / 90 |
| lumenloop (8) | **12.5 / 25** | **12.5 / 25** | 37.5 / 37.5 |
| **overall (30)** | 73.3 / 80 | 73.3 / 80 | 76.7 / 80 |

Reading (nothing tuned, numbers as-is): first run with **identical low/medium** numbers —
effort-stable. scout +1 case. The story is lumenloop 37.5 → 12.5: per-case decomposition shows
6/7 missed cases are the documented lumenloop/scout boundary — `scout.searchProjects`' upstream
description (1.4.4/1.5.0) now name-drops specific products and claims "what is X / who built X"
outright, so agents defensibly pick it for product questions labeled editorial
(`soroswap-what-is`, `lobstr-wallet`, `rwa-overview`, `blend-tvl`, both efforts). One genuine
misroute (`q-defi-aquarius-what-is` → docs, both efforts) and one skill-twin capture
(`rwa-tokenized-freshness:low` → the ecosystem-digest section whose heading matches the
question verbatim). Filed as **sls-015** (description editorial-capture, 8/16 lumenloop-labeled
runs) rather than re-tuned here — the enrichment legitimately improved scout's own routing and
the gateway's counter-balancing catalog note did not hold; per-question counter-tuning would
violate the no-case-tuning rule. QA headline on the same day was aggregate-identical to the
prior best (see eval/qa/README.md), so the capture costs routing-label accuracy, not answer
quality on this sample.
