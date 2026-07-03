---
id: q-sep-clawback-prereq-flag
q: "I set AUTH_CLAWBACK_ENABLED on my issuing account but clawback isn't sticking — what flag am I missing?"
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: how-to
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "AUTH_CLAWBACK_ENABLED only takes effect if AUTH_REVOCABLE is also set on the account.", weight: 5 }
should_have:
  - { claim: "Clawback applies to trustlines opened after the flag was set; existing trustlines may not become clawback-able retroactively.", weight: 3 }
  - { claim: "Per-trustline clawback state can be managed via SetTrustLineFlags.", weight: 2 }
nice_to_have:
  - { claim: "Notes XLM/native balances are never clawback-able.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim AUTH_CLAWBACK_ENABLED works on its own without AUTH_REVOCABLE.", weight: 5 }
  - { claim: "Do NOT invent a missing flag name that does not exist.", weight: 3 }
must_cite:
  - "The clawback page on developers.stellar.org or CAP-0035."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/clawbacks
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0035.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Applied troubleshooting how-to. Dossier §1.3, §1.4, Q4. Flag-ordering gotcha verified against docs + CAP-0035."
---

## Reference answer (gospel)

- The missing flag is **`AUTH_REVOCABLE_FLAG`**. Per the docs, "if an issuing account wants to set the `AUTH_CLAWBACK_ENABLED_FLAG`, it must have the `AUTH_REVOCABLE_FLAG` set" — clawback enablement does not stick on its own [1][2].
- Reason: clawback may need to revoke trustline authorization first (to cancel offers/selling liabilities) before burning, so revocability is a precondition [2].
- Clawback applies to **trustlines created after** the issuer enabled the flag; existing trustlines are not made clawback-able retroactively (each trustline carries its own `TRUSTLINE_CLAWBACK_ENABLED_FLAG`) [1][2].
- Per-trustline clawback state is managed with **`SetTrustLineFlags`**. **XLM/native balances are never clawback-able** [1].

## Why these cards (routing rationale)

Issuance how-to/gotcha → `stellar_docs_mcp` (clawback guide) + the CAP. No general-web/deep-research.

## Edge / traps

The trap is claiming `AUTH_CLAWBACK_ENABLED` works alone, or inventing a non-existent flag. The real prerequisite is **`AUTH_REVOCABLE`**.
