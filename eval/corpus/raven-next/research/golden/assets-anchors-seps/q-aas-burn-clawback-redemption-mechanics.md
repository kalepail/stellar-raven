---
id: q-aas-burn-clawback-redemption-mechanics
q: "For a classic Stellar asset, how do burning, clawback, and redemption differ mechanically, and do tokens return to the issuer?"
category: assets-anchors-seps
subcategory: asset-issuer-controls
axes: [tool-targeted, ecosystem-spectrum]
query_type: comparison
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Explains that a classic asset balance held by a non-issuer account represents issued supply; sending it back to the issuer is redemption/burn-like because the issuer does not hold its own asset as a normal balance.", weight: 5 }
  - { claim: "Explains clawback removes a holder's balance under clawback-enabled issuer controls rather than transferring spendable tokens back to the issuer account.", weight: 5 }
  - { claim: "Distinguishes voluntary redemption/payment back to issuer from issuer-initiated clawback.", weight: 4 }
should_have:
  - { claim: "Notes clawback is only possible for clawback-enabled assets/trustlines, without re-enumerating every issuer auth flag.", weight: 3 }
  - { claim: "Explains supply accounting in terms of outstanding balances outside the issuer.", weight: 3 }
nice_to_have:
  - { claim: "Mentions SAC token functions may expose burn/clawback semantics for classic assets through the contract interface.", weight: 1 }
must_avoid:
  - { claim: "Do NOT say clawed-back classic-asset tokens become a spendable issuer balance.", weight: 5 }
  - { claim: "Do NOT conflate user redemption with issuer clawback authorization.", weight: 4 }
  - { claim: "Do NOT detour into per-transfer fee hooks, max-supply caps, or the full AUTH_* flag enumeration; the question is the burn/clawback/redemption distinction.", weight: 2 }
must_cite:
  - "Stellar docs on issued assets, clawback, and/or SAC token functions."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets"
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract"
  - "https://developers.stellar.org/docs/tokens/control-asset-access"
  - "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified against Stellar asset, SAC, control-access, and CAP-35 sources (live 2026-06-29). Differentiated from q-aas-issuer-fees-supply-cap-freeze: this file owns the burn/clawback/redemption 3-way mechanics; dropped auth-flag enumeration and added a must_avoid against straying into fee/cap/flag feasibility."
---

## Reference answer (gospel)

For a classic issued asset, the issuer account is the asset's authority, not a normal holder of its own credit. Stellar's asset docs state that an asset is created by an issuing account payment and that deleting or burning an issued asset is done by sending it back to the issuing account. The SAC docs make the same accounting explicit: transfers to the issuer account burn, while transfers from the issuer mint. That is the mechanical basis for voluntary redemption: a holder pays the issuer/distributor according to the issuer's redemption process, and the asset balance is removed from outstanding holder balances.

Clawback is different. Under CAP-35 and the Stellar control-access docs, an issuer can claw back only assets/trustlines that were clawback-enabled under the required flags. The issuer submits a clawback operation against the holder's balance; the SAC interface describes the clawed-back amount as burned in the clawback process. It is not a normal user payment, does not require the affected holder's signature, and does not create a spendable issuer balance.

So: redemption/payment back to the issuer is holder-initiated and usually part of off-chain cash settlement; burn is the supply/accounting effect of returning issued credit to the issuer; clawback is issuer-initiated removal under regulated-asset controls.

## Why these cards (routing rationale)

Classic asset mechanics, issuer flags, SAC burn semantics, and CAP-35 clawback are primary Stellar protocol/docs topics. `stellar_docs_mcp` should be the first card; `scout_research` is acceptable corroboration because Scout indexes Stellar docs and protocol material.

## Edge / traps

The easy wrong answer is to describe clawback as a normal transfer into the issuer account. Another trap is to conflate a business redemption promise with protocol clawback authority: redemption can exist without clawback, and clawback can remove balances without representing a normal redemption payment. Keep this answer on the mechanical 3-way distinction; the feasibility of transfer fees, max-supply caps, and the full issuer auth-flag enumeration is a separate question (q-aas-issuer-fees-supply-cap-freeze).
