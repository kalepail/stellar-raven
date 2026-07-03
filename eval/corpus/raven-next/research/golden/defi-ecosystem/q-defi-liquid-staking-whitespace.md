---
id: q-defi-liquid-staking-whitespace
q: "What liquid staking / LST protocols are live on Stellar?"
category: defi-ecosystem
subcategory: liquid-staking
axes: [tool-targeted, ecosystem-spectrum]
query_type: discovery
difficulty: hard
freshness_sensitive: false
freshness_horizon: null

expected_cards: [lumenloop_find_similar_projects_semantic]
acceptable_cards: [scout_projects, lumenloop_search_content_semantic, scout_clusters, lumenloop_request_research]
forbidden_cards: []
expected_service: lumenloop
should_fire: true

must_have:
  - { claim: "Honestly reports that no dominant Soroban liquid-staking (LST) protocol is surfaced — liquid staking is a recognized whitespace / open opportunity on Stellar.", weight: 5 }
should_have:
  - { claim: "Frames the absence as a genuine gap (not under-reporting) rather than asserting a product exists.", weight: 3 }
nice_to_have:
  - { claim: "Optionally notes this is therefore an open building opportunity.", weight: 1 }
must_avoid:
  - { claim: "Do NOT invent a fictitious Stellar/Soroban liquid-staking protocol name to fill the gap.", weight: 5 }
  - { claim: "Do NOT present an Ethereum/Solana LST (e.g. Lido/Marinade) as a live Stellar-native product.", weight: 4 }
must_cite:
  - "Note that the conclusion is from absence of any LST project in the sourced corpus (treat as 'not publicly listed as active')."
must_not_use_tier: []

pass_threshold: 0.75
weight_profile: standard

sources:
  - https://stellarlight.xyz/directory
status: reviewed
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: 2026-06-29 }
confidence: medium
notes: "WHITESPACE honesty case. No dominant Soroban LST protocol is surfaced in the Scout directory. NB: Stellar uses SCP (federated agreement), not proof-of-stake — so there's no native staking to liquid-stake in the Ethereum/Solana sense; this strengthens the honest 'no LST' answer. Trap: inventing one or importing Lido/Marinade as Stellar-native. Freshness-soft: re-query the live directory. 2026-06-29 reviewed: re-ran Scout 'liquid staking'/'LST staked token' queries — returns only generic DeFi (DEXes Aquarius/Phoenix/Comet, etc.), no dedicated Stellar-native liquid-staking protocol; whitespace claim holds. Confidence kept medium."
---

## Reference answer (gospel)

**No dominant Soroban liquid-staking (LST) protocol is surfaced** on Stellar — liquid staking is a
recognized **whitespace / open opportunity**, not a live product line [Scout directory:
stellarlight.xyz]. The correct Raven-shaped answer reports this **honest negative** (from the absence
of any LST project in the corpus) rather than naming a protocol. A strong answer also notes the
structural reason: **Stellar's consensus is SCP (federated Byzantine agreement), not proof-of-stake**,
so there is no native staking-yield to "liquid-stake" the way Lido/Marinade do on Ethereum/Solana —
making this genuinely under-built, not merely under-reported.

## Why these cards (routing rationale)

Directory/semantic discovery should come up empty for a live LST; the correct behavior is honest 'not found / whitespace'. `find_similar_projects_semantic` and Scout directory are the right surfaces; the test is the honest negative.

## Edge / traps

Inventing an LST protocol or importing a non-Stellar LST (Lido/Marinade) as Stellar-native is an
auto-fail. Treat the conclusion as "not publicly listed as active" + re-queryable.
