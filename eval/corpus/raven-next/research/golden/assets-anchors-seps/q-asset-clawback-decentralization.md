---
id: q-asset-clawback-decentralization
q: "If an asset issuer enables clawback, what does that mean for the asset's censorship-resistance, and why does Stellar support it anyway?"
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "An asset whose issuer can clawback is, by design, not censorship-resistant — the issuer can burn holders' balances.", weight: 5 }
  - { claim: "Stellar supports clawback to make the network viable for regulated assets/securities where actual asset removal (not just freezing) is required.", weight: 4 }
should_have:
  - { claim: "This is a deliberate trade-off: regulatory compliance vs. decentralization/trust-minimization.", weight: 3 }
  - { claim: "Clawback is opt-in (requires AUTH_CLAWBACK_ENABLED + AUTH_REVOCABLE); a holder can inspect the flags before trusting the asset.", weight: 2 }
nice_to_have:
  - { claim: "Notes XLM (native) is not clawback-able; this applies to issued assets.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim clawback makes the asset more decentralized or trustless.", weight: 4 }
  - { claim: "Do NOT claim every Stellar asset is clawback-able regardless of issuer flags.", weight: 3 }
must_cite:
  - "The clawback page on developers.stellar.org or CAP-0035."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/clawbacks
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Design-tension comparison. Dossier §8.2(2). Verified: clawback = CAP-0035 'Asset Clawback' (Final), activated at protocol 17; requires AUTH_CLAWBACK_ENABLED_FLAG (which itself requires AUTH_REVOCABLE_FLAG)."
---

## Reference answer (gospel)

An asset whose issuer has enabled clawback is, **by design, not censorship-resistant**: the issuer
can use `ClawbackOp` to **burn a holder's balance back to itself** without the holder's consent [1].
Stellar supports this deliberately so the network is viable for **regulated assets / securities**,
where law (e.g. court orders, sanctions, error correction) requires the ability to actually **remove**
assets, not merely freeze them — this was the rationale of **CAP-0035 "Asset Clawback" (Final),
activated at protocol 17** [1][2]. It is a conscious **compliance-vs-decentralization trade-off**,
and it is **opt-in**: clawback only applies to issued assets whose issuer set
`AUTH_CLAWBACK_ENABLED_FLAG` (which itself requires `AUTH_REVOCABLE_FLAG`) **before** the trustline
opened, so a holder can **inspect the issuer's flags before trusting the asset** [1][2]. Native
**XLM is never clawback-able** — this is purely an issued-asset feature. Clawback does **not** make
an asset more decentralized or trustless, and it does **not** apply to every Stellar asset.

Sources: [1] developers.stellar.org Clawbacks guide; [2] stellar-protocol `core/cap-0035.md`
(Asset Clawback, Final, protocol 17).

## Why these cards (routing rationale)

Protocol design trade-off → `stellar_docs_mcp`.

## Edge / traps

Spinning clawback as 'decentralizing' or claiming it is universal across all assets.
