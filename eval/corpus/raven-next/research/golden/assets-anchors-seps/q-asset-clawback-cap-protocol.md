---
id: q-asset-clawback-cap-protocol
q: "When did clawback land on Stellar, which CAP introduced it, and what operations did it add?"
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Identifies CAP-35 as the proposal that introduced clawback.", weight: 5 }
  - { claim: "States clawback activated at protocol 17.", weight: 4 }
should_have:
  - { claim: "Lists the added operations: ClawbackOp, ClawbackClaimableBalanceOp, and SetTrustLineFlagsOp.", weight: 3 }
  - { claim: "Notes the motivation is regulated/securities compliance (burn, not just freeze, a balance).", weight: 2 }
nice_to_have:
  - { claim: "Mentions the issuer must have set AUTH_CLAWBACK_ENABLED (and AUTH_REVOCABLE) for an asset to be clawback-eligible.", weight: 1 }
must_avoid:
  - { claim: "Do NOT cite the wrong CAP number (e.g. CAP-21, CAP-46) for clawback.", weight: 5 }
  - { claim: "Do NOT state clawback shipped in a wrong protocol version (e.g. protocol 19/20/Soroban).", weight: 4 }
must_cite:
  - "CAP-0035 on the stellar-protocol GitHub repo, or the clawback page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
  - https://stellar.org/blog/developers/using-protocol-17s-asset-clawback
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Multi-hop factual. Dossier §1.4. Verified: core/README lists CAP-0035 = protocol 17, Final; activated on mainnet 2021-06-01. Trap: wrong CAP/protocol number."
---

## Reference answer (gospel)

- Clawback was introduced by **CAP-0035 ("Asset Clawback", Final)** and activated at **Protocol 17**, which went live on Stellar mainnet on **June 1, 2021** [1][2].
- It added the operations **`ClawbackOp`** (burn a specific amount from a holder's trustline back to the issuer), **`ClawbackClaimableBalanceOp`** (destroy a whole clawback-enabled claimable balance), and **`SetTrustLineFlagsOp`** (manage per-trustline flags; replaces the legacy `AllowTrustOp`) [1][2].
- Motivation: regulated/securities use cases that require **burning, not just freezing**, a balance (recover fraudulent/stolen value, satisfy regulators) [1].
- An asset is clawback-eligible only if its issuer set **`AUTH_CLAWBACK_ENABLED_FLAG`** (which in turn requires **`AUTH_REVOCABLE_FLAG`**) before the holder's trustline was created [2]. XLM/native is never clawback-able.

## Why these cards (routing rationale)

Protocol/CAP fact → `stellar_docs_mcp` + the CAP repo; `scout_research` acceptable.

## Edge / traps

Misnumbering the CAP or the protocol version. Clawback is **CAP-35 at Protocol 17 (June 2021)** — not CAP-21/CAP-46 and not a Soroban-era (P20) feature.
