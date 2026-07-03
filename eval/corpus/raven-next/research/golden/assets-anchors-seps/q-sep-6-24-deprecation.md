---
id: q-sep-6-24-deprecation
q: "Are SEP-6's interactive components deprecated, and what should an anchor use instead for interactive flows?"
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
  - { claim: "Yes — SEP-6's interactive components are deprecated in favor of SEP-24 for hosted/interactive deposit & withdrawal.", weight: 5 }
  - { claim: "SEP-6's non-interactive (programmatic) API portion remains useful for fully API-driven anchors.", weight: 3 }
should_have:
  - { claim: "An anchor wanting a hosted webview/KYC experience should implement SEP-24, not the SEP-6 interactive flow.", weight: 3 }
nice_to_have:
  - { claim: "Notes the choice is essentially 'host a webview (SEP-24)' vs 'wallet keeps a stateful handle (SEP-6 non-interactive)'.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim all of SEP-6 is deprecated/removed (only the interactive components are).", weight: 4 }
  - { claim: "Do NOT recommend SEP-31 or SEP-12 as the replacement for interactive deposit/withdrawal.", weight: 3 }
must_cite:
  - "SEP-0006 / SEP-0024 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0006.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Nuance: only SEP-6 interactive parts are deprecated. Dossier §8.2(1). Verified: SEP-0006 'Deposit and Withdrawal API' Active; SEP-0024 'Hosted Deposit and Withdrawal' Active. Interactive components of SEP-6 are deprecated in favor of SEP-24."
---

## Reference answer (gospel)

Yes, but only the **interactive components**. **SEP-6's interactive (anchor-hosted UI) flow is
deprecated in favor of SEP-24** for hosted/interactive deposit & withdrawal [1][2]. SEP-6 itself is
**not** removed — it remains **Active**, and its **non-interactive (programmatic) API** is still the
right choice for fully API-driven anchors that want no hosted webview [1]. So an anchor that wants a
**hosted UI / KYC webview** should implement **SEP-24**, not the SEP-6 interactive flow; an anchor
that wants a pure programmatic API (wallet collects data itself, e.g. via SEP-12) stays on SEP-6.
The replacement for interactive flows is **SEP-24 only** — not SEP-31 (cross-border) or SEP-12
(KYC).

Sources: [1] stellar-protocol `ecosystem/sep-0006.md` (Deposit and Withdrawal API, Active —
interactive components deprecated); [2] `ecosystem/sep-0024.md` (Hosted Deposit and Withdrawal,
Active).

## Why these cards (routing rationale)

Spec status → `stellar_docs_mcp` + SEP repo.

## Edge / traps

Overstating ('all of SEP-6 is dead') or naming the wrong replacement SEP.
