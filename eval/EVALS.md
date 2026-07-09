# Eval map — what we measure and why

This server is two tools — `search` and `execute` — for AI agents working the Stellar
ecosystem. Every eval here exists to answer one question at some layer:

> **Does an agent driving this MCP end-to-end produce a correct, current, non-fabricated
> answer?**

That end-to-end number (the QA eval) is the **headline**. Everything else is a cheaper or
sharper instrument pointed at one layer of it. When two evals disagree, the one closer to
the headline wins.

## The instruments

| Instrument | Layer | Cost / when to run | Headline vs diagnostic |
|---|---|---|---|
| `eval/run-routing.mjs` — legacy 338 strict | `search` ranking, offline | free, seconds — **every scoring/catalog change** | **GATE**: within ±1% of 213/267/303 (grading rule v3, manifest-exposed — re-baselined 2026-07-04 on the stellar-light 1.4.4 drift refresh, issue #2; decision record in the `note` field of `eval/gates.json`. Prior baselines: 203/265/303 (v3, todo 836 / ADR-0003: manifest is build-time filtered to exposed entries only and the v2 twin-identity grading layer is deleted; 35 of 37 changed cases had byte-identical hits, the 2 ranking changes were improvements), 222/288/318 (v2, todo 824 op keywords), 219/287/313 (tiered gate-rescue), 208/267/283, 195/250/266). Enforced: baselines live in `eval/gates.json`; `--gate` exits 1 on breach and CI runs it on every push/PR |
| — skills lane (23, hand-authored) | skills routing | free, same run | **GATE**: must not regress 18/23 top-1 (floor in `eval/gates.json`, same `--gate` enforcement; re-baselined 2026-07-03, todo 825 — 8 cases targeting the retired lumenloop-api/mcp-connect onboarding skills moved to `retiredCases`, prior floor 26/31 with the same 5 misses) |
| — extended lane (122, real-user phrasing) | `search` on jitsu-mined questions | free, same run | Diagnostic; **target metric for retrieval work** (pass@5 120/122, zero-hit 0 as of 2026-07-03 tiered rescue — was 65/122 zero-hit; strict top-1 77/122 after op keywords, was 74) |
| — accept-either views (corpus `acceptable_cards` ∪ overlay) | label-tolerance context | free, same run | Diagnostic only; never the headline |
| `eval/discovery/` | one-search source-family / usable-route discovery over the live MCP HTTP surface | free aside from the local server; after discovery guidance or retrieval-shape work | Diagnostic: 43 adjudicated cases; `familyHit@3` + `usableOp@5`; known limit is verbatim single-query input |
| `eval/agentic/` | agent-driven `search`, live server | ~$, minutes — after major search-behavior changes | Diagnostic (label-ambiguity analysis) |
| `eval/qa/run-qa.mjs` — main battery (469) | **end-to-end search → execute → answer** | ~$0.2–0.7/case, ~30 min per 30-case sample — before/after big changes, A/Bs | **HEADLINE** (correct / partial / wrong) |
| — live-data lane (`--cases eval/qa/live-cases.json`, 10) | `execute` **grounding** where priors fail | ~$3–7 full — after executor/adapter changes | Diagnostic for the execute path; graded on behavior (live-derived facts, as-of framing, honest refusal), never exact values |
| `eval/plan/grade-plan.mjs` | which services `execute` actually touched | free (regrades stored QA transcripts) | Diagnostic (coverage; progression informational only) |

Corpus provenance (all lanes): `eval/corpus/PROVENANCE.md`. The corpus is **archival** —
the raven sibling repos are retired; growth happens in this repo's own formats.

## Rules that keep this from getting messy

1. **One headline, two gates, everything else is diagnostic.** New reporting views don't
   get promoted into gates without a decision recorded in Solo. The two gates are
   mechanical, not prose: baselines live in `eval/gates.json`, every `run-routing` run
   prints a gate verdict, `--gate` turns a breach into exit 1, and CI runs
   `eval:selftest` + `eval:routing -- --gate` on every push/PR — so re-baselining means
   changing `gates.json` in the same commit as the change that moved the numbers.
   Grading-rule changes
   re-baseline the gates explicitly (results files carry `gradingRule`). Current rule: v3,
   manifest-exposed entries only, no lumenloop/skills twin identity; cross-service tolerance
   belongs in `expected_any`, not in the strict headline.
2. **Lanes never merge.** The legacy 338, skills 23 (active; +8 documented-inert
   `retiredCases` in `eval/skills-cases.json` after the 2026-07-03 onboarding-skills
   retirement, ADR-0002), extended 122, and live-data 10 are separate scopes with separate
   denominators, forever. Comparability > bigger n.
3. **No per-question tuning.** Zero-hit cases stay failing until a *general* mechanism
   fixes them (inherited from the raven ADRs; it has held through three scoring rounds).
4. **Spirit, not schema.** Corpus content is fair input; foreign schemas, judge code, and
   labels built for other systems are not. Concretely: the semantic battery's `skillsAny`
   labels were evaluated and **deliberately not imported** (2026-07-03) — they were
   diagnostic-only in their source system, use cf-flue composite skill names, and every
   skill family they reference is already covered by the 23 active hand-authored skills cases
   (`eval/skills-cases.json`; 8 onboarding-skill cases moved to inert `retiredCases` on
   2026-07-03 per ADR-0002).
   Adding them would have grown the denominator, not the signal.
5. **Freshness-sensitive truth is graded as behavior, not values.** Anything that drifts
   (RFPs, leaderboards, rounds, region vocab) belongs in the live-data lane with a
   behavioral golden; putting a snapshot value in a hard gate is how evals rot.
6. **Hand-authored files are load-time supplements** (`skills-cases.json`,
   `build-question-overlay.json`, `live-cases.json`) — compiles can't wipe them, and they
   are committed. Generated files (`routing-cases.json`, `qa/cases.json`) are never
   hand-edited.
7. **Results are local-only evidence** (`eval/**/results/`, gitignored); READMEs carry the
   committed record with the exact results-file stamp they cite. The results dirs are unbounded
   — prune them periodically (e.g. drop results older than 30 days), keeping any stamp still
   referenced by `eval/gates.json` or a committed README record.
8. **Discovery is intentionally narrower than QA.** `eval/discovery/` asks whether one verbatim
   `search` surfaces an expected family in the top 3 and a usable operation/skill in the top 5.
   It does not measure multi-search agent planning or final-answer correctness. The planned
   extensions are an agent-allowed-≤3-search arm and replay of mined real agent queries; until
   those land, use the agentic and QA lanes for behavioral conclusions.

## Primary artifact: service-improvement recommendations

This server's own tuning ceiling is limited — scoring tweaks buy single-digit points. The
outsized leverage of running these instruments is **discovering gaps and errors in the four
upstream surfaces** (Lumenloop, Stellar Light/Scout, Stellar Docs, skills). So a primary
artifact of every eval run is an evidence-backed set of service-improvement recommendations
filed in `improvements/` (charter: `improvements/README.md`; one file per finding, in the
matching collection: `lumenloop/`, `stellar-light-scout/`, `stellar-docs/`, `skills/`).

- **Filing rule:** every eval round files new findings or updates existing ones. A round
  that surfaces an upstream gap and doesn't file it has dropped its most valuable output.
- **Evidence rule:** findings move `proposed → verified → reported-upstream → fixed-upstream`;
  `verified` requires live re-execution evidence, not a stale transcript.
- **Scope rule:** `improvements/` is for the upstream services only. Fixes to this repo's
  own scoring/catalog/executor go to Solo todos, as ever.

## What we deliberately do NOT measure

- **General-web questions** (perplexity/parallel arms) — this server intentionally has no
  web arm; 51 corpus cases skipped with reasons, 10 curated none-traps kept.
- **Raven-agent internals** (its brand, its Airtable, its pipeline stages) — 4 traps
  skipped; stage-attribution grading dropped.
- **Weighted rubric scores / citation hard-gates** — replaced by coarse
  correct/partial/wrong + explicit missingFacts/wrongClaims (robust to judge variance;
  rationale in `eval/qa/README.md`).
- **Exact placements/rankings from surfaces that don't carry them** — the upstream reviews
  rejected those cases (`sl-hackathon-kale-reflector-1st`, `sl-hackathon-kale-vs-blend-counts`,
  `sl-ecosystem-asset-rwa-underbuilt-unfunded`); the rejections hold here and the live-data
  lane encodes their failure modes as `avoid` items instead.
