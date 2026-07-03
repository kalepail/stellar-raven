---
id: q-pc-l2-payment-channels-starlight
q: "What state/payment-channel and Layer-2 options exist on Stellar, such as Starlight, CAP-21/CAP-40, commit-chains, or rollups; how does Starlight compare to Lightning and is it live?"
category: protocol-core
subcategory: l2-payment-channels
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: true
freshness_horizon: "yearly"

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains Starlight/payment channels as off-chain or Layer-2 style work rather than core public-network default behavior.", weight: 4 }
  - { claim: "States current live/production status must be verified and should not be assumed from old research posts.", weight: 5 }
  - { claim: "Compares to Lightning in terms of payment-channel goals while noting Stellar-specific protocol/account differences.", weight: 3 }
  - { claim: "Mentions relevant CAPs or proposals only with their actual status.", weight: 4 }
should_have:
  - { claim: "Separates research/prototype/proposal status from deployed ecosystem products.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim Starlight is live mainnet infrastructure without current evidence.", weight: 5 }
  - { claim: "Do NOT imply Stellar uses Bitcoin Lightning unchanged.", weight: 4 }
must_cite:
  - "Dated source required for current L2/Starlight live status."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/experiment-with-payment-channels-on-stellar
  - https://github.com/stellar/starlight
  - https://github.com/stellar-deprecated/starlight
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0040.md
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Current status is freshness-sensitive. Phase 3 verified that github.com/stellar/starlight redirects to archived github.com/stellar-deprecated/starlight (pushed 2024-03-04); no primary evidence found that Starlight is live production infrastructure as of 2026-06-29."
---

## Reference answer (gospel)

Stellar has had payment-channel research and protocol support primitives, but Starlight should be described as experimental/prototype work unless a fresh primary source proves otherwise. SDF's "Experiment with Payment Channels on Stellar" presented Starlight as a payment-channel experiment: like Lightning, the goal is to let parties exchange many off-chain updates and settle final state on-chain, but it is designed around Stellar accounts/transactions rather than Bitcoin's UTXO/HTLC stack [1]. The current GitHub repository is archived under `stellar-deprecated/starlight`, which supports "not live production infrastructure" for the 2026-06-29 snapshot [2]. CAP-0021 added generalized transaction preconditions, including relative time/sequence conditions, explicitly motivated by payment channels [4]. CAP-0040 added signed-payload signers to simplify multi-party contract/payment-channel signature exchange [5]. Rollups/commit-chains are separate architectures and should not be claimed as deployed Stellar defaults without current project-specific sources.

## Why these cards (routing rationale)

`stellar_docs_mcp` is useful for protocol primitives, but this question is freshness-sensitive and should also allow `scout_research`, `perplexity_search`, or `parallel_search` to check whether any Starlight/L2 project is currently live.

## Edge / traps

Do not claim Starlight is live production infrastructure because an old SDF blog or repo exists. Do not import Bitcoin Lightning details unchanged; Stellar payment channels use Stellar transaction preconditions, account/signature semantics, and CAP-specific primitives.
