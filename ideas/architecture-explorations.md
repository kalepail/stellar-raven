# Architecture exploration backlog — from the 2026-07-07 first-principles review

Provenance: the 24h ship review (Solo scratchpad `24h-ship-review-2026--551`, archived) ran a
first-principles evaluation of the codemode architecture against this project's goals, with
mid-2026 external evidence. Verdict: the architecture is right and reasonable — two-tool
search+execute economics are ecosystem-validated (Cloudflare's own 2,500-endpoint Code Mode
gateway, Anthropic's 98.7%-reduction guidance), the dossier-runner retirement proved models
out-compose host orchestration, and the cap/artifact-lane decisions are the best-evidenced in
the repo. But the review named unmeasured assumptions and time-sensitive work. This file is the
ranked backlog so it survives the scratchpad's archival. Each item follows the house rule:
conviction or a winning A/B on golden Q→A accuracy.

## Ranked candidates

1. **Per-op MCP tool server vs search+execute — MEASURED NULL / NO SHIP (2026-07-10, todo 903).**
   The manifest-derived 50-operation harness ran against the fixed QA-30 and canonical live-10
   lanes. After every partial/wrong/flip was reviewed, QA favored search+execute
   (20C/9P/1W vs 17C/12P/1W); live favored direct by one verdict (9C/1P vs 10C), within a single
   drifting replicate with cross-lane-only order reversal. Direct used lower cache tokens/cost but
   more QA turns/calls, weaker plan coverage, and more truncation markers. The large definition
   delta was only advertised wire surface under Claude deferred tools, not always-consumed context.
   Skills and artifact-read were unavailable in the direct arm. Retain search+execute; do not
   rebaseline. Harness, identities, metrics, and row dispositions:
   [`eval/qa/reviewed/2026-07-10-per-operation-architecture-ab.md`](../eval/qa/reviewed/2026-07-10-per-operation-architecture-ab.md).

2. **Hybrid lexical+embedding retrieval A/B — MEASURED NO-SHIP (todo 902, 2026-07-10).**
   The 2026-07-09 round greenlit the Vectorize frontier spike and hardened the
   case: the lumenloop capture class is an entity→family mapping problem in a 66%-mixed-register
   query stream, and BOTH lexical levers are now measured at their ceiling — prose guidance is
   zero-sum across 7 live agentic runs, and generic catalog cards intercept ≤6.9% of real agent
   queries even at the enrichment upper bound (`research/p2-outcome-addendum.md`). What has NOT
   been tried: **Cloudflare Vectorize (or committed build-time vectors) with a frontier
   embedding model** — round 5f (eval/README.md) tested only offline bge-base and failed all
   four modes; that result binds the design (stronger model, determinism preserved: pinned
   model + committed generated vectors or a versioned Vectorize index built in refresh, never
   at request time), not the idea. Spike design: target exactly the measured class — referee
   with the discovery instrument, the mined real-query set (the unavailable historical artifact
   was 66% mixed register; the retained reproducible lane is 46.2%), and live
   agentic runs at ≥3 runs/arm with per-case family matrices (single runs proven unable to
   gate ±2-case movements); docs 100% and scout-medium hold as blocking guardrails. Run in a
   fresh worktree after the discovery-redesign merge. **Outcome:** the pinned local
   Qwen3-Embedding-0.6B rerank harness and prerequisite discovery lanes landed as eval assets,
   but the retrieval mode failed the composite ship gate: mined target top-5 cleared its isolated
   lift while top-1 regressed, legacy and extended gates broke, and three vector agent runs failed
   docs/scout blockers despite a noisy LumenLoop primary lift. No production
   Vectorize/index/runtime path shipped. Full record:
   `eval/vectorize/README.md`.

3. **MCP 2026-07-28 spec readiness spike — RESOLVED 2026-07-30.** Both halves landed. The
   instructions-channel question was decided 2026-07-09 (`research/discovery-redesign.md` §4 P1
   step 3 — instructions survive in optional `server/discover`; SEARCH_DESCRIPTION is the reliable
   carrier). The transport-level compat work then shipped: the handler serves both wire eras —
   the 2026-07-28 revision via `server/discover` negotiation, pinned end-to-end by
   `test/smoke/mcp-modern-client.test.ts` (which asserts a modern client negotiates and fails
   loudly rather than silently falling back), and the 2025 `initialize` lifecycle through the
   stateless legacy fallback. See `ARCHITECTURE.md` §1. The one thing this item asked for that is
   now merely DUE rather than blocked: the spec date has passed, so re-check real client adoption
   of `server/discover` in production logs when convenient — a telemetry question, not a spike.

4. **Compact operation-card code-shaped search re-test** — ADR-0001's own named next
   experiment: hybrid ranked/code search over op cards with `codemode.search`/`describe`
   parity in the search sandbox; rerun the 60-case paired A/B. Win = variant-B answer quality
   without the max-turn exhaustion that killed it.

5. **Discovery-only eval instrument** — BUILT 2026-07-09 (`eval/discovery/`, discovery-redesign
   round): 43 adjudicated cases over the live MCP HTTP surface, familyHit@3 / usableOp@5,
   post-PR-17-fold baseline 32/43 · 25/43. Known scope limit: naive-verbatim single queries
   under-represent the mixed register real agents use (66% of mined traffic). Planned extensions:
   replay mined real queries (extraction pattern in the 2026-07-09 round ledger) and add the
   agent-allowed-≤3-search arm promised by the original Phase 0 plan.

6. **Pre-cap evidence sidecar for QA judging** (runner change). Closes the residual
   judge/agent evidence asymmetry at its root: agents read full payloads via
   `codemode.artifact.read`; judges see capped transcript text + claim-anchored packs, so
   live-computed aggregates ("N of M events…") remain unanchorable. `run-qa.mjs` captures
   uncapped execute payloads (or dev-R2 artifact bodies) into a gitignored per-stamp sidecar;
   the pack builder prefers sidecar over capped transcript. Predicted first break without it:
   count/aggregation claims on live digest cases.

7. **Telemetry-mined live cases** — mine real production intents (with the PII-scrub doctrine
   from the 2026-07-03 purge) into live-lane eval candidates; cases nobody authored are the
   best guard against golden-authoring bias.

8. **Adopt upstream's durable approval runtime** only when a side-effecting/paid op actually
   ships — `@cloudflare/codemode` v0.3/0.4 carries the DO-backed approve/reject/rollback
   control plane anticipated by [`AGENTS.md` “Hard rules”](../AGENTS.md#hard-rules). No action
   until then; mirror upstream rather than inventing.

9. **Docs machine corpus beyond Algolia titles** (2026-07-12 coverage review, Solo scratchpad
   607). developers.stellar.org publishes `llms.txt`, a 4.2MB `llms-full.txt`, per-page
   Markdown alternates, and a 934-URL sitemap; the inventory keeps only 635 deduped Algolia
   `type:lvl1` titles, and the authored spec already documents that generated RPC/Horizon
   reference pages are absent from the Algolia index (`specs/stellar-docs.json`). A
   change-detectable snapshot of the official machine corpus could close that hole and feed
   richer routing vocabulary — but it is a new retrieval-quality bet, so it takes the house
   gate: a read-only A/B win on golden Q→A accuracy before any runtime surface. Related
   smaller gaps recorded with it and deliberately not taken: Lumenloop's `/v1` + `/v1/docs` +
   llms.txt discovery conventions (the adapters already implement the envelope; inventorying
   prose conventions has no consumer) and Scout `/api/skills` detail bodies (the
   identity-projection drift check is the intended surface; skill content bodies come from
   the GitHub mirrors the repo already pins).

## Known deferred hardening leftovers (small, non-blocking)

- Judge-regression replay gate from real adjudicated rows — deferred: conflicts with the
  results-local-only convention; synthetic counter-pressure fixtures shipped instead
  (rubric v2.4, 2026-07-07).
- `extractLossDetail` regex in `src/policy/source-basis.ts` is coupled to the truncate.ts
  footer wording; a wording edit silently empties lossDetail with one indirect test on guard.
- The 10.4MB `assets/repo/Gemini_Generated_Image_*.png` is documented as intentionally retained
  (`assets/repo/README.md`) — revisit if page-weight or repo-size ever matters.
