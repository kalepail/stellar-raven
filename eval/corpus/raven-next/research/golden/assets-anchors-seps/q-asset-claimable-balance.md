---
id: q-asset-claimable-balance
q: "What is a claimable balance on Stellar and when would you use one instead of a direct payment?"
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "A claimable balance is a ledger entry that holds an amount until a designated claimant claims it (conditional/deferred transfer).", weight: 5 }
  - { claim: "Useful when the recipient has no trustline yet or for escrow/predicate-gated payouts.", weight: 3 }
should_have:
  - { claim: "Created via CreateClaimableBalance and claimed via ClaimClaimableBalance, with optional claim predicates (e.g. time bounds).", weight: 3 }
nice_to_have:
  - { claim: "Notes a claimable balance entry holds a base reserve until claimed.", weight: 1 }
must_avoid:
  - { claim: "Do NOT describe a claimable balance as a smart contract escrow that requires Soroban.", weight: 3 }
  - { claim: "Do NOT claim it bypasses the recipient's need to eventually establish a trustline before claiming a non-native asset.", weight: 2 }
must_cite:
  - "A claimable-balances page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/claimable-balances
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: high
notes: "Classic asset primitive from §8.1 table. Verified: native ledger entry created via CreateClaimableBalance, claimed via ClaimClaimableBalance, with claim predicates; entry holds a base reserve. Source URL normalized from the stale learn/encyclopedia path (now a 301 redirect) to build/guides/transactions/claimable-balances, confirmed live 2026-06-29."
---

## Reference answer (gospel)

A **claimable balance** is a native ledger entry that **sets aside an amount of an asset for one or
more designated claimants to claim later**, rather than sending it directly to an account. It is
created with the **`CreateClaimableBalance`** operation and redeemed with **`ClaimClaimableBalance`**
[1]. Each claimant can carry a **claim predicate** — e.g. time bounds (claimable after/before a
date), or unconditional — letting you express conditional/deferred transfers and simple escrow-like
payouts **without any smart contract / Soroban** [1].

Use it instead of a direct payment when **the recipient can't accept the payment yet** — most
commonly when they **have not established a trustline** to a non-native asset, or for
**predicate-gated / time-locked payouts** and airdrops where the sender wants to commit funds now
and let the recipient claim on their own terms [1]. The entry **holds a base reserve** (sponsored
by the creator) until claimed. Note: it is a **native protocol feature, not a Soroban escrow
contract**, and for a **non-native** asset the claimant must still have (or establish) a trustline
to that asset to claim it.

Source: [1] developers.stellar.org Claimable Balances docs.

## Why these cards (routing rationale)

Protocol concept → `stellar_docs_mcp`.

## Edge / traps

Confusing a native claimable balance with a Soroban escrow contract.
