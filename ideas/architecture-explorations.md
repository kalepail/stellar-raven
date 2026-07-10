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

1. **Run the null hypothesis: per-op MCP tool server vs search+execute** (~2–4 days; harness
   exists). The foundational two-tool bet was never directly measured — ADR-0001 A/B'd two
   *code-mode* search shapes against each other. Generate a variant server exposing the ~50
   catalog ops as plain MCP tools (manifest already carries ids/descriptions/inputSchemas;
   adapters exist), run the 30-case QA sample + live lane both ways. Evidence: verdicts, turns,
   cost, truncation-driven context bloat per arm. Either retires the strongest standing
   objection to the architecture with data, or redirects the project. The single
   highest-information experiment available.

2. **Hybrid lexical+embedding retrieval A/B — GREENLIT as the Vectorize frontier spike
   (Tyler, 2026-07-09; discovery-redesign round outcome).** The 2026-07-09 round hardened the
   case: the lumenloop capture class is an entity→family mapping problem in a 66%-mixed-register
   query stream, and BOTH lexical levers are now measured at their ceiling — prose guidance is
   zero-sum across 7 live agentic runs, and generic catalog cards intercept ≤6.9% of real agent
   queries even at the enrichment upper bound (`research/p2-outcome-addendum.md`). What has NOT
   been tried: **Cloudflare Vectorize (or committed build-time vectors) with a frontier
   embedding model** — round 5f (eval/README.md) tested only offline bge-base and failed all
   four modes; that result binds the design (stronger model, determinism preserved: pinned
   model + committed generated vectors or a versioned Vectorize index built in refresh, never
   at request time), not the idea. Spike design: target exactly the measured class — referee
   with the discovery instrument, the mined real-query set (66% mixed register), and live
   agentic runs at ≥3 runs/arm with per-case family matrices (single runs proven unable to
   gate ±2-case movements); docs 100% and scout-medium hold as blocking guardrails. Run in a
   fresh worktree after the discovery-redesign merge.

3. **MCP 2026-07-28 spec readiness spike** (1 day; TIME-SENSITIVE — final ships ~3 weeks from
   the review date). PARTIALLY RESOLVED 2026-07-09: the instructions-channel question was
   researched from primary sources and decided (`research/discovery-redesign.md` §4 P1 step 3
   — instructions survive in optional `server/discover`; SEARCH_DESCRIPTION is the reliable
   carrier; served dual-era). REMAINING: the transport-level compat review — `initialize` and
   `Mcp-Session-Id` removal, required `Mcp-Method`/`Mcp-Name` headers, `subscriptions/listen`
   replacing GET/SSE — against the McpAgent/createMcpHandler stack once SDKs land the final
   spec. Re-check client adoption of `server/discover` after July 28.

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

## Known deferred hardening leftovers (small, non-blocking)

- Judge-regression replay gate from real adjudicated rows — deferred: conflicts with the
  results-local-only convention; synthetic counter-pressure fixtures shipped instead
  (rubric v2.4, 2026-07-07).
- `extractLossDetail` regex in `src/policy/source-basis.ts` is coupled to the truncate.ts
  footer wording; a wording edit silently empties lossDetail with one indirect test on guard.
- The 10.4MB `assets/repo/Gemini_Generated_Image_*.png` is documented as intentionally retained
  (`assets/repo/README.md`) — revisit if page-weight or repo-size ever matters.
