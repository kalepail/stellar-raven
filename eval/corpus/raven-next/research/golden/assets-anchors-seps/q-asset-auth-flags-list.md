---
id: q-asset-auth-flags-list
q: "List the account-level authorization flags an asset issuer can set on Stellar and what each one does."
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: list
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names AUTH_REQUIRED (holders must be explicitly authorized before holding/receiving the asset).", weight: 4 }
  - { claim: "Names AUTH_REVOCABLE (issuer can revoke/deauthorize a trustline).", weight: 4 }
  - { claim: "Names AUTH_CLAWBACK_ENABLED (issuer can claw back / burn balances).", weight: 4 }
  - { claim: "Names AUTH_IMMUTABLE (locks the flags so they cannot be weakened).", weight: 3 }
should_have:
  - { claim: "Notes AUTH_CLAWBACK_ENABLED requires AUTH_REVOCABLE to also be set.", weight: 3 }
nice_to_have:
  - { claim: "Mentions flags are set via SetOptions / SetTrustLineFlags operations.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent non-existent flags (e.g. AUTH_FREEZE, AUTH_BURN) as the canonical set.", weight: 4 }
  - { claim: "Do NOT omit AUTH_CLAWBACK_ENABLED or conflate clawback with revocation as the same flag.", weight: 3 }
must_cite:
  - "A control-asset-access / authorization page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/control-asset-access
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "List question. Dossier §1.3. Four canonical account-level flags verified."
---

## Reference answer (gospel)

The four account-level authorization flags an issuer can set (via SetOptions) [1]:

- **`AUTH_REQUIRED_FLAG`** — holders must be explicitly authorized by the issuer before they can hold/receive the asset (issuer gates the trustline).
- **`AUTH_REVOCABLE_FLAG`** — the issuer can revoke/deauthorize an existing trustline (freeze), removing the holder's ability to transact.
- **`AUTH_CLAWBACK_ENABLED_FLAG`** — the issuer can claw back (burn) balances from holders; only sticks if **`AUTH_REVOCABLE`** is also set.
- **`AUTH_IMMUTABLE_FLAG`** — locks the auth configuration so the flags can no longer be changed/weakened.

Flags are set on the issuer account with **SetOptions**; per-trustline state is managed with **SetTrustLineFlags** [1].

## Why these cards (routing rationale)

Enumeration of a protocol feature → `stellar_docs_mcp` primary; `scout_research` acceptable. No general-web/deep-research.

## Edge / traps

Hallucinated flag names (e.g. AUTH_FREEZE, AUTH_BURN), omitting one of the four, or conflating clawback with revocation.
