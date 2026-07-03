---
id: q-protocol-19-preconditions-cap-0021
q: "What did Stellar Protocol 19 add, and how do generalized transaction preconditions / timebounds work?"
category: protocol-core
subcategory: protocol-version-history
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States Protocol 19 (activated ~2022-06-08) introduced generalized transaction preconditions via CAP-0021 (time bounds, ledger bounds, min sequence number / age / gap, extra signers).", weight: 5 }
should_have:
  - { claim: "Notes these preconditions enable patterns like payment channels and time-locked / sequence-conditioned transactions.", weight: 3 }
  - { claim: "Notes Protocol 19 also included CAP-0040 (shared/signed payloads for contracts/ed25519 signed payload signer).", weight: 2 }
nice_to_have:
  - { claim: "Notes preconditions extended the older simple timebounds concept into a richer set of conditions.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute generalized preconditions to the wrong protocol (e.g. P18 or P20) or wrong CAP (e.g. CAP-0046).", weight: 4 }
  - { claim: "Do NOT claim Protocol 19 introduced Soroban smart contracts (that was Protocol 20).", weight: 4 }
must_cite:
  - "The 'Announcing Protocol 19' material and/or CAP-0021 in stellar/stellar-protocol."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://stellar.org/blog/developers/announcing-protocol-19
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0021.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "P19 = CAP-0021 preconditions. Trap is wrong version/CAP or confusing with Soroban (P20)."
---

## Reference answer (gospel)

- **Protocol 19** (activated ~2022-06-08) introduced **generalized transaction preconditions via CAP-0021** — time bounds, ledger bounds, min sequence number / age / gap, and extra signers [1][2].
- These enable patterns like **payment channels** and **time-locked / sequence-conditioned** transactions [2].
- Protocol 19 also included **CAP-0040** (ed25519 signed-payload signer / shared signing for contracts) [1].
- Preconditions extended the older simple timebounds concept into a richer set [2]. Protocol 19 did **not** introduce Soroban (that was Protocol 20).

## Why these cards (routing rationale)

Protocol-history fact → `stellar_docs_mcp` + `scout_research`. `perplexity_search` acceptable. No deep-research.

## Edge / traps

Wrong version/CAP (it's CAP-0021/P19) or confusing P19 with Soroban (P20) are the traps.
