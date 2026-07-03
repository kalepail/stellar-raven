---
id: q-tool-java-sdk
q: "Is there a Java SDK for Stellar, who maintains it, and is it official?"
category: tooling-infra
subcategory: sdks-java
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: easy
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Java SDK is `java-stellar-sdk`, a community-maintained library (lightsail-network).", weight: 5 }
  - { claim: "It is community-maintained, not SDF-maintained.", weight: 3 }
should_have:
  - { claim: "For production banking flows the SDF-maintained SDKs (JS/Go/Rust) are the safer default tier.", weight: 2 }
nice_to_have:
  - { claim: "It is a client/XDR SDK for talking to Horizon/RPC, not a contract SDK.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the Java SDK is SDF-maintained or that there is no Java SDK.", weight: 4 }
must_cite:
  - "developers.stellar.org client-sdks page or the lightsail-network/java-stellar-sdk repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/client-sdks
  - https://github.com/lightsail-network/java-stellar-sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified against the client-SDKs page: the Java SDK is java-stellar-sdk, community-maintained under the lightsail-network org (NOT SDF). It is a client/XDR SDK for Horizon/RPC, not a contract SDK."
---

## Reference answer (gospel)

Yes — the Java SDK is **`java-stellar-sdk`**, a **community-maintained** library under the
**lightsail-network** org; it is **not SDF-maintained**
([client SDKs](https://developers.stellar.org/docs/tools/sdks/client-sdks),
[lightsail-network/java-stellar-sdk](https://github.com/lightsail-network/java-stellar-sdk)).

- It is a **client/XDR SDK** (talks to Horizon/Stellar RPC, signs txs), not a Soroban *contract* SDK.
- For production banking flows, the **SDF-maintained** SDKs (JS / Go / Rust) are the safer default
  tier.

Do not claim the Java SDK is SDF-maintained or that none exists.

## Why these cards (routing rationale)

SDK fact → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Miscrediting maintainership (claiming SDF) is the trap.
