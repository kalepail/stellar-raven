## RECOMMENDED SHAPE

Keep the top-level MCP surface at exactly two tools, `search` + `execute`, and ship atlas as compact orientation in initialize-time `SERVER_INSTRUCTIONS` plus a generated `kind:"workflow"` / `kind:"service"` catalog lane surfaced through existing `search`, not as a new top-level `atlas` tool. This is closest to option C but stricter: `search` remains the name, with richer capability-discovery output; `execute` remains the programmable workbench containing `codemode.describe`, `codemode.search`, `codemode.catalog`, `codemode.spec`, service calls, skills, and artifact follow-up. Adding a rarely-parameterized top-level `atlas` pays client context and model-choice tax on every session for an affordance that is mostly static planning text; worse, it repeats ADR-0001's mistake of making a bigger discovery front door before proving it beats the shipped two-tool contract. The deciding eval should be a three-arm A/B: current `search+execute` vs `search+execute+SERVER_INSTRUCTIONS atlas` vs `search+execute+atlas catalog lanes`; only add a third top-level tool if that arm wins headline QA and agentic routing by more than run variance.

## Per-option stress test findings

### Option A: `atlas` + `execute`

Disagree as the shipped shape. The stated "two-execute-pass" concern is weaker than #12 makes it sound, because `execute` is already explicitly designed as the in-sandbox discovery surface: ARCHITECTURE says `codemode` gives follow-up discovery at "zero extra turn cost" inside a script (`ARCHITECTURE.md:322-326`), and lists `spec`, `search`, `catalog`, and `describe` in that sandbox (`ARCHITECTURE.md:327-360`). The implementation matches: `buildCodemodeProvider` exposes `spec`, `catalog`, `search`, and `describe` by default (`src/executor/providers.ts:538-645`), and tests assert those helpers exist by default (`test/executor-providers.test.ts:136-147`, `test/executor-providers.test.ts:177-184`).

The real objection to A is not "execute cannot inspect." It can. The objection is that removing top-level ranked search throws away the one discovery front door that already beat the code-shaped alternative. ADR-0001 measured host ranked search at 35.5/60 weighted vs 29.5/60 for code-shaped spec search, with the losing variant producing 9 max-turn failures (`research/decisions/0001-search-tool-shape.md:18-31`). The lesson was turn economics: grepping/inspecting before answering consumed the same budget as evidence gathering (`research/decisions/0001-search-tool-shape.md:64-69`). A would make atlas static orientation do too much, then force all narrowing into `execute`; that is exactly the risk ADR-0001 retired from the top-level path.

Observed evals do not justify deleting top-level search. Latest saved QA plan evidence uses median 2 top-level searches and median 2 executes per case, with 10/30 cases needing only one search and 9/30 needing only one execute; max tails are 6 searches and 9 executes in `eval/qa/results/2026-07-07T19-58-35-variantA.plan.json` (computed from `rows[].searchQueries` / `rows[].executeCalls`). Agentic routing rows are also not search-call-heavy: `agentic-2026-07-04.json` has 41/60 rows using one query, 16/60 using two, 3/60 using three. The code documents this eval as an agent with <=3 searches reading hit descriptions (`eval/agentic/README.md:3-18`). These numbers say "improve first-pass orientation"; they do not say "remove search."

### Option B: `atlas` + `search/discover` + `execute`

Disagree. This is product-manager attractive and agent-economics sloppy. A third top-level tool costs every MCP client another name, description, schema, and selection branch. In this repo the top-level descriptions are intentionally large because they teach workflow, envelope, truncation, skills, artifacts, and exact-id rules (`src/mcp/tools.ts:158-218`, `src/mcp/tools.ts:226-230`). A third tool either repeats that instruction mass or becomes underspecified. Recent MCP/tool-description research is directionally consistent with this risk: richer descriptions can improve task success, but can also increase execution steps materially and regress some cases; compactness matters. More importantly, ADR-0001 already provides repo-local evidence: a heavier discovery front door raised average calls/cost and introduced max-turn failures (`research/decisions/0001-search-tool-shape.md:25-34`).

The better version of B is already inside the current two-tool design. Top-level `search` returns ranked hits with signatures and next steps (`src/mcp/tools.ts:102-120`, `src/mcp/tools.ts:307-317`). In-script `codemode.search` gives the same ranked page mid-script (`src/executor/providers.ts:566-632`). `codemode.describe` is exact detail for one id (`src/executor/providers.ts:378-443`, `src/executor/providers.ts:634-645`). `codemode.spec` and `catalog` are advanced broad views (`src/executor/providers.ts:541-564`). Splitting these into a top-level `discover` creates a second mini-agent in front of the actual code agent, exactly the failure mode option B itself admits in #12.

If semantic/vector retrieval lands, it should not become a new top-level `discover` by default. Add it as a search lane/ranker or as `codemode.searchSemantic` only after atlas+lexical misses are proven. Issue #10's own implementation order says build/measure atlas first, keep lexical, and add embeddings only if eval shows a miss remains; that sequencing is right.

### Option C: keep `search` + `execute`, atlas via server instructions/search output

Agree, with one amendment: make atlas structured catalog data, not only prose. Current architecture is already two tools (`ARCHITECTURE.md:9-11`), the README advertises exactly `search` and `execute` (`README.md:7-10`), and registration tests enforce exactly those tool names (`test/server.test.ts:78-83`). The server already sends initialize-time instructions because clients surface them in the system prompt and they outlive per-tool descriptions (`ARCHITECTURE.md:62-66`, `src/server.ts:77-84`). That is the correct place for a short, rarely-parameterized atlas summary.

But instructions-only atlas is too lossy for eval and routing diffs. Put the generated atlas into the manifest as shallow, schema-free `workflow` / `service` entries so existing `search` can return it beside operations and skill sections. This preserves the manifest-is-surface rule: everything consumer-visible comes from emitted catalog data, and excluded surfaces do not appear (`research/decisions/0003-build-time-exposure-filtering.md:34-62`). It also keeps `searchCatalogPage` as the routeable contract used by offline routing gates (`eval/run-routing.mjs:3-12`, `eval/run-routing.mjs:168-176`) instead of bypassing it with a special atlas-only tool.

### Atlas as initialize-time instructions only

Partly agree. This is the cheapest first experiment and should ship before any new top-level tool. It uses an existing channel (`SERVER_INSTRUCTIONS`) that is already specifically for workflow and envelope facts (`src/mcp/tools.ts:220-230`). The limit is that pure prose is hard to diff, hard to grade, and not returned in tool traces. Use it for the 800-1500 token service/source-family map, not for per-operation or workflow cards.

### Atlas as `kind:"workflow"` / `kind:"service"` catalog lane

Strongly agree. This is the best zero-new-tool shape. It lets `search` answer vague "what source family should I use?" questions with deterministic cards, then still return operation/skill hits for exact narrowing. It also creates measurable routing artifacts: `eval/run-routing.mjs` already records ordered top hits and can dump ranked ids (`eval/run-routing.mjs:30-33`, `eval/run-routing.mjs:255-264`). Add lanes to the manifest and scoring pipeline, update baselines, and let the gates tell us whether orientation improved.

## Placement-table audit (#13)

- Agree: `describe` belongs under `execute`, not top-level. This already exists. `codemode.describe` is exact-match, returns full rendered signature/schema/usage for one id, and is called the canonical detail-on-demand step (`ARCHITECTURE.md:351-360`, `src/executor/providers.ts:378-443`). Delta: improve search output to point at it less verbosely, not move it.

- Agree: `catalog` is a debug/code-grep escape hatch. This already exists. The sandbox projection includes id, service, kind, description, input/output schemas, and runnable flag, with host-only details stripped (`src/executor/providers.ts:357-375`). It is broad and schema-bearing, so it is not an atlas substitute.

- Agree: full `spec` belongs under `execute` only. This already exists. ARCHITECTURE explicitly says the prior top-level spec-grep search injected a ~45k-token super spec into search and lost; the spec now stays in the sandbox and never enters model context unless a script returns slices (`ARCHITECTURE.md:327-342`). Do not resurrect it as a normal top-level discovery result.

- Agree with narrowing: skill sections should remain a secondary lane, not the primary orientation layer. Search hits already expose `availableSections` (`src/mcp/tools.ts:94-99`) and tool prose tells agents to read sections through `codemode.skill.read` (`src/mcp/tools.ts:175-178`, `src/mcp/tools.ts:209-210`). For build/integration questions, atlas can point to skill families; exact sections should stay discovered via `search` and read inside `execute`.

- Disagree with top-level `searchLexical` / `searchSemantic` escape hatches. The brief's table language is right only if those are sandbox subtools or internal ranker lanes. Current top-level `search` is already lexical/ranked and telemetry-instrumented (`src/mcp/tools.ts:307-317`, `src/mcp/tools.ts:276-290`); `codemode.search` mirrors it inside `execute` (`src/executor/providers.ts:613-632`). Adding `searchLexical` as a sibling is duplicate surface. If semantic is added, expose it as a scorer tier/matchedBy field or `codemode.searchSemantic` for advanced scripts, then promote only on eval proof.

- Agree: artifact follow-up belongs under `execute`. This already exists: `codemode.artifact.info/read` are prelude-wrapped in the sandbox (`src/executor/providers.ts:160-171`) with caps (`src/executor/providers.ts:88-89`, `src/executor/providers.ts:682-828`), and SERVER_INSTRUCTIONS already tells clients to use artifact reads only after a truncated execute result names one (`src/mcp/tools.ts:230`).

- Flag: #13 is mostly status quo. The actual new design work is atlas generation, where atlas cards live, whether semantic recall is added, and whether `search` output should include `matchedBy`, `routeWhy`, or workflow followups. The table's claimed placements for describe/catalog/spec/skill/artifact are already implemented in production and tested.

## What breaks / blast radius checklist

### Shared for any atlas/search redesign

- Update `CATALOG_KINDS` / manifest schema if adding `workflow` or `service` kinds; `SEARCH_KINDS` is a direct alias of catalog kinds (`src/mcp/tools.ts:37-40`), so tool schema changes automatically but tests and docs must be rebaselined.
- Update generated manifest and super-spec emitters only through scripts. ADR-0003 says generated/exposed surface is build-time filtered and runtime cannot show denied entries (`research/decisions/0003-build-time-exposure-filtering.md:36-62`).
- Run emitted-text guards. `assertNoNonExposedRefsInText` scans user-facing prose for excluded ops/retired skills (`scripts/emitted-text-guard.mjs:1-20`, `scripts/emitted-text-guard.mjs:40-70`), and atlas prose would be a new high-risk emitted-text source.
- Rebaseline routing gates if hit order or denominators move. Gates are mechanical in `eval/gates.json` (`eval/gates.json:1-8`), and EVALS says CI enforces `eval:selftest` plus `eval:routing -- --gate` (`eval/EVALS.md:31-40`).
- Update README and public connection docs if the top-level contract changes; README currently says two tools (`README.md:7-10`).
- Update model-facing prose: `SEARCH_DESCRIPTION`, `EXECUTE_DESCRIPTION`, and `SERVER_INSTRUCTIONS` all currently teach `search` then one `execute` script (`src/mcp/tools.ts:158-178`, `src/mcp/tools.ts:180-218`, `src/mcp/tools.ts:226-230`).

### Option A (`atlas` + `execute`)

- Breaks tests asserting exactly `["execute","search"]` (`test/server.test.ts:78-83`).
- Breaks QA harness default variant A, which maps to `search` and allows only `mcp__raven__search,mcp__raven__execute` (`eval/qa/run-qa.mjs:52-57`, `eval/qa/run-qa.mjs:66-79`, `eval/qa/run-qa.mjs:87-104`).
- Breaks preflight that requires `[searchTool, "execute"]` (`eval/qa/run-qa.mjs:173-202`).
- Breaks offline routing eval unless rewritten away from `searchCatalog`/`searchCatalogPage` (`eval/run-routing.mjs:3-12`, `eval/run-routing.mjs:168-176`).
- Breaks README and ARCHITECTURE's two-tool truth (`README.md:7-10`, `ARCHITECTURE.md:9-11`).
- Requires demo rewrite: demo exposes `search` and `execute` (`src/demo/tools.ts:170-255`, `src/demo/tools.ts:253-347`) and intentionally disables broad in-script discovery while allowing exact visible `describe` (`src/demo/tools.ts:52-55`, `src/demo/tools.ts:243-245`).

### Option B (`atlas` + `search/discover` + `execute`)

- Same doc/test/prose blast radius as A, plus higher risk of divergent discovery contracts: top-level discover, top-level search, and `codemode.search` would all need parity or deliberate divergence.
- Telemetry dashboards split: current `search` events use `source:"tool"` or `source:"codemode"` (`src/mcp/tools.ts:276-290`, `src/executor/providers.ts:619-630`). A new `discover` either pollutes search metrics or needs new event names and dashboards.
- More client decision burden: agents now choose atlas vs discover vs execute for every turn. That cost is not theoretical; ADR-0001's heavier discovery route already increased calls/cost and max-turn failures (`research/decisions/0001-search-tool-shape.md:25-34`).

### Option C / recommended zero-new-tool atlas

- Still requires rebaseline of routing gates and snapshots if new atlas lanes affect search scores. `eval/run-routing.mjs` writes results and optionally ranked dumps (`eval/run-routing.mjs:267-292`).
- Update `test/search.test.ts` expectations around kind filters and top hits if atlas cards enter top results.
- Update demo caps/output clipping only if atlas cards are visible in demo search. Demo clamps search limit and clips descriptions/signatures (`src/demo/tools.ts:69-101`, `src/demo/tools.ts:228-249`).
- Update server instructions and search `nextSteps`, but do not add a top-level schema.

## Naming

Keep `search`. Renaming to `discover` buys vibes and loses priors. The repo has already re-retired `search_ranked` into `search` after ADR-0001 (`research/decisions/0001-search-tool-shape.md:36-43`), tests assert `search` is the host-side ranked query (`test/server.test.ts:85-103`), and README/client prompts name `search` as the discovery affordance (`README.md:7-10`, `eval/qa/run-qa.mjs:66-73`). "Discover" is not wrong, but the existing `search` description can be widened from "ranked lexical search" to "capability discovery over service/workflow/operation/skill catalog" without making every client, eval, screenshot, README, and user habit relearn a tool name. Forward-only allows breaking changes; it does not make cosmetic churn free.

## Deciding-eval design

1. Build three candidate branches without changing service adapters:
   - Baseline: current `search` + `execute`.
   - Instructions atlas: generated compact source-family/workflow atlas appended to `SERVER_INSTRUCTIONS`, no new tool.
   - Catalog atlas: same atlas emitted as `kind:"service"` / `kind:"workflow"` entries through existing `search`, with no schemas and no non-exposed references.

2. Run cheap gates first:
   - `npm test` for tool registration/provider/demo tests.
   - `node eval/run-routing.mjs --gate --dump-ranked <tmp>`; pass means legacy strict stays within gate or an explicit rebaseline is justified, skills lane stays >=18/23, extended lane has no zero-hit regression.
   - A discovery-only diff over vague/status/research cases: success = expected source family appears top-3 and at least one usable operation/skill/workflow appears top-5.

3. Run agentic routing on the 30-case sample at low+medium effort. Pass criteria: no drop in docs 100%, overall primary improves by >=5 points or any-hit improves by >=5 with no lumenloop/scout collapse. Treat label-ambiguity separately, as current README does (`eval/agentic/README.md:120-136`, `eval/agentic/README.md:149-175`).

4. Run QA headline on the standard 30-case sample and live-data lane. Pass criteria: weighted QA beats baseline by at least two verdict steps on 30 cases or removes a repeated wrong class, zero new true wrongs after adversarial review, plan regrade keeps requiredCovered >=29/30 and does not increase median execute calls. Existing records show the headline standard and plan metrics to compare against (`eval/qa/README.md:245-260`; latest saved plan summary has 29/30 required covered and mean on-plan 0.989).

5. Only if a top-level `atlas` or `discover` branch is also tested and clears the above by more than the zero-new-tool atlas branch should it ship. Otherwise, the recommendation remains two top-level tools with atlas as instructions plus searchable catalog lanes.
