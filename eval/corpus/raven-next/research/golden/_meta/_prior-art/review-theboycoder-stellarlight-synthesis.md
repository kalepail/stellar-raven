# Synthesis: theboycoder StellarLight data-layer golden intake

Date: 2026-06-25

Source gist: https://gist.github.com/theboycoder/9aba5b80f3a3534323211e30562d4ab7

Inputs:

- Intake brief: `_incoming/2026-06-25-theboycoder-stellarlight-data-layer-intake.md`
- Independent overlap review: `review-theboycoder-stellarlight-overlap.md`
- Independent adversarial review: `review-theboycoder-stellarlight-adversarial.md`
- Coordinator live grounding spot-checks against Scout/StellarLight APIs and existing golden files.

The planned grounding sub-agent did not produce `review-theboycoder-stellarlight-grounding.md`.
That missing artifact is a process limitation of the initial intake. The recommendations below were
therefore limited to candidates that the coordinator could spot-check against live Scout/StellarLight
APIs and existing golden files. After user approval on 2026-06-25, the four strongest ADOPT
recommendations were implemented as golden questions and two stale RFP questions were refreshed.

## Executive Verdict

The gist is useful as **StellarLight data-layer prior art**, not as directly importable Raven
goldens. Its biggest influence is policy-level: it highlights a useful class of live ecosystem-data
questions, but many cases are cf-flue adapter tests that hard-code `answerRegex`, exact `repoScore`
values, internal Scout/StellarLight rank/count snapshots, or "must query StellarLight" language.

Recommended immediate impact:

- **Author now, after normal Phase-2 grounding:** 4 new/reframed candidates.
- **Do not add because already covered:** 7 candidates.
- **Defer to rolling freshness or capability work:** 8 candidates.
- **Reject as adapter/count tests:** 3 candidates.

## Reconciled Table

| gist_id | verdict | existing_coverage | grounding_status | recommended_raven_category | expected_cards | rubric_notes | reasoning |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sl-priorart-lending-scf-flagships` | ADOPT | Partial: Blend/lending and individual SCF history exist, but not a multi-protocol funded-lending map. | Partly grounded: Scout project search returns Blend, Slender, DeFindex as live SCF-awarded; Orbit naming is fuzzy (`Orbit Finance` showed unfunded, while OrbitCDP appears in research/audit records). | `defi-ecosystem` or `scf-grants-builders` | expected `scout_projects`; acceptable `scout_research`, `lumenloop_find_similar_scf_submissions`, `lumenloop_get_scf_submissions` | Gate on "lending is not greenfield", Blend as a core primitive, and at least two SCF-funded Stellar lending/vault/CDP projects with sources. Do not hard-gate exact SCF dollar amounts or require OrbitCDP until re-verified. | This is the strongest additive builder-prior-art question. It combines saturation, named protocols, and funding evidence in a way existing questions only cover in fragments. |
| `sl-priorart-oracle-reflector-leader` | COVERED | Strong: Reflector/oracle alternatives and defensive oracle consumption are already represented. | Grounded enough for current files: Scout research surfaces SEP-40, Reflector, Band audits/docs, and Reflector materials. Hidden "prominence 90" and exact grant amounts are not Raven-grade facts. |  |  | No new golden. If current files are touched later, keep "Reflector is leading but not the only oracle" and avoid hidden-rank gates. | Existing coverage already captures the important user behavior and trap. |
| `sl-priorart-rwa-treasuries-not-scf` | COVERED | Strong: RWA issuer discovery and institutional-vs-SCF distinction already exist. | Partly grounded: Scout projects returned Ondo and WisdomTree as unfunded; existing goldens already cite Franklin/BENJI, WisdomTree, Ondo, Spiko/Figure-style issuer facts. |  |  | No new golden. Consider checking current RWA issuer lists during freshness maintenance. | The misconception test is good, but it is already in the battery. |
| `sl-code-passkey-wallet-top-repo` | COVERED | Strong passkey/smart-wallet repo and SDK discovery coverage exists. | Live repo search contradicts static "top" framing: `typescript-wallet-sdk` appears with repoScore 56, but other wallet repos now score higher for broad passkey/wallet queries. |  |  | Do not add a static "highest repoScore" golden. Existing questions should continue to reward current repo evidence and cited library guidance. | The gist's exact rank is too brittle and no longer cleanly true under a broad query. |
| `sl-code-zk-xray-games-top` | DEFER_FRESHNESS | Partial: ZK primitives and ZK repo discovery exist; top ZK game repo plus hackathon provenance is not directly covered. | Partly grounded but brittle: repo search returns `xray-games` score 84 and `Zk-Seep` score 70; hackathon detail returns ZK Gaming winners but without placement fields and does not prove the gist's placement/order. | `soroban` or `tooling-infra` rolling freshness | expected `scout_repos`; acceptable `scout_hackathons`, `scout_hackathon_detail`, `stellar_docs_mcp` | If adopted, ask for current high-signal ZK Soroban repos and any hackathon provenance, with an as-of date. Do not require exact #1/#2 score ordering or winner placement unless a durable source proves it. | Useful shape, but rank and hackathon claims are live/database-sensitive. |
| `sl-code-soroban-oracle-least-bad` | DEFER_FRESHNESS | Partial: oracle projects/design covered; repo-quality triage is not. | Grounded as a snapshot: repo search returns the low-score oracle repos and higher `lightecho-stellar-oracle`; it also returns `reflector-contract` with a higher score, which weakens the gist's "better alternative" framing. | `tooling-infra` rolling freshness | expected `scout_repos`; acceptable `scout_projects`, `scout_research` | Reframe as "which oracle repos are worth studying and what maturity caveats apply?" Require dated repo evidence, not fixed score ordering or "least bad" wording. | This is a live repo-ranking case, not a static golden. |
| `sl-hackathon-blend-winners` | DEFER_FRESHNESS | Partial: single hackathon detail is already tested for another event. | Weakly grounded: detail endpoint returns Blend winner names, but no placement fields; returned order is not enough to prove 1st/2nd/3rd. | `scf-grants-builders` after capability/source check | expected `scout_hackathon_detail`; acceptable `scout_hackathons`, `parallel_search` | Do not adopt until placements are source-backed. A safe rubric could ask for the winning projects and what they built, with placements as nice-to-have. | Useful as another event fixture, but the current accessible evidence is too thin for exact placement gates. |
| `sl-hackathon-kale-reflector-1st` | REJECT | Single-event lookup pattern is covered. | Contradicted/unsupported by accessible detail: detail endpoint lists `xbid.ai` but no place field; returned order places it eighth, so the "1st place" claim is not proven by the available Scout detail surface. |  |  | Do not import as-is. Reconsider only if a durable source confirms placement. | The gist's exact first-place assertion is not safely grounded by the current data returned to Raven. |
| `sl-hackathon-kale-vs-blend-counts` | REJECT | Related single-detail coverage exists; compare-intent is not currently positive coverage. | Not fair: `scout_hackathon_compare` is dormant and current list/detail probes did not expose the exact submission/winner counts in a stable shape. |  |  | Do not add until a compare-pair driver is runtime-ready and the surface emits citable counts. | This is a cf-flue comparison-count adapter test. |
| `sl-funding-open-rfps-q2-2026` | DEFER_FRESHNESS | Strong current/open-RFP coverage already exists. | Grounded as of 2026-06-25: `/api/rfps` returns five open Q2 2026 RFPs with the gist titles, plus nine closed Q1 2026 RFPs. | rolling freshness, `scf-grants-builders` | expected `scout_rfps`; acceptable `scout_research` | Keep in rolling freshness only. Reward current status, cited as-of date, and refusal to list closed RFPs as open. Do not hard-code this set into the stable battery. | Correct today, but will age quickly. |
| `sl-funding-smart-account-passkey-rfps` | DEFER_FRESHNESS | Passkey/smart-account and RFP coverage exists. | Grounded as of 2026-06-25: open RFP titles include `Passkey UI Kit` and `OZ Accounts Policy Builder`; descriptions were not in the compact list response. | rolling freshness, `scf-grants-builders` | expected `scout_rfps`; acceptable `scout_research` | Rolling case only. Gate on identifying current matching open briefs and distinguishing frontend passkey UX from policy/account tooling when source text supports it. | Useful but time-sensitive. |
| `sl-funding-hummingbot-kelp-closed` | ADOPT | Partial: RFP open/current mechanics exist; closed market-making/Kelp history does not. | Grounded as of 2026-06-25: `/api/rfps` returns `Hummingbot Integration (Trading Engine)` as closed, q1-2026, category `defi`. Kelp framing needs source-text confirmation before authoring. | `scf-grants-builders` | expected `scout_rfps`; acceptable `scout_research`, `lumenloop_search_content_semantic` | Gate on title, closed status, and no-longer-fundable behavior. Make same-round list nice-to-have; verify Kelp-deprecation wording from a source before making it `must_have`. | Stable closed-RFP history is a fair Raven evidence question. |
| `sl-ecosystem-crowded-vs-underbuilt-category` | COVERED | Strong category/market-map saturation coverage exists. | Grounded as a snapshot: analyze categories returned User-Facing App 202, Tooling 109, Infrastructure 106, Protocol/Contract 78, Asset 3, Partner Integration 1, Anchor 1. Counts differ slightly from gist (204 vs 202) already. |  |  | No new stable golden. Existing whitespace/saturation questions should use dated/tolerant counts. | The concept is covered and exact counts are already drifting. |
| `sl-ecosystem-highest-scf-funded-ratio-category` | ADOPT | Partial: category funding distribution exists, but ratio-vs-absolute distinction is not clearly tested. | Grounded as of 2026-06-25: Protocol/Contract 47/78 (~60%) is highest among major categories; User-Facing App has higher absolute funded count (110/202). | `scf-grants-builders` | expected `scout_analyze`; acceptable `scout_clusters`, `scout_research` | Gate on ratio reasoning and explicit distinction from absolute count. Use dated/tolerant counts; exact numbers should be nice-to-have. | This is a genuinely additive analytics-reasoning trap. |
| `sl-ecosystem-asset-rwa-underbuilt-unfunded` | REJECT | RWA project discovery and category/funding questions already exist. | Grounded only as a Scout category snapshot: Asset has 3 projects and 0 SCF-funded, but current category taxonomy also includes Partner Integration; RWA/tooling coverage elsewhere complicates "RWA is unfunded" phrasing. |  |  | Do not add as stated. It risks conflating "Asset category" with the broader RWA ecosystem. | Too taxonomy-dependent and likely misleading outside the Scout category schema. |
| `sl-builders-pedro-hackathon-winner` | REFRAME | Builder lookup and hackathon lookup exist separately. | Grounded through builder bio: Pedro profile says he won "Wonderfully Written"; no independent hackathon source was checked. | `scf-grants-builders` | expected `scout_builders`; acceptable `scout_hackathons`, `parallel_search` | If adopted, grade "find a builder profile that claims/records a hackathon win" and distinguish won vs participated. Treat the self-profile as evidence with confidence caveat unless independently confirmed. | Useful recruiting shape, but not strong enough as a hard historical fact without another source. |
| `sl-builders-kenya-location` | COVERED | Regional builder-discovery behavior is already covered. | Grounded as of 2026-06-25: builder search returns Samuel Ogera / Matxchange and Asman Malika / Chama Trust Wallet. Exact count is live-directory data. |  |  | No new golden. Existing regional builder questions can cover this behavior. | Different geography, same capability. |
| `sl-builders-kale-pau-koh-top-kale` | REFRAME | Partial: builder lookup exists, but KALE-specific niche lookup is not represented. | Grounded as of 2026-06-25: builder search returns Pau Koh / Klorenn and Top Kale project. Exact one-match claim is live-directory fragile. | `scf-grants-builders` | expected `scout_builders`; acceptable `scout_projects`, `scout_repos` | Candidate if we want a niche-term no-empty-result fixture. Gate on at least one sourced KALE-related builder/project and avoid exact-count hard gates. | Modestly additive, but lower priority than lending, RFP history, ratio, and auth audit. |
| `sl-research-x402-stellar-live` | COVERED | Strong x402/agentic-payment cluster already exists. | Grounded in existing goldens and official docs; gist's provider-specific "must surface StellarLight dev-docs record" should not be copied. |  |  | No new golden. Keep existing x402 freshness notes. | Current battery already covers live/not-theoretical status, auth-entry signing, wallet/facilitator support, and project discovery. |
| `sl-research-soroban-auth-recursion-dos` | ADOPT | Partial: broad Soroban security and reentrancy questions exist, but not this exact audit nuance. | Strongly grounded: Scout research surfaces Veridise Stellar Soroban Core reports and the `Denial of Service During Authorization` / `require_auth_enforcing()` finding with Critical severity and "Why Invalid" rationale. | `soroban` | expected `scout_research`; acceptable `stellar_docs_mcp`, `parallel_extract` | Gate on the audit source, auth-recursion/DoS finding, Critical severity, and the fact that it was investigated/invalid or not an exploitable live reentrancy hole. | Strong additive evidence-quality/security question. |
| `sl-research-sep41-soroban-token-draft` | COVERED | Strong: `q-sep-41-token-interface` already covers title, status, SAC relationship, and traps. | Grounded: Scout research returns SEP-0041 "Soroban Token Interface", Status Draft, version 0.4.1. |  |  | No new golden. Existing question already does this. | Fully represented in current battery. |

## Adoption Set

Implemented on 2026-06-25 after follow-up approval:

1. `sl-priorart-lending-scf-flagships` as a reframed prior-art/funding map.
2. `sl-funding-hummingbot-kelp-closed` as a closed-RFP history/fundability question.
3. `sl-ecosystem-highest-scf-funded-ratio-category` as a dated analytics ratio-vs-absolute trap.
4. `sl-research-soroban-auth-recursion-dos` as a Veridise audit nuance question.

Files added:

- `research/golden/defi-ecosystem/q-defi-lending-scf-flagships.md`
- `research/golden/scf-grants-builders/q-scf-hummingbot-kelp-closed-rfp.md`
- `research/golden/scf-grants-builders/q-scf-category-funded-ratio.md`
- `research/golden/soroban/q-soroban-auth-recursion-dos-audit.md`

Existing RFP freshness questions refreshed with the June 25, 2026 live feed:

- `research/golden/scf-grants-builders/q-scf-open-rfps.md`
- `research/golden/scf-grants-builders/q-scf-rfp-tooling.md`

Lower-priority optional reframes:

- `sl-builders-kale-pau-koh-top-kale` if the battery needs a niche builder-directory no-empty-result case.
- `sl-builders-pedro-hackathon-winner` if an independent source confirms the win.

## Do Not Import As Static Goldens

These are useful as live-data inspiration but should not be stable golden questions:

- repoScore/rank cases: passkey top repo, ZK top-two, oracle "least bad";
- current-open RFP cases;
- exact category counts;
- exact hackathon comparison counts.

If Raven gets a rolling freshness lane, some can come back with `freshness_sensitive: true`, dated
source expectations, and tolerant rubrics.

## Capability Follow-Ups

The gist also exposes fair-test prerequisites:

- Named hackathon lookup is still weak: `scout_hackathons` discovers a catalog, and
  `scout_hackathon_detail` expands a slug, but exact placement/count evidence is not consistently
  present in the visible response.
- `scout_hackathon_compare` remains dormant; do not add comparison goldens until a pair-driver exists.
- Builder location and category/SCF filters should not be hard-gated as exact counts unless the cards
  send explicit parameters and the returned evidence exposes the effective filter.
- RepoScore-driven questions belong in a rolling snapshot/freshness bucket, not the stable battery.

## Policy Decision

For future data-layer prior art:

- Keep the user question shape when it is realistic.
- Drop provider-verification language (`toolsAll`, `answerRegex`, "proves a real StellarLight query").
- Convert hidden/ranking/count assertions into source-backed, dated, freshness-sensitive criteria.
- Prefer durable historical facts (closed RFPs, audit reports, standards) for the stable set.
- Use live opportunity/ranking/count questions only in a separately reported freshness set.
