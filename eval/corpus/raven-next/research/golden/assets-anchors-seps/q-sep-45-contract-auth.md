---
id: q-sep-45-contract-auth
q: "Is there a Stellar web-authentication standard for Soroban contract accounts, and which SEP is it?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-45 as Stellar Web Authentication for Contract Accounts (the Soroban smart-account analog of SEP-10).", weight: 5 }
should_have:
  - { claim: "Notes SEP-45 is in Draft status (not yet final).", weight: 3 }
  - { claim: "Contrasts it with SEP-10, which authenticates classic accounts.", weight: 2 }
nice_to_have:
  - { claim: "Flags freshness — its status may advance over time.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber it (contract-account auth is SEP-45, not SEP-43 or SEP-10).", weight: 5 }
  - { claim: "Do NOT claim SEP-45 is final/active if the current status is Draft.", weight: 2 }
must_cite:
  - "SEP-0045 on the stellar-protocol repo."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0045.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/README.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Newer SEP. Freshness-sensitive. Verified 2026-06-22: SEP-0045 'Stellar Web Authentication for Contract Accounts', Status Draft (v0.1.1, updated 2025-12-16); reference web-auth contract deployed on pubnet. (SEP-43 DOES exist separately — 'Standard Web Wallet API Interface', Draft — but is unrelated to contract-account auth; do not claim it is missing.)"
---

## Reference answer (gospel)

Yes — it is **SEP-45, "Stellar Web Authentication for Contract Accounts"** (Status: **Draft**),
the Soroban smart-account analog of SEP-10 [1]. It defines how a client authenticates on behalf of
a **contract (`C…`) account** by signing **Soroban authorization entries** (a `web_auth_verify`
invocation against a `WEB_AUTH_CONTRACT_ID` declared in the anchor's `stellar.toml`), exchanging
the signed challenge for a session JWT. It is **based on SEP-10 but does not replace it**: SEP-10
covers `G`/`M` accounts, SEP-45 covers `C` accounts, and a service that wants both must implement
both [1]. Contract-account auth is **SEP-45, not SEP-10 and not SEP-43**; SEP-43 exists but is the
unrelated **Standard Web Wallet API Interface** (Draft) [2]. Freshness caveat: SEP-45 is still Draft
(v0.1.1) and may advance.

Sources: [1] stellar-protocol `ecosystem/sep-0045.md` (Draft, updated 2025-12-16);
[2] `ecosystem/sep-0043.md` (Standard Web Wallet API Interface, Draft) + `ecosystem/README.md` (registry).

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo.

## Edge / traps

Confusing it with SEP-10/SEP-43, or asserting a final status when it is Draft.
