---
id: q-protocol-27-cap-0071
q: "What does the queued Protocol 27 / CAP-0071 change on Stellar?"
category: protocol-core
subcategory: protocol-version-history
axes: [tool-targeted, ecosystem-spectrum, edge-governance]
query_type: freshness
difficulty: hard
freshness_sensitive: true
freshness_horizon: protocol-release

expected_cards: [stellar_docs_mcp, scout_research]
acceptable_cards: [perplexity_search, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "States Protocol 27 is built around CAP-0071, which reworks Soroban authorization: adding address-bound credentials (SOROBAN_CREDENTIALS_ADDRESS_V2) and authentication delegation for custom accounts.", weight: 4 }
  - { claim: "Flags that, as of the 2026-06-29 snapshot, Protocol 27 is queued/pending (stellar-core v27.0.0 released 2026-06-05) and not yet activated on Mainnet — and points to a live source.", weight: 5 }
should_have:
  - { claim: "Notes CAP-0071 adds an ENVELOPE_TYPE_SOROBAN_AUTHORIZATION_WITH_ADDRESS envelope and a recursive delegate-signature structure (sub-CAPs 0071-01 / 0071-02).", weight: 2 }
  - { claim: "Notes the change is additive (XDR additions, no removals).", weight: 2 }
nice_to_have:
  - { claim: "Notes it enables delegated / custom-account auth flows.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim Protocol 27 is already live on Mainnet (it was pending at the snapshot).", weight: 5 }
  - { claim: "Do NOT mis-describe CAP-0071 as a consensus/ZK/parallelism change (it is a Soroban authorization/credentials change).", weight: 4 }
  - { claim: "Do NOT present the status as fixed without a freshness caveat / live source.", weight: 3 }
must_cite:
  - "CAP-0071 in stellar/stellar-protocol and/or the stellar-core releases page."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://github.com/stellar/stellar-protocol/blob/master/core/cap-0071.md
  - https://github.com/stellar/stellar-core/releases
  - https://developers.stellar.org/docs/networks/software-versions
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness item (extra). VERIFIED against stellar/stellar-protocol core/cap-0071.md: title 'Authentication delegation and address-bound Soroban credentials', Status Accepted, Protocol version 27; adds SOROBAN_CREDENTIALS_ADDRESS_V2 (and SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES) + authentication delegation, split into sub-CAPs 71-01/71-02. RE-VERIFIED 2026-06-29: P27 'Zipper' on Testnet (2026-06-18), Mainnet vote scheduled 2026-07-08 (still future) — NOT live on Mainnet. Trap is claiming it's active or mis-describing it as ZK/parallelism."
---

## Reference answer (gospel)

**Protocol 27** is built around **CAP-0071** ("Authentication delegation and address-bound Soroban
credentials", Status: **Accepted**, Protocol version 27) [1]. It reworks Soroban authorization in two parts
(sub-CAPs 71-01 / 71-02): **address-bound credentials** — new `SOROBAN_CREDENTIALS_ADDRESS_V2` (and
`SOROBAN_CREDENTIALS_ADDRESS_WITH_DELEGATES`) credential types using an address-bound authorization payload
— and **authentication delegation** for custom accounts via a recursive `SorobanDelegateSignature`
structure [1]. The change is additive (XDR additions, no removals) and is a **Soroban auth/credentials**
change — not a consensus, ZK, or parallelism change.

**Freshness:** as of the 2026-06-29 snapshot, Protocol 27 is **queued, not live on Mainnet** —
stellar-core v27.0.0 is released and P27 reached **Testnet 2026-06-18** [2][3], with the Mainnet vote
pending. Confirm status against the stellar-core releases page / protocol-upgrades.

Sources: [1] stellar/stellar-protocol `core/cap-0071.md`; [2] github.com/stellar/stellar-core/releases;
[3] developers.stellar.org Software Versions.

## Why these cards (routing rationale)

Pending-upgrade lookup → `stellar_docs_mcp` + `scout_research` (CAP repo), general-web acceptable for the
dated release. Deep-research is over-escalation.

## Edge / traps

Claiming P27 is already live, or mis-describing CAP-0071 as a consensus/ZK/parallelism change (it's a
Soroban authorization/credentials rework), are the traps. Status must be flagged freshness-sensitive.
