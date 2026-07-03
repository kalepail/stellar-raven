---
id: q-comp-auth-flags-overview
q: "What asset authorization flags can a Stellar issuer set on a regulated token, and what does each one do?"
category: compliance-rwa-payments
subcategory: auth-flags-clawback
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
  - { claim: "Lists AUTH_REQUIRED (issuer must approve a trustline before a holder can receive/hold the asset).", weight: 5 }
  - { claim: "Lists AUTH_REVOCABLE (issuer can revoke/freeze an existing trustline's authorization).", weight: 5 }
  - { claim: "Lists AUTH_CLAWBACK_ENABLED (issuer can claw back / burn the asset from any holder's balance).", weight: 4 }
  - { claim: "Lists AUTH_IMMUTABLE (locks the authorization flags / prevents further changes once set).", weight: 4 }
should_have:
  - { claim: "AUTH_REVOCABLE must be enabled before AUTH_CLAWBACK_ENABLED can be set.", weight: 3 }
  - { claim: "Flags are managed via Set Options / Set Trustline Flags operations.", weight: 2 }
nice_to_have:
  - { claim: "Frames these as the regulated-asset control toolkit underpinning SEP-8 issuers.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent flags that don't exist (e.g. 'AUTH_FROZEN', 'AUTH_KYC_REQUIRED').", weight: 4 }
  - { claim: "Do NOT claim AUTH_IMMUTABLE lets the issuer still change flags afterward, or that clawback works without AUTH_REVOCABLE.", weight: 3 }
must_cite:
  - "developers.stellar.org control-asset-access / clawbacks docs."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tokens/control-asset-access
  - https://developers.stellar.org/docs/build/guides/transactions/clawbacks
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Canonical, verified vs control-asset-access docs. Four flags: AUTH_REQUIRED(0x1), AUTH_REVOCABLE(0x2), AUTH_IMMUTABLE(0x4), AUTH_CLAWBACK_ENABLED(0x8). Docs confirm clawback flag 'requires that revocable is also set'. Trap: hallucinated flag names; missing the AUTH_REVOCABLE precondition."
---

## Reference answer (gospel)

- **`AUTH_REQUIRED`** — the issuer must **approve a trustline** before an account can hold/receive the
  asset [1].
- **`AUTH_REVOCABLE`** — the issuer can **revoke/freeze** an existing trustline's authorization (downgrade
  to limited or remove it) [1].
- **`AUTH_CLAWBACK_ENABLED`** — every subsequent trustline is clawback-enabled, letting the issuer **claw
  back / burn** the asset from any holder; the docs state this flag **requires `AUTH_REVOCABLE` to also be
  set** [1][2].
- **`AUTH_IMMUTABLE`** — **locks** the authorization flags (and blocks account merge) once set; finalizes
  the asset's governance posture [1].
- Flags are managed via the **`set_options`** operation (account-level) and **`set_trust_line_flags`**
  (per-trustline) [1].

Sources: [1] developers.stellar.org control-asset-access; [2] clawbacks guide.

## Why these cards (routing rationale)

Protocol/asset-control facts → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: inventing flags; missing the AUTH_REVOCABLE precondition for clawback.
