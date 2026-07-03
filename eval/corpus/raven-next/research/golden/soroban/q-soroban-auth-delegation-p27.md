---
id: q-soroban-auth-delegation-p27
q: "Does Soroban support delegated signers for custom accounts, and which protocol version adds it?"
category: soroban
subcategory: authorization
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Auth delegation for custom accounts is introduced in Protocol 27 ('Stellar Zipper') via CAP-0071, adding the `SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES` credential type (nested `SorobanDelegateSignature` delegation) for custom accounts.", weight: 5 }
  - { claim: "Protocol 27 also adds `SOROBAN_CREDENTIALS_ADDRESS_V2`, an address-bound credential that prevents cross-account signature replay when keys are shared.", weight: 3 }
should_have:
  - { claim: "Answer should flag the version/status (testnet ~June 2026, mainnet vote scheduled ~July 8 2026) rather than assert it is already live everywhere.", weight: 3 }
  - { claim: "Requires the matching `soroban-sdk`/`stellar-cli` versions that support CAP-71 (SDK v26.x, CLI v27.x).", weight: 2 }
nice_to_have:
  - { claim: "Notes the original `SOROBAN_CREDENTIALS_ADDRESS` is slated for deprecation in a later protocol (P28).", weight: 1 }
must_avoid:
  - { claim: "Do NOT assert delegated signers were always available / available since Soroban launch.", weight: 4 }
  - { claim: "Do NOT attribute delegation to the wrong protocol (e.g., P22, P25) or claim mainnet activation as already final without the vote.", weight: 3 }
must_cite:
  - "The Protocol 27 / Stellar Zipper upgrade guide or CAP-0071 reference."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md
  - https://stellar.org/blog/foundation-news/stellar-zipper-protocol-27-upgrade-guide
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item: P27 status moves. Reward flagging testnet-vs-mainnet timing. Re-verified 2026-06-29: CAP-0071 ('Authentication delegation and address-bound Soroban credentials', Status: Accepted, Protocol 27) adds SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES (nested SorobanDelegateSignature), ENVELOPE_TYPE_SOROBAN_AUTHORIZATION_WITH_ADDRESS (CAP-0071-01) and SOROBAN_CREDENTIALS_ADDRESS_V2 (CAP-0071-02); P27 codename 'Zipper', testnet ~2026-06-18, mainnet vote ~2026-07-08. Correction: CAP-0071-01 and the official upgrade-guide DO name host fns `delegate_account_auth` / `get_delegated_signers_for_current_auth_check` (the earlier note was outdated); rubric still gates on the credential types, not exact host-fn spelling. P27 timing is freshness-sensitive."
---

## Reference answer (gospel)

**Yes — but only as of Protocol 27 ("Stellar Zipper"), not since launch.** **CAP-0071**
("Authentication delegation and address-bound Soroban credentials", *Accepted*, protocol version 27)
adds delegated signers for custom accounts via the new credential type
**`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES`** (and a new
`ENVELOPE_TYPE_SOROBAN_AUTHORIZATION_WITH_ADDRESS`), supporting **nested `SorobanDelegateSignature`
delegation chains** so a custom account can delegate signing authority to other addresses.

CAP-0071 also introduces **`SOROBAN_CREDENTIALS_ADDRESS_V2`**, an **address-bound** credential that
prevents cross-account signature replay when the same key is shared across accounts (the original
`SOROBAN_CREDENTIALS_ADDRESS` is slated for later deprecation).

Status/timing is **freshness-sensitive**: P27 reached testnet (~June 2026) with a mainnet upgrade vote
scheduled (~July 8 2026) — flag this rather than asserting it is already live on mainnet. Using these
flows requires the matching tooling (`soroban-sdk` v26.x+, `stellar-cli` v27.x).

## Why these cards (routing rationale)

Protocol-gated auth feature with timing caveat → `stellar_docs_mcp`. `scout_research` acceptable.

## Edge / traps

Claiming delegation always existed; wrong protocol number; asserting mainnet is final pre-vote.
