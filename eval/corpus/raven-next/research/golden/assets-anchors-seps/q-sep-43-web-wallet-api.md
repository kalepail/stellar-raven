---
id: q-sep-43-web-wallet-api
q: "What does SEP-43 specify?"
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
  - { claim: "SEP-43 is 'Standard Web Wallet API Interface' — a standard interface (getAddress, signTransaction, signAuthEntry, signMessage, getNetwork) for web wallets so dapps integrate once.", weight: 5 }
  - { claim: "Does NOT claim SEP-43 is unpublished/nonexistent (the sep-0043.md file exists in stellar-protocol/ecosystem).", weight: 5 }
should_have:
  - { claim: "States SEP-43 is in Draft status.", weight: 3 }
  - { claim: "Notes its purpose: remove the need for per-wallet abstractions by defining one common wallet API + standard error shapes.", weight: 2 }
nice_to_have:
  - { claim: "Notes it underpins multi-wallet kits (e.g. Stellar Wallets Kit) by giving wallets a shared interface.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim SEP-43 does not exist or that the numbering skips 43 (it does exist as of 2024-04).", weight: 5 }
  - { claim: "Do NOT invent an unrelated scope (e.g. call it an auth/anchor/payment standard).", weight: 4 }
must_cite:
  - "The SEP-0043 spec in stellar/stellar-protocol (ecosystem/sep-0043.md)."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0043.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "CORRECTION vs dossier: SEP-43 DOES exist (sep-0043.md, 'Standard Web Wallet API Interface', Draft, created 2024-04-11) — verified live in the master ecosystem dir. The dossier (and the Phase-1 'nonexistent' framing) is stale: the ecosystem README main table omits it but the file is present. The repo also now has sep-0042 and sep-0044. Freshness-sensitive (status could advance)."
---

## Reference answer (gospel)

- **SEP-43 — "Standard Web Wallet API Interface"** (Status: **Draft**, created 2024-04-11) defines a common JavaScript API that web wallets expose to dapps so developers integrate once instead of writing per-wallet abstractions [1].
- The interface methods are **`getAddress`, `signTransaction`, `signAuthEntry`, `signMessage`, and `getNetwork`**, plus standardized error shapes (`message`/`code`/`ext`, with codes -1 internal, -2 external service, -3 invalid request, -4 user rejected) [1].
- It exists as `ecosystem/sep-0043.md` in stellar/stellar-protocol — it is **not** an unassigned gap [1].

## Why these cards (routing rationale)

Spec lookup → `stellar_docs_mcp` + the SEP registry; `scout_research` acceptable. Deep-research/general-web escalation is wrong for a single-SEP lookup.

## Edge / traps

The historical trap (and the dossier's claim) was that "SEP-43 does not exist / numbering skips 41→45." That is **outdated** — SEP-43 was published 2024-04-11. The correct answer states its real title/scope; do not assert it is unpublished, and do not conflate it with auth/anchor SEPs.
