---
id: q-tool-flutter-mobile-sdk
q: "What SDK should I use to build a Stellar wallet in Flutter, and is it official?"
category: tooling-infra
subcategory: sdks-flutter
axes: [tool-targeted, ecosystem-spectrum]
query_type: factual
difficulty: medium
freshness_sensitive: false
freshness_horizon: null

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_repos]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "The Flutter SDK is `stellar_flutter_sdk`, maintained by the community developer Soneso.", weight: 5 }
  - { claim: "It is community-maintained (Soneso), not SDF-maintained.", weight: 3 }
should_have:
  - { claim: "Soneso also maintains the iOS/macOS, Kotlin Multiplatform, and PHP SDKs in the same family.", weight: 2 }
nice_to_have:
  - { claim: "Notes that for production banking flows SDF-maintained SDKs (JS/Go/Rust) are the safer default tier.", weight: 1 }
must_avoid:
  - { claim: "Do NOT claim the Flutter SDK is SDF-maintained or that there is no Flutter SDK.", weight: 4 }
  - { claim: "Do NOT name a non-existent or wrong package as the Flutter SDK.", weight: 3 }
must_cite:
  - "developers.stellar.org client-sdks page or the Soneso/stellar_flutter_sdk repo."
must_not_use_tier: []

pass_threshold: 0.7
weight_profile: standard

sources:
  - https://developers.stellar.org/docs/tools/sdks/client-sdks
  - https://github.com/Soneso/stellar_flutter_sdk
status: answered
authored: { phase1: 2026-06-22, phase2: 2026-06-22, reviewed: null }
confidence: high
notes: "Verified against the client-SDKs page: the Flutter SDK is stellar_flutter_sdk, maintained by the community developer Soneso (NOT SDF). Soneso also maintains the iOS/macOS, Kotlin Multiplatform, and PHP SDKs. Maintainer tier is the load-bearing nuance."
---

## Reference answer (gospel)

The Flutter SDK is **`stellar_flutter_sdk`**, maintained by the **community developer Soneso** — it is
**community-maintained, not SDF-maintained**
([client SDKs](https://developers.stellar.org/docs/tools/sdks/client-sdks),
[Soneso/stellar_flutter_sdk](https://github.com/Soneso/stellar_flutter_sdk)).

- Soneso also maintains the **iOS/macOS, Kotlin Multiplatform, and PHP** SDKs in the same family.
- For production banking flows, the **SDF-maintained** SDKs (JS / Go / Rust) are the safer default
  tier; the Soneso stack is high quality but "best effort" community support.

Do not claim the Flutter SDK is SDF-maintained, that none exists, or name a wrong package.

## Why these cards (routing rationale)

SDK fact → `stellar_docs_mcp`; `scout_repos` acceptable. Deep-research/general-web are misses.

## Edge / traps

Miscrediting maintainership (claiming SDF) is the trap.
