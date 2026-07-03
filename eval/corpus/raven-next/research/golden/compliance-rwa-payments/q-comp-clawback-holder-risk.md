---
id: q-comp-clawback-holder-risk
q: "What counterparty risk does clawback create for holders of a regulated Stellar asset, and is it a protocol vulnerability?"
category: compliance-rwa-payments
subcategory: audits-incidents-risks
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
  - { claim: "Clawback is an intentional, issuer-only feature for clawback-enabled assets (a regulatory tool), not a protocol bug/vulnerability.", weight: 5 }
  - { claim: "It exposes holders to issuer-side counterparty risk: the issuer can burn the asset from a holder's balance (e.g. after fraud, error, or regulatory/sanctions action).", weight: 4 }
should_have:
  - { claim: "Only assets explicitly issued with clawback enabled (AUTH_REVOCABLE + AUTH_CLAWBACK_ENABLED) carry this; XLM and ordinary assets without the flag are not clawbackable.", weight: 3 }
nice_to_have:
  - { claim: "Notes holders can inspect an asset's flags before trusting it.", weight: 2 }
must_avoid:
  - { claim: "Do NOT frame clawback as a hack/exploit or claim any account can claw back another's funds.", weight: 5 }
  - { claim: "Do NOT claim all Stellar assets (including XLM) are subject to issuer clawback.", weight: 4 }
must_cite:
  - "developers.stellar.org clawbacks / control-asset-access docs."
must_not_use_tier: []

pass_threshold: 0.78
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/transactions/clawbacks
  - https://developers.stellar.org/docs/tokens/control-asset-access
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Risk framing rooted in protocol mechanics → stellar_docs. Clawback is opt-in (AUTH_REVOCABLE+AUTH_CLAWBACK_ENABLED), issuer-only; XLM/ordinary assets without the flag aren't clawbackable. Trap: framing clawback as an exploit or universal."
---

## Reference answer (gospel)

- Clawback is an **intentional, issuer-only feature** of clawback-enabled assets — a **regulatory tool,
  not a protocol bug/exploit** [1].
- It exposes holders to **issuer-side counterparty risk**: the issuer can **burn the asset from a holder's
  balance** (e.g. after fraud, error, or a sanctions/regulatory action) [1].
- It applies **only** to assets explicitly issued with **`AUTH_REVOCABLE` + `AUTH_CLAWBACK_ENABLED`**;
  **XLM and ordinary assets without the flag are not clawbackable**, and **no arbitrary account** can claw
  back another's funds — only that asset's issuer [1][2].
- Holders can **inspect an asset's flags** before trusting it.

Sources: [1] developers.stellar.org clawbacks; [2] control-asset-access.

## Why these cards (routing rationale)

Risk question grounded in protocol mechanics → `stellar_docs_mcp`; `scout_research` acceptable.

## Edge / traps

Trap: calling clawback an exploit; implying all assets/XLM are clawbackable.
