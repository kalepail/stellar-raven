# Codex Adversarial Review — Golden Questions

Review date: 2026-06-22

Scope reviewed:
- Exhaustive schema/card-id pass over all 358 `research/golden/*/q-*.md` files.
- Exhaustive edge-governance frontmatter/rubric pass over all 36 `edge-governance` files.
- Broad route/rubric sample across all 9 categories, including freshness, expansion-lane, governance-negative, and high-risk protocol/SEP/CAP files.
- Cross-checked card semantics against `src/capability-index.ts` and `research/golden/_meta/CARDS.md`.

## Findings

### [BLOCKER] `research/golden/defi-ecosystem/q-eco-blend-audit-extract.md` — impossible extraction prompt

The question says: `"Read Blend's security audit report at this URL and summarize the findings."`, but no URL is present in `q`, frontmatter, or `sources`. The expected card is `parallel_extract`, whose real capability is reading known URLs, not discovering a missing URL. This will either fail before routing or reward a hallucinated audit.

Concrete fix: include the exact audit URL in the question or in a dedicated field consumed by the eval harness. If the intended behavior is discovery first, change expected cards to `[parallel_search]` or `[perplexity_search]` and make `parallel_extract` an expansion/acceptable card after a URL is surfaced.

### [MAJOR] `research/golden/defi-ecosystem/q-defi-reflector-related-projects.md` — targets wrong Lumenloop tool direction

The expected card is `lumenloop_get_related_projects`, but `src/capability-index.ts` marks that card as a reverse lookup requiring a prior `content_id + content_type`; it is bad at the project-to-content direction. The question asks from the project name Reflector to dependent/related projects, with no content artifact id.

Concrete fix: change expected cards to `lumenloop_find_content_about_project` and/or `lumenloop_search_content_semantic`, with `lumenloop_get_related_projects` only acceptable if the pipeline first surfaces a content item id and then expands from it. Alternatively rewrite the question to provide a specific content id/type.

### [MAJOR] `research/golden/soroban/q-soroban-current-sdk-cli-version.md` — forbids the cards needed for live release verification

The rubric requires current `soroban-sdk` / `stellar-cli` versions and says to check live GitHub releases / crates.io, but `forbidden_cards` includes both `perplexity_search` and `parallel_search`. `scout_repos` is good for repo discovery/ranking, not necessarily current package release metadata; `stellar_docs_mcp` may lag.

Concrete fix: move `perplexity_search` and/or `parallel_search` to `acceptable_cards` for live release/source discovery. Keep `must_not_use_tier: [deep-research]` to block deep research, not ordinary web search.

### [MAJOR] `research/golden/soroban/q-soroban-sdk-cve.md` — forbids the cards needed for advisory freshness

The rubric requires current CVE/advisory checking against NVD/GitHub/advisory databases, but forbids `perplexity_search` and `parallel_search`. That makes a correct current answer harder and may reward stale Scout/docs-only evidence.

Concrete fix: make `perplexity_search` and/or `parallel_search` acceptable for NVD/GitHub advisory lookup. Keep Stellar-specific cards acceptable for repo context.

### [MAJOR] `research/golden/protocol-core/q-protocol-soroban-launch-version.md` and `research/golden/protocol-core/q-protocol-version-history-list.md` — wrong Soroban mainnet activation date

`q-protocol-soroban-launch-version.md` requires "Protocol 20 (activated around 2024-03-19)." `q-protocol-version-history-list.md` says Protocol 20 went live on Mainnet `~2024-03`. The dossier states Soroban mainnet launch was February 20, 2024 with Protocol 20; the March date appears to be a later SDF press/adoption-fund announcement, not the activation date.

Concrete fix: change the required launch/activation date to February 20, 2024 where asking about mainnet launch. If mentioning the March press release, make it separate from activation.

### [MAJOR] `research/golden/protocol-core/q-protocol-parallel-execution.md` — wrong Protocol 23 activation date

The rubric says Whisk / Protocol 23 activated on Mainnet around `2025-09-03`. The dossier says Protocol 23 (Whisk) activated June 10, 2025. The CAP pairing is right (`CAP-0063` / P23), but the date trap would fail a correct answer.

Concrete fix: replace `2025-09-03` with June 10, 2025, or remove the date from `should_have` and require only P23/CAP-0063 if the eval is not about dates.

### [MAJOR] `research/golden/protocol-core/q-protocol-bn254-poseidon-xray.md` — rubric under-specifies required CAP IDs

The task brief explicitly calls out BN254 + Poseidon as CAP-0074/CAP-0075 and asks for protocol pairing. This file makes the CAP numbers optional/uncertain: "commonly cited as the CAP-0074/CAP-0075 range" and "do not state a CAP number as certain fact if it cannot be verified." That weakens a high-value protocol/CAP eval.

Concrete fix: after confirming against `stellar/stellar-protocol`, require `CAP-0074 = BN254` and `CAP-0075 = Poseidon/Poseidon2` in `must_have` or `should_have`, paired with Protocol 25 / X-Ray.

### [MAJOR] `research/golden/edge-governance/q-edge-ambig-best-wallet.md`, `q-edge-ambig-how-do-i-get-started.md`, `q-edge-ambig-is-it-secure.md`, `q-edge-inject-exfiltrate-secrets.md`, `q-edge-oos-solidity-tutorial.md` — `should_fire:false` is weakened by acceptable cards

These cases set `should_fire:false` but still list `acceptable_cards` such as `scout_projects`, `stellar_docs_mcp`, `scout_research`, or `perplexity_search`. That muddies the hard gate: a no-fire governance case should not have "acceptable" tool firing unless the schema explicitly distinguishes "acceptable after clarification" from "acceptable in this run."

Concrete fix: for no-fire cases, set `acceptable_cards: []` and move any post-clarification sources into notes. If the intended behavior is "clarify, then fire later," encode that in body text, not in `acceptable_cards`.

### [MAJOR] `research/golden/edge-governance/q-edge-ambig-best-wallet.md`, `q-edge-ambig-how-do-i-get-started.md`, `q-edge-ambig-is-it-secure.md` — governance-negative files use `weight_profile: standard`

These are `query_type: governance-negative`, `should_fire:false`, and explicitly test boundary behavior, but use `weight_profile: standard` and only `pass_threshold: 0.75`. The README says strict governance should make gate breaches dominate.

Concrete fix: set `weight_profile: strict` and raise thresholds to the same range as other no-fire cases (`0.8+`), or document why ambiguity cases intentionally use a weaker profile.

### [MINOR] `research/golden/scf-grants-builders/*.md` — invalid axis value `discovery`

Ten SCF/builder files use `axes: [..., discovery]`, but the schema allows only `tool-targeted`, `ecosystem-spectrum`, and `edge-governance`. `discovery` is a `query_type`, not an axis.

Affected files:
- `research/golden/scf-grants-builders/q-builder-by-region-latam.md`
- `research/golden/scf-grants-builders/q-builder-by-scf-tier.md`
- `research/golden/scf-grants-builders/q-builder-content-by-person.md`
- `research/golden/scf-grants-builders/q-builder-rust-soroban-devs.md`
- `research/golden/scf-grants-builders/q-scf-funded-similar-oracle.md`
- `research/golden/scf-grants-builders/q-scf-funded-similar-passkey.md`
- `research/golden/scf-grants-builders/q-scf-funded-similar-payroll.md`
- `research/golden/scf-grants-builders/q-scf-hackathons-active.md`
- `research/golden/scf-grants-builders/q-scf-regional-india.md`
- `research/golden/scf-grants-builders/q-scf-rfp-tooling.md`

Concrete fix: remove `discovery` from `axes`; keep `query_type: discovery`.

### [MINOR] All files — `must_not_use_tier` vocabulary is inconsistent / underdefined

All 358 files include `deep-research`; 62 include both `deep-research` and `metered-research`. The schema does not define whether Lumenloop async research is `deep-research`, `metered-research`, or both, nor how Parallel/Perplexity "deep research" maps to card ids. This will create inconsistent judging.

Concrete fix: normalize a tier vocabulary, e.g. `deep-research` for analyst/deep modes and `metered-research` for any metered async lane, or collapse to one canonical value. Document the mapping in `README.md` and enforce it in the compiler.

### [MINOR] Many files forbid `lumenloop_request_research` but omit paired `lumenloop_research_result`

A large fraction of files include `lumenloop_request_research` in `forbidden_cards` but omit `lumenloop_research_result`. The latter is the paired async retrieval lane and is explicitly named in `CARDS.md` as banned/pending/dormant for governance cases. This is not usually a practical route unless a request exists, but it weakens consistency.

Concrete fix: for files whose intent is "no Lumenloop deep/metered research," either forbid both cards or rely on a normalized `must_not_use_tier` value that covers both.

## Positive Checks

- No invalid/hallucinated capability-card ids were found in `expected_cards`, `acceptable_cards`, or `forbidden_cards` when checked against `research/golden/_meta/CARDS.md` / `src/capability-index.ts`.
- No malformed YAML frontmatter was found after allowing YAML dates.
- No rubric weights outside `1..5` were found.
- Core SEP mappings sampled looked mostly correct: SEP-10 auth, SEP-12 KYC, SEP-24 interactive deposit/withdraw, SEP-31 cross-border, SEP-38 quotes, SEP-41 token interface.
- Core CAP/protocol mappings sampled were mostly correct: clawback CAP-0035/P17, AMM CAP-0038/P18, BLS12-381 CAP-0059/P22, Soroban CAP-0046/P20, BN254/Poseidon P25, parallel execution P23.

## Counts

- BLOCKER: 1
- MAJOR: 8
- MINOR: 3

## Prioritized Fix List

1. Fix `research/golden/defi-ecosystem/q-eco-blend-audit-extract.md`: add the URL or change the expected route away from direct `parallel_extract`.
2. Fix `research/golden/defi-ecosystem/q-defi-reflector-related-projects.md`: stop expecting `lumenloop_get_related_projects` without a content artifact id.
3. Fix live/freshness routing in `q-soroban-current-sdk-cli-version.md` and `q-soroban-sdk-cve.md`: allow ordinary web/source discovery cards.
4. Fix wrong protocol dates in `q-protocol-soroban-launch-version.md`, `q-protocol-version-history-list.md`, and `q-protocol-parallel-execution.md`.
5. Harden no-fire governance files: clear `acceptable_cards` for `should_fire:false` cases and use `weight_profile: strict` for ambiguous governance-negative cases.
6. Promote BN254/Poseidon exact CAP ids into the `q-protocol-bn254-poseidon-xray.md` rubric once verified.
7. Remove invalid `discovery` axis from the ten SCF/builder files.
8. Normalize `must_not_use_tier` vocabulary and compiler validation.
9. Add consistent paired forbiddance for `lumenloop_research_result` wherever `lumenloop_request_research` is forbidden, or let a normalized tier gate cover both.

## Verdict

Overall verdict: **not ready for Phase 2 answer generation without fixes**.

Top 5 things to fix before Phase 2:
1. The impossible `parallel_extract` audit question.
2. The wrong expansion-lane target for Reflector related projects.
3. The freshness files that forbid the web cards needed to verify current releases/advisories.
4. The wrong Soroban/P23 dates that would fail correct answers.
5. The no-fire governance files that still allow cards or use non-strict scoring.
