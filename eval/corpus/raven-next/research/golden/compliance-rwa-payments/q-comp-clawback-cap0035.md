---
id: q-comp-clawback-cap0035
q: "How does clawback work on Stellar, which protocol version and CAP introduced it, and why does it exist?"
category: compliance-rwa-payments
subcategory: auth-flags-clawback
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
  - { claim: "Clawback lets an asset issuer burn a specified amount of the asset from any holding account without that holder's cooperation.", weight: 5 }
  - { claim: "Clawback was introduced by CAP-0035 in Protocol 17.", weight: 5 }
  - { claim: "The issuer must have AUTH_REVOCABLE set / AUTH_CLAWBACK_ENABLED on the asset for clawback to be possible.", weight: 4 }
should_have:
  - { claim: "It was designed to help issuers meet securities/regulatory obligations (revoke assets after fraud, error, or regulatory action).", weight: 3 }
  - { claim: "Implemented via clawback operations (ClawbackOp / ClawbackClaimableBalanceOp).", weight: 2 }
nice_to_have:
  - { claim: "Notes the holder-side counterparty risk this introduces.", weight: 1 }
must_avoid:
  - { claim: "Do NOT attribute clawback to the wrong protocol/CAP (e.g. say it was Protocol 20/Soroban or a different CAP number).", weight: 5 }
  - { claim: "Do NOT claim clawback requires a Soroban smart contract, or that any account can claw back another's funds.", weight: 4 }
must_cite:
  - "developers.stellar.org clawbacks guide and/or CAP-0035 in the stellar-protocol repo."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/clawbacks
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified: clawbacks doc attributes the feature to CAP-0035 (Asset Clawback), introduced in Protocol 17 (activated ~2021-06-01). Requires AUTH_REVOCABLE + AUTH_CLAWBACK_ENABLED. Clawed-back assets are BURNED, not returned to issuer. Ops: Set Options (enable), Clawback, Clawback Claimable Balance. Trap: wrong protocol/CAP number."
---

## Reference answer (gospel)

- Clawback lets an **asset issuer burn a specified amount of a clawback-enabled asset from any holder's
  trustline (or claimable balance)** — without the holder's cooperation; the assets are **burned, not
  returned** to the issuer [1].
- Introduced by **CAP-0035 ("Asset Clawback") in Protocol 17** (activated ~2021-06-01) [1][2].
- The issuer must have set **`AUTH_REVOCABLE` first, then `AUTH_CLAWBACK_ENABLED`** — only then are new
  trustlines clawback-eligible [1].
- It was **designed to help issuers meet securities/regulatory obligations** (revoke after fraud, error,
  or regulatory action) [1].
- Implemented via the **Clawback** and **Clawback Claimable Balance** operations (after enabling the flag
  with Set Options) [1]. It needs **no Soroban contract**, and **no arbitrary account** can claw back
  another's funds — only the issuer of that asset.

Sources: [1] developers.stellar.org clawbacks; [2] CAP-0035.

## Why these cards (routing rationale)

Protocol/CAP fact → `stellar_docs_mcp` + CAP-0035 repo; `scout_research` acceptable.

## Edge / traps

Trap: misattributing the CAP/protocol version, or implying clawback needs Soroban.
