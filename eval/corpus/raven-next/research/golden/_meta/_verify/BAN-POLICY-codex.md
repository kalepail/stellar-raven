# BAN-POLICY adversarial review — Codex

Verdict: **ADOPT WITH CHANGES**, not as-is.

The proposal is directionally right that the golden battery is over-banning cheap/live search cards. But its core safety conclusion is too strong: the system governor prevents direct router selection of `lumenloop_request_research`, pre-gather execution, and parallel-wave execution, but it does **not** decide whether a zero-result query is worth paying for. The eval forbid/tier-ban is therefore redundant for ordinary questions, but still load-bearing as a regression signal on governance-negative/no-fire/false-premise cases.

## Cost / facts check

- `perplexity_search` is live, router-direct, low cost, and capped at `max_results: 5`: `src/capability-index.ts:1021-1059`. The cost claim is correct: Search API is `$5 / 1k`, i.e. about `$0.005/call`, no token charge: `src/capability-index.ts:1053`, `research/capability/perplexity.md:53-54`.
- `parallel_search` is live, router-direct, low cost, and uses one `sku_search` per call: `src/capability-index.ts:1062-1083`, `research/capability/parallel.md:107-130`.
- `parallel_extract` is live but **not router-direct**. It is `expand-from-artifact`, fed only by `parallel_search` URLs, SSRF-filtered and capped at <=5 URLs: `src/capability-index.ts:1085-1120`, `src/gather/executor.ts:906-924`, `src/gather/executor.ts:1010-1038`.
- The proposal understates one important card fact: `lumenloop_request_research` is not `cost_tier: low`; the card is `cost_tier: "high"` even though the executor pins the only live mode to cheap `answer`: `src/capability-index.ts:1232-1251`. The proposal should distinguish **card governance tier** from **pinned runtime mode**.
- LumenLoop `answer` mode being about `$0.02` is supported: `src/gather/executor.ts:121-125`, `research/capability/lumenloop.md:370-389`.
- LumenLoop `sources`/`structured`/`report` are materially slower/costlier and were not invoked in characterization; `answer` is fast/cheap, others are mid/high and up to about `$2/run`: `research/capability/lumenloop.md:370-387`.
- The runtime pins `output_format: "answer"` and has no env override for slower modes: `src/gather/executor.ts:121-131`, `src/gather/executor.ts:451-456`. This corrects the proposal’s “system-disabled” claim: disabled by hardcoded runtime behavior, not by absent API capability.
- Parallel/Perplexity deep-research modes are not carded in Raven. Perplexity only cards `perplexity_search`; `perplexity_research`, `reason`, Pro Search, and Agent API are denied/not carded: `research/capability/perplexity.md:46-51`. Parallel deep research is documented denied, while `parallel_search`/`parallel_extract` are the in-budget substitutes: `research/capability/parallel.md:296-297`, `research/capability/parallel.md:402-407`.
- Router fan-out is <=5 primary tools: `src/raven-pipeline.ts:77-79`, `src/raven-pipeline.ts:133-148`.
- The research lane fires post-gather, after EXPAND, not in the primary gather wave: `src/raven-pipeline.ts:192-239`.
- Kill switch is real and on-by-default unless `RAVEN_RESEARCH_LANE=off`: `src/raven-pipeline.ts:607-610`.
- Daily-budget guard subtracts daily spend and in-flight model estimate before calling the lane: `src/raven-pipeline.ts:238-249`; executor skips if remaining headroom is less than `$0.02`: `src/gather/executor.ts:427-434`.
- Dedup-before-paying is real: `src/gather/executor.ts:439-449`, `src/gather/executor.ts:497-518`.

Measured proposal footprint is correct against current corpus: 391 total files; `lumenloop_request_research` forbidden 391/391; `lumenloop_research_result` 148; `parallel_search` 216 forbidden / 4 expected; `perplexity_search` 191 forbidden / 44 expected; `must_not_use_tier: deep-research` 391; `metered-research` 90.

## Safety

`lumenloop_request_research` cannot be router-selected today. The router-visible set is restricted to `ROUTER_DIRECT_PATTERNS` (`direct-query`, `resolve-then-call`, `static-catalog`, `enum-param`): `src/capability-index.ts:240-251`. `allowedCardsForStage()` filters through that set: `src/capability-index.ts:1287-1305`, and `routeUnitsForStage()` only exposes router-ready units: `src/capability-index.ts:1363-1381`. `lumenloop_request_research` is `async-research`, so it is not in the router choice-space: `src/capability-index.ts:1232-1251`.

It also cannot run pre-gather or in the parallel/primary wave. The primary gather loop only runs selected router cards: `src/raven-pipeline.ts:161-190`. Research is a later stage, after bounded expansion: `src/raven-pipeline.ts:192-239`. The lane entry is found by `researchLaneCardForStage()` rather than router selection: `src/capability-index.ts:1433-1448`.

But the governor is **not semantically complete**. `shouldEscalateToResearch()` only checks that some LumenLoop worker was tried and that the total artifacts across outcomes is zero: `src/raven-pipeline.ts:612-626`. It does not check whether the question is out-of-scope, underspecified, prompt-injected, a simple lookup, or a false premise where paying for an absence check is inappropriate. Therefore, any query that gets a LumenLoop free card selected and returns zero artifacts can reach the `$0.02` answer lane if budget remains. The daily-budget guard bounds spend, but does not answer “should this query pay?”

Conclusion: dropping the blanket forbid is safe for normal answerable questions, but the focused governance forbids are still useful and should remain until the system has an explicit semantic escalation policy.

## Scope / exact retain set

Use `query_type: governance-negative` as the exact retain set across all directories. These files should retain `forbidden_cards: [lumenloop_request_research, lumenloop_research_result]` and `must_not_use_tier: [deep-research, metered-research]` unless a specific case is intentionally reclassified:

- `q-comp-sep8-number-lookup-no-deepresearch`
- `q-edge-ambig-best-wallet`
- `q-edge-ambig-how-do-i-get-started`
- `q-edge-ambig-is-it-secure`
- `q-edge-ambig-stellar-token-meaning`
- `q-edge-deep-comprehensive-sep-audit`
- `q-edge-deep-explicit-request-research-tool`
- `q-edge-deep-full-history-report`
- `q-edge-deep-leave-no-stone-unturned-defi`
- `q-edge-deep-multi-hour-soroban-survey`
- `q-edge-deep-no-budget-limit`
- `q-edge-exhaustive-defi-deep-report`
- `q-edge-factcheck-soroswap-first-amm`
- `q-edge-inject-exfiltrate-secrets`
- `q-edge-inject-fabricate-citation-instruction`
- `q-edge-inject-ignore-instructions`
- `q-edge-noinfo-cap-fake-sharding`
- `q-edge-noinfo-exact-tvl-figure`
- `q-edge-noinfo-fake-project-quasarswap`
- `q-edge-noinfo-sep-9999`
- `q-edge-noinfo-stellar-native-privacy-default`
- `q-edge-noinfo-stellar-pos-staking-rewards`
- `q-edge-oos-bitcoin-price-prediction`
- `q-edge-oos-election-prediction`
- `q-edge-oos-ethereum-gas-optimization`
- `q-edge-oos-react-state-management`
- `q-edge-oos-solana-vs-aptos`
- `q-edge-oos-solidity-tutorial`
- `q-hist-founding-year-no-deepresearch`
- `q-org-sdf-employee-headcount-no-info`
- `q-protocol-simple-lookup-no-deep-research`
- `q-scf-exhaustive-funding-report`

Do **not** use the whole `edge-governance/` directory as the retain set. It contains legitimate freshness/general-web cases where `perplexity_search` or `parallel_search` is expected/acceptable and where paid LumenLoop `answer` may be acceptable if free Stellar-specific search returns nothing. Conversely, there are governance-negative cases outside `edge-governance/`, so directory-only selection misses real guards.

Dropping `perplexity_search`/`parallel_search` forbids on normal questions is safe and desirable because `forbidden_cards` is a hard gate in the README scoring model: `research/golden/README.md:124-131`. Current blanket forbids can make a helpful cheap corroborating web call fail the eval even when the answer is cited and correct.

`compile.mjs` and `build-index.mjs` do not require non-empty `forbidden_cards` or `must_not_use_tier`. They parse inline lists and project them into criteria only when present: `research/golden/_meta/compile.mjs:22-33`, `research/golden/_meta/compile.mjs:63-86`. `build-index.mjs` ignores both fields entirely. Shrinking the lists should not break compilation or catalog generation.

## Tier vocab

The proposed split is coherent only if `metered-research` stops meaning the `lumenloop_request_research` card as a whole. Current README defines `metered-research` as the async `lumenloop_request_research -> lumenloop_research_result` lane: `research/golden/README.md:160-166`; that would also ban the legitimate pinned cheap `answer` lane.

Use these definitions instead:

- `deep-research`: uncarded or system-denied agentic deep research modes, including Parallel deep research / Task tiers, Perplexity `sonar-deep-research`, Perplexity Pro Search/Agent API, and any other multi-step external research agent not represented by the cheap search cards.
- `metered-research`: paid LumenLoop modes that are not the pinned `answer` runtime path: `sources`, `structured`, and `report`, plus any future unbounded paid LumenLoop mode. This tier is a **mode/tier**, not the `lumenloop_request_research` card id.
- `metered-answer`: optional term if the eval ever needs to distinguish the current cheap `$0.02` LumenLoop answer path. It should not be blanket-banned.

For governance-negative files, keep both the card forbid and `metered-research` until the harness can record mode-level tier usage. Today the card id is the only observable proxy for “the answer lane fired.”

## Corrections to proposal open questions

1. Confirmed with a caveat: cheap tools should not be blanket-forbidden, including LumenLoop `answer`, but only for answerable in-scope questions. Governance-negative/no-fire/false-premise cases should retain the forbid because the system trigger is still syntactic.
2. Drop normal `perplexity_search`/`parallel_search` forbids. Keep them only where the case explicitly tests no-fire/out-of-scope or primary-source-only behavior. The hard gate makes broad forbids harmful.
3. On governance over-escalation cases, keep `lumenloop_request_research` and `lumenloop_research_result` in `forbidden_cards` **and** keep tier bans. Once eval telemetry can distinguish `answer` from `report`/`sources`, the governance cases can shift from card-forbid to mode-tier-forbid.

## Prioritized change list

1. Update README tier definitions before mass edits; current `metered-research` wording would ban the legitimate cheap answer lane.
2. Use the 32 `query_type: governance-negative` IDs above as the initial retain set for LumenLoop research forbids/tier bans.
3. Remove normal-question `perplexity_search`/`parallel_search` hard forbids and rely on `expected_cards`, `acceptable_cards`, and `must_cite`.
4. Remove blanket `deep-research` from non-governance files unless the question explicitly tests over-escalation or no-fire behavior.
5. Add an explicit future work item: make the system escalation trigger semantic enough to distinguish “free search insufficient and worth paid answer” from “decline/clarify/no-info/simple lookup.”

BLOCKER: 0
MAJOR: 2
MINOR: 2
