---
id: q-asset-trustline-basics
q: "What is a trustline on Stellar and what does it cost to hold an asset?"
category: assets-anchors-seps
subcategory: classic-assets
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "A trustline is an explicit opt-in (via ChangeTrust) for an account to hold a specific non-native asset from an issuer.", weight: 5 }
  - { claim: "Without a trustline, payments of that asset fail/bounce.", weight: 3 }
should_have:
  - { claim: "Each trustline reserves one base reserve (0.5 XLM).", weight: 3 }
  - { claim: "Pool-share (AMM) trustlines cost two base reserves.", weight: 2 }
nice_to_have:
  - { claim: "Notes XLM (native) needs no trustline.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim assets can be received without any trustline (like ERC-20 on Ethereum).", weight: 4 }
  - { claim: "Do NOT state the base reserve is a flat fee that is consumed/spent rather than a held minimum balance.", weight: 2 }
must_cite:
  - "A trustlines page on developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/build/guides/basics/verify-trustlines
  - https://developers.stellar.org/docs/learn/fundamentals/lumens
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Foundational. Dossier §1.2. Base reserve = 0.5 XLM; trustline = 1 base reserve; pool-share trustline = 2."
---

## Reference answer (gospel)

- A **trustline** is an explicit **opt-in** (created with **`ChangeTrust`**) for an account to hold a specific non-native asset from a given issuer; it records the holder's balance and limit for that `(asset_code, issuer)` [1].
- **Without a trustline, payments of that asset fail/bounce** — the account cannot receive an asset it has not trusted [1].
- A trustline raises the account's minimum balance by **one base reserve (0.5 XLM)** — this is a held minimum, not a spent fee [2]. **Pool-share (AMM) trustlines cost two base reserves (1.0 XLM)**.
- **XLM (native) needs no trustline**; only non-native assets require one [1].

## Why these cards (routing rationale)

Core protocol concept → `stellar_docs_mcp`. No general-web/deep-research.

## Edge / traps

Treating Stellar assets like ERC-20 (received with no opt-in) is the classic cross-chain confusion. Also: the base reserve is a **held minimum balance**, not a consumed fee.
