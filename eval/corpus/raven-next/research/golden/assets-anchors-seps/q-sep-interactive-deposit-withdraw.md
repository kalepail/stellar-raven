---
id: q-sep-interactive-deposit-withdraw
q: "Which Stellar SEP standardizes interactive, hosted deposit and withdrawal between a wallet and an anchor, and how does it differ from the programmatic one?"
category: assets-anchors-seps
subcategory: seps-anchors
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Names SEP-24 as the interactive (anchor-hosted UI / webview) deposit & withdrawal standard.", weight: 5 }
  - { claim: "Contrasts SEP-6 as the programmatic (API-driven, no hosted UI) deposit/withdrawal counterpart.", weight: 4 }
should_have:
  - { claim: "SEP-24 hands off KYC/UI to the anchor's hosted flow; SEP-6 requires the wallet to collect data (often via SEP-12) itself.", weight: 3 }
  - { claim: "Both rely on SEP-10 for authentication.", weight: 2 }
nice_to_have:
  - { claim: "Mentions SEP-1 (stellar.toml) for discovering the anchor's endpoints.", weight: 1 }
must_avoid:
  - { claim: "Do NOT misnumber the standard (e.g. call interactive deposit/withdraw SEP-31 or SEP-12 or SEP-0024-as-SEP-6).", weight: 5 }
  - { claim: "Do NOT claim SEP-31 is the wallet/anchor interactive standard (SEP-31 is cross-border anchor-to-anchor).", weight: 4 }
must_cite:
  - "The SEP-24 (and ideally SEP-6) spec on the stellar-protocol GitHub repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md
  - https://developers.stellar.org/docs/learn/fundamentals/anchors
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Exemplar. Verified 2026-06-22: SEP-0024 'Hosted Deposit and Withdrawal' Active; SEP-0006 'Deposit and Withdrawal API' Active. SEP-6 interactive components deprecated in favor of SEP-24."
---

## Reference answer (gospel)

**SEP-24** ("Hosted Deposit and Withdrawal") is the **interactive** standard: the anchor serves a
hosted UI/webview that the wallet opens, and the anchor collects any KYC and drives the
deposit/withdraw flow. **SEP-6** ("Deposit and Withdrawal API") is the **programmatic** counterpart:
a pure API with no anchor-hosted UI, so the wallet itself collects customer data (typically via
**SEP-12** KYC). Both authenticate the user with **SEP-10**, and the wallet discovers the anchor's
endpoints via **SEP-1** (`stellar.toml`). Distinct from **SEP-31** (cross-border, anchor-to-anchor
"send") and **SEP-38** (quotes).

## Why these cards (routing rationale)

Standards/spec question → **`stellar_docs_mcp`** (and the SEP repo) is the primary source.
`scout_research` (11 corpora incl. SEPs) is acceptable corroboration. General-web/deep-research tiers
are wrong here — this is fully covered by first-party specs.

## Edge / traps

The classic trap is **SEP misnumbering** — confusing SEP-24/SEP-6 with SEP-31 or SEP-12. The
must_avoid claims fail any answer that names the wrong SEP for "interactive deposit/withdrawal."
