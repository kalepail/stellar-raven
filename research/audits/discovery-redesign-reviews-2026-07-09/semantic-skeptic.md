# Semantic / Hybrid Search Skeptical Review

## Verdicts

Claim A, "embed generated routing cards in Vectorize and merge lexical+semantic+exact tiers": **reject-now-with-trigger**. The generated-routing-card unit is the right unit if semantic retrieval is ever justified, but the current corpus and eval evidence do not justify Vectorize now. The current manifest is not "~54 operations + 18 skills + ~204 sections"; it is 272 entries: 50 operations, 18 skills, 204 sections, verified from `catalog/manifest.json` (entries begin at `catalog/manifest.json:2`; service operation namespaces are 18 + 20 + 12 in `ARCHITECTURE.md:193-197`; skill/section counts are documented at `ARCHITECTURE.md:435-447`). That is small enough for deterministic atlas/lexical/alias work, and the actual embeddings prototype already failed.

Claim B, "`search(auto)` should run atlas+lexical+semantic and return unified candidates with why/matchedBy/next": **reject-now-with-trigger**. Atlas + lexical deserves measurement; semantic as an automatic prong does not. A unified candidate surface may eventually survive, but not with semantic merged into the default ranking path and not with verbose per-hit reasons until size and gate behavior are proven.

## Findings

1. **The measured recall problem is not "zero hits" anymore; it is mostly strict-label/order disagreement.**

   `eval/EVALS.md:17-20` names the current routing instruments and says the extended lane is diagnostic, with the older post-backfill milestone "pass@5 120/122, zero-hit 0". The durable history explains the big recall fix: tiered gate-rescue moved extended zero-hit 65/122 -> 0 and pass@5 -> 120/122 (`eval/README.md:388-414`). Current local result `eval/results/routing-2026-07-09T12-01-50-970Z.json` is stricter after later changes: extended strict is 79/104/110 and accept-either is 110/121/122 (`eval/results/routing-2026-07-09T12-01-50-970Z.json`, summary object; current baseline numbers also recorded in `eval/README.md:512-515`). Running over that result shows **zero-hit = 0** for legacy, extended, and skills lanes; the 12 extended strict top-5 misses all have `any5=true`.

   The 12 current extended strict top-5 misses are: `q-crp-export-tx-history-taxes`, `q-crp-regional-offramp-mobilemoney`, `q-defi-build-staking-for-own-token`, `q-defi-sdex-offer-lifecycle`, `q-edge-exchange-memo-lost-funds`, `q-edge-metamask-evm-mental-model`, `q-pc-account-merge-reclaim-reserve`, `q-pc-practical-fee-setting`, `q-pc-sequence-numbers-ordering-replace`, `q-pc-surge-griefing-threat-model`, `q-sor-msg-sender-equivalent`, and `q-ti-friendbot-ratelimit-alternatives` (`eval/routing-cases.json:4081`, `4105`, `4179`, `4265`, `4303`, `4315`, `4404`, `4500`, `4548`, `4572`, `4780`, `5118`; result rows at `eval/results/routing-2026-07-09T12-01-50-970Z.json:14534`, `14618`, `14872`, `15168`, `15295`, `15337`, `15660`, `15996`, `16164`, `16248`, `16990`, `18168`). Every one is covered by an acceptable service in top 5. That is not a blank-page recall failure. It is "the strict expected service was not in the first five even though an accepted source-family route was."

   Embeddings plausibly help a few source-family confusions, but the evidence says they are at least as likely to reshuffle acceptable candidates as to improve end-to-end correctness.

2. **The repo already tried embeddings, and the measured result was bad.**

   Round 5f embedded 271 catalog entries plus all 483 eval queries with Workers AI `@cf/baai/bge-base-en-v1.5`, calibrated the harness by reproducing official lexical numbers, and measured semantic-only, semantic backfill, RRF, and semantic rerank (`eval/README.md:576-586`). Every semantic/hybrid mode failed the stated cut (`eval/README.md:588-596`):

   - semantic-only: legacy 130/205/232, extended 36/59/73, skills 18/23/23.
   - lexical + semantic backfill: legacy -8 top-1 and extended 79 -> 54 top-1.
   - RRF k=60: -30 top-1, extended -25 to -31 top-1, skills 17.
   - semantic rerank of lexical top-20: legacy 175/259/283, extended 78/107/112, skills 17/23/23.

   The important part is not "all embeddings are bad forever"; it is that the proposed family already has negative evidence in this repo. The notes say ungated lexical backfill beats bge-base semantic backfill outright (extended 79 vs 54), cosine prefers skill-section prose over docs-search operations, and rerank20 has 24 wins but 25 losses (`eval/README.md:598-613`). That is churn, not lift.

3. **The need case is weaker because cheap deterministic levers already bought the real gains.**

   Current search is not "just lexical keyword matching." It has stopword gate-rescue, kind weighting, service diversity, keyword blending, ungated backfill, and query alias canonicalization (`ARCHITECTURE.md:102-129`; `src/catalog/scoring.ts:14-65`, `173-241`). Search pages then preserve the gated/backfill seam rather than pretending scores are comparable (`ARCHITECTURE.md:142-154`; `src/catalog/search.ts:394-458`).

   The alias story is especially damaging to the Vectorize pitch. The first offline alias table was flat and discarded (`eval/README.md:517-530`), then a real-user alias lane was built and the small curated alias map shipped: `tx/txn/txs -> transaction(s)`, `acct -> account`, `addr -> address` (`src/catalog/scoring.ts:173-197`, `208-241`; `eval/README.md:615-648`). It improved the unsaturated real-user alias lane from 72/135/173 to 87/154/179 strict while leaving legacy, extended, skills, and control byte-identical (`eval/README.md:631-641`). This is exactly the cheaper, deterministic recall lever the semantic proposal claims to need.

4. **Vectorize violates the current build/test contract unless it is demoted to a separately-versioned generated artifact.**

   The current build chain is deliberately simple: `refresh-inventory` is the **only network step**, and `build-catalog`, `build-super-spec`, and `bundle-skills` are offline/deterministic (`ARCHITECTURE.md:551-562`). Determinism is a hard property: sorted keys/entries, `generatedAt` from input snapshots, byte-identical consecutive runs, and tests asserting checked-in generated artifacts match fresh rebuilds (`ARCHITECTURE.md:564-580`). CI enforces offline tests with a miniflare outbound wall, then runs eval gates and artifact-sync rebuild/diff checks (`ARCHITECTURE.md:582-593`). Gate re-baselining is an explicit act in `gates.json` and CI (`eval/EVALS.md:31-40`; `eval/gates.json:1-8`).

   A live Vectorize index has none of those properties by default. Embedding model revisions, float scores, index rebuild timing, metadata-index configuration, and query ANN behavior become part of ranking. If vectors are generated live during search, CI cannot reproduce them offline. If vectors are generated during `refresh-inventory`, the repo now needs a checked-in vector artifact, model id, model version/hash, vector dimension, card text hash, per-entry id version, and a gate proving the deployed Vectorize index exactly matches that artifact. Without that, a routing gate pass in CI does not predict production ranking.

5. **There is no operational surface for this in the current Worker configuration.**

   The MCP surface currently has `search` and `execute`; `search` is a host-side ranked query over the generated catalog (`ARCHITECTURE.md:9-11`, `68-86`; `src/mcp/tools.ts:1-13`). The current `wrangler.jsonc` has Worker Loader, demo-only Workers AI, KV, and R2 bindings; it does not have a Vectorize binding (`wrangler.jsonc:17-33`, `46-63`). The AI binding comment explicitly says demo-only and "the MCP surface never touches this binding" (`wrangler.jsonc:26-33`). The local dev command is plain `wrangler dev --host localhost` (`package.json:11`).

   Shipping Vectorize means adding a new binding, local/preview index story, index creation/migration docs, drift-refresh re-embed job, failure mode, observability, and deployment verification. Cloudflare's own docs make the cost/limit surface real: Vectorize bills stored and queried vector dimensions, metadata is limited to 10 KiB/vector, vectors max at 1536 dimensions, result limits depend on returning metadata/values, and Workers AI query embeddings have their own pricing/free allocation (Cloudflare Vectorize pricing: https://developers.cloudflare.com/vectorize/platform/pricing/; limits: https://developers.cloudflare.com/vectorize/platform/limits/; Workers AI pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/). For ~272 entries this is not huge money, but it is a new live-state system for a problem whose current measured zero-hit count is zero.

6. **Hybrid rerank would create a second unauditable ranking layer on top of an already-subtle one.**

   The current scoring stack is intentionally constrained: vendored lexical math, structural wrappers, then set shaping (`ARCHITECTURE.md:88-154`). The existing tier seam is documented because gated and backfill scores are **not score-comparable** (`ARCHITECTURE.md:142-150`; `src/catalog/search.ts:47-63`). `searchCatalogPage` appends ungated hits only below gated hits, so tier-2 cannot displace tier-1 (`src/catalog/search.ts:414-458`).

   The proposed "exact > multi-prong > semantic > backfill" adds an atlas/semantic/lexical fusion layer whose scores are even less comparable. "Found by multiple prongs" is not inherently better: an atlas rule plus a weak semantic hit can create a false consensus. Semantic-only matches are not calibrated against exact SEP/CAP/id/name hits. RRF already tested as a principled fusion method and failed hard (`eval/README.md:588-596`). If a simpler RRF fusion fails, a hand-ranked fusion ladder needs much stronger evidence than the issue currently provides.

7. **`why` / `matchedBy` / `next` is not free; search output already had to be compacted because token bloat made the wrong call easiest to copy.**

   Search hit anatomy is already dense: id, service, kind, score, tier, description, signature, and skill section keys (`ARCHITECTURE.md:156-173`; `src/catalog/search.ts:47-80`). The compact-output threshold exists because only three Scout monster output types made a limit-10 page about 26 KB, usually on off-target hits (`ARCHITECTURE.md:165-173`; `src/catalog/search.ts:219-235`). Telemetry records search response chars specifically because size mattered (`ARCHITECTURE.md:83-86`).

   A per-hit `why`, `useWhen`, `followups`, `matchedBy`, confidence, and `next` field could easily add hundreds of characters per hit. At 10 hits, that competes directly with signatures, schemas, and descriptions that the model actually uses to call the tool. The current design already has a compact server hint in `nextSteps` (`ARCHITECTURE.md:72-77`; `src/mcp/tools.ts:102-120`) and exact detail via `codemode.describe` (`ARCHITECTURE.md:351-360`; `src/executor/providers.ts:634-644`). If reasons ship, they should be a measured compact enum/classification layer, not open prose.

8. **The issues themselves do not justify building vectors now.**

   Issue #9 says the search implementation is solid and the missing piece is teaching agents to plan discovery before issuing search calls. Issue #11 explicitly recommends a separate experiment and its comment says embeddings should be an optional Phase 3 recall layer after measuring atlas + lexical. Issue #12 says `search(auto)` is a possible product shape, but its own comments say a good atlas may reduce vector need and that embeddings remain a safety net only if atlas + lexical still miss. Issue #13 is a taxonomy issue, not a green light to build semantic retrieval. The design thread's own evaluation order is A current lexical, B atlas + lexical, C vector, D hybrid; it does not say skip to D.

9. **Parts that survive the attack.**

   Generated routing cards are the correct embedding unit if vectors are later justified; issue #11 is right not to embed raw schemas. Exact/id/name/prefix lexical search must remain first-class because SEP/CAP numbers, operation ids, and API names are lexical by nature. A deterministic atlas is likely the next credible experiment because it addresses source-family orientation without live-state ranking. Semantic signal exists: rerank20 produced 24 genuine wins (`eval/README.md:607-609`). But the same experiment had 25 losses and broke gates, so the signal is not ready for production ranking.

## Concrete Trigger Condition for Vectors

Do not build Vectorize until all of these are true:

1. Atlas + current lexical/alias/backfill is implemented or simulated and measured first.
2. The target lane is unsaturated and realistic. Use the real-user alias/control lane shape from round 844, not only the extended lane whose accept-either top-5 is already saturated (`eval/README.md:631-643`).
3. A semantic prototype beats the deterministic baseline by a material margin: at least +5 percentage points strict top-1 or +3 percentage points strict top-5 on the unsaturated real-user target lane, while legacy gate stays within the current ±1% band, skills top-1 remains >= 18/23, and extended accept-either top-5 remains 122/122.
4. The semantic wins are net quality wins under agentic/QA review, not just service-label reshuffles. Require win/loss adjudication similar to round 5f's 24 wins / 25 losses accounting (`eval/README.md:607-609`).
5. The production index is reproducible: checked-in routing-card text, card hash, embedding model id/version, vector dimensions, entry id version, and an index audit command that proves deployed Vectorize state matches the artifact before deploy.

## Eval Design That Would Decide It

1. **A/B modes, frozen before running:** lexical current; atlas + lexical; semantic-only routing-card retrieval; lexical + semantic backfill; semantic rerank of lexical top-20; one predeclared hybrid fusion. Do not tune per lane after seeing results.
2. **Calibration:** the lexical mode in the harness must reproduce official routing numbers exactly before any semantic numbers count, matching the round 5f discipline (`eval/README.md:580-586`).
3. **Scopes:** legacy 338 strict gate, skills 23 gate, extended 122 strict + accept-either, and an unsaturated real-user lane. Lanes must remain separate per `eval/EVALS.md:41-44`.
4. **Outputs:** ranked-id dumps for every lane, per-case win/loss tables, strict and accept-either summaries, zero-hit counts, response character sizes, and a list of cases where semantic displaced exact/id/SEP/CAP hits.
5. **Agentic validation:** sample the semantic wins and losses through the live agentic/QA path, because the offline grader has known label ambiguity and the headline eval is end-to-end answer correctness (`eval/EVALS.md:9-24`).
6. **Compactness gate:** any `why`/`matchedBy`/`next` output must be measured against current response-size telemetry. If limit-10 search pages grow enough to crowd out signatures or exceed the compactness budget that motivated `COMPACT_OUTPUT_THRESHOLD`, reject or make reasons opt-in.

## Ranked Alternatives

1. **Atlas + better tool guidance.** Best evidence-to-risk ratio. It targets issue #9's source-family planning problem without live vector state. It is deterministic, inspectable, and gateable.
2. **Build-time keyword/routing-card enrichment, still lexical.** Already proven: operation keywords helped without regressions when DF-filtered (`eval/README.md:416-442`). Richer deterministic descriptions/cards can improve lexical recall and later serve as embedding text if needed.
3. **Curated alias tables on measured real-user registers.** Proven on the alias lane and deterministic (`eval/README.md:631-648`; `src/catalog/scoring.ts:191-197`). Do not expand blindly; round 5e showed broad aliases were flat offline (`eval/README.md:517-530`).
4. **Multi-query search guidance.** Cheap and already compatible with current `search`/`execute`; issue #9's suggested behavior is hypothesis -> multiple catalog searches -> execute fan-out. This needs prompt/tool-description work and eval, not infrastructure.
5. **Host-side LLM query rewriting.** Possible, but worse than aliases on determinism. It introduces model drift and network into routing; it should face the same trigger/eval bar as embeddings.
6. **Vectorize semantic retrieval.** Last, not first. Keep the design as a Phase 3 escape hatch with the trigger above.
