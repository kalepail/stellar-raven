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
`workflow-agentic-routing.js` now mirrors rule v2 (`eval/lib/grade.mjs` `hitServices()` /
`src/skills/store.ts` alias) — `skills.lumenloop.*` / `skills.lumenloop-api.*` twin-skill picks
satisfy the lumenloop label. Offline regrade of the saved 60 rows flips 5 run verdicts
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
4. Follow-up ideas (not yet acted on): multi-label grading for overlap questions; description
   boundary-tuning between lumenloop content search and scout structured lookups.

## Re-run

1. `npx wrangler dev --port 8788 --host localhost` (any port; `--host localhost` is required —
   without it wrangler presents request.url as the custom-domain host and the
   `DEV_ALLOW_UNAUTHENTICATED` loopback gate 401s everything)
2. Invoke the Workflow tool with `eval/agentic/workflow-agentic-routing.js` and args
   `{"port": 8788, "cases": [...]}` where cases come from `sample.json`
   (`node -e` slim mapping: id/question/expected_service).
3. Save the returned `{summary, rows}` under `results/` (git-ignored) and update the
   summary tables in this README — the README is the committed record, not the JSON.
