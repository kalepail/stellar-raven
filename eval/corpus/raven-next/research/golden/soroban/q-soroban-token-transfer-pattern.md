---
id: q-soroban-token-transfer-pattern
q: "What's the correct pattern for moving SAC/SEP-41 tokens from inside a Soroban contract, and what authorization does it need?"
category: soroban
subcategory: security
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Use a typed token client (the SAC/SEP-41 interface) and call `transfer(from, to, amount)`; the `from` address's `require_auth` must be satisfied for the transfer to authorize.", weight: 5 }
  - { claim: "When the contract itself holds and sends tokens, the contract's own address is the `from`, and the contract authorizes by invoking the transfer (no external user signature needed for the contract's own balance).", weight: 4 }
should_have:
  - { claim: "Amounts are i128; validate non-negative/within-range amounts to avoid overflow/abort.", weight: 3 }
  - { claim: "Follow checks-effects-interactions discipline: update internal state before/around external token calls.", weight: 2 }
nice_to_have:
  - { claim: "Notes events (transfer) are emitted by the SAC/token for off-chain tracking.", weight: 1 }
must_avoid:
  - { claim: "Do NOT use an ERC-20 `approve`+`transferFrom` allowance dance as the required pattern (Soroban authorizes via `require_auth`, though SEP-41 does have allowance methods).", weight: 3 }
  - { claim: "Do NOT claim a contract needs an external user's signature to move its OWN token balance.", weight: 3 }
must_cite:
  - "The developers.stellar.org token / SEP-41 / SAC interface documentation."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/learn/fundamentals/contract-development/authorization
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Auth-for-transfer nuance; SAC/SEP-41 transfer(from,to,amount) requires from.require_auth(). When the contract spends its own balance, the contract address is `from` and it authorizes by invoking. 2026-06-29 differentiation: this file owns in-contract token movement + authorization; the interface/method choice (transfer vs approve/transfer_from and the absolute expiration_ledger) is owned by q-sor-sep41-transfer-vs-transferfrom."
---

## Reference answer (gospel)

To move SAC/SEP-41 tokens from a Soroban contract, get a **typed token client** for the token's
contract address (the SAC or a SEP-41 contract) and call **`transfer(from, to, amount)`**.

- The **`from` address's `require_auth` must be satisfied** for the transfer to authorize. [auth]
- **When the contract sends its own tokens**, the **contract's own address is the `from`** — the
  contract authorizes the transfer simply by **invoking it** (the host treats the calling contract as
  having authorized its own actions); **no external user signature** is needed to move the contract's
  own balance. [auth]
- **Amounts are `i128`** — validate non-negative / in-range to avoid overflow/abort. [sac]
- Follow **checks-effects-interactions** discipline: update internal state before/around the external
  token call. The SAC/token emits a **`transfer`** event for off-chain tracking.

Traps: forcing an ERC-20 `approve` + `transferFrom` allowance dance as *the* required pattern (Soroban
authorizes via `require_auth`, though SEP-41 does also expose allowance methods); or claiming a contract
needs an external user's signature to move its **own** balance.

## Why these cards (routing rationale)

Token-movement how-to → `stellar_docs_mcp`; `scout_research`/`scout_repos` acceptable.

## Edge / traps

Forcing an ERC-20 approve/transferFrom dance; claiming a contract needs a user signature to move its own balance.
