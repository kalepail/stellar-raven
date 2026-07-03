---
id: q-pc-quantum-preparedness-dormant
q: "Is Stellar quantum-resistant, and what is the Quantum Preparedness Plan; how is a dormant account defined and how do I know if mine qualifies?"
category: protocol-core
subcategory: protocol-security
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: "protocol-release"

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, perplexity_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States current Stellar account authentication is not simply quantum-proof by default and quantum preparedness is a protocol/planning topic.", weight: 4 }
  - { claim: "Explains the Quantum Preparedness Plan and dormant-account definition only as documented in primary Stellar/CAP sources.", weight: 5 }
  - { claim: "Tells users to determine qualification from on-chain account/signing/activity criteria specified by the plan, not guesswork.", weight: 4 }
should_have:
  - { claim: "Notes the distinction between future migration planning and current user action requirements.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT claim Stellar is fully quantum-resistant today without caveat.", weight: 5 }
  - { claim: "Do NOT invent dormant-account thresholds or deadlines.", weight: 5 }
must_cite:
  - "Primary Stellar/CAP source required for the Quantum Preparedness Plan and dormant-account criteria."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://stellar.org/blog/foundation-news/introducing-the-quantum-preparedness-plan"
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#signer"
  - "https://github.com/stellar/stellar-protocol"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "QPP is a dated SDF plan, not yet a final CAP with dormant-account thresholds. The blog describes dormant accounts qualitatively as holders unreachable for migration; it does not publish a deterministic eligibility test."
---

## Reference answer (gospel)

No, a normal Stellar account should not be described as "quantum-resistant today" without caveat. SDF's Quantum Preparedness Plan says sufficiently powerful quantum computers would break elliptic-curve cryptography, including Stellar's Ed25519, and identifies two threat classes: validator/SCP signature integrity and account takeover. Source: https://stellar.org/blog/foundation-news/introducing-the-quantum-preparedness-plan

The QPP is a staged migration plan. Stage 1 targets post-quantum signature verification in Soroban contract accounts in 2026; Stage 2 targets first-class quantum-safe signers for classic accounts in 2027; Stage 3 would deprecate Ed25519 only when quantum threat progress and ecosystem readiness justify activation. The important Stellar-specific advantage is that account identity and signing keys are separable: an account can add/weight/remove signers without changing its G-address. Sources: https://stellar.org/blog/foundation-news/introducing-the-quantum-preparedness-plan and https://developers.stellar.org/docs/learn/fundamentals/transactions/operations-and-transactions#signer

For dormant accounts, the QPP does not publish a final mechanical "qualifies if X" rule. It says a forced cutoff would disrupt a large population of dormant accounts whose holders are unreachable and would require a design choice between freezing accounts with a recovery mechanism or permanently locking them. A good answer should therefore say: check current primary QPP/CAP materials for any finalized on-chain criteria; do not invent dates, balance thresholds, or "has never sent a transaction" rules unless a later CAP or implementation defines them.

## Why these cards (routing rationale)

`stellar_docs_mcp` should be tried first for signer/account mechanics, while `scout_research` or `perplexity_search` are acceptable discovery lanes because QPP is a fresh stellar.org announcement. General web can corroborate timing, but the answer must cite SDF/CAP sources for the plan.

## Edge / traps

The trap is overclaiming: "Stellar is quantum-proof now" is false, and "your dormant account qualifies if..." is unsupported unless the answer cites a later primary spec. Another trap is assuming users must migrate to a new G-address; QPP emphasizes signer migration without changing account identity.
