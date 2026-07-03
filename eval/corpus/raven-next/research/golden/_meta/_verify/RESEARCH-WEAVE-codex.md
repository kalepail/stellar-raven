# RESEARCH-WEAVE Review - codex

Scope: adversarial review of adding `lumenloop_request_research` to `acceptable_cards` on the 20-target curated deep-synthesis subset. I did not edit golden question files or commit.

## Findings

### BLOCKER: `q-defi-perps-whitespace` conflicts with the updated market-map truth

`research/golden/defi-ecosystem/q-defi-perps-whitespace.md` still gates on "no live perpetuals/derivatives DEX is surfaced on Stellar." But `q-eco-defi-market-map` now explicitly forbids that same stale claim and says perps are not whitespace, naming Noether, Turbolong, Stellars Finance, and Zenex. This makes the target internally inconsistent with the battery. Adding the metered research lane here is especially unsafe: a better research call may surface the newer perps records and then fail the stale rubric.

Recommendation: remove `lumenloop_request_research` from `q-defi-perps-whitespace` until the underlying golden question is reconciled.

### MAJOR: Exact corpus lookup cases should not accept the paid lane

Four targets are exact "find all content about named entity/project/person" lookups with dedicated free LumenLoop lanes. These are not weak-corpus, analyst-grade landscape questions; they are resolver/content-enumeration tests where the billed lane risks rewarding unnecessary spend.

Remove from:

- `q-defi-blend-content`
- `q-defi-soroswap-content`
- `q-defi-reflector-content`
- `q-builder-content-by-person`

The expected cards remain the right signal: `lumenloop_find_content_about_project` or `lumenloop_find_content_by_entity`, with semantic content/A/V lanes as acceptable alternates.

### MAJOR: `q-pay-unhcr-aid-assist` violates the stated "free corpus primary" condition

The review prompt asks to verify that "the free corpus search must remain the expected primary on all 20." This file's `expected_cards` is `[perplexity_search]`, not a free Scout/LumenLoop corpus card. The question is also a medium factual/case-study freshness question with known SDF/UNHCR sources, not a deep Stellar landscape query.

Recommendation: remove `lumenloop_request_research` from `q-pay-unhcr-aid-assist` unless the policy intentionally allows non-corpus expected primaries in this weave.

## Correctness Checks

- `lumenloop_request_research` is acceptable-only: 20 `acceptable_cards`, 0 `expected_cards`.
- Governance forbids are intact: 32 files still forbid `lumenloop_request_research`.
- No file both accepts and forbids `lumenloop_request_research`.
- `node research/golden/_meta/compile.mjs --check` compiled 391 rows with 0 drafts, 0 missing id/q/criteria, 0 should-fire-without-must-have, and 0 bad weights.
- `research/golden/_meta/CATALOG.md` was not regenerated during this review; the catalog table still reflects expected-card/service coverage rather than acceptable-card counts, so the weave should not affect catalog semantics.

## Completeness: Conservative ADD Candidates

These are not mandatory, but they are more defensible than some exact-content targets because they ask for broad synthesis, cross-source reconciliation, or thin/fast-moving ecosystem prior art.

- `q-defi-streaming-payments-prior-art` - prior-art discovery across repos, SCF submissions, and agentic-payments docs. Caveat: the file body currently says "Deep-research / metered lanes are forbidden" while `forbidden_cards` does not forbid the card; reconcile that prose before adding.
- `q-hist-partnerships-timeline-list` - hard, freshness-sensitive, multi-year enterprise/institutional partnership synthesis.
- `q-comp-stablecoin-us-eu-compare` - hard, freshness-sensitive cross-jurisdiction stablecoin regulatory comparison for Stellar assets.
- `q-defi-agentic-payment-standards-compare` - hard, fast-moving comparison across Stellar-settlement and general agent-payment standards.
- `q-defi-agent-identity-stellar-experimental` - thin, fast-moving Stellar agent-identity landscape where honest maturity assessment matters.
- `q-comp-yieldblox-oracle-incident` - hard incident reconstruction where sources disagree on loss/recovery figures and synthesis adds value.

I would not add the lane to ordinary docs comparisons, SDK/tooling choices, simple live figures, or named-project resolution cases.

## Per-File Decision Table

| id | Decision | Reason |
| --- | --- | --- |
| `q-pay-unhcr-aid-assist` | REMOVE | Medium factual/case-study freshness question; expected primary is `perplexity_search`, not a free corpus card. |
| `q-rwa-projects-tokenizing-stellar` | KEEP | Evolving RWA issuer landscape; directory primary remains free, but analyst synthesis is a legitimate escalation. |
| `q-defi-blend-alternatives` | KEEP | Competitive lending landscape and "near-single backbone" judgment can benefit from synthesis if free results are thin. |
| `q-defi-blend-content` | REMOVE | Exact named-project content lookup with a dedicated free expected lane. |
| `q-defi-bridges-content` | KEEP | Bridge/options landscape spans projects, docs, and research history; acceptable-only escalation is plausible. |
| `q-defi-comet-content` | KEEP | Topic coverage for a thin/reference weighted-AMM lane; research synthesis can add signal beyond one search. |
| `q-defi-liquid-staking-whitespace` | KEEP | Honest negative/whitespace landscape is a reasonable post-gather escalation when corpus evidence is thin. |
| `q-defi-perps-whitespace` | REMOVE | Blocked by internal corpus contradiction against `q-eco-defi-market-map`. |
| `q-defi-reflector-alternatives` | KEEP | Oracle alternatives are a real ecosystem landscape/comparison question. |
| `q-defi-reflector-content` | REMOVE | Exact named-project content/integration lookup with dedicated free lanes. |
| `q-defi-rwa-overview` | KEEP | Live RWA product landscape is exactly the card's "thorough landscape" example class. |
| `q-defi-rwa-scf-similar` | KEEP | SCF/RWA prior-art synthesis is acceptable as a bounded escalation over archive search. |
| `q-defi-soroswap-content` | REMOVE | Exact named-project content lookup with a dedicated free expected lane. |
| `q-eco-2025-defi-launches` | KEEP | Period-bounded DeFi/RWA launch roundup is multi-source and freshness-sensitive. |
| `q-eco-defi-market-map` | KEEP | Core market-map/whitespace synthesis case. |
| `q-eco-dex-saturation` | KEEP | Saturation/market-structure question, not a point lookup. |
| `q-eco-nft-marketplace-whitespace` | KEEP | Thin category maturity question; acceptable escalation is reasonable. |
| `q-builder-content-by-person` | REMOVE | Exact named-person content lookup; dedicated free entity and builder lanes suffice. |
| `q-scf-funded-similar-oracle` | KEEP | Prior-funded topic scan can require synthesis over SCF archive hits. |
| `q-scf-funded-similar-payroll` | KEEP | Prior-funded topic scan can require synthesis over SCF archive hits. |

## Counts

- BLOCKER: 1
- MAJOR: 2
- MINOR: 6 conservative ADD candidates

## Verdict

Do not ship the weave as-is. Keep the research lane on the broad landscape, market-map, RWA, bridge, whitespace, and SCF prior-art cases, but remove it from the exact content/entity lookup cases and from `q-pay-unhcr-aid-assist`. Reconcile `q-defi-perps-whitespace` before allowing any metered research signal there.
