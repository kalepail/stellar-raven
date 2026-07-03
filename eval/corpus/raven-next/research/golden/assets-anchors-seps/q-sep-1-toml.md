---
id: q-sep-1-toml
q: "What is SEP-1 and where is the stellar.toml file served?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "SEP-1 defines the stellar.toml (Stellar Info File) used to publish an org's Stellar metadata and endpoints.", weight: 5 }
  - { claim: "It is served at https://<domain>/.well-known/stellar.toml.", weight: 3 }
should_have:
  - { claim: "It is the discovery layer wallets use to find an anchor's SEP endpoints, currencies, and signing keys.", weight: 3 }
nice_to_have:
  - { claim: "Notes it can declare validators, principals, and an approval_server (for SEP-8).", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the info-file standard (it is SEP-1, not SEP-2/SEP-10).", weight: 4 }
  - { claim: "Do NOT claim stellar.toml lives on-chain rather than at a web .well-known path.", weight: 2 }
must_cite:
  - "SEP-0001 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §7.1, Q11. SEP-1 'Stellar Info File', Status Active (ecosystem README)."
---

## Reference answer (gospel)

- **SEP-1 (Active)** defines the **`stellar.toml`** (Stellar Info File): a TOML document where an organization publishes its Stellar metadata — anchor SEP endpoints, declared `[[CURRENCIES]]`, signing/account keys, validators, and org info [1].
- It is served off-chain at **`https://<DOMAIN>/.well-known/stellar.toml`** (with CORS enabled) [1].
- It is the **discovery layer**: wallets fetch it to find an anchor's SEP-6/10/12/24/31/38 endpoints and verify assets; it can also declare an `approval_server` (SEP-8) per currency [1].

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo. No general-web/deep-research for a single-SEP fact.

## Edge / traps

Misnumbering the info-file standard (it is SEP-1) or claiming `stellar.toml` lives on-chain rather than at the web `.well-known` path.
