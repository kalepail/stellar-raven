---
id: q-aas-issuer-fees-supply-cap-freeze
q: "As a Stellar asset issuer, can I charge transfer fees, cap supply, or freeze a holder, and what is actually possible at the protocol level?"
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
  - { claim: "Explains classic Stellar assets do not have a built-in per-transfer issuer fee hook like a custom smart-contract tax.", weight: 5 }
  - { claim: "Explains supply cap is operational/governance-based for classic assets: the issuer can stop minting or lock/disable issuer control, but the protocol does not encode an immutable max supply field for arbitrary issued assets.", weight: 4 }
  - { claim: "Explains authorization flags can authorize/deauthorize trustlines and clawback-enabled assets can claw back balances under the required flags.", weight: 5 }
should_have:
  - { claim: "Distinguishes freezing/deauthorization from clawback and from burning/redeeming supply.", weight: 3 }
  - { claim: "Mentions Soroban custom tokens could encode different token logic, but that is separate from classic asset issuer flags/SAC behavior.", weight: 2 }
nice_to_have:
  - { claim: "Notes issuer controls affect decentralization and holder risk.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim classic Stellar assets can arbitrarily tax every transfer at the protocol level.", weight: 5 }
  - { claim: "Do NOT claim clawback/freeze is available unless the relevant flags and trustline authorization model are in place.", weight: 5 }
  - { claim: "Do NOT re-derive the full burn/redemption accounting (transfers-to-issuer-burn); reference clawback as an issuer control and stay on the fee/cap/freeze feasibility question.", weight: 2 }
must_cite:
  - "Stellar docs on asset authorization flags/clawback and classic asset issuance."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - "https://developers.stellar.org/docs/learn/fundamentals/stellar-data-structures/assets"
  - "https://developers.stellar.org/docs/tokens/control-asset-access"
  - "https://developers.stellar.org/docs/tokens/stellar-asset-contract"
  - "https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: high
notes: "Verified flags and issuer-control boundaries against control-asset-access and CAP-35 (live 2026-06-29). Transfer-fee absence is inferred from the classic asset operation model and SAC docs rather than a single explicit negative statement. Differentiated from q-aas-burn-clawback-redemption-mechanics: this file owns the fee/cap/freeze feasibility debunk and AUTH_* enumeration and now references rather than re-derives burn accounting."
---

## Reference answer (gospel)

Classic Stellar assets do not have a protocol-level per-transfer issuer-fee hook like a custom token tax. They are identified by asset code plus issuer account, held on trustlines, and moved with Stellar payment/path-payment/offer operations. If an issuer needs custom transfer logic, that is a separate Soroban/custom-token design question, not a classic asset flag.

Supply caps are operational for classic assets. The issuer can stop minting, lock or disable issuer signing authority, and document supply commitments, but there is no immutable max-supply field attached to an arbitrary issued asset. (Supply is tracked as outstanding balances held outside the issuer; the burn/redemption accounting itself is covered separately in q-aas-burn-clawback-redemption-mechanics.)

Freeze and clawback are protocol controls, but only when configured correctly. `AUTH_REQUIRED_FLAG` requires authorization before holding/transacting; `AUTH_REVOCABLE_FLAG` lets the issuer deauthorize trustlines; `AUTH_CLAWBACK_ENABLED_FLAG` allows clawback for subsequent clawback-enabled trustlines and requires revocable authorization. Freezing/deauthorization blocks use; clawback removes/burns a specified amount under CAP-35. These controls are holder-risk and decentralization tradeoffs, not hidden transfer fees.

## Why these cards (routing rationale)

Asset issuer controls are protocol/docs semantics, so `stellar_docs_mcp` is primary. `scout_research` can corroborate but should not replace the official flag and CAP references.

## Edge / traps

Do not import ERC-20 tax-token assumptions into classic Stellar assets. Also do not say freeze/clawback is universally available: it depends on issuer flags and when the trustline/balance was created. This file owns the fee/cap/freeze feasibility debunk and the AUTH_* flag enumeration; the mechanical burn-vs-clawback-vs-redemption distinction is q-aas-burn-clawback-redemption-mechanics.
