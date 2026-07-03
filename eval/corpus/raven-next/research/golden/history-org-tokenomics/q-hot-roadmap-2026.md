---
id: q-hot-roadmap-2026
q: What's on Stellar's 2026 roadmap and current product/protocol priorities, and where is the canonical up-to-date roadmap?
category: history-org-tokenomics
subcategory: roadmap
axes:
  - ecosystem-spectrum
  - edge-governance
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: weekly
expected_cards:
  - perplexity_search
acceptable_cards:
  - parallel_search
  - scout_research
forbidden_cards: []
expected_service: perplexity
should_fire: true
must_have:
  - claim: "Uses dated current sources for any claimed 2026 roadmap items or priorities."
    weight: 5
  - claim: "Identifies the canonical up-to-date source or states that there is no single canonical roadmap if the evidence supports that."
    weight: 5
  - claim: "Separates protocol-upgrade roadmap items from product/ecosystem priorities."
    weight: 4
should_have:
  - claim: "Flags that roadmap information changes and should be verified against official SDF/developer channels."
    weight: 3
  - claim: "Avoids over-committing on dates unless they come from a primary dated source."
    weight: 3
nice_to_have:
  - claim: "Mentions related current channels such as SDF blog, developer docs, protocol release notes, GitHub, or community calls when verified."
    weight: 1
must_avoid:
  - claim: "Do NOT fabricate a 2026 roadmap, protocol vote date, or product priority from stale material."
    weight: 5
  - claim: "Do NOT present a past roadmap as current without a date/staleness caveat."
    weight: 5
  - claim: "Do NOT merge unrelated ecosystem rumors into SDF's official roadmap."
    weight: 4
must_cite:
  - Dated official SDF/developer/protocol sources for roadmap claims, or reputable dated web sources if no official roadmap page exists.
must_not_use_tier: []
pass_threshold: 0.8
weight_profile: standard
sources:
  - https://stellar.org/blog/foundation-news
  - https://stellar.org/blog/foundation-news/q1-2026-execution-at-network-scale
  - https://stellar.org/blog/foundation-news/introducing-the-quantum-preparedness-plan
  - https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide
  - https://developers.stellar.org/meetings/2026/04/16
status: reviewed
authored:
  phase1: 2026-06-29
  phase2: 2026-06-29
  reviewed: 2026-06-29
confidence: medium
notes: "Snapshot 2026-06-29. VERIFIED all codenames are real, not hallucinated: Protocol 26 'Yardstick' (mainnet 2026-05-06, CAP-0077 Quorum Freeze); Protocol 27 'Zipper' (testnet 2026-06-18, mainnet vote 2026-07-08, CAP-71 auth delegation); the Quantum Preparedness Plan (published 2026-06-09); and x402 (live on Stellar mainnet, confirmed in the 2026-04-16 dev meeting). I did not find a single canonical always-current 2026 roadmap page; current official/datable sources are SDF blog/news, protocol upgrade guides, developer meetings, and GitHub/CAP release artifacts."
---

## Reference answer (gospel)

As of the 2026-06-29 snapshot, Raven should not invent a single fixed 2026 roadmap if it cannot find one. The defensible answer is that current roadmap/priorities are tracked across dated official SDF/news posts, protocol upgrade guides, developer meetings, and protocol/CAP release channels rather than one evergreen roadmap page.

Dated current signals include SDF's Q1 2026 report page, Protocol 26/Yardstick materials and developer meeting notes, Protocol 27/Zipper upgrade guide links on the SDF news index, and the June 2026 Quantum Preparedness Plan. Separate protocol work such as Protocol 26/27 and quantum-safe account/signature planning from product/ecosystem priorities such as CCTP on Stellar, regional market development, x402/agent payments, and RWA/stablecoin ecosystem work. Any future vote date or activation date must come from a dated primary source.

## Why these cards (routing rationale)

`perplexity_search` is expected because current roadmap status is freshness-sensitive. `parallel_search` and `scout_research` are acceptable for dated SDF/dev-docs corroboration.

## Edge / traps

The failure mode is false precision: copying an old roadmap, merging rumors with SDF priorities, or inventing protocol vote dates. The answer should date every roadmap claim and name the source channel.
