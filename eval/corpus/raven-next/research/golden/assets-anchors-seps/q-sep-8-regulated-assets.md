---
id: q-sep-8-regulated-assets
q: "How does SEP-8 add per-transaction approval for regulated assets, and what does it require in stellar.toml?"
category: assets-anchors-seps
subcategory: seps-anchors
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
  - { claim: "Names SEP-8 as the Regulated Assets standard, adding per-transaction issuer approval.", weight: 5 }
  - { claim: "Requires an approval_server declared in the issuer's stellar.toml, to which each transaction is POSTed for approval.", weight: 4 }
should_have:
  - { claim: "The issuer must set both AUTH_REQUIRED and AUTH_REVOCABLE flags so it can authorize/deauthorize per transaction.", weight: 3 }
  - { claim: "Approval-server responses include statuses success / revised / pending / action_required / rejected.", weight: 2 }
nice_to_have:
  - { claim: "Notes SEP-57 (T-REX) is an emerging next-gen regulated-asset standard.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber it (regulated assets is SEP-8, not SEP-12 or SEP-31).", weight: 5 }
  - { claim: "Do NOT claim SEP-8 is account-level flags only with no approval server.", weight: 2 }
must_cite:
  - "SEP-0008 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0008.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Dossier §1.5, §7.1, Q14. Status caveat: sep-0008.md preamble says 'Active' (v1.7.4) but the ecosystem README main table lists SEP-8 as 'Final' — the repo is internally inconsistent. Rubric gates on the durable content (regulated assets + approval_server), not the exact status word."
---

## Reference answer (gospel)

- **SEP-8 — "Regulated Assets"** adds **per-transaction issuer approval** on top of account-level auth flags: assets that need issuer (or a delegated licensed party's) sign-off on every transfer [1].
- Requirements: the issuer account sets both **`Authorization Required` and `Authorization Revocable`** flags, and declares an **`approval_server`** (plus `regulated=true`, `approval_criteria`) in the `[[CURRENCIES]]` section of its **SEP-1 `stellar.toml`** [1].
- Flow: the wallet builds+signs a tx, detects it is regulated (via the flags + approval_server), **POSTs `tx` to the approval server**, which checks compliance and signs on success. Responses carry a `status`: **`success`, `revised`, `pending`, `action_required`, or `rejected`** [1].
- Status note: the spec file is marked **Active** (v1.7.4); the ecosystem README lists it as **Final** [1].

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + SEP repo. No general-web/deep-research for a single-SEP fact.

## Edge / traps

Misnumbering (regulated assets is **SEP-8**), or describing it as account-flags-only with no `approval_server` (the per-tx POST/approval loop is the defining mechanism).
