---
id: q-ti-java-sdk-wallet-feebump
q: "What's the correct Maven dependency for the Java Stellar SDK (network.lightsail), how do I build a wallet with it, and how do I construct a fee-bump transaction (FeeBumpTransaction / buildFeeBumpTransaction) in the current version?"
category: tooling-infra
subcategory: wallets-keys
axes: [tool-targeted, ecosystem-spectrum]
query_type: freshness
difficulty: medium
freshness_sensitive: true
freshness_horizon: docs-release

expected_cards: [stellar_docs_mcp]
acceptable_cards: [scout_research, parallel_search]
forbidden_cards: []
expected_service: stellar_docs
should_fire: true

must_have:
  - { claim: "Identifies the current Java SDK coordinates as the Lightsail-maintained Maven artifact network.lightsail:stellar-sdk, with the exact version verified from a current Maven/GitHub source.", weight: 5 }
  - { claim: "Explains that fee-bump transactions wrap a signed inner transaction and are paid/signed by a fee account; they do not consume the fee account's sequence number.", weight: 5 }
  - { claim: "Uses current Java SDK API names: FeeBumpTransaction.createWithFee or createWithBaseFee, not an unverified buildFeeBumpTransaction helper.", weight: 4 }
  - { claim: "Shows wallet/keypair construction at a safe conceptual level and warns not to hardcode production secret keys.", weight: 4 }
should_have:
  - { claim: "Mentions the June 2026 version nuance: Maven Central reports `4.0.0-beta0` as latest/release metadata while GitHub's latest release tag is `3.1.0`; a production answer should state which source it is using.", weight: 3 }
nice_to_have:
  - { claim: "Mentions CAP-0015 as the protocol basis for fee-bumps.", weight: 1 }
must_avoid:
  - { claim: "Do NOT fabricate wallet, faucet, provider, SDK, explorer, or infrastructure behavior without a current source.", weight: 5 }
  - { claim: "Do NOT cite the old SDF org artifact or a stale package name as current Java SDK guidance.", weight: 5 }
  - { claim: "Do NOT invent a buildFeeBumpTransaction API if the current Java SDK exposes createWithFee/createWithBaseFee.", weight: 5 }
must_cite:
  - "Current Java SDK repo/release or Maven Central plus official fee-bump transaction docs."
must_not_use_tier: []

pass_threshold: 0.72
weight_profile: standard

sources:
  - "https://github.com/lightsail-network/java-stellar-sdk"
  - "https://repo1.maven.org/maven2/network/lightsail/stellar-sdk/maven-metadata.xml"
  - "https://github.com/lightsail-network/java-stellar-sdk/releases/tag/3.1.0"
  - "https://github.com/lightsail-network/java-stellar-sdk/blob/master/src/main/java/org/stellar/sdk/FeeBumpTransaction.java"
  - "https://developers.stellar.org/docs/build/guides/transactions/fee-bump-transactions"
status: reviewed
authored: { phase1: 2026-06-29, phase2: 2026-06-29, reviewed: 2026-06-29 }
confidence: medium
notes: "Freshness-sensitive. Verified 2026-06-29 via Maven Central metadata: latest/release `4.0.0-beta0` lastUpdated 20260617081318; GitHub latest release remains `3.1.0` published 2026-06-12. Keep exact-version claims dated and source-specific."
---

## Reference answer (gospel)

Use the Lightsail Java SDK artifact `network.lightsail:stellar-sdk`, but verify the current version at answer time. On 2026-06-29, Maven Central metadata reported latest/release `4.0.0-beta0`, while GitHub's latest release tag was `3.1.0` published 2026-06-12 [1][2][3]. So a good Raven answer should cite the current release/Maven page and state whether it is recommending stable-tag usage or the newest beta metadata.

Fee-bumps are protocol-level Stellar transactions introduced in CAP-0015. They wrap an already signed inner transaction in an outer fee-bump envelope signed by the fee account; the fee account pays the fee, while sequence still comes from the inner source account [5]. The current Java source exposes `FeeBumpTransaction.createWithFee(feeSource, fee, innerTransaction)` and `createWithBaseFee(feeSource, baseFee, innerTransaction)` [4]. Do not invent a `buildFeeBumpTransaction` method unless the cited current SDK version has it.

Wallet construction is normal keypair/account construction: load a public account from Horizon/RPC, build and sign transactions with the user's keypair or signer flow, and keep production secret keys out of source code/logs. For production wallets, use proper custody/signing architecture rather than embedding seeds in a Java backend.

## Why these cards (routing rationale)

`stellar_docs_mcp` should fire for the protocol fee-bump semantics. `parallel_search` or repo/GitHub lookup is acceptable and expected for the current Java SDK version/API names because this is freshness-sensitive.

## Edge / traps

The traps are stale Maven coordinates, copying JS SDK builder names into Java, and ignoring that current source exposes static factory methods on `FeeBumpTransaction`. Another trap is showing hardcoded production secret keys as wallet guidance.
