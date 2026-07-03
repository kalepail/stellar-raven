---
id: q-sor-sep41-transfer-vs-transferfrom
q: "Can I treat classic assets, the SAC, and custom SEP-41 tokens uniformly at the contract level — when do I use `transfer` vs `transfer_from`/`approve`, and what's the `expiration_ledger` on approve?"
category: soroban
subcategory: sac-token-interop
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States that contracts can treat SACs and custom contract tokens uniformly only through the SEP-41 token interface, while SACs preserve classic-asset trustline/issuer semantics underneath.", weight: 5 }
  - { claim: "Explains `transfer(from, to, amount)` moves funds with authorization from `from`.", weight: 4 }
  - { claim: "Explains `approve(from, spender, amount, expiration_ledger)` creates a ledger-bounded allowance and `transfer_from(spender, from, to, amount)` spends that allowance with spender authorization.", weight: 5 }
  - { claim: "Explains that `expiration_ledger` is an absolute ledger sequence after which the allowance is not usable; it is not seconds, TTL, or a relative duration.", weight: 5 }
  - { claim: "Mentions that SAC transfers involving `Address::Account` still require classic trustline/account constraints and auth flags; custom SEP-41 tokens may implement different internal policy.", weight: 4 }
should_have:
  - { claim: "Mentions using the SDK token client for the SEP-41 surface and SAC-specific client only for extra SAC/admin functions.", weight: 2 }
nice_to_have:
  - { claim: "Warns to set allowance to zero or let it expire when no longer needed.", weight: 1 }
must_avoid:
  - { claim: "Do NOT equate `approve` expiration with storage TTL extension.", weight: 5 }
  - { claim: "Do NOT ignore trustline existence/authorization for SAC `Address::Account` balances.", weight: 5 }
  - { claim: "Do NOT import ERC-20 `msg.sender` semantics without mapping to Soroban `Address` authorization.", weight: 4 }
must_cite:
  - "SEP-41 token interface."
  - "Official SAC docs/token guide."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md
  - https://developers.stellar.org/docs/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/build/guides/tokens/stellar-asset-contract
  - https://developers.stellar.org/docs/tokens/anatomy-of-an-asset
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: ""
---

## Reference answer (gospel)

At the contract level, use the SEP-41 interface when you want to treat SACs and custom contract tokens uniformly. The SAC is still special underneath: for `Address::Account`, it touches the classic account/trustline balance and respects issuer/trustline authorization flags; for `Address::Contract`, balances live in contract data. Custom SEP-41 tokens can implement the same method names with custom policy.

Use `transfer(from, to, amount)` when `from` authorizes the movement directly. Use `approve(from, spender, amount, expiration_ledger)` when `from` wants to grant an allowance, then `transfer_from(spender, from, to, amount)` when the spender spends that allowance. The spender authorization is separate from the owner's earlier approval.

`expiration_ledger` is an absolute ledger sequence after which the allowance is unusable. It is not seconds, not a relative duration, and not storage TTL. Amounts are integer base units; use `decimals()` only for UI/display conversion.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire because SEP-41 and SAC docs are official protocol/developer docs. Repo search is useful only to inspect examples or library clients.

## Edge / traps

The common trap is saying "SAC is just ERC-20". The SEP-41 surface is ERC-20-like, but Soroban authorization and SAC trustline behavior differ. Another trap is treating allowance expiration as archival TTL; they are separate concepts.
