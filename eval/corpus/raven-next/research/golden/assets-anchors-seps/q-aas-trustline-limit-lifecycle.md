---
id: q-aas-trustline-limit-lifecycle
q: "How does a Stellar trustline limit work, what causes op_invalid_limit, and how do I safely remove a trustline without losing tokens?"
category: assets-anchors-seps
subcategory: trustlines
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains a trustline limit caps the maximum balance the account can hold for that asset.", weight: 5 }
  - { claim: "Explains `op_invalid_limit` occurs when the new limit is invalid, commonly below the current balance or otherwise outside protocol constraints.", weight: 4 }
  - { claim: "Explains removing a trustline requires reducing the asset balance to zero and setting the trustline limit to zero.", weight: 5 }
should_have:
  - { claim: "Mentions trustlines increase the account minimum balance/reserve while present.", weight: 3 }
  - { claim: "Notes authorization flags can affect whether the account can hold or transact the asset.", weight: 2 }
nice_to_have:
  - { claim: "Mentions wallets may show max/int64-like limits as effectively unlimited but the protocol still stores a limit.", weight: 1 }
must_avoid:
  - { claim: "Do NOT tell users to remove a trustline while it still has a nonzero balance.", weight: 5 }
  - { claim: "Do NOT imply a trustline limit increases automatically without a Change Trust operation.", weight: 3 }
must_cite:
  - "Stellar docs for trustlines/change trust or operation result codes."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/transactions/list-of-operations#change-trust"
  - "https://developers.stellar.org/docs/data/apis/horizon/api-reference/errors/result-codes/operation-specific/change-trust"
  - "https://developers.stellar.org/docs/learn/fundamentals/lumens#base-reserves"
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against operation docs and Horizon result-code docs."
---

## Reference answer (gospel)

A trustline is the ledger entry that lets an account hold a non-native Stellar asset. Its `limit` is the maximum balance that account is willing/able to hold for that asset; changing the limit is done with `ChangeTrust`.

`op_invalid_limit` / `CHANGE_TRUST_INVALID_LIMIT` means the requested new limit is not sufficient to hold the current balance and buying liabilities. The operation docs explicitly call out the common removal case: trying to remove a trustline while it still has a nonzero asset balance. Other lifecycle constraints can also matter, such as missing issuer, low reserve, deauthorization, or liquidity-pool references.

To remove a trustline safely, first reduce the asset balance to zero through payment, trade, redemption/burn to issuer, or another valid disposition. Cancel or settle relevant offers/liabilities. Then submit `ChangeTrust` with limit `0`. When the trustline closes, the associated base reserve becomes available again; until then, the trustline increases the account's minimum XLM balance.

## Why these cards (routing rationale)

Trustline lifecycle and result codes are official Stellar docs/operation semantics, so `stellar_docs_mcp` is the expected route. Scout can corroborate only.

## Edge / traps

The failure mode is losing sight of the current balance, liabilities, authorization, and reserve constraints before changing/removing the trustline. Do not tell users to remove a trustline that still holds tokens.
