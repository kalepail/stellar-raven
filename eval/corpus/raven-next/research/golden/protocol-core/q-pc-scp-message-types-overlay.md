---
id: q-pc-scp-message-types-overlay
q: "What are the actual SCP consensus message types and overlay or peer wire format, and where is the canonical XDR?"
category: protocol-core
subcategory: scp-wire-protocol
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
  - { claim: "Names the SCP ballot/nomination message families at a high level: nomination, prepare, confirm, externalize.", weight: 5 }
  - { claim: "Points to stellar-core/Stellar XDR as the canonical definition of SCPEnvelope/SCPStatement and overlay messages.", weight: 5 }
  - { claim: "Distinguishes consensus message contents from higher-level quorum-slice explanations.", weight: 3 }
should_have:
  - { claim: "Mentions that exact wire serialization is XDR and implementation-specific networking lives in stellar-core.", weight: 3 }
nice_to_have:
  []
must_avoid:
  - { claim: "Do NOT invent JSON/RPC message names as canonical SCP wire format.", weight: 5 }
  - { claim: "Do NOT reduce SCP to only quorum slices without message-level detail.", weight: 4 }
must_cite:
  - "Canonical stellar-core or stellar-xdr source required."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - "https://github.com/stellar/stellar-xdr/blob/main/Stellar-SCP.x"
  - "https://github.com/stellar/stellar-xdr/blob/main/Stellar-overlay.x"
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against stellar-xdr main on 2026-06-29; Phase 3 may pin to a commit SHA if immutable source locking is desired."
---

## Reference answer (gospel)

The canonical SCP message families are in Stellar XDR, not in a JSON/RPC schema. `Stellar-SCP.x` defines `SCPStatementType` as `SCP_ST_PREPARE`, `SCP_ST_CONFIRM`, `SCP_ST_EXTERNALIZE`, and `SCP_ST_NOMINATE`, then wraps an `SCPStatement` plus `Signature` inside `SCPEnvelope`. The nomination payload is `SCPNomination`; the ballot protocol payloads are prepare/confirm/externalize variants over `SCPBallot`. Source: https://github.com/stellar/stellar-xdr/blob/main/Stellar-SCP.x

Overlay peer messages are separately defined in `Stellar-overlay.x` as `StellarMessage` variants such as `ERROR_MSG`, `HELLO`, `AUTH`, `DONT_HAVE`, and the SCP-carrying variants used by stellar-core's peer network. A complete wire-format answer should point to XDR plus stellar-core implementation behavior; a high-level SCP explanation alone is not enough. Source: https://github.com/stellar/stellar-xdr/blob/main/Stellar-overlay.x

The developer docs are useful for the conceptual model: SCP has nomination and ballot protocols, and nodes vote/accept/confirm statements before externalizing a ledger value. Source: https://developers.stellar.org/docs/learn/fundamentals/stellar-consensus-protocol

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire to locate SCP concepts and primary XDR references. `scout_research` can help discover the same sources, but the final answer needs GitHub/XDR links because the question asks for actual message types and wire format.

## Edge / traps

Do not invent canonical JSON fields, RPC methods, or "proposal/prevote/precommit" names from other BFT systems. Do not stop at quorum-slice theory; this question asks for the message-level XDR names.
