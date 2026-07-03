---
id: q-sep-6-vs-31-misnumber-trap
q: "I think SEP-31 is the API wallets use to let a user deposit fiat through an anchor's hosted UI — is that right?"
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
  - { claim: "Corrects the premise: SEP-31 is the Cross-Border Payments API (anchor-to-anchor), NOT a wallet's hosted-UI deposit standard.", weight: 5 }
  - { claim: "Identifies SEP-24 as the hosted/interactive deposit & withdrawal standard for a wallet's user (with SEP-6 as the programmatic API).", weight: 5 }
should_have:
  - { claim: "Explains SEP-31 has no end-user hosted webview; the sending anchor handles sender KYC for a receiving anchor.", weight: 3 }
nice_to_have:
  - { claim: "Notes both rely on SEP-10 auth and may use SEP-38 quotes.", weight: 1 }
must_avoid:
  - { claim: "Do NOT confirm the wrong premise that SEP-31 is the hosted-UI wallet deposit standard.", weight: 5 }
  - { claim: "Do NOT misnumber SEP-24 or SEP-6 while correcting the user.", weight: 4 }
must_cite:
  - "SEP-0031 and SEP-0024 on the stellar-protocol repo or developers.stellar.org."
must_not_use_tier: []

pass_threshold: 0.8
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0031.md
  - https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Adversarial false-premise / misnumbering trap. Must reject the wrong premise. SEP-31/24/6 all Active in the ecosystem README."
---

## Reference answer (gospel)

- **The premise is wrong.** SEP-31 is the **Cross-Border Payments API** — an anchor-to-anchor (sending-anchor → receiving-anchor) rail; it has **no end-user hosted UI** [1].
- The **hosted/interactive deposit & withdrawal** standard a wallet uses for its user is **SEP-24** (anchor-hosted webview); **SEP-6** is the **programmatic (non-interactive)** deposit/withdrawal API [2]. All three are Active.
- In SEP-31 the **sending anchor** collects sender KYC (via SEP-12) on behalf of the receiving anchor; the end user interacts with their wallet/anchor, not a SEP-31 webview [1].
- Both flows authenticate with **SEP-10** and may price with **SEP-38** quotes [1][2].

## Why these cards (routing rationale)

Spec correction → `stellar_docs_mcp` + SEP repo. General-web/deep-research is a routing miss for an exact SEP mapping.

## Edge / traps

The user states a wrong SEP mapping; the answer must correct it (SEP-31 ≠ wallet hosted-UI deposit; that is SEP-24/SEP-6), not agree, and must not misnumber SEP-24/SEP-6 while correcting.
